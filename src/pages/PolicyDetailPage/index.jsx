import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policiesData, policyApprovalNodesData, policyOriginalsData, colorMap } from '../../data/mock'

/**
 * 政策详情页
 * 区块：政策信息 / 原政策信息 / 审批流（节点 timeline）
 */
export default function PolicyDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = policiesData.find(p => p.id === id) || policiesData[0]

  const [openBasic, setOpenBasic] = useState(true)
  const [openOriginal, setOpenOriginal] = useState(true)
  const [openApproval, setOpenApproval] = useState(true)

  const nodes = policyApprovalNodesData[item.id] || []
  const original = policyOriginalsData[item.id] // 可能为 undefined（没有历史原政策）

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="政策详情" onBack={() => nav(-1)}/>

      <div className="pt-3">
        <BasicInfoSection open={openBasic} onToggle={() => setOpenBasic(o => !o)} item={item}/>
        {original && (
          <OriginalSection open={openOriginal} onToggle={() => setOpenOriginal(o => !o)} item={original}/>
        )}
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

// ============ 政策信息 ============
function BasicInfoSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection
      title="政策信息"
      open={open}
      onToggle={onToggle}
      extra={<Tag text={item.approval} type={colorMap[item.approval] || 'gray'}/>}
    >
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="政策名称" value={item.name}/>
        <Field label="原政策名称" value={item.name}/>
        <Field label="政策编号" value={item.id}/>
        <Field label="客户名称" value={item.customerName || '—'}/>
        <Field label="项目名称" value={item.project}/>
        <Field label="集团名称" value={item.groupName || '—'}/>
        <Field label="客户类型" value={item.customerType || '—'}/>
        <Field label="客户行业" value="—"/>
        <Field label="合作模式" value={item.coopMode}/>
        <Field label="媒体平台" value={item.platform}/>
        <Field label="竞价类型" value={item.bidType}/>
        <Field label="付款方式" value={item.payType}/>
        <Field label="返点比例" value={item.rebate}/>
        <Field label="服务费比例" value={item.serviceFee}/>
        <Field label="首充预估金额" value={'¥ ' + Number(item.firstRecharge || 0).toLocaleString()}/>
        <Field label="预付资金金额" value={item.prepaidAmount === '--' ? '—' : ('¥ ' + Number(item.prepaidAmount).toLocaleString())}/>
        <Field label="垫款账期(天)" value={item.creditDays}/>
        <Field label="媒介开户人" value={item.agentName}/>
        <Field label="创建人" value={item.creator}/>
        <Field label="创建时间" value={item.created}/>
        <Field label="更新时间" value={item.updated}/>
        <Field label="生效日期" value="2026-07-01"/>
        <Field label="失效日期" value="—" double/>
        <Field label="备注" value={item.remark === '--' ? '—' : (item.remark || '—')}/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 原政策信息（仅在有历史变更记录时显示）============
function OriginalSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="原政策信息" open={open} onToggle={onToggle}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="政策名称" value={item.name}/>
        <Field label="政策编号" value={item.id}/>
        <Field label="客户名称" value={item.customerName || '—'}/>
        <Field label="项目名称" value={item.project === '--' ? '—' : (item.project || '—')}/>
        <Field label="集团名称" value={item.groupName || '—'}/>
        <Field label="客户类型" value={item.customerType || '0'}/>
        <Field label="客户行业" value={item.industry || '—'}/>
        <Field label="合作模式" value="1"/>
        <Field label="媒体平台" value={item.platform || '—'}/>
        <Field label="竞价类型" value="0"/>
        <Field label="付款方式" value={item.payType === '垫款' ? '垫款' : '0'}/>
        <Field label="返点比例" value={item.rebate}/>
        <Field label="服务费比例" value={item.serviceFee}/>
        <Field label="首充预估金额" value={'¥ ' + Number(item.firstRecharge || 0).toLocaleString()}/>
        <Field label="预付资金金额" value={item.prepaidAmount === '--' ? '—' : ('¥ ' + Number(item.prepaidAmount).toLocaleString())}/>
        <Field label="垫款账期(天)" value={item.creditDays}/>
        <Field label="媒介开户人" value={'145,139,31,38'}/>
        <Field label="创建人" value={item.creator === '--' ? '—' : item.creator}/>
        <Field label="创建时间" value={item.created}/>
        <Field label="更新时间" value={item.updated}/>
        <Field label="生效日期" value="2026-07-20"/>
        <Field label="失效日期" value="2026-08-24"/>
        <Field label="备注" value={item.remark === '--' ? '—' : (item.remark || '—')}/>
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
        {/* 节点列表 */}
        <div className="space-y-0">
          {nodes.map((node, i) => {
            const isLast = i === nodes.length - 1
            const color = nodeColor(node.status)
            return (
              <div key={i} className="flex gap-3 relative">
                {/* 左侧：节点圆 + 连线 */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className={`w-3.5 h-3.5 rounded-full ${color.dot} border-2 border-white shadow-sm z-10 shrink-0`}/>
                  {!isLast && <div className="w-px flex-1 bg-ink-200 mt-1" style={{ minHeight: '40px' }}/>}
                </div>
                {/* 右侧：节点卡片 */}
                <div className={`flex-1 pb-5 ${isLast ? '' : ''}`}>
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
  return (
    <div className={`px-4 py-2.5 ${double ? 'col-span-2' : ''}`}>
      <div className="text-[11px] text-ink-500 mb-0.5">{label}</div>
      <div className="text-[13px] text-ink-900">{value || '—'}</div>
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
