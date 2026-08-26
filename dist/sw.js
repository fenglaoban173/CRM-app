// PWA Service Worker - 网络优先 HTML + 缓存优先静态资源
const CACHE_NAME = 'crm-app-v2'
const ASSET_CACHE = 'crm-app-assets-v2'
const ASSET_PREFIXES = ['/CRM-app/assets/', '/CRM-app/icon-', '/CRM-app/apple-touch-', '/CRM-app/logo.']

self.addEventListener('install', (event) => {
  // 仅预缓存 manifest 和离线兜底页
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['/CRM-app/manifest.webmanifest']).catch(() => {})
    )
  )
  // 立即接管，不需要等所有 client 关闭
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // 清理旧版本缓存
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![CACHE_NAME, ASSET_CACHE].includes(k)).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  // 跨域请求直接放行
  if (url.origin !== self.location.origin) return

  // 静态资源（带 hash 的 assets、图标）：缓存优先（hash 变了就是新文件）
  const isAsset = ASSET_PREFIXES.some((p) => url.pathname.startsWith(p)) ||
                  url.pathname === '/CRM-app/sw.js' ||
                  url.pathname === '/CRM-app/manifest.webmanifest'

  if (isAsset) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request)
        const fetchPromise = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone())
          }
          return response
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
    return
  }

  // HTML / 导航请求：网络优先，失败时用缓存兜底（保证看到最新版）
  if (event.request.mode === 'navigate' || url.pathname === '/CRM-app/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/CRM-app/')))
    )
    return
  }
})

// 监听 SW 更新：通知前端有新版本
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})