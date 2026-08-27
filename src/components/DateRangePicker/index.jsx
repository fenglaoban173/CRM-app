import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'

const TODAY = dayjs()

// 钉钉式日期区间选择器：chip 按钮 + 日历浮层（4 preset + 月份导航 + 7×6 网格 + 确定）
// 用法：<DateRangePicker value={{start, end}} onChange={({start, end}) => ...} />
// 样式对齐媒介日报 MediaDailyReportPage 的本地 DateRangePicker
//  - 未选时 chip 显示 "请选择"，日历内仅 4 preset（今日/昨日/近7日/近30日）
//  - value 为空时点击确定 → 全清空（适用于"不过滤日期"场景）
// 日历浮层通过 portal 渲染到 body，避免被父级 overflow-hidden 裁剪
export default function DateRangePicker({ value, onChange, label = '统计日期' }) {
  const [open, setOpen] = useState(false)
  const chipRef = useRef(null)
  const popRef = useRef(null)
  const [popStyle, setPopStyle] = useState({ top: 0, left: 0 })
  const [start, setStart] = useState(value.start)
  const [end, setEnd] = useState(value.end)
  // 空值时默认今天
  const safeStart = value.start || TODAY.format('YYYY-MM-DD')
  const safeEnd   = value.end   || TODAY.format('YYYY-MM-DD')
  const [cursorYear, setCursorYear] = useState(dayjs(safeStart).year())
  const [cursorMonth, setCursorMonth] = useState(dayjs(safeStart).month() + 1)

  // 点击外部关闭（chip + 浮层都排除）
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (chipRef.current && chipRef.current.contains(e.target)) return
      if (popRef.current && popRef.current.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  // 打开时根据 chip 位置设置浮层坐标 + 重置选择状态
  useEffect(() => {
    if (open && chipRef.current) {
      const rect = chipRef.current.getBoundingClientRect()
      setPopStyle({ top: rect.bottom + 4, left: rect.left })
      setStart(value.start); setEnd(value.end)
      setCursorYear(dayjs(safeStart).year())
      setCursorMonth(dayjs(safeStart).month() + 1)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // 显示：未选 → "请选择"；选了 → 同日显示日期，否则显示区间（对齐媒介日报）
  const isEmpty = !value.start
  const isSameDay = value.start && value.start === value.end
  const display = isEmpty ? '请选择' : isSameDay ? value.start : `${value.start.slice(5)} ~ ${value.end.slice(5)}`

  const handleDayClick = (dateStr) => {
    if (!start || (start && end)) { setStart(dateStr); setEnd('') }
    else if (dateStr < start)    { setStart(dateStr) }
    else                         { setEnd(dateStr) }
  }
  const handleApply = () => {
    if (start && end)      onChange({ start, end })
    else if (start)        onChange({ start, end: start })
    else                   onChange({ start: '', end: '' }) // 全空 = 不过滤日期
    setOpen(false)
  }

  const presets = [
    { label: '今日',   range: { start: TODAY.format('YYYY-MM-DD'),                     end: TODAY.format('YYYY-MM-DD') } },
    { label: '昨日',   range: { start: TODAY.subtract(1, 'day').format('YYYY-MM-DD'), end: TODAY.subtract(1, 'day').format('YYYY-MM-DD') } },
    { label: '近7日',  range: { start: TODAY.subtract(6, 'day').format('YYYY-MM-DD'), end: TODAY.format('YYYY-MM-DD') } },
    { label: '近30日', range: { start: TODAY.subtract(29, 'day').format('YYYY-MM-DD'),end: TODAY.format('YYYY-MM-DD') } },
  ]

  const daysInMonth = dayjs(`${cursorYear}-${String(cursorMonth).padStart(2, '0')}-01`).daysInMonth()
  const firstWeekday = dayjs(`${cursorYear}-${String(cursorMonth).padStart(2, '0')}-01`).day()
  const monthName = dayjs(`${cursorYear}-${String(cursorMonth).padStart(2, '0')}-01`).format('YYYY年M月')

  const shiftMonth = (delta) => {
    let nm = cursorMonth + delta, ny = cursorYear
    if (nm < 1) { nm = 12; ny-- }
    if (nm > 12) { nm = 1; ny++ }
    setCursorMonth(nm); setCursorYear(ny)
  }

  const isInRange = (d) => start && end && d >= start && d <= end
  const isStart   = (d) => d === start
  const isEnd     = (d) => d === end

  const popover = open && createPortal(
    <div ref={popRef}
      className="fixed z-[100] bg-white rounded-xl shadow-xl border border-ink-100 w-[280px] overflow-hidden"
      style={{ top: popStyle.top, left: popStyle.left }}>
      {/* Header — 当前区间（对齐媒介日报） */}
      <div className="px-3 py-2.5 border-b border-ink-100 bg-ink-50/50">
        <div className="flex items-center gap-1.5 text-[12px] tabular-nums">
          <span className={`h-7 px-2.5 rounded-md flex items-center ${start ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-400'}`}>
            {start || '开始日期'}
          </span>
          <span className="text-ink-400">至</span>
          <span className={`h-7 px-2.5 rounded-md flex items-center ${end ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-400'}`}>
            {end || '结束日期'}
          </span>
        </div>
      </div>
      {/* 预设 chips（仅 4 个，对齐媒介日报） */}
      <div className="px-3 py-2 border-b border-ink-100 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {presets.map(p => {
          const active = start === p.range.start && end === p.range.end
          return (
            <button key={p.label} type="button"
              onClick={() => { setStart(p.range.start); setEnd(p.range.end) }}
              className={`h-6 px-2.5 rounded-full text-[11px] tap whitespace-nowrap shrink-0 ${
                active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
              }`}>{p.label}</button>
          )
        })}
      </div>
      {/* 月份导航 */}
      <div className="flex items-center justify-between px-3 py-2">
        <button onClick={() => shiftMonth(-1)} className="w-7 h-7 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="上个月">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="text-[12px] font-medium text-ink-900 tabular-nums">{monthName}</span>
        <button onClick={() => shiftMonth(1)} className="w-7 h-7 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="下个月">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-1 px-3 text-center mb-1">
        {['日','一','二','三','四','五','六'].map(d => (
          <div key={d} className="text-[10px] text-ink-400 h-4 flex items-center justify-center">{d}</div>
        ))}
      </div>
      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1 px-3 pb-3">
        {Array.from({ length: firstWeekday }, (_, i) => <div key={'e'+i}/>)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const dateStr = `${cursorYear}-${String(cursorMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const inRange = isInRange(dateStr)
          const isEdge = isStart(dateStr) || isEnd(dateStr)
          return (
            <button key={d} onClick={() => handleDayClick(dateStr)}
              className={`h-7 rounded-md text-[11px] tap tabular-nums transition-colors ${
                isEdge   ? 'bg-brand text-white'
                : inRange ? 'bg-brand/15 text-brand'
                : 'bg-ink-50 text-ink-700 active:bg-ink-100'
              }`}>{d}</button>
          )
        })}
      </div>
      {/* 底部按钮：清空 + 确定（对齐媒介日报） */}
      <div className="flex border-t border-ink-100 px-3 py-2.5 bg-white gap-2">
        <button onClick={() => { setStart(''); setEnd('') }}
          className="flex-1 h-9 bg-white border border-ink-200 rounded-full text-[13px] text-ink-700 tap active:bg-ink-50">
          清空
        </button>
        <button onClick={handleApply} className="flex-[2] h-9 bg-brand text-white rounded-full text-[13px] tap active:opacity-90">
          确定
        </button>
      </div>
    </div>,
    document.body
  )

  return (
    <>
      <div className="shrink-0">
        <button ref={chipRef} onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] tap whitespace-nowrap ${
            isEmpty ? 'bg-ink-50 text-ink-400' : 'bg-ink-50 text-ink-700'
          }`}
          aria-label={`${label}区间`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="#4E5969" strokeWidth="1.6"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke="#4E5969" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span className="tabular-nums">{display}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {popover}
    </>
  )
}
