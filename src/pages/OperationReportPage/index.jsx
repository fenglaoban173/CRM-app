import { useState, useMemo, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Legend,
} from 'recharts'
import { operationReportData, monthlyReportDetailData } from '../../data/mock'
import DateRangePicker from '../../components/DateRangePicker'

dayjs.extend(weekOfYear)

// ============ 常量 ============
const BORDER_COLOR = {
  blue:   '#2D7FF9', green: '#34A853', red:    '#FF5A5A',
  purple: '#9B7FF5', orange:'#FF9A3C', pink:   '#FF7AB6', cyan:'#22C7E5', gray:'#9CA3AF',
}
const BORDER_KEYS = ['blue', 'purple', 'orange', 'cyan', 'pink', 'green', 'red', 'purple', 'orange']

const DELTA_COLOR = {
  positive: { fg: '#34A853', arrow: '↑' },
  negative: { fg: '#FF5A5A', arrow: '↓' },
  neutral:  { fg: '#9CA3AF', arrow: '—' },
}

const PERIOD_MAP = {
  operationDaily:     'daily',
  operationWeekly:    'weekly',
  operationMonthly:   'monthly',
  operationQuarterly: 'quarterly',
}

const PERIOD_LABEL = {
  daily:     '日期',
  weekly:    '周',
  monthly:   '月份',
  quarterly: '季度',
}

const COMPARE_OPTIONS = ['全部', '环比为0']

const TAB_OPTIONS = [
  { key: 'operator', label: '运营' },
  { key: 'dept',     label: '部门' },
]

const PAGE_SIZE = 8

const DIM_LABEL = {
  operator: '运营明细',
  dept:     '部门明细',
}

const PIE_COLORS = ['#2D7FF9', '#FAAD14', '#F5222D']

// ============ group-title ============
function GroupTitle({ children, right }) {
  return (
    <div className="group-title">
      <span className="group-title-bar"/>
      <span className="text-[13px] text-ink-700 font-medium">{children}</span>
      {right && <span className="ml-auto text-[11px] text-ink-400">{right}</span>}
    </div>
  )
}

// ============ 月份 picker（对应运营月报）============
function MonthYearPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const valueDay = dayjs(value + '-01')
  const [year, setYear] = useState(valueDay.year())
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  useEffect(() => { if (!open) setYear(valueDay.year()) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleSelect = (m) => {
    onChange(`${year}-${String(m).padStart(2, '0')}`)
    setOpen(false)
  }
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 tap whitespace-nowrap"
        aria-label="选择月份">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="#4E5969" strokeWidth="1.6"/>
          <path d="M3 9h18M8 3v4M16 3v4" stroke="#4E5969" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span className="tabular-nums">{value}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-ink-100 p-3 w-[268px]">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYear(year - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="上一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[14px] font-medium text-ink-900 tabular-nums">{year}年</span>
            <button onClick={() => setYear(year + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="下一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
              const active = valueDay.year() === year && (valueDay.month() + 1) === m
              return (
                <button key={m} onClick={() => handleSelect(m)}
                  className={`h-8 rounded-lg text-[12px] tap tabular-nums ${
                    active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
                  }`}>{m}月</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 周 picker（对应运营周报）============
function WeekYearPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const m = /^(.*)-W(\d{1,2})$/.exec(value || '')
  const valueYear = m ? Number(m[1]) : dayjs().year()
  const valueW = m ? Number(m[2]) : 1
  const [year, setYear] = useState(valueYear)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  useEffect(() => { if (!open) setYear(valueYear) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleSelect = (w) => {
    onChange(`${year}-W${String(w).padStart(2, '0')}`)
    setOpen(false)
  }
  const totalWeeks = dayjs(`${year}-12-28`).week() === 53 ? 53 : 52
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 tap whitespace-nowrap"
        aria-label="选择周">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="#4E5969" strokeWidth="1.6"/>
          <path d="M3 9h18M8 3v4M16 3v4" stroke="#4E5969" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span className="tabular-nums">{value}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-ink-100 p-3 w-[268px] max-h-[320px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYear(year - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="上一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[14px] font-medium text-ink-900 tabular-nums">{year}年</span>
            <button onClick={() => setYear(year + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="下一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(w => {
              const active = valueYear === year && valueW === w
              return (
                <button key={w} onClick={() => handleSelect(w)}
                  className={`h-8 rounded-lg text-[12px] tap tabular-nums ${
                    active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
                  }`}>W{w}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 季度 picker（对应运营季报）============
function QuarterYearPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const m = /^(.*)-Q([1-4])$/.exec(value || '')
  const valueYear = m ? Number(m[1]) : dayjs().year()
  const valueQ = m ? Number(m[2]) : 1
  const [year, setYear] = useState(valueYear)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  useEffect(() => { if (!open) setYear(valueYear) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleSelect = (q) => {
    onChange(`${year}-Q${q}`)
    setOpen(false)
  }
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 tap whitespace-nowrap"
        aria-label="选择季度">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="#4E5969" strokeWidth="1.6"/>
          <path d="M3 9h18M8 3v4M16 3v4" stroke="#4E5969" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span className="tabular-nums">{value}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-ink-100 p-3 w-[268px]">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setYear(year - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="上一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[14px] font-medium text-ink-900 tabular-nums">{year}年</span>
            <button onClick={() => setYear(year + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50" aria-label="下一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { q: 1, label: 'Q1 · 1-3月' },
              { q: 2, label: 'Q2 · 4-6月' },
              { q: 3, label: 'Q3 · 7-9月' },
              { q: 4, label: 'Q4 · 10-12月' },
            ].map(({ q, label }) => {
              const active = valueYear === year && valueQ === q
              return (
                <button key={q} onClick={() => handleSelect(q)}
                  className={`h-9 rounded-lg text-[12px] tap tabular-nums ${
                    active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
                  }`}>{label}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 行 1：周期 chip + 漏斗 ============
function PeriodRow({ periodKind, periodLabel, period, onPeriodChange, activeCount, onFunnel, onExport }) {
  const renderPicker = () => {
    if (periodKind === 'daily') {
      return <DateRangePicker value={typeof period === 'string' && period.includes('~') ? { start: period.split('~')[0].trim(), end: period.split('~')[1].trim() } : { start: '', end: '' }} onChange={({ start, end }) => onPeriodChange(start && end ? `${start}~${end}` : start || '')}/>
    } else if (periodKind === 'weekly') {
      return <WeekYearPicker value={period} onChange={onPeriodChange}/>
    } else if (periodKind === 'monthly') {
      return <MonthYearPicker value={period} onChange={onPeriodChange}/>
    } else if (periodKind === 'quarterly') {
      return <QuarterYearPicker value={period} onChange={onPeriodChange}/>
    }
    return <span className="h-8 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 font-mono flex items-center shrink-0">{period}</span>
  }
  return (
    <div className="mx-2 mt-2 card">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="text-[12px] text-ink-500 shrink-0">统计{periodLabel}:</span>
        {renderPicker()}
        <button onClick={onFunnel}
          className="ml-auto w-8 h-8 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0"
          aria-label="更多筛选">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#4E5969" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeCount}</span>
          )}
        </button>
        <button onClick={onExport}
          className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 shrink-0"
          aria-label="导出">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>
    </div>
  )
}

// ============ Tab 行 ============
function TabRow({ tab, setTab }) {
  return (
    <div className="mx-3 mt-3 flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {TAB_OPTIONS.map(o => {
        const active = tab === o.key
        return (
          <button key={o.key} onClick={() => setTab(o.key)}
            className={`h-8 px-4 rounded-full text-[12px] tap whitespace-nowrap shrink-0 ${
              active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
            }`}>{o.label}</button>
        )
      })}
    </div>
  )
}

// ============ 9 媒体消耗概览卡（横滑 150px）============
function StatCardsRow({ kpis, activeCard, onCardClick }) {
  return (
    <div className="mx-3 mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {kpis.map((it, i) => {
        const tone = BORDER_KEYS[i % BORDER_KEYS.length]
        const dc = it.qoq > 0 ? DELTA_COLOR.positive : it.qoq < 0 ? DELTA_COLOR.negative : DELTA_COLOR.neutral
        const isActive = activeCard === it.key
        return (
          <div key={it.key} onClick={() => onCardClick(isActive ? null : it.key)}
            className={`shrink-0 w-[150px] bg-white rounded-md border relative overflow-hidden tap cursor-pointer transition-colors ${
              isActive ? 'border-brand ring-2 ring-brand/30' : 'border-ink-100'
            }`}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: BORDER_COLOR[tone] }}/>
            <div className="pl-3 pr-2.5 py-2.5">
              <div className="text-[12px] text-ink-500 truncate">{it.name}</div>
              <div className="text-[18px] font-semibold text-ink-900 mt-0.5 whitespace-nowrap tabular-nums">
                {it.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px]">
                <span className="text-[11px] leading-none" style={{ color: dc.fg }}>{dc.arrow}</span>
                <span className="truncate" style={{ color: dc.fg }}>
                  较上期 {it.qoq > 0 ? '+' : ''}{it.qoq.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============ 二代/非二代/其他 饼图 ============
function PieSection({ pie, selectedLabel }) {
  const total = pie.reduce((s, x) => s + x.value, 0)
  const [activeSlice, setActiveSlice] = useState(null)
  const focused = pie.find(p => p.name === activeSlice)
  const rightText = focused
    ? `已选：${focused.name} ${focused.value.toFixed(2)}% (${total > 0 ? ((focused.value / total) * 100).toFixed(1) : '0.0'}%)`
    : selectedLabel ? `已选：${selectedLabel}` : `总 ${total.toFixed(2)}%`

  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
        <GroupTitle right={rightText}>二代/非二代占比</GroupTitle>
      </div>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-[140px] h-[140px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pie}
                cx="50%" cy="50%"
                innerRadius={42}
                outerRadius={activeSlice ? 68 : 62}
                dataKey="value"
                paddingAngle={2}
                startAngle={90} endAngle={-270}
                onClick={(d) => setActiveSlice(prev => prev === d.name ? null : d.name)}
                style={{ cursor: 'pointer' }}
              >
                {pie.map((p, i) => {
                  const isActive = activeSlice === p.name
                  const isDim = activeSlice && !isActive
                  return (
                    <Cell
                      key={p.name}
                      fill={PIE_COLORS[i] || PIE_COLORS[0]}
                      fillOpacity={isDim ? 0.3 : 1}
                      stroke={isActive ? '#fff' : 'none'}
                      strokeWidth={isActive ? 2 : 0}
                    />
                  )
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[10px] text-ink-400">{focused ? focused.name : '总占比'}</div>
            <div className="text-[14px] font-semibold text-ink-900 tabular-nums">
              {focused ? focused.value.toFixed(2) : total.toFixed(2)}%
            </div>
            {focused && (
              <div className="text-[10px] text-ink-400 tabular-nums">
                {total > 0 ? ((focused.value / total) * 100).toFixed(1) : '0.0'}%
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {pie.map((p, i) => {
            const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0.0'
            const isActive = activeSlice === p.name
            return (
              <button key={p.name} type="button"
                onClick={() => setActiveSlice(prev => prev === p.name ? null : p.name)}
                className={`w-full flex items-center gap-2 text-[12px] px-1 py-0.5 rounded tap ${
                  isActive ? 'bg-brand/10' : 'active:bg-ink-50'
                }`}>
                <span className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                  isActive ? 'scale-125 ring-2 ring-offset-1' : ''
                }`}
                  style={{
                    background: PIE_COLORS[i] || PIE_COLORS[0],
                    boxShadow: isActive ? `0 0 0 2px ${(PIE_COLORS[i] || PIE_COLORS[0])}40` : 'none',
                  }}/>
                <span className={`truncate flex-1 text-left ${isActive ? 'text-brand font-medium' : 'text-ink-700'}`}>{p.name}</span>
                <span className={`tabular-nums shrink-0 ${isActive ? 'text-brand font-semibold' : 'text-ink-900 font-semibold'}`}>{p.value.toFixed(2)}%</span>
                <span className="text-ink-400 tabular-nums shrink-0">{pct}%</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ 消耗总额 柱状图（带平均值参考线）============
function BarSection({ trend, avg, periodKey }) {
  // X 轴标签格式：按周期使用 date 字段
  const chartWidth = Math.max(320, trend.length * 30)
  const scrollRef = useRef(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth })
  }, [trend.length])

  const title = periodKey === 'daily' ? '消耗总额（按日）'
    : periodKey === 'weekly' ? '消耗总额（按周）'
    : periodKey === 'monthly' ? '消耗总额（按月）'
    : '消耗总额（按周）'

  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
        <GroupTitle right={`日均 ${avg.toFixed(2)} 万`}>{title}</GroupTitle>
        <span className="text-[10px] text-ink-400 ml-2">左右滑动</span>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div style={{ width: chartWidth, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trend} margin={{ top: 6, right: 12, bottom: 0, left: -20 }} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false}/>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                <Tooltip
                  cursor={{ fill: 'rgba(45,127,249,0.08)' }}
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E5E7EB' }}
                  labelStyle={{ color: '#4E5969' }}
                  formatter={(v) => [`${Number(v).toFixed(2)} 万`, '消耗']}
                />
                <Bar dataKey="value" fill="#2D7FF9" radius={[2, 2, 0, 0]} maxBarSize={30}>
                  <LabelList dataKey="value" position="insideTop" fill="#fff" fontSize={9}
                    formatter={(v) => v > 0 ? Number(v).toFixed(2) : ''}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-7 pointer-events-none bg-gradient-to-l from-white via-white/70 to-transparent"/>
      </div>
    </div>
  )
}

// ============ 行业 Top10 三媒体堆叠柱状图（季报）============
function IndustryStackChart({ industryStack }) {
  const [activeMedia, setActiveMedia] = useState(null)
  if (!industryStack || industryStack.length === 0) return null
  const COLORS = { '头条-AD': '#FF9A3C', '头条-本地推': '#34A853', '头条-千川': '#2D7FF9' }
  const MEDIA_KEYS = ['头条-AD', '头条-本地推', '头条-千川']
  const focusedTotal = activeMedia
    ? industryStack.reduce((s, r) => s + (r[activeMedia] || 0), 0)
    : industryStack.reduce((s, r) => s + MEDIA_KEYS.reduce((m, k) => m + (r[k] || 0), 0), 0)
  const focusedAvg = focusedTotal / industryStack.length
  const rightText = activeMedia
    ? `已选：${activeMedia}　总计：${focusedTotal.toFixed(2)} 万　平均：${focusedAvg.toFixed(2)} 万`
    : `总计：${focusedTotal.toFixed(2)} 万　平均：${focusedAvg.toFixed(2)} 万`
  const handleLegendClick = (key) => setActiveMedia(prev => prev === key ? null : key)

  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
        <GroupTitle right={rightText}>消耗总额（行业维度：头条Top10）</GroupTitle>
      </div>
      <div className="px-2 pt-2 pb-3">
        <div className="flex items-center justify-center gap-4 text-[11px] mb-1">
          {MEDIA_KEYS.map(k => {
            const isActive = activeMedia === k
            const isDim    = activeMedia && !isActive
            return (
              <button key={k} type="button" onClick={() => handleLegendClick(k)}
                className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded tap transition-colors ${
                  isActive ? 'bg-brand/10' : 'active:bg-ink-50'
                }`}>
                <span className={`w-2.5 h-2.5 rounded-sm transition-all ${
                  isActive ? 'scale-125 ring-2 ring-offset-1' : ''
                }`}
                  style={{
                    background: COLORS[k],
                    boxShadow: isActive ? `0 0 0 2px ${COLORS[k]}40` : 'none',
                  }}/>
                <span className={`${isActive ? 'text-brand font-medium' : isDim ? 'text-ink-400' : 'text-ink-700'}`}>{k}</span>
              </button>
            )
          })}
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <div style={{ width: Math.max(380, industryStack.length * 60), height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryStack} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false}/>
                <XAxis dataKey="industry" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                  interval={0} angle={-30} textAnchor="end" height={50}/>
                <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}/>
                <Tooltip
                  cursor={{ fill: 'rgba(45,127,249,0.06)' }}
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E5E7EB' }}
                  labelStyle={{ color: '#4E5969' }}
                  formatter={(v, name) => [`${Number(v).toFixed(2)} 万`, name]}
                />
                {MEDIA_KEYS.map((k, i) => {
                  const isActive = activeMedia === k
                  const isDim    = activeMedia && !isActive
                  return (
                    <Bar key={k} dataKey={k} stackId="a" fill={COLORS[k]}
                      fillOpacity={isDim ? 0.25 : 1}
                      radius={i === MEDIA_KEYS.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
                      maxBarSize={32}
                      onClick={() => handleLegendClick(k)}
                      style={{ cursor: 'pointer' }}>
                      <LabelList dataKey={k} position="insideTop" fill="#fff" fontSize={9}
                        formatter={(v) => v > 0 ? Number(v).toFixed(2) : ''}/>
                    </Bar>
                  )
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 环比筛选 ============
function CompareRow({ value, onChange, nonGiftText }) {
  return (
    <div className="mx-3 mt-3 flex items-center gap-2">
      <span className="text-[13px] text-ink-700 font-medium shrink-0">环比筛选</span>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {COMPARE_OPTIONS.map(opt => {
          const active = value === opt
          return (
            <button key={opt} onClick={() => onChange(opt)}
              className={`h-7 px-3 rounded-full text-[12px] tap whitespace-nowrap shrink-0 ${
                active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
              }`}>{opt}</button>
          )
        })}
      </div>
      {nonGiftText && (
        <span className="ml-auto text-[12px] text-ink-700 whitespace-nowrap shrink-0 tabular-nums">{nonGiftText}</span>
      )}
    </div>
  )
}

// ============ 二级排名卡（点击 → 打开 Sheet）============
function RankingCard({ items, onItemClick }) {
  if (items.length === 0) {
    return <div className="mx-3 mt-2 py-8 text-center text-ink-400 text-[13px] card">暂无数据</div>
  }
  return (
    <div className="mx-3 mt-2 space-y-2">
      {items.map((r, i) => (
        <button key={`${r.name}-${i}`} type="button"
          onClick={() => onItemClick(r)}
          className="w-full text-left card active:bg-ink-50">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-ink-900 truncate">{r.name}</div>
              <div className="mt-0.5 text-[11px] text-ink-400 tabular-nums">
                环比 {r.qoq > 0 ? '+' : ''}{r.qoq.toFixed(2)}%
              </div>
            </div>
            <div className="text-right shrink-0 flex items-center gap-2">
              <div>
                <div className="text-[15px] font-semibold text-brand tabular-nums">
                  {r.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-ink-400">万</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ink-300">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ============ 标准 Pagination ============
function Pagination({ total, page, totalPages, pageSize = PAGE_SIZE, setPage }) {
  const [jumpVal, setJumpVal] = useState('')
  const visible = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [page - 2, page - 1, page, page + 1, page + 2]
  }, [page, totalPages])
  const go = (p) => setPage(Math.max(1, Math.min(totalPages, p)))
  return (
    <div className="mx-3 mt-3 pb-2">
      <div className="flex items-center justify-center gap-1.5">
        <button onClick={() => go(page - 1)} disabled={page <= 1}
          className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
          aria-label="上一页">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {visible[0] > 1 && (
          <>
            <button onClick={() => go(1)} className="w-8 h-8 rounded-full bg-white border border-ink-200 text-[12px] text-ink-700 tap">1</button>
            {visible[0] > 2 && <span className="text-ink-400 px-1">…</span>}
          </>
        )}
        {visible.map(n => (
          <button key={n} onClick={() => go(n)}
            className={`w-8 h-8 rounded-full text-[12px] tap ${n === page ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>{n}</button>
        ))}
        {visible[visible.length - 1] < totalPages && (
          <>
            {visible[visible.length - 1] < totalPages - 1 && <span className="text-ink-400 px-1">…</span>}
            <button onClick={() => go(totalPages)} className="w-8 h-8 rounded-full bg-white border border-ink-200 text-[12px] text-ink-700 tap">{totalPages}</button>
          </>
        )}
        <button onClick={() => go(page + 1)} disabled={page >= totalPages}
          className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
          aria-label="下一页">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <span>{pageSize}条/页</span>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
        <span className="text-ink-300">|</span>
        <span>前往</span>
        <input value={jumpVal} onChange={e => setJumpVal(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => { if (e.key === 'Enter' && jumpVal) { go(Number(jumpVal)); setJumpVal('') } }}
          placeholder={String(page)}
          className="w-8 h-6 border border-ink-200 rounded text-center text-[11px] focus:outline-none focus:border-brand"/>
        <span>页</span>
      </div>
    </div>
  )
}

// ============ Toast ============
function Toast({ message }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )
}

// ============ 高级筛选 Sheet ============
function AdvancedFilter({ values, setValues, onReset, onClose }) {
  const fields = [
    { key: 'platform',    label: '媒体平台', kind: 'select', options: ['头条-AD', '磁力金牛', '千川', 'TikTok', '腾讯广告', '聚光', '小红书', '微博'] },
    { key: 'department',  label: '部门',     kind: 'input' },
    { key: 'cooperation', label: '合作模式', kind: 'select', options: ['代理', '直营', '代运营'] },
    { key: 'payment',     label: '付款方式', kind: 'select', options: ['预付', '后付', '月结'] },
    { key: 'group',       label: '集团',     kind: 'input' },
  ]
  const [active, setActive] = useState('platform')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap" aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto scrollbar-hide">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>{f.label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onReset}
            className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap active:bg-ink-50">重 置</button>
          <button onClick={onClose}
            className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap active:opacity-90">确 认</button>
        </div>
      </div>
    </div>
  )
}

// ============ 详情 Sheet（全屏 — 点击二级卡打开）============
function RankDetailSheet({ item, dim, mediaKey, onClose, showToast }) {
  const detail = monthlyReportDetailData[dim] || {}
  const allSubs = detail.subs
  // 兼容两种 subs 结构：object map（operator）或 array（dept）
  let subsForMedia = []
  if (Array.isArray(allSubs)) {
    // dept 维度：直接是数组（默认全部用）
    subsForMedia = allSubs
  } else if (allSubs && typeof allSubs === 'object') {
    subsForMedia = (allSubs[mediaKey] && allSubs[mediaKey].length > 0)
      ? allSubs[mediaKey]
      : (allSubs.total || [])
  }
  const [activeSubIdx, setActiveSubIdx] = useState(0)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  // 选中运营/部门 在当前媒体下的二级列表总消耗
  const groupTotalAmount = subsForMedia.reduce((s, x) => s + (Number(x.nonGift) || 0), 0)
  // 当前选中二级
  const currentSub = subsForMedia[activeSubIdx] || null
  // 明细行：每个二级都有自己的 rows（monthlyReportDetailData 仅 operator/dept 顶层 rows，故共享全部）
  const allRows = detail.rows || []
  const rows = allRows  // 当前版本：所有 rows 共享（按二级筛选需要 mock 扩展）

  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      {/* TopBar */}
      <div className="sticky top-0 z-10 bg-brand text-white h-12 flex items-center px-2 shadow-sm">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center -ml-1" aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="flex-1 text-[15px] font-medium truncate mx-2">
          {DIM_LABEL[dim]}
          <span className="ml-1 text-[11px] text-white/70 tabular-nums">· {item.name}</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-ink-50 pb-4">
        {/* 一级 KPI — 蓝色左竖条 */}
        <div className="mx-3 mt-3 card overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="w-1 h-7 bg-brand rounded-sm shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink-700 truncate">{item.name}</div>
              <div className="mt-0.5 text-[11px] text-ink-400 tabular-nums">
                环比 {item.qoq > 0 ? '+' : ''}{item.qoq.toFixed(2)}% · {subsForMedia.length} 个客户
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[20px] font-semibold text-brand tabular-nums">
                {groupTotalAmount > 0
                  ? groupTotalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : item.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-ink-400">
                {groupTotalAmount > 0 ? '非赠款消耗 · 万' : '万'}
              </div>
            </div>
          </div>
        </div>

        {/* 第 2 层 chip 行 — 二级实体（客户）切换 */}
        {subsForMedia.length > 0 && (
          <div className="mx-3 mt-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {subsForMedia.map((s, i) => {
                const active = i === activeSubIdx
                return (
                  <button key={s.name} type="button"
                    onClick={() => { setActiveSubIdx(i); setPage(1) }}
                    className={`shrink-0 h-7 px-3 rounded-full text-[12px] tap whitespace-nowrap max-w-[160px] truncate ${
                      active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
                    }`}
                    title={s.name}>{i + 1}. {s.name}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* 二级 KPI — 当前选中客户金额 */}
        {currentSub && (
          <div className="mx-3 mt-3 card overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
              <GroupTitle right={`${currentSub.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`}>
                {currentSub.name}
              </GroupTitle>
            </div>
            <div className="px-4 py-3 flex items-center">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-ink-400">非赠款消耗</div>
                <div className="text-[18px] font-semibold text-brand tabular-nums mt-0.5">
                  {currentSub.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="ml-0.5 text-[10px] text-ink-400 font-normal">元</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 第 3 层 — 广告主消耗明细卡片 */}
        <div className="mx-3 mt-3 flex items-center justify-between">
          <GroupTitle right={`共 ${total} 条`}>广告主消耗明细</GroupTitle>
        </div>
        {slice.length === 0 ? (
          <div className="mx-3 mt-2 py-10 text-center text-ink-400 text-[13px] card">暂无数据</div>
        ) : (
          <div className="mx-3 mt-2 space-y-2">
            {slice.map((r, i) => (
              <div key={`${r.date}-${r.advId}-${i}`} className="card overflow-hidden">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ink-400 tabular-nums">{r.date}</span>
                    <span className="text-[11px] text-ink-500 bg-ink-50 px-2 py-0.5 rounded">{r.platform}</span>
                  </div>
                  <div className="mt-1.5 text-[14px] text-ink-900 truncate">{r.advName}</div>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-ink-100">
                    <div className="flex items-center gap-2 text-[11px] text-ink-500">
                      <span className="bg-ink-50 px-1.5 py-0.5 rounded">{r.industry}</span>
                      <span className="font-mono text-[10px] tabular-nums">ID:{r.advId.slice(-6)}</span>
                    </div>
                    <div className="text-[15px] font-semibold text-brand tabular-nums">
                      {r.nonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="ml-0.5 text-[10px] text-ink-400 font-normal">元</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 分页 */}
        {total > 0 && (
          <div className="mx-3 mt-3 pb-2">
            <div className="flex items-center justify-center gap-1.5">
              <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage <= 1}
                className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
                aria-label="上一页">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="px-2 text-ink-700 text-[12px]">{safePage}/{totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage >= totalPages}
                className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
                aria-label="下一页">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-ink-500">
              <span>{PAGE_SIZE} 条/页</span>
              <span className="text-ink-300">|</span>
              <span>共 {total} 条</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 主页面 ============
export default function OperationReportPage({ node }) {
  const period = PERIOD_MAP[node?.index] || 'monthly'
  const data = operationReportData[period]

  const [tab, setTab] = useState('operator')
  const [activeCard, setActiveCard] = useState(null)        // 选中的媒体
  const [compareFilter, setCompareFilter] = useState('全部')  // '全部' / '环比为0'
  const [advOpen, setAdvOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    platform: '', department: '', cooperation: '', payment: '', group: '',
  })
  const [detail, setDetail] = useState(null)  // { item, mediaKey } | null
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const dimData = tab === 'operator' ? data.operator : data.dept
  const mediaItem = dimData.byMedia.find(m => m.key === activeCard) || dimData.byMedia[0]
  const allCards = mediaItem.cards

  // 环比筛选后的二级卡
  const filteredCards = useMemo(() => {
    return allCards.filter(c => {
      if (compareFilter === '环比为0' && Math.abs(c.qoq) <= 0.001) return false
      return true
    })
  }, [allCards, compareFilter])

  const totalCardPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE))
  const safePage = Math.min(page, totalCardPages)
  const pagedCards = filteredCards.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const sumNonGift = filteredCards.reduce((s, c) => s + c.nonGift, 0)

  useEffect(() => { setPage(1) }, [tab, activeCard, compareFilter])

  const trend = dimData.trends[mediaItem.key] || []
  const trendAvg = trend.length ? trend.reduce((s, t) => s + t.value, 0) / trend.length : 0

  const handleReset = () => {
    setAdvanced({ platform: '', department: '', cooperation: '', payment: '', group: '' })
  }

  const handleExport = () => {
    const total = filteredCards.length
    showToast(`已导出 ${tab === 'operator' ? '运营' : '部门'}维度 · ${mediaItem.name} · ${total} 条`)
  }

  const activeAdvancedCount = Object.values(advanced).filter(v => v).length
  const selectedLabel = activeCard ? mediaItem.name : ''

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* 行 1：周期 chip + 漏斗 + 导出 */}
      <PeriodRow
        periodKind={period}
        periodLabel={PERIOD_LABEL[period]}
        period={data.period}
        onPeriodChange={p => {/* 数据保持固定，仅视觉同步 */}}
        activeCount={activeAdvancedCount}
        onFunnel={() => setAdvOpen(true)}
        onExport={handleExport}
      />

      {/* 行 2：运营 / 部门 tab */}
      <TabRow tab={tab} setTab={setTab}/>

      {/* 媒体消耗概览 9 卡（横滑） */}
      <div className="mx-3 mt-3 mb-1 flex items-center justify-between">
        <span className="group-title-bar !w-1 !h-3"/>
        <span className="text-[13px] text-ink-700 font-medium">媒体消耗概览</span>
        <span className="text-[11px] text-ink-400">单位：万</span>
      </div>
      <StatCardsRow
        kpis={dimData.byMedia}
        activeCard={activeCard}
        onCardClick={setActiveCard}
      />

      {/* 饼图：二代/非二代/其他 */}
      <PieSection pie={mediaItem.pie} selectedLabel={selectedLabel}/>

      {/* 柱状图：按周/月/季 趋势（日报无柱图）*/}
      {period !== 'daily' && trend.length > 0 && (
        <BarSection trend={trend} avg={trendAvg} periodKey={period}/>
      )}

      {/* 行业 Top10 堆叠柱状图 — 仅季报 */}
      {period === 'quarterly' && data.industryStack && (
        <IndustryStackChart industryStack={data.industryStack}/>
      )}

      {/* 环比筛选 + 总和 */}
      <CompareRow
        value={compareFilter}
        onChange={setCompareFilter}
        nonGiftText={`非赠款消耗总和：${sumNonGift.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}万元`}
      />

      {/* 二级卡列表 */}
      <RankingCard items={pagedCards} onItemClick={(it) => setDetail({ item: it, mediaKey: mediaItem.key })}/>

      {/* 分页 */}
      {filteredCards.length > 0 && (
        <Pagination total={filteredCards.length} page={safePage} totalPages={totalCardPages} setPage={setPage}/>
      )}

      {/* 高级筛选 Sheet */}
      {advOpen && (
        <AdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          onReset={handleReset}
          onClose={() => setAdvOpen(false)}
        />
      )}

      {/* 详情 Sheet（全屏） */}
      {detail && (
        <RankDetailSheet
          item={detail.item}
          dim={tab}
          mediaKey={detail.mediaKey}
          onClose={() => setDetail(null)}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast}/>}
    </div>
  )
}