import { useState, useMemo } from 'react'

// ============ 行 1 字段选项 ============
const FIELD_OPTIONS = [
  { key: 'group',   label: '集团名称' },
  { key: 'subject', label: '开户主体' },
]
const PLATFORM_OPTIONS  = ['全部', 'AD', '千川', '本地推']
const WEEK_COST_OPTIONS = ['全部', '有消耗', '无消耗']
const DAYS_OPTIONS      = ['全部', '大于7天', '小于等于7天']
const PAY_TYPE_OPTIONS  = ['全部', '预付', '垫款']
const COOP_OPTIONS      = ['全部', '走量', '包断', '自运营']

const PAGE_SIZE = 15

const emptyAdv = () => ({
  platform: '', weekCost: '', availableDays: '', payType: '', coopMode: '', group: '', subject: '',
})

// ============ 2 列 KPI 汇总卡 ============
function SummaryCard({ totalBalance, totalCost }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-1 pb-3">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <div className="shrink-0 w-[50%] py-2 px-3 border-r border-ink-100">
            <div className="text-[11px] text-ink-500 leading-tight">实时余额总计</div>
            <div className="text-[18px] font-semibold text-ink-900 mt-1 whitespace-nowrap">
              {totalBalance.toFixed(2)} 万
            </div>
          </div>
          <div className="shrink-0 w-[50%] py-2 px-3">
            <div className="text-[11px] text-ink-500 leading-tight">昨日消耗总计</div>
            <div className="text-[18px] font-semibold text-ink-900 mt-1 whitespace-nowrap">
              {totalCost.toFixed(2)} 万
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 行 1：字段切换 + 输入框 + 漏斗按钮 ============
function Row1Search({ fieldKey, onFieldClick, keyword, setKeyword, activeCount, onFunnel }) {
  const currentLabel = FIELD_OPTIONS.find(f => f.key === fieldKey)?.label || '搜索'
  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <button
        onClick={onFieldClick}
        className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]"
      >
        <span className="truncate">{currentLabel}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder={`搜索${currentLabel}`}
          className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>
      <button
        onClick={onFunnel}
        className="w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0"
        aria-label="更多筛选"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#4E5969" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  )
}

// ============ 操作行：刷新余额 + 导出 ============
function ActionRow({ onRefresh, onExport }) {
  return (
    <div className="mx-3 mt-3 flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="flex-1 h-9 bg-white border border-ink-200 text-ink-700 rounded-full text-[13px] flex items-center justify-center gap-1.5 tap active:bg-ink-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3M21 4v5h-5M3 20v-5h5"
            stroke="#4E5969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        刷新余额
      </button>
      <button
        onClick={onExport}
        className="flex-1 h-9 bg-brand text-white rounded-full text-[13px] flex items-center justify-center gap-1.5 tap active:opacity-90"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        导出
      </button>
    </div>
  )
}

// ============ ChipSelect（行 2 下拉 chip）============
function ChipSelect({ value, onChange, placeholder, options }) {
  const [open, setOpen] = useState(false)
  const isActive = !!value
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className={`h-9 px-3 rounded-full text-[12px] flex items-center gap-1 tap min-w-[80px] border ${
          isActive ? 'bg-brand/10 text-brand border-brand/30' : 'bg-ink-50 text-ink-500 border-transparent'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute top-full left-0 mt-1 bg-white border border-ink-100 rounded-lg shadow-lg z-50 min-w-[120px] max-h-[200px] overflow-y-auto py-1">
            {options.map(o => (
              <button
                key={o}
                onClick={() => { onChange(o === '全部' ? '' : o); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12px] tap ${
                  (value || '全部') === o ? 'text-brand bg-brand/5 font-medium' : 'text-ink-700'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============ FieldDrawer（行 1 字段切换抽屉）============
function FieldDrawer({ currentKey, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[60vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">选择字段</h2>
          <button onClick={onClose} className="w-7 h-7 tap" aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-ink-50">
          {FIELD_OPTIONS.map(f => (
            <button
              key={f.key}
              onClick={() => { onSelect(f.key); onClose() }}
              className={`w-full px-3 py-3 text-left text-[13px] tap border-l-2 ${
                currentKey === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 高级筛选 Sheet（单列堆叠）============
function AdvancedFilter({ values, setValues, onReset, onClose }) {
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const chipRow = (key, label, options) => (
    <FilterField label={label}>
      <ChipRow options={options} value={values[key]} onChange={v => set(key, v)}/>
    </FilterField>
  )
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">更多筛选</h2>
          <button onClick={onClose} className="w-7 h-7 tap" aria-label="关闭">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="#4E5969" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {chipRow('platform',      '端口',         PLATFORM_OPTIONS)}
          {chipRow('weekCost',      '近7日消耗',    WEEK_COST_OPTIONS)}
          {chipRow('availableDays', '余额可用天数', DAYS_OPTIONS)}
          {chipRow('payType',       '付款方式',     PAY_TYPE_OPTIONS)}
          {chipRow('coopMode',      '合作模式',     COOP_OPTIONS)}
          <FilterField label="集团名称">
            <input
              value={values.group}
              onChange={e => set('group', e.target.value)}
              placeholder="请输入集团名称"
              className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </FilterField>
          <FilterField label="开户主体">
            <input
              value={values.subject}
              onChange={e => set('subject', e.target.value)}
              placeholder="请输入开户主体"
              className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </FilterField>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button
            onClick={onReset}
            className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap active:bg-ink-50"
          >重置筛选</button>
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap active:opacity-90"
          >确  定</button>
        </div>
      </div>
    </div>
  )
}

function FilterField({ label, children }) {
  return (
    <div>
      <div className="text-[12px] text-ink-500 mb-2">{label}</div>
      {children}
    </div>
  )
}

function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(value === o ? '' : o)}
          className={`h-7 px-3 rounded-full text-[12px] tap ${
            (value || '全部') === o ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

// ============ 余额可用天数三色 ============
function AvailableDaysBadge({ days }) {
  const tone = days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'success'
  const cls = {
    danger:  'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
  }[tone]
  return (
    <span className={`inline-block text-[12px] font-semibold px-2 py-0.5 rounded ${cls}`}>
      {days} 天
    </span>
  )
}

// ============ 列表卡片 ============
function BalanceCard({ item }) {
  return (
    <div className="card overflow-hidden">
      {/* 头部：集团 + 端口 chip */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium text-ink-900 truncate">{item.group}</div>
          <div className="text-[12px] text-ink-500 mt-1 truncate">{item.subject}</div>
          <div className="mt-1.5">
            <span className="text-[11px] px-2 py-0.5 bg-ink-50 text-ink-700 rounded">{item.coopMode}</span>
          </div>
        </div>
        <span className="shrink-0 text-[11px] px-2 py-0.5 bg-brand/10 text-brand border border-brand/30 rounded-full">
          {item.platform}
        </span>
      </div>
      {/* 数字区（2 列 KV） */}
      <div className="border-t border-ink-100/60 px-4 py-3 grid grid-cols-2 gap-y-3 gap-x-3">
        <Metric label="前一日余额(万)" value={item.yesterdayBalance.toFixed(2)}/>
        <Metric label="昨日消耗(万)"    value={item.yesterdayCost.toFixed(2)}/>
        <Metric label="近7日消耗(万)"   value={item.weekCost.toFixed(2)} accent/>
        <div>
          <div className="text-[10px] text-ink-400 leading-none">余额可用天数</div>
          <div className="mt-1.5">
            <AvailableDaysBadge days={item.availableDays}/>
          </div>
        </div>
      </div>
      {/* 底部 */}
      <div className="px-4 pb-3 flex items-center justify-between text-[11px] text-ink-400">
        <span>{item.payType}</span>
        <span>{item.date}</span>
      </div>
    </div>
  )
}

function Metric({ label, value, accent }) {
  return (
    <div>
      <div className="text-[10px] text-ink-400 leading-none">{label}</div>
      <div className={`mt-1.5 text-[15px] font-semibold tabular-nums ${accent ? 'text-brand' : 'text-ink-900'}`}>
        {value}
      </div>
    </div>
  )
}

// ============ 钉钉式 Toast（黑底居中 ✓）============
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

// ============ 标准 Pagination（与 PerformancePage 一致）============
function Pagination({ total, page, totalPages, pageSize = PAGE_SIZE, setPage }) {
  const [jumpVal, setJumpVal] = useState('')
  const visible = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, 4, 5]
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [page - 2, page - 1, page, page + 1, page + 2]
  }, [page, totalPages])
  const go = (p) => {
    const n = Math.max(1, Math.min(totalPages, p))
    setPage(n)
  }
  return (
    <div className="mx-3 mt-3 pb-2">
      <div className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
          aria-label="上一页"
        >
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
          <button
            key={n}
            onClick={() => go(n)}
            className={`w-8 h-8 rounded-full text-[12px] tap ${n === page ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}
          >{n}</button>
        ))}
        {visible[visible.length - 1] < totalPages && (
          <>
            {visible[visible.length - 1] < totalPages - 1 && <span className="text-ink-400 px-1">…</span>}
            <button onClick={() => go(totalPages)} className="w-8 h-8 rounded-full bg-white border border-ink-200 text-[12px] text-ink-700 tap">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-full border border-ink-200 flex items-center justify-center disabled:opacity-40 bg-white tap"
          aria-label="下一页"
        >
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
        <input
          value={jumpVal}
          onChange={e => setJumpVal(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => {
            if (e.key === 'Enter' && jumpVal) {
              go(Number(jumpVal))
              setJumpVal('')
            }
          }}
          placeholder={String(page)}
          className="w-8 h-6 border border-ink-200 rounded text-center text-[11px] focus:outline-none focus:border-brand"
        />
        <span>页</span>
      </div>
    </div>
  )
}

// ============ 空状态 ============
function EmptyBlock() {
  return (
    <div className="py-12 text-center text-ink-400 text-[13px]">没有匹配的数据</div>
  )
}

// ============ 主页面 ============
export default function ToutiaoBalancePage({ node }) {
  const data = node?.data ?? []

  const [refreshKey, setRefreshKey] = useState(0)
  const [toast, setToast] = useState(null)
  const [fieldKey, setFieldKey] = useState('group')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [advOpen, setAdvOpen] = useState(false)
  const [adv, setAdv] = useState(emptyAdv())
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => data.filter(d => {
    if (keyword && !(d[fieldKey] || '').includes(keyword)) return false
    if (adv.platform && d.platform !== adv.platform) return false
    if (adv.weekCost === '有消耗' && !(d.weekCost > 0)) return false
    if (adv.weekCost === '无消耗' && d.weekCost > 0) return false
    if (adv.availableDays === '大于7天' && !(d.availableDays > 7)) return false
    if (adv.availableDays === '小于等于7天' && d.availableDays > 7) return false
    if (adv.payType && d.payType !== adv.payType) return false
    if (adv.coopMode && d.coopMode !== adv.coopMode) return false
    if (adv.group && !d.group.includes(adv.group)) return false
    if (adv.subject && !d.subject.includes(adv.subject)) return false
    return true
  }), [data, fieldKey, keyword, adv, refreshKey])

  const totalBalance = filtered.reduce((s, x) => s + x.yesterdayBalance, 0)
  const totalCost    = filtered.reduce((s, x) => s + x.yesterdayCost, 0)
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current      = Math.min(page, totalPages)
  const paged        = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const activeAdvCount = Object.values(adv).filter(Boolean).length

  const showToast = (msg) => {
    setToast({ type: 'success', message: msg })
    setTimeout(() => setToast(null), 1800)
  }
  const handleRefresh = () => {
    setTimeout(() => {
      setRefreshKey(k => k + 1)
      showToast('刷新余额成功')
    }, 700)
  }
  const handleExport = () => showToast('已加入导出队列')

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      <SummaryCard totalBalance={totalBalance} totalCost={totalCost}/>

      <div className="mx-3 mt-3 card overflow-hidden">
        <Row1Search
          fieldKey={fieldKey}
          onFieldClick={() => setDrawerOpen(true)}
          keyword={keyword}
          setKeyword={setKeyword}
          activeCount={activeAdvCount}
          onFunnel={() => setAdvOpen(true)}
        />
      </div>

      <ActionRow onRefresh={handleRefresh} onExport={handleExport}/>

      <div className="mx-3 mt-3 flex items-center justify-between text-[12px] text-ink-500">
        <span>共 {filtered.length} 条</span>
      </div>

      <div className="mx-3 mt-2 space-y-2">
        {paged.length === 0 ? <EmptyBlock/> : paged.map(item => (
          <BalanceCard key={item.id} item={item}/>
        ))}
      </div>

      {filtered.length > 0 && (
        <Pagination total={filtered.length} page={current} totalPages={totalPages} setPage={setPage}/>
      )}

      {drawerOpen && (
        <FieldDrawer
          currentKey={fieldKey}
          onSelect={setFieldKey}
          onClose={() => setDrawerOpen(false)}
        />
      )}
      {advOpen && (
        <AdvancedFilter
          values={adv}
          setValues={setAdv}
          onReset={() => setAdv(emptyAdv())}
          onClose={() => setAdvOpen(false)}
        />
      )}
      {toast && <Toast type={toast.type} message={toast.message}/>}
    </div>
  )
}