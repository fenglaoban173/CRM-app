import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../Reports'
import {
  performanceMediaOverview,
  performanceByGroup,
  performanceBySales,
  performanceByPerfOwner,
  performanceByOperator,
} from '../../data/mock'

/**
 * 业绩汇总（App 端）
 * 4 个维度切换：集团 / 销售 / 业绩归属人 / 运营
 * 1 个可见查询：日期范围 + 漏斗（高级筛选）
 * 媒体消耗概览：9 张横向滚动卡
 * 主体内容：
 *   - 集团 → 卡片列表（集团 / 主体 / 合作模式 / 金额）
 *   - 销售 / 业绩归属人 / 运营 → 2 列卡片网格（姓名 + 金额）
 * 导出按钮：TopBar 右侧（复用集团详情样式）
 */

const DIMENSIONS = ['集团', '销售', '业绩归属人', '运营']

const SALES_OPTIONS = ['全部', '杨兴', '李婧怡', '袁芳芳', '赵伟月', '郑萍', '孟丽珊']
const PERF_OWNER_OPTIONS = ['全部', '李婧怡', '袁芳芳', '赵伟月', '郑萍', '李雪', '杨新宇']
const OPERATOR_OPTIONS = ['全部', '邹靖泽', '王佩戴', '邢虹蕾', '孙诗源', '黄亚雄', '张佳宝', '苗苗']
const MEDIA_OPTIONS = ['全部', '头条-AD', '头条-千川', '头条-本地推', '腾讯', '快手', '小红书', '微博']
const DEPT_OPTIONS = ['全部', '销售一部', '销售二部', '销售三部', '媒介部', '成都分公司']
const MODE_OPTIONS = ['全部', '走量', '收量', '自运营']

export default function PerformancePage() {
  const nav = useNavigate()
  const [dim, setDim] = useState('集团')
  const [filterOpen, setFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-08-25' })
  const [adv, setAdv] = useState({
    sales: '全部', perfOwner: '全部', operator: '全部',
    group: '', subject: '', media: '全部', dept: '全部', mode: '全部',
  })
  // 分页（每个维度独立维护页码）
  const [pages, setPages] = useState({ 集团: 1, 销售: 1, 业绩归属人: 1, 运营: 1 })

  // 切换维度时重置页码
  useEffect(() => { setPages(p => ({ ...p, [dim]: 1 })) }, [dim])

  // 高级筛选 active 计数
  const advCount = useMemo(() => {
    return Object.entries(adv).filter(([k, v]) => v && v !== '全部' && v !== '').length
  }, [adv])

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar
        title="业绩汇总"
        right={
          <button className="h-7 px-3 bg-brand text-white rounded text-[12px] flex items-center gap-1 tap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            导出
          </button>
        }
      />

      {/* 维度 Tab */}
      <div className="bg-white border-b border-ink-100">
        <div className="px-3 flex items-center overflow-x-auto scrollbar-hide">
          {DIMENSIONS.map(d => (
            <button key={d} onClick={() => setDim(d)}
              className={`relative shrink-0 h-10 px-4 text-[13px] tap ${
                dim === d ? 'text-brand font-medium' : 'text-ink-700'
              }`}>
              {d}
              {dim === d && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-[2px] bg-brand rounded-full"/>}
            </button>
          ))}
        </div>
      </div>

      {/* 查询行：日期 + 漏斗 */}
      <div className="px-3 pt-3 flex items-center gap-2">
        <button onClick={() => openDatePicker(dateRange, setDateRange)}
          className="flex-1 h-9 bg-white rounded-full flex items-center px-3 border border-ink-100 tap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="#666" strokeWidth="1.6"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke="#666" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span className="text-[13px] text-ink-900 ml-1.5 flex-1 text-left truncate">
            {dateRange.start} ~ {dateRange.end}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-1 shrink-0">
            <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={() => setFilterOpen(true)}
          className="relative h-9 w-9 bg-white rounded-full flex items-center justify-center border border-ink-100 tap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16l-6 8v6l-4 2v-8L4 5z" stroke="#666" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
          {advCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{advCount}</span>
          )}
        </button>
      </div>

      {/* 媒体消耗概览（横向滚动） */}
      <div className="mt-3">
        <div className="px-3 flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-3.5 bg-brand rounded-sm"/>
            <span className="text-[13px] font-medium text-ink-900">媒体消耗概览</span>
          </div>
          <span className="text-[10px] text-ink-400">按媒体平台汇总，总消耗与赠款/非赠款、日均消耗一目了然</span>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-3 pb-1">
            {performanceMediaOverview.map(m => (
              <MediaCard key={m.key} m={m}/>
            ))}
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="mt-3">
        {dim === '集团' && (
          <GroupList
            adv={adv}
            page={pages[dim]}
            setPage={(p) => setPages(s => ({ ...s, [dim]: p }))}
          />
        )}
        {(dim === '销售' || dim === '业绩归属人' || dim === '运营') && (
          <PersonGrid
            data={getDimData(dim)}
            title={dim}
            total={getDimData(dim).reduce((s, x) => s + x.amount, 0)}
            page={pages[dim]}
            setPage={(p) => setPages(s => ({ ...s, [dim]: p }))}
          />
        )}
      </div>

      {/* 高级筛选 Sheet */}
      {filterOpen && (
        <AdvancedFilter adv={adv} setAdv={setAdv} onClose={() => setFilterOpen(false)}/>
      )}
    </div>
  )
}

// ============ 媒体卡 ============
function MediaCard({ m }) {
  return (
    <div className={`shrink-0 w-[180px] rounded-xl p-3 ${
      m.highlight ? 'bg-brand/5 border border-brand/30' : 'bg-white border border-ink-100'
    }`}>
      <div className="text-[12px] text-ink-700 font-medium">{m.label}</div>
      <div className="mt-1.5">
        <div className="text-[10px] text-ink-400">非赠款消耗</div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className={`text-[20px] font-semibold leading-none ${m.highlight ? 'text-brand' : 'text-ink-900'}`}>{m.nonGift}</span>
          <span className="text-[11px] text-ink-400">万</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2.5 pt-2 border-t border-ink-100/60">
        <SubMetric label="总消耗" value={`${m.total} 万`}/>
        <SubMetric label="赠款消耗" value={`${m.gift} 万`}/>
        <SubMetric label="日均消耗" value={`${m.daily} 万`}/>
        <SubMetric label="环比" value={`${m.qoq.toFixed(2)}%`} valueClass={m.qoq < 0 ? 'text-danger' : ''}/>
      </div>
    </div>
  )
}

function SubMetric({ label, value, valueClass = '' }) {
  return (
    <div>
      <div className="text-[9px] text-ink-400 leading-none">{label}</div>
      <div className={`text-[11px] text-ink-700 mt-0.5 ${valueClass}`}>{value}</div>
    </div>
  )
}

// ============ 集团卡片列表 ============
function GroupList({ adv, page, setPage }) {
  const filtered = useMemo(() => {
    return performanceByGroup.filter(g => {
      if (adv.group && !g.group.includes(adv.group)) return false
      if (adv.subject && !g.subject.includes(adv.subject)) return false
      if (adv.mode !== '全部' && !g.mode.includes(adv.mode)) return false
      return true
    })
  }, [adv])

  const PAGE_SIZE = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  if (filtered.length === 0) {
    return <EmptyBlock/>
  }

  return (
    <div>
      <div className="px-3 space-y-2">
        {paged.map((g, i) => (
          <div key={i} className="card px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-ink-900 truncate">{g.group}</div>
                <div className="text-[11px] text-ink-500 mt-1 truncate">{g.subject}</div>
                <div className="mt-2">
                  <span className="text-[11px] px-2 py-0.5 bg-ink-50 text-ink-700 rounded">{g.mode}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[10px] text-ink-400">非赠款消耗</div>
                <div className="text-[16px] font-semibold text-ink-900 mt-0.5 tabular-nums">{formatAmount(g.amount)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination total={filtered.length} page={current} totalPages={totalPages} pageSize={PAGE_SIZE} setPage={setPage}/>
    </div>
  )
}

// ============ 个人维度卡片网格（销售/业绩归属人/运营）============
function PersonGrid({ data, title, total, page, setPage }) {
  const PAGE_SIZE = 15
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = data.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div>
      {/* 顶部汇总条 */}
      <div className="mx-3 card px-4 py-2.5 flex items-center justify-between">
        <div className="text-[12px] text-ink-500">本维度汇总</div>
        <div className="flex items-baseline gap-1">
          <span className="text-[16px] font-semibold text-ink-900 tabular-nums">{formatAmount(total)}</span>
          <span className="text-[10px] text-ink-400">元</span>
        </div>
      </div>

      <div className="px-3 mt-2 grid grid-cols-2 gap-2">
        {paged.map((p, i) => (
          <div key={i} className="card px-3 py-3">
            <div className="text-[13px] text-ink-700 truncate">{p.name}</div>
            <div className="text-[10px] text-ink-400 mt-0.5">非赠款消耗（元）</div>
            <div className="text-[18px] font-semibold text-ink-900 mt-1 tabular-nums">{formatAmount(p.amount)}</div>
          </div>
        ))}
      </div>

      <Pagination total={data.length} page={current} totalPages={totalPages} pageSize={PAGE_SIZE} setPage={setPage}/>
    </div>
  )
}

function getDimData(dim) {
  switch (dim) {
    case '销售': return performanceBySales
    case '业绩归属人': return performanceByPerfOwner
    case '运营': return performanceByOperator
    default: return []
  }
}

function EmptyBlock() {
  return (
    <div className="mx-3 card py-12 text-center">
      <div className="text-[13px] text-ink-400">没有匹配的数据</div>
    </div>
  )
}

// ============ 日期选择（原生 picker）============
function openDatePicker(current, setDateRange) {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 z-[60] bg-black/40 flex items-center justify-center'
  modal.innerHTML = `
    <div class="bg-white rounded-2xl w-[90%] max-w-md mx-auto overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-ink-100">
        <h2 class="text-[15px] font-medium text-ink-900">选择统计日期</h2>
        <button id="dp-close" class="w-7 h-7 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="#999" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="px-4 py-4 space-y-3">
        <div>
          <label class="text-[12px] text-ink-500 block mb-1">开始日期</label>
          <input id="dp-start" type="date" value="${current.start}" class="w-full h-10 px-3 bg-ink-50 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-brand"/>
        </div>
        <div>
          <label class="text-[12px] text-ink-500 block mb-1">结束日期</label>
          <input id="dp-end" type="date" value="${current.end}" class="w-full h-10 px-3 bg-ink-50 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-brand"/>
        </div>
      </div>
      <div class="flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
        <button id="dp-cancel" class="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[13px] text-ink-700">取 消</button>
        <button id="dp-confirm" class="flex-1 h-10 bg-brand text-white rounded-full text-[13px]">确 认</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  const close = () => modal.remove()
  modal.querySelector('#dp-close').onclick = close
  modal.querySelector('#dp-cancel').onclick = close
  modal.querySelector('#dp-confirm').onclick = () => {
    const s = modal.querySelector('#dp-start').value
    const e = modal.querySelector('#dp-end').value
    if (s && e) setDateRange({ start: s, end: e })
    close()
  }
  modal.addEventListener('click', e => { if (e.target === modal) close() })
}

// ============ 高级筛选 Sheet ============
function AdvancedFilter({ adv, setAdv, onClose }) {
  const fields = [
    { key: 'sales', label: '销售', kind: 'select', options: ['全部', ...SALES_OPTIONS.slice(1)] },
    { key: 'perfOwner', label: '业绩归属人', kind: 'select', options: ['全部', ...PERF_OWNER_OPTIONS.slice(1)] },
    { key: 'operator', label: '运营人员', kind: 'select', options: ['全部', ...OPERATOR_OPTIONS.slice(1)] },
    { key: 'group', label: '集团', kind: 'input', placeholder: '请选择集团' },
    { key: 'subject', label: '客户主体', kind: 'input', placeholder: '请输入客户主体' },
    { key: 'media', label: '媒体平台', kind: 'select', options: MEDIA_OPTIONS },
    { key: 'dept', label: '销售部门', kind: 'select', options: DEPT_OPTIONS },
    { key: 'mode', label: '合作模式', kind: 'select', options: MODE_OPTIONS },
  ]
  const [active, setActive] = useState('sales')
  const activeField = fields.find(f => f.key === active)
  const set = (k, v) => setAdv(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setAdv({ sales: '全部', perfOwner: '全部', operator: '全部', group: '', subject: '', media: '全部', dept: '全部', mode: '全部' })
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">更多筛选</h2>
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
                placeholder={activeField.placeholder}
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
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap">取 消</button>
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-500 tap">重置筛选</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

function formatAmount(v) {
  if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿'
  if (v >= 10000) return (v / 10000).toFixed(2) + '万'
  return v.toFixed(2)
}

// ============ 分页器（App 标准）============
function Pagination({ total, page, totalPages, pageSize = 15, setPage }) {
  const [jumpVal, setJumpVal] = useState('')

  // 生成可见页码（最多展示 5 个）
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
    <>
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button onClick={() => go(page - 1)} disabled={page === 1}
          className={`w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap ${page === 1 ? 'opacity-40' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {visible[0] > 1 && (
          <>
            <button onClick={() => go(1)} className="w-8 h-8 rounded-full bg-white border border-ink-200 tap">1</button>
            {visible[0] > 2 && <span className="text-ink-400 px-1">...</span>}
          </>
        )}
        {visible.map(p => (
          <button key={p} onClick={() => go(p)}
            className={`w-8 h-8 rounded-full flex items-center justify-center tap ${
              p === page ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'
            }`}>{p}</button>
        ))}
        {visible[visible.length - 1] < totalPages && (
          <>
            {visible[visible.length - 1] < totalPages - 1 && <span className="text-ink-400 px-1">...</span>}
            <button onClick={() => go(totalPages)} className="w-8 h-8 rounded-full bg-white border border-ink-200 tap">{totalPages}</button>
          </>
        )}
        <button onClick={() => go(page + 1)} disabled={page === totalPages}
          className={`w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap ${page === totalPages ? 'opacity-40' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <span>{pageSize}条/页</span>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
        <span className="text-ink-300">|</span>
        <span className="flex items-center gap-1">
          前往
          <input
            value={jumpVal}
            onChange={e => setJumpVal(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => { if (e.key === 'Enter') { go(Number(jumpVal)); setJumpVal('') } }}
            className="w-8 h-6 border border-ink-200 rounded text-center text-[11px] outline-none focus:border-brand"
            placeholder={String(page)}
          />
          页
        </span>
      </div>
    </>
  )
}