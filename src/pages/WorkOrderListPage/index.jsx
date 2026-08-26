import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../Reports'
import { workOrdersData } from '../../data/mock'

/**
 * 工单记录（App 端）
 * - 4 个统计卡（工单总数 / 处理中 / 已完成 / 已关闭）
 * - 1 个可见查询：关键字 input + 漏斗（高级筛选）
 * - 状态 Tab：全部 / 处理中 / 已完成 / 已关闭
 * - 卡片列表（工单号 + 类型 + 状态）
 * - FAB：提交工单
 */

const STATUS_TABS = ['全部', '处理中', '已完成', '已关闭']
const TYPE_OPTIONS = ['全部', '系统问题', '业务问题']
const SYSTEM_OPTIONS = ['全部', '人事行政OA系统', 'CRM系统', '央广控制台']
const DEPT_OPTIONS = ['全部', '技术部', '人事行政部', '媒介部', '成都分公司']
const STATUS_OPTIONS = ['全部', '处理中', '已完成', '已关闭']

const STATUS_TAG = {
  '处理中': 'bg-warning/10 text-warning',
  '已完成': 'bg-success/10 text-success',
  '已关闭': 'bg-ink-100 text-ink-500',
}

const TYPE_COLOR = {
  '系统问题': { bg: '#FFE9E9', fg: '#FF5A5A' },
  '业务问题': { bg: '#E8F8EA', fg: '#34A853' },
}

export default function WorkOrderListPage() {
  const nav = useNavigate()

  // 列表数据 + 已提交工单合并
  const [list, setList] = useState(() => {
    try { return [...JSON.parse(localStorage.getItem('wo_submitted') || '[]'), ...workOrdersData] }
    catch { return workOrdersData }
  })

  // 查询状态
  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState('全部')
  const [filterOpen, setFilterOpen] = useState(false)
  const [adv, setAdv] = useState({
    type: '全部', system: '全部', dept: '全部', status: '全部',
    submitter: '', startDate: '', endDate: '',
  })

  const stats = useMemo(() => {
    const total = list.length
    const processing = list.filter(x => x.status === '处理中').length
    const done = list.filter(x => x.status === '已完成').length
    const closed = list.filter(x => x.status === '已关闭').length
    return { total, processing, done, closed }
  }, [list])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return list.filter(o => {
      // Tab
      if (activeTab !== '全部' && o.status !== activeTab) return false
      // Keyword (工单号 / 问题描述)
      if (kw && !(o.id.toLowerCase().includes(kw) || (o.desc || '').toLowerCase().includes(kw))) return false
      // Advanced
      if (adv.type !== '全部' && o.type !== adv.type) return false
      if (adv.system !== '全部' && o.system !== adv.system) return false
      if (adv.dept !== '全部' && o.dept !== adv.dept) return false
      if (adv.status !== '全部' && o.status !== adv.status) return false
      if (adv.submitter && !o.submitter.includes(adv.submitter)) return false
      if (adv.startDate && o.createdAt < adv.startDate) return false
      if (adv.endDate && o.createdAt > `${adv.endDate} 23:59:59`) return false
      return true
    })
  }, [list, keyword, activeTab, adv])

  // 高级筛选 active 计数
  const advCount = useMemo(() => {
    return Object.entries(adv).filter(([k, v]) => v && v !== '全部' && k !== 'status').length +
      (adv.status !== '全部' ? 1 : 0)
  }, [adv])

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="工单记录"/>

      {/* ============ 4 个统计卡 ============ */}
      <div className="px-3 pt-3">
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon="doc"  color="#2D7FF9" label="工单总数" value={stats.total}/>
          <StatCard icon="spin" color="#FF9A3C" label="处理中"   value={stats.processing}/>
          <StatCard icon="done" color="#34A853" label="已完成"   value={stats.done}/>
          <StatCard icon="x"    color="#86909C" label="已关闭"   value={stats.closed}/>
        </div>
      </div>

      {/* ============ 查询行：关键字 + 漏斗 ============ */}
      <div className="px-3 pt-3 flex items-center gap-2">
        <div className="flex-1 h-9 bg-white rounded-full flex items-center px-3 border border-ink-100">
          <SearchIcon/>
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="关键字：工单编号 / 问题描述"
            className="flex-1 appearance-none bg-transparent border-0 outline-none text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0 ml-1.5"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="tap p-0.5 -mr-1 text-ink-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#D1D5DB"/>
                <path d="M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        <button onClick={() => setFilterOpen(true)}
          className="relative h-9 w-9 bg-white rounded-full flex items-center justify-center border border-ink-100 tap">
          <FunnelIcon/>
          {advCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{advCount}</span>
          )}
        </button>
      </div>

      {/* ============ 状态 Tab ============ */}
      <div className="bg-white border-b border-ink-100 mt-3">
        <div className="px-3 flex items-center">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`relative h-10 px-3 text-[13px] tap ${activeTab === t ? 'text-brand font-medium' : 'text-ink-700'}`}>
              {t}
              {activeTab === t && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-[2px] bg-brand rounded-full"/>}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-ink-400 pr-1">共 {filtered.length} 条</span>
        </div>
      </div>

      {/* ============ 卡片列表 ============ */}
      <div className="px-3 pt-3 space-y-2.5">
        {filtered.length === 0 && (
          <div className="card py-12 text-center">
            <div className="text-[13px] text-ink-400">没有匹配的工单</div>
          </div>
        )}
        {filtered.map(o => (
          <button key={o.id} onClick={() => nav(`/me/workorder/detail/${o.id}`)}
            className="card w-full px-4 py-3.5 text-left tap active:bg-ink-50 block">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-ink-900 truncate flex-1">{o.id}</span>
              <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded ${STATUS_TAG[o.status] || ''}`}>{o.status}</span>
            </div>
            <div className="mt-2">
              <TypeChip type={o.type}/>
            </div>
          </button>
        ))}
      </div>

      {/* ============ FAB 提交工单 ============ */}
      <button onClick={() => nav('/me/workorder/create')}
        className="fixed right-5 bottom-20 z-40 h-12 px-5 rounded-full bg-brand text-white text-[14px] font-medium shadow-[0_4px_16px_rgba(45,127,249,0.4)] flex items-center gap-1.5 tap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        提交工单
      </button>

      {/* ============ 高级筛选 Sheet ============ */}
      {filterOpen && (
        <AdvancedFilter
          adv={adv}
          setAdv={setAdv}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  )
}

// ============ 统计卡 ============
function StatCard({ icon, color, label, value }) {
  return (
    <div className="bg-white rounded-lg py-2.5 px-2 flex flex-col items-center">
      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-1" style={{ background: `${color}15` }}>
        <StatIcon name={icon} color={color}/>
      </div>
      <div className="text-[18px] font-semibold text-ink-900 leading-none">{value}</div>
      <div className="text-[10px] text-ink-400 mt-1">{label}</div>
    </div>
  )
}

function StatIcon({ name, color }) {
  const s = { stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  switch (name) {
    case 'doc':
      return <svg width="14" height="14" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1.5" {...s}/><path d="M9 8h6M9 12h6M9 16h4" {...s}/></svg>
    case 'spin':
      return <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 4a8 8 0 100 16 8 8 0 000-16z" {...s}/><path d="M12 8v4l3 2" {...s}/></svg>
    case 'done':
      return <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s}/><path d="M8 12l3 3 5-6" {...s}/></svg>
    case 'x':
      return <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s}/><path d="M9 9l6 6M15 9l-6 6" {...s}/></svg>
  }
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
      <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function FunnelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16l-6 8v6l-4 2v-8L4 5z" stroke="#666" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

function TypeChip({ type }) {
  const c = TYPE_COLOR[type] || { bg: '#F0F2F5', fg: '#666' }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded"
      style={{ background: c.bg, color: c.fg }}>
      <span className="w-1 h-1 rounded-full" style={{ background: c.fg }}/>
      {type}
    </span>
  )
}

// ============ 高级筛选 Sheet ============
function AdvancedFilter({ adv, setAdv, onClose }) {
  const fields = [
    { key: 'type', label: '工单类型', kind: 'select', options: TYPE_OPTIONS },
    { key: 'system', label: '归属系统', kind: 'select', options: SYSTEM_OPTIONS },
    { key: 'dept', label: '归属部门', kind: 'select', options: DEPT_OPTIONS },
    { key: 'status', label: '状态', kind: 'select', options: STATUS_OPTIONS },
    { key: 'submitter', label: '提交人', kind: 'input' },
    { key: 'createdRange', label: '创建时间', kind: 'daterange' },
  ]
  const [active, setActive] = useState('type')
  const set = (k, v) => setAdv(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

  const handleReset = () => {
    setAdv({ type: '全部', system: '全部', dept: '全部', status: '全部', submitter: '', startDate: '', endDate: '' })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
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
              <input value={adv[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-1">
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      adv[active] === opt ? 'border-brand' : 'border-ink-200'
                    }`}>
                      {adv[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={adv.startDate || ''} onChange={e => set('startDate', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={adv.endDate || ''} onChange={e => set('endDate', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}