import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList,
} from 'recharts'

// ============ 常量 ============
const TODAY = dayjs()
const DEFAULT_PERIOD = TODAY.subtract(1, 'month').format('YYYY-MM')

const PLATFORM_OPTIONS = ['头条-AD', '头条-千川', '头条-本地推', '腾讯', '快手', '小红书', '微博', 'TikToK']
const DEPT_OPTIONS = ['KA销售部', '存量客户部', '销售部', '媒介部', '运营部', '市场部', '人事行政部', '财务部', '未匹配']
const COOP_OPTIONS = ['走量', '包断', '自运营']
const PAY_OPTIONS = ['预付', '垫款']
const COMPARE_OPTIONS = ['全部', '环比为0']

const TAB_OPTIONS = [
  { key: 'group',     label: '集团' },
  { key: 'sales',     label: '销售' },
  { key: 'performer', label: '业绩归属人' },
  { key: 'operator',  label: '运营' },
  { key: 'dept',      label: '部门' },
]

const PAGE_SIZE = 10
const emptyAdv = (period = DEFAULT_PERIOD) => ({
  period,                 // 与行 1 一致 — 年-月 格式
  platform:   [],         // 数组 — 多选
  dept:       '',
  coopMode:   '',
  payType:    '',
  groupSearch:'',
  selectedGroup: '',
})

const BORDER_COLOR = {
  blue:   '#2D7FF9', green: '#34A853', red:    '#FF5A5A',
  purple: '#9B7FF5', orange:'#FF9A3C', pink:   '#FF7AB6', cyan:'#22C7E5', gray:'#9CA3AF',
}
const DELTA_COLOR = {
  positive: { fg: '#34A853', arrow: '↑' },
  negative: { fg: '#FF5A5A', arrow: '↓' },
  neutral:  { fg: '#9CA3AF', arrow: '—' },
}
const isZeroDelta = (k) => k.deltaPct === '0%' || k.deltaPct === '+0%' || k.deltaPct === '−0%' || k.delta === '0'

// ============ 年-月 日期组件 ============
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
        aria-label="选择日期">
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
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50"
              aria-label="上一年">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[14px] font-medium text-ink-900 tabular-nums">{year}年</span>
            <button onClick={() => setYear(year + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center tap hover:bg-ink-50"
              aria-label="下一年">
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

// ============ 行 1：日期 picker + 漏斗 ============
function PeriodRow({ period, setPeriod, activeCount, onFunnel }) {
  return (
    <div className="mx-2 mt-2 card">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="text-[12px] text-ink-500 shrink-0">统计日期:</span>
        <MonthYearPicker value={period} onChange={setPeriod}/>
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
      </div>
    </div>
  )
}

// ============ Tab 切换：5 维度 + 刷新按钮 ============
function TabRow({ tab, setTab, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)
  const handle = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
    onRefresh && onRefresh()
  }
  return (
    <div className="mx-3 mt-3 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
        {TAB_OPTIONS.map(o => {
          const active = tab === o.key
          return (
            <button key={o.key} onClick={() => setTab(o.key)}
              className={`h-8 px-3.5 rounded-full text-[12px] tap whitespace-nowrap shrink-0 ${
                active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
              }`}>{o.label}</button>
          )
        })}
      </div>
      <button onClick={handle}
        className="w-8 h-8 bg-ink-50 rounded-full flex items-center justify-center tap shrink-0"
        aria-label="刷新">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          className={refreshing ? 'animate-spin' : ''}>
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M21 4v5h-5M3 20v-5h5"
            stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

// ============ 10 媒体消耗概览卡（受 环比筛选 影响，点击切换主筛选）============
function StatCardsRow({ kpis, activeCard, onCardClick }) {
  const BORDER = BORDER_COLOR
  return (
    <div className="mx-3 mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {kpis.map(it => {
        const dc = DELTA_COLOR[it.deltaTone]
        const isActive = activeCard === it.key
        return (
          <div key={it.key} onClick={() => onCardClick(isActive ? null : it.key)}
            className={`shrink-0 w-[150px] bg-white rounded-md border relative overflow-hidden tap cursor-pointer transition-colors ${
              isActive ? 'border-brand ring-2 ring-brand/30' : 'border-ink-100'
            }`}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: BORDER[it.borderTone] || BORDER.blue }}/>
            <div className="pl-3 pr-2.5 py-2.5">
              <div className="text-[12px] text-ink-500 truncate">{it.label}</div>
              <div className="text-[18px] font-semibold text-ink-900 mt-0.5 whitespace-nowrap tabular-nums">
                {typeof it.value === 'number' ? it.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : it.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px]" style={{ color: dc.fg }}>
                <span className="text-[11px] leading-none">{dc.arrow}</span>
                <span className="truncate">较上期 {it.delta} ({it.deltaPct})</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

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

// ============ 核心消耗指标卡组（一级 KPI 卡 → 点击后展开）============
function MetricCardsRow({ metrics, activeMetric, onMetricClick }) {
  const BORDER = BORDER_COLOR
  return (
    <div className="mx-3 mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {metrics.map(it => {
        const dc = DELTA_COLOR[it.deltaTone]
        const isActive = activeMetric === it.key
        return (
          <div key={it.key} onClick={() => onMetricClick(isActive ? null : it.key)}
            className={`shrink-0 w-[150px] bg-white rounded-md border relative overflow-hidden tap cursor-pointer transition-colors ${
              isActive ? 'border-brand ring-2 ring-brand/30' : 'border-ink-100'
            }`}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: BORDER[it.borderTone] || BORDER.blue }}/>
            <div className="pl-3 pr-2.5 py-2.5">
              <div className="text-[12px] text-ink-500 truncate">{it.label}</div>
              <div className="text-[18px] font-semibold text-ink-900 mt-0.5 whitespace-nowrap tabular-nums">
                {typeof it.value === 'number' ? it.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : it.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px]" style={{ color: dc.fg }}>
                <span className="text-[11px] leading-none">{dc.arrow}</span>
                <span className="truncate">较上期 {it.delta} ({it.deltaPct})</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============ 二代/非二代·交易/线索 拆分卡组（二级指标卡 → 点击后展开）============
function SplitCardsRow({ splits, activeSplit, onSplitClick }) {
  const BORDER = BORDER_COLOR
  return (
    <div className="mx-3 mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {splits.map(it => {
        const isActive = activeSplit === it.key
        return (
          <div key={it.key} onClick={() => onSplitClick(isActive ? null : it.key)}
            className={`shrink-0 w-[150px] bg-white rounded-md border relative overflow-hidden tap cursor-pointer transition-colors ${
              isActive ? 'border-brand ring-2 ring-brand/30' : 'border-ink-100'
            }`}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: BORDER[it.borderTone] || BORDER.blue }}/>
            <div className="pl-3 pr-2.5 py-2.5">
              <div className="text-[12px] text-ink-500 truncate">{it.label}</div>
              <div className="text-[18px] font-semibold text-ink-900 mt-0.5 whitespace-nowrap tabular-nums">
                {typeof it.value === 'number' ? it.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : it.value}
              </div>
              <div className="mt-1 text-[10px] text-ink-400">万</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============ 二代 / 非二代 / 其他 饼图 ============
function PieSection({ pie, activeCard, activeMetric, activeSplit, drilldown, kpis }) {
  const total = pie.reduce((s, x) => s + x.value, 0)
  const [activeSlice, setActiveSlice] = useState(null)
  const focused = pie.find(p => p.name === activeSlice)

  // 三级联动筛选链标签（拼接 activeCard · activeMetric · activeSplit）
  const cascadeLabel = (() => {
    if (!activeCard) return ''
    const cardLabel = kpis?.find(c => c.key === activeCard)?.label || activeCard
    const m = activeMetric ? drilldown?.[activeCard]?.metrics?.find(x => x.key === activeMetric) : null
    const s = activeSplit  ? drilldown?.[activeCard]?.splits?.find(x => x.key === activeSplit)   : null
    return [cardLabel, m?.label, s?.label].filter(Boolean).join(' · ')
  })()
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
        <GroupTitle right={
          focused
            ? `已选：${focused.name} ${focused.value.toFixed(2)} 万 (${total > 0 ? ((focused.value / total) * 100).toFixed(1) : '0.0'}%)`
            : cascadeLabel ? `已筛选：${cascadeLabel}` : `总 ${total.toFixed(2)} 万`
        }>消耗归属占比</GroupTitle>
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
                      key={i}
                      fill={p.color}
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
            <div className="text-[10px] text-ink-400">{focused ? focused.name : '总消耗'}</div>
            <div className="text-[14px] font-semibold text-ink-900 tabular-nums">
              {focused ? focused.value.toFixed(2) : total.toFixed(2)}
            </div>
            {focused && (
              <div className="text-[10px] text-ink-400 tabular-nums">
                {total > 0 ? ((focused.value / total) * 100).toFixed(1) : '0.0'}%
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {pie.map(p => {
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
                    background: p.color,
                    boxShadow: isActive ? `0 0 0 2px ${p.color}40` : 'none',
                  }}/>
                <span className={`truncate flex-1 text-left ${isActive ? 'text-brand font-medium' : 'text-ink-700'}`}>{p.name}</span>
                <span className={`tabular-nums shrink-0 ${isActive ? 'text-brand font-semibold' : 'text-ink-900 font-semibold'}`}>{p.value.toFixed(2)}</span>
                <span className="text-ink-400 tabular-nums shrink-0">{pct}%</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ 31 天柱状图 ============
function BarSection({ bars, activeCard, activeMetric, activeSplit, drilldown, kpis }) {
  const avg = bars.reduce((s, b) => s + b.value, 0) / bars.length
  const cascadeLabel = (() => {
    if (!activeCard) return ''
    const cardLabel = kpis?.find(c => c.key === activeCard)?.label || activeCard
    const m = activeMetric ? drilldown?.[activeCard]?.metrics?.find(x => x.key === activeMetric) : null
    const s = activeSplit  ? drilldown?.[activeCard]?.splits?.find(x => x.key === activeSplit)   : null
    return [cardLabel, m?.label, s?.label].filter(Boolean).join(' · ')
  })()

  // 月报 31 天柱子太密——容器宽度 ~340px，每根 ~10px 字标都看不全
  // 撑开图表宽度到 bars.length × 30px（约 930px），外面套可滑动层，左右滑动查看每天柱子
  const chartWidth = Math.max(320, bars.length * 30)
  const scrollRef = useRef(null)
  useEffect(() => {
    // 初始滚到最右（最新日期），符合用户看最新数据的习惯
    const el = scrollRef.current
    if (el) {
      requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth })
    }
  }, [bars.length])

  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
        <GroupTitle right={cascadeLabel ? `已筛选：${cascadeLabel} · 日均 ${avg.toFixed(2)} 万` : `日均 ${avg.toFixed(2)} 万`}>消耗总额（按日）</GroupTitle>
        <span className="text-[10px] text-ink-400 ml-2">左右滑动</span>
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div style={{ width: chartWidth, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={bars} margin={{ top: 6, right: 12, bottom: 0, left: -20 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false}/>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false}/>
                <Tooltip
                  cursor={{ fill: 'rgba(45,127,249,0.08)' }}
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E5E7EB' }}
                  labelStyle={{ color: '#4E5969' }}
                  formatter={(v) => [`${v.toFixed(2)} 万`, '消耗']}
                />
                <Bar dataKey="value" fill="#2D7FF9" radius={[2, 2, 0, 0]} maxBarSize={30}>
                  <LabelList dataKey="value" position="insideTop" fill="#fff" fontSize={9}
                    formatter={(v) => v.toFixed(2)}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* 右侧渐变提示：暗示"右边还有内容，可滑动" */}
        <div className="absolute top-0 right-0 bottom-0 w-7 pointer-events-none bg-gradient-to-l from-white via-white/70 to-transparent"/>
      </div>
    </div>
  )
}

// ============ 排名卡（无标题文字）============
function RankingCard({ items, page, pageSize }) {
  const start = (page - 1) * pageSize
  const slice = items.slice(start, start + pageSize)
  if (slice.length === 0) {
    return <div className="mx-3 mt-2 py-8 text-center text-ink-400 text-[13px] card">暂无数据</div>
  }
  return (
    <div className="mx-3 mt-2 space-y-2">
      {slice.map(r => (
        <div key={r.rank} className="card overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${
              r.rank === 1 ? 'bg-danger text-white' :
              r.rank === 2 ? 'bg-warning text-white' :
              r.rank === 3 ? 'bg-brand text-white' :
              'bg-ink-50 text-ink-700'
            }`}>{r.rank}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-ink-900 truncate">{r.name}</div>
              <div className="mt-0.5 text-[11px] text-ink-400 tabular-nums">环比 {r.delta}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[15px] font-semibold text-brand tabular-nums">
                {r.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-ink-400">万</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============ 集团维度详情（点击排名卡 → 全屏 Sheet）============
function RankDetailSheet({ rank, item, allItems, details, dimension = 'group', onClose }) {
  // 维度名文案 — 集团→子公司；销售/业绩归属人/运营→客户
  const DIM_LABEL = {
    group:     { top: '集团明细',       level2: '子公司', level2Unit: '个子公司', sumUnit: '非赠款消耗', empty: '暂无数据' },
    sales:     { top: '销售明细',       level2: '客户',   level2Unit: '个客户',   sumUnit: '非赠款消耗', empty: '暂无数据' },
    performer: { top: '业绩归属人明细', level2: '客户',   level2Unit: '个客户',   sumUnit: '非赠款消耗', empty: '暂无数据' },
    operator:  { top: '运营明细',       level2: '客户',   level2Unit: '个客户',   sumUnit: '非赠款消耗', empty: '暂无数据' },
  }
  const cfg = DIM_LABEL[dimension] || DIM_LABEL.group
  // 当前二级实体（子公司 / 客户）
  const [activeSub, setActiveSub] = useState(null)
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [toast, setToast] = useState('')
  const PAGE_SIZE = 15
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 1500) }

  const activeRank = rank
  // 当前维度下 item 对应的二级列表
  const subs = details?.[item.name] || []
  const groupTotalAmount = subs.reduce((s, x) => s + (Number(x.nonGift) || 0), 0)
  // 当前二级实体
  const currentSub = activeSub ? subs.find(s => s.name === activeSub) : null
  const rows = currentSub ? currentSub.rows : []
  const subTotalAmount = currentSub ? currentSub.nonGift : 0

  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // 初始化默认选中第一个二级实体
  useEffect(() => { setActiveSub(subs[0]?.name || null) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      {/* TopBar — 只保留返回 + 标题 */}
      <div className="sticky top-0 z-10 bg-brand text-white h-12 flex items-center px-2 shadow-sm">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center -ml-1" aria-label="返回">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="flex-1 text-[15px] font-medium truncate mx-2">
          {cfg.top}
          <span className="ml-1 text-[11px] text-white/70 tabular-nums">No.{activeRank} · {item.name}</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-ink-50 pb-4">
        {/* 一级 KPI — 序号左侧加蓝色竖条 */}
        <div className="mx-3 mt-3 card overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="w-1 h-7 bg-brand rounded-sm shrink-0"/>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${
              activeRank === 1 ? 'bg-danger text-white' :
              activeRank === 2 ? 'bg-warning text-white' :
              activeRank === 3 ? 'bg-brand text-white' :
              'bg-ink-50 text-ink-700'
            }`}>{activeRank}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink-700 truncate">{item.name}</div>
              <div className="mt-0.5 text-[11px] text-ink-400 tabular-nums">环比 {item.delta} · {subs.length} {cfg.level2Unit}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[20px] font-semibold text-brand tabular-nums">
                {(groupTotalAmount || item.value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-ink-400">{groupTotalAmount > 0 ? cfg.sumUnit : '排名金额 · 万'}</div>
            </div>
          </div>
        </div>

        {/* 第 2 层 chip 行 — 二级实体切换 */}
        {subs.length > 0 && (
          <div className="mx-3 mt-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {subs.map((s, i) => {
                const active = s.name === activeSub
                return (
                  <button key={s.name} type="button"
                    onClick={() => { setActiveSub(s.name); setPage(1) }}
                    className={`shrink-0 h-7 px-3 rounded-full text-[12px] tap whitespace-nowrap max-w-[160px] truncate ${
                      active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
                    }`}
                    title={s.name}>{i + 1}. {s.name}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* 二级 KPI — 当前选中的二级实体金额 */}
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

        {/* 第 3 层 — 广告主消耗明细列表 */}
        <div className="mx-3 mt-3 flex items-center justify-between">
          <GroupTitle right={`共 ${total} 条`}>广告主消耗明细</GroupTitle>
        </div>
        {slice.length === 0 ? (
          <div className="mx-3 mt-2 py-10 text-center text-ink-400 text-[13px] card">{cfg.empty}</div>
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

        {total > 0 && (
          <div className="mx-3 mt-3 pb-2">
            <div className="flex items-center justify-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap" aria-label="上一页">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-full text-[12px] tap ${n === safePage ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap" aria-label="下一页">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-ink-500">
              <span>{PAGE_SIZE}条/页</span>
              <span className="text-ink-300">|</span>
              <span>共 {total} 条</span>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast}/>}
    </div>
  )
}

// ============ 环比筛选（位于图表与排名卡之间）============
function CompareRow({ value, onChange, nonGiftText }) {
  return (
    <div className="mx-3 mt-3 flex items-center gap-2">
      <span className="text-[13px] text-ink-700 font-medium shrink-0">环比筛选</span>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {COMPARE_OPTIONS.map(o => {
          const active = value === o
          return (
            <button key={o} onClick={() => onChange(o)}
              className={`h-7 px-3 rounded-full text-[12px] tap whitespace-nowrap shrink-0 ${
                active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700 active:bg-ink-100'
              }`}>{o}</button>
          )
        })}
      </div>
      {nonGiftText && (
        <span className="ml-auto text-[12px] text-ink-700 whitespace-nowrap shrink-0 tabular-nums">{nonGiftText}</span>
      )}
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

// ============ Sheet 左右布局（按 PC 截图）============
function AdvancedFilter({ values, setValues, onReset, onClose, groups }) {
  const fields = [
    { key: 'period',   label: '统计日期', kind: 'periodPicker' },
    { key: 'platform', label: '媒体平台', kind: 'platformMulti' },
    { key: 'dept',     label: '部门',     kind: 'select',  options: DEPT_OPTIONS },
    { key: 'coopMode', label: '合作模式', kind: 'select',  options: COOP_OPTIONS },
    { key: 'payType',  label: '付款方式', kind: 'select',  options: PAY_OPTIONS },
    { key: 'group',    label: '集团',     kind: 'groupSearch', options: groups },
  ]
  const [active, setActive] = useState('period')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)
  const togglePlatform = (p) => {
    const cur = values.platform || []
    set('platform', cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p])
  }
  const filteredGroups = useMemo(() => {
    const q = (values.groupSearch || '').trim()
    if (!q) return groups || []
    return (groups || []).filter(g => g.includes(q))
  }, [values.groupSearch, groups])
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">更多筛选</h2>
          <button onClick={onClose} className="w-7 h-7 tap" aria-label="关闭">
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
            {/* 统计日期：年-月 picker（与行 1 一致）*/}
            {activeField?.kind === 'periodPicker' && (
              <div className="space-y-3">
                <MonthYearPicker value={values.period} onChange={v => set('period', v)}/>
                <div className="text-[11px] text-ink-400 tabular-nums">当前选择：{values.period}</div>
              </div>
            )}
            {/* 媒体平台：多选 chips */}
            {activeField?.kind === 'platformMulti' && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(values.platform || []).map(p => (
                    <span key={p} className="inline-flex items-center gap-1 h-7 px-2.5 bg-brand/10 text-brand rounded-full text-[12px]">
                      {p}
                      <button onClick={() => togglePlatform(p)} className="tap">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="border-t border-ink-100 pt-2 space-y-1 max-h-[280px] overflow-y-auto">
                  {PLATFORM_OPTIONS.map(p => {
                    const checked = (values.platform || []).includes(p)
                    return (
                      <label key={p} onClick={() => togglePlatform(p)} className="flex items-center gap-2 px-2 py-1.5 rounded tap cursor-pointer">
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          checked ? 'bg-brand border-brand' : 'border-ink-200'
                        }`}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className="text-[13px] text-ink-900 truncate">{p}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
            {/* 通用下拉单选 */}
            {activeField?.kind === 'select' && (
              <div className="space-y-1">
                {activeField.options.map(opt => {
                  const v = opt === '全部' ? '' : opt
                  return (
                    <label key={opt} onClick={() => set(activeField.key, v)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        values[activeField.key] === v ? 'border-brand' : 'border-ink-200'
                      }`}>
                        {values[activeField.key] === v && <span className="w-2 h-2 rounded-full bg-brand"/>}
                      </span>
                      <span className="text-[13px] text-ink-900 truncate">{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}
            {/* 集团：搜索框 */}
            {activeField?.kind === 'groupSearch' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 h-9 border border-ink-200 rounded">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="1.6"/>
                    <path d="M20 20l-3.5-3.5" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <input value={values.groupSearch}
                    onChange={e => set('groupSearch', e.target.value)}
                    placeholder="请输入集团名称"
                    className="flex-1 bg-transparent text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
                  {values.groupSearch && (
                    <button onClick={() => set('groupSearch', '')} className="tap">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M6 18L18 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-[280px] overflow-y-auto">
                  {filteredGroups.length === 0 ? (
                    <div className="py-6 text-center text-ink-400 text-[12px]">无匹配集团</div>
                  ) : filteredGroups.map(g => {
                    const selected = values.selectedGroup === g
                    return (
                      <label key={g} onClick={() => set('selectedGroup', selected ? '' : g)} className="flex items-center gap-2 px-2 py-1.5 rounded tap cursor-pointer hover:bg-ink-50">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? 'border-brand' : 'border-ink-200'
                        }`}>
                          {selected && <span className="w-2 h-2 rounded-full bg-brand"/>}
                        </span>
                        <span className="text-[13px] text-ink-900 truncate">{g}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onReset}
            className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap active:bg-ink-50">重置筛选</button>
          <button onClick={onClose}
            className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap active:opacity-90">确  定</button>
        </div>
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

// ============ 主页面 ============
export default function MediaMonthlyReportPage({ node }) {
  const data = node?.data ?? { kpis: [], rankings: {}, pie: [], bars: [], total: 0, groups: [] }

  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [adv, setAdv] = useState(emptyAdv())
  const [advOpen, setAdvOpen] = useState(false)
  const [tab, setTab] = useState('group')
  const [activeCard, setActiveCard] = useState(null)        // 一级：媒体平台（KPI 卡）
  const [activeMetric, setActiveMetric] = useState(null)    // 二级：核心指标 (nonGift/trade/lead)
  const [activeSplit, setActiveSplit] = useState(null)      // 三级：二代/非二代·交易/线索
  const [refreshKey, setRefreshKey] = useState(0)
  const [toast, setToast] = useState('')
  const [page, setPage] = useState(1)
  const [compareFilter, setCompareFilter] = useState('全部')  // 顶部 chip：全部 / 环比为0
  const [detail, setDetail] = useState(null)  // {rank, item} | null — 集团详情 Sheet

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const handleRefresh = () => {
    setTimeout(() => {
      setRefreshKey(k => k + 1)
      showToast('刷新成功')
    }, 700)
  }

  const handleAdvClose = () => {
    // Sheet 内可能改了 period — 同步给行 1
    if (adv.period && adv.period !== period) setPeriod(adv.period)
    setAdvOpen(false)
  }
  const handleAdvReset = () => setAdv(emptyAdv(period))

  // 当前 tab 下的排名
  const rankingItems = useMemo(() => data.rankings?.[tab] || [], [data, tab])

  // 受 环比筛选 影响：顶部 KPI 卡 + 排名卡都按此过滤
  const isZeroFilter = compareFilter === '环比为0'
  const filteredKpis = useMemo(() => {
    if (!isZeroFilter) return data.kpis || []
    return (data.kpis || []).filter(isZeroDelta)
  }, [data, isZeroFilter])
  const filteredRankings = useMemo(() => {
    if (!isZeroFilter) return rankingItems
    return rankingItems.filter(r => r.delta === '0%' || r.delta === '—' || r.delta === '+0%' || r.delta === '0')
  }, [rankingItems, isZeroFilter])

  // 当前维度 KPI 卡（按 isZeroFilter 过滤后）
  const currentKpis = filteredKpis
  // 受当前 tab + 筛选 影响的「可见 KPI 卡金额合计」
  const visibleCardTotal = useMemo(
    () => currentKpis.reduce((s, k) => s + (Number(k.value) || 0), 0),
    [currentKpis]
  )

  // 受 card click 影响的 pie —— 三级联动：activeCard → activeMetric → activeSplit
  const currentPie = useMemo(() => {
    let scope = data.total
    if (activeCard) {
      const card = data.kpis?.find(c => c.key === activeCard)
      if (!card) return data.pie
      scope = card.value
      // 二级：activeMetric → 缩小到 nonGift / trade / lead
      if (activeMetric) {
        const dd = data.drilldown?.[activeCard]
        const m = dd?.metrics?.find(x => x.key === activeMetric)
        if (m) scope = m.value
        // 三级：activeSplit → 进一步缩小到 交易类·二代 / 交易类·非二代 / 线索类·二代 / 线索类·非二代
        if (activeSplit) {
          const s = dd?.splits?.find(x => x.key === activeSplit)
          if (s) scope = s.value
        }
      }
    }
    if (!scope || !data.total) return data.pie
    const scale = scope / data.total
    return data.pie.map(p => ({ ...p, value: p.value * scale }))
  }, [activeCard, activeMetric, activeSplit, data])

  // 受 card click 影响的 bar —— 同样的三级联动
  const currentBars = useMemo(() => {
    let scope = data.total
    if (activeCard) {
      const card = data.kpis?.find(c => c.key === activeCard)
      if (!card) return data.bars
      scope = card.value
      if (activeMetric) {
        const dd = data.drilldown?.[activeCard]
        const m = dd?.metrics?.find(x => x.key === activeMetric)
        if (m) scope = m.value
        if (activeSplit) {
          const s = dd?.splits?.find(x => x.key === activeSplit)
          if (s) scope = s.value
        }
      }
    }
    if (!scope || !data.total) return data.bars
    const scale = scope / data.total
    return data.bars.map(b => ({ ...b, value: b.value * scale }))
  }, [activeCard, activeMetric, activeSplit, data, refreshKey])

  const totalPages = Math.max(1, Math.ceil(filteredRankings.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  // 计数筛选条件：媒体平台(每个平台计 1)/部门/合作模式/付款方式/集团/环比
  const activeAdvCount =
    (adv.platform?.length || 0) +
    (adv.dept ? 1 : 0) +
    (adv.coopMode ? 1 : 0) +
    (adv.payType ? 1 : 0) +
    (adv.selectedGroup ? 1 : 0) +
    (adv.period !== period ? 1 : 0)

  // 切 tab 重置 activeCard / activeMetric / activeSplit
  const handleTabChange = (t) => {
    setTab(t)
    setActiveCard(null)
    setActiveMetric(null)
    setActiveSplit(null)
    setPage(1)
  }

  // 点击媒体消耗概览卡：切换一级筛选，并级联重置二、三级
  const handleCardChange = (key) => {
    setActiveCard(prev => prev === key ? null : key)
    // 一级 KPI 卡的二级默认选中「非赠款消耗」
    setActiveMetric(prev => prev === key ? null : 'nonGift')
    setActiveSplit(null)
  }

  // 点击核心指标卡：切换二级筛选（保留 nonGift 默认选中状态；切到 trade/lead 才过滤 splits）
  const handleMetricChange = (key) => {
    setActiveMetric(key)
    setActiveSplit(null)
  }

  // 当前 activeMetric 对应的可见拆分卡（trade/lead → 2 张；nonGift 或未选 → 4 张）
  const visibleSplits = useMemo(() => {
    if (!activeCard) return []
    const dd = data.drilldown?.[activeCard]
    if (!dd) return []
    if (activeMetric && activeMetric !== 'nonGift') {
      // trade → 2 张交易类；lead → 2 张线索类
      return dd.splits.filter(s => s.key.endsWith(`-${activeMetric}`))
    }
    return dd.splits
  }, [activeCard, activeMetric, data])

  // 点击拆分卡：切换三级筛选
  const handleSplitChange = (key) => {
    setActiveSplit(prev => prev === key ? null : key)
  }

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* 行 1：日期 picker + 漏斗 */}
      <PeriodRow
        period={period} setPeriod={setPeriod}
        activeCount={activeAdvCount}
        onFunnel={() => setAdvOpen(true)}
      />

      {/* 5 维度 tab + 刷新按钮（在 部门右侧）*/}
      <TabRow tab={tab} setTab={handleTabChange} onRefresh={handleRefresh}/>

      {/* 媒体消耗概览 10 卡片（点击影响饼图+柱状图）*/}
      <div className="mx-3 mt-3 mb-1 flex items-center justify-between">
        <span className="group-title-bar !w-1 !h-3"/>
        <span className="text-[13px] text-ink-700 font-medium">媒体消耗概览</span>
        <span className="text-[11px] text-ink-400">
          {isZeroFilter ? `环比为0 · ${currentKpis.length} 张` : `单位：万`}
        </span>
      </div>
      <StatCardsRow kpis={currentKpis} activeCard={activeCard} onCardClick={handleCardChange}/>

      {/* 二级：核心消耗指标卡组（一级 KPI 卡被选中后才显示） */}
      {activeCard === 'ttlpc' && data.drilldown?.[activeCard] && (
        <>
          <div className="group-title">
            <span className="group-title-bar"/>
            <span className="text-[13px] text-ink-700 font-medium">核心消耗指标</span>
          </div>
          <MetricCardsRow
            metrics={data.drilldown[activeCard].metrics}
            activeMetric={activeMetric}
            onMetricClick={handleMetricChange}
          />
        </>
      )}

      {/* 三级：二代/非二代·交易/线索拆分卡组（一级 KPI 卡被选中后默认展开；切 trade/lead 时只显示对应 2 张） */}
      {activeCard === 'ttlpc' && data.drilldown?.[activeCard] && visibleSplits.length > 0 && (
        <>
          <div className="group-title">
            <span className="group-title-bar"/>
            <span className="text-[13px] text-ink-700 font-medium">二代/非二代 · 交易·线索消耗拆分</span>
            <span className="ml-auto text-[11px] text-ink-400">
              {activeMetric === 'trade' ? '交易类' : activeMetric === 'lead' ? '线索类' : '全部 4 项'}
            </span>
          </div>
          <SplitCardsRow
            splits={visibleSplits}
            activeSplit={activeSplit}
            onSplitClick={handleSplitChange}
          />
        </>
      )}

      {/* 饼图：二代/非二代/其他 */}
      <PieSection pie={currentPie} activeCard={activeCard} activeMetric={activeMetric} activeSplit={activeSplit} drilldown={data.drilldown} kpis={data.kpis}/>

      {/* 柱状图：31 天 */}
      <BarSection bars={currentBars} activeCard={activeCard} activeMetric={activeMetric} activeSplit={activeSplit} drilldown={data.drilldown} kpis={data.kpis}/>

      {/* 环比筛选 — chip 行（位于图表下方 / 排名卡上方）*/}
      <CompareRow
        value={compareFilter}
        onChange={setCompareFilter}
        nonGiftText={`非赠款消耗总和：${visibleCardTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}万元`}
      />

      {/* 排名卡（无标题文字，仅显示列表）*/}
      <div className="mx-3 mt-4 space-y-2">
        {filteredRankings.map(r => (
          <button key={r.rank} type="button"
            onClick={() => {
              // 部门 tab 下点击部门卡 = 跨维度跳转：
              //   1) 设筛选 adv.dept = 部门名
              //   2) 切到集团 tab
              //   3) 重置 activeCard / page / compareFilter / detail
              //   4) 不打开 Sheet（按用户选 C 方案：设筛选+切tab+立即应用，不弹 Sheet）
              if (tab === 'dept') {
                setAdv(prev => ({ ...prev, dept: r.name }))
                setTab('group')
                setActiveCard(null)
                setPage(1)
                setCompareFilter('全部')
                setDetail(null)
                return
              }
              setDetail({ rank: r.rank, item: r, tab })
            }}
            className="w-full text-left card overflow-hidden active:bg-ink-50">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${
                r.rank === 1 ? 'bg-danger text-white' :
                r.rank === 2 ? 'bg-warning text-white' :
                r.rank === 3 ? 'bg-brand text-white' :
                'bg-ink-50 text-ink-700'
              }`}>{r.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-ink-900 truncate">{r.name}</div>
                <div className="mt-0.5 text-[11px] text-ink-400 tabular-nums">环比 {r.delta}</div>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <div>
                  <div className="text-[15px] font-semibold text-brand tabular-nums">
                    {r.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* 分页 */}
      {filteredRankings.length > 0 && (
        <Pagination total={filteredRankings.length} page={currentPage} totalPages={totalPages} setPage={setPage}/>
      )}

      {/* Sheet */}
      {advOpen && (
        <AdvancedFilter
          values={adv}
          setValues={setAdv}
          onReset={handleAdvReset}
          onClose={handleAdvClose}
          groups={data.groups || []}
        />
      )}

      {/* 详情 Sheet（全屏）— 集团/销售 维度均支持 3 层结构 */}
      {detail && (
        <RankDetailSheet
          rank={detail.rank}
          item={detail.item}
          allItems={filteredRankings}
          details={data.details?.[detail.tab] || {}}
          dimension={detail.tab}
          onClose={() => setDetail(null)}
        />
      )}

      {toast && <Toast message={toast}/>}
    </div>
  )
}