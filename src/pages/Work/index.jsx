import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useRef, useEffect } from 'react'
import FeatureIcon from '../../components/FeatureIcon'
import { TopBar } from '../Reports'
import { findNode } from '../../data/mock'

// 5 个一级模块（来自 caidan.json pid=0）
const MODULES = [
  { id: 98,   label: '业务管理',     color: 'blue' },
  { id: 397,  label: '财务中心',     color: 'orange' },
  { id: 2392, label: '运营中心',     color: 'orange' },
  { id: 2397, label: '财务数据看板', color: 'purple' },
  { id: 2408, label: '媒介数据看板', color: 'purple' },
]

// 快速入口（App 端独有，点击跳到对应业务页面进行新建/申请）
const QUICK_TOOLS = [
  { label: '新建项目',     target: 2277, color: 'blue',   icon: '项目管理' },
  { label: '开户',         target: 1562, color: 'orange', icon: '开户' },
  { label: '录入广告主ID', target: 1563, color: 'blue',   icon: '主体管理' },
  { label: '新建直播政策', target: 2756, color: 'orange', icon: '直播' },
  { label: '新建素材采买', target: 2757, color: 'purple', icon: '素材' },
]

export default function Work() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="bg-ink-50 pb-4">
      <TopBar title="工作台"/>

      {/* 搜索栏 */}
      <SearchBar onActiveChange={setSearchOpen}/>

      {/* 搜索结果浮层打开时，加一层遮罩拦截下面卡片的点击 */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 88px)' }}
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* 快速入口（无全部按钮）*/}
      <QuickSection/>

      {/* 业务管理：前 6 个二级菜单 + 全部 icon */}
      <ModuleSection moduleId={98} label="业务管理" color="blue"/>

      {/* 财务中心 - 暂时隐藏 */}
      {false && <ModuleSection moduleId={397} label="财务中心" color="orange"/>}

      {/* 运营中心 */}
      <ModuleSection moduleId={2392} label="运营中心" color="orange"/>

      {/* 财务数据看板 */}
      <ModuleSection moduleId={2397} label="财务数据看板" color="purple"/>

      {/* 媒介数据看板 */}
      <ModuleSection moduleId={2408} label="媒介数据看板" color="purple"/>
    </div>
  )
}

// ============ 搜索栏（顶部，支持模糊搜索应用名称）============
function SearchBar({ onActiveChange }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(false)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { onActiveChange?.(active && q.trim().length > 0) }, [active, q, onActiveChange])

  // 构建扁平搜索索引（快速入口 + 各模块所有子菜单）
  const allApps = useMemo(() => {
    const list = []
    QUICK_TOOLS.forEach(t => {
      list.push({
        id: `quick-${t.target}`,
        label: t.label,
        icon: t.icon,
        color: t.color,
        section: '快速入口',
        target: t.target,
      })
    })
    // 递归遍历模块所有后代（包含二级、三级菜单）
    const walk = (node, section, fallbackColor) => {
      ;(node?.children || []).forEach(c => {
        list.push({
          id: c.id,
          label: c.label,
          icon: c.label,
          color: c.color || fallbackColor,
          section,
          target: c.id,
        })
        walk(c, section, fallbackColor) // 继续往下找
      })
    }
    MODULES.forEach(m => {
      const parent = findNode(m.id)
      walk(parent, m.label, m.color)
    })
    return list
  }, [])

  // 模糊匹配（子串匹配 + 大小写不敏感）
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return []
    return allApps.filter(a => a.label.toLowerCase().includes(kw))
  }, [q, allApps])

  // 分组（保留原排序：快速入口 → 业务管理 → 运营中心 → 财务数据看板 → 媒介数据看板）
  const grouped = useMemo(() => {
    const order = ['快速入口', '业务管理', '运营中心', '财务数据看板', '媒介数据看板']
    const map = {}
    results.forEach(r => { (map[r.section] = map[r.section] || []).push(r) })
    return order.filter(k => map[k]?.length).map(k => ({ section: k, items: map[k] }))
  }, [results])

  // 点击外部关闭
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setActive(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const nav = useNavigate()
  const go = (app) => {
    nav(`/m/${app.target}?from=work`)
    setQ('')
    setActive(false)
    inputRef.current?.blur()
  }

  const clear = () => {
    setQ('')
    inputRef.current?.focus()
  }

  const showResults = active && q.trim().length > 0

  return (
    <div ref={wrapRef} className="relative px-3 py-3 bg-white" style={{ zIndex: 25 }}>
      <div className={`flex items-center h-9 px-4 rounded-full text-[13px] transition-colors ${
        active ? 'bg-white border border-brand/40' : 'bg-ink-100 border border-transparent'
      }`}>
        <SearchIcon active={active}/>
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => setActive(true)}
          placeholder="搜索应用名称"
          className="flex-1 appearance-none bg-transparent border-0 outline-none text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
        />
        {q && (
          <button type="button" onClick={clear} className="tap p-0.5 -mr-1 shrink-0 text-ink-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#D1D5DB"/>
              <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果浮层 */}
      {showResults && (
        <div className="absolute left-3 right-3 top-[52px] z-30 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-ink-100 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <svg className="mx-auto mb-2" width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#D1D5DB" strokeWidth="1.6"/>
                <path d="M16 16l4 4" stroke="#D1D5DB" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <div className="text-[13px] text-ink-400">没有匹配的应用</div>
              <div className="text-[11px] text-ink-300 mt-1">试试其他关键词</div>
            </div>
          ) : (
            grouped.map(g => (
              <div key={g.section}>
                <div className="px-4 pt-3 pb-1 text-[11px] text-ink-400">{g.section}</div>
                {g.items.map(r => (
                  <button
                    key={r.id}
                    onClick={() => go(r)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 tap text-left active:bg-ink-50"
                  >
                    <FeatureIcon name={r.icon} color={r.color} size={32}/>
                    <Highlight text={r.label} query={q.trim()}/>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-auto shrink-0">
                      <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
                <div className="h-2"/>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ============ 高亮匹配关键字 ============
function Highlight({ text, query }) {
  const spanRef = useRef(null)
  if (!query) return <span className="flex-1 text-[13px] text-ink-900">{text}</span>
  const k = query.toLowerCase()
  const lower = text.toLowerCase()
  const idx = lower.indexOf(k)
  if (idx === -1) return <span className="flex-1 text-[13px] text-ink-900">{text}</span>
  return (
    <span ref={spanRef} className="flex-1 text-[13px] text-ink-900 truncate">
      {text.slice(0, idx)}
      <span className="text-brand font-medium">{text.slice(idx, idx + k.length)}</span>
      {text.slice(idx + k.length)}
    </span>
  )
}

function SearchIcon({ active }) {
  const color = active ? '#2D7FF9' : '#999'
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2 shrink-0">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2"/>
      <path d="M16 16l4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ============ 快速入口：无全部按钮 ============
function QuickSection() {
  const nav = useNavigate()
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title">
        <span>快速入口</span>
      </div>
      <div className="grid grid-cols-4 gap-y-3 px-2 pb-3">
        {QUICK_TOOLS.map(t => (
          <button
            key={t.label}
            onClick={() => nav(`/m/${t.target}?from=work`)}
            className="flex flex-col items-center gap-1.5 tap"
          >
            <FeatureIcon name={t.icon} color={t.color} size={42}/>
            <span className="text-[11px] text-ink-900 text-center leading-tight px-1">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============ 模块区块：标题 + 前 6 子菜单 + 全部 icon ============
function ModuleSection({ moduleId, label, color }) {
  const nav = useNavigate()
  const parent = findNode(moduleId)
  const children = parent?.children || []
  const display = children.slice(0, 6)
  const total = children.length

  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title">
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-y-3 px-2 pb-3">
        {display.map(c => (
          <button
            key={c.id}
            onClick={() => nav(`/m/${c.id}`)}
            className="flex flex-col items-center gap-1.5 tap"
          >
            <FeatureIcon name={c.label} color={c.color || color} size={42}/>
            <span className="text-[11px] text-ink-900 text-center leading-tight px-1">{c.label}</span>
          </button>
        ))}

        {/* 全部按钮（icon 形式，紧跟最后一个菜单）*/}
        {total >= 1 && (
          <button
            onClick={() => nav(`/m/${moduleId}`)}
            className="flex flex-col items-center gap-1.5 tap"
          >
            <AllIcon color={color}/>
            <span className="text-[11px] text-ink-500">全部</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ============ 全部按钮图标 ============
function AllIcon({ color = 'blue' }) {
  const map = { blue:'#EBF3FF',green:'#E8F8EA',orange:'#FFF3E5',red:'#FFE9E9',purple:'#F0E9FF',gray:'#F0F2F5' }
  const fg = { blue:'#2D7FF9',green:'#34A853',orange:'#FF9A3C',red:'#FF5A5A',purple:'#9B7FF5',gray:'#86909C' }
  return (
    <div
      className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center"
      style={{ background: '#F2F3F5' }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3"  y="3"  width="7" height="7" rx="1.5" stroke={fg[color] || fg.blue} strokeWidth="1.6"/>
        <rect x="14" y="3"  width="7" height="7" rx="1.5" stroke={fg[color] || fg.blue} strokeWidth="1.6"/>
        <rect x="3"  y="14" width="7" height="7" rx="1.5" stroke={fg[color] || fg.blue} strokeWidth="1.6"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={fg[color] || fg.blue} strokeWidth="1.6"/>
      </svg>
    </div>
  )
}