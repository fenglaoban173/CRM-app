import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customersData, projectsData, groupPoliciesData, groupAccountIdsData, groupRechargesData, groupReservesData } from '../../data/mock'

/**
 * 集团详情页
 * - 默认显示「集团信息」tab
 * - 其他 tab（业务主体/项目/政策/账户ID/充值记录/集团备款/开票/回款）暂占位
 */
export default function GroupDetailPage() {
  const nav = useNavigate()
  const { id: groupId } = useParams()
  const [activeTab, setActiveTab] = useState('集团信息')

  const TABS = ['集团信息', '业务主体', '项目', '政策', '账户ID', '充值记录', '集团备款', '开票', '回款']

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="集团详情" onBack={() => nav(-1)}/>

      {/* 顶部分组信息 */}
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
            <span className="text-[18px] font-medium text-brand">共</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-medium text-ink-900 leading-tight">共读科技</div>
            <div className="text-[11px] text-ink-400 mt-1">集团ID: {groupId} · 销售归属: 潘建民</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-ink-400">综合评级</div>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                  fill={i <= 0 ? '#FFB400' : 'none'} stroke={i <= 0 ? '#FFB400' : '#C9CDD4'}
                  strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 横滑 Tabs */}
      <div className="bg-white border-b border-ink-100 sticky top-12 z-20">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`shrink-0 h-11 px-4 text-[13px] relative tap ${
                activeTab === t ? 'text-brand font-medium' : 'text-ink-700'
              }`}
            >
              {t}
              {activeTab === t && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-[2px] bg-brand rounded-full"/>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 内容 */}
      <div className="pt-3">
        {activeTab === '集团信息' && <GroupInfoTab nav={nav} groupId={groupId}/>}
        {activeTab === '业务主体' && <SubjectTab groupId={groupId}/>}
        {activeTab === '项目' && <ProjectTab groupId={groupId}/>}
        {activeTab === '政策' && <PolicyTab groupId={groupId}/>}
        {activeTab === '账户ID' && <AccountIdTab groupId={groupId}/>}
        {activeTab === '充值记录' && <RechargeTab groupId={groupId}/>}
        {activeTab === '集团备款' && <ReserveTab groupId={groupId}/>}
        {activeTab !== '集团信息' && activeTab !== '业务主体' && activeTab !== '项目' && activeTab !== '政策' && activeTab !== '账户ID' && activeTab !== '充值记录' && activeTab !== '集团备款' && <TabPlaceholder name={activeTab}/>}
      </div>
    </div>
  )
}

// ============ 集团信息 Tab ============
function GroupInfoTab({ nav, groupId }) {
  return (
    <>
      {/* 基本信息 */}
      <Section title="基本信息">
        <Row label="集团简称" value="共读科技"/>
        <Row label="集团简称（看板分析）" value="共读科技"/>
        <Row label="集团备注" value="--" muted/>
        <Row label="创建人" value="潘建民"/>
        <Row label="附件" value="无" muted/>
        <Row label="集团名称（销售归属）文本组合" value="共读科技"/>
        <Row label="集团综合评级" value="0"/>
        <Row label="创建日期" value="2026-08-22 12:57:36"/>
        <Row label="更新时间" value="2026-08-24 09:52:02" last/>
      </Section>

      {/* 资金信息 */}
      <Section title="资金信息">
        <Row label="其他备款总金额" value="0.00"/>
        <Row label="其他备款余额" value="0.00" last/>
        <Row label="对公备款总金额" value="0.00"/>
        <Row label="对公余额" value="0.00" last/>
        <Row label="授信金额" value="0.00"/>
        <Row label="授信余额" value="0.00" last/>
      </Section>

      {/* 联系人 */}
      <Section title="联系人" rightAction={<NewButton text="新建联系人" onClick={() => nav('/group/contact/' + groupId)}/>}>
        <div className="py-10 text-center">
          <div className="text-[36px] mb-2 opacity-30">👤</div>
          <div className="text-[13px] text-ink-400">暂无数据</div>
        </div>
      </Section>

      {/* 背调信息 */}
      <Section title="背调信息" rightAction={<EditButton onClick={() => nav('/group/background/' + groupId)}/>}>
        <Row label="上市与否" value="--" muted/>
        <Row label="集团来源" value="--" muted/>
        <Row label="合作媒体" value="--" muted/>
        <Row label="申请授信额度（万）" value="--" muted/>
        <Row label="预估日消耗（万）" value="--" muted/>
        <Row label="成立时间" value="--" muted/>
        <Row label="合作代理" value="--" muted/>
        <Row label="人员规模" value="--" muted/>
        <Row label="投放产品" value="--" muted last/>
        <Row label="公司背景" value="--" muted/>
        <Row label="公司LOGO" value="--" muted/>
        <Row label="营业执照" value="--" muted last/>
        <Row label="办公场景" value="--" muted last/>
      </Section>
    </>
  )
}

// ============ 业务主体 Tab ============
function SubjectTab({ groupId }) {
  const [keyword, setKeyword] = useState('')
  // 过滤属于该集团的所有主体（按 groupId 匹配）
  const list = customersData
    .filter(c => c.groupId === groupId || c.groupId === '1014536')
    .filter(c => !keyword || c.name.includes(keyword))

  return (
    <>
      {/* 钉钉式搜索条 */}
      <SearchBar label="主体名称" value={keyword} onChange={setKeyword}/>

      {list.length === 0 ? (
        <TabPlaceholder name="业务主体"/>
      ) : (
        <>
          <div className="px-3 pt-1 flex items-center justify-end">
            <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
          </div>
          <div className="px-3 pt-2 space-y-2">
            {list.map(c => <SubjectCard key={c.id} subject={c}/>)}
          </div>
        </>
      )}
    </>
  )
}

function SubjectCard({ subject }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：名称 + 编号 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{subject.name}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">主体编号: {subject.id}</div>
      </div>

      {/* 中部：2 列字段 */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="OA创建日期" value={subject.oaDate}/>
        <DetailRow label="生效状态" value={subject.status} tag/>
        <DetailRow label="综合评分" value={subject.score} score/>
        <DetailRow label="所属行业" value={subject.industry}/>
        <DetailRow label="标签" value={subject.tag} tag/>
        <DetailRow label="银行账号" value={subject.bankAccount}/>
        <DetailRow label="注册电话" value={subject.phone}/>
        <DetailRow label="统一社会信用代码" value={subject.creditCode}/>
        <DetailRow label="账户类型" value={subject.accountType} tag/>
        <DetailRow label="集团ID" value={subject.groupId}/>
        <DetailRow label="创建人" value={subject.creator}/>
        <DetailRow label="创建时间" value={subject.created}/>
        <DetailRow label="更新时间" value={subject.updated}/>
      </div>
    </div>
  )
}

// ============ 项目 Tab ============
function ProjectTab({ groupId }) {
  const [keyword, setKeyword] = useState('')
  // 过滤属于该集团的所有项目（按 groupName 匹配）
  const group = customersData.find(c => c.groupId === groupId)
  const groupName = group?.groupName || ''
  const list = projectsData
    .filter(p => p.groupName === groupName || p.groupName === '共读科技')
    .filter(p => !keyword || p.name.includes(keyword))

  return (
    <>
      {/* 钉钉式搜索条 */}
      <SearchBar label="项目名称" value={keyword} onChange={setKeyword}/>

      {list.length === 0 ? (
        <TabPlaceholder name="项目"/>
      ) : (
        <>
          <div className="px-3 pt-1 flex items-center justify-end">
            <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
          </div>
          <div className="px-3 pt-2 space-y-2">
            {list.map((p, i) => <ProjectCard key={p.code || i} project={p}/>)}
          </div>
        </>
      )}
    </>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：名称 + 编码 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{project.name}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">编码: {project.code}</div>
      </div>

      {/* 中部：2 列字段 */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="内部自动编码" value={project.internalCode}/>
        <DetailRow label="销售控制等级" value={project.level}/>
        <DetailRow label="活跃状态" value={project.status} tag/>
        <DetailRow label="客户集团全称" value={project.groupName}/>
        <DetailRow label="项目编号" value={project.projectId}/>
        <DetailRow label="销售人姓名" value={project.salesName}/>
        <DetailRow label="创建时间" value={project.created}/>
        <DetailRow label="更新时间" value={project.updated}/>
      </div>
    </div>
  )
}

// ============ 详情字段行 ============
function DetailRow({ label, value, tag, score, muted }) {
  const v = value == null || value === '' || value === '--' ? '--' : value
  const isEmpty = v === '--'

  // 评分（带进度条）
  if (score && typeof value === 'number') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{label}</span>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden w-12">
            <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(value * 20, 100)}%` }}/>
          </div>
          <span className="text-[11px] text-ink-900">{value}</span>
        </div>
      </div>
    )
  }

  // 标签（带 tag 样式）
  if (tag && !isEmpty) {
    const tagColor = value === '生效' ? 'bg-success/10 text-success'
      : value === '活跃' ? 'bg-success/10 text-success'
      : value === '暂停' ? 'bg-warning/10 text-warning'
      : value === '预付' ? 'bg-brand/10 text-brand'
      : value === '后付' ? 'bg-warning/10 text-warning'
      : value === '走量' ? 'bg-success/10 text-success'
      : value === '包断' ? 'bg-brand/10 text-brand'
      : value === '直接客户' ? 'bg-success/10 text-success'
      : value === '代理' ? 'bg-purple/10 text-purple'
      : value === '成功' ? 'bg-success/10 text-success'
      : value === '处理中' ? 'bg-warning/10 text-warning'
      : value === '失败' ? 'bg-danger/10 text-danger'
      : value === '对公' ? 'bg-brand/10 text-brand'
      : value === '授信' ? 'bg-purple/10 text-purple'
      : value === '现金' ? 'bg-success/10 text-success'
      : value === '外部充值' ? 'bg-success/10 text-success'
      : value === '账户间转账' ? 'bg-brand/10 text-brand'
      : value === '提现' ? 'bg-warning/10 text-warning'
      : value === '退款' ? 'bg-danger/10 text-danger'
      : value === '已确认' ? 'bg-success/10 text-success'
      : value === '待确认' ? 'bg-warning/10 text-warning'
      : 'bg-ink-100 text-ink-500'
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{label}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${tagColor}`}>{v}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-ink-400 shrink-0">{label}</span>
      <span className={`truncate ${isEmpty || muted ? 'text-ink-300' : 'text-ink-900'}`}>{v}</span>
    </div>
  )
}

// ============ 政策 Tab ============
function PolicyTab({ groupId }) {
  const [keyword, setKeyword] = useState('')
  // 过滤属于该集团的所有政策（按 groupName 匹配）
  const list = groupPoliciesData
    .filter(p => p.groupName === '共读科技')
    .filter(p => !keyword || p.name.includes(keyword))

  return (
    <>
      {/* 钉钉式搜索条 */}
      <SearchBar label="政策名称" value={keyword} onChange={setKeyword}/>

      {list.length === 0 ? (
        <TabPlaceholder name="政策"/>
      ) : (
        <>
          <div className="px-3 pt-1 flex items-center justify-end">
            <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
          </div>
          <div className="px-3 pt-2 space-y-2">
            {list.map(p => <PolicyCard key={p.id} policy={p}/>)}
          </div>
        </>
      )}
    </>
  )
}

function PolicyCard({ policy }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：政策名称 + ID */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{policy.name}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">政策ID: {policy.id}</div>
      </div>

      {/* 中部：2 列字段（18 字段） */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="付款方式" value={policy.payType} tag/>
        <DetailRow label="返点比例" value={policy.rebateRate}/>
        <DetailRow label="首充预估金额" value={policy.firstRecharge}/>
        <DetailRow label="预付资金金额" value={policy.prepaidAmount}/>
        <DetailRow label="合作模式" value={policy.coopMode} tag/>
        <DetailRow label="项目编号" value={policy.projectCode}/>
        <DetailRow label="客户行业" value={policy.industry}/>
        <DetailRow label="垫款账期(天)" value={policy.creditDays}/>
        <DetailRow label="客户类型" value={policy.customerType} tag/>
        <DetailRow label="竞价类型" value={policy.bidType}/>
        <DetailRow label="备注" value={policy.remark}/>
        <DetailRow label="客户名称" value={policy.customerName}/>
        <DetailRow label="服务费比例" value={policy.serviceRate}/>
        <DetailRow label="集团名称" value={policy.groupName}/>
        <DetailRow label="创建人" value={policy.creator}/>
        <DetailRow label="媒体平台" value={policy.platform}/>
        <DetailRow label="媒介开户人" value={policy.agentName}/>
      </div>
    </div>
  )
}

// ============ 充值记录 Tab ============
function RechargeTab({ groupId }) {
  // 2 行钉钉式筛选：第 1 行 adId（广告主ID）+ 第 2 行 groupName（充值集团名称）
  const [adId, setAdId] = useState('')
  const [groupName, setGroupName] = useState('')
  // 高级筛选弹窗状态（操作类型/资金类型/操作人/状态）
  const [showFilter, setShowFilter] = useState(false)
  const [opType, setOpType] = useState('')
  const [fundType, setFundType] = useState('')
  const [operator, setOperator] = useState('')
  const [status, setStatus] = useState('')

  // 过滤属于该集团的充值记录
  const list = groupRechargesData
    .filter(r => r.groupId === groupId || r.groupName === '共读科技' || r.groupId === '1014536')
    .filter(r => !adId || r.fromId.includes(adId) || r.toId.includes(adId))
    .filter(r => !groupName || r.groupName.includes(groupName))
    .filter(r => !opType || r.opType === opType)
    .filter(r => !fundType || r.fundType === fundType)
    .filter(r => !operator || r.operator.includes(operator))
    .filter(r => !status || r.status === status)

  // 已选筛选数（用于筛选 icon 角标）
  const activeFilterCount = [opType, fundType, operator, status].filter(Boolean).length

  return (
    <>
      {/* 钉钉式查询条件（2 行） */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          {/* 第 1 行：广告主ID + 搜索 */}
          <div className="flex items-center gap-2 px-3 py-3">
            <button className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 tap shrink-0">
              <span>广告主ID</span>
              <span className="text-ink-400">▾</span>
            </button>
            <div className="flex-1 relative">
              <input
                value={adId}
                onChange={e => setAdId(e.target.value)}
                placeholder="广告主ID"
                className="w-full h-9 pl-9 pr-3 bg-ink-50 rounded-full text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* 第 2 行：充值集团名称 + 漏斗筛选 */}
          <div className="flex items-center gap-2 px-3 pb-3">
            <button className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 tap shrink-0">
              <span>充值集团名称</span>
              <span className="text-ink-400">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px] text-ink-400">
              充值集团名称
            </div>
            <button onClick={() => setShowFilter(true)} className="w-9 h-9 flex items-center justify-center tap shrink-0 relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h14M5 12h10M8 19h5" stroke="#2D7FF9" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="18" cy="5" r="2.2" fill="white" stroke="#2D7FF9" strokeWidth="1.6"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-danger text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 共 N 条 + 导出按钮 */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
        <button className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      {list.length === 0 ? (
        <div className="mx-3 mt-3 card overflow-hidden">
          <div className="py-16 text-center">
            <div className="text-[36px] mb-2 opacity-30">📋</div>
            <div className="text-[13px] text-ink-500">充值记录</div>
            <div className="text-[11px] text-ink-400 mt-1">暂无数据</div>
          </div>
        </div>
      ) : (
        <div className="px-3 pt-2 space-y-2">
          {list.map(r => <RechargeCard key={r.id} recharge={r}/>)}
        </div>
      )}

      {/* 高级筛选弹窗 */}
      {showFilter && (
        <FilterModal
          opType={opType} setOpType={setOpType}
          fundType={fundType} setFundType={setFundType}
          operator={operator} setOperator={setOperator}
          status={status} setStatus={setStatus}
          onClose={() => setShowFilter(false)}
        />
      )}
    </>
  )
}

// ============ 高级筛选弹窗（钉钉式左侧字段 + 右侧条件）============
function FilterModal({ opType, setOpType, fundType, setFundType, operator, setOperator, status, setStatus, onClose }) {
  const [activeField, setActiveField] = useState('操作类型')
  const fields = ['操作类型', '资金类型', '操作人', '状态']
  const fieldOptions = {
    '操作类型': ['外部充值', '账户间转账', '提现', '退款'],
    '资金类型': ['对公', '授信', '预付'],
    '操作人': ['潘建民', '王春雷', '张三', '李四'],
    '状态': ['成功', '处理中', '失败'],
  }
  const currentValue = {
    '操作类型': opType, '资金类型': fundType, '操作人': operator, '状态': status,
  }[activeField]
  const setCurrentValue = {
    '操作类型': setOpType, '资金类型': setFundType, '操作人': setOperator, '状态': setStatus,
  }[activeField]

  // 重置
  const handleReset = () => {
    setOpType(''); setFundType(''); setOperator(''); setStatus('')
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        {/* 顶部：标题 + 关闭 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 主体：左侧字段列表 + 右侧条件 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧字段 */}
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button
                key={f}
                onClick={() => setActiveField(f)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  activeField === f
                    ? 'bg-white text-brand border-brand font-medium'
                    : 'text-ink-700 border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 右侧条件值 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-[12px] text-ink-500 mb-2">属于</div>
            <div className="space-y-2">
              <label onClick={() => setCurrentValue('')} className="flex items-center gap-2 px-2 py-1.5 rounded tap cursor-pointer">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                  !currentValue ? 'border-brand' : 'border-ink-200'
                }`}>
                  {!currentValue && <span className="w-2 h-2 rounded-full bg-brand"/>}
                </span>
                <span className="text-[13px] text-ink-900">默认{activeField.slice(-2)}</span>
              </label>
              {fieldOptions[activeField]?.map(opt => (
                <label key={opt} onClick={() => setCurrentValue(opt)} className="flex items-center gap-2 px-2 py-1.5 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                    currentValue === opt ? 'border-brand' : 'border-ink-200'
                  }`}>
                    {currentValue === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">{opt}</span>
                </label>
              ))}
              {activeField === '操作人' && (
                <input
                  value={operator}
                  onChange={e => setOperator(e.target.value)}
                  placeholder="自定义输入"
                  className="mt-2 w-full h-8 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
                />
              )}
            </div>
          </div>
        </div>

        {/* 底部：重置 + 确认（fixed 在弹窗底部，避开全局 nav） */}
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

function RechargeCard({ recharge }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：订单号 + 充值集团名称 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{recharge.id}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">充值集团: {recharge.groupName} · 操作时间: {recharge.opTime}</div>
      </div>

      {/* 中部：18 字段网格 */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="充值返点" value={recharge.rebate}/>
        <DetailRow label="转账单号" value={recharge.transferNo}/>
        <DetailRow label="代理商ID" value={recharge.agentId}/>
        <DetailRow label="转出方ID" value={recharge.fromId}/>
        <DetailRow label="转入方ID" value={recharge.toId}/>
        <DetailRow label="操作类型" value={recharge.opType} tag/>
        <DetailRow label="资金类型" value={recharge.fundType} tag/>
        <DetailRow label="操作币金额" value={'¥ ' + Number(recharge.amount).toLocaleString()}/>
        <DetailRow label="充值现金" value={recharge.cash}/>
        <DetailRow label="充值类型" value={recharge.rechargeType} tag/>
        <DetailRow label="状态" value={recharge.status} tag/>
        <DetailRow label="错误原因" value={recharge.errorReason}/>
        <DetailRow label="操作人" value={recharge.operator}/>
        <DetailRow label="所属群名称" value={recharge.chatGroup}/>
        <DetailRow label="付款截图" value={recharge.screenshot}/>
      </div>
    </div>
  )
}

// ============ 集团备款 Tab ============
function ReserveTab({ groupId }) {
  const [keyword, setKeyword] = useState('')
  // 过滤属于该集团的备款记录
  const list = groupReservesData
    .filter(r => r.groupId === groupId || r.groupName === '共读科技' || r.groupId === '1014536')
    .filter(r => !keyword || r.id.includes(keyword))

  return (
    <>
      {/* 单输入框搜索条（按 PC 截图：备款单号 + 输入框） */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-3">
            <span className="text-[12px] text-ink-700 shrink-0">备款单号:</span>
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="备款单号"
              className="flex-1 h-8 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mx-3 mt-3 card overflow-hidden">
          <div className="py-16 text-center">
            <div className="text-[36px] mb-2 opacity-30">📋</div>
            <div className="text-[13px] text-ink-500">集团备款</div>
            <div className="text-[11px] text-ink-400 mt-1">暂无数据</div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-3 pt-3 flex items-center justify-end">
            <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
          </div>
          <div className="px-3 pt-2 space-y-2">
            {list.map(r => <ReserveCard key={r.id} reserve={r}/>)}
          </div>
        </>
      )}
    </>
  )
}

function ReserveCard({ reserve }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：备款单号 + 集团名称 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{reserve.id}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">{reserve.groupName} · 创建时间: {reserve.created}</div>
      </div>

      {/* 中部：12 字段网格 */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="银行名称" value={reserve.bankName}/>
        <DetailRow label="银行账户" value={reserve.bankAccount}/>
        <DetailRow label="账户名称" value={reserve.accountName}/>
        <DetailRow label="对私金额" value={'¥ ' + Number(reserve.privateAmount).toLocaleString()}/>
        <DetailRow label="对公金额" value={'¥ ' + Number(reserve.publicAmount).toLocaleString()}/>
        <DetailRow label="备款状态" value={reserve.status} tag/>
        <DetailRow label="实际打款人" value={reserve.actualPayer}/>
        <DetailRow label="备注" value={reserve.remark}/>
        <DetailRow label="创建时间" value={reserve.created}/>
        <DetailRow label="更新时间" value={reserve.updated}/>
      </div>
    </div>
  )
}

// ============ 账户ID Tab ============
function AccountIdTab({ groupId }) {
  const [keyword, setKeyword] = useState('')
  // 过滤属于该集团的所有账户ID（兼容 groupId 参数 + 集团名称）
  const list = groupAccountIdsData
    .filter(a => a.groupId === groupId || a.groupName === '共读科技' || a.groupId === '1014536')
    .filter(a => !keyword || a.id.toLowerCase().includes(keyword.toLowerCase()))

  return (
    <>
      {/* 钉钉式搜索条（单输入框 + 搜索 icon，无字段 chip） */}
      <AccountIdSearchBar value={keyword} onChange={setKeyword}/>

      {list.length === 0 ? (
        // 暂无数据占位（按 PC 端居中显示「暂无数据」）
        <div className="mx-3 mt-3 card overflow-hidden">
          <div className="py-16 text-center">
            <div className="text-[36px] mb-2 opacity-30">📋</div>
            <div className="text-[13px] text-ink-500">账户ID</div>
            <div className="text-[11px] text-ink-400 mt-1">暂无数据</div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-3 pt-1 flex items-center justify-end">
            <span className="text-[11px] text-ink-500">共 {list.length} 条</span>
          </div>
          <div className="px-3 pt-2 space-y-2">
            {list.map(a => <AccountIdCard key={a.id} account={a}/>)}
          </div>
        </>
      )}
    </>
  )
}

function AccountIdSearchBar({ value, onChange }) {
  return (
    <div className="px-3 pt-3">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-3">
          <span className="text-[12px] text-ink-700 shrink-0">广告主ID:</span>
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="广告主ID"
            className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>
    </div>
  )
}

function AccountIdCard({ account }) {
  return (
    <div className="card overflow-hidden">
      {/* 顶部：广告主ID + 名称 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{account.id}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">广告主名称: {account.name}</div>
      </div>

      {/* 中部：14 字段网格 */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <DetailRow label="媒体账号状态" value={account.accountStatus} tag/>
        <DetailRow label="生效状态" value={account.status} tag/>
        <DetailRow label="一级行业（新）" value={account.industryL1}/>
        <DetailRow label="二级行业（新）" value={account.industryL2}/>
        <DetailRow label="媒体平台名称" value={account.platform}/>
        <DetailRow label="政策编号" value={account.policyCode}/>
        <DetailRow label="客户名称" value={account.customerName}/>
        <DetailRow label="客户集团名称" value={account.groupName}/>
        <DetailRow label="客户返点比例" value={account.rebateRate}/>
        <DetailRow label="创建人" value={account.creator}/>
        <DetailRow label="创建时间" value={account.created}/>
        <DetailRow label="更新时间" value={account.updated}/>
      </div>
    </div>
  )
}

// ============ 钉钉式搜索条 ============
function SearchBar({ label, value, onChange }) {
  return (
    <div className="px-3 pt-3">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-3">
          <div className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 shrink-0">
            <span>{label}</span>
            <span className="text-ink-400">▾</span>
          </div>
          <div className="flex-1 relative">
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={`请输入${label}`}
              className="w-full h-9 pl-9 pr-3 bg-ink-50 rounded-full text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
              <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
              <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 其他 Tab 占位 ============
function TabPlaceholder({ name }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="py-16 text-center">
        <div className="text-[36px] mb-2 opacity-30">📋</div>
        <div className="text-[13px] text-ink-500">{name}</div>
        <div className="text-[11px] text-ink-400 mt-1">暂无数据</div>
      </div>
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ title, onBack }) {
  return (
    <div className="bg-brand text-white sticky top-0 z-30">
      <div className="px-2 h-12 flex items-center justify-between relative">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center tap relative z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
        <div className="w-8 h-8 relative z-10"/>
      </div>
    </div>
  )
}

// ============ 区块 ============
function Section({ title, rightAction, children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title justify-between">
        <span>{title}</span>
        {rightAction}
      </div>
      <div className="pb-2">{children}</div>
    </div>
  )
}

// ============ 字段行 ============
function Row({ label, value, muted, last }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 text-[13px] ${last ? '' : 'border-b border-ink-100/60'}`}>
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className={`ml-3 text-right truncate ${muted ? 'text-ink-300' : 'text-ink-900'}`}>{value}</span>
    </div>
  )
}

// ============ 操作按钮 ============
function NewButton({ text, onClick }) {
  return (
    <button onClick={onClick} className="h-7 px-3 bg-brand text-white rounded-full text-[11px] flex items-center gap-1 tap">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
      {text}
    </button>
  )
}

function EditButton({ onClick }) {
  return (
    <button onClick={onClick} className="h-7 px-3 bg-brand text-white rounded-full text-[11px] flex items-center gap-1 tap">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
      编辑
    </button>
  )
}