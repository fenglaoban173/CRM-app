import { useState, useMemo } from 'react'

// ============ 行 1 字段选项（均为搜索框）============
const FIELD_OPTIONS = [
  { key: 'group',   label: '集团' },
  { key: 'subject', label: '开户主体' },
  { key: 'advName', label: '广告主名称' },
]
const DEPT_OPTIONS  = ['全部', '北京-代投一组', '上海-直播组', '北京-本地推组', '深圳-短视频组', '北京-品牌组', '深圳-食品组', '上海-游戏组', '北京-内容组', '北京-电商组', '北京-营销组', '北京-游戏组', '杭州-短视频组', '北京-企业服务组', '成都-教育组', '北京-出行组', '深圳-出行组', '北京-医美组', '成都-医美组', '北京-母婴组', '杭州-服饰组', '北京-金融组', '上海-金融组', '北京-房产组', '深圳-房产组', '成都-培训组', '深圳-跨境组', '广州-跨境组', '上海-本地推组']

const PAGE_SIZE = 15

const emptyAdv = () => ({
  dateFrom: '', dateTo: '', ipStart: '', ipEnd: '',
  group: '', subject: '', advId: '',
  dept: '', costMin: '', costMax: '', ratioMin: '', ratioMax: '',
})

// ============ 2 列 KPI 汇总卡 ============
function SummaryCard({ totalCost, totalOps }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-1 pb-3">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <div className="shrink-0 w-[50%] py-2 px-3 border-r border-ink-100">
            <div className="text-[11px] text-ink-500 leading-tight">非赠款消耗总计(元)</div>
            <div className="text-[18px] font-semibold text-ink-900 mt-1 whitespace-nowrap tabular-nums">
              {totalCost.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="shrink-0 w-[50%] py-2 px-3">
            <div className="text-[11px] text-ink-500 leading-tight">方舟操作次数总计</div>
            <div className="text-[18px] font-semibold text-ink-900 mt-1 whitespace-nowrap tabular-nums">
              {totalOps.toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 行 1：字段切换 + 输入框 + 漏斗 + 导出小按钮 ============
function Row1Search({ fieldKey, onFieldClick, keyword, setKeyword, activeCount, onFunnel, onExport }) {
  const currentLabel = FIELD_OPTIONS.find(f => f.key === fieldKey)?.label || '搜索'
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-2">
      <button
        onClick={onFieldClick}
        className="h-8 px-2.5 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[64px]"
      >
        <span className="truncate">{currentLabel}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="flex-1 bg-ink-50 rounded-full h-8 flex items-center px-3 text-[12px] min-w-0">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder={`搜索${currentLabel}`}
          className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none min-w-0"
        />
      </div>
      <button
        onClick={onFunnel}
        className="w-8 h-8 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0"
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
      <button
        onClick={onExport}
        className="h-8 px-2.5 bg-brand text-white rounded-full text-[12px] flex items-center gap-1 tap active:opacity-90 shrink-0"
        aria-label="导出"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        导出
      </button>
    </div>
  )
}

// ============ ChipRow（单选可取消）============
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

function FilterField({ label, children }) {
  return (
    <div>
      <div className="text-[12px] text-ink-500 mb-2">{label}</div>
      {children}
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

// ============ Sheet 底部按钮（钉钉式 sticky）============
function SheetFooter({ onReset, onClose }) {
  return (
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
  )
}

// ============ 高级筛选 Sheet（左右布局，参考 WorkOrderListPage）============
function AdvancedFilter({ values, setValues, onReset, onClose }) {
  const fields = [
    { key: 'dateRange',   label: '统计日期',      kind: 'daterange' },
    { key: 'group',       label: '集团',          kind: 'input' },
    { key: 'subject',     label: '开户主体',      kind: 'input' },
    { key: 'advId',       label: '广告主ID',      kind: 'input' },
    { key: 'ipRange',     label: '操作IP',        kind: 'iprange' },
    { key: 'dept',        label: '部门',          kind: 'select', options: DEPT_OPTIONS },
    { key: 'costRange',   label: '消耗范围(元)',  kind: 'numrange' },
    { key: 'ratioRange',  label: '自运营占比',    kind: 'numrange', suffix: '%' },
  ]
  const [active, setActive] = useState('dateRange')
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
          {/* 左：字段栏 */}
          <div className="w-[100px] bg-ink-50 overflow-y-auto scrollbar-hide">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>{f.label}</button>
            ))}
          </div>
          {/* 右：字段内容 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input
                value={values[activeField.key] || ''}
                onChange={e => set(activeField.key, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-1">
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(activeField.key, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      values[activeField.key] === opt ? 'border-brand' : 'border-ink-200'
                    }`}>
                      {values[activeField.key] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900 truncate">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="space-y-3">
                <div className="text-[11px] text-ink-500">开始日期</div>
                <input type="date" value={values.dateFrom || ''} onChange={e => set('dateFrom', e.target.value)}
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <div className="text-[11px] text-ink-500">结束日期</div>
                <input type="date" value={values.dateTo || ''} onChange={e => set('dateTo', e.target.value)}
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
            {activeField?.kind === 'iprange' && (
              <div className="space-y-3">
                <div className="text-[11px] text-ink-500">起始 IP</div>
                <input value={values.ipStart || ''} onChange={e => set('ipStart', e.target.value)}
                  placeholder="例如 192.168.1.1"
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <div className="text-[11px] text-ink-500">结束 IP</div>
                <input value={values.ipEnd || ''} onChange={e => set('ipEnd', e.target.value)}
                  placeholder="例如 192.168.1.255"
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
            {activeField?.kind === 'numrange' && (
              <div className="space-y-3">
                <div className="text-[11px] text-ink-500">最小{activeField.suffix || ''}</div>
                <input
                  value={activeField.key === 'costRange' ? (values.costMin || '') : (values.ratioMin || '')}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '')
                    set(activeField.key === 'costRange' ? 'costMin' : 'ratioMin', v)
                  }}
                  placeholder="请输入"
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="text-[11px] text-ink-500">最大{activeField.suffix || ''}</div>
                <input
                  value={activeField.key === 'costRange' ? (values.costMax || '') : (values.ratioMax || '')}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '')
                    set(activeField.key === 'costRange' ? 'costMax' : 'ratioMax', v)
                  }}
                  placeholder="请输入"
                  className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}
          </div>
        </div>
        <SheetFooter onReset={onReset} onClose={onClose}/>
      </div>
    </div>
  )
}

// ============ VPN 使用率三色 ============
function VpnRateBadge({ rate }) {
  const tone = rate <= 30 ? 'danger' : rate <= 60 ? 'warning' : 'success'
  const cls = {
    danger:  'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
  }[tone]
  return (
    <span className={`inline-block text-[12px] font-semibold px-2 py-0.5 rounded ${cls}`}>
      {rate}%
    </span>
  )
}

// ============ 列表卡片 ============
function OperationCard({ item }) {
  return (
    <div className="card overflow-hidden">
      {/* 头部：广告主名称 + 集团 chip */}
      <div className="px-4 py-3">
        <div className="text-[15px] font-medium text-ink-900 truncate">{item.advName}</div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[11px] px-2 py-0.5 bg-ink-50 text-ink-700 rounded">{item.group}</span>
          <span className="text-[11px] px-2 py-0.5 bg-ink-50 text-ink-500 rounded tabular-nums">ID: {item.advId}</span>
        </div>
      </div>
      {/* 数字区（2 列 KV） */}
      <div className="border-t border-ink-100/60 px-4 py-3 grid grid-cols-2 gap-y-3 gap-x-3">
        <Metric label="非赠款消耗(元)" value={item.nonGiftConsumption.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} accent/>
        <Metric label="自运营操作占比"  value={`${item.selfOpRatio}%`}/>
        <Metric label="开户主体"        value={item.subject} small/>
        <Metric label="部门"            value={item.dept} small/>
        <Metric label="销售"            value={item.sales}/>
        <Metric label="IP地址"          value={item.ip} mono/>
      </div>
      {/* VPN 行 */}
      <div className="border-t border-ink-100/60 px-4 py-3 flex items-center justify-between">
        <div className="text-[10px] text-ink-400">VPN 使用率</div>
        <VpnRateBadge rate={item.vpnRate}/>
      </div>
      {/* 底部 */}
      <div className="border-t border-ink-100/60 px-4 py-3 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-3">
          <span className="text-ink-400">方舟操作</span>
          <span className="text-ink-900 font-semibold tabular-nums">{item.arkOps}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-ink-400">非配合操作</span>
          <span className="text-ink-900 font-semibold tabular-nums">{item.nonCoopOps}</span>
        </div>
        <span className="text-ink-400">{item.date}</span>
      </div>
    </div>
  )
}

function Metric({ label, value, accent, small, mono }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] text-ink-400 leading-none">{label}</div>
      <div className={`mt-1.5 truncate ${mono ? 'text-[12px] font-medium text-ink-700 font-mono' : small ? 'text-[12px] text-ink-700' : `text-[15px] font-semibold tabular-nums ${accent ? 'text-brand' : 'text-ink-900'}`}`}>
        {value}
      </div>
    </div>
  )
}

// ============ 钉钉式 Toast ============
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

// ============ 标准 Pagination ============
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
export default function SelfOperationPage({ node }) {
  const data = node?.data ?? []

  const [toast, setToast] = useState(null)
  const [fieldKey, setFieldKey] = useState('group')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [advOpen, setAdvOpen] = useState(false)
  const [adv, setAdv] = useState(emptyAdv())
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => data.filter(d => {
    if (keyword && !(d[fieldKey] || '').includes(keyword)) return false
    if (adv.dateFrom && d.date < adv.dateFrom) return false
    if (adv.dateTo && d.date > adv.dateTo) return false
    if (adv.group && !d.group.includes(adv.group)) return false
    if (adv.subject && !d.subject.includes(adv.subject)) return false
    if (adv.advId && !d.advId.toLowerCase().includes(adv.advId.toLowerCase())) return false
    // IP 区间：起始 ≤ ip ≤ 结束（用字符串字典序等价 IP 数值比较，前缀过滤）
    if (adv.ipStart && d.ip < adv.ipStart) return false
    if (adv.ipEnd && d.ip > adv.ipEnd) return false
    if (adv.dept && adv.dept !== '全部' && d.dept !== adv.dept) return false
    if (adv.costMin && d.nonGiftConsumption < Number(adv.costMin)) return false
    if (adv.costMax && d.nonGiftConsumption > Number(adv.costMax)) return false
    if (adv.ratioMin && d.selfOpRatio < Number(adv.ratioMin)) return false
    if (adv.ratioMax && d.selfOpRatio > Number(adv.ratioMax)) return false
    return true
  }), [data, fieldKey, keyword, adv])

  const totalCost = filtered.reduce((s, x) => s + x.nonGiftConsumption, 0)
  const totalOps  = filtered.reduce((s, x) => s + x.arkOps, 0)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current    = Math.min(page, totalPages)
  const paged      = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const activeAdvCount = Object.values(adv).filter(Boolean).length

  const showToast = (msg) => {
    setToast({ type: 'success', message: msg })
    setTimeout(() => setToast(null), 1800)
  }
  const handleExport = () => showToast('已加入导出队列')

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      <SummaryCard totalCost={totalCost} totalOps={totalOps}/>

      <div className="mx-2 mt-2 card overflow-hidden">
        <Row1Search
          fieldKey={fieldKey}
          onFieldClick={() => setDrawerOpen(true)}
          keyword={keyword}
          setKeyword={setKeyword}
          activeCount={activeAdvCount}
          onFunnel={() => setAdvOpen(true)}
          onExport={handleExport}
        />
      </div>

      <div className="mx-3 mt-3 flex items-center justify-between text-[12px] text-ink-500">
        <span>共 {filtered.length} 条</span>
      </div>

      <div className="mx-3 mt-2 space-y-2">
        {paged.length === 0 ? <EmptyBlock/> : paged.map(item => (
          <OperationCard key={item.id} item={item}/>
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