import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { livePoliciesData, livePolicyApprovalNodesData, colorMap } from '../../data/mock'

/**
 * 直播政策详情页
 * 区块：客户信息 / 投放要求 / 直播要求 / 考核标准 / 申请信息 / 审批流
 */
export default function LivePolicyDetailPage() {
  const nav = useNavigate()
  const { code } = useParams()
  const item = livePoliciesData.find(p => p.code === code || p.id === code) || livePoliciesData[0]

  const [openCustomer, setOpenCustomer] = useState(true)
  const [openDelivery, setOpenDelivery] = useState(true)
  const [openLive, setOpenLive] = useState(true)
  const [openKpi, setOpenKpi] = useState(true)
  const [openApplication, setOpenApplication] = useState(true)
  const [openApproval, setOpenApproval] = useState(true)

  const nodes = livePolicyApprovalNodesData[item.code] || []

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="直播政策详情" onBack={() => nav(-1)}/>

      <div className="pt-3">
        <CustomerSection open={openCustomer} onToggle={() => setOpenCustomer(o => !o)} item={item}/>
        <DeliverySection open={openDelivery} onToggle={() => setOpenDelivery(o => !o)} item={item}/>
        <LiveSection open={openLive} onToggle={() => setOpenLive(o => !o)} item={item}/>
        <KpiSection open={openKpi} onToggle={() => setOpenKpi(o => !o)} item={item}/>
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
    <div className="mx-3 mt-3 card overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between tap">
        <div className="flex items-center gap-2">
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

// ============ 1. 客户信息 ============
function CustomerSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="客户信息" open={open} onToggle={onToggle}
      extra={<Tag text={item.approval} type={colorMap[item.approval] || 'gray'}/>}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="集团" value={item.groupName}/>
        <Field label="客户名称" value={item.customerName}/>
        <Field label="代投客户政策" value={item.customerPolicy || '该客户暂无关联的政策'}/>
        <Field label="行业" value={item.industry}/>
        <Field label="基础费用(元)" value={item.baseFee ? '¥ ' + Number(item.baseFee).toLocaleString() : '—'}/>
        <Field label="GMV 分佣(%)" value={item.gmvShare ? `${item.gmvShare}%` : '—'}/>
        <Field label="备注情况" value={item.remark} double/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 2. 投放要求 ============
function DeliverySection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="投放要求" open={open} onToggle={onToggle}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="投放媒体" value={item.platform}/>
        <Field label="日预算(元)" value={item.dayBudget ? '¥ ' + Number(item.dayBudget).toLocaleString() : '—'}/>
        <Field label="月预算(元)" value={item.monthBudget ? '¥ ' + Number(item.monthBudget).toLocaleString() : '—'}/>
        <Field label="阶梯预算" value={item.stepBudget} double/>
        <Field label="人群定位" value={item.audience} double/>
        <Field label="投放点位" value={item.placement} double/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 3. 直播要求 ============
function LiveSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="直播要求" open={open} onToggle={onToggle}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="时长要求" value={item.duration} double/>
        <Field label="代播账号名称" value={item.accountName}/>
        <Field label="粉丝量" value={item.fans}/>
        <Field label="历史开播情况" value={item.history} double/>
        <Field label="直播现状" value={item.currentStatus} double/>
        <Field label="主播要求" value={item.hostReq} double/>
        <Field label="整体货盘" value={item.goods} double/>
        <Field label="直播风格" value={item.style} double/>
        <Field label="营销侧重" value={item.marketingFocus} double/>
        <Field label="营销链路要求" value={item.marketingChain} double/>
        <Field label="品牌红线" value={item.brandRedLine} double/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 4. 考核标准 ============
function KpiSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="考核标准" open={open} onToggle={onToggle}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="投放目标" value={item.targetGoal} double/>
        <Field label="销售额及核销目标规划及阶段目标拆解" value={item.salesPlan} double/>
        <Field label="客户考核要求" value={item.customerKpi}/>
        <Field label="结算情况" value={item.settlement}/>
        <Field label="数据复盘节点" value={item.reviewNode} double/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 5. 申请信息 ============
function ApplicationSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="申请信息" open={open} onToggle={onToggle}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="申请人" value={item.applicant}/>
        <Field label="申请日期" value={item.applyDate}/>
        <Field label="所属销售" value={item.sales}/>
        <Field label="所属部门" value={item.department}/>
        <Field label="财务报价(元)" value={item.financeQuote ? '¥ ' + Number(item.financeQuote).toLocaleString() : '—'}/>
        <Field label="政策编号" value={item.code}/>
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
      extra={finalStatus && <Tag text={finalStatus} type={colorMap[finalStatus] || 'gray'}/>}
    >
      <ApprovalTimeline nodes={nodes}/>
    </CollapsibleSection>
  )
}

// ============ 审批节点时间线（竖向）============
function ApprovalTimeline({ nodes }) {
  return (
    <div className="px-4 py-4">
      <div className="relative">
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
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    '通过': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    '审批中': { bg: 'bg-amber-50', text: 'text-amber-700' },
    '驳回': { bg: 'bg-red-50', text: 'text-red-600' },
    '已提交': { bg: 'bg-blue-50', text: 'text-brand' },
    '待审批': { bg: 'bg-ink-100', text: 'text-ink-500' },
  }
  const c = map[status] || map['待审批']
  return (
    <span className={`${c.bg} ${c.text} text-[11px] px-2 py-0.5 rounded`}>{status}</span>
  )
}

function nodeColor(status) {
  if (status === '通过' || status === '已提交') return { dot: 'bg-success' }
  if (status === '审批中') return { dot: 'bg-warning' }
  if (status === '驳回') return { dot: 'bg-danger' }
  return { dot: 'bg-ink-300' }
}

// ============ 字段单元格（label + value 双列）============
function Field({ label, value, double }) {
  const display = (value === undefined || value === null || value === '' || value === '--') ? '—' : value
  return (
    <div className={`px-4 py-2.5 ${double ? 'col-span-2' : ''}`}>
      <div className="text-[11px] text-ink-500 mb-0.5">{label}</div>
      <div className="text-[13px] text-ink-900 whitespace-pre-wrap break-words">{display}</div>
    </div>
  )
}

// ============ Tag（审批状态）============
function Tag({ text, type = 'gray' }) {
  const map = {
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-brand',
    gray: 'bg-ink-100 text-ink-500',
  }
  return (
    <span className={`${map[type] || map.gray} text-[11px] px-2 py-0.5 rounded whitespace-nowrap shrink-0`}>{text}</span>
  )
}
