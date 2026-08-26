import { useParams, useNavigate } from 'react-router-dom'
import { customers, followUps, contracts, opportunities } from '../../data/mock'
import { Tag } from '../Work'
import { TopBar } from '../Reports'

/**
 * 通用详情页 - 根据路由参数渲染不同内容
 * /detail/customer/:id  客户详情
 * /detail/contract/:id  合同详情
 * /detail/opportunity/:id  商机详情
 * /detail/follow/:id  跟进详情
 * /detail/finance/:id  财务页面
 * /detail/me/:id  我的工具页
 * /detail/work/:id  业务管理页
 * /detail/report/:id  报表分类
 * /detail/approval/:id  审批详情
 * /detail/:module/:id  默认占位
 */
export default function Detail() {
  const { module, id } = useParams()
  const nav = useNavigate()

  // 客户详情
  if (module === 'customer') {
    const c = customers.find(x => x.id === Number(id)) || customers[0]
    return <CustomerDetail customer={c} onBack={() => nav(-1)}/>
  }

  // 合同详情
  if (module === 'contract') {
    const c = contracts[0]
    return <ContractDetail contract={c} onBack={() => nav(-1)}/>
  }

  // 商机详情
  if (module === 'opportunity') {
    const o = opportunities[0]
    return <OpportunityDetail opp={o} onBack={() => nav(-1)}/>
  }

  // 跟进详情
  if (module === 'follow') {
    return <FollowDetail onBack={() => nav(-1)}/>
  }

  // 审批详情
  if (module === 'approval') {
    return <ApprovalDetail onBack={() => nav(-1)}/>
  }

  // 财务中心各页面 - 统一展示列表
  if (module === 'finance') {
    return <FinancePage type={id} onBack={() => nav(-1)}/>
  }

  // 报表分类
  if (module === 'report') {
    return <ReportPage type={id} onBack={() => nav(-1)}/>
  }

  // 业务管理 / 我的工具 - 占位
  return <Placeholder module={module} id={id} onBack={() => nav(-1)}/>
}

// ============ 子页面组件 ============

function CustomerDetail({ customer, onBack }) {
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title="客户详情" onBack={onBack}/>
      {/* 头部 */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-medium text-ink-900">{customer.name}</div>
          <button className="text-warning text-[20px]">☆</button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-[13px]">
          <ActionItem icon="calendar" label="日程"/>
          <ActionItem icon="phone" label="电话" highlight/>
        </div>
        <div className="mt-3 text-[12px] text-ink-500 space-y-1">
          <div>成交状态：<Tag text={customer.status} type={customer.status === '已成交' ? 'green' : 'orange'}/></div>
          <div>客户级别：{customer.level}</div>
          <div>电话：{customer.phone}</div>
          <div className="truncate">详细地址：{customer.address}</div>
          <div>负责人：{customer.owner}</div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title justify-between">
          <span>数据概览 <span className="text-[11px] text-ink-400">(单位：元)</span></span>
          <span className="text-[10px] text-ink-400 ml-auto">更新 5 分钟前</span>
        </div>
        <div className="grid grid-cols-4 px-2 pb-3">
          {[
            { label: '销售机会', value: '0' },
            { label: '合同总额', value: '0' },
            { label: '回款总额', value: '0' },
            { label: '退款总额', value: '0' },
          ].map(d => (
            <div key={d.label} className="text-center py-2">
              <div className="text-[18px] font-bold text-brand">{d.value}</div>
              <div className="text-[10px] text-ink-500 mt-0.5">{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div className="mx-3 mt-3 card flex">
        {['跟进记录','详情','协作人','联系人(0)','销售机会(0)'].map((t, i) => (
          <button key={t} className={`flex-1 py-2.5 text-[12px] tap relative ${i === 1 ? 'text-brand font-medium' : 'text-ink-500'}`}>
            {t}
            {i === 1 && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand rounded"/>}
          </button>
        ))}
      </div>

      {/* 基本信息 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">基本信息</div>
        <div className="divide-y divide-ink-100 text-[13px]">
          <DetailRow label="模板" value="默认模板"/>
          <DetailRow label="客户名称" value={customer.name}/>
          <DetailRow label="所属公海" value="客户公海"/>
          <DetailRow label="客户简称" value="--"/>
          <DetailRow label="统一社会信用代码" value="--"/>
          <DetailRow label="所属行业" value={customer.industry}/>
          <DetailRow label="客户来源" value={customer.source}/>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:w-[390px] sm:left-1/2 sm:-translate-x-1/2 bg-white border-t border-ink-100 px-4 py-3 flex gap-3 z-40">
        <button className="flex-1 h-10 border border-ink-200 rounded-full text-[14px] text-ink-700 tap">更多</button>
        <button className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] tap">编辑</button>
      </div>
    </div>
  )
}

function ContractDetail({ contract, onBack }) {
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title="合同详情" onBack={onBack}/>
      <div className="bg-white px-4 py-4">
        <div className="text-[16px] font-medium">{contract.id}</div>
        <div className="text-[14px] text-ink-700 mt-1">{contract.title}</div>
        <div className="mt-2"><Tag text={contract.status} type="blue"/></div>
      </div>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">合同信息</div>
        <div className="divide-y divide-ink-100 text-[13px]">
          <DetailRow label="合同编号" value={contract.id}/>
          <DetailRow label="客户名称" value={contract.customer}/>
          <DetailRow label="合同金额" value={`¥ ${contract.amount.toLocaleString()}`} highlight/>
          <DetailRow label="签约日期" value={contract.date}/>
          <DetailRow label="合同状态" value={contract.status}/>
        </div>
      </div>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">回款计划</div>
        <div className="px-4 py-3 text-[12px] text-ink-500">合同签订后 30 天内回款 50%，剩余按月度分摊</div>
      </div>
    </div>
  )
}

function OpportunityDetail({ opp, onBack }) {
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title="销售机会" onBack={onBack}/>
      <div className="bg-white px-4 py-4">
        <div className="text-[16px] font-medium">{opp.name}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-ink-500">商机金额</span>
          <span className="text-[22px] font-bold text-brand">¥ {opp.amount.toLocaleString()}</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[12px] text-ink-500 mb-1">
            <span>当前阶段</span>
            <span className="text-ink-900">{opp.stage}</span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: `${opp.progress}%` }}/>
          </div>
        </div>
      </div>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">商机信息</div>
        <div className="divide-y divide-ink-100 text-[13px]">
          <DetailRow label="商机名称" value={opp.name}/>
          <DetailRow label="客户名称" value={opp.customer}/>
          <DetailRow label="商机金额" value={`¥ ${opp.amount.toLocaleString()}`}/>
          <DetailRow label="当前阶段" value={opp.stage}/>
          <DetailRow label="负责人" value="冯孙杰"/>
        </div>
      </div>
    </div>
  )
}

function FollowDetail({ onBack }) {
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title="跟进记录" onBack={onBack}/>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">跟进历史</div>
        <div>
          {followUps.map((f, i) => (
            <div key={f.id} className="px-4 py-3 border-b border-ink-100 last:border-0 flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-brand"/>
                {i < followUps.length - 1 && <div className="w-px flex-1 bg-ink-200 mt-1" style={{ minHeight: 30 }}/>}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium">{f.customer}</span>
                  <span className="text-[10px] text-ink-400">{f.date}</span>
                </div>
                <div className="text-[11px] text-ink-400 mt-0.5">{f.type} · {f.user}</div>
                <div className="text-[12px] text-ink-700 mt-1">{f.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApprovalDetail({ onBack }) {
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title="审批详情" onBack={onBack}/>
      <div className="bg-white px-4 py-4">
        <Tag text="合同审批" type="blue"/>
        <div className="text-[16px] font-medium mt-2">示例客户1 千川代投年框合同</div>
        <div className="text-[12px] text-ink-500 mt-1">申请人：冯孙杰 · 08-24 11:30</div>
        <div className="mt-3 text-[22px] font-bold text-brand">¥ 580,000</div>
      </div>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">审批流程</div>
        <div className="px-4 py-3 space-y-3">
          {[
            { name: '冯孙杰', action: '提交申请', time: '08-24 11:30', status: 'done' },
            { name: '张磊 (主管)', action: '已通过', time: '08-24 13:20', status: 'done' },
            { name: '王芳 (财务)', action: '审批中', time: '', status: 'current' },
            { name: '李娜 (总经办)', action: '待审批', time: '', status: 'pending' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 ${
                s.status === 'done' ? 'bg-success' : s.status === 'current' ? 'bg-warning' : 'bg-ink-300'
              }`}>
                {s.status === 'done' ? '✓' : s.status === 'current' ? '…' : i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-ink-900">{s.name} · <span className="text-ink-500">{s.action}</span></div>
                {s.time && <div className="text-[10px] text-ink-400">{s.time}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 sm:absolute sm:w-[390px] sm:left-1/2 sm:-translate-x-1/2 bg-white border-t border-ink-100 px-4 py-3 flex gap-3 z-40">
        <button className="flex-1 h-10 border border-danger text-danger rounded-full text-[14px] tap">拒绝</button>
        <button className="flex-1 h-10 bg-success text-white rounded-full text-[14px] tap">通过</button>
      </div>
    </div>
  )
}

function FinancePage({ type, onBack }) {
  const names = {
    contract: '合同列表',
    payment: '回款管理',
    balance: '余额管理',
    refund: '退款管理',
    reserve: '媒体备款管理',
    invoice: '开票管理',
  }
  const list = contracts.map((c, i) => ({ ...c, key: i }))
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title={names[type] || '财务'} onBack={onBack}/>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
          <span className="text-[13px] text-ink-500">共 {list.length} 条</span>
          <button className="text-[12px] text-brand">筛选 ▾</button>
        </div>
        <div className="divide-y divide-ink-100">
          {list.map(c => (
            <div key={c.key} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium">{c.title}</span>
                <Tag text={c.status} type={c.status === '执行中' ? 'blue' : 'orange'}/>
              </div>
              <div className="flex items-center justify-between mt-1 text-[12px] text-ink-500">
                <span>{c.customer}</span>
                <span className="text-brand font-medium">¥ {c.amount.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-ink-400 mt-1">{c.id} · {c.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReportPage({ type, onBack }) {
  const names = {
    sales: '销售报表',
    operation: '运营报表',
    media: '媒介报表',
    finance: '财务看板',
    kpi: 'KPI 报表',
    health: '客户健康',
  }
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title={names[type] || '报表'} onBack={onBack}/>
      <div className="px-3 pt-3 grid grid-cols-2 gap-2">
        <div className="card p-3 text-center">
          <div className="text-[18px] font-bold text-brand">¥ 3.85M</div>
          <div className="text-[10px] text-ink-500 mt-0.5">本月消耗</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-[18px] font-bold text-success">¥ 2.58M</div>
          <div className="text-[10px] text-ink-500 mt-0.5">本月回款</div>
        </div>
      </div>
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">报表列表</div>
        {[
          { name: '日报', date: '2026-08-24' },
          { name: '周报', date: '2026-08-19 ~ 08-25' },
          { name: '月报', date: '2026-08' },
          { name: '季报', date: '2026 Q3' },
        ].map((r, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-ink-100 last:border-0 tap">
            <div>
              <div className="text-[13px] font-medium">{r.name}</div>
              <div className="text-[10px] text-ink-400 mt-0.5">{r.date}</div>
            </div>
            <span className="text-[12px] text-brand">查看 ›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Placeholder({ module, id, onBack }) {
  const labels = {
    group: '集团管理', customer: '主体管理', project: '项目管理',
    advertiser: '广告主管理', policy: '政策管理', kpi: 'KPI管理',
    'sales-report': '销售报表', opportunity: '销售机会',
    visitors: '拜访签到', checkin: '拜访签到', dedupe: '查重工具',
    scan: '扫描名片', nearby: '附近客户', draft: '草稿箱',
    plan: '拜访计划', quote: '报价单',
    handover: '客户交接', rebate: '返点配置', 'approval-flow': '审批流',
    risk: '风控管理', ai: 'AI 助理', setting: '设置',
  }
  const label = labels[id] || id
  return (
    <div className="bg-ink-50 pb-4">
      <TopBarWithBack title={label} onBack={onBack}/>
      <div className="px-4 pt-12 text-center">
        <div className="text-[60px]">📋</div>
        <div className="text-[14px] text-ink-700 mt-3">{label}</div>
        <div className="text-[11px] text-ink-400 mt-1">演示页面占位，后续接入真实数据</div>
      </div>
    </div>
  )
}

// ============ 通用小组件 ============

function TopBarWithBack({ title, onBack }) {
  return (
    <div className="bg-white border-b border-ink-100 px-2 h-12 flex items-center justify-between sticky top-0 z-30">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center tap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h1 className="text-base font-medium">{title}</h1>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 flex items-center justify-center tap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#666" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center tap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.5" fill="#666"/>
            <circle cx="12" cy="12" r="1.5" fill="#666"/>
            <circle cx="19" cy="12" r="1.5" fill="#666"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-ink-500">{label}</span>
      <span className={`text-right ${highlight ? 'text-brand font-medium' : 'text-ink-900'}`}>{value}</span>
    </div>
  )
}

function ActionItem({ icon, label, highlight }) {
  return (
    <button className="flex items-center gap-1.5 text-[13px] tap">
      <span className={highlight ? 'text-brand' : 'text-ink-500'}>
        {icon === 'phone' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 4l3 0 1.5 4-2 1c1 2.5 3 4.5 5.5 5.5l1-2 4 1.5v3c0 1-1 2-2 2C9 19 5 15 5 6c0-1 1-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
      </span>
      <span className={highlight ? 'text-brand' : 'text-ink-700'}>{label}</span>
    </button>
  )
}
