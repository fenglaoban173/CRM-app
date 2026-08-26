import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

// 注册 PWA Service Worker + 自动检测新版
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/CRM-app/sw.js').then((reg) => {
      // 首次注册成功后，每 60 秒主动检查一次更新（避免只在浏览器刷新时才更新）
      setInterval(() => reg.update().catch(() => {}), 60_000)

      // 监听 SW 找到新版本
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          // 新 SW 已安装且接管 → 弹"有新版本"提示
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            showUpdateToast(() => {
              // 用户点确认 → 通知新 SW 立即接管，然后刷新页面
              newWorker.postMessage({ type: 'SKIP_WAITING' })
              window.location.reload()
            })
          }
        })
      })
    }).catch((err) => {
      console.warn('SW 注册失败:', err)
    })

    // 当新的 SW 接管控制权后，刷新页面以使用新资源
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })
  })
}

// "有新版本"提示 toast（纯 DOM，避开 React 树）
function showUpdateToast(onConfirm) {
  if (document.getElementById('sw-update-toast')) return
  const el = document.createElement('div')
  el.id = 'sw-update-toast'
  el.style.cssText = 'position:fixed;left:16px;right:16px;bottom:24px;z-index:9999;background:#2D7FF9;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:space-between;font-size:14px;'
  el.innerHTML = '<span>有新版本可用</span>'
  const btn = document.createElement('button')
  btn.textContent = '立即刷新'
  btn.style.cssText = 'background:#fff;color:#2D7FF9;border:none;padding:6px 14px;border-radius:6px;font-weight:600;cursor:pointer;margin-left:12px;'
  btn.onclick = () => { el.remove(); onConfirm() }
  el.appendChild(btn)
  document.body.appendChild(el)
}
