import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { approvalsData } from '../../data/mock'

/**
 * 审批详情页（按类型分内容渲染）
 * - 直播政策 → 直播详情（直播要求 / 直播时长 / 主播 / 货盘）
 * - 销售政策（合同/回款/退款）→ 销售政策详情（合同金额 / 回款节点 / 退款原因）
 * - 项目 → 项目详情（项目名称 / 投放媒体 / 预算）
 * - 开户申请 → 开户详情（开户主体 / 媒体平台）
 * - 媒体备款 → 备款详情（媒体 / 备款金额 / 用途）
 * - 其他 → 通用详情（基本信息 + 审批流）
 */
export default function ApprovalDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = approvalsData.find(a => String(a.nodeId) === String(id)) || approvalsData[0]

  const [openBasic, setOpenBasic] = useState(true)
  const [openType, setOpenType] = useState(true)
  const [openApproval, setOpenApproval] = useState(true)

  // 根据审批类型渲染不同详情
  const renderTypeDetail = () => {
    if (item.type === '直播政策') return <LivePolicyDetail item={item}/>
    if (['合同审批', '回款审批', '退款审批'].includes(item.type)) return <SalesPolicyDetail item={item}/>
    if (item.type === '项目') return <ProjectDetail item={item}/>
    if (item.type === '开户申请') return <AccountOpenDetail item={item}/>
    if (item.type === '媒体备款') return <MediaRechargeDetail item={item}/>
    return <GenericDetail item={item}/>
  }

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="审批详情" onBack={() => nav(-1)}/>

      <div className="pt-3">
        {/* 基本信息（通用） */}
        <BasicInfoSection open={openBasic} onToggle={() => setOpenBasic(o => !o)} item={item}/>
        {/* 类型专属详情 */}
        <TypeSection open={openType} onToggle={() => setOpenType(o => !o)} item={item}>
          {renderTypeDetail()}
        </TypeSection>
        {/* 审批流（节点 timeline） */}
        <ApprovalSection open={openApproval} onToggle={() => setOpenApproval(o => !o)} item={item}/>
      </div>

      {/* 底部无操作按钮：审批操作已在列表卡片完成（通过 / 驳回） */}
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

// ============ 1. 基本信息（所有类型通用）============
function BasicInfoSection({ open, onToggle, item }) {
  return (
    <CollapsibleSection title="审批基本信息" open={open} onToggle={onToggle}
      extra={<Tag text={item.status} type={statusType(item.status)}/>}>
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="节点ID" value={`#${item.nodeId}`}/>
        <Field label="审批层级" value={`第 ${item.level} 级`}/>
        <Field label="业务名称" value={item.bizName} double/>
        <Field label="审批类型" value={item.type}/>
        <Field label="申请人" value={item.applicant}/>
        <Field label="实际审批人" value={item.actualApprover}/>
        <Field label="审批人" value={item.approver}/>
        <Field label="审批意见" value={item.opinion} double/>
        <Field label="创建时间" value={item.createTime}/>
        <Field label="更新时间" value={item.updateTime}/>
      </div>
    </CollapsibleSection>
  )
}

// ============ 2. 类型专属详情 ============
function TypeSection({ open, onToggle, item, children }) {
  return (
    <CollapsibleSection title={`${item.type}详情`} open={open} onToggle={onToggle}>
      {children}
    </CollapsibleSection>
  )
}

// ============ 2.1 直播政策详情（直播要求）============
function LivePolicyDetail({ item }) {
  return (
    <div className="grid grid-cols-2 text-[12px]">
      <Field label="直播平台" value={item.livePlatform || '抖音'}/>
      <Field label="代播账号" value={item.accountName || '示例客户1 官方账号'}/>
      <Field label="粉丝量(万)" value={item.fans || '128.5'}/>
      <Field label="开播时长(h)" value={item.duration || '4-6 小时/场'}/>
      <Field label="场次安排" value={item.frequency || '每周 3 场'}/>
      <Field label="主播要求" value={item.hostReq || '品牌方指定主播，需有 1 年以上直播经验'}/>
      <Field label="货盘 GMV(元)" value={item.gmv || '¥ 500,000'}/>
      <Field label="佣金比例(%)" value={item.commission || '8%'}/>
      <Field label="直播风格" value={item.style || '种草 + 带货，节奏紧凑'}/>
      <Field label="品牌红线" value={item.redLine || '不得夸大功效，不得低价倾销'}/>
      <Field label="营销链路" value={item.marketingChain || '短视频引流 → 直播间转化 → 私域沉淀'}/>
      <Field label="历史开播数据" value={item.history || '近 30 天场均 GMV ¥ 38,000，UV 价值 ¥ 1.8'}/>
    </div>
  )
}

// ============ 2.2 销售政策详情（合同/回款/退款）============
function SalesPolicyDetail({ item }) {
  if (item.type === '合同审批') {
    return (
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="合同编号" value={item.contractCode || `HT2026-${item.nodeId}`}/>
        <Field label="客户名称" value={item.customer || item.bizName.split(' ')[0]}/>
        <Field label="合同金额(元)" value={item.amount || '¥ 580,000'}/>
        <Field label="账期(天)" value={item.term || '60'}/>
        <Field label="服务周期" value={item.servicePeriod || '2026-08-01 ~ 2027-07-31'}/>
        <Field label="返点比例(%)" value={item.rebate || '5%'}/>
        <Field label="政策编号" value={item.policyCode || `ZC-${item.nodeId}`}/>
        <Field label="签约主体" value={item.signedEntity || '深圳某科技有限公司'}/>
        <Field label="付款方式" value={item.payMethod || '月结'}/>
        <Field label="备注" value={item.remark || '客户要求月度复盘会'}/>
      </div>
    )
  }
  if (item.type === '回款审批') {
    return (
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="回款编号" value={item.receiveCode || `HK2026-${item.nodeId}`}/>
        <Field label="客户名称" value={item.customer || item.bizName.split(' ')[0]}/>
        <Field label="回款金额(元)" value={item.amount || '¥ 300,000'}/>
        <Field label="关联合同" value={item.contractCode || `HT2026-${item.nodeId - 1}`}/>
        <Field label="回款方式" value={item.payMethod || '银行转账'}/>
        <Field label="到账日期" value={item.receiveDate || '2026-08-22'}/>
        <Field label="开票状态" value={item.invoiceStatus || '已开票'}/>
        <Field label="备注" value={item.remark || '本季度回款进度 80%'}/>
      </div>
    )
  }
  if (item.type === '退款审批') {
    return (
      <div className="grid grid-cols-2 text-[12px]">
        <Field label="退款编号" value={item.refundCode || `TK2026-${item.nodeId}`}/>
        <Field label="客户名称" value={item.customer || item.bizName.split(' ')[0]}/>
        <Field label="退款金额(元)" value={item.amount || '¥ 50,000'}/>
        <Field label="退款原因" value={item.refundReason || '客户因投放效果不达标申请退款'}/>
        <Field label="关联订单" value={item.orderCode || `DD2026-${item.nodeId}`}/>
        <Field label="退款方式" value={item.refundMethod || '原路退回'}/>
        <Field label="预计到账" value={item.expectedDate || '2026-08-26'}/>
        <Field label="备注" value={item.remark || '已与客户沟通，需财务审批'}/>
      </div>
    )
  }
  return null
}

// ============ 2.3 项目详情 ============
function ProjectDetail({ item }) {
  return (
    <div className="grid grid-cols-2 text-[12px]">
      <Field label="项目名称" value={item.projectName || item.bizName}/>
      <Field label="客户名称" value={item.customer || item.bizName.split(' ')[0]}/>
      <Field label="投放媒体" value={item.platform || '巨量引擎'}/>
      <Field label="项目预算(元)" value={item.budget || '¥ 200,000'}/>
      <Field label="开始日期" value={item.startDate || '2026-08-01'}/>
      <Field label="结束日期" value={item.endDate || '2026-12-31'}/>
      <Field label="项目类型" value={item.projectType || '品牌曝光'}/>
      <Field label="KPI 要求" value={item.kpi || 'UV 价值 ≥ ¥ 1.5，ROI ≥ 1.8'}/>
      <Field label="所属销售" value={item.sales || item.applicant}/>
      <Field label="备注" value={item.remark || '需重点关注人群定向'} double/>
    </div>
  )
}

// ============ 2.4 开户申请详情 ============
function AccountOpenDetail({ item }) {
  return (
    <div className="grid grid-cols-2 text-[12px]">
      <Field label="开户主体" value={item.subject || '示例客户1 有限公司'}/>
      <Field label="媒体平台" value={item.platform || '巨量引擎'}/>
      <Field label="行业" value={item.industry || '电商零售'}/>
      <Field label="开户类型" value={item.accountType || '广告主账户'}/>
      <Field label="预计月消耗(元)" value={item.monthCost || '¥ 100,000'}/>
      <Field label="资质文件" value={item.qualification || '营业执照、银行开户许可、法人身份证'}/>
      <Field label="联系人" value={item.contact || '示例客户1 张经理'}/>
      <Field label="联系电话" value={item.phone || '138****8888'}/>
      <Field label="备注" value={item.remark || '加急开户，需 3 个工作日内完成'} double/>
    </div>
  )
}

// ============ 2.5 媒体备款详情 ============
function MediaRechargeDetail({ item }) {
  return (
    <div className="grid grid-cols-2 text-[12px]">
      <Field label="备款编号" value={item.code || `BK2026-${item.nodeId}`}/>
      <Field label="媒体平台" value={item.platform || '巨量引擎'}/>
      <Field label="备款金额(元)" value={item.amount || '¥ 1,000,000'}/>
      <Field label="用途说明" value={item.purpose || 'Q3 客户代投账户充值备款'}/>
      <Field label="关联客户" value={item.customer || '深圳某科技有限公司'}/>
      <Field label="到账日期" value={item.arrivalDate || '2026-08-25'}/>
      <Field label="付款方式" value={item.payMethod || '对公转账'}/>
      <Field label="备注" value={item.remark || '需财务总监审批后到账'} double/>
    </div>
  )
}

// ============ 2.6 通用详情（兜底）============
function GenericDetail({ item }) {
  return (
    <div className="grid grid-cols-2 text-[12px]">
      <Field label="业务名称" value={item.bizName} double/>
      <Field label="审批类型" value={item.type}/>
      <Field label="申请人" value={item.applicant}/>
      <Field label="备注" value="该审批类型暂无专属字段" double/>
    </div>
  )
}

// ============ 3. 审批流（节点 timeline）============
function ApprovalSection({ open, onToggle, item }) {
  // 模拟审批节点：根据 level 构造
  const nodes = [
    { name: item.applicant, role: '申请人', status: '已提交', time: item.createTime, remark: '提交申请' },
    { name: '王主管', role: '直属主管', status: item.status === '审批中' ? '审批中' : '通过', time: item.updateTime, remark: '' },
    { name: item.approver, role: '审批人', status: item.status === '审批中' ? '待审批' : item.status, time: item.updateTime, remark: item.opinion },
  ]
  return (
    <CollapsibleSection
      title="审批流"
      open={open}
      onToggle={onToggle}
      extra={<Tag text={item.status} type={statusType(item.status)}/>}
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

// ============ 辅助组件 ============
function StatusBadge({ status }) {
  const map = {
    '通过': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    '已通过': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    '审批中': { bg: 'bg-amber-50', text: 'text-amber-700' },
    '待审批': { bg: 'bg-ink-100', text: 'text-ink-500' },
    '驳回': { bg: 'bg-red-50', text: 'text-red-600' },
    '已驳回': { bg: 'bg-red-50', text: 'text-red-600' },
    '拒绝': { bg: 'bg-red-50', text: 'text-red-600' },
    '已提交': { bg: 'bg-blue-50', text: 'text-brand' },
    '撤销': { bg: 'bg-ink-100', text: 'text-ink-500' },
    '已撤销': { bg: 'bg-ink-100', text: 'text-ink-500' },
    '无需处理': { bg: 'bg-ink-100', text: 'text-ink-500' },
  }
  const c = map[status] || map['待审批']
  return (
    <span className={`${c.bg} ${c.text} text-[11px] px-2 py-0.5 rounded`}>{status}</span>
  )
}

function nodeColor(status) {
  if (status === '通过' || status === '已通过' || status === '已提交') return { dot: 'bg-success' }
  if (status === '审批中') return { dot: 'bg-warning' }
  if (status === '驳回' || status === '已驳回' || status === '拒绝') return { dot: 'bg-danger' }
  return { dot: 'bg-ink-300' }
}

function statusType(s) {
  if (s === '审批中') return 'blue'
  if (s === '通过' || s === '已通过') return 'green'
  if (s === '拒绝' || s === '驳回' || s === '已驳回') return 'red'
  if (s === '撤销' || s === '已撤销') return 'gray'
  if (s === '无需处理') return 'gray'
  return 'gray'
}

// ============ 字段单元格 ============
function Field({ label, value, double }) {
  const display = (value === undefined || value === null || value === '' || value === '--') ? '—' : value
  return (
    <div className={`px-4 py-2.5 ${double ? 'col-span-2' : ''}`}>
      <div className="text-[11px] text-ink-500 mb-0.5">{label}</div>
      <div className="text-[13px] text-ink-900 whitespace-pre-wrap break-words">{display}</div>
    </div>
  )
}

// ============ Tag ============
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