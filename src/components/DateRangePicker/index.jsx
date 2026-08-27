import { useState, useRef, useEffect } from 'react'
import dayjs from 'dayjs'

const TODAY = dayjs()

// 钉钉式日期区间选择器：chip 按钮 + 日历浮层（4 preset + 月份导航 + 7×6 网格 + 确定）
// 用法：<DateRangePicker value={{start, end}} onChange={({start,end}) => ...} />
export default function DateRangePicker({ value, onChange, label = '统计日期' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const [start, setStart] = useState(value.start)
  const [end, setEnd] = useState(value.end)
  // 空值时默认今天
  const safeStart = value.start || TODAY.format('YYYY-MM-DD')
  const safeEnd   = value.end   || TODAY.format('YYYY-MM-DD')
  const [cursorYear, setCursorYear] = useState(dayjs(safeStart).year())
  const [cursorMonth, setCursorMonth] = useState(dayjs(safeStart).month() + 1)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  useEffect(() => {
    if (open) {
      setStart(value.start); setEnd(value.end)
      setCursorYear(dayjs(safeStart).year())
      setCursorMonth(dayjs(safeStart).month() + 1)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // 显示：未选 → "不限"；选了 → 同日显示日期，否则显示区间
  const isEmpty = !value.start
  const isSameDay = value.start === value.end
  const display = isEmpty ? '不限' : isSameDay ? value.start : `${value.start.slice(5)} ~ ${value.end.slice(5)}`

  const handleDayClick = (dateStr) => {
    if (!start || (start && end)) { setStart(dateStr); setEnd('') }
    else if (dateStr < start)    { setStart(dateStr) }
    else                         { setEnd(dateStr) }
  }
  const handleApply = () => {
    if (start && end) onChange({ start, end })
    else if (start)  onChange({ start, end: start })
    else             onChange({ start: '', end: '' }) // 全清空 = 不限
    setOpen(false)
  }
  // 钉钉式：第 1 个 chip = 不限（清空选择，回到"不限"状态）
  const handleClear = () => { setStart(''); setEnd('') }

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

  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 tap whitespace-nowrap"
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
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-ink-100 w-[280px] overflow-hidden">
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
          <div className="px-3 py-2 border-b border-ink-100 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <button type="button"
              onClick={handleClear}
              className={`h-6 px-2.5 rounded-full text-[11px] tap whitespace-nowrap shrink-0 ${
                !start && !end ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
              }`}>不限</button>
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
          <div className="flex items-center justify-between px-3 py-2">
            <button onClick={() => shiftMonth(-1)} className="w-7 h-7 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="上个月">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="text-[12px] font-medium text-ink-900 tabular-nums">{monthName}</span>
            <button onClick={() => shiftMonth(1)} className="w-7 h-7 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="下个月">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 px-3 text-center mb-1">
            {['日','一','二','三','四','五','六'].map(d => (
              <div key={d} className="text-[10px] text-ink-400 h-4 flex items-center justify-center">{d}</div>
            ))}
          </div>
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
          <div className="flex border-t border-ink-100 px-3 py-2.5 bg-white">
            <button onClick={handleApply} className="w-full h-9 bg-brand text-white rounded-full text-[13px] tap active:opacity-90">确定</button>
          </div>
        </div>
      )}
    </div>
  )
}