import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { materialPurchasesData, materialPurchaseApprovalNodesData, colorMap } from '../../data/mock'

/**
 * 素材采买详情页
 * 来源：PC 端素材采买详情（图4）
 * 区块：基础头部 / 客户与需求 / 预算 / 视频类型 / 申请信息 / 审批流
 */
export default function MaterialPurchaseDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = materialPurchasesData.find(p => p.id === id) || materialPurchasesData[0]

  const [openCustomer, setOpenCustomer] = useState(true)
  const [openBudget, setOpenBudget] = useState(true)
  const [openVideo, setOpenVideo] = useState(true)
  const [openApplication, setOpenApplication] = useState(true)
  const [openApproval, setOpenApproval] = useState(true)

  const nodes = materialPurchaseApprovalNodesData[item.id] || []

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="素材采买详情" onBack={() => nav(-1)}/>

      <div className="pt-3 space-y-3">
        <HeaderSection item={item}/>
        <CustomerSection open={openCustomer} onToggle={() => setOpenCustomer(o => !o)} item={item}/>
        <BudgetSection open={openBudget} onToggle={() => setOpenBudget(o => !o)} item={item}/>
        <VideoSection open={openVideo} onToggle={() => setOpenVideo(o => !o)} item={item}/>
        <ApplicationSection open={openApplication} onToggle={() => setOpenApplication(o => !o)} item={item}/>
        <ApprovalSection open={openApproval} onToggle={() => setOpenApproval(o => !o)} nodes={nodes} finalStatus={item.approval}/>
      </div>
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ title, onBack }) {
  return (
    <div className="bg-brand text-white sticky top-0 z-30">
      <div className="px-2 h-12 flex items-center relative">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center tap relative z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
      </div>
    </div>
  )
}

// ============ 可折叠 Section ============
function CollapsibleSection({ title, open, onToggle, children, extra }) {
  return (
    <div className="mx-3 card overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between tap">
        <div className="flex items-center gap-2">
          <span className="inline-block w-[3px] h-4 bg-brand rounded-sm"/>
          <span className="text-[14px] font-medium text-ink-900">{title}</span>
          {extra}
        </div>
        <span className="flex items-center gap-1 text-[12px] text-ink-500">
          {open ? '收起' : '展开'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? '' : 'rotate-180'}`}>
            <path d="M6 15l6-6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && <div className="border-t border-ink-100">{children}</div>}
    </div>
  )
}

// ============ 头部信息（审批状态 + 审批单号 + 申请日期 + 财务报价 + 申请人/销售 + 创建时间）============
function HeaderSection({ item }) {
  const statusColorMap = {
    '审批通过': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    '已通过': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  }
  const sc = statusColorMap[item.approval] || { bg: 'bg-ink-100', text: 'text-ink-500', dot: 'bg-ink-400' }
  return (
    <div className="mx-3 card overflow-hidden">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        <div className={`flex items-center gap-1.5 ${sc.bg} ${sc.text} text-[11px] px-2 py-0.5 rounded-full shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
          审批状态：{item.approval}
        </div>
      </div>
      <div className="border-t border-ink-100 px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <Field label="审批单号" value={item.code || item.id}/>
        <Field label="申请日期" value={item.applyDate}/>
        <Field label="财务报价" value={item.financeQuote}/>
        <Field label="申请人 / 销售" value={`${item.applicant || '--'} / ${item.sales || '--'}`}/>
      </div>
      <div className="border-t border-ink-100 px-4 py-2 text-[12px]">
        <div className="text-ink-500">创建时间</div>
        <div className="text-ink-900 mt-0.5">{item.created}</div>
      </div>
    </div>
  )
}

// ============ 客户与需求 ============
function CustomerSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="客户与需求" open={open} onToggle={onToggle}>
      <div className="text-[12px]">
        <Field label="集团" value={item.groupName}/>
        <Field label="客户名称" value={item.customerName}/>
        <Field label="行业" value={item.industry}/>
        <Field label="媒体" value={item.platform}/>
        <Field label="详细需求" value={item.requirement} last/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 预算 ============
function BudgetSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="预算" open={open} onToggle={onToggle}>
      <div className="text-[12px]">
        <Field label="客户总预算" value={item.budget ? '¥ ' + Number(item.budget).toLocaleString() : '—'}/>
        <Field label="参考视频链接" value={item.videoLinks || '—'} link last/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 视频类型 ============
function VideoSection({ open, onToggle, item }) {
  const types = item.videoTypes || []
  const cfg = item.videoTypeConfig || {}
  const total = types.length
  return (
    <CollapsibleSection title="视频类型" open={open} onToggle={onToggle}
      extra={<span className="text-[11px] text-ink-500">共 {total} 种</span>}>
      <div className="px-4 py-3 space-y-3">
        {types.map(t => (
          <VideoTypeBlock key={t} type={t} config={cfg[t] || {}}/>
        ))}
        {types.length === 0 && (
          <div className="text-center text-ink-400 text-[12px] py-4">未选择视频类型</div>
        )}
      </div>
    </CollapsibleSection>
  )
}

function VideoTypeBlock({ type, config }) {
  const typeBadge = {
    '口播': { bg: 'bg-blue-50', text: 'text-brand', border: 'border-brand/30' },
    '剧情': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    '混剪': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  }
  const tb = typeBadge[type] || typeBadge['口播']
  return (
    <div className="border border-ink-100 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[80px_1fr] text-[12px]">
        <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">{type}</div>
        <div className="px-3 py-2 border-b border-dashed border-ink-100">
          <span className={`inline-block px-2 py-0.5 rounded ${tb.bg} ${tb.text} border ${tb.border} text-[11px] font-medium`}>{type}</span>
        </div>

        {type === '口播' && (
          <>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">素材数量</div>
            <div className="px-3 py-2 border-b border-dashed border-ink-100 text-ink-900">{config.count ?? '—'}</div>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">口播类型</div>
            <div className="px-3 py-2 border-b border-dashed border-ink-100 text-ink-900">{config.type || '—'}</div>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100">口播演员要求</div>
            <div className="px-3 py-2 text-ink-900">{config.actorReq || '—'}</div>
          </>
        )}

        {type === '剧情' && (
          <>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">素材数量</div>
            <div className="px-3 py-2 border-b border-dashed border-ink-100 text-ink-900">{config.count ?? '—'}</div>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">剧情类型</div>
            <div className="px-3 py-2 border-b border-dashed border-ink-100 text-ink-900">{config.actorCount || '—'}</div>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100">剧情演员要求</div>
            <div className="px-3 py-2 text-ink-900">{config.actorReq || '—'}</div>
          </>
        )}

        {type === '混剪' && (
          <>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100 border-b border-dashed border-ink-100">素材数量</div>
            <div className="px-3 py-2 border-b border-dashed border-ink-100 text-ink-900">{config.count ?? '—'}</div>
            <div className="bg-ink-50 px-3 py-2 text-ink-500 border-r border-ink-100">说明</div>
            <div className="px-3 py-2 text-ink-900">{config.desc || '仅素材数量'}</div>
          </>
        )}
      </div>
    </div>
  )
}

// ============ 申请信息 ============
function ApplicationSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="申请信息" open={open} onToggle={onToggle}>
      <div className="text-[12px]">
        <Field label="申请人" value={item.applicant}/>
        <Field label="财务报价" value={item.financeQuote}/>
        <Field label="销售" value={item.sales} last/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 审批流（节点 timeline）============
function ApprovalSection({ open, onToggle, nodes, finalStatus }) {
  if (!nodes.length) {
    return (
      <CollapsibleSection title="审批流" open={open} onToggle={onToggle}>
        <div className="p-6 text-center text-ink-400 text-[12px]">暂无审批流数据</div>
      </CollapsibleSection>
    )
  }
  return (
    <CollapsibleSection
      title="审批流"
      open={open}
      onToggle={onToggle}
      extra={<span className="text-[11px] text-ink-500">共 {nodes.length} 个节点</span>}
    >
      <ApprovalTimeline nodes={nodes}/>
    </CollapsibleSection>
  )
}

// ============ 审批节点时间线（竖向）============
function ApprovalTimeline({ nodes }) {
  return (
    <div className="px-4 py-4">
      <div className="space-y-0">
        {nodes.map((node, i) => {
          const isLast = i === nodes.length - 1
          const color = nodeColor(node.status)
          return (
            <div key={i} className="flex gap-3 relative">
              <div className="flex flex-col items-center pt-1 shrink-0">
                <div className={`w-3.5 h-3.5 rounded-full ${color.dot} border-2 border-white shadow-sm z-10 shrink-0`}/>
                {!isLast && <div className="w-px flex-1 bg-ink-200 mt-1" style={{ minHeight: '40px' }}/>}
              </div>
              <div className="flex-1 pb-5">
                <div className="bg-white border border-ink-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand/10 text-brand text-[12px] font-medium flex items-center justify-center">
                        {node.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-ink-900 leading-tight">{node.name}</div>
                        <div className="text-[11px] text-ink-400">{node.role}</div>
                      </div>
                      {node.platform && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          node.platform === 'CRM' ? 'bg-blue-50 text-brand' : 'bg-emerald-50 text-emerald-700'
                        }`}>{node.platform}</span>
                      )}
                    </div>
                    <StatusBadge status={node.status}/>
                  </div>
                  {node.time && (
                    <div className="text-[11px] text-ink-500">{node.time}</div>
                  )}
                  {node.remark && (
                    <div className="text-[11px] text-ink-700 mt-1">备注：{node.remark}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    '已通过': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    '通过': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    '审批中': { bg: 'bg-amber-50', text: 'text-amber-700' },
    '驳回': { bg: 'bg-red-50', text: 'text-red-600' },
    '已提交': { bg: 'bg-blue-50', text: 'text-brand' },
    '待审批': { bg: 'bg-ink-100', text: 'text-ink-500' },
    '已撤销': { bg: 'bg-ink-100', text: 'text-ink-500' },
  }
  const c = map[status] || map['待审批']
  return (
    <span className={`${c.bg} ${c.text} text-[11px] px-2 py-0.5 rounded whitespace-nowrap`}>{status}</span>
  )
}

function nodeColor(status) {
  if (status === '已通过' || status === '通过' || status === '已提交') return { dot: 'bg-success' }
  if (status === '审批中') return { dot: 'bg-warning' }
  if (status === '驳回') return { dot: 'bg-danger' }
  return { dot: 'bg-ink-300' }
}

// ============ 字段单元格（label + value）============
function Field({ label, value, link, last }) {
  const display = (value === undefined || value === null || value === '' || value === '--') ? '—' : value
  const isLink = link && display !== '—' && /^(https?:\/\/|www\.)/.test(String(display))
  return (
    <div className={`px-4 py-2.5 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="text-[11px] text-ink-500 mb-0.5">{label}</div>
      <div className={`text-[13px] text-ink-900 break-words whitespace-pre-wrap ${isLink ? 'underline text-brand' : ''}`}>{display}</div>
    </div>
  )
}