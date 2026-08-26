import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * 项目详情页
 * 来源：PC 项目详情（截图）
 * 字段：基本信息 + 明细信息（含政策）+ 审批流（CRM预审/飞书终审）
 *
 * 数据说明：项目库 mock 字段较精简，此处按截图补全演示用字段。
 */
export default function ProjectDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()

  // 折叠状态：基本信息 / 明细信息 / 审批流
  const [openBasic, setOpenBasic] = useState(true)
  const [openDetail, setOpenDetail] = useState(true)
  const [openApproval, setOpenApproval] = useState(true)
  // 政策子折叠
  const [openPolicies, setOpenPolicies] = useState({ 0: true, 1: true })
  // 审批流子 tab
  const [approvalTab, setApprovalTab] = useState('crm')

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="项目详情" onBack={() => nav(-1)}/>

      <div className="pt-3">
        <BasicInfoSection open={openBasic} onToggle={() => setOpenBasic(o => !o)}/>
        <DetailSection
          open={openDetail}
          onToggle={() => setOpenDetail(o => !o)}
          openPolicies={openPolicies}
          setOpenPolicies={setOpenPolicies}
        />
        <ApprovalSection
          open={openApproval}
          onToggle={() => setOpenApproval(o => !o)}
          tab={approvalTab}
          setTab={setApprovalTab}
        />
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

// ============ 可折叠 Section 容器 ============
function CollapsibleSection({ title, open, onToggle, children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between tap">
        <span className="text-[14px] font-medium text-ink-900">{title}</span>
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

// ============ 基本信息 ============
function BasicInfoSection({ open, onToggle }) {
  const fields = [
    { label: '项目框架名称', value: '嘉禾食品-视频号-代投' },
    { label: '所属集团', value: '嘉禾电商集团' },
    { label: '主体池', value: '广州市源满房地产代理有限公司' },
    { label: '销售类型', value: '代投' },
    { label: '审批状态', value: '暂无状态' },
  ]
  return (
    <CollapsibleSection title="基本信息" open={open} onToggle={onToggle}>
      <div className="px-4 py-2">
        {fields.map((f, i) => (
          <div key={f.label} className={`flex items-start gap-3 py-2.5 text-[13px] ${i === fields.length - 1 ? '' : 'border-b border-ink-100'}`}>
            <span className="text-ink-500 shrink-0 w-[110px]">{f.label}</span>
            <span className={`flex-1 ${f.value === '暂无状态' || f.value === '--' ? 'text-ink-300' : 'text-ink-900'}`}>{f.value}</span>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}

// ============ 明细信息（政策列表）============
function DetailSection({ open, onToggle, openPolicies, setOpenPolicies }) {
  const policies = [
    {
      name: '咸峰财税-ad-走量，头条-AD',
      platform: '头条-AD',
      initialMode: '走量',
      serviceOrderType: '无附加服务',
      payType: '预付',
      rebate: '0.00',
      serviceFee: '0.00',
      creditDays: '--',
      customerType: '直接客户',
      owner: '李雪',
      remark: '--',
      effective: '2025-11-10',
      expire: '--',
    },
    {
      name: '本地推-餐饮-代投',
      platform: '本地推',
      initialMode: '代投',
      serviceOrderType: '基础服务',
      payType: '后付',
      rebate: '5.0',
      serviceFee: '3.0',
      creditDays: '30',
      customerType: '代理客户',
      owner: '王春雷',
      remark: '重点客户',
      effective: '2026-07-01',
      expire: '2026-12-31',
    },
  ]
  const togglePolicy = (idx) => setOpenPolicies(s => ({ ...s, [idx]: !s[idx] }))

  return (
    <CollapsibleSection title="明细信息" open={open} onToggle={onToggle}>
      <div className="px-4 py-2 space-y-3">
        {policies.map((p, idx) => (
          <PolicyDetailCard
            key={idx}
            index={idx}
            policy={p}
            open={openPolicies[idx]}
            onToggle={() => togglePolicy(idx)}
          />
        ))}
      </div>
    </CollapsibleSection>
  )
}

// ============ 政策详情卡（可折叠）============
function PolicyDetailCard({ index, policy, open, onToggle }) {
  // 字段：政策名称 / 投放平台 / 初始合作模式 / 服务单类型 / 付款方式 /
  //       客户返点(%) / 服务费(%) / 垫款账期(天) / 客户类别 / 业绩归属人 /
  //       备注 / 生效时间 / 失效时间
  const fields = [
    { label: '政策名称', value: policy.name },
    { label: '投放平台', value: policy.platform },
    { label: '初始合作模式', value: policy.initialMode },
    { label: '服务单类型', value: policy.serviceOrderType },
    { label: '付款方式', value: policy.payType },
    { label: '客户返点(%)', value: policy.rebate },
    { label: '服务费(%)', value: policy.serviceFee },
    { label: '垫款账期(天)', value: policy.creditDays },
    { label: '客户类别', value: policy.customerType },
    { label: '业绩归属人', value: policy.owner },
    { label: '备注', value: policy.remark },
    { label: '生效时间', value: policy.effective },
    { label: '失效时间', value: policy.expire },
  ]
  return (
    <div className="border border-ink-100 rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full px-3 py-2.5 flex items-center justify-between bg-white tap">
        <span className="text-[13px] font-medium text-ink-900">政策{index + 1}</span>
        <span className="flex items-center gap-1 text-[12px] text-ink-500">
          {open ? '收起' : '展开'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? '' : 'rotate-180'}`}>
            <path d="M6 15l6-6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-ink-100 px-3 py-1">
          {fields.map((f, i) => {
            const muted = f.value === '--' || f.value == null
            return (
              <div key={f.label} className={`flex items-start gap-3 py-2 text-[12px] ${i === fields.length - 1 ? '' : 'border-b border-ink-100'}`}>
                <span className="text-ink-500 shrink-0 w-[100px]">{f.label}</span>
                <span className={`flex-1 ${muted ? 'text-ink-300' : 'text-ink-900'}`}>{muted ? '--' : f.value}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============ 审批流（CRM预审 + 飞书终审 tab）============
function ApprovalSection({ open, onToggle, tab, setTab }) {
  return (
    <CollapsibleSection title="审批流" open={open} onToggle={onToggle}>
      {/* Tab 切换 */}
      <div className="bg-white border-b border-ink-100 px-4 sticky top-12 z-10">
        <div className="flex items-center gap-6">
          {[
            { key: 'crm', label: 'CRM预审流程' },
            { key: 'feishu', label: '飞书终审流程' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative h-10 text-[13px] tap ${tab === t.key ? 'text-brand font-medium' : 'text-ink-700'}`}>
              {t.label}
              {tab === t.key && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-[2px] bg-brand rounded-full"/>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'crm' && <CrmApprovalTab/>}
      {tab === 'feishu' && <FeishuApprovalTab/>}
    </CollapsibleSection>
  )
}

// ============ CRM 预审流程 ============
// 3 KPI + 横向 timeline 列表
function CrmApprovalTab() {
  const kpis = [
    { key: 'passed', label: '审批通过政策', count: 1, color: 'success' },
    { key: 'pending', label: '审批中政策', count: 4, color: 'warning' },
    { key: 'rejected', label: '审批驳回政策', count: 0, color: 'danger' },
  ]
  const items = [
    { title: '直播项目，头条-本地推', applicant: { name: '王春雷', time: '2026-07-15 10:49:15' }, approver: { name: '王春雷', status: '审批通过', time: '2026-07-15 10:49:15' } },
    { title: '直播项目，头条-AD', applicant: { name: '王春雷', time: '2026-07-15 10:49:15' }, approver: { name: '王春雷', status: '审批通过', time: '2026-07-15 10:49:15' } },
    { title: '直播项目，头条-AD', applicant: { name: '王春雷', time: '2026-07-15 10:49:15' }, approver: { name: '王春雷', status: '审批通过', time: '2026-07-15 10:49:15' } },
    { title: '直播项目，头条-AD', applicant: { name: '王春雷', time: '2026-07-15 10:49:15' }, approver: { name: '王春雷', status: '审批通过', time: '2026-07-15 10:49:15' } },
  ]
  return (
    <div className="bg-ink-50 p-3 space-y-2">
      {/* KPI 行 */}
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(k => (
          <KpiCard key={k.key} {...k}/>
        ))}
      </div>
      {/* 时间线条目 */}
      <div className="space-y-2">
        {items.map((it, i) => (
          <CrmApprovalItem key={i} item={it}/>
        ))}
      </div>
    </div>
  )
}

// ============ KPI 卡（按截图：左色条 + 标签 + ? + 数字）============
function KpiCard({ label, count, color }) {
  const colorMap = {
    success: { bar: 'bg-success', text: 'text-white', bg: 'bg-success' },
    warning: { bar: 'bg-warning', text: 'text-white', bg: 'bg-warning' },
    danger: { bar: 'bg-danger', text: 'text-white', bg: 'bg-danger' },
  }
  const c = colorMap[color]
  return (
    <div className={`rounded-lg ${c.bg} text-white px-2.5 py-2.5 relative overflow-hidden`}>
      <div className="text-[11px] flex items-center gap-1">
        <span>{label}</span>
        <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">?</span>
      </div>
      <div className="text-[20px] font-medium mt-1.5">{count}<span className="text-[12px] font-normal ml-0.5">条</span></div>
    </div>
  )
}

// ============ CRM 审批条目（横向双节点时间线）============
function CrmApprovalItem({ item }) {
  return (
    <div className="bg-white rounded-lg p-3">
      <div className="text-[13px] font-medium text-ink-900 mb-2">{item.title}</div>
      <div className="relative pt-2">
        {/* 横向线（连接两个节点的虚线效果：实线 + 圆点在上） */}
        <div className="absolute left-[14%] right-[14%] top-[6px] h-px bg-ink-200"/>
        {/* 申请人节点（蓝） */}
        <div className="absolute left-[14%] -translate-x-1/2 top-[2px] w-3 h-3 rounded-full bg-brand border-2 border-white shadow z-10"/>
        {/* 审批人节点（绿） */}
        <div className="absolute right-[14%] translate-x-1/2 top-[2px] w-3 h-3 rounded-full bg-success border-2 border-white shadow z-10"/>

        {/* 双列卡片 */}
        <div className="grid grid-cols-2 gap-2">
          {/* 申请人卡片（左） */}
          <div className="bg-white border border-ink-100 rounded-lg p-2.5 shadow-sm">
            <div className="text-[11px] leading-relaxed">
              <span className="text-brand">【申请人】</span> {item.applicant.name}
            </div>
            <div className="text-[11px] leading-relaxed">
              <span className="text-brand">【申请时间】</span> {item.applicant.time}
            </div>
          </div>
          {/* 审批人卡片（右） */}
          <div className="bg-white border border-ink-100 rounded-lg p-2.5 shadow-sm">
            <div className="text-[11px] leading-relaxed">
              <span className="text-brand">【审批人】</span> {item.approver.name}
            </div>
            <div className="text-[11px] leading-relaxed">
              <span className="text-brand">【审批状态】</span> {item.approver.status}
            </div>
            <div className="text-[11px] leading-relaxed">
              <span className="text-brand">【审批时间】</span> {item.approver.time}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 飞书终审流程 ============
// 左侧绿点 + 连接线 + 右侧卡片
function FeishuApprovalTab() {
  const steps = [
    { approver: '闫建亮', status: '已通过', time: '2026-07-20 16:11:55', avatar: '🟢' },
    { approver: '王春雷', status: '已通过', time: '2026-07-20 16:12:56', avatar: '🟢' },
    { approver: '房思楠', status: '已通过', time: '2026-07-20 16:14:58', avatar: '🟢', noAvatar: true },
  ]
  return (
    <div className="bg-ink-50 p-3">
      <div className="bg-white rounded-lg p-4">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-3 relative">
            {/* 左侧：圆点 + 连接线 */}
            <div className="flex flex-col items-center shrink-0 w-3">
              <div className={`w-3 h-3 rounded-full mt-1.5 ${s.status === '已通过' ? 'bg-success' : 'bg-ink-300'}`}/>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-ink-200 my-1"/>}
            </div>
            {/* 右侧：卡片 */}
            <div className={`flex-1 ${i < steps.length - 1 ? 'pb-4' : ''}`}>
              <div className="bg-white border border-ink-100 rounded-lg p-3 shadow-sm flex gap-3">
                {/* 头像 */}
                <div className="shrink-0">
                  {s.noAvatar ? (
                    <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-[10px] text-ink-500">暂无头像</div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success text-[16px]">●</div>
                  )}
                </div>
                {/* 信息 */}
                <div className="flex-1 text-[12px] leading-relaxed">
                  <div>
                    <span className="text-brand">【审批人】</span> {s.approver}
                  </div>
                  <div>
                    <span className="text-ink-500">状态：</span>
                    <span className="text-success font-medium">{s.status}</span>
                  </div>
                  <div>
                    <span className="text-ink-500">时间：</span>
                    <span className="text-ink-900">{s.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
