import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { coreKpi, platforms, rankings } from '../../data/mock'

// ============ 板块独立时间筛选选项 ============
const TIME_RANGES = [
  { id: 'yest',  label: '昨天' },
  { id: 'w7',    label: '近7天' },
  { id: 'week',  label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'year',  label: '本年' },
]

// 板块内独立 chip 条组件
function TimeChips({ value, onChange }) {
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)
  const handleRefresh = () => {
    setRefreshing(true)
    setToast({ type: 'success', message: '刷新成功' })
    setTimeout(() => setRefreshing(false), 800)
    setTimeout(() => setToast(null), 1800)
  }
  return (
    <div className="px-3 pt-2 pb-1 flex items-center gap-2">
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {TIME_RANGES.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-3 h-7 rounded-full text-[12px] whitespace-nowrap shrink-0 transition ${
              value === t.id
                ? 'bg-brand text-white'
                : 'bg-ink-100 text-ink-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleRefresh}
        className="w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center shrink-0 tap"
        aria-label="刷新"
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          className={refreshing ? 'animate-spin' : ''}
        >
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M21 4v5h-5M3 20v-5h5"
            stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {toast && <Toast type={toast.type} message={toast.message}/>}
    </div>
  )
}

// ============ 钉钉式 Toast（黑色背景 + 居中 + ✓ icon）============
function Toast({ type = 'success', message }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in">
        {type === 'success' && (
          <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
        <span className="text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )
}

// ============ 根据时间范围生成折线图序列 ============
// yest=1 点；w7/week=7 点；month=本月 ~26 天（按日）；year=本年 ~8 个月（按月聚合）
function buildLineSeries(platObj, range) {
  const baseSeries = platObj.series
  const baseAvg = baseSeries.reduce((s, d) => s + d.value, 0) / baseSeries.length
  const today = dayjs()

  if (range === 'yest') {
    return [{
      date: today.subtract(1, 'day').format('MM-DD'),
      value: baseSeries[baseSeries.length - 1].value,
    }]
  }
  if (range === 'month') {
    // 本月：当前月全月（28/29/30/31 天，按月动态），按日
    const monthStart = today.startOf('month')
    const daysInMonth = monthStart.daysInMonth()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = monthStart.add(i, 'day')
      // ±18% 正弦波动，视觉稳定不抖动
      const variation = 0.82 + 0.18 * Math.sin(i * 0.7)
      return { date: day.format('MM-DD'), value: Math.round(baseAvg * variation) }
    })
  }
  if (range === 'year') {
    // 本年：固定 1月 ~ 12月，按月聚合（月均 = 日均 × 30）
    const monthlyAvg = baseAvg * 30
    return Array.from({ length: 12 }, (_, i) => {
      const variation = 0.85 + 0.3 * Math.sin((i + 1) * 0.9)
      return { date: `${String(i + 1).padStart(2, '0')}月`, value: Math.round(monthlyAvg * variation) }
    })
  }
  // w7 / week：保留 7 天
  return baseSeries
}

export default function Home() {
  const nav = useNavigate()
  // 三个板块独立时间
  const [kpiTime, setKpiTime] = useState('yest')
  const [platTime, setPlatTime] = useState('week')
  const [rankTime, setRankTime] = useState('yest')
  // 头条消耗内部：平台切换
  const [platId, setPlatId] = useState('all')
  // 销售排行内部：榜别切换
  const [rankType, setRankType] = useState('group')

  const plat = platforms.find(p => p.id === platId) || platforms[0]
  const rankList = rankings[rankType] || []

  // 折线图序列（按时间和平台动态生成）
  const series = useMemo(() => buildLineSeries(plat, platTime), [plat, platTime])
  // 图表撑出宽度 = 每节点 30px；实际溢出容器 > 340px 时启用横向滑动
  // 月 ~26 点 → 780px 溢出 ✓；年 12 点 → 360px 轻微溢出 ✓；周/近7天 7 点 → 210px 不溢出
  const chartWidth = series.length * 30
  const isScrollable = chartWidth > 340
  const labelInterval = isScrollable ? Math.max(1, Math.floor(series.length / 8)) : 0
  const scrollRef = useRef(null)
  // 切到 month/year 时初始滚到最右（最新日期/月份），符合用户先看最新数据的习惯
  useEffect(() => {
    if (isScrollable && scrollRef.current) {
      requestAnimationFrame(() => { scrollRef.current.scrollLeft = scrollRef.current.scrollWidth })
    }
  }, [series.length, isScrollable])

  return (
    <div className="bg-ink-50 pb-4">
      {/* ============ 顶部蓝色 CRM bar（仅标题 + 刷新） ============ */}
      <div className="bg-brand text-white h-12 flex items-center justify-between px-4">
        <h1 className="text-base font-medium tracking-wide">CRM</h1>
        <button className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M21 4v5h-5M3 20v-5h5"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ============ 核心客户数据 5 列 KPI（独立 chip：默认昨天） ============ */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <TimeChips value={kpiTime} onChange={setKpiTime} />
        <div className="group-title">
          <span>核心客户数据</span>
        </div>
        <div className="px-1 pb-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {coreKpi.map(k => (
              <div key={k.id} className="shrink-0 w-[120px] py-1 px-2 border-r border-ink-100 last:border-r-0">
                <div className="text-[11px] text-ink-500 leading-tight">{k.label}</div>
                <div className="text-[15px] font-semibold text-ink-900 mt-1 whitespace-nowrap">
                  {k.id === 'consumption' ? `¥${k.formatted}` : k.formatted}
                </div>
                <div className={`text-[10px] mt-1 ${k.up ? 'text-danger' : 'text-success'}`}>
                  {k.up ? '↑' : '↓'} {Math.abs(k.trend)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ 头条总消耗 chips + 折线图（独立 chip：默认本周） ============ */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <TimeChips value={platTime} onChange={setPlatTime} />
        <div className="group-title">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-medium text-ink-900">{plat.label}消耗</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-[18px] font-bold text-ink-900">¥ {plat.formatted}</span>
              <span className={`text-[11px] ${plat.up ? 'text-danger' : 'text-success'}`}>
                {plat.up ? '↑' : '↓'} {Math.abs(plat.trend)}%
              </span>
            </div>
          </div>
        </div>

        {/* 平台 chips 横滑 */}
        <div className="px-3 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatId(p.id)}
                className={`px-3 h-7 rounded-full text-[13px] whitespace-nowrap shrink-0 ${
                  p.id === platId
                    ? 'bg-brand text-white font-medium'
                    : 'bg-ink-100 text-ink-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 折线图：节点数 > 7 时横向滑动（月 ~26 / 年 ~12 超出容器宽度） */}
        <div className="px-2 pb-4 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-ink-400">
              {isScrollable ? `${series.length} 个节点 · 左右滑动` : `${series.length} 个节点`}
            </span>
          </div>
          <div
            ref={scrollRef}
            className={isScrollable ? 'overflow-x-auto scrollbar-hide' : ''}
            style={isScrollable ? { WebkitOverflowScrolling: 'touch' } : undefined}
          >
            <div style={{ width: chartWidth, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D7FF9" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#2D7FF9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#86909C' }} tickLine={false} axisLine={false}
                    interval={labelInterval}/>
                  <YAxis
                    tick={{ fontSize: 10, fill: '#86909C' }}
                    tickLine={false} axisLine={false}
                    width={48}
                    domain={['dataMin - 200000', 'dataMax + 200000']}
                    tickFormatter={v => `${Math.round(v / 10000)}w`}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E6EB' }}
                    formatter={v => [`¥ ${Number(v).toLocaleString()}`, '消耗']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#2D7FF9" strokeWidth={2}
                    dot={{ r: 3, fill: '#2D7FF9' }} activeDot={{ r: 5 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {isScrollable && (
            <div className="absolute right-2 top-6 bottom-4 w-7 pointer-events-none bg-gradient-to-l from-white via-white/70 to-transparent"/>
          )}
        </div>
      </div>

      {/* ============ 销售排行（独立 chip：默认昨天） ============ */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <TimeChips value={rankTime} onChange={setRankTime} />
        <div className="group-title justify-between">
          <span>销售排行</span>
          <div className="ml-auto flex items-center gap-1">
            {[
              { id: 'group',   label: '集团榜' },
              { id: 'company', label: '公司榜' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setRankType(t.id)}
                className={`px-2.5 h-6 rounded-full text-[11px] ${
                  rankType === t.id ? 'bg-brand text-white' : 'text-ink-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {rankList.slice(0, 5).map((r, i) => (
            <div key={r.rank} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
                r.rank === 1 ? 'bg-danger text-white' :
                r.rank === 2 ? 'bg-warning text-white' :
                r.rank === 3 ? 'bg-brand text-white' :
                'bg-ink-100 text-ink-500'
              }`}>{r.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink-900 truncate">{r.name}</div>
                <div className="text-[10px] text-ink-400 mt-0.5">{r.sales}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12px] font-medium text-ink-900">¥ {r.formatted}</div>
                <div className={`text-[10px] mt-0.5 ${r.trend >= 0 ? 'text-danger' : 'text-success'}`}>
                  {r.trend >= 0 ? '↑' : '↓'} {Math.abs(r.trend)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}