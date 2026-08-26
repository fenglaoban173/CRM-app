import { useState, useMemo } from 'react'

// ============ 常量 ============
const PERIOD_OPTIONS = [
  { key: 'week',     label: '周' },
  { key: 'biweek',   label: '双周' },
  { key: 'month',    label: '月' },
  { key: 'quarter',  label: '季' },
  { key: 'halfyear', label: '半年' },
  { key: 'year',     label: '年' },
]
const PLATFORM_OPTIONS = ['全部', '头条-本地推', '头条-千川', '头条-巨量', '腾讯广告', '巨量引擎']
const COOP_MODE_OPTIONS = ['全部', '走量', '包断', '自运营']
const DEPT_OPTIONS = ['全部', 'KA销售部', '存量客户部', '销售部', '未匹配']
const SALES_OPTIONS = ['全部', '刘欢', '李慧彬', '孟丽珊', '郑昊坤', '王炳雅', '刘洋', '陈静', '周婷', '张磊']
const GROUP_TYPE_OPTIONS = ['全部', '活跃新客', '无效新客', '存量客户', '复投', '停投客户']

const TYPE_COLOR = {
  '复投':       { bg: '#FFF3E5', fg: '#FF9A3C' },
  '活跃新客':   { bg: '#E8F8EA', fg: '#34A853' },
  '无效新客':   { bg: '#FFE9E9', fg: '#FF5A5A' },
  '存量客户':   { bg: '#EBF3FF', fg: '#2D7FF9' },
  '停投客户':   { bg: '#F0E9FF', fg: '#9B7FF5' },
}

const PAGE_SIZE = 10
const emptyAdv = () => ({ period: 'week', platform: '', coopMode: '', dept: '', sales: '' })

// ============ 行 1：周期 chips + 漏斗 icon（参考自运营操作看板）============
function PeriodRow({ period, setPeriod, activeCount, onFunnel }) {
  return (
    <div className="mx-2 mt-2 card overflow-hidden">
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        <span className="text-[12px] text-ink-500 shrink-0">统计周期:</span>
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
          {PERIOD_OPTIONS.map(o => {
            const active = period === o.key
            return (
              <button key={o.key} onClick={() => setPeriod(o.key)}
                className={`h-8 px-3 rounded-full text-[12px] tap shrink-0 ${
                  active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
                }`}>{o.label}</button>
            )
          })}
        </div>
        <button onClick={onFunnel}
          className="w-8 h-8 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0"
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

// ============ 6 统计卡（独立卡片 + 横滑）============
function StatCardsRow({ stats }) {
  const items = [
    { key: 'existing',  label: '存量客户',   value: stats.existing,   delta: '+1,132', deltaPct: '0%', borderTone: 'blue',   deltaTone: 'positive' },
    { key: 'activeNew', label: '活跃新客',   value: stats.activeNew,  delta: '—',      deltaPct: '—',  borderTone: 'green',  deltaTone: 'neutral'  },
    { key: 'invalid',   label: '无效新客',   value: stats.invalid,    delta: '—',      deltaPct: '—',  borderTone: 'red',    deltaTone: 'negative' },
    { key: 'revisit',   label: '复投客户',   value: stats.revisit,    delta: '+1,132', deltaPct: '0%', borderTone: 'purple', deltaTone: 'positive' },
    { key: 'paused',    label: '停投客户',   value: stats.paused,     delta: '—',      deltaPct: '—',  borderTone: 'orange', deltaTone: 'neutral'  },
    { key: 'churn',     label: '整体流失率', value: `${stats.churn}%`, delta: '0%',    deltaPct: '—',  borderTone: 'pink',   deltaTone: 'negative' },
  ]
  const BORDER_COLOR = {
    blue:   '#2D7FF9', green: '#34A853', red:    '#FF5A5A',
    purple: '#9B7FF5', orange:'#FF9A3C', pink:   '#FF5A5A',
  }
  const DELTA_COLOR = {
    positive: { fg: '#34A853', arrow: '↑' },
    negative: { fg: '#FF5A5A', arrow: '↓' },
    neutral:  { fg: '#9CA3AF', arrow: '—' },
  }
  return (
    <div className="mx-3 mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {items.map(it => {
        const dc = DELTA_COLOR[it.deltaTone]
        return (
          <div key={it.key} className="shrink-0 w-[150px] bg-white rounded-md border border-ink-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: BORDER_COLOR[it.borderTone] }}/>
            <div className="pl-3 pr-2.5 py-2.5">
              <div className="text-[12px] text-ink-500 truncate">{it.label}</div>
              <div className="text-[20px] font-semibold text-ink-900 mt-0.5 whitespace-nowrap tabular-nums">{it.value}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px]" style={{ color: dc.fg }}>
                <span className="text-[11px] leading-none">{dc.arrow}</span>
                <span className="truncate">较上期{it.delta} ({it.deltaPct})</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============ 列表筛选 chips 行 ============
function TypeChipsRow({ label, options, value, onChange }) {
  return (
    <div className="mx-3 mt-3">
      <div className="text-[12px] text-ink-500 mb-1.5">{label}</div>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {options.map(o => {
          const active = (value || '全部') === o
          return (
            <button key={o} onClick={() => onChange(value === o ? '' : (o === '全部' ? '' : o))}
              className={`h-7 px-3 rounded-full text-[12px] tap whitespace-nowrap shrink-0 ${
                active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
              }`}>{o}</button>
          )
        })}
      </div>
    </div>
  )
}

// ============ 列表头：搜索 + 全部展开 + 刷新 ============
function ListHeader({ keyword, setKeyword, allExpanded, onToggleAll, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
    onRefresh && onRefresh()
  }
  return (
    <div className="mx-2 mt-3 card overflow-hidden">
      <div className="flex items-center px-2.5 py-2 gap-1.5">
        <div className="flex-1 bg-ink-50 rounded-full h-8 flex items-center px-3 text-[12px] min-w-0">
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="搜索集团名称"
            className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none min-w-0"
          />
        </div>
        <button onClick={onToggleAll}
          className={`h-8 px-2.5 rounded-full text-[12px] flex items-center gap-1 tap shrink-0 ${
            allExpanded ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
          }`} aria-label={allExpanded ? '全部收起' : '全部展开'}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            className={`transition-transform ${allExpanded ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {allExpanded ? '收起' : '展开'}
        </button>
        <button onClick={handleRefresh}
          className="w-8 h-8 bg-ink-50 rounded-full flex items-center justify-center tap shrink-0"
          aria-label="刷新">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={refreshing ? 'animate-spin' : ''}>
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M21 4v5h-5M3 20v-5h5"
              stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ============ 类型 chip ============
function TypeTag({ type }) {
  const c = TYPE_COLOR[type] || { bg: '#F0F2F5', fg: '#666' }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full shrink-0"
      style={{ background: c.bg, color: c.fg }}>
      <span className="w-1 h-1 rounded-full" style={{ background: c.fg }}/>
      {type}
    </span>
  )
}

// ============ 开户主体二级卡（内嵌）============
function SubjectRow({ subject }) {
  return (
    <div className="flex items-start gap-2 py-2 border-t border-ink-100/60 first:border-t-0">
      <span className="text-ink-400 text-[12px] mt-0.5 shrink-0">L</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-ink-900 truncate">{subject.name}</span>
          <TypeTag type={subject.customerType}/>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-500">
          <span>{subject.platform}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: '#FFF3E5', color: '#FF9A3C' }}>{subject.initOpMode}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-brand font-semibold tabular-nums">¥{subject.cost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-ink-400">{subject.lastCostTime}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[10px] text-ink-400">
          <span>销售:{subject.sales}</span>
          <span>部门:{subject.dept}</span>
        </div>
      </div>
    </div>
  )
}

// ============ 集团卡（可展开）============
function GroupCard({ group, expanded, onToggle }) {
  const subjectCount = group.subjects.length
  const platformCount = group.platforms.length
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-medium text-ink-900 truncate">{group.name}</span>
              <TypeTag type={group.groupCustomerType}/>
            </div>
            <div className="mt-1.5 text-[12px] text-ink-500">
              {subjectCount} 主体 · {platformCount} 种媒体
            </div>
          </div>
          <button onClick={onToggle}
            className={`w-7 h-7 rounded-full flex items-center justify-center tap shrink-0 ${expanded ? 'bg-brand/10 text-brand' : 'bg-ink-50 text-ink-500'}`}
            aria-label={expanded ? '收起' : '展开'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="border-t border-ink-100/60 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-ink-400">累计消耗</div>
          <div className="text-[15px] font-semibold text-brand tabular-nums mt-0.5">
            ¥{group.totalCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-ink-400">最后消耗</div>
          <div className="text-[12px] text-ink-700 mt-0.5">{group.lastCostTime}</div>
        </div>
      </div>
      <div className="px-4 pb-3 flex items-center justify-between text-[11px] text-ink-500">
        <span>销售: <span className="text-ink-700">{group.sales}</span></span>
        <span>部门: <span className="text-ink-700">{group.dept}</span></span>
      </div>
      {expanded && (
        <div className="border-t border-ink-100/60 px-4 py-2 bg-ink-50/50">
          <div className="text-[11px] text-ink-500 mb-1.5">▾ 开户主体明细 ({subjectCount})</div>
          {group.subjects.map((s, i) => (
            <SubjectRow key={i} subject={s}/>
          ))}
        </div>
      )}
    </div>
  )
}

// ============ Sheet 左右布局（含全部查询条件）============
function AdvancedFilter({ values, setValues, onReset, onClose }) {
  const fields = [
    { key: 'period',   label: '统计周期', kind: 'chip',    options: PERIOD_OPTIONS.map(p => ({ key: p.key, label: p.label })) },
    { key: 'platform', label: '媒体平台', kind: 'select',  options: PLATFORM_OPTIONS },
    { key: 'coopMode', label: '合作模式', kind: 'select',  options: COOP_MODE_OPTIONS },
    { key: 'dept',     label: '部门',     kind: 'select',  options: DEPT_OPTIONS },
    { key: 'sales',    label: '销售',     kind: 'select',  options: SALES_OPTIONS },
  ]
  const [active, setActive] = useState('period')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)
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
            {activeField?.kind === 'chip' && (
              <div className="flex flex-wrap gap-2">
                {activeField.options.map(o => {
                  const active = (values[activeField.key] || 'week') === o.key
                  return (
                    <button key={o.key}
                      onClick={() => set(activeField.key, o.key)}
                      className={`h-7 px-3 rounded-full text-[12px] tap ${
                        active ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
                      }`}>{o.label}</button>
                  )
                })}
              </div>
            )}
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

// ============ 主页面 ============
export default function CustomerHealthPage({ node }) {
  const data = node?.data ?? []

  const [period, setPeriod] = useState('week')
  const [adv, setAdv] = useState(emptyAdv())
  const [advOpen, setAdvOpen] = useState(false)

  const [groupType, setGroupType] = useState('')
  const [subjectType, setSubjectType] = useState('')
  const [keyword, setKeyword] = useState('')
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [refreshKey, setRefreshKey] = useState(0)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast({ type: 'success', message: msg })
    setTimeout(() => setToast(null), 1800)
  }

  const handleRefresh = () => {
    setTimeout(() => {
      setRefreshKey(k => k + 1)
      showToast('刷新成功')
    }, 700)
  }

  // Sheet 提交后同步 period
  const handleAdvClose = () => {
    if (adv.period && adv.period !== period) setPeriod(adv.period)
    setAdvOpen(false)
  }
  const handleAdvReset = () => setAdv(emptyAdv())

  // ============ 全局筛选：影响统计卡 + 列表 ============
  const globalFilteredGroups = useMemo(() => {
    return data.map(g => {
      const filteredSubjects = g.subjects.filter(s => {
        if (adv.platform && !s.platform.includes(adv.platform)) return false
        if (adv.coopMode && s.initOpMode !== adv.coopMode) return false
        if (adv.sales && g.sales !== adv.sales) return false
        if (adv.dept && g.dept !== adv.dept) return false
        return true
      })
      return { ...g, subjects: filteredSubjects }
    }).filter(g => g.subjects.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, adv, refreshKey])

  // ============ 统计卡（基于全局筛选后的数据）============
  const stats = useMemo(() => {
    const cnt = { existing: 0, activeNew: 0, invalid: 0, revisit: 0, paused: 0, churn: 0 }
    globalFilteredGroups.forEach(g => {
      switch (g.groupCustomerType) {
        case '存量客户':   cnt.existing++;   break
        case '活跃新客':   cnt.activeNew++;  break
        case '无效新客':   cnt.invalid++;    break
        case '复投':       cnt.revisit++;    break
        case '停投客户':   cnt.paused++;     break
      }
    })
    const total = globalFilteredGroups.length || 1
    const lost = cnt.invalid + cnt.paused
    cnt.churn = Math.round((lost / total) * 100)
    return cnt
  }, [globalFilteredGroups])

  // ============ 列表筛选（不影响统计卡）============
  const listFiltered = useMemo(() => {
    return globalFilteredGroups.filter(g => {
      if (groupType && g.groupCustomerType !== groupType) return false
      if (subjectType && !g.subjects.some(s => s.customerType === subjectType)) return false
      if (keyword && !g.name.includes(keyword)) return false
      return true
    })
  }, [globalFilteredGroups, groupType, subjectType, keyword])

  const totalPages = Math.max(1, Math.ceil(listFiltered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedGroups = listFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const activeAdvCount = [adv.platform, adv.coopMode, adv.dept, adv.sales].filter(Boolean).length
  const allExpanded = pagedGroups.length > 0 && pagedGroups.every(g => expandedGroups.has(g.name))

  const toggleGroup = (name) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedGroups(prev => {
        const next = new Set(prev)
        pagedGroups.forEach(g => next.delete(g.name))
        return next
      })
    } else {
      setExpandedGroups(prev => {
        const next = new Set(prev)
        pagedGroups.forEach(g => next.add(g.name))
        return next
      })
    }
  }

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* ============ 行 1：周期 chips + 漏斗 ============ */}
      <PeriodRow
        period={period} setPeriod={setPeriod}
        activeCount={activeAdvCount}
        onFunnel={() => setAdvOpen(true)}
      />

      {/* ============ 6 统计卡 ============ */}
      <StatCardsRow stats={stats}/>

      {/* ============ 列表筛选 chips ============ */}
      <TypeChipsRow label="集团客户类型" options={GROUP_TYPE_OPTIONS} value={groupType} onChange={setGroupType}/>
      <TypeChipsRow label="开户主体类型" options={GROUP_TYPE_OPTIONS} value={subjectType} onChange={setSubjectType}/>

      {/* ============ 列表头：搜索 + 全部展开 + 刷新 ============ */}
      <ListHeader
        keyword={keyword} setKeyword={setKeyword}
        allExpanded={allExpanded}
        onToggleAll={toggleAll}
        onRefresh={handleRefresh}
      />

      {/* ============ 集团卡列表 ============ */}
      <div className="mx-3 mt-2 space-y-2">
        {pagedGroups.length === 0
          ? <div className="py-12 text-center text-ink-400 text-[13px]">没有匹配的集团</div>
          : pagedGroups.map(g => (
            <GroupCard key={g.name} group={g} expanded={expandedGroups.has(g.name)} onToggle={() => toggleGroup(g.name)}/>
          ))
        }
      </div>

      {/* ============ 分页 ============ */}
      {listFiltered.length > 0 && (
        <Pagination total={listFiltered.length} page={currentPage} totalPages={totalPages} setPage={setPage}/>
      )}

      {/* ============ Sheet ============ */}
      {advOpen && (
        <AdvancedFilter
          values={adv}
          setValues={setAdv}
          onReset={handleAdvReset}
          onClose={handleAdvClose}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message}/>}
    </div>
  )
}