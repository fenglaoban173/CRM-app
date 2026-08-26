import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { findNode, findPath, colorMap, advertiserAccountsData, walletChangeRecordsData, policyChangeRecordsData, policiesData, livePoliciesData, materialPurchasesData, deptKpiOverviewData, deptKpiData, deptListOptions, mediaListOptions, deptKpiSettingData, deptKpiMonthsOptions, staffList, staffKpiSettingData, staffKpiOverviewData, staffKpiData, changeLogData, approvalsData, operationReportData, operationReportDetailData } from '../../data/mock'
import ToutiaoBalancePage from '../ToutiaoBalancePage'
import SelfOperationPage from '../SelfOperationPage'
import CustomerHealthPage from '../CustomerHealthPage'
import MediaMonthlyReportPage from '../MediaMonthlyReportPage'
import MediaDailyReportPage from '../MediaDailyReportPage'
import MediaWeeklyReportPage from '../MediaWeeklyReportPage'
import MediaQuarterlyReportPage from '../MediaQuarterlyReportPage'
import MediaSemiAnnualReportPage from '../MediaSemiAnnualReportPage'
import MediaYearlyReportPage from '../MediaYearlyReportPage'
import dayjs from 'dayjs'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, ReferenceLine, PieChart, Pie, Cell as PieCell, Legend,
} from 'recharts'

/**
 * 通用菜单页 - 根据 caidan.json 节点 template 渲染
 * template: list | approval | dashboard
 */
export default function MenuPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const node = findNode(Number(id))
  const path = findPath(Number(id))
  const fromMe = searchParams.get('from') === 'me'
  const fromWork = searchParams.get('from') === 'work'

  // 业绩汇总 → 独立页面
  useEffect(() => {
    if (Number(id) === 2401) nav('/performance', { replace: true })
  }, [id, nav])

  if (!node) return <NotFound/>
  if (Number(id) === 2401) return null  // 重定向中，不渲染 MenuPage 内容

  const parent = path[path.length - 2]

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      <TopBar
        title={node.label}
        breadcrumb={fromMe ? `我的 / ${node.label}` : fromWork ? `工作台 / ${node.label}` : (() => { const bc = path.filter(p => p.id !== 2447).map(p => p.label).join(' / '); return bc === node.label ? '' : bc })()}
        onBack={() => {
          if (fromMe) return nav('/me')
          if (fromWork) return nav('/work')
          // 二级以下菜单 → 上一级
          if (parent && parent.pid !== 0) return nav(`/m/${parent.id}`)
          // 一级菜单（pid=0，如业务管理/项目管理/人事管理 等顶层分类）→ 回工作页面
          return nav('/work')
        }}
      />

      {/* 如果有子菜单，渲染子菜单入口 */}
      {node.children && node.children.length > 0 && (
        <ChildMenuGrid items={node.children} onClick={(c) => nav(`/m/${c.id}`)}/>
      )}

      {/* 根据 template 渲染不同内容 */}
      {node.template === 'list' && <ListSection node={node}/>}
      {node.template === 'balanceReport' && <ToutiaoBalancePage node={node}/>}
      {node.template === 'selfOperationReport' && <SelfOperationPage node={node}/>}
      {node.template === 'customerHealthReport' && <CustomerHealthPage node={node}/>}
      {node.template === 'mediaMonthlyReport' && <MediaMonthlyReportPage node={node}/>}
      {node.template === 'mediaDailyReport' && <MediaDailyReportPage node={node}/>}
      {node.template === 'mediaWeeklyReport' && <MediaWeeklyReportPage node={node}/>}
      {node.template === 'mediaQuarterlyReport' && <MediaQuarterlyReportPage node={node}/>}
      {node.template === 'mediaSemiAnnualReport' && <MediaSemiAnnualReportPage node={node}/>}
      {node.template === 'mediaYearlyReport' && <MediaYearlyReportPage node={node}/>}
      {node.template === 'groupList' && <GroupListSection node={node}/>}
      {node.template === 'subjectList' && (
        node.index === 'Policy' ? <PolicyListSection node={node}/>
        : node.index === 'LivePolicy' ? <LivePolicyListSection node={node}/>
        : node.index === 'MaterialPurchase' ? <MaterialPurchaseListSection node={node}/>
        : <SubjectListSection node={node}/>
      )}
      {node.template === 'projectList' && <ProjectListSection node={node}/>}
      {node.template === 'approval' && <ApprovalCenterSection node={node}/>}
      {node.template === 'dashboard' && <DashboardSection/>}
      {node.template === 'advertiserApplyList' && <AdvertiserApplyListSection node={node}/>}
      {node.template === 'advertiserDetailList' && <AdvertiserDetailListSection node={node}/>}
      {node.template === 'advertiserAccountList' && <AdvertiserAccountListSection node={node}/>}
      {node.template === 'advertiserTaskList' && <AdvertiserTaskListSection node={node}/>}
      {node.template === 'deptKpi' && <DeptKpiReportSection/>}
      {node.template === 'deptKpiSetting' && <DeptKpiSettingSection/>}
      {node.template === 'staffKpiSetting' && <StaffKpiSettingSection/>}
      {node.template === 'staffKpiReport' && <StaffKpiReportSection/>}
      {node.template === 'changeLog' && <ChangeLogSection/>}
      {node.template === 'poolDataList' && <PoolDataSection node={node}/>}
      {node.template === 'operationList' && <OperationListSection node={node}/>}
      {node.template === 'accountIdList' && <AccountIdSection node={node}/>}
      {node.template === 'operationReport' && <OperationReportSection node={node}/>}
      {node.template === 'mingdian' && <ConsumptionReportSection node={node} config={MINGDIAN_CONFIG}/>}
      {node.template === 'operatorDashboard' && <ConsumptionReportSection node={node} config={OPERATOR_DASHBOARD_CONFIG}/>}
      {node.template === 'customerPolicy' && <CustomerPolicySection node={node} config={CUSTOMER_POLICY_CONFIG}/>}

      {/* 集团/项目/广告主/政策列表 - 右下角悬浮新建按钮 */}
      {node.template === 'groupList' && <GroupFab/>}
      {node.template === 'projectList' && <ProjectFab/>}
      {node.template === 'advertiserApplyList' && <AdvertiserApplyFab/>}
      {node.template === 'advertiserDetailList' && false}
      {node.template === 'advertiserAccountList' && <AdvertiserAccountFab/>}
      {node.template === 'advertiserTaskList' && <AdvertiserTaskFab/>}
      {(node.index === 'LivePolicy' || node.index === 'MaterialPurchase') && <PolicyCreateFab index={node.index}/>}
      {node.template === 'poolDataList' && false /* FAB 已内嵌到内容流中 */}
    </div>
  )
}

// ============ 集团列表悬浮新建按钮（FAB）============
function GroupFab() {
  const nav = useNavigate()
  return (
    <div className="fixed right-4 bottom-20 z-40">
      <button onClick={() => nav('/group/create')} className="h-14 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">新建集团</span>
      </button>
    </div>
  )
}

// ============ 项目新建 FAB（与新建集团同样式）============
function ProjectFab() {
  const nav = useNavigate()
  return (
    <div className="fixed right-4 bottom-20 z-40">
      <button onClick={() => nav('/project/create')} className="h-14 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">新建项目</span>
      </button>
    </div>
  )
}

// ============ 政策管理 FAB（直播政策 / 素材采买）============
function PolicyCreateFab({ index }) {
  const nav = useNavigate()
  const label = index === 'LivePolicy' ? '新建直播政策' : (index === 'MaterialPurchase' ? '新建素材采买' : '新建')
  const route = index === 'LivePolicy' ? '/policy/live/create' : (index === 'MaterialPurchase' ? '/policy/material/create' : null)
  if (!route) return null
  return (
    <div className="fixed right-4 bottom-20 z-40">
      <button onClick={() => nav(route)} className="h-14 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">{label}</span>
      </button>
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ title, breadcrumb, onBack }) {
  return (
    <div className="bg-brand text-white sticky top-0 z-30">
      <div className="px-2 h-12 flex items-center justify-between relative">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center tap relative z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
        <button className="w-8 h-8 flex items-center justify-center tap relative z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.5" fill="white"/>
            <circle cx="12" cy="12" r="1.5" fill="white"/>
            <circle cx="19" cy="12" r="1.5" fill="white"/>
          </svg>
        </button>
      </div>
      {breadcrumb && (
        <div className="px-4 pb-2 text-[11px] opacity-90 truncate">{breadcrumb}</div>
      )}
    </div>
  )
}

// ============ 子菜单入口（4 列宫格）============
function ChildMenuGrid({ items, onClick }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2 text-[15px] font-medium text-ink-900">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#2D7FF9" strokeWidth="1.8"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#2D7FF9" strokeWidth="1.8"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#2D7FF9" strokeWidth="1.8"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#2D7FF9" strokeWidth="1.8"/>
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-y-3 px-2 pb-3">
        {items.map(c => (
          <button key={c.id} onClick={() => onClick(c)} className="flex flex-col items-center gap-1.5 tap">
            <ChildIcon color={c.color}/>
            <span className="text-[11px] text-ink-900 text-center leading-tight px-1">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ChildIcon({ color = 'blue' }) {
  const map = { blue:'#EBF3FF',green:'#E8F8EA',orange:'#FFF3E5',red:'#FFE9E9',purple:'#F0E9FF',gray:'#F0F2F5' }
  const fg = { blue:'#2D7FF9',green:'#34A853',orange:'#FF9A3C',red:'#FF5A5A',purple:'#9B7FF5',gray:'#999999' }
  return (
    <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: map[color] || map.blue }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1" stroke={fg[color] || fg.blue} strokeWidth="1.8"/>
        <rect x="13" y="4" width="7" height="7" rx="1" stroke={fg[color] || fg.blue} strokeWidth="1.8"/>
        <rect x="4" y="13" width="7" height="7" rx="1" stroke={fg[color] || fg.blue} strokeWidth="1.8"/>
        <rect x="13" y="13" width="7" height="7" rx="1" stroke={fg[color] || fg.blue} strokeWidth="1.8"/>
      </svg>
    </div>
  )
}

// ============ 列表页（搜索 + 表格）============
function ListSection({ node }) {
  const nav = useNavigate()
  const fields = node.fields || []
  const data = node.data || []

  // 计算每列宽度总和 - 移动端横向滚动
  const totalWidth = fields.reduce((s, f) => s + (f.width || 100), 0) + 60

  return (
    <>
      {/* 搜索栏 */}
      <div className="px-3 py-3 bg-white sticky top-[48px] z-20 border-b border-ink-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-ink-100 rounded-full h-9 flex items-center px-4 text-[13px] text-ink-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2">
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
              <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            搜索{node.label}
          </div>
          <button className="px-3 h-9 border border-ink-200 rounded-full text-[12px] text-ink-700 tap">筛选 ▾</button>
        </div>
      </div>

      {/* 统计 */}
      <div className="px-3 pt-3 text-[12px] text-ink-500">共 {data.length} 条</div>

      {/* 表格 */}
      <div className="mx-3 mt-2 card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="text-[12px]" style={{ minWidth: totalWidth }}>
            <thead className="bg-ink-50 text-ink-500">
              <tr>
                {fields.map(f => (
                  <th key={f.key} className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: f.width }}>
                    {f.label}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left font-medium w-16 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  {fields.map(f => (
                    <td key={f.key} className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: f.width }}>
                      <Cell field={f} value={row[f.key]}/>
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <button className="text-brand text-[11px] tap">查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Cell({ field, value }) {
  return <FieldCell field={field} value={value}/>
}

// ============ 集团列表（卡片式 + 钉钉式查询条件）============
function GroupListSection({ node }) {
  const data = node.data || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const fields = node.fields || []

  return (
    <>
      {/* 钉钉式查询条件条：字段+输入 + 新建按钮 */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          {/* 第一行：字段切换 + 输入 */}
          <div className="flex items-center gap-2 px-3 py-3">
            <button className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 tap shrink-0">
              <span>集团名称</span>
              <span className="text-ink-400">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px] text-ink-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2">
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              集团名称
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 第二行：创建人字段 + 输入（无右侧搜索 icon，用占位保持对齐） */}
          <div className="flex items-center gap-2 px-3 pb-3">
            <button className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 tap shrink-0">
              <span>创建人</span>
              <span className="text-ink-400">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px] text-ink-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2">
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              创建人
            </div>
            {/* 占位：保持与第一行搜索框对齐 */}
            <div className="w-9 h-9 shrink-0"/>
          </div>
        </div>
      </div>

      {/* 共 N 条 */}
      <div className="px-3 pt-3 flex items-center justify-end">
        <span className="text-[11px] text-ink-500">共 {total} 条</span>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {data.map((g) => (
          <GroupCard key={g.id} group={g} fields={fields}/>
        ))}
      </div>

      {/* 分页 */}
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">1</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">2</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">3</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">4</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">5</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <span>{PAGE_SIZE}条/页</span>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
        <span className="text-ink-300">|</span>
        <span className="flex items-center gap-1">
          前往
          <input className="w-8 h-6 border border-ink-200 rounded text-center text-[11px]" defaultValue="1"/>
          页
        </span>
      </div>
    </>
  )
}

// ============ 通用卡片式列表（业务主体/项目）============
// ============ 主体列表（钉钉式查询 + 高级筛选 + 新建/导出）============
function SubjectListSection({ node }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const nav = useNavigate()

  // 钉钉式查询状态
  const [fieldKey, setFieldKey] = useState('name')         // 行1字段切换
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false) // 行1字段抽屉
  const [keyword, setKeyword] = useState('')               // 行1输入
  const [industry, setIndustry] = useState('')             // 行2 所属行业
  const [status, setStatus] = useState('')                 // 行2 生效状态
  const [groupName, setGroupName] = useState('')           // 行2 集团名称
  const [filterOpen, setFilterOpen] = useState(false)      // 行2 漏斗 → 高级筛选
  const [advanced, setAdvanced] = useState({
    customerCode: '', bankAccount: '', phone: '', creditCode: '',
    tag: '', accountType: '', sales: '', createdStart: '', createdEnd: '',
  })

  const FIELD_OPTIONS = [
    { key: 'name', label: '客户全称' },
    { key: 'customerCode', label: '客户编号' },
    { key: 'id', label: '主体编号' },
    { key: 'groupName', label: '集团名称' },
    { key: 'creator', label: '创建人' },
    { key: 'sales', label: '销售' },
  ]
  const INDUSTRY_OPTIONS = ['互联网', '电商', '广告', '文化', '医疗', '食品', '美业']
  const STATUS_OPTIONS = ['生效', '失效']
  const GROUP_OPTIONS = Array.from(new Set(data.map(d => d.groupName).filter(Boolean)))

  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const activeFilterCount = Object.values(advanced).filter(v => v && v !== '').length

  // 是否有任意筛选条件（决定底部重置/确认是否显示）
  const hasAnyFilter = Boolean(keyword || industry || status || groupName || activeFilterCount > 0)

  // 重置所有条件
  const handleReset = () => {
    setKeyword(''); setIndustry(''); setStatus(''); setGroupName('')
    setAdvanced({
      customerCode: '', bankAccount: '', phone: '', creditCode: '',
      tag: '', accountType: '', sales: '', createdStart: '', createdEnd: '',
    })
    setFieldKey('name')
  }

  return (
    <>
      {/* 钉钉式查询条件卡（2 行） */}
      <div className="px-3 pt-3 relative">
        <div className="card">
          {/* 第 1 行：字段切换 + 输入 + 🔍 */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 第 2 行：3 chip dropdown + 漏斗 */}
          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <ChipSelect value={industry} onChange={setIndustry} placeholder="所属行业" options={INDUSTRY_OPTIONS}/>
            <ChipSelect value={status} onChange={setStatus} placeholder="生效状态" options={STATUS_OPTIONS}/>
            <ChipSelect value={groupName} onChange={setGroupName} placeholder="集团名称" options={GROUP_OPTIONS}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 共 N 条 + 导出（右侧） */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {total} 条</span>
        <button className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {data.map((item, i) => (
          <SubjectCard key={item.id || i} item={item} fields={fields}/>
        ))}
      </div>

      {/* 底部：重置 + 确认（仅当有任意筛选条件时显示） */}
      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => {}} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}

      {/* FAB：新建客户（与新建集团同样式） */}
      <SubjectFab onClick={() => nav('/subject/create')}/>

      {/* 行1 字段切换抽屉 */}
      {fieldDrawerOpen && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {/* 高级筛选弹窗 */}
      {filterOpen && (
        <SubjectAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          industries={INDUSTRY_OPTIONS}
          statuses={STATUS_OPTIONS}
          groupOptions={GROUP_OPTIONS}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </>
  )
}

// ============ 主体新建 FAB（与集团新建 FAB 同样式）============
function SubjectFab({ onClick }) {
  return (
    <div className="fixed right-4 bottom-20 z-40">
      <button onClick={onClick} className="h-14 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">新建客户</span>
      </button>
    </div>
  )
}

// ============ 项目列表（钉钉式：搜索 + chip 多维 + 更多筛选 + 卡片 + FAB）============
function ProjectListSection({ node }) {
  const data = node.data || []
  const PAGE_SIZE = 5
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const nav = useNavigate()

  // 行 1
  const [fieldKey, setFieldKey] = useState('name')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  // 行 2
  const [groupFilter, setGroupFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  // 高级筛选
  const [advanced, setAdvanced] = useState({
    platform: '', creator: '', industry: '', sales: '', status: '',
  })
  const [page, setPage] = useState(1)

  const FIELD_OPTIONS = [
    { key: 'name', label: '项目名称' },
    { key: 'code', label: '项目编号' },
    { key: 'internalCode', label: '内部自动编码' },
    { key: 'projectId', label: '项目编号(短)' },
  ]
  const GROUP_OPTIONS = Array.from(new Set(data.map(d => d.groupName).filter(Boolean)))
  const CUSTOMER_OPTIONS = Array.from(new Set(data.map(d => d.customerName).filter(Boolean)))
  const PLATFORM_OPTIONS = ['巨量引擎', '磁力金牛', '千川', 'TikToK', '腾讯广告', '聚光']
  const INDUSTRY_OPTIONS = ['互联网', '电商', '广告', '文化', '医疗', '食品', '美业']
  const SALES_OPTIONS = Array.from(new Set(data.map(d => d.salesName).filter(Boolean)))
  const CREATOR_OPTIONS = Array.from(new Set(data.map(d => d.creator).filter(Boolean)))
  const STATUS_OPTIONS = ['审批通过', '审批中', '审批拒绝', '已撤销']
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)

  const activeAdvancedCount = Object.values(advanced).filter(v => v).length

  const filtered = data.filter(p => {
    if (keyword) {
      const v = p[fieldKey]
      if (!v?.includes(keyword)) return false
    }
    if (groupFilter && p.groupName !== groupFilter) return false
    if (customerFilter && p.customerName !== customerFilter) return false
    if (advanced.platform && p.platform !== advanced.platform) return false
    if (advanced.creator && p.creator !== advanced.creator) return false
    if (advanced.industry && p.industry !== advanced.industry) return false
    if (advanced.sales && p.salesName !== advanced.sales) return false
    if (advanced.status && p.status !== advanced.status) return false
    return true
  })
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleResetAdvanced = () => setAdvanced({ platform: '', creator: '', industry: '', sales: '', status: '' })

  return (
    <>
      {/* 钉钉式查询条件卡（2 行） */}
      <div className="px-3 pt-3 relative">
        <div className="card">
          {/* 第 1 行：字段切换 + 输入 + 🔍 */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 第 2 行：2 chip + 更多筛选（漏斗） */}
          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <ChipSelect value={groupFilter} onChange={v => { setGroupFilter(v); setPage(1) }} placeholder="集团名称" options={GROUP_OPTIONS}/>
            <ChipSelect value={customerFilter} onChange={v => { setCustomerFilter(v); setPage(1) }} placeholder="客户主体" options={CUSTOMER_OPTIONS}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center gap-1 tap shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              更多筛选
              {activeAdvancedCount > 0 && (
                <span className="ml-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeAdvancedCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 共 N 条 */}
      <div className="px-3 pt-3 flex items-center justify-end">
        <span className="text-[11px] text-ink-500">共 {filtered.length} 条</span>
      </div>

      {/* 项目卡片列表 */}
      {paged.length === 0 ? (
        <EmptyProjectCard/>
      ) : (
        <div className="px-3 pt-2 space-y-2">
          {paged.map((p, i) => (
            <ProjectCard key={p.code || i} item={p}/>
          ))}
        </div>
      )}

      {/* 分页 */}
      {filtered.length > 0 && (
        <ProjectPagination total={filtered.length} page={page} pageSize={PAGE_SIZE} totalPages={totalPages} onChange={setPage}/>
      )}

      {/* 行1 字段切换抽屉 */}
      {fieldDrawerOpen && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {/* 更多筛选弹窗 */}
      {filterOpen && (
        <ProjectAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          platforms={PLATFORM_OPTIONS}
          creators={CREATOR_OPTIONS}
          industries={INDUSTRY_OPTIONS}
          sales={SALES_OPTIONS}
          statuses={STATUS_OPTIONS}
          onReset={handleResetAdvanced}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </>
  )
}

// ============ 项目卡片 ============
function ProjectCard({ item }) {
  const nav = useNavigate()
  const [toast, setToast] = useState(null)
  const [revokeOpen, setRevokeOpen] = useState(false)
  // 审批状态颜色映射
  const statusColor = {
    '审批通过': 'bg-success/10 text-success',
    '审批中': 'bg-warning/10 text-warning',
    '审批拒绝': 'bg-danger/10 text-danger',
    '已撤销': 'bg-ink-100 text-ink-500',
  }
  const sClass = statusColor[item.status] || 'bg-ink-100 text-ink-700'

  const handleUrge = () => {
    setToast({ type: 'success', message: '催办成功' })
    setTimeout(() => setToast(null), 1800)
  }
  const handleRevokeConfirm = () => {
    setRevokeOpen(false)
    setToast({ type: 'success', message: '撤销成功' })
    setTimeout(() => setToast(null), 1800)
  }

  return (
    <div className="card overflow-hidden">
      {/* 标题：项目名称 + 项目编号 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.name || '--'}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">项目编号: {item.code || '--'}</div>
      </div>

      {/* 中部字段：2 列网格 */}
      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <ProjectField label="创建时间" value={item.created}/>
        <ProjectField label="更新时间" value={item.updated}/>
        <ProjectField label="客户集团名称" value={item.groupName}/>
        <ProjectField label="销售类型" value={item.salesType}/>
        <ProjectField label="销售人姓名" value={item.salesName}/>
        <ProjectField label="创建人" value={item.creator}/>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-ink-500 shrink-0">审批状态</span>
          {item.status ? (
            <span className={`inline-block px-1.5 h-[18px] leading-[18px] text-[11px] rounded ${sClass}`}>{item.status}</span>
          ) : <span className="text-ink-300">--</span>}
        </div>
      </div>

      {/* 底部：操作（详情 / 重新发起 / 催办 / 撤销） */}
      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-4 text-[12px]">
        <button onClick={() => nav(`/project/detail/${item.code || item.internalCode || item.id}`)} className="text-brand tap">详情</button>
        <button onClick={() => nav(`/project/restart/${item.code || item.internalCode || item.id}`)} className="text-brand tap">重新发起</button>
        <button onClick={handleUrge} className="text-ink-500 tap">催办</button>
        <button onClick={() => setRevokeOpen(true)} className="text-danger tap">撤销</button>
      </div>

      {/* 钉钉式 toast：催办/撤销成功提示 */}
      {toast && <Toast type={toast.type} message={toast.message}/>}

      {/* 钉钉式 撤销确认弹窗 */}
      {revokeOpen && (
        <RevokeDialog
          onCancel={() => setRevokeOpen(false)}
          onConfirm={handleRevokeConfirm}
        />
      )}
    </div>
  )
}

// ============ 钉钉式 撤销确认弹窗（居中 modal + 备注输入）============
function RevokeDialog({ onCancel, onConfirm }) {
  const [remark, setRemark] = useState('')
  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-6" onClick={onCancel}>
      <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-[16px] font-medium text-ink-900">提示</h3>
          <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="px-5 pt-1 pb-4">
          <div className="flex items-start gap-2.5">
            {/* 警告 icon（橙色） */}
            <div className="shrink-0 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FF9A3C"/>
                <rect x="11" y="6" width="2" height="9" rx="1" fill="white"/>
                <rect x="11" y="16" width="2" height="2" rx="1" fill="white"/>
              </svg>
            </div>
            {/* 文本 + 输入区 */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink-900 leading-relaxed mb-2">填写撤销备注（可为空）：</div>
              <textarea
                value={remark}
                onChange={e => setRemark(e.target.value)}
                placeholder="请输入备注（可留空）"
                rows={3}
                className="w-full px-3 py-2 border border-ink-200 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand resize-none"
              />
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3">
          <button onClick={onCancel} className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={onConfirm} className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确认提交</button>
        </div>
      </div>
    </div>
  )
}

// ============ 钉钉式 Toast（黑色背景 + 居中 + ✓ icon）============
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

// ============ 项目字段 ============
function ProjectField({ label, value }) {
  const v = value == null || value === '' || value === '--' ? '--' : value
  const muted = v === '--'
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className={`flex-1 truncate ${muted ? 'text-ink-300' : 'text-ink-900'}`}>{v}</span>
    </div>
  )
}

// ============ 项目空状态卡片 ============
function EmptyProjectCard() {
  return (
    <div className="mx-3 card py-16 text-center">
      <div className="text-[40px] mb-2 opacity-30">📋</div>
      <div className="text-[13px] text-ink-400">暂无数据</div>
    </div>
  )
}

// ============ 项目分页 ============
function ProjectPagination({ total, page, pageSize, totalPages, onChange }) {
  if (total === 0) return null
  return (
    <div className="flex items-center justify-between px-3 py-4">
      <span className="text-[11px] text-ink-500">共 {total} 条</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}
          className="h-7 w-7 bg-white border border-ink-200 rounded text-ink-700 flex items-center justify-center disabled:opacity-40 tap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="min-w-[28px] h-7 px-2 bg-brand text-white rounded text-[12px] font-medium flex items-center justify-center">{page}</span>
        <span className="text-[11px] text-ink-500">/ {totalPages}</span>
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
          className="h-7 w-7 bg-white border border-ink-200 rounded text-ink-700 flex items-center justify-center disabled:opacity-40 tap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

// ============ 项目高级筛选弹窗 ============
function ProjectAdvancedFilter({ values, setValues, platforms, creators, industries, sales, statuses, onReset, onClose }) {
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <FilterField label="媒体平台">
            <ChipRow options={platforms} value={values.platform} onChange={v => set('platform', v)}/>
          </FilterField>
          <FilterField label="创建人">
            <ChipRow options={creators} value={values.creator} onChange={v => set('creator', v)}/>
          </FilterField>
          <FilterField label="客户所属行业">
            <ChipRow options={industries} value={values.industry} onChange={v => set('industry', v)}/>
          </FilterField>
          <FilterField label="销售人员">
            <ChipRow options={sales} value={values.sales} onChange={v => set('sales', v)}/>
          </FilterField>
          <FilterField label="审批状态">
            <ChipRow options={statuses} value={values.status} onChange={v => set('status', v)}/>
          </FilterField>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={onReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// ============ 筛选字段块 ============
function FilterField({ label, children }) {
  return (
    <div>
      <div className="text-[12px] text-ink-500 mb-2">{label}</div>
      {children}
    </div>
  )
}

// ============ Chip 行（高级筛选内单选 chips）============
function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} onClick={() => onChange(value === o ? '' : o)}
          className={`h-7 px-3 rounded-full text-[12px] tap ${value === o ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'}`}>{o}</button>
      ))}
    </div>
  )
}

// ============ 钉钉式 Chip 下拉（带 ▾）============
function ChipSelect({ value, onChange, placeholder, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative shrink-0">
      <button onClick={() => setOpen(o => !o)}
        className={`h-9 px-3 rounded-full text-[12px] flex items-center gap-1 tap min-w-[80px] ${
          value ? 'bg-brand/10 text-brand border border-brand/30' : 'bg-ink-50 text-ink-500 border border-transparent'
        }`}>
        <span className="truncate max-w-[80px]">{value || placeholder}</span>
        <span className="text-[10px] shrink-0">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute top-full left-0 mt-1 bg-white border border-ink-100 rounded-lg shadow-lg z-50 min-w-[120px] max-h-[200px] overflow-y-auto py-1">
            <button onClick={() => { onChange(''); setOpen(false) }}
              className={`w-full px-3 py-2 text-left text-[12px] tap ${!value ? 'text-brand bg-brand/5' : 'text-ink-700'}`}>
              全部
            </button>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[12px] tap ${value === o ? 'text-brand bg-brand/5' : 'text-ink-700'}`}>
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============ 钉钉式行1字段抽屉（左侧栏 + 右侧栏）============
function FieldDrawer({ fields, currentKey, onSelect, onClose }) {
  const [active, setActive] = useState(currentKey)
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[60vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">选择字段</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-2">
            {fields.map(f => (
              <button key={f.key} onClick={() => onSelect(f.key)}
                className={`w-full px-3 py-2.5 text-left text-[13px] tap rounded ${
                  active === f.key ? 'bg-brand/10 text-brand font-medium' : 'text-ink-700'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 主体管理高级筛选弹窗（钉钉式左侧字段 + 右侧条件）============
function SubjectAdvancedFilter({ values, setValues, industries, statuses, groupOptions, onClose }) {
  const fields = [
    { key: 'customerCode', label: '客户编号', kind: 'input' },
    { key: 'bankAccount', label: '银行账号', kind: 'input' },
    { key: 'phone', label: '注册电话', kind: 'input' },
    { key: 'creditCode', label: '统一社会信用代码', kind: 'input' },
    { key: 'tag', label: '标签', kind: 'input' },
    { key: 'accountType', label: '账户类型', kind: 'input' },
    { key: 'industry', label: '所属行业', kind: 'select', options: industries },
    { key: 'status', label: '生效状态', kind: 'select', options: statuses },
    { key: 'groupName', label: '集团名称', kind: 'select', options: groupOptions },
    { key: 'sales', label: '销售', kind: 'input' },
    { key: 'createdRange', label: '创建日期', kind: 'daterange' },
  ]
  const [active, setActive] = useState('industry')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setValues({
      customerCode: '', bankAccount: '', phone: '', creditCode: '',
      tag: '', accountType: '', industry: '', status: '', groupName: '', sales: '',
      createdStart: '', createdEnd: '',
    })
  }

  const activeField = fields.find(f => f.key === active)

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        {/* 顶部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 主体 */}
        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.createdStart || ''} onChange={e => set('createdStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.createdEnd || ''} onChange={e => set('createdEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        {/* 底部：重置 + 确认 */}
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

// ============ 账户列表 - 高级筛选弹窗（含广告主ID 单/批量切换）============
function AccountAdvancedFilter({ values, setValues, data, onClose, onReset }) {
  // 从数据聚合下拉选项
  const groupOpts = Array.from(new Set(data.map(d => d.groupName).filter(Boolean)))
  const policyOpts = Array.from(new Set(data.map(d => d.policyName).filter(Boolean)))
  const platformOpts = Array.from(new Set(data.map(d => d.platform).filter(Boolean)))
  // 来源为枚举，不从数据派生
  const sourceOpts = ['开户录入', '原OA系统同步', '充值录入', '媒体同步']

  const fields = [
    { key: 'advId', label: '广告主ID', kind: 'advId' },                  // 特殊：单/批量切换
    { key: 'groupName', label: '集团名称', kind: 'input' },
    { key: 'policyName', label: '政策名称', kind: 'input' },
    { key: 'customerName', label: '主体名称', kind: 'input' },
    { key: 'platform', label: '媒体平台', kind: 'select', options: platformOpts },
    { key: 'operator', label: '媒介开户人', kind: 'input' },
    { key: 'sales', label: '销售人', kind: 'input' },
    { key: 'createdRange', label: '下户时间', kind: 'daterange' },
    { key: 'creator', label: '下户申请人', kind: 'input' },
    { key: 'taskId', label: '任务记录ID', kind: 'input' },
    { key: 'source', label: '来源', kind: 'select', options: sourceOpts },
  ]

  const [active, setActive] = useState('advId')
  const activeField = fields.find(f => f.key === active)
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setValues({
      advIdMode: 'single', advId: '', advIdBatch: '',
      groupName: '', policyName: '', customerName: '', platform: '',
      operator: '', sales: '', creator: '', taskId: '', source: '',
      createdStart: '', createdEnd: '',
    })
    onReset && onReset()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* 特殊：广告主ID 单/批量 */}
            {activeField?.kind === 'advId' && (
              <AdvIdInput values={values} set={set}/>
            )}
            {/* 普通 input */}
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {/* select */}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">请选择</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {/* 日期范围 */}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.createdStart || ''} onChange={e => set('createdStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.createdEnd || ''} onChange={e => set('createdEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// 广告主ID 单/批量输入
function AdvIdInput({ values, set }) {
  const mode = values.advIdMode || 'single'
  const batchText = values.advIdBatch || ''
  // 批量行数（去空行）
  const ids = batchText.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  const count = ids.length
  const overLimit = count > 200

  return (
    <div className="space-y-3">
      {/* 单个 / 批量 切换 */}
      <div className="flex items-center gap-2">
        <button onClick={() => set('advIdMode', 'single')}
          className={`h-8 px-4 rounded-full text-[12px] tap border ${
            mode === 'single'
              ? 'bg-white border-brand text-brand font-medium'
              : 'bg-ink-50 border-transparent text-ink-700'
          }`}>单个</button>
        <button onClick={() => set('advIdMode', 'batch')}
          className={`h-8 px-4 rounded-full text-[12px] tap border ${
            mode === 'batch'
              ? 'bg-white border-brand text-brand font-medium'
              : 'bg-ink-50 border-transparent text-ink-700'
          }`}>批量</button>
      </div>

      {mode === 'single' ? (
        <input value={values.advId || ''} onChange={e => set('advId', e.target.value)}
          placeholder="请输入广告主ID"
          className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
      ) : (
        <>
          {/* 提示 */}
          <div className="flex items-center gap-1.5 text-[12px] text-ink-500">
            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px]">批量</span>
            多个 ID 用
            <span className="text-emerald-600 font-medium">换行</span>
            分隔 · 单次最多 200 个
          </div>
          {/* textarea（最多展示 6 行高度） */}
          <textarea
            value={batchText}
            onChange={e => set('advIdBatch', e.target.value)}
            placeholder="例如1869039794517002"
            rows={6}
            className="w-full px-3 py-2 bg-ink-50 rounded text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand resize-none font-mono leading-6"
          />
          {/* 底部：已识别 X / 上限 200 | 清空 */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              overLimit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${overLimit ? 'bg-rose-500' : 'bg-emerald-500'}`}/>
              {overLimit ? '超出限制' : '已识别'} {count} 个 ID
            </span>
            <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-700">上限 200</span>
            <button onClick={() => set('advIdBatch', '')}
              className="ml-auto text-ink-400 tap active:text-ink-700">清空</button>
          </div>
        </>
      )}
    </div>
  )
}

// ============ 主体卡片（按 PC 截图字段顺序）============
function SubjectCard({ item, fields }) {
  const nav = useNavigate()
  // 标题 = 客户全称，副标题 = 主体编号 + 客户编号
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.name || '--'}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">主体编号: {item.id} · 客户编号: {item.customerCode || '--'}</div>
      </div>

      {/* 中部：字段网格（2 列） */}
      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '客户全称' }} value={item.name}/>
        <GroupField field={{ label: '客户备注' }} value={item.remark}/>
        <GroupField field={{ label: '银行账号' }} value={item.bankAccount}/>
        <GroupField field={{ label: '注册电话' }} value={item.phone}/>
        <GroupField field={{ label: '统一社会信用代码' }} value={item.creditCode}/>
        <GroupField field={{ label: '生效状态', type: 'tag' }} value={item.status}/>
        <GroupField field={{ label: '所属行业' }} value={item.industry}/>
        <GroupField field={{ label: '标签', type: 'tag' }} value={item.tag}/>
        <GroupField field={{ label: '账户类型', type: 'tag' }} value={item.accountType}/>
        <GroupField field={{ label: '集团名称' }} value={item.groupName}/>
        <GroupField field={{ label: '销售' }} value={item.sales}/>
        <GroupField field={{ label: '创建人' }} value={item.creator}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
      </div>

      {/* 底部：操作按钮（PC 截图：详情 / 编辑） */}
      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => nav(`/subject/detail/${item.id}`)} className="text-brand tap">详情</button>
        <button onClick={() => nav(`/subject/edit/${item.id}`)} className="text-brand tap">编辑</button>
      </div>
    </div>
  )
}

function CardListSection({ node, queryLabel, queryPlaceholder }) {
  const data = node.data || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const fields = node.fields || []

  return (
    <>
      {/* 钉钉式查询条件条：字段+输入 */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-3">
            <button className="h-9 w-[88px] px-3 bg-ink-50 rounded-full text-[12px] text-ink-700 flex items-center justify-between gap-1 tap shrink-0">
              <span>{queryLabel}</span>
              <span className="text-ink-400">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px] text-ink-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-2">
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {queryPlaceholder}
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

      {/* 共 N 条 */}
      <div className="px-3 pt-3 flex items-center justify-end">
        <span className="text-[11px] text-ink-500">共 {total} 条</span>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {data.map((item, i) => (
          <GenericCard key={item.id || item.code || i} item={item} fields={fields}/>
        ))}
      </div>

      {/* 分页 */}
      <Pagination total={total} totalPages={totalPages} pageSize={PAGE_SIZE}/>
    </>
  )
}

// ============ 通用卡片 ============
function GenericCard({ item, fields }) {
  // 智能识别：标题字段优先选 key='name'，副标题选 key='id' 或 key='code'
  const nameField = fields.find(f => f.key === 'name') || fields[1] || fields[0]
  const idField = fields.find(f => f.key === 'id' || f.key === 'code') || fields[0]
  // 中部字段：除标题和副标题外的所有字段
  const middleFields = fields.filter(f => f !== nameField && f !== idField)

  const titleValue = nameField ? item[nameField.key] : ''
  const subtitleValue = idField ? item[idField.key] : ''

  return (
    <div className="card overflow-hidden">
      {/* 顶部：名称 + 编号 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{titleValue || '--'}</div>
        {idField && idField !== nameField && subtitleValue && (
          <div className="text-[11px] text-ink-400 mt-0.5">{idField.label}: {subtitleValue}</div>
        )}
      </div>

      {/* 中部：字段网格（2 列） */}
      {middleFields.length > 0 && (
        <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
          {middleFields.map(f => (
            <GroupField key={f.key} field={f} value={item[f.key]}/>
          ))}
        </div>
      )}

      {/* 底部：操作按钮 */}
      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button className="text-brand tap">详情</button>
        <button className="text-brand tap">编辑</button>
      </div>
    </div>
  )
}

// ============ 分页 ============
function Pagination({ total, totalPages, pageSize = 15 }) {
  return (
    <>
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">1</button>
        {totalPages > 1 && Array.from({length: Math.min(totalPages - 1, 4)}, (_, i) => i + 2).map(p => (
          <button key={p} className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{p}</button>
        ))}
        {totalPages > 6 && <span className="text-ink-400 px-1">...</span>}
        {totalPages > 5 && <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>}
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
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
          <input className="w-8 h-6 border border-ink-200 rounded text-center text-[11px]" defaultValue="1"/>
          页
        </span>
      </div>
    </>
  )
}

// 集团卡片
function GroupCard({ group, fields }) {
  const nav = useNavigate()
  return (
    <div className="card overflow-hidden">
      {/* 顶部：名称 + 集团ID */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight">{group.name}</div>
        <div className="text-[11px] text-ink-400 mt-0.5">集团ID: {group.id}</div>
      </div>

      {/* 中部：字段网格（2 列） */}
      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        {fields.filter(f => !['id','name'].includes(f.key)).map(f => (
          <GroupField key={f.key} field={f} value={group[f.key]}/>
        ))}
      </div>

      {/* 底部：操作按钮 */}
      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => nav(`/group/detail/${group.id}`)} className="text-brand tap">详情</button>
        <button onClick={() => nav(`/group/edit/${group.id}`)} className="text-brand tap">编辑</button>
        <button onClick={() => nav(`/group/handover/${group.id}`)} className="text-brand tap">交接</button>
        <button onClick={() => nav(`/group/balance/${group.id}`)} className="text-brand tap">期初余额</button>
      </div>
    </div>
  )
}

// 集团字段
function GroupField({ field, value }) {
  if (value == null || value === '' || value === '--') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{field.label}</span>
        <span className="text-ink-300">--</span>
      </div>
    )
  }

  // tag 类型（属性/类型/标签）
  if (field.type === 'tag') {
    const c = (field.colorMap && field.colorMap[value]) || colorMap[value] || 'gray'
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{field.label}</span>
        <Tag text={value} type={c}/>
      </div>
    )
  }

  // 金额
  if (field.type === 'money') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{field.label}</span>
        <span className="text-ink-900 truncate">¥ {Number(value).toLocaleString()}</span>
      </div>
    )
  }

  // 综合评分用进度
  if (field.key === 'score' && typeof value === 'number') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-400 shrink-0">{field.label}</span>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden w-12">
            <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(value * 20, 100)}%` }}/>
          </div>
          <span className="text-[11px] text-ink-900">{value}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-ink-400 shrink-0">{field.label}</span>
      <span className="text-ink-900 truncate">{value}</span>
    </div>
  )
}

function FieldCell({ field, value }) {
  if (value == null || value === '') return <span className="text-ink-300">--</span>

  if (field.type === 'money') {
    return <span className="font-medium text-ink-900">¥ {Number(value).toLocaleString()}</span>
  }
  if (field.type === 'tag') {
    const c = (field.colorMap && field.colorMap[value]) || colorMap[value] || 'gray'
    return <Tag text={value} type={c}/>
  }
  if (field.type === 'percent') {
    const v = Number(value)
    return (
      <div className="flex items-center gap-2 min-w-[60px]">
        <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden w-12">
          <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(v, 100)}%` }}/>
        </div>
        <span className="text-[11px] text-ink-700 w-8">{v}%</span>
      </div>
    )
  }
  if (field.type === 'num') {
    return <span className="text-ink-900">{value}</span>
  }
  // text 默认
  if (typeof value === 'string' && value.length > 12) {
    return <span className="text-ink-900">{value.slice(0, 12)}...</span>
  }
  return <span className="text-ink-900">{value}</span>
}

function Tag({ text, type = 'gray' }) {
  const map = {
    green: 'bg-success/10 text-success',
    orange: 'bg-warning/10 text-warning',
    red: 'bg-danger/10 text-danger',
    blue: 'bg-brand/10 text-brand',
    gray: 'bg-ink-100 text-ink-500',
    purple: 'bg-purple/10 text-purple',
  }
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${map[type]}`}>{text}</span>
}

// ============ 审批中心（PC 端"审批列表"重设计）============
// 信息架构（PC 11 列横表 → App 卡片）：
//   - 顶部 sticky 筛选条：审批状态 + 审批类型 + 业务名称(输入) + 申请人
//   - 每张卡：节点ID + 审批层级 + 审批状态 chip | 业务名称 | 类型/申请人 | 实际审批人/审批意见 | 时间 + 操作
//   - 分页 15 条/页
// 设计原则：
//   - 钉钉式筛选条（行 1 chip + 行 2 输入），与变更记录保持一致
//   - 卡片头不随筛选条件变化（"节点ID + 层级 + 状态"是 PC 列固定列）
//   - 操作按钮组（详情/通过/驳回）固定卡片底部，与 PC 操作列对应
function ApprovalCenterSection({ node }) {
  const nav = useNavigate()
  const ALL_DATA = approvalsData
  const STATUS_OPTS = ['全部', '审批中', '通过', '拒绝', '撤销', '驳回', '无需处理']
  const TYPE_OPTS = ['直播政策', '项目', '合同审批', '回款审批', '退款审批', '开户申请', '媒体备款']
  const APPLICANT_OPTS = Array.from(new Set(ALL_DATA.map(d => d.applicant)))

  const [status, setStatus] = useState('审批中')
  const [type, setType] = useState('')
  const [bizName, setBizName] = useState('')
  const [applicant, setApplicant] = useState('')
  const [createStart, setCreateStart] = useState('')
  const [createEnd, setCreateEnd] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(null)
  const PAGE_SIZE = 15

  // 筛选
  const filtered = ALL_DATA.filter(r => {
    if (status && status !== '全部' && r.status !== status) return false
    if (type && r.type !== type) return false
    if (bizName && !r.bizName.includes(bizName)) return false
    if (applicant && r.applicant !== applicant) return false
    if (createStart && r.createTime < createStart) return false
    if (createEnd && r.createTime > createEnd + ' 23:59:59') return false
    return true
  })
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const showToast = (msg) => {
    setToast({ msg })
    setTimeout(() => setToast(null), 1500)
  }

  // 状态 chip 颜色
  const statusColor = (s) => {
    if (s === '审批中') return 'bg-blue-50 text-brand border-blue-100'
    if (s === '通过') return 'bg-green-50 text-success border-green-100'
    if (s === '拒绝' || s === '驳回') return 'bg-red-50 text-danger border-red-100'
    if (s === '撤销') return 'bg-ink-100 text-ink-500 border-ink-200'
    if (s === '无需处理') return 'bg-ink-100 text-ink-400 border-ink-200'
    return 'bg-ink-100 text-ink-500 border-ink-200'
  }

  // 已选筛选条件 chip 列表（status 是外露默认条件，bizName 是外露输入框，都不进 chips；chips 只显示高级筛选产生且非默认的条件）
  const activeFilters = [
    type && { key: 'type', label: `类型：${type}`, clear: () => setType('') },
    applicant && { key: 'applicant', label: `申请人：${applicant}`, clear: () => setApplicant('') },
    (createStart || createEnd) && { key: 'createRange', label: `创建：${createStart || '不限'} ~ ${createEnd || '不限'}`, clear: () => { setCreateStart(''); setCreateEnd('') } },
  ].filter(Boolean)
  const hasFilter = activeFilters.length > 0

  const handleReset = () => {
    setStatus('审批中'); setType(''); setBizName(''); setApplicant(''); setCreateStart(''); setCreateEnd('')
  }

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* ============ 顶部 Sticky 筛选条（左侧：审批状态 + 业务名称；右侧：高级筛选 + chips）============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        <div className="px-3 py-2 flex items-center gap-2">
          {/* ===== 左侧：审批状态 picker ===== */}
          <div className="shrink-0 flex items-center gap-1">
            <span className="text-[12px] text-ink-500">状态</span>
            <DeptKpiSettingPicker value={status} onChange={(v) => { setStatus(v); setPage(1) }} options={STATUS_OPTS}/>
          </div>
          {/* ===== 中间：业务名称搜索 ===== */}
          <div className="flex-1 min-w-0 relative">
            <input
              type="text"
              value={bizName}
              onChange={e => { setBizName(e.target.value); setPage(1) }}
              placeholder="业务名称"
              className="form-input h-7 pl-7 pr-2 text-[12px] w-full"
            />
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
              <path d="M21 21l-4.3-4.3" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {/* ===== 右侧：高级筛选（钉钉式圆形漏斗 icon，与其他页面一致）===== */}
          <button
            onClick={() => setShowFilter(true)}
            className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            {hasFilter && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilters.length}</span>
            )}
          </button>
        </div>
        {/* 已选条件 chips（高级筛选产生的） */}
        {hasFilter && (
          <div className="px-3 pb-2 -mt-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={f.clear}
                className="shrink-0 h-6 px-2 rounded-full bg-brand/10 text-brand text-[10px] flex items-center gap-1 tap"
              >
                <span className="truncate max-w-[160px]">{f.label}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            ))}
            <button
              onClick={() => { handleReset(); setPage(1) }}
              className="shrink-0 text-[10px] text-ink-400 underline tap"
            >清空</button>
          </div>
        )}
      </div>

      {/* ============ 高级筛选 Sheet ============ */}
      {showFilter && (
        <ApprovalAdvancedFilter
          values={{ status, type, bizName, applicant }}
          setValues={(updater) => {
            const next = typeof updater === 'function' ? updater({ status, type, bizName, applicant }) : updater
            setStatus(next.status || '审批中')
            setType(next.type || '')
            setBizName(next.bizName || '')
            setApplicant(next.applicant || '')
            setPage(1)
          }}
          statusOpts={STATUS_OPTS}
          typeOpts={TYPE_OPTS}
          onClose={() => setShowFilter(false)}
          onReset={() => {
            setStatus('审批中'); setType(''); setBizName(''); setApplicant(''); setPage(1)
          }}
        />
      )}

      {/* ============ 卡片列表 ============ */}
      <div className="px-3 py-3 space-y-2">
        {paged.length === 0 && (
          <div className="text-center text-ink-400 text-[13px] py-8 card">无匹配记录</div>
        )}
        {paged.map(r => (
          <div key={r.nodeId} className="card overflow-hidden">
            {/* 头部：节点ID + 层级 + 状态 chip */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-3.5 bg-brand rounded-sm shrink-0"/>
                <span className="text-[11px] text-ink-500 tabular-nums shrink-0">节点ID #{r.nodeId}</span>
                <span className="text-[11px] text-ink-400 shrink-0">第 {r.level} 级</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${statusColor(r.status)}`}>{r.status}</span>
            </div>

            {/* 主体：业务名称 + 类型 + 申请人 */}
            <div className="px-4 py-3">
              <div className="text-[13px] text-ink-900 font-medium leading-snug">{r.bizName}</div>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap text-[11px]">
                <span className="text-ink-500">类型</span>
                <span className="text-brand bg-brand/10 px-1.5 py-0.5 rounded">{r.type}</span>
                <span className="text-ink-300">|</span>
                <span className="text-ink-500">申请人</span>
                <span className="text-ink-700">{r.applicant}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-ink-400 shrink-0">实际审批人</span>
                  <span className="text-ink-700 truncate">{r.actualApprover}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-ink-400 shrink-0">审批意见</span>
                  <span className="text-ink-700 truncate">{r.opinion}</span>
                </div>
              </div>
            </div>

            {/* 底部：时间 + 操作 */}
            <div className="px-4 py-2 border-t border-ink-100 flex items-center justify-between bg-ink-50/30">
              <div className="text-[10px] text-ink-400 flex items-center gap-2 min-w-0">
                <span className="shrink-0">创建 {r.createTime.slice(5)}</span>
                <span className="text-ink-300 shrink-0">·</span>
                <span className="shrink-0">更新 {r.updateTime.slice(5, 16)}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => nav(`/approval/detail/${r.nodeId}`)}
                  className="h-7 px-3 text-[11px] text-white bg-brand rounded tap active:opacity-90 active:scale-95 transition-transform"
                >详情</button>
                {r.status === '审批中' && (
                  <>
                    <button
                      onClick={() => showToast(`已通过 ${r.bizName}`)}
                      className="h-7 px-3 text-[11px] text-white bg-brand rounded tap active:opacity-90 active:scale-95 transition-transform"
                    >通过</button>
                    <button
                      onClick={() => setRejectTarget(r)}
                      className="h-7 px-3 text-[11px] text-white bg-danger rounded tap active:opacity-90 active:scale-95 transition-transform"
                    >驳回</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ 分页器 ============ */}
      {total > 0 && (
        <div className="mx-3 mt-3 flex items-center justify-between text-[12px] text-ink-600">
          <div className="flex items-center gap-1">
            <span className="text-ink-500">共</span>
            <span className="font-medium text-ink-900">{total}</span>
            <span className="text-ink-500">条</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, safePage - 2)
              const p = start + i
              if (p > totalPages) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 min-w-7 px-2 rounded text-[12px] tap ${p === safePage ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <DeptKpiSettingToast type="success" message={toast.msg}/>}

      {/* 驳回备注弹窗 */}
      {rejectTarget && (
        <RejectDialog
          target={rejectTarget}
          onCancel={() => setRejectTarget(null)}
          onConfirm={(remark) => {
            setRejectTarget(null)
            showToast(remark ? `已驳回：${remark.slice(0, 12)}${remark.length > 12 ? '...' : ''}` : `已驳回 ${rejectTarget.bizName}`)
          }}
        />
      )}
    </div>
  )
}

// ============ 审批驳回备注弹窗（截图示例：橙色警告 + 备注输入）============
function RejectDialog({ target, onCancel, onConfirm }) {
  const [remark, setRemark] = useState('')
  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-8" onClick={onCancel}>
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-warning/15 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01M10.3 3.86l-7.82 13.5A2 2 0 004.26 20h15.48a2 2 0 001.78-2.64L13.7 3.86a2 2 0 00-3.4 0z" stroke="#FF9A3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-[15px] font-medium text-ink-900">填写驳回备注（可为空）：</h3>
          </div>
          {/* 备注输入 */}
          <div className="mt-3 ml-9">
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="请输入备注（可留空）"
              rows={4}
              className="w-full px-3 py-2 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand resize-none"
            />
          </div>
        </div>
        {/* 按钮组 */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-9 px-5 bg-white border border-ink-200 rounded text-[13px] text-ink-700 tap active:bg-ink-50"
          >取消</button>
          <button
            onClick={() => onConfirm(remark)}
            className="h-9 px-5 bg-brand text-white rounded text-[13px] tap active:opacity-90"
          >确认提交</button>
        </div>
      </div>
    </div>
  )
}

// ============ 审批中心 - 高级筛选 Sheet（钉钉式左侧字段 + 右侧条件）============
function ApprovalAdvancedFilter({ values, setValues, statusOpts, typeOpts, onClose, onReset }) {
  // 字段顺序按 PC 截图：审批状态 / 审批类型 / 业务名称 / 申请人
  // 申请人改为搜索框（input），方便查找任意姓名
  const fields = [
    { key: 'status', label: '审批状态', kind: 'select', options: statusOpts },
    { key: 'type', label: '审批类型', kind: 'select', options: typeOpts },
    { key: 'bizName', label: '业务名称', kind: 'input' },
    { key: 'applicant', label: '申请人', kind: 'input' },
  ]
  const [active, setActive] = useState('status')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        {/* 顶部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 主体：左侧字段 + 右侧条件 */}
        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.createStart || ''} onChange={e => set('createStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.createEnd || ''} onChange={e => set('createEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        {/* 底部：重置 + 确认 */}
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

function KpiBlock({ value, label, color }) {
  const colors = { red: '#FF5A5A', orange: '#FF9A3C', green: '#34A853', blue: '#2D7FF9', purple: '#9B7FF5' }
  return (
    <div className="card p-3 text-center">
      <div className="text-[20px] font-bold leading-tight" style={{ color: colors[color] }}>{value}</div>
      <div className="text-[10px] text-ink-500 mt-0.5">{label}</div>
    </div>
  )
}

// ============ 仪表盘（系统首页）============
function DashboardSection() {
  return (
    <div className="pt-3">
      {/* KPI 4 个 */}
      <div className="px-3 grid grid-cols-2 gap-2">
        <DashKpi value="¥ 128,450" label="今日消耗" trend="+12.5%" up/>
        <DashKpi value="¥ 2,580,000" label="本月回款" trend="+8.3%" up/>
        <DashKpi value="48" label="活跃客户" trend="+5" up/>
        <DashKpi value="3.85" label="平均 ROI" trend="-0.2" up={false}/>
      </div>

      {/* 趋势图 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title justify-between">
          <span>近 7 日销售业绩</span>
          <span className="text-[11px] text-ink-400 ml-auto">万元</span>
        </div>
        <div className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={[
              { d:'08-18', v:85 }, { d:'08-19', v:92 }, { d:'08-20', v:78 },
              { d:'08-21', v:105 }, { d:'08-22', v:118 }, { d:'08-23', v:96 }, { d:'08-24', v:128 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: '#999' }}/>
              <YAxis tick={{ fontSize: 10, fill: '#999' }} width={28}/>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}/>
              <Line type="monotone" dataKey="v" stroke="#2D7FF9" strokeWidth={2} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 媒体渠道占比 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">媒体渠道消耗占比</div>
        <div className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[
                { name:'巨量引擎', value:38 }, { name:'千川', value:28 },
                { name:'磁力金牛', value:18 }, { name:'腾讯广告', value:10 }, { name:'其他', value:6 }
              ]} dataKey="value" innerRadius={36} outerRadius={60} paddingAngle={2}>
                {['#2D7FF9','#FF9A3C','#5BC85B','#9B7FF5','#BFBFBF'].map((c,i) => <PieCell key={i} fill={c}/>)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function DashKpi({ value, label, trend, up }) {
  return (
    <div className="card p-3">
      <div className="text-[18px] font-bold text-ink-900 leading-tight">{value}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-ink-500">{label}</span>
        <span className={`text-[10px] ${up ? 'text-success' : 'text-danger'}`}>{trend}</span>
      </div>
    </div>
  )
}

// ============ 广告主 ID 管理 - 通用列表 Section ============
// 共用：钉钉式查询条件 + 高级搜索 sheet + 卡片网格 + FAB
// 通过 Config 区分 4 个子板块（开户申请/开户明细/账户列表/任务列表）
function AdvertiserListSection({ node, config }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const nav = useNavigate()

  const [fieldKey, setFieldKey] = useState(config.defaultFieldKey)
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [chip1, setChip1] = useState('')            // 行2 chip 1
  const [chip2, setChip2] = useState('')            // 行2 chip 2
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState(config.advancedInit)

  const FIELD_OPTIONS = config.fieldOptions
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey) || FIELD_OPTIONS[0]
  const chipOptions1 = config.chipOptions1(data)
  const chipOptions2 = config.chipOptions2(data)
  const activeFilterCount = Object.entries(advanced).filter(([k, v]) => {
    if (k === 'createdStart' || k === 'createdEnd') return Boolean(v)
    return Boolean(v && v !== '')
  }).length

  const hasAnyFilter = Boolean(keyword || chip1 || chip2 || activeFilterCount > 0)

  const handleReset = () => {
    setKeyword(''); setChip1(''); setChip2('')
    setAdvanced(config.advancedInit)
    setFieldKey(config.defaultFieldKey)
  }

  // 按 chip / keyword 过滤后的数据（基础过滤）
  const filteredData = data.filter(item => {
    if (keyword) {
      const v = String(item[fieldKey] || '').toLowerCase()
      if (!v.includes(keyword.toLowerCase())) return false
    }
    if (chip1 && item[config.chipKey1] !== chip1) return false
    if (chip2 && item[config.chipKey2] !== chip2) return false
    return true
  })

  // Toast hook（用于操作反馈）
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  // 撤销 dialog
  const [revokeTarget, setRevokeTarget] = useState(null)
  const [revokeRemark, setRevokeRemark] = useState('')
  const handleRevoke = (item) => {
    setRevokeTarget(item)
    setRevokeRemark('')
  }
  const confirmRevoke = () => {
    setRevokeTarget(null)
    setRevokeRemark('')
    showToast('撤销成功', 'success')
  }

  return (
    <>
      {/* 钉钉式查询条件卡 */}
      <div className="px-3 pt-3 relative">
        <div className="card">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <ChipSelect value={chip1} onChange={setChip1} placeholder={config.chipLabel1} options={chipOptions1}/>
            <ChipSelect value={chip2} onChange={setChip2} placeholder={config.chipLabel2} options={chipOptions2}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 共 N 条 + 顶部右侧操作区 */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {filteredData.length} 条</span>
        <div className="flex items-center gap-2">
          {config.extraHeader && config.extraHeader()}
          <button onClick={() => showToast('已发起导出', 'success')}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            导出
          </button>
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <config.Card
            key={item.id || i}
            item={item}
            fields={fields}
            onRevoke={config.allowRevoke ? () => handleRevoke(item) : null}
            onAction={(action, it) => {
              if (action === '详情') nav(config.detailPath(it))
              else if (action === '录入') nav(`/advertiser/detail/entry/${it.id}`)
              else if (action === '任务记录') nav('/m/2313')
              else if (action === '已完成') showToast(`提交成功`, 'success')
              else if (action === '撤销') handleRevoke(it)
              else if (action === '导出ID') showToast(`已导出广告主ID`, 'success')
              else showToast(`${action}：${it.id || it.advId}`, 'info')
            }}
          />
        ))}
      </div>

      {/* 分页（仅展示，无交互） */}
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">2</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <span>{PAGE_SIZE}条/页</span>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
        <span className="text-ink-300">|</span>
        <span className="flex items-center gap-1">前往
          <input className="w-8 h-6 border border-ink-200 rounded text-center text-[11px]" defaultValue="1"/>
          页
        </span>
      </div>

      {/* 底部：重置 + 确认（仅当有任意筛选条件时显示） */}
      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => setFilterOpen(false)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}

      {/* 行1 字段切换抽屉 */}
      {fieldDrawerOpen && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {/* 高级筛选弹窗 */}
      {filterOpen && (
        <SubjectAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          industries={config.chipOptions1(data)}
          statuses={config.chipOptions2(data)}
          groupOptions={Array.from(new Set(data.map(d => d.groupName).filter(Boolean)))}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* 撤销 dialog */}
      {revokeTarget && (
        <RevokeDialog
          onCancel={() => setRevokeTarget(null)}
          onConfirm={confirmRevoke}
        />
      )}

      {/* Toast */}
      {toast && <Toast type={toast.type} message={toast.msg}/>}
    </>
  )
}

// ============ 广告主 4 个 FAB ============
function AdvertiserApplyFab() {
  const nav = useNavigate()
  return (
    <div className="fixed right-4 bottom-20 z-40">
      <button onClick={() => nav('/advertiser/apply/new')} className="h-14 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">开户</span>
      </button>
    </div>
  )
}
function AdvertiserAccountFab() {
  return null  // 账户列表无 FAB（顶部已有批量操作按钮）
}
function AdvertiserTaskFab() {
  return null  // 任务列表无新建按钮
}

// ============ 广告主 4 个 Section 配置入口 ============
function AdvertiserApplyListSection({ node }) {
  return (
    <AdvertiserListSection
      node={node}
      config={{
        defaultFieldKey: 'groupName',
        fieldOptions: [
          { key: 'groupName', label: '集团名称' },
          { key: 'seqNo', label: '开户序列号' },
          { key: 'copyAdvId', label: '复制广告主ID' },
          { key: 'sales', label: '销售' },
          { key: 'creator', label: '创建人' },
        ],
        chipLabel1: '开户状态',
        chipKey1: 'status',
        chipOptions1: () => ['开户中', '完成', '撤销'],
        chipLabel2: '服务商池',
        chipKey2: 'pool',
        chipOptions2: (data) => Array.from(new Set(data.map(d => d.pool).filter(Boolean))),
        advancedInit: { groupName: '', sales: '', creator: '', copyAdvId: '', createdStart: '', createdEnd: '' },
        allowRevoke: true,
        detailPath: (it) => `/advertiser/apply/detail/${it.id}`,
        Card: AdvertiserApplyCard,
      }}
    />
  )
}

function AdvertiserDetailListSection({ node }) {
  const [importOpen, setImportOpen] = useState(false)
  return (
    <>
    <AdvertiserListSection
      node={node}
      config={{
        defaultFieldKey: 'detailName',
        fieldOptions: [
          { key: 'detailName', label: '明细名称' },
          { key: 'seqNo', label: '开户序列号' },
          { key: 'groupName', label: '集团名称' },
          { key: 'policyName', label: '政策名称' },
          { key: 'sales', label: '销售' },
        ],
        chipLabel1: '状态',
        chipKey1: 'status',
        chipOptions1: () => ['完成', '撤销'],
        chipLabel2: '媒体平台',
        chipKey2: 'platform',
        chipOptions2: (data) => Array.from(new Set(data.map(d => d.platform).filter(Boolean))),
        advancedInit: { policyName: '', industryL1: '', industryL2: '', operator: '', creator: '', sales: '', createdStart: '', createdEnd: '' },
        allowRevoke: false,
        detailPath: (it) => `/advertiser/detail/info/${it.id}`,
        Card: AdvertiserDetailCard,
        extraHeader: () => (
          <button onClick={() => setImportOpen(true)}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            多开户导入
          </button>
        ),
      }}
    />
    {importOpen && <MultiImportModal onClose={() => setImportOpen(false)}/>}
    </>
  )
}

// 多开户导入 → 附件上传 modal（自管 toast）
function MultiImportModal({ onClose }) {
  const [files, setFiles] = useState([])
  const [toast, setToast] = useState(null)
  const fileRef = useRef(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }
  const handlePick = () => fileRef.current?.click()
  const handleChange = (e) => {
    const arr = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...arr])
    e.target.value = ''
  }
  const removeFile = (idx) => setFiles(arr => arr.filter((_, i) => i !== idx))
  const handleSubmit = () => {
    showToast(`已上传 ${files.length} 个附件`, 'success')
    setTimeout(() => onClose(), 600)
  }

  return (
    <>
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div className="w-full max-w-[640px] max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <h3 className="text-[16px] font-medium text-ink-900">多开户导入</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
          <input ref={fileRef} type="file" multiple onChange={handleChange} className="hidden"/>

          {/* 上传区 */}
          <div onClick={handlePick}
            className="border-2 border-dashed border-ink-200 rounded-lg py-10 flex flex-col items-center justify-center gap-2 tap active:bg-ink-50">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4m0 0l-5 5m5-5l5 5M4 20h16" stroke="#999" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-[13px] text-ink-700">点击上传附件</div>
            <div className="text-[11px] text-ink-400">支持多文件，单个文件 ≤ 10MB</div>
          </div>

          {/* 已选附件列表 */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="text-[12px] text-ink-500">已选附件 ({files.length})</div>
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-ink-50 rounded text-[12px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 3v5h5M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8l-6-5z" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="flex-1 truncate text-ink-900">{f.name}</span>
                  <span className="text-ink-400 shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
                  <button onClick={() => removeFile(idx)} className="w-5 h-5 flex items-center justify-center tap">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-[11px] text-ink-500">说明：导入后将自动解析开户明细，可在「开户明细」列表查看进度。</div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-5 py-3 gap-3 justify-end shrink-0">
          <button onClick={onClose} className="h-9 px-6 bg-white border border-ink-200 rounded text-[14px] text-ink-700 active:bg-ink-50 tap">取消</button>
          <button onClick={handleSubmit} disabled={files.length === 0}
            className={`h-9 px-6 rounded text-[14px] tap ${files.length === 0 ? 'bg-ink-200 text-ink-400 cursor-not-allowed' : 'bg-brand text-white active:opacity-90'}`}>
            确认导入
          </button>
        </div>
      </div>
    </div>
    {toast && (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] px-5 py-3 bg-ink-900/90 text-white rounded-lg text-[13px] shadow-xl animate-fade-in flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {toast.msg}
      </div>
    )}
    </>
  )
}

function AdvertiserAccountListSection({ node }) {
  return (
    <AdvertiserAccountListSectionInner node={node}/>
  )
}

function AdvertiserTaskListSection({ node }) {
  return <AdvertiserTaskListSectionInner node={node}/>
}

// 任务列表 - 3 个固定查询字段：被复制账户ID / 任务状态 / 任务类型
function AdvertiserTaskListSectionInner({ node }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const nav = useNavigate()

  const [copyAdvIdQuery, setCopyAdvIdQuery] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  // 任务状态 / 任务类型 为枚举，不从数据派生
  const STATUS_OPTIONS = ['处理中', '已完成', '已失败']
  const TYPE_OPTIONS = ['批量导入', '复制账户', '手动录入', '多开户导入']

  const filteredData = data.filter(item => {
    if (copyAdvIdQuery && !String(item.copyAdvId || '').toLowerCase().includes(copyAdvIdQuery.toLowerCase())) return false
    if (status && item.status !== status) return false
    if (type && item.type !== type) return false
    return true
  })

  const handleReset = () => {
    setCopyAdvIdQuery(''); setStatus(''); setType('')
  }

  const hasAnyFilter = Boolean(copyAdvIdQuery || status || type)

  return (
    <>
      {/* 钉钉式查询条件 - 3 个固定字段 */}
      <div className="px-3 pt-3 relative">
        <div className="card divide-y divide-ink-100">
          {/* Row 1: 被复制账户ID 输入框 */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="text-[12px] text-ink-700 shrink-0 w-[88px] whitespace-nowrap">被复制账户ID：</span>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={copyAdvIdQuery} onChange={e => setCopyAdvIdQuery(e.target.value)}
                placeholder="请输入账户ID"
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
          </div>
          {/* Row 2: 任务状态 下拉 */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="text-[12px] text-ink-700 shrink-0 w-[88px] whitespace-nowrap">任务状态：</span>
            <div className="flex-1 relative z-30">
              <ChipSelect value={status} onChange={setStatus} placeholder="请选择" options={STATUS_OPTIONS}/>
            </div>
          </div>
          {/* Row 3: 任务类型 下拉 */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="text-[12px] text-ink-700 shrink-0 w-[88px] whitespace-nowrap">任务类型：</span>
            <div className="flex-1 relative z-20">
              <ChipSelect value={type} onChange={setType} placeholder="请选择" options={TYPE_OPTIONS}/>
            </div>
          </div>
        </div>
      </div>

      {/* 共 N 条 + 顶部右侧操作 */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {filteredData.length} 条</span>
        <button onClick={() => showToast('已发起导出', 'success')}
          className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 whitespace-nowrap shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <AdvertiserTaskCard
            key={item.id || i}
            item={item}
            fields={fields}
            onAction={(action) => {
              if (action === '详情') nav(`/m/2276`)
              else if (action === '导出ID') showToast(`已导出广告主ID`, 'success')
            }}
          />
        ))}
      </div>

      {/* 分页 */}
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">2</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <span>{PAGE_SIZE}条/页</span>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
      </div>

      {/* 底部 重置/确认 - 仅当有筛选时显示 */}
      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => {}} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}
    </>
  )
}

// ============ 账户列表 - 单/批量 Tab 切换 + 复选框（PC §3.4.3 特有）============
function AdvertiserAccountListSectionInner({ node }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE_OPTS = [100, 200, 400, 2000]
  const [pageSize, setPageSize] = useState(100)
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const nav = useNavigate()

  const [mode, setMode] = useState('single') // single | batch
  const [selected, setSelected] = useState(new Set())

  // 三个 modal
  const [policyModalOpen, setPolicyModalOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [recordModalOpen, setRecordModalOpen] = useState(false)

  const [fieldKey, setFieldKey] = useState('advName')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    advIdMode: 'single', advId: '', advIdBatch: '',
    groupName: '', policyName: '', customerName: '', platform: '',
    operator: '', sales: '', creator: '', taskId: '', source: '',
    createdStart: '', createdEnd: '',
  })

  const FIELD_OPTIONS = [
    { key: 'advName', label: '广告主名称' },
    { key: 'advId', label: '广告主ID' },
    { key: 'groupName', label: '客户集团' },
    { key: 'customerName', label: '客户名称' },
    { key: 'policyName', label: '政策名称' },
  ]
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const platformOpts = Array.from(new Set(data.map(d => d.platform).filter(Boolean)))
  const activeFilterCount = Object.entries(advanced).filter(([k, v]) => {
    if (k === 'advIdMode') return false
    if (k === 'createdStart' || k === 'createdEnd') return Boolean(v)
    return Boolean(v && v !== '')
  }).length
  const hasAnyFilter = Boolean(keyword || platform || activeFilterCount > 0)

  const filteredData = data.filter(item => {
    if (keyword && !String(item[fieldKey] || '').toLowerCase().includes(keyword.toLowerCase())) return false
    if (platform && item.platform !== platform) return false
    // 高级筛选
    if (advanced.advId) {
      if (advanced.advIdMode === 'batch') {
        // 单字段模式（兼容旧 keyword）
      } else {
        if (!String(item.advId || '').includes(advanced.advId)) return false
      }
    }
    if (advanced.advIdBatch) {
      const ids = advanced.advIdBatch.split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 200)
      if (ids.length && !ids.includes(String(item.advId))) return false
    }
    if (advanced.groupName && !String(item.groupName || '').includes(advanced.groupName)) return false
    if (advanced.policyName && !String(item.policyName || '').includes(advanced.policyName)) return false
    if (advanced.customerName && !String(item.customerName || '').includes(advanced.customerName)) return false
    if (advanced.platform && item.platform !== advanced.platform) return false
    if (advanced.operator && !String(item.operator || '').includes(advanced.operator)) return false
    if (advanced.sales && item.sales !== advanced.sales) return false
    if (advanced.creator && item.creator !== advanced.creator) return false
    if (advanced.taskId && !String(item.taskId || '').includes(advanced.taskId)) return false
    if (advanced.source && item.source !== advanced.source) return false
    return true
  })

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (selected.size === filteredData.length) setSelected(new Set())
    else setSelected(new Set(filteredData.map(d => d.id)))
  }

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const handleReset = () => {
    setKeyword(''); setPlatform('')
    setAdvanced({
      advIdMode: 'single', advId: '', advIdBatch: '',
      groupName: '', policyName: '', customerName: '', platform: '',
      operator: '', sales: '', creator: '', taskId: '', source: '',
      createdStart: '', createdEnd: '',
    })
    setFieldKey('advName')
  }

  return (
    <>
      {/* 钉钉式查询条件卡 */}
      <div className="px-3 pt-3 relative">
        <div className="card">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <ChipSelect value={platform} onChange={setPlatform} placeholder="媒体平台" options={platformOpts}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 顶部右侧操作 */}
      <div className="px-3 pt-3 flex items-center justify-end gap-2">
        <button onClick={() => setPolicyModalOpen(true)}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 whitespace-nowrap shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            批量更换政策
          </button>
          <button onClick={() => setWalletModalOpen(true)}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 whitespace-nowrap shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="white" strokeWidth="1.8"/>
              <path d="M3 10h18M7 15h3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            批量共享钱包
          </button>
          <button onClick={() => setRecordModalOpen(true)}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 whitespace-nowrap shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
              <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            变更记录
          </button>
          <button onClick={() => showToast('已发起下载', 'success')}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 whitespace-nowrap shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            下载
          </button>
      </div>

      {/* 共 N 条 + 批量模式下左侧勾选框 */}
      <div className="px-3 pt-3 flex items-center gap-2">
        {mode === 'batch' && (
          <button type="button" onClick={toggleAll}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform ${selected.size > 0 ? 'bg-brand border-brand' : 'border-ink-300 bg-white'}`}
            aria-label={selected.size === filteredData.length ? '取消全选' : '全选'}>
            {selected.size > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}
        <span className="text-[11px] text-ink-500">
          共 {filteredData.length} 条{selected.size > 0 && <span className="text-brand">/已选中 {selected.size} 条</span>}
        </span>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <AdvertiserAccountCard
            key={item.id || i}
            item={item}
            fields={fields}
            mode={mode}
            selected={selected.has(item.id)}
            onToggle={() => toggleOne(item.id)}
            onAction={(action) => {
              if (action === '详情') nav(`/advertiser/account/detail/${item.id}`)
              else if (action === '导出ID') showToast(`已导出广告主ID`, 'success')
            }}
          />
        ))}
      </div>

      {/* 分页 */}
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">2</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center gap-2 text-[11px] text-ink-500">
        <div className="relative">
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
            className="appearance-none bg-white border border-ink-200 rounded-full h-7 pl-3 pr-6 text-[11px] text-ink-700 focus:outline-none focus:border-brand cursor-pointer">
            {PAGE_SIZE_OPTS.map(n => (
              <option key={n} value={n}>{n} 条/页</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-ink-400 pointer-events-none">▾</span>
        </div>
        <span className="text-ink-300">|</span>
        <span>共 {total} 条</span>
      </div>

      {/* 批量模式底部 sticky 按钮区已移除（顶部已有 批量更换政策 / 批量共享钱包 / 变更记录 按钮） */}

      {hasAnyFilter && mode === 'single' && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => setFilterOpen(false)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}

      {fieldDrawerOpen && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {filterOpen && (
        <AccountAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          data={data}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {policyModalOpen && (
        <BatchChangePolicyModal
          data={data}
          selectedIds={selected}
          onClose={() => setPolicyModalOpen(false)}
        />
      )}

      {walletModalOpen && (
        <BatchShareWalletModal
          data={data}
          selectedIds={selected}
          onClose={() => setWalletModalOpen(false)}
        />
      )}

      {recordModalOpen && (
        <ChangeRecordModal
          onClose={() => setRecordModalOpen(false)}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.msg}/>}

      {/* 批量勾选 FAB（与新建集团同样式） */}
      <div className="fixed right-4 bottom-20 z-40">
        <button onClick={() => {
          const next = mode === 'batch' ? 'single' : 'batch'
          setMode(next)
          setSelected(new Set())
        }}
          className={`h-14 px-5 rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform ${mode === 'batch' ? 'bg-white border border-ink-200 text-ink-700' : 'bg-brand text-white'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {mode === 'batch'
              ? <path d="M6 6l12 12M18 6l-12 12" stroke="#666" strokeWidth="2.2" strokeLinecap="round"/>
              : <>
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/>
                  <path d="M7 12l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
            }
          </svg>
          <span className="text-[13px] font-medium">{mode === 'batch' ? '退出批量' : '批量勾选'}</span>
        </button>
      </div>
    </>
  )
}

// ============ 广告主 4 张卡片 ============
// 1) 开户申请卡片（PC §3.4.1）—— 详情 / 撤销
function AdvertiserApplyCard({ item, fields, onRevoke, onAction }) {
  const nav = useNavigate()
  const canRevoke = item.status !== '撤销'
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate flex-1">{item.groupName}</div>
          <span className="text-[12px] text-ink-700 shrink-0">{item.status}</span>
        </div>
        <div className="text-[11px] text-ink-400 mt-0.5">开户序列号: {item.seqNo} · 复制广告主ID: {item.copyAdvId}</div>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '服务商池' }} value={item.pool}/>
        <GroupField field={{ label: '销售' }} value={item.sales}/>
        <GroupField field={{ label: '创建人' }} value={item.creator}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
        <GroupField field={{ label: '更新时间' }} value={item.updated}/>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('详情', item)} className="text-brand tap">详情</button>
        {canRevoke && (
          <button onClick={() => onAction('撤销', item)} className="text-warning tap">撤销</button>
        )}
      </div>
    </div>
  )
}

// 2) 开户明细卡片（PC §3.4.2）—— 录入 / 任务记录 / 已完成
function AdvertiserDetailCard({ item, fields, onAction }) {
  const canComplete = item.status === '开户中'
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate flex-1">{item.detailName}</div>
          <span className="text-[12px] text-ink-700 shrink-0">{item.status}</span>
        </div>
        <div className="text-[11px] text-ink-400 mt-0.5">开户序列号: {item.seqNo} · 媒体: {item.platform}</div>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '集团名称' }} value={item.groupName}/>
        <GroupField field={{ label: '政策名称' }} value={item.policyName}/>
        <GroupField field={{ label: '客户返点比例' }} value={item.rebateRate}/>
        <GroupField field={{ label: '复制广告主ID' }} value={item.copyAdvId}/>
        <GroupField field={{ label: '开户主体' }} value={item.subject}/>
        <GroupField field={{ label: '一级行业' }} value={item.industryL1}/>
        <GroupField field={{ label: '媒介开户人' }} value={item.operator}/>
        <GroupField field={{ label: '开户ID总数' }} value={item.totalIds}/>
        <GroupField field={{ label: '成功数量' }} value={item.successCount}/>
        <GroupField field={{ label: '待开数量' }} value={item.pendingCount}/>
        <GroupField field={{ label: '销售' }} value={item.sales}/>
        <GroupField field={{ label: '创建人' }} value={item.creator}/>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('录入', item)} className="text-brand tap">录入</button>
        <button onClick={() => onAction('任务记录', item)} className="text-brand tap">任务记录</button>
        <button
          onClick={() => canComplete && onAction('已完成', item)}
          disabled={!canComplete}
          className={`tap ${canComplete ? 'text-brand' : 'text-ink-400 cursor-not-allowed'}`}>
          已完成
        </button>
      </div>
    </div>
  )
}

// 3) 账户列表卡片（PC §3.4.3）—— 单/批量 + 详情/导出
function AdvertiserAccountCard({ item, fields, mode, selected, onToggle, onAction }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="flex items-center gap-2">
          {mode === 'batch' && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onToggle() }}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform ${selected ? 'bg-brand border-brand' : 'border-ink-300 bg-white'}`}
              aria-label={selected ? '取消选中' : '选中'}>
              {selected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.advName}</div>
              <Tag text={item.accountStatus} type={colorMap[item.accountStatus] || 'blue'}/>
            </div>
            <div className="text-[11px] text-ink-400 mt-0.5">广告主ID: {item.advId} · 媒体: {item.platform}</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '绑定钱包ID' }} value={item.walletId}/>
        <GroupField field={{ label: '政策名称' }} value={item.policyName}/>
        <GroupField field={{ label: '客户名称' }} value={item.customerName}/>
        <GroupField field={{ label: '客户集团' }} value={item.groupName}/>
        <GroupField field={{ label: '一级行业' }} value={item.industryL1}/>
        <GroupField field={{ label: '二级行业' }} value={item.industryL2}/>
        <GroupField field={{ label: '所属销售' }} value={item.sales}/>
        <GroupField field={{ label: '充值录入返点' }} value={item.rechargeRebate}/>
        <GroupField field={{ label: '政策返点比例' }} value={item.policyRebate}/>
        <GroupField field={{ label: '来源' }} value={item.source}/>
        <GroupField field={{ label: '创建人' }} value={item.creator}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
      </div>
    </div>
  )
}

// 4) 任务列表卡片（PC §3.4.4）—— 详情 / 导出ID
function AdvertiserTaskCard({ item, fields, onAction }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate flex-1">{item.copyAdvId}</div>
          <Tag text={item.status} type={colorMap[item.status] || 'blue'}/>
        </div>
        <div className="text-[11px] text-ink-400 mt-0.5">任务ID: {item.id} · 集团: {item.groupName}</div>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '任务类型' }} value={item.type}/>
        <GroupField field={{ label: '录入数量' }} value={item.inputCount}/>
        <GroupField field={{ label: '录入结果' }} value={item.result}/>
        <GroupField field={{ label: '失败原因' }} value={item.failReason}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
        <GroupField field={{ label: '更新时间' }} value={item.updated}/>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('详情', item)} className="text-brand tap">详情</button>
        <button onClick={() => onAction('导出ID', item)} className="text-brand tap">导出ID</button>
      </div>
    </div>
  )
}

// ============ 批量更换政策 Modal（图1：移动端上下分区）============
function BatchChangePolicyModal({ data, selectedIds, onClose }) {
  const [group, setGroup] = useState('')
  const [policy, setPolicy] = useState('')
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const list = selectedIds && selectedIds.size > 0
    ? data.filter(d => selectedIds.has(d.id))
    : data.slice(0, 28) // 默认演示用前 28 条

  // 客户主体（已选择数据客户 - 根据 list 聚合）
  const customerNames = Array.from(new Set(list.map(d => d.customerName).filter(Boolean)))
  const POLICY_OPTIONS = [
    '巨量 Q3 返点政策', '磁力金牛 Q3 返点政策', '腾讯 Q3 返点政策',
    '聚光 Q3 返点政策', '快手 Q3 返点政策', '小红书 Q3 返点政策',
    '嘉禾 3C-快手-代投-AD',
  ]
  const POLICY_DETAIL = {
    '嘉禾 3C-快手-代投-AD': { platform: '小红书-品牌', rebate: '500%', period: '2026-07-15 至 2027-07-1' },
    '巨量 Q3 返点政策': { platform: '巨量引擎', rebate: '6.5%', period: '2026-07-01 至 2026-12-31' },
    '磁力金牛 Q3 返点政策': { platform: '磁力金牛', rebate: '7.2%', period: '2026-07-01 至 2026-12-31' },
  }
  const detail = POLICY_DETAIL[policy]

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="w-full max-h-[92%] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-ink-100">
          <h3 className="text-[16px] font-medium text-ink-900">批量更换政策</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* 上下分区：上表格 + 下表单 */}
        <div className="flex-1 overflow-y-auto">
          {/* 已选择数据表（横向滚动 + 内部纵向滚动） */}
          <div className="mx-4 mt-4 bg-ink-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 shrink-0 border-b border-ink-100">
              <span className="w-1 h-4 bg-emerald-500 rounded-sm"/>
              <span className="text-[14px] font-medium text-ink-900">已选择 {list.length} 条数据</span>
            </div>
            <div className="max-h-[180px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-[12px] min-w-[480px]">
                <thead>
                  <tr className="text-ink-700 bg-ink-100/60">
                    <th className="py-2 px-3 text-center font-normal whitespace-nowrap sticky top-0 bg-ink-100/60">广告主ID</th>
                    <th className="py-2 px-3 text-center font-normal whitespace-nowrap sticky top-0 bg-ink-100/60">广告主名称</th>
                    <th className="py-2 px-3 text-center font-normal whitespace-nowrap sticky top-0 bg-ink-100/60">政策名称</th>
                    <th className="py-2 px-3 text-center font-normal whitespace-nowrap sticky top-0 bg-ink-100/60">媒体平台</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((it, idx) => (
                    <tr key={it.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                      <td className="py-2 px-3 text-center text-ink-900 whitespace-nowrap">{it.advId}</td>
                      <td className="py-2 px-3 text-center text-ink-700 whitespace-nowrap">{it.advName || '--'}</td>
                      <td className="py-2 px-3 text-center text-ink-700 whitespace-nowrap">{it.policyName}</td>
                      <td className="py-2 px-3 text-center text-ink-700 whitespace-nowrap">{it.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 新政策配置 */}
          <div className="mx-4 mt-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-4 bg-emerald-500 rounded-sm"/>
              <span className="text-[14px] font-medium text-ink-900">新政策配置</span>
            </div>

            <div className="space-y-3">
              <ModalField label="集团" required>
                <select value={group} onChange={e => setGroup(e.target.value)}
                  className="form-input">
                  <option value="">请选择</option>
                  <option value="美画轻奢">美画轻奢</option>
                  <option value="艾麦交接集团">艾麦交接集团</option>
                  <option value="山东陆路">山东陆路</option>
                  <option value="深圳艾斯">深圳艾斯</option>
                </select>
              </ModalField>

              <ModalField label="客户主体">
                <select disabled={!group} value="" onChange={() => {}}
                  className="form-input disabled:bg-ink-100 disabled:text-ink-400">
                  <option value="">请先选择集团</option>
                </select>
                {group && customerNames.length > 0 && (
                  <div className="mt-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-[12px] text-emerald-700 flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div className="break-all">已选择数据客户：{customerNames.join('、')}</div>
                  </div>
                )}
              </ModalField>

              <ModalField label="选择政策" required>
                <select value={policy} onChange={e => setPolicy(e.target.value)}
                  className="form-input">
                  <option value="">请选择政策</option>
                  {POLICY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </ModalField>

              {detail && (
                <div className="px-3 py-3 bg-emerald-50 border border-emerald-200 rounded">
                  <div className="text-[13px] font-medium text-emerald-700 mb-2">政策详情</div>
                  <div className="space-y-1.5 text-[12px]">
                    <div className="flex items-center">
                      <span className="w-[80px] shrink-0 text-emerald-700/70">媒体平台</span>
                      <input readOnly value={detail.platform} className="flex-1 min-w-0 bg-white px-2 py-1 rounded border border-emerald-100 text-ink-900"/>
                    </div>
                    <div className="flex items-center">
                      <span className="w-[80px] shrink-0 text-emerald-700/70">客户返点比例</span>
                      <input readOnly value={detail.rebate} className="flex-1 min-w-0 bg-white px-2 py-1 rounded border border-emerald-100 text-ink-900"/>
                    </div>
                    <div className="flex items-center">
                      <span className="w-[80px] shrink-0 text-emerald-700/70">有效期</span>
                      <input readOnly value={detail.period} className="flex-1 min-w-0 bg-white px-2 py-1 rounded border border-emerald-100 text-ink-900"/>
                    </div>
                  </div>
                </div>
              )}

              <ModalField label="变更原因" required>
                <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="请输入变更原因"
                  className="form-input resize-none"/>
              </ModalField>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex-none flex border-t border-ink-100 px-5 py-3 gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取消</button>
          <button onClick={() => { showToast('已提交批量更换', 'success'); onClose() }}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确认</button>
        </div>

        {toast && <Toast type={toast.type} message={toast.msg}/>}
      </div>
    </div>
  )
}

// ============ 批量共享钱包 Modal（图2：移动端底部弹出 sheet）============
function BatchShareWalletModal({ data, selectedIds, onClose }) {
  const initRows = (selectedIds && selectedIds.size > 0
    ? data.filter(d => selectedIds.has(d.id))
    : data.slice(0, 7)
  ).map(d => ({ ...d, _opType: '', _walletId: '' }))

  const [topOpType, setTopOpType] = useState('绑定')
  const [topWalletId, setTopWalletId] = useState('123')
  const [advIdQuery, setAdvIdQuery] = useState('')
  const [rows, setRows] = useState(initRows)
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const updateRow = (idx, key, val) => setRows(arr => arr.map((r, i) => i === idx ? { ...r, [key]: val } : r))

  const applyAll = () => {
    setRows(arr => arr.map(r => ({ ...r, _opType: topOpType, _walletId: topWalletId })))
    showToast(`已统一配置 ${rows.length} 条`, 'info')
  }
  const resetData = () => {
    setRows(arr => arr.map(r => ({ ...r, _opType: '', _walletId: '' })))
    showToast('已重置数据', 'info')
  }

  const filteredRows = advIdQuery
    ? rows.filter(r => String(r.advId || '').includes(advIdQuery))
    : rows

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="w-full max-h-[92%] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-ink-100">
          <h3 className="text-[16px] font-medium text-ink-900">批量共享钱包</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* 顶部输入 */}
        <div className="px-5 py-3 shrink-0 space-y-2.5 bg-ink-50/40">
          <div className="flex items-center gap-3">
            <label className="text-[12px] text-ink-700 shrink-0 w-[64px]">广告主ID：</label>
            <input value={advIdQuery} onChange={e => setAdvIdQuery(e.target.value)}
              placeholder="请输入广告主ID"
              className="form-input flex-1 min-w-0"/>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[12px] text-ink-700 shrink-0 whitespace-nowrap">操作类型：</label>
            <select value={topOpType} onChange={e => setTopOpType(e.target.value)}
              className="form-input w-[80px] shrink-0">
              <option value="绑定">绑定</option>
              <option value="解绑">解绑</option>
              <option value="更换">更换</option>
            </select>
            <label className="text-[12px] text-ink-700 shrink-0 whitespace-nowrap">共享钱包ID：</label>
            <input value={topWalletId} onChange={e => setTopWalletId(e.target.value)}
              className="form-input w-[100px] shrink-0"/>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={applyAll}
              className="h-8 px-3 bg-brand text-white rounded text-[12px] tap active:opacity-90 whitespace-nowrap">统一配置</button>
            <button onClick={resetData}
              className="h-8 px-3 bg-white border border-ink-200 rounded text-[12px] text-ink-700 tap active:bg-ink-50 whitespace-nowrap">重置数据</button>
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] min-w-[480px]">
              <thead className="bg-ink-50 sticky top-0">
                <tr className="text-ink-700">
                  <th className="py-2.5 px-3 text-center font-normal whitespace-nowrap">广告主ID</th>
                  <th className="py-2.5 px-3 text-center font-normal whitespace-nowrap">广告主名称</th>
                  <th className="py-2.5 px-3 text-center font-normal whitespace-nowrap w-[120px]">操作类型</th>
                  <th className="py-2.5 px-3 text-center font-normal whitespace-nowrap w-[140px]">共享钱包ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r, idx) => (
                  <tr key={r.id} className="border-t border-ink-100">
                    <td className="py-2 px-3 text-center text-ink-900 whitespace-nowrap">{r.advId}</td>
                    <td className="py-2 px-3 text-center text-ink-700 whitespace-nowrap">{r.advName}</td>
                    <td className="py-2 px-3">
                      <select value={r._opType} onChange={e => updateRow(idx, '_opType', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-ink-200 rounded text-[12px]">
                        <option value="">请选择</option>
                        <option value="绑定">绑定</option>
                        <option value="解绑">解绑</option>
                        <option value="更换">更换</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input value={r._walletId} onChange={e => updateRow(idx, '_walletId', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-ink-200 rounded text-[12px]"/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex-none flex border-t border-ink-100 px-5 py-3 gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取消</button>
          <button onClick={() => { showToast(`已提交 ${rows.length} 条共享钱包变更`, 'success'); onClose() }}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确认</button>
        </div>

        {toast && <Toast type={toast.type} message={toast.msg}/>}
      </div>
    </div>
  )
}

// ============ 变更记录 Modal（图3、图4：双 tab）============
function ChangeRecordModal({ onClose }) {
  const [tab, setTab] = useState('wallet') // wallet | policy

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="w-full max-h-[92%] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-ink-100">
          <h3 className="text-[16px] font-medium text-ink-900">变更记录</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-ink-100 shrink-0">
          <div className="flex items-center gap-6">
            <TabBtn active={tab === 'wallet'} onClick={() => setTab('wallet')}>共享钱包变更记录</TabBtn>
            <TabBtn active={tab === 'policy'} onClick={() => setTab('policy')}>政策变更记录</TabBtn>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === 'wallet' ? <WalletChangeTab /> : <PolicyChangeTab />}
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`relative h-10 text-[13px] tap ${active ? 'text-brand font-medium' : 'text-ink-500'}`}>
      {children}
      {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-brand rounded-t"/>}
    </button>
  )
}

// 共享钱包变更记录 tab（卡片列表）
function WalletChangeTab() {
  const [q, setQ] = useState('')
  const all = walletChangeRecordsData
  const filtered = q ? all.filter(r => String(r.advId || '').includes(q)) : all
  const totalPages = Math.max(1, Math.ceil(filtered.length / 15))

  return (
    <>
      <div className="px-5 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-ink-700 shrink-0">广告主ID：</label>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="请输入"
            className="form-input"/>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-2">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[12px] text-ink-400">暂无数据</div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="bg-white border border-ink-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                r.opType === '绑定' ? 'bg-emerald-50 text-emerald-700' :
                r.opType === '解绑' ? 'bg-rose-50 text-rose-600' :
                'bg-amber-50 text-amber-700'
              }`}>{r.opType}</span>
              <span className="text-[11px] text-ink-500">{r.opTime}</span>
            </div>
            <KVItem label="广告主ID" value={r.advId}/>
            <KVItem label="共享钱包ID" value={r.walletId}/>
            <KVItem label="操作人" value={r.operator} last/>
          </div>
        ))}
      </div>
      <PaginationFooter total={filtered.length} totalPages={totalPages}/>
    </>
  )
}

// 卡片内单行 KV
function KVItem({ label, value, last }) {
  return (
    <div className={`flex items-center py-1 ${last ? '' : 'border-b border-dashed border-ink-100'}`}>
      <span className="w-[80px] shrink-0 text-[11px] text-ink-500">{label}</span>
      <span className="flex-1 min-w-0 text-[12px] text-ink-900 truncate">{value}</span>
    </div>
  )
}

// 政策变更记录 tab（钉钉式查询 + 卡片列表）
function PolicyChangeTab() {
  const [fieldDrawerOpenPolicy, setFieldDrawerOpenPolicy] = useState(false)
  // 行 1 字段配置
  const FIELD_OPTIONS = [
    { key: 'customerName', label: '客户名称' },
    { key: 'advId', label: '广告主ID' },
    { key: 'advName', label: '广告主名称' },
    { key: 'operator', label: '操作人' },
  ]
  const [fieldKey, setFieldKey] = useState('customerName')
  const [keyword, setKeyword] = useState('')
  const [operator, setOperator] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    customerName: '', advId: '', advName: '', operator: '', createdStart: '', createdEnd: '',
  })
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)

  // 操作人 chip 选项（已弃用：改为搜索输入框）
  const all = policyChangeRecordsData

  const activeFilterCount = (['customerName','advId','advName','operator','createdStart','createdEnd'])
    .reduce((n, k) => n + (advanced[k] ? 1 : 0), 0)
  const hasAnyFilter = Boolean(keyword || operator || activeFilterCount > 0)

  // 过滤
  const filtered = all.filter(r => {
    if (keyword && !String(r[fieldKey] || '').includes(keyword)) return false
    if (operator && !String(r.operator || '').includes(operator)) return false
    if (advanced.customerName && !String(r.customerName || '').includes(advanced.customerName)) return false
    if (advanced.advId && !String(r.advId || '').includes(advanced.advId)) return false
    if (advanced.advName && !String(r.advName || '').includes(advanced.advName)) return false
    if (advanced.operator && !String(r.operator || '').includes(advanced.operator)) return false
    return true
  })

  const handleReset = () => {
    setKeyword(''); setOperator('')
    setAdvanced({ customerName: '', advId: '', advName: '', operator: '', createdStart: '', createdEnd: '' })
    setFieldKey('customerName')
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / 15))

  return (
    <>
      {/* 钉钉式行 1：字段切换 + 输入 */}
      <div className="px-5 pt-3 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setFieldDrawerOpenPolicy(true)}
            className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
            <span className="truncate">{currentField.label}</span>
            <span className="text-ink-400 text-[10px] shrink-0">▾</span>
          </button>
          <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder={currentField.label}
              className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
          </div>
          <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
              <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 钉钉式行 2：操作人 标签 + 输入框 + 漏斗（无排序，与行 1 同款样式） */}
      <div className="px-5 pt-2 pb-2 flex items-center gap-2 shrink-0 relative z-30">
        <div className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center shrink-0 whitespace-nowrap">
          操作人
        </div>
        <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
          <input value={operator} onChange={e => setOperator(e.target.value)}
            placeholder="请输入操作人"
            className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
        </div>
        <button onClick={() => setFilterOpen(true)}
          className="w-9 h-9 flex items-center justify-center tap relative shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* 卡片列表 */}
      <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-2">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[12px] text-ink-400">暂无数据</div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="bg-white border border-ink-100 rounded-lg p-3">
            <div className="mb-2 space-y-1.5">
              <div className="text-[11px] text-ink-500 truncate">
                <span className="text-ink-400">原政策：</span>{r.oldPolicy}
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700">新：{r.newPolicy}</span>
              </div>
            </div>
            <KVItem label="客户名称" value={r.customerName}/>
            <KVItem label="广告主ID" value={r.advId}/>
            <KVItem label="广告主名称" value={r.advName}/>
            <KVItem label="操作人" value={r.operator}/>
            <KVItem label="操作时间" value={r.opTime} last/>
          </div>
        ))}
      </div>
      <PaginationFooter total={filtered.length} totalPages={totalPages}/>

      {/* 字段选择抽屉 */}
      {fieldDrawerOpenPolicy && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpenPolicy(false) }}
          onClose={() => setFieldDrawerOpenPolicy(false)}
        />
      )}

      {/* 高级筛选 sheet */}
      {filterOpen && (
        <PolicyAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          onClose={() => setFilterOpen(false)}
          onReset={handleReset}
        />
      )}
    </>
  )
}

// 政策变更记录 - 高级筛选 sheet
function PolicyAdvancedFilter({ values, setValues, onClose, onReset }) {
  const fields = [
    { key: 'customerName', label: '客户名称', kind: 'input' },
    { key: 'advId', label: '广告主ID', kind: 'input' },
    { key: 'advName', label: '广告主名称', kind: 'input' },
    { key: 'operator', label: '操作人', kind: 'input' },
    { key: 'createdRange', label: '操作时间', kind: 'daterange' },
  ]
  const [active, setActive] = useState('customerName')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

  const handleReset = () => {
    setValues({ customerName: '', advId: '', advName: '', operator: '', createdStart: '', createdEnd: '' })
    onReset && onReset()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.createdStart || ''} onChange={e => set('createdStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.createdEnd || ''} onChange={e => set('createdEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

function PaginationFooter({ total, totalPages }) {
  return (
    <div className="px-6 pb-3 pt-2 flex items-center justify-center gap-3 text-[12px] text-ink-700 border-t border-ink-100 shrink-0">
      <select className="h-8 px-2 bg-white border border-ink-200 rounded text-[12px]">
        <option>15条/页</option>
        <option>30条/页</option>
        <option>50条/页</option>
      </select>
      <span className="text-ink-500">共 {total} 条</span>
      <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
      <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <span className="text-ink-500 ml-2">前往</span>
      <input className="w-10 h-8 text-center bg-white border border-ink-200 rounded text-[12px]" defaultValue="1"/>
      <span className="text-ink-500">页</span>
    </div>
  )
}

// Modal 通用单行（label 左 + 内容右）
function ModalField({ label, required, children }) {
  return (
    <div className="flex items-start">
      <div className="w-[80px] shrink-0 text-[13px] text-ink-700 pt-2">
        {required && <span className="text-danger mr-0.5">*</span>}
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

// ============ 政策管理 · 政策列表（钉钉式查询 + 详情/催办/变更 + 下载）============
function PolicyListSection({ node }) {
  const data = node.data || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const nav = useNavigate()

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const [fieldKey, setFieldKey] = useState('name')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [approval, setApproval] = useState('')
  const [payType, setPayType] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    project: '', platform: '', customerName: '', groupName: '', creator: '', updatedStart: '', updatedEnd: '',
  })
  const [changeOpen, setChangeOpen] = useState(false)
  const [changeItem, setChangeItem] = useState(null)

  const FIELD_OPTIONS = [
    { key: 'name', label: '政策名称' },
    { key: 'id', label: '政策编号' },
    { key: 'project', label: '项目名称' },
    { key: 'customerName', label: '客户名称' },
    { key: 'groupName', label: '集团名称' },
  ]
  const APPROVAL_OPTIONS = ['审批通过', '审批中', '已驳回']
  const PAY_TYPE_OPTIONS = Array.from(new Set(data.map(d => d.payType).filter(Boolean)))
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const activeFilterCount = Object.values(advanced).filter(v => v && v !== '').length

  const filteredData = data.filter(item => {
    if (keyword && currentField) {
      const v = String(item[currentField.key] || '')
      if (!v.toLowerCase().includes(keyword.toLowerCase())) return false
    }
    if (approval && item.approval !== approval) return false
    if (payType && item.payType !== payType) return false
    if (advanced.project && !String(item.project || '').includes(advanced.project)) return false
    if (advanced.platform && item.platform !== advanced.platform) return false
    if (advanced.customerName && !String(item.customerName || '').includes(advanced.customerName)) return false
    if (advanced.groupName && !String(item.groupName || '').includes(advanced.groupName)) return false
    if (advanced.creator && !String(item.creator || '').includes(advanced.creator)) return false
    return true
  })

  const hasAnyFilter = Boolean(keyword || approval || payType || activeFilterCount > 0)
  const handleReset = () => {
    setKeyword(''); setApproval(''); setPayType('')
    setAdvanced({ project: '', platform: '', customerName: '', groupName: '', creator: '', updatedStart: '', updatedEnd: '' })
    setFieldKey('name')
  }

  return (
    <>
      {/* 钉钉式查询条件卡 */}
      <div className="px-3 pt-3 relative">
        <div className="card">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <ChipSelect value={approval} onChange={setApproval} placeholder="审批状态" options={APPROVAL_OPTIONS}/>
            <ChipSelect value={payType} onChange={setPayType} placeholder="付款方式" options={PAY_TYPE_OPTIONS}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 共 N 条 + 下载 */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {filteredData.length} 条</span>
        <button onClick={() => showToast('已发起下载', 'success')}
          className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          下载
        </button>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <PolicyCard key={item.id || i} item={item}
            onAction={(a) => {
              if (a === '详情') nav(`/policy/detail/${item.id}`)
              else if (a === '催办') showToast('催办成功', 'success')
              else if (a === '变更') nav(`/policy/change/${item.id}`)
            }}/>
        ))}
      </div>

      {/* 分页 */}
      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className={`px-3 ${hasAnyFilter ? 'pb-24' : 'pb-3'} flex items-center justify-center gap-2 text-[11px] text-ink-500`}>
        <span>{PAGE_SIZE}条/页</span><span className="text-ink-300">|</span><span>共 {total} 条</span>
      </div>

      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => {}} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">查 询</button>
        </div>
      )}

      {fieldDrawerOpen && (
        <FieldDrawer fields={FIELD_OPTIONS} currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}/>
      )}

      {filterOpen && (
        <PolicyListAdvancedFilter values={advanced} setValues={setAdvanced}
          data={data}
          onClose={() => setFilterOpen(false)}
          onReset={() => setAdvanced({ project: '', platform: '', customerName: '', groupName: '', creator: '', updatedStart: '', updatedEnd: '' })}/>
      )}

      {changeOpen && changeItem && (
        <PolicyChangeSheet item={changeItem} onClose={() => { setChangeOpen(false); setChangeItem(null) }}/>
      )}

      {toast && <Toast message={toast.msg} type={toast.type}/>}
    </>
  )
}

function PolicyCard({ item, onAction }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.name || '--'}</div>
          <div className="text-[11px] text-ink-400 mt-0.5">政策编号：{item.id} · 项目：{item.project || '--'}</div>
        </div>
        <Tag text={item.approval} type={colorMap[item.approval] || 'gray'}/>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '返点比例' }} value={item.rebate}/>
        <GroupField field={{ label: '服务费比例' }} value={item.serviceFee}/>
        <GroupField field={{ label: '付款方式' }} value={item.payType}/>
        <GroupField field={{ label: '合作模式' }} value={item.coopMode}/>
        <GroupField field={{ label: '客户名称' }} value={item.customerName}/>
        <GroupField field={{ label: '客户类型' }} value={item.customerType}/>
        <GroupField field={{ label: '媒体平台' }} value={item.platform}/>
        <GroupField field={{ label: '竞价类型' }} value={item.bidType}/>
        <GroupField field={{ label: '集团名称' }} value={item.groupName}/>
        <GroupField field={{ label: '垫款账期(天)' }} value={item.creditDays}/>
        <GroupField field={{ label: '业绩归属人' }} value={item.salesOwner}/>
        <GroupField field={{ label: '创建人' }} value={item.creator}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
        <GroupField field={{ label: '更新时间' }} value={item.updated}/>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('详情')} className="text-brand tap">详情</button>
        <button onClick={() => onAction('催办')} className="text-orange-500 tap">催办</button>
        <button onClick={() => onAction('变更')} className="text-brand tap">变更</button>
      </div>
    </div>
  )
}

// 政策变更 sheet（移动端弹窗）
function PolicyChangeSheet({ item, onClose }) {
  const [newName, setNewName] = useState(item.name + ' - 变更')
  const [reason, setReason] = useState('')
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}/>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-4 pt-3 pb-6 animate-[slideUp_0.25s_ease-out]">
        <div className="w-10 h-1 bg-ink-200 rounded-full mx-auto mb-3"/>
        <div className="text-[16px] font-medium text-ink-900 mb-3">政策变更</div>
        <div className="space-y-3">
          <div>
            <div className="text-[11px] text-ink-500 mb-1">原政策</div>
            <div className="bg-ink-50 rounded px-3 py-2 text-[13px] text-ink-700">{item.name}</div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 mb-1">新政策名称</div>
            <div className="bg-ink-50 rounded-full h-10 flex items-center px-4 text-[13px]">
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="flex-1 bg-transparent text-ink-900 focus:outline-none"/>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 mb-1">变更原因</div>
            <div className="bg-ink-50 rounded-lg px-3 py-2 text-[13px] min-h-[64px]">
              <textarea value={reason} onChange={e => setReason(e.target.value)}
                placeholder="请输入变更原因"
                className="w-full bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none resize-none"/>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={() => { showToast('变更已提交', 'success'); onClose() }}
            className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
        </div>
      </div>
    </>
  )
}

// 政策高级筛选（左侧+右侧双栏布局，与广告主管理一致）
function PolicyListAdvancedFilter({ values, setValues, data, onClose, onReset }) {
  const platformOpts = Array.from(new Set(data.map(d => d.platform).filter(Boolean)))

  const fields = [
    { key: 'project', label: '项目名称', kind: 'input' },
    { key: 'platform', label: '媒体平台', kind: 'select', options: platformOpts },
    { key: 'customerName', label: '客户名称', kind: 'input' },
    { key: 'groupName', label: '集团名称', kind: 'input' },
    { key: 'creator', label: '创建人', kind: 'input' },
    { key: 'updatedRange', label: '更新时间', kind: 'daterange' },
  ]

  const [active, setActive] = useState('project')
  const activeField = fields.find(f => f.key === active)
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setValues({
      project: '', platform: '', customerName: '', groupName: '', creator: '',
      updatedStart: '', updatedEnd: '',
    })
    onReset && onReset()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">请选择</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.updatedStart || ''} onChange={e => set('updatedStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.updatedEnd || ''} onChange={e => set('updatedEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// ============ 政策管理 · 直播政策 ============
function LivePolicyListSection({ node }) {
  const nav = useNavigate()
  const data = node.data || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const [fieldKey, setFieldKey] = useState('customerName')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [applyDateStart, setApplyDateStart] = useState('')
  const [applyDateEnd, setApplyDateEnd] = useState('')
  const [approval, setApproval] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    groupName: '', platform: '', sales: '', applicant: '',
  })
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [revokeItem, setRevokeItem] = useState(null)

  const FIELD_OPTIONS = [
    { key: 'customerName', label: '客户名称' },
    { key: 'code', label: '政策编号' },
    { key: 'groupName', label: '集团' },
  ]
  const APPROVAL_OPTIONS = ['审批通过', '审批中', '已驳回', '已撤销']
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const activeFilterCount = Object.values(advanced).filter(v => v && v !== '').length

  const filteredData = data.filter(item => {
    if (keyword && currentField) {
      const v = String(item[currentField.key] || '')
      if (!v.toLowerCase().includes(keyword.toLowerCase())) return false
    }
    if (applyDateStart && item.applyDate < applyDateStart) return false
    if (applyDateEnd && item.applyDate > applyDateEnd) return false
    if (approval && item.approval !== approval) return false
    if (advanced.groupName && !String(item.groupName || '').includes(advanced.groupName)) return false
    if (advanced.platform && item.platform !== advanced.platform) return false
    if (advanced.sales && item.sales !== advanced.sales) return false
    if (advanced.applicant && !String(item.applicant || '').includes(advanced.applicant)) return false
    return true
  })

  const hasAnyFilter = Boolean(keyword || applyDateStart || applyDateEnd || approval || activeFilterCount > 0)
  const handleReset = () => {
    setKeyword(''); setApplyDateStart(''); setApplyDateEnd(''); setApproval('')
    setAdvanced({ groupName: '', platform: '', sales: '', applicant: '' })
    setFieldKey('customerName')
  }

  return (
    <>
      <div className="px-3 pt-3 relative">
        <div className="card">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <input type="date" value={applyDateStart} onChange={e => setApplyDateStart(e.target.value)}
              className="bg-ink-50 rounded-full h-9 px-3 text-[12px] text-ink-700 focus:outline-none w-[118px]"/>
            <span className="text-ink-400 text-[12px]">-</span>
            <input type="date" value={applyDateEnd} onChange={e => setApplyDateEnd(e.target.value)}
              className="bg-ink-50 rounded-full h-9 px-3 text-[12px] text-ink-700 focus:outline-none w-[118px]"/>
            <ChipSelect value={approval} onChange={setApproval} placeholder="审批状态" options={APPROVAL_OPTIONS}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {filteredData.length} 条</span>
        <button onClick={() => showToast('已发起导出', 'success')}
          className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <LivePolicyCard key={item.code || i} item={item}
            onAction={(a) => {
              if (a === '详情') nav(`/policy/live/detail/${item.code}`)
              else if (a === '撤销') { setRevokeItem(item); setRevokeOpen(true) }
              else if (a === '重新发起') nav('/policy/live/create', { state: { prefill: item } })
            }}/>
        ))}
      </div>

      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className={`px-3 ${hasAnyFilter ? 'pb-24' : 'pb-3'} flex items-center justify-center gap-2 text-[11px] text-ink-500`}>
        <span>{PAGE_SIZE}条/页</span><span className="text-ink-300">|</span><span>共 {total} 条</span>
      </div>

      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => {}} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">查 询</button>
        </div>
      )}

      {fieldDrawerOpen && (
        <FieldDrawer fields={FIELD_OPTIONS} currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}/>
      )}

      {filterOpen && (
        <LivePolicyAdvancedFilter values={advanced} setValues={setAdvanced}
          data={data}
          onClose={() => setFilterOpen(false)}
          onReset={() => setAdvanced({ groupName: '', platform: '', sales: '', applicant: '' })}/>
      )}

      {revokeOpen && revokeItem && (
        <RevokeDialog
          onCancel={() => { setRevokeOpen(false); setRevokeItem(null) }}
          onConfirm={() => { showToast('已撤销', 'success'); setRevokeOpen(false); setRevokeItem(null) }}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type}/>}
    </>
  )
}

function LivePolicyCard({ item, onAction }) {
  const canRestart = item.approval === '已撤销' || item.approval === '已驳回'
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.customerName || '--'}</div>
          <div className="text-[11px] text-ink-400 mt-0.5">政策编号：{item.code} · 集团：{item.groupName || '--'}</div>
        </div>
        <Tag text={item.approval} type={colorMap[item.approval] || 'gray'}/>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '行业' }} value={item.industry}/>
        <GroupField field={{ label: '代投客户政策' }} value={item.customerPolicy}/>
        <GroupField field={{ label: '备注情况' }} value={item.remark}/>
        <GroupField field={{ label: '销售' }} value={item.sales}/>
        <GroupField field={{ label: '部门' }} value={item.department}/>
        <GroupField field={{ label: '投放媒体' }} value={item.platform}/>
        <GroupField field={{ label: '申请人' }} value={item.applicant}/>
        <GroupField field={{ label: '申请日期' }} value={item.applyDate}/>
        <GroupField field={{ label: '财务报价' }} value={'¥ ' + Number(item.financeQuote || 0).toLocaleString()}/>
        <GroupField field={{ label: '创建时间' }} value={item.created}/>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('详情')} className="text-brand tap">详情</button>
        {item.approval !== '已撤销' && item.approval !== '已驳回' && (
          <button onClick={() => onAction('撤销')} className="text-brand tap">撤销</button>
        )}
        {canRestart && (
          <button onClick={() => onAction('重新发起')} className="text-ink-500 tap">重新发起</button>
        )}
      </div>
    </div>
  )
}

// 直播政策高级筛选（左侧+右侧双栏布局，与广告主管理一致）
function LivePolicyAdvancedFilter({ values, setValues, data, onClose, onReset }) {
  const groupOpts = Array.from(new Set(data.map(d => d.groupName).filter(Boolean)))
  const salesOpts = Array.from(new Set(data.map(d => d.sales).filter(Boolean)))
  const platformOpts = Array.from(new Set(data.map(d => d.platform).filter(Boolean)))

  const fields = [
    { key: 'groupName', label: '集团', kind: 'input' },
    { key: 'sales', label: '销售', kind: 'input' },
    { key: 'applicant', label: '申请人', kind: 'input' },
    { key: 'platform', label: '媒体', kind: 'select', options: platformOpts },
  ]

  const [active, setActive] = useState('groupName')
  const activeField = fields.find(f => f.key === active)
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setValues({ groupName: '', platform: '', sales: '', applicant: '' })
    onReset && onReset()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-2 bg-white">
          <button onClick={onClose}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={handleReset}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// ============ 政策管理 · 素材采买 ============
function MaterialPurchaseListSection({ node }) {
  const nav = useNavigate()
  const data = node.data || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const [fieldKey, setFieldKey] = useState('customerName')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [applyDate, setApplyDate] = useState('')
  const [approval, setApproval] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    groupName: '', platform: '', videoType: '', applicant: '',
  })
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [revokeItem, setRevokeItem] = useState(null)

  const FIELD_OPTIONS = [
    { key: 'customerName', label: '客户名称' },
    { key: 'code', label: '审批单号' },
    { key: 'groupName', label: '集团' },
  ]
  const APPROVAL_OPTIONS = ['审批通过', '审批中', '已驳回', '已撤销']
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const activeFilterCount = Object.values(advanced).filter(v => v && v !== '').length

  const filteredData = data.filter(item => {
    if (keyword && currentField) {
      const v = String(item[currentField.key] || '')
      if (!v.toLowerCase().includes(keyword.toLowerCase())) return false
    }
    if (applyDate && item.applyDate !== applyDate) return false
    if (approval && item.approval !== approval) return false
    if (advanced.groupName && !String(item.groupName || '').includes(advanced.groupName)) return false
    if (advanced.platform && item.platform !== advanced.platform) return false
    if (advanced.videoType && !(item.videoTypes || []).includes(advanced.videoType)) return false
    if (advanced.applicant && !String(item.applicant || '').includes(advanced.applicant)) return false
    return true
  })

  const hasAnyFilter = Boolean(keyword || applyDate || approval || activeFilterCount > 0)
  const handleReset = () => {
    setKeyword(''); setApplyDate(''); setApproval('')
    setAdvanced({ groupName: '', platform: '', videoType: '', applicant: '' })
    setFieldKey('customerName')
  }

  return (
    <>
      <div className="px-3 pt-3 relative">
        <div className="card">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
            <input type="date" value={applyDate} onChange={e => setApplyDate(e.target.value)}
              className="bg-ink-50 rounded-full h-9 px-4 text-[12px] text-ink-700 focus:outline-none"/>
            <ChipSelect value={approval} onChange={setApproval} placeholder="审批状态" options={APPROVAL_OPTIONS}/>
            <button onClick={() => setFilterOpen(true)}
              className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 flex items-center justify-between">
        <span className="text-[11px] text-ink-500">共 {filteredData.length} 条</span>
        <button onClick={() => showToast('已发起导出', 'success')}
          className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 4l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      <div className="px-3 pt-2 space-y-2">
        {filteredData.map((item, i) => (
          <MaterialPurchaseCard key={item.id || i} item={item}
            onAction={(a) => {
              if (a === '详情') nav(`/policy/material/detail/${item.id}`)
              else if (a === '撤销') { setRevokeItem(item); setRevokeOpen(true) }
              else if (a === '重新发起') nav('/policy/material/create', { state: { prefill: item } })
            }}/>
        ))}
      </div>

      <div className="px-3 pt-4 pb-2 flex items-center justify-center gap-2 text-[12px] text-ink-700">
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium">1</button>
        <span className="text-ink-400 px-1">...</span>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">{totalPages}</button>
        <button className="w-8 h-8 rounded-full bg-white border border-ink-200 flex items-center justify-center tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className={`px-3 ${hasAnyFilter ? 'pb-24' : 'pb-3'} flex items-center justify-center gap-2 text-[11px] text-ink-500`}>
        <span>{PAGE_SIZE}条/页</span><span className="text-ink-300">|</span><span>共 {total} 条</span>
      </div>

      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => {}} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">查 询</button>
        </div>
      )}

      {fieldDrawerOpen && (
        <FieldDrawer fields={FIELD_OPTIONS} currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}/>
      )}

      {filterOpen && (
        <MaterialAdvancedFilter values={advanced} setValues={setAdvanced}
          data={data}
          onClose={() => setFilterOpen(false)}
          onReset={() => setAdvanced({ groupName: '', platform: '', videoType: '', applicant: '' })}/>
      )}

      {revokeOpen && revokeItem && (
        <RevokeDialog
          onCancel={() => { setRevokeOpen(false); setRevokeItem(null) }}
          onConfirm={() => { showToast('已撤销', 'success'); setRevokeOpen(false); setRevokeItem(null) }}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type}/>}
    </>
  )
}

function MaterialPurchaseCard({ item, onAction }) {
  const canRestart = item.approval === '已撤销' || item.approval === '已驳回'
  const videoTypeText = Array.isArray(item.videoTypes) ? item.videoTypes.join(' / ') : (item.videoType || '--')
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{item.customerName || '--'}</div>
          <div className="text-[11px] text-ink-400 mt-0.5">审批单号：{item.code || item.id} · 集团：{item.groupName || '--'}</div>
        </div>
        <Tag text={item.approval} type={colorMap[item.approval] || 'gray'}/>
      </div>

      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        <GroupField field={{ label: '行业' }} value={item.industry}/>
        <GroupField field={{ label: '媒体' }} value={item.platform}/>
        <GroupField field={{ label: '视频类型' }} value={videoTypeText}/>
        <GroupField field={{ label: '申请人' }} value={item.applicant}/>
        <GroupField field={{ label: '申请日期' }} value={item.applyDate}/>
        <GroupField field={{ label: '客户总预算' }} value={'¥ ' + Number(item.budget || 0).toLocaleString()}/>
        <GroupField field={{ label: '财务报价' }} value={item.financeQuote || '--'} double/>
      </div>

      <div className="border-t border-ink-100 px-3 py-2 text-[12px]">
        <div className="text-ink-400 mb-0.5">详细需求</div>
        <div className="text-ink-900 line-clamp-2">{item.requirement}</div>
      </div>

      <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end gap-5 text-[12px]">
        <button onClick={() => onAction('详情')} className="text-brand tap">详情</button>
        {item.approval !== '已撤销' && item.approval !== '已驳回' && (
          <button onClick={() => onAction('撤销')} className="text-brand tap">撤销</button>
        )}
        {canRestart && (
          <button onClick={() => onAction('重新发起')} className="text-ink-500 tap">重新发起</button>
        )}
      </div>
    </div>
  )
}

// 素材采买高级筛选（左侧+右侧双栏布局，与广告主管理一致）
function MaterialAdvancedFilter({ values, setValues, data, onClose, onReset }) {
  const platformOpts = Array.from(new Set(data.map(d => d.platform).filter(Boolean)))
  const videoOpts = Array.from(new Set(data.map(d => d.videoType).filter(Boolean)))

  const fields = [
    { key: 'groupName', label: '集团', kind: 'input' },
    { key: 'platform', label: '媒体', kind: 'select', options: platformOpts },
    { key: 'videoType', label: '视频类型', kind: 'select', options: videoOpts },
    { key: 'applicant', label: '申请人', kind: 'input' },
  ]

  const [active, setActive] = useState('groupName')
  const activeField = fields.find(f => f.key === active)
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))

  const handleReset = () => {
    setValues({ groupName: '', platform: '', videoType: '', applicant: '' })
    onReset && onReset()
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">请选择</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={handleReset}
            className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// ============ 404 ============
function NotFound() {
  const nav = useNavigate()
  return (
    <div className="p-12 text-center">
      <div className="text-[60px]">📋</div>
      <div className="text-[14px] text-ink-700 mt-3">未找到页面</div>
      <button onClick={() => nav('/')} className="mt-4 px-6 h-9 bg-brand text-white rounded-full text-[13px]">返回首页</button>
    </div>
  )
}

// ============ 部门 KPI 报表（PC 端"部门 KPI 报表 - 投放消耗"重设计）============
// 信息架构：
//   1. 顶部 Sticky 筛选条：销售部门 chip（多选）+ 媒体平台 chip（高亮）+ 汇总日期/维度
//   2. KPI 概览：5 卡（1 大 + 4 小），重点突出时间进度 / 完成率
//   3. 经营数据 section：汇总 + 每个选中的销售部门（每个 section 内展示全部 9 个媒体）
//      卡片：摘要（媒体名 + 完成率进度条） + 折叠明细（9 项指标）
// 设计原则：纵向流 / 触摸目标 ≥44px / 重要信息优先 / 渐进展示
function DeptKpiReportSection() {
  // 默认空数组 = "全部"模式（视觉上"全部"高亮，但不勾选具体部门）
  const ALL_DEPT_IDS = deptListOptions.map(d => d.id)
  const [selectedDepts, setSelectedDepts] = useState([]) // [] = 全部
  const [highlightMedia, setHighlightMedia] = useState(null) // null=全部
  const [year, setYear] = useState('2026')
  const [quarter, setQuarter] = useState('Q3')
  const [month, setMonth] = useState('08')
  const [dim, setDim] = useState('年度')
  const overview = deptKpiOverviewData

  const isAllDepts = selectedDepts.length === 0

  const toggleDept = (id) => {
    if (id === 'all') {
      setSelectedDepts([]) // 点"全部" → 清空，回到全部模式
      return
    }
    setSelectedDepts(prev => {
      // 全部模式 → 点具体 = 仅选该 1 个
      if (prev.length === 0) return [id]
      // 切换
      if (prev.includes(id)) {
        const next = prev.filter(x => x !== id)
        return next // 允许空数组（回到全部模式）
      }
      return [...prev, id]
    })
  }

  const toggleMedia = (id) => {
    setHighlightMedia(prev => (prev === id ? null : id))
  }

  const datePickerKey = `${dim}|${year}|${quarter}|${month}`

  // 选中的部门数据列表（去掉 'all'）
  const activeDepts = isAllDepts
    ? deptListOptions.filter(d => d.id !== 'all')
    : selectedDepts.map(id => deptListOptions.find(d => d.id === id)).filter(Boolean)

  return (
    <div className="bg-ink-50 pb-4 min-h-full" key={datePickerKey}>
      {/* ============ 顶部 Sticky 筛选条 ============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        {/* 销售部门（多选 chip）*/}
        <DeptChipRow
          label="销售部门"
          multi
          options={deptListOptions}
          selected={selectedDepts}
          allIds={ALL_DEPT_IDS}
          onToggle={toggleDept}
        />
        {/* 媒体平台（点选高亮 chip）*/}
        <DeptChipRow
          label="媒体平台"
          options={[{ id: 'all', label: '全部' }, ...mediaListOptions]}
          value={highlightMedia}
          onChange={(v) => setHighlightMedia(v === 'all' ? null : v)}
          showAll
        />
        {/* 汇总日期 + 维度 */}
        <div className="px-3 py-2 flex items-center gap-2 text-[12px] text-ink-600 border-t border-ink-100 flex-wrap">
          <span className="shrink-0 text-ink-500">汇总日期</span>
          <Picker value={year} onChange={setYear} options={['2024', '2025', '2026', '2027']}/>
          {dim === '季度' && (
            <>
              <span className="text-ink-400 mx-0.5">·</span>
              <Picker value={quarter} onChange={setQuarter} options={['Q1', 'Q2', 'Q3', 'Q4']}/>
            </>
          )}
          {dim === '月度' && (
            <>
              <span className="text-ink-400 mx-0.5">·</span>
              <Picker value={month} onChange={setMonth} options={['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => `${m} 月`)}/>
            </>
          )}
          <span className="text-ink-400 mx-0.5">·</span>
          <Picker value={dim} onChange={setDim} options={['年度', '季度', '月度']}/>
        </div>
      </div>

      {/* ============ KPI 概览（1 大 + 4 小）============ */}
      <div className="mx-3 mt-3">
        {/* 主卡：年计划目标 */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-ink-100">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-sm"/>
              <span className="text-[14px] font-medium text-ink-900">年{getDimSuffix(dim)}计划目标</span>
            </div>
            <span className="text-[11px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              年度目标总额
            </span>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-orange-500 leading-none">{overview.yearTarget.value}</span>
              <span className="text-[14px] text-ink-500">{overview.yearTarget.unit}</span>
            </div>
            <p className="text-[11px] text-ink-500 mt-3">{dim}目标总额</p>
          </div>
        </div>
        {/* 4 张小卡：2 列网格 */}
        <div className="grid grid-cols-2 gap-px bg-ink-100 mt-px card overflow-hidden">
          <KpiSmall
            label={`年${getDimSuffix(dim)}时间进度`}
            value={overview.timeProgress.value}
            unit={overview.timeProgress.unit}
            color="red"
            sub={`${dim}时间消耗比例`}
            progress={overview.timeProgress.progress}
            progressColor={overview.timeProgress.progressColor}
          />
          <KpiSmall
            label={`年${getDimSuffix(dim)}完成率`}
            value={overview.completion.value}
            unit={overview.completion.unit}
            color="green"
            sub="目标达成进度"
            progress={overview.completion.progress}
            progressColor={overview.completion.progressColor}
          />
          <KpiSmall
            label={`年${getDimSuffix(dim)}剩余目标`}
            value={overview.remainTarget.value}
            unit={overview.remainTarget.unit}
            color="cyan"
            sub="待完成目标值"
          />
          <KpiSmall
            label={`年${getDimSuffix(dim)}剩余日耗`}
            value={overview.remainDayCost.value}
            unit={overview.remainDayCost.unit}
            color="blue"
            sub="按当前节奏需完成"
          />
        </div>
      </div>

      {/* ============ 经营数据明细 ============ */}
      {/* 汇总 section（受媒体 chip 筛选）*/}
      <DataSection
        title="汇总统计"
        subtitle={isAllDepts ? '全部销售部门' : `已选 ${selectedDepts.length} 个部门`}
        data={deptKpiData.all}
        highlightMedia={highlightMedia}
        onMediaClick={toggleMedia}
      />
      {/* 各部门 section（受媒体 chip 筛选）*/}
      {activeDepts.map(d => (
        <DataSection
          key={d.id}
          title={d.label}
          subtitle="选中部门数据"
          data={deptKpiData[d.id] || deptKpiData.all}
          highlightMedia={highlightMedia}
          onMediaClick={toggleMedia}
          highlight
        />
      ))}

      {/* 导出按钮 */}
      <div className="mx-3 mt-3 flex justify-end">
        <button className="h-7 px-3 bg-brand text-white rounded text-[12px] font-medium flex items-center gap-1 tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>
    </div>
  )
}

// 维度后缀：年度/季度/月度 → "" / "季度" / "月"
function getDimSuffix(dim) {
  if (dim === '季度') return '季度'
  if (dim === '月度') return '月'
  return ''
}

function DeptChipRow({ label, options, value, onChange, multi, selected, allIds, onToggle, showAll }) {
  return (
    <div className="px-3 py-2 flex items-center gap-2 border-b border-ink-100 last:border-b-0">
      <span className="shrink-0 text-[12px] text-ink-500 w-14">{label}</span>
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2">
          {options.map(o => {
            // 多选模式：以 selected 数组判断
            let active
            if (multi) {
              // "全部"chip 在空数组（全部模式）或全选时高亮
              if (o.id === 'all') active = selected.length === 0 || selected.length === allIds.length
              else active = selected.includes(o.id)
            } else {
              // 单选模式：'all' chip 在 value 为 null 时高亮
              if (o.id === 'all') active = value === null || value === 'all'
              else active = o.id === value
            }
            const handleClick = multi ? () => onToggle(o.id) : () => onChange(o.id)
            return (
              <button
                key={o.id}
                onClick={handleClick}
                className={`shrink-0 px-3 h-7 rounded-full text-[12px] transition tap ${
                  active
                    ? 'bg-brand text-white border border-brand'
                    : 'bg-white text-ink-700 border border-ink-200 active:bg-ink-50'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Picker({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white border border-ink-200 rounded px-2 h-7 pr-6 text-[12px] text-ink-900 focus:outline-none focus:border-brand"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

const KPI_COLOR_MAP = {
  orange: { text: '#FF9A3C', bg: '#FFF3E5' },
  red:    { text: '#FF5A5A', bg: '#FFE9E9' },
  green:  { text: '#34A853', bg: '#E8F8EA' },
  cyan:   { text: '#00B8D9', bg: '#E0F7FA' },
  blue:   { text: '#2D7FF9', bg: '#EBF3FF' },
}

function KpiSmall({ label, value, unit, color, sub, progress, progressColor }) {
  const c = KPI_COLOR_MAP[color] || KPI_COLOR_MAP.blue
  return (
    <div className="bg-white p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-1 h-3 rounded-sm" style={{ background: c.text }}/>
        <span className="text-[12px] text-ink-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[20px] font-bold leading-none" style={{ color: c.text }}>{value}</span>
        <span className="text-[11px] text-ink-500">{unit}</span>
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.max(progress, 0.5)}%`, background: progressColor || c.text }}
          />
        </div>
      )}
      <p className="text-[10px] text-ink-400 mt-1.5">{sub}</p>
    </div>
  )
}

function DataSection({ title, subtitle, data, highlightMedia, onMediaClick, highlight, isAggregate, summaryOnly }) {
  // 媒体平台过滤：全部（null）时展示全部 9 媒体；选中具体媒体时只展示该媒体
  const allRows = data.mediaRows
  const rows = highlightMedia
    ? allRows.filter(r => r.mediaId === highlightMedia)
    : allRows
  // 当选中具体媒体时，汇总总计也按该媒体的数据展示
  const summarySource = highlightMedia
    ? (rows[0] || allRows[0])
    : { kpi: {
        kpiTarget: data.kpiTarget,
        totalCost: data.totalCost,
        monthAvg: data.monthAvg,
        dayAvg: data.dayAvg,
        timeProgress: data.timeProgress,
        completionRate: data.completionRate,
        remainTarget: data.remainTarget,
        remainDayCost: data.remainDayCost,
        weight: data.weight,
        ringRatio: data.ringRatio,
      } }
  // 标签始终保持"汇总总计"（不随筛选变化）
  const summary = {
    mediaId: '__summary__',
    label: '汇总总计',
    kpi: summarySource.kpi,
  }
  return (
    <div className="mx-3 mt-3">
      <div className={`flex items-center justify-between px-4 py-2.5 ${highlight ? 'bg-brand text-white rounded-t-card' : 'bg-white rounded-t-card border-b border-ink-100'}`}>
        <span className={`text-[14px] font-medium ${highlight ? 'text-white' : 'text-ink-900'}`}>
          <span className={`inline-block w-1 h-3.5 align-middle mr-2 rounded-sm ${highlight ? 'bg-white' : 'bg-brand'}`}/>
          {title}
        </span>
        <span className={`text-[11px] ${highlight ? 'text-white opacity-90' : 'text-ink-500'}`}>{subtitle}</span>
      </div>
      <div className="space-y-2 -mt-px">
        <MediaCard
          item={summary}
          isSummary
          highlight={highlightMedia === '__summary__'}
          onMediaClick={onMediaClick}
        />
        {!summaryOnly && rows.map(r => (
          <MediaCard
            key={r.mediaId}
            item={{ mediaId: r.mediaId, label: mediaListOptions.find(m => m.id === r.mediaId)?.label || r.mediaId, kpi: r.kpi }}
            highlight={highlightMedia === r.mediaId}
            onMediaClick={onMediaClick}
          />
        ))}
      </div>
    </div>
  )
}

function MediaCard({ item, isSummary, highlight, onMediaClick }) {
  const [open, setOpen] = useState(false)
  const k = item.kpi
  const completion = k.completionRate
  const completionColor =
    completion >= 80 ? '#34A853' :
    completion >= 50 ? '#2D7FF9' :
    completion >= 30 ? '#FF9A3C' : '#FF5A5A'
  const borderClass = highlight
    ? 'border-2 border-brand shadow-md'
    : isSummary ? 'border border-brand' : ''
  return (
    <div className={`card overflow-hidden ${borderClass}`}>
      <button onClick={() => setOpen(!open)} className="w-full px-3 py-3 flex items-center justify-between gap-2 tap">
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[14px] font-medium ${isSummary ? 'text-brand' : 'text-ink-900'}`}>
              {item.label}
            </span>
            {isSummary && (
              <span className="text-[10px] text-white bg-brand px-1.5 py-0.5 rounded">汇总</span>
            )}
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(completion, 100)}%`, background: completionColor }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <div className="text-[15px] font-semibold" style={{ color: completionColor }}>
              {completion.toFixed(2)}<span className="text-[11px] ml-0.5">%</span>
            </div>
            <div className="text-[10px] text-ink-400">完成率</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      {open && (
        <div className="border-t border-ink-100 px-3 py-2 bg-ink-50/50">
          <DetailRow label="KPI 目标" value={`${formatKpiNum(k.kpiTarget)} 万`}/>
          <DetailRow label="总消耗" value={`${formatKpiNum(k.totalCost)} 万`}/>
          <DetailRow label="平均月消耗" value={`${formatKpiNum(k.monthAvg)} 万`}/>
          <DetailRow label="平均日消耗" value={`${formatKpiNum(k.dayAvg)} 万`}/>
          <DetailRow label="时间进度" value={`${k.timeProgress}%`}/>
          <DetailRow label="剩余目标" value={`${formatKpiNum(k.remainTarget)} 万`}/>
          <DetailRow label="剩余日耗" value={`${formatKpiNum(k.remainDayCost)} 万/日`}/>
          <DetailRow label="权重%" value={`${k.weight}%`}/>
          <DetailRow label="环比%" value={k.ringRatio} last/>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, last }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${last ? '' : 'border-b border-dashed border-ink-100'}`}>
      <span className="text-[12px] text-ink-500">{label}</span>
      <span className="text-[12px] text-ink-900 font-medium tabular-nums">{value}</span>
    </div>
  )
}

// 字段列（label + value，label 加粗）
function FieldCol({ label, value, valueColor }) {
  return (
    <div>
      <div className="text-[11px] text-brand font-medium">{label}</div>
      <div className="text-[12px] text-ink-900 font-semibold tabular-nums mt-0.5" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
    </div>
  )
}

function formatKpiNum(n) {
  if (n === '--') return '--'
  if (typeof n !== 'number') return n
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

// ============ 部门 KPI 目标设置（PC 端"部门 KPI 目标设置"重设计）============
// 信息架构：
//   1. 顶部 sticky：设置日期（月份 picker）+ 公司总 KPI + 当前部门总 KPI
//   2. 部门 chip 行：单选切换
//   3. 每部门一张卡：内含 9 媒体 × KPI 输入（2 列网格）
//   4. 底部 sticky：重置 + 提交
// 设计原则：横表 → 分部门卡片；输入区域紧凑；总目标与明细分开
function DeptKpiSettingSection() {
  const ALL_DEPT_IDS = deptListOptions.map(d => d.id).filter(id => id !== 'all')
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('08')
  const [activeDept, setActiveDept] = useState(ALL_DEPT_IDS[0]) // 默认深圳分公司
  // 全局数据
  const [companyKpi, setCompanyKpi] = useState(deptKpiSettingData.companyTotal[`${year}-${month}`] || 0)
  // 各部门 KPI（部门 id → { deptTotal, media: { mediaId: value } }）
  const [deptKpis, setDeptKpis] = useState(() => {
    const init = {}
    ALL_DEPT_IDS.forEach(deptId => {
      const medias = deptKpiSettingData.byDeptMonthMedia(deptId, `${year}-${month}`)
      init[deptId] = {
        deptTotal: Object.values(medias).reduce((s, v) => s + v, 0),
        media: medias,
      }
    })
    return init
  })
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const monthKey = `${year}-${month}`
  const currentDeptData = deptKpis[activeDept]
  const mediaSum = currentDeptData ? Object.values(currentDeptData.media).reduce((s, v) => s + (Number(v) || 0), 0) : 0
  const sumDiff = mediaSum - (Number(currentDeptData?.deptTotal) || 0)

  // 更新单媒体 KPI
  const setMediaKpi = (mediaId, val) => {
    setDeptKpis(prev => ({
      ...prev,
      [activeDept]: {
        ...prev[activeDept],
        media: { ...prev[activeDept].media, [mediaId]: val },
      },
    }))
  }

  // 更新部门总 KPI（覆盖）
  const setDeptTotal = (val) => {
    setDeptKpis(prev => ({
      ...prev,
      [activeDept]: { ...prev[activeDept], deptTotal: val },
    }))
  }

  // 重置当前部门
  const handleReset = () => {
    const medias = deptKpiSettingData.byDeptMonthMedia(activeDept, monthKey)
    setDeptKpis(prev => ({
      ...prev,
      [activeDept]: {
        deptTotal: Object.values(medias).reduce((s, v) => s + v, 0),
        media: medias,
      },
    }))
    showToast('已重置', 'success')
  }

  // 提交
  const handleSubmit = () => {
    showToast('提交成功，等待审批', 'success')
  }

  return (
    <div className="bg-ink-50 pb-24 min-h-full">
      {/* ============ 顶部 Sticky：日期 + 总 KPI ============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] text-ink-500">设置日期</span>
            <DeptKpiSettingPicker value={year} onChange={setYear} options={['2024', '2025', '2026', '2027']}/>
            <span className="text-ink-400 mx-0.5">年</span>
            <DeptKpiSettingPicker
              value={month}
              onChange={setMonth}
              options={deptKpiMonthsOptions.map(m => ({ value: m, label: `${parseInt(m)}月` }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[11px] text-ink-500 mb-1">公司总 KPI 目标</div>
              <div className="h-10 px-3 bg-ink-50 border border-ink-200 rounded flex items-center justify-between">
                <span className="text-[14px] text-ink-900 font-medium">{formatKpiNum(companyKpi)}</span>
                <span className="text-[12px] text-ink-500">元</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-ink-500 mb-1">
                {deptListOptions.find(d => d.id === activeDept)?.label || ''} 总 KPI
              </div>
              <div className="h-10 px-3 bg-ink-50 border border-ink-200 rounded flex items-center justify-between">
                <span className="text-[14px] text-ink-900 font-medium">{formatKpiNum(currentDeptData?.deptTotal ?? 0)}</span>
                <span className="text-[12px] text-ink-500">元</span>
              </div>
            </div>
          </div>
        </div>
        {/* 部门 chip 行 */}
        <div className="px-3 pb-2 flex items-center gap-2 border-t border-ink-100 pt-2">
          <span className="shrink-0 text-[12px] text-ink-500">部门</span>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              {ALL_DEPT_IDS.map(id => {
                const active = id === activeDept
                return (
                  <button
                    key={id}
                    onClick={() => setActiveDept(id)}
                    className={`shrink-0 px-3 h-7 rounded-full text-[12px] transition tap ${
                      active
                        ? 'bg-brand text-white border border-brand'
                        : 'bg-white text-ink-700 border border-ink-200 active:bg-ink-50'
                    }`}
                  >
                    {deptListOptions.find(d => d.id === id)?.label || id}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============ 当前部门 × 9 媒体 KPI 输入 ============ */}
      <div className="mx-3 mt-3">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100">
            <span className="text-[14px] font-medium text-ink-900">
              <span className="inline-block w-1 h-3.5 align-middle mr-2 rounded-sm bg-brand"/>
              {deptListOptions.find(d => d.id === activeDept)?.label || ''} · 媒体 KPI 明细
            </span>
            <span className="text-[11px] text-ink-500">
              媒体合计 <span className={sumDiff !== 0 ? 'text-danger font-medium' : 'text-success font-medium'}>{formatKpiNum(mediaSum)}</span> 元
            </span>
          </div>
          <div className="px-3 py-2 grid grid-cols-2 gap-x-3">
            {mediaListOptions.map((m, idx) => {
              const val = currentDeptData?.media?.[m.id] ?? 0
              const isLast = idx === mediaListOptions.length - 1
              return (
                <div key={m.id} className={`py-2 ${isLast ? '' : 'border-b border-ink-100'} ${idx === mediaListOptions.length - 1 ? 'col-span-2' : ''}`}>
                  <div className="text-[12px] text-ink-700 mb-1.5">{m.label}</div>
                  <div className="relative">
                    <input
                      type="number"
                      value={val}
                      onChange={e => setMediaKpi(m.id, e.target.value)}
                      className="form-input pr-8 h-9"
                      placeholder="0"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-ink-500 pointer-events-none">元</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 校验提示 */}
        {sumDiff !== 0 && (
          <div className="mt-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded text-[12px] text-orange-700">
            媒体合计与部门总 KPI 相差 {sumDiff > 0 ? '+' : ''}{formatKpiNum(sumDiff)} 元，请确认
          </div>
        )}
      </div>

      {/* 底部 sticky 按钮 */}
      <div className="sticky bottom-0 z-30 px-3 py-3 bg-white border-t border-ink-100 flex gap-3">
        <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
        <button onClick={handleSubmit} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
      </div>

      {toast && <DeptKpiSettingToast type={toast.type} message={toast.msg}/>}
    </div>
  )
}

function DeptKpiSettingPicker({ value, onChange, options }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-white border border-ink-200 rounded px-2 h-7 pr-6 text-[12px] text-ink-900 focus:outline-none focus:border-brand"
      >
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function DeptKpiSettingToast({ type = 'success', message }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5">
        <span className={`w-5 h-5 rounded-full ${type === 'success' ? 'bg-success' : 'bg-red-500'} flex items-center justify-center shrink-0`}>
          {type === 'success' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
          )}
        </span>
        <span className="text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )
}

// ============ 员工 KPI 目标设定（PC 端"人员 KPI 目标设定"重设计）============
// 信息架构：
//   1. 顶部 sticky：设置日期（月份 picker）+ 销售部门（部门 picker）
//   2. 员工列表：每个员工一张卡，卡内 9 媒体 × KPI 输入（2 列网格）
//   3. 底部 sticky：重置 + 提交
// 设计原则：PC 横表（员工 × 媒体）→ App 员工卡（每员工一卡 + 9 媒体内嵌）
function StaffKpiSettingSection() {
  const ALL_DEPT_IDS = deptListOptions.map(d => d.id).filter(id => id !== 'all')
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('08')
  const [activeDept, setActiveDept] = useState(ALL_DEPT_IDS[0])
  // 员工 × 月份 × 媒体 KPI 数据 { empId: { media: { mediaId: value } } }
  const [empKpis, setEmpKpis] = useState(() => {
    const init = {}
    staffList.forEach(emp => {
      init[emp.id] = { media: staffKpiSettingData.byEmpMonthMedia(emp.id, `${year}-${month}`) }
    })
    return init
  })
  const [toast, setToast] = useState(null)
  const showToast = (msg) => {
    setToast({ msg })
    setTimeout(() => setToast(null), 1800)
  }

  const monthKey = `${year}-${month}`
  const filteredStaff = staffList.filter(s => s.deptId === activeDept)
  const activeDeptLabel = deptListOptions.find(d => d.id === activeDept)?.label || ''

  const setMediaKpi = (empId, mediaId, val) => {
    setEmpKpis(prev => ({
      ...prev,
      [empId]: { media: { ...prev[empId].media, [mediaId]: val } },
    }))
  }

  const handleReset = () => {
    const init = {}
    staffList.forEach(emp => {
      init[emp.id] = { media: staffKpiSettingData.byEmpMonthMedia(emp.id, monthKey) }
    })
    setEmpKpis(init)
    showToast('已重置')
  }

  const handleSubmit = () => {
    showToast(`提交成功，共 ${filteredStaff.length} 名员工`)
  }

  return (
    <div className="bg-ink-50 pb-24 min-h-full">
      {/* ============ 顶部 Sticky：日期 + 部门 ============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        <div className="px-3 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="shrink-0 text-[12px] text-ink-500">设置日期</span>
          <DeptKpiSettingPicker value={year} onChange={setYear} options={['2024', '2025', '2026', '2027']}/>
          <span className="text-ink-400 mx-0.5">年</span>
          <DeptKpiSettingPicker
            value={month}
            onChange={setMonth}
            options={deptKpiMonthsOptions.map(m => ({ value: m, label: `${parseInt(m)}月` }))}
          />
        </div>
        <div className="px-3 pb-2 flex items-center gap-2 border-t border-ink-100 pt-2">
          <span className="shrink-0 text-[12px] text-ink-500">部门</span>
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              {ALL_DEPT_IDS.map(id => {
                const active = id === activeDept
                const count = staffList.filter(s => s.deptId === id).length
                return (
                  <button
                    key={id}
                    onClick={() => setActiveDept(id)}
                    className={`shrink-0 px-3 h-7 rounded-full text-[12px] transition tap ${
                      active
                        ? 'bg-brand text-white border border-brand'
                        : 'bg-white text-ink-700 border border-ink-200 active:bg-ink-50'
                    }`}
                  >
                    {deptListOptions.find(d => d.id === id)?.label || id} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="px-3 pb-2 flex items-center gap-2 text-[11px] text-ink-500">
          <span>单位：元</span>
          <span className="text-ink-300">·</span>
          <span>{activeDeptLabel} 共 {filteredStaff.length} 人</span>
        </div>
      </div>

      {/* ============ 员工卡片列表 ============ */}
      <div className="px-3 py-3 space-y-3">
        {filteredStaff.length === 0 && (
          <div className="text-center text-ink-400 text-[13px] py-8">该部门暂无员工</div>
        )}
        {filteredStaff.map(emp => {
          const data = empKpis[emp.id]
          const mediaSum = data ? Object.values(data.media).reduce((s, v) => s + (Number(v) || 0), 0) : 0
          return (
            <div key={emp.id} className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1 h-3.5 rounded-sm bg-brand"/>
                  <span className="text-[14px] font-medium text-ink-900">{emp.name}</span>
                  <span className="text-[11px] text-ink-500 px-1.5 py-0.5 bg-ink-50 rounded">{activeDeptLabel}</span>
                </div>
                <span className="text-[11px] text-ink-500">
                  合计 <span className="text-brand font-medium">{formatKpiNum(mediaSum)}</span> 元
                </span>
              </div>
              <div className="px-3 py-2 grid grid-cols-2 gap-x-3">
                {mediaListOptions.map(m => {
                  const val = data?.media?.[m.id] ?? 0
                  return (
                    <div key={m.id} className="py-1.5 border-b border-ink-100 last:border-b-0">
                      <div className="text-[11px] text-ink-700 mb-1 truncate">{m.label}</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={val}
                          onChange={e => setMediaKpi(emp.id, m.id, e.target.value)}
                          className="form-input pr-7 h-8 text-[13px]"
                          placeholder="0"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-500 pointer-events-none">元</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ============ 底部 sticky 按钮 ============ */}
      <div className="sticky bottom-0 z-30 px-3 py-3 bg-white border-t border-ink-100 flex gap-3">
        <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
        <button onClick={handleSubmit} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
      </div>

      {toast && <DeptKpiSettingToast type="success" message={toast.msg}/>}
    </div>
  )
}

// ============ 员工 KPI 报表（PC 端"员工 KPI 报表"重设计）============
// 信息架构：
//   1. 顶部 Sticky 筛选：销售部门 chip（多选）+ 媒体平台 chip（单选）+ 汇总日期 + 姓名输入
//   2. KPI 概览：年计划目标 + 4 张小卡（时间进度 / 完成率 / 剩余目标 / 剩余日耗）
//   3. 汇总统计 section（受媒体 chip 筛选）
//   4. 员工 section（按部门 + 姓名过滤，每员工一张卡）
//   5. 底部导出按钮
function StaffKpiReportSection() {
  const ALL_DEPT_IDS = deptListOptions.map(d => d.id).filter(id => id !== 'all')
  const [activeDept, setActiveDept] = useState(ALL_DEPT_IDS[0])
  const [highlightMedia, setHighlightMedia] = useState(null) // null=全部
  const [year, setYear] = useState('2026')
  const [quarter, setQuarter] = useState('Q3')
  const [month, setMonth] = useState('08')
  const [dim, setDim] = useState('年度')
  const [nameQuery, setNameQuery] = useState('')

  const toggleMedia = (id) => setHighlightMedia(prev => (prev === id ? null : id))

  // 按 部门 + 姓名 过滤员工
  const filteredStaff = staffList.filter(s => {
    if (s.deptId !== activeDept) return false
    if (nameQuery && !s.name.includes(nameQuery)) return false
    return true
  })

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* ============ 顶部 Sticky 筛选 ============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        <DeptChipRow
          label="销售部门"
          options={deptListOptions.filter(d => d.id !== 'all')}
          value={activeDept}
          onChange={setActiveDept}
        />
        <DeptChipRow
          label="媒体平台"
          options={[{ id: 'all', label: '全部' }, ...mediaListOptions]}
          value={highlightMedia}
          onChange={(v) => setHighlightMedia(v === 'all' ? null : v)}
          showAll
        />
        <div className="px-3 py-2 flex items-center gap-2 text-[12px] text-ink-600 border-t border-ink-100 flex-wrap">
          <span className="shrink-0 text-ink-500">汇总日期</span>
          <Picker value={year} onChange={setYear} options={['2024', '2025', '2026', '2027']}/>
          {dim === '季度' && (
            <>
              <span className="text-ink-400 mx-0.5">·</span>
              <Picker value={quarter} onChange={setQuarter} options={['Q1', 'Q2', 'Q3', 'Q4']}/>
            </>
          )}
          {dim === '月度' && (
            <>
              <span className="text-ink-400 mx-0.5">·</span>
              <Picker value={month} onChange={setMonth} options={['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => `${m} 月`)}/>
            </>
          )}
          <span className="text-ink-400 mx-0.5">·</span>
          <Picker value={dim} onChange={setDim} options={['年度', '季度', '月度']}/>
          <div className="relative ml-1">
            <input
              type="text"
              value={nameQuery}
              onChange={e => setNameQuery(e.target.value)}
              placeholder="姓名"
              className="form-input h-7 pl-7 text-[12px] w-24"
            />
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
              <path d="M21 21l-4.3-4.3" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ============ 汇总统计 section（每媒体 6 字段风格）============ */}
      <StaffAggregateSection
        subtitle={highlightMedia ? `已选 ${mediaListOptions.find(m => m.id === highlightMedia)?.label || ''}` : '全部媒体'}
        data={staffKpiData.all}
        highlightMedia={highlightMedia}
        onMediaClick={toggleMedia}
      />

      {/* 员工 section */}
      {filteredStaff.map(emp => (
        <StaffKpiDataSection
          key={emp.id}
          emp={emp}
          deptLabel={deptListOptions.find(d => d.id === emp.deptId)?.label || ''}
          data={staffKpiData.byEmp[emp.id]}
          highlightMedia={highlightMedia}
          onMediaClick={toggleMedia}
        />
      ))}

      {filteredStaff.length === 0 && (
        <div className="mx-3 mt-3 text-center text-ink-400 text-[13px] py-8 card">无匹配员工</div>
      )}

      <div className="mx-3 mt-3 flex justify-end">
        <button className="h-7 px-3 bg-brand text-white rounded text-[12px] font-medium flex items-center gap-1 tap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>
    </div>
  )
}

// 汇总 section（单一可折叠卡片：折叠显示汇总总计 3 字段，展开显示 9 媒体 6 字段）
function StaffAggregateSection({ subtitle, data, highlightMedia }) {
  const [open, setOpen] = useState(false)
  const allRows = data.mediaRows
  const rows = highlightMedia ? allRows.filter(r => r.mediaId === highlightMedia) : allRows
  // 汇总总计数据（选中媒体时用该媒体数据，否则用全公司）
  const aggSource = highlightMedia
    ? (rows[0] || allRows[0])
    : {
        kpiTarget: data.kpiTarget,
        totalCost: data.totalCost,
        completionRate: data.completionRate,
        timeProgress: data.timeProgress,
        remainDayCost: data.remainDayCost,
        weight: data.weight,
      }
  const completion = aggSource.completionRate
  const completionColor =
    completion >= 80 ? '#34A853' :
    completion >= 50 ? '#2D7FF9' :
    completion >= 30 ? '#FF9A3C' : '#FF5A5A'
  return (
    <div className="mx-3 mt-3">
      <div className="card overflow-hidden border border-brand">
        <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 tap">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1 h-3.5 bg-brand rounded-sm shrink-0"/>
              <span className="text-[14px] font-medium text-brand truncate">汇总统计</span>
              <span className="text-[10px] text-white bg-brand px-1.5 py-0.5 rounded shrink-0">汇总</span>
              <span className="text-[11px] text-ink-500 truncate">{subtitle}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-x-2">
            <FieldCol label="KPI目标" value={`${formatKpiNum(aggSource.kpiTarget)} 万`}/>
            <FieldCol label="总消耗" value={`${formatKpiNum(aggSource.totalCost)} 万`}/>
            <FieldCol label="完成率" value={`${completion.toFixed(2)}%`} valueColor={completionColor}/>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full" style={{ width: `${Math.min(completion, 100)}%`, background: completionColor }}/>
          </div>
        </button>
        {open && (
          <div className="border-t border-ink-100 px-3 py-2 bg-ink-50/50 space-y-2">
            {rows.map(r => {
              const mc = r.kpi.completionRate
              const mcColor = mc >= 80 ? '#34A853' : mc >= 50 ? '#2D7FF9' : mc >= 30 ? '#FF9A3C' : '#FF5A5A'
              return (
                <div key={r.mediaId} className="bg-white rounded p-2 border border-ink-100">
                  <div className="text-[12px] font-medium text-ink-900 mb-1.5">
                    {mediaListOptions.find(m => m.id === r.mediaId)?.label || r.mediaId}
                    <span className="text-[10px] text-ink-500 ml-2">完成率 <span style={{ color: mcColor }} className="font-semibold">{mc.toFixed(2)}%</span></span>
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                    <FieldCol label="KPI目标" value={`${formatKpiNum(r.kpi.kpiTarget)} 万`}/>
                    <FieldCol label="总消耗" value={`${formatKpiNum(r.kpi.totalCost)} 万`}/>
                    <FieldCol label="完成率" value={`${mc.toFixed(2)}%`} valueColor={mcColor}/>
                    <FieldCol label="权重%" value={`${r.kpi.weight}%`}/>
                    <FieldCol label="剩余日耗" value={`${formatKpiNum(r.kpi.remainDayCost)} 万/日`}/>
                    <FieldCol label="时间进度" value={`${r.kpi.timeProgress}%`}/>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// 员工数据 section（一个员工一张卡）
function StaffKpiDataSection({ emp, deptLabel, data, highlightMedia, onMediaClick }) {
  const [open, setOpen] = useState(false)
  if (!data) return null
  const allRows = data.mediaRows
  const rows = highlightMedia ? allRows.filter(r => r.mediaId === highlightMedia) : allRows
  const completion = data.completionRate
  const completionColor =
    completion >= 80 ? '#34A853' :
    completion >= 50 ? '#2D7FF9' :
    completion >= 30 ? '#FF9A3C' : '#FF5A5A'
  return (
    <div className="mx-3 mt-3">
      <div className="card overflow-hidden">
        <button onClick={() => setOpen(!open)} className="w-full px-4 py-3 tap">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1 h-3.5 bg-brand rounded-sm shrink-0"/>
              <span className="text-[14px] font-medium text-ink-900 truncate">{emp.name}</span>
              <span className="text-[10px] text-ink-500 px-1.5 py-0.5 bg-ink-50 rounded shrink-0">{deptLabel}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-ink-400">KPI目标</div>
              <div className="text-[13px] font-semibold text-ink-900 tabular-nums">{formatKpiNum(data.kpiTarget)} <span className="text-[10px] text-ink-500 font-normal">万</span></div>
            </div>
            <div>
              <div className="text-[10px] text-ink-400">总消耗</div>
              <div className="text-[13px] font-semibold text-ink-900 tabular-nums">{formatKpiNum(data.totalCost)} <span className="text-[10px] text-ink-500 font-normal">万</span></div>
            </div>
            <div>
              <div className="text-[10px] text-ink-400">完成率</div>
              <div className="text-[13px] font-semibold tabular-nums" style={{ color: completionColor }}>{completion.toFixed(2)}<span className="text-[10px] ml-0.5">%</span></div>
            </div>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full" style={{ width: `${Math.min(completion, 100)}%`, background: completionColor }}/>
          </div>
        </button>
        {open && (
          <div className="border-t border-ink-100 px-3 py-2 bg-ink-50/50">
            <div className="text-[11px] text-ink-500 mb-1.5">{highlightMedia ? '选中媒体明细' : '媒体明细'}</div>
            <div className="space-y-2">
              {rows.map(r => {
                const mc = r.kpi.completionRate
                const mcColor = mc >= 80 ? '#34A853' : mc >= 50 ? '#2D7FF9' : mc >= 30 ? '#FF9A3C' : '#FF5A5A'
                return (
                  <div key={r.mediaId} className="bg-white rounded p-2 border border-ink-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-ink-900">{mediaListOptions.find(m => m.id === r.mediaId)?.label || r.mediaId}</span>
                      <span className="text-[10px] text-ink-500">完成率 <span style={{ color: mcColor }} className="font-semibold">{mc.toFixed(2)}%</span></span>
                    </div>
                    <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                      <FieldCol label="KPI目标" value={`${formatKpiNum(r.kpi.kpiTarget)} 万`}/>
                      <FieldCol label="总消耗" value={`${formatKpiNum(r.kpi.totalCost)} 万`}/>
                      <FieldCol label="完成率" value={`${mc.toFixed(2)}%`} valueColor={mcColor}/>
                      <FieldCol label="权重%" value={`${r.kpi.weight}%`}/>
                      <FieldCol label="剩余日耗" value={`${formatKpiNum(r.kpi.remainDayCost)} 万/日`}/>
                      <FieldCol label="时间进度" value={`${r.kpi.timeProgress}%`}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ 变更记录（PC 端变更记录表重设计）============
// 信息架构：
//   1. 顶部 Sticky 筛选：创建人 + 媒体平台 + 创建时间 + 漏斗
//   2. 卡片列表：每条变更一张卡（修改类型 chip + 媒体 + 变更说明 + 修改前后 + 创建人 + 时间）
//   3. 分页器：15 条/页 + 跳转
function ChangeLogSection() {
  const MEDIA_OPTS = ['全部', ...Array.from(new Set(changeLogData.map(d => d.media)))]
  const [operatorQuery, setOperatorQuery] = useState('') // 创建人搜索框
  const [media, setMedia] = useState('全部')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  // 筛选
  const filtered = changeLogData.filter(r => {
    if (operatorQuery && !r.operator.includes(operatorQuery)) return false
    if (media !== '全部' && r.media !== media) return false
    if (startDate && r.time < startDate) return false
    if (endDate && r.time > endDate + ' 23:59:59') return false
    return true
  })
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      {/* ============ 顶部 Sticky 筛选 ============ */}
      <div className="sticky top-12 z-20 bg-white border-b border-ink-100 shadow-sm">
        <div className="px-3 py-2 flex items-center gap-2 flex-wrap">
          {/* 创建人（搜索框） */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
            <span className="text-[12px] text-ink-500 shrink-0">创建人</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={operatorQuery}
                onChange={e => setOperatorQuery(e.target.value)}
                placeholder="请输入姓名"
                className="form-input h-7 pl-7 text-[12px]"
              />
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
                <path d="M21 21l-4.3-4.3" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          {/* 媒体平台 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-ink-500 shrink-0">媒体平台</span>
            <DeptKpiSettingPicker value={media} onChange={setMedia} options={MEDIA_OPTS}/>
          </div>
          {/* 创建时间 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-ink-500 shrink-0">创建时间</span>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="form-input h-7 px-2 text-[12px] w-32"
            />
            <span className="text-ink-400">~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="form-input h-7 px-2 text-[12px] w-32"
            />
          </div>
        </div>
      </div>

      {/* ============ 卡片列表 ============ */}
      <div className="px-3 py-3 space-y-2">
        {paged.length === 0 && (
          <div className="text-center text-ink-400 text-[13px] py-8 card">无匹配记录</div>
        )}
        {paged.map(r => (
          <div key={r.id} className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1 h-3.5 bg-brand rounded-sm shrink-0"/>
                <span className={`text-[11px] px-1.5 py-0.5 rounded shrink-0 ${r.type === '部门KPI设置' ? 'bg-blue-50 text-brand border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>{r.type}</span>
                <span className="text-[12px] text-ink-700 truncate">{r.media}</span>
                <span className="text-[11px] text-ink-400 shrink-0">{r.date}</span>
              </div>
              <span className="text-[10px] text-ink-400 shrink-0">{r.id}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[12px] text-ink-700 leading-relaxed">{r.description}】</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-500">
                <div className="flex items-center gap-1">
                  <span>原值</span>
                  <span className="text-ink-700 font-medium tabular-nums">{r.before}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-4-4l4 4-4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="flex items-center gap-1">
                  <span>新值</span>
                  <span className="text-brand font-semibold tabular-nums">{r.after}</span>
                </div>
                <span className="ml-auto">归属：{r.source}</span>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-ink-100 flex items-center justify-between text-[11px] text-ink-500 bg-ink-50/30">
              <span>创建人：<span className="text-ink-700">{r.operator}</span></span>
              <span>{r.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ============ 分页器 ============ */}
      {total > 0 && (
        <div className="mx-3 mt-3 flex items-center justify-between text-[12px] text-ink-600">
          <div className="flex items-center gap-1">
            <span className="text-ink-500">共</span>
            <span className="font-medium text-ink-900">{total}</span>
            <span className="text-ink-500">条</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, safePage - 2)
              const p = start + i
              if (p > totalPages) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 min-w-7 px-2 rounded text-[12px] tap ${p === safePage ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 底池数据列表 (PC 22列宽表 → App 卡片+折叠) ============
const POOL_FIELDS = [
  // [key, label, type]  type: 'text' | 'money' | 'mono' | 'date'
  ['statDate', '统计日期', 'date'],
  ['agentId', '代理商ID', 'mono'],
  ['customerId', '客户/广告主ID', 'mono'],
  ['customerName', '客户/广告主名称', 'text'],
  ['directCustomerId', '直客ID', 'mono'],
  ['directCustomerName', '直客客户名称', 'text'],
  ['industryL1', '一级行业', 'text'],
  ['industryL2', '二级行业', 'text'],
  ['regDate', '注册时间', 'date'],
  ['totalConsumption', '总消耗(元)', 'money'],
  ['giftConsumption', '赠款消耗(元)', 'money'],
  ['nonGiftConsumption', '非赠款消耗(元)', 'money'],
  ['prepaidConsumption', '预付消耗(元)', 'money'],
  ['creditConsumption', '授信消耗(元)', 'money'],
  ['subWalletId', '子钱包ID', 'mono'],
  ['sharedSubWalletName', '共享子钱包名称', 'text'],
  ['sharedWalletConsumption', '共享钱包消耗(元)', 'money'],
  ['sharedPrepaidConsumption', '共享预付消耗(元)', 'money'],
  ['sharedCreditConsumption', '共享授信消耗(元)', 'money'],
  ['agentSubAccountId', '代理商子账户ID', 'mono'],
  ['agentSubAccountName', '代理商子账户名称', 'text'],
  ['level1AgentCustomerId', '一级代理商客户ID', 'mono'],
]

function PoolDataSection({ node }) {
  const data = node.data || []
  const [statusTab, setStatusTab] = useState('已匹配')   // 已匹配 / 未匹配
  const [platform, setPlatform] = useState('头条')        // 全部 / 头条 / 腾讯 / 快手 / 小红书 / 微博
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [accountId, setAccountId] = useState('')
  const [accountName, setAccountName] = useState('')
  const [page, setPage] = useState(1)
  const [showUpload, setShowUpload] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  // 过滤
  const filtered = data.filter(r => {
    if (statusTab === '已匹配' && !r.matched) return false
    if (statusTab === '未匹配' && r.matched) return false
    if (platform !== '全部' && r.platform !== platform) return false
    if (dateStart && r.statDate < dateStart) return false
    if (dateEnd && r.statDate > dateEnd) return false
    if (accountId && !r.customerId.includes(accountId)) return false
    if (accountName && !r.customerName.includes(accountName)) return false
    return true
  })
  const PAGE_SIZE = 15
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const list = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // 切换状态/平台时重置分页
  useEffect(() => { setPage(1) }, [statusTab, platform, dateStart, dateEnd, accountId, accountName])

  const handleMatch = () => {
    setMatchLoading(true)
    setTimeout(() => {
      setMatchLoading(false)
      showToast('匹配成功')
    }, 1500)
  }

  const handleExport = () => {
    showToast('导出任务已提交，请稍后到消息中心查看')
  }

  return (
    <div className="bg-ink-50 pb-4">
      {/* 钉钉式查询条件 — 3 字段（最顶部）*/}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-lg px-3 py-2.5 flex items-center gap-3">
          {/* 统计日期 */}
          <div className="shrink-0">
            <div className="text-[11px] text-ink-400 mb-1 flex items-center gap-1">
              <span>统计日期</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.6"/>
                <path d="M3 9h18M8 3v4M16 3v4" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={dateStart}
                onChange={e => setDateStart(e.target.value)}
                className="w-[88px] h-7 px-1.5 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand"
              />
              <span className="text-ink-300 text-[11px]">~</span>
              <input
                type="date"
                value={dateEnd}
                onChange={e => setDateEnd(e.target.value)}
                className="w-[88px] h-7 px-1.5 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand"
              />
            </div>
          </div>

          <div className="w-px h-10 bg-ink-100"/>

          {/* 账号ID */}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-400 mb-1">账号ID</div>
            <input
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              placeholder="请输入账号ID"
              className="w-full h-7 px-2 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand placeholder:text-ink-300"
            />
          </div>

          <div className="w-px h-10 bg-ink-100"/>

          {/* 账号名称 */}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-ink-400 mb-1">账号名称</div>
            <input
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder="请输入账号名称"
              className="w-full h-7 px-2 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand placeholder:text-ink-300"
            />
          </div>
        </div>
      </div>

      {/* 状态 Tab + 平台 chip sticky 区域 */}
      <div className="bg-white sticky top-12 z-20 border-b border-ink-100 mt-3">
        <div className="flex items-center px-4 h-10">
          {['已匹配', '未匹配'].map(s => (
            <button
              key={s}
              onClick={() => setStatusTab(s)}
              className={`mr-6 h-10 text-[14px] relative tap ${statusTab === s ? 'text-brand font-medium' : 'text-ink-700'}`}
            >
              {s}
              {statusTab === s && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-[2px] bg-brand rounded-full"/>
              )}
            </button>
          ))}
        </div>

        {/* 平台 chip 横滑 */}
        <div className="flex items-center gap-2 px-3 pb-2 scrollbar-hide overflow-x-auto">
          {['全部', '头条', '腾讯', '快手', '小红书', '微博'].map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`shrink-0 h-7 px-3 rounded-full text-[12px] tap ${
                platform === p
                  ? 'bg-brand text-white'
                  : 'bg-ink-50 text-ink-700 border border-ink-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 卡片列表 */}
      <div className="px-3 pt-3">
        <div className="text-[11px] text-ink-400 mb-2">共 {filtered.length} 条 · 第 {safePage}/{totalPages} 页</div>
        {list.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-ink-400">暂无数据</div>
        ) : (
          <div className="space-y-3">
            {list.map(r => <PoolDataCard key={r.id} row={r}/>)}
          </div>
        )}
      </div>

      {/* 分页 */}
      <PoolDataPagination
        total={filtered.length}
        page={safePage}
        totalPages={totalPages}
        onChange={setPage}
      />

      {/* 上传 FAB — 内容流中，置于分页上方 */}
      <PoolDataFabInline onClick={() => setShowUpload(true)}/>

      {/* 未匹配 Tab 底部 sticky 操作栏 */}
      {statusTab === '未匹配' && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-ink-100 px-4 py-3 flex items-center gap-3 z-30">
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded border border-ink-200 bg-white text-[13px] text-ink-900 tap flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            导出
          </button>
          <button
            onClick={handleMatch}
            className="flex-1 h-9 rounded bg-brand text-white text-[13px] tap"
          >
            更新匹配状态
          </button>
        </div>
      )}

      {/* 上传 Modal */}
      {showUpload && (
        <UploadPoolFileModal
          onClose={() => setShowUpload(false)}
          onToast={showToast}
        />
      )}

      {/* 系统转圈 */}
      {matchLoading && <LoadingOverlay/>}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] text-white text-[14px] px-5 py-2.5 rounded-lg bg-black/80">
          {toast}
        </div>
      )}
    </div>
  )
}

function PoolDataCard({ row }) {
  const [expanded, setExpanded] = useState(false)
  // 核心 6 字段
  const core = [
    { label: '客户/广告主名称', value: row.customerName },
    { label: '统计日期', value: row.statDate },
    { label: '代理商ID', value: row.agentId },
    { label: '子钱包ID', value: row.subWalletId },
    { label: '直客ID', value: row.directCustomerId },
    { label: '直客名称', value: row.directCustomerName },
  ]
  return (
    <div className="bg-white rounded-lg card overflow-hidden">
      {/* 头部：客户名 + 总消耗 */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-ink-900 truncate">{row.customerName}</div>
          <div className="text-[11px] text-ink-400 mt-0.5 flex items-center gap-1.5">
            <span>{row.statDate}</span>
            <span className="w-1 h-1 rounded-full bg-ink-200"/>
            <span className="px-1.5 py-0.5 rounded bg-ink-50 text-[10px]">{row.platform}</span>
            <span className="w-1 h-1 rounded-full bg-ink-200"/>
            <span>{row.industryL1}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[16px] font-semibold text-brand tabular-nums">{row.totalConsumption.toFixed(2)}</div>
          <div className="text-[10px] text-ink-400">元</div>
        </div>
      </div>

      {/* 6 个核心字段 */}
      <div className="px-4 pb-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        {core.slice(1).map(f => (
          <div key={f.label} className="flex items-center gap-1.5 min-w-0">
            <span className="text-ink-400 shrink-0">{f.label}</span>
            <span className="text-ink-900 truncate font-mono">{f.value || '--'}</span>
          </div>
        ))}
      </div>

      {/* 折叠入口 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 border-t border-ink-100 text-[12px] text-brand flex items-center justify-center gap-1 tap"
      >
        {expanded ? '收起' : '查看'}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 展开：剩余 16 字段 */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-ink-100 bg-ink-50/40">
          <div className="pt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            {POOL_FIELDS.slice(6).map(([k, label]) => {
              let v = row[k]
              if (v === '' || v == null) v = '--'
              if (k.endsWith('Consumption') && typeof v === 'number') v = v.toFixed(2)
              return (
                <div key={k} className="flex items-start gap-1.5 min-w-0">
                  <span className="text-ink-400 shrink-0">{label}</span>
                  <span className={`text-ink-900 truncate text-right ml-auto ${k === 'agentId' || k === 'customerId' || k.endsWith('Id') ? 'font-mono' : ''}`}>{v}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============ 上传底池文件 Modal ============
function UploadPoolFileModal({ onClose, onToast }) {
  const [platform, setPlatform] = useState('')
  const [files, setFiles] = useState([])

  const handlePick = () => {
    // 模拟用户选择文件
    const mock = [
      { name: '底池数据_头条_2025-12.xlsx', size: 1240 },
      { name: '底池数据_腾讯补充.xlsx', size: 860 },
    ]
    setFiles(mock)
  }

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i))

  const submit = () => {
    if (!platform) return onToast('请选择媒体平台')
    if (!files.length) return onToast('请选择文件')
    onToast('上传成功，请稍后到消息中心查看')
    setTimeout(onClose, 600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-100">
          <span className="text-[16px] font-medium text-ink-900">上传媒体底池文件</span>
          <button className="tap p-1 -mr-1" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* 媒体平台下拉 */}
          <div>
            <label className="text-[12px] text-ink-700 block mb-1.5">媒体平台</label>
            <div className="relative">
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full h-10 px-3 pr-9 border border-ink-200 rounded-md text-[13px] outline-none appearance-none bg-white"
              >
                <option value="">请选择媒体平台</option>
                <option value="头条">头条</option>
                <option value="腾讯">腾讯</option>
                <option value="快手">快手</option>
                <option value="小红书">小红书</option>
                <option value="微博">微博</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* 上传区 */}
          {files.length === 0 ? (
            <button
              onClick={handlePick}
              className="w-full py-6 border-2 border-dashed border-ink-200 rounded-md flex flex-col items-center gap-2 tap bg-ink-50/30"
            >
              <div className="w-12 h-10 bg-success/10 rounded-md flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[13px] text-ink-700">点击选择文件</span>
              <span className="text-[11px] text-ink-400">仅支持 .xlsx、.xls 格式 · 单次最多 10 个 · 单个 ≤50MB</span>
            </button>
          ) : (
            <div className="border border-ink-200 rounded-md overflow-hidden">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 border-b border-ink-100 last:border-b-0">
                  <div className="w-8 h-8 bg-success/10 rounded flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="#34A853" strokeWidth="2" strokeLinejoin="round"/><path d="M14 3v5h5" stroke="#34A853" strokeWidth="2" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-ink-900 truncate">{f.name}</div>
                    <div className="text-[10px] text-ink-400">{(f.size / 1024).toFixed(2)} MB</div>
                  </div>
                  <button onClick={() => removeFile(i)} className="tap p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
              <button
                onClick={handlePick}
                className="w-full py-2 text-[12px] text-brand border-t border-ink-100 tap"
              >
                + 继续添加
              </button>
            </div>
          )}
        </div>

        <div className="px-5 pb-4 pt-1 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 tap"
          >
            取消
          </button>
          <button
            onClick={submit}
            className="flex-1 h-9 rounded-md bg-brand text-white text-[14px] tap"
          >
            确认上传
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ 系统 Loading 蒙层 ============
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl px-6 py-5 flex flex-col items-center gap-3 shadow-xl">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="animate-spin">
          <path d="M12 2a10 10 0 0110 10" stroke="#2D7FF9" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 2a10 10 0 00-10 10" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <div className="text-[13px] text-ink-700">系统匹配中...</div>
      </div>
    </div>
  )
}

// ============ 底池上传 FAB（悬浮位置：分页上方）============
function PoolDataFabInline({ onClick }) {
  return (
    <div className="fixed right-4 bottom-[180px] z-40">
      <button
        onClick={onClick}
        className="h-12 px-5 bg-brand text-white rounded-full shadow-lg flex items-center gap-1.5 tap active:scale-95 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <span className="text-[13px] font-medium">上传底池数据</span>
      </button>
    </div>
  )
}

// ============ 底池分页组件（含跳页输入）============
function PoolDataPagination({ total, page, totalPages, onChange }) {
  const [jumpTo, setJumpTo] = useState('')

  const submit = () => {
    const n = parseInt(jumpTo)
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      onChange(n)
      setJumpTo('')
    }
  }

  return (
    <div className="px-4 py-4 mt-2">
      <div className="flex items-center justify-between text-[11px] text-ink-400 mb-2">
        <span>15 条/页</span>
        <span>共 {total} 条</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {pageNumbers(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-1 text-ink-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-7 min-w-[28px] rounded text-[12px] px-1 ${
                p === page ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-7 w-7 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40 tap"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3 text-[12px] text-ink-700">
          <span>前往</span>
          <input
            type="number"
            value={jumpTo}
            onChange={e => setJumpTo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            className="w-12 h-7 px-2 border border-ink-200 rounded text-center text-[12px] outline-none focus:border-brand"
            min={1}
            max={totalPages}
            placeholder={String(page)}
          />
          <span>页</span>
          <button
            onClick={submit}
            className="h-7 px-3 rounded bg-brand text-white text-[12px] tap"
          >
            确定
          </button>
        </div>
      )}
    </div>
  )
}

// ============ 运营消耗列表（PC 表格样式 + 钉钉式筛选 + 高级搜索 + 下载）============
function OperationListSection({ node }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // 钉钉式筛选状态 — 顶部单行搜索 + 高级筛选含全部条件
  const [fieldKey, setFieldKey] = useState('advId')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    advId: '', groupName: '', platform: '', operator: '', dateStart: '', dateEnd: '',
  })
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const FIELD_OPTIONS = [
    { key: 'advId', label: '广告主ID' },
    { key: 'advName', label: '广告主名称' },
    { key: 'projectName', label: '项目名称' },
  ]
  const PLATFORM_OPTIONS = ['巨量引擎', '磁力金牛', '千川', 'TikTok', '腾讯广告', '聚光']

  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)
  const activeAdvancedCount = Object.values(advanced).filter(v => v).length

  // 过滤
  const filtered = data.filter(r => {
    if (keyword) {
      const v = r[fieldKey]
      if (!v?.toString().includes(keyword)) return false
    }
    if (advanced.advId && !r.advId?.includes(advanced.advId)) return false
    if (advanced.groupName && !r.groupName?.includes(advanced.groupName)) return false
    if (advanced.platform && r.platform !== advanced.platform) return false
    if (advanced.operator && !r.operator?.includes(advanced.operator)) return false
    if (advanced.dateStart && r.date < advanced.dateStart) return false
    if (advanced.dateEnd && r.date > advanced.dateEnd) return false
    return true
  })
  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const list = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [fieldKey, keyword, advanced])

  const hasAnyFilter = Boolean(keyword || activeAdvancedCount > 0)

  const handleReset = () => {
    setKeyword('')
    setAdvanced({ advId: '', groupName: '', platform: '', operator: '', dateStart: '', dateEnd: '' })
    setFieldKey('advId')
  }

  const handleDownload = () => {
    showToast('下载任务已提交，请稍后到消息中心查看')
  }

  const totalWidth = fields.reduce((s, f) => s + (f.width || 100), 0)

  return (
    <div className="bg-ink-50 pb-4">
      {/* 钉钉式查询条件卡（单行：字段 + 输入 + 🔍 + 漏斗） */}
      <div className="px-3 pt-3 relative">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button onClick={() => setFieldDrawerOpen(true)}
              className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
              <span className="truncate">{currentField.label}</span>
              <span className="text-ink-400 text-[10px] shrink-0">▾</span>
            </button>
            <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder={currentField.label}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => setFilterOpen(true)}
              className="w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeAdvancedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeAdvancedCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 顶部：共 N 条 + 下载（无 Tab） */}
      <div className="px-3 pt-3 flex items-center gap-2">
        <span className="text-[11px] text-ink-500">共 {filtered.length} 条</span>
        <button onClick={handleDownload}
          className="ml-auto h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          下载
        </button>
      </div>

      {/* 表格（横向滚动） */}
      <div className="mx-3 mt-2 bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="text-[12px]" style={{ minWidth: totalWidth }}>
            <thead className="bg-ink-50 text-ink-500">
              <tr>
                {fields.map(f => (
                  <th key={f.key} className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: f.width }}>
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {list.map((row, i) => (
                <tr key={i} className="hover:bg-ink-50/50">
                  {fields.map(f => (
                    <td key={f.key} className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: f.width }}>
                      <FieldCell field={f} value={row[f.key]}/>
                    </td>
                  ))}
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={fields.length} className="px-3 py-8 text-center text-[12px] text-ink-400">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <PoolDataPagination total={filtered.length} page={safePage} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onChange={setPage}/>

      {/* 底部：重置 + 确认（仅当有任意筛选条件时显示） */}
      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => setFilterOpen(false)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}

      {/* 行1 字段切换抽屉 */}
      {fieldDrawerOpen && (
        <FieldDrawer
          fields={FIELD_OPTIONS}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {/* 高级筛选 Sheet — 展示所有查询条件 */}
      {filterOpen && (
        <OperationAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          platformOptions={PLATFORM_OPTIONS}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] bg-black/80 text-white text-[13px] px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

// ============ 通用消耗报表（明点全景 / 运营人员看板 共用：钉钉式筛选 + 横向滚动表 + 导出）============
// 配置: { row1Fields, defaultFieldKey, advancedFields }
//   row1Fields: 字段切换候选 [{ key, label }]
//   advancedFields: 高级筛选字段 [{ key, label, kind: 'input'|'select'|'daterange', dateField?, optionsKey? }]
const MINGDIAN_CONFIG = {
  row1Fields: [
    { key: 'customerName', label: '客户主体名称' },
    { key: 'groupName', label: '集团' },
    { key: 'salesPolicy', label: '销售政策' },
  ],
  defaultFieldKey: 'customerName',
  advancedFields: [
    { key: 'customerName', label: '客户主体', kind: 'input' },
    { key: 'groupName', label: '集团', kind: 'input' },
    { key: 'mediaPlatform', label: '媒体平台', kind: 'select' },
    { key: 'dateRange', label: '统计日期', kind: 'daterange', dateField: 'consumeDate' },
  ],
}

const OPERATOR_DASHBOARD_CONFIG = {
  row1Fields: [
    { key: 'advId', label: '广告主ID' },
    { key: 'advName', label: '广告主名称' },
    { key: 'projectName', label: '项目名称' },
  ],
  defaultFieldKey: 'advId',
  advancedFields: [
    { key: 'advId', label: '广告主ID', kind: 'input' },
    { key: 'mediaPlatform', label: '媒体平台', kind: 'select' },
    { key: 'operator', label: '运营人员', kind: 'select' },
    { key: 'dateRange', label: '统计日期', kind: 'daterange', dateField: 'date' },
  ],
}

const CUSTOMER_POLICY_CONFIG = {
  row1Fields: [
    { key: 'customerName', label: '客户主体' },
    { key: 'group', label: '集团' },
    { key: 'policyName', label: '政策名称' },
    { key: 'serviceTag', label: '服务标签' },
  ],
  defaultFieldKey: 'customerName',
  advancedFields: [
    { key: 'dateRange', label: '查询日期', kind: 'daterange', dateField: 'date' },
    { key: 'serviceTag', label: '报备标签', kind: 'select' },
    { key: 'mediaPlatform', label: '媒体平台', kind: 'select' },
    { key: 'group', label: '集团', kind: 'input' },
    { key: 'advId', label: '广告主ID', kind: 'input' },
    { key: 'policyName', label: '政策', kind: 'select' },
    { key: 'sales', label: '销售员', kind: 'select' },
  ],
}

function buildAdvancedInit(fields) {
  const init = { dateStart: '', dateEnd: '' }
  fields.forEach(f => { if (f.kind !== 'daterange') init[f.key] = '' })
  return init
}

function ConsumptionReportShell({ node, config, children }) {
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length

  const [fieldKey, setFieldKey] = useState(config.defaultFieldKey)
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState(() => buildAdvancedInit(config.advancedFields))
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1500) }

  // 自动从数据派生 select 选项
  const selectOptionsByField = {}
  config.advancedFields.forEach(f => {
    if (f.kind === 'select') {
      selectOptionsByField[f.key] = Array.from(new Set(data.map(d => d[f.key]).filter(v => v != null && v !== '')))
    }
  })

  const currentField = config.row1Fields.find(f => f.key === fieldKey) || config.row1Fields[0]
  const activeAdvancedCount = Object.entries(advanced).filter(([k, v]) => v && k !== 'dateStart' && k !== 'dateEnd').length
    + (advanced.dateStart ? 1 : 0) + (advanced.dateEnd ? 1 : 0)

  const filtered = data.filter(r => {
    if (keyword) {
      const v = r[fieldKey]
      if (!v?.toString().includes(keyword)) return false
    }
    for (const f of config.advancedFields) {
      if (f.kind === 'daterange') {
        const dateVal = r[f.dateField]
        if (!dateVal) continue
        if (advanced.dateStart && dateVal < advanced.dateStart) return false
        if (advanced.dateEnd && dateVal > advanced.dateEnd) return false
      } else if (advanced[f.key]) {
        const v = r[f.key]
        if (f.kind === 'input') {
          if (!v?.toString().includes(advanced[f.key])) return false
        } else if (f.kind === 'select') {
          if (v !== advanced[f.key]) return false
        }
      }
    }
    return true
  })
  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const list = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [fieldKey, keyword, advanced])

  const handleExport = () => {
    showToast(`已提交 ${filtered.length} 条导出任务，请到消息中心查看`)
  }

  const totalWidth = fields.reduce((s, f) => s + (f.width || 100), 0) + 8

  return (
    <div className="bg-ink-50 pb-4">
      {/* 钉钉式查询条件卡（行 1：字段 + 输入 + 🔍 + 漏斗） */}
      <div className="card mx-3 mt-3 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={() => setFieldDrawerOpen(true)}
            className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[88px]">
            <span className="truncate">{currentField.label}</span>
            <span className="text-ink-400 text-[10px] shrink-0">▾</span>
          </button>
          <div className="flex-1 bg-ink-50 rounded-full h-9 flex items-center px-4 text-[12px]">
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder={`请输入${currentField.label}`}
              className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
          </div>
          <button onClick={() => setKeyword(k => k)} className="w-9 h-9 flex items-center justify-center tap shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
              <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button onClick={() => setFilterOpen(true)}
            className="w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            {activeAdvancedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeAdvancedCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* 顶部：共 N 条 + 导出 */}
      <div className="px-3 pt-3 flex items-center gap-2">
        <span className="text-[11px] text-ink-500">共 {filtered.length} 条</span>
        <button onClick={handleExport}
          className="ml-auto h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          导出
        </button>
      </div>

      {/* 内容区（表格或卡片） */}
      {children({ list, fields, totalWidth })}

      {/* 分页 */}
      <PoolDataPagination total={filtered.length} page={safePage} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onChange={setPage}/>

      {/* 行 1 字段切换抽屉 */}
      {fieldDrawerOpen && (
        <FieldDrawer
          fields={config.row1Fields}
          currentKey={fieldKey}
          onSelect={(k) => { setFieldKey(k); setFieldDrawerOpen(false) }}
          onClose={() => setFieldDrawerOpen(false)}
        />
      )}

      {/* 高级筛选 Sheet */}
      {filterOpen && (
        <ConsumptionAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          fields={config.advancedFields}
          selectOptionsByField={selectOptionsByField}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] bg-black/80 text-white text-[13px] px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

// ============ 表格渲染 ============
function ConsumptionReportSection({ node, config }) {
  return (
    <ConsumptionReportShell node={node} config={config}>
      {({ list, fields, totalWidth }) => (
        <div className="mx-3 mt-2 bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="text-[12px]" style={{ minWidth: totalWidth }}>
              <thead className="bg-ink-50 text-ink-500">
                <tr>
                  {fields.map(f => (
                    <th key={f.key} className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: f.width }}>
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {list.map((row, i) => (
                  <tr key={i} className="hover:bg-ink-50/50">
                    {fields.map(f => (
                      <td key={f.key} className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: f.width }}>
                        <FieldCell field={f} value={row[f.key]}/>
                      </td>
                    ))}
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={fields.length} className="px-3 py-8 text-center text-[12px] text-ink-400">
                      暂无数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ConsumptionReportShell>
  )
}

// ============ 客户政策明细（卡片列表，点击展开看全部字段）============
function CustomerPolicySection({ node, config }) {
  return (
    <ConsumptionReportShell node={node} config={config}>
      {({ list, fields }) => (
        <div className="mx-3 mt-2 space-y-2">
          {list.map((row, i) => (
            <CustomerPolicyCard key={i} row={row} fields={fields}/>
          ))}
          {list.length === 0 && (
            <div className="text-center text-[12px] text-ink-400 py-8">暂无数据</div>
          )}
        </div>
      )}
    </ConsumptionReportShell>
  )
}

function CustomerPolicyCard({ row, fields }) {
  const [expanded, setExpanded] = useState(false)

  // 头部摘要字段（5 个最重要）
  const summaryKeys = ['date', 'customerName', 'policyName', 'rebateAmount', 'group']
  const summaryFields = summaryKeys.map(k => fields.find(f => f.key === k)).filter(Boolean)

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 顶部摘要行（始终可见） */}
      <button onClick={() => setExpanded(e => !e)} className="w-full text-left px-3 py-3 flex items-start gap-3 tap active:bg-ink-50">
        <div className="w-1 h-10 rounded-full shrink-0 bg-brand mt-0.5"/>
        <div className="flex-1 min-w-0">
          {/* 日期 + 客户主体 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] px-1.5 py-0.5 bg-ink-50 text-ink-500 rounded shrink-0">{row.date}</span>
            <span className="text-[13px] font-medium text-ink-900 truncate flex-1">{row.customerName}</span>
          </div>
          {/* 政策名 + 服务标签 */}
          <div className="text-[12px] text-ink-700 mb-1 truncate">
            {row.policyName}{row.serviceTag ? ` · ${row.serviceTag}` : ''}
          </div>
          {/* 共货钱包消耗 + 返点金额（红） */}
          <div className="flex items-center gap-3 text-[12px]">
            <span className="text-ink-500">共货消耗 ¥{row.sharedWalletConsumption?.toFixed(2)}</span>
            <span className="text-danger font-medium">返点 ¥{row.rebateAmount?.toFixed(2)}</span>
          </div>
          {/* 集团 + 销售 */}
          <div className="text-[11px] text-ink-400 mt-1 truncate">
            集团: {row.group || '未匹配'} · 销售: {row.sales || '未匹配'}
          </div>
        </div>
        {/* 折叠图标 */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`shrink-0 mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`}>
          <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 展开区：剩余全部字段 */}
      {expanded && (
        <div className="border-t border-ink-100 px-3 py-3 space-y-1.5 bg-ink-50/30">
          {fields.map(f => {
            const v = row[f.key]
            const isSummary = summaryKeys.includes(f.key)
            if (isSummary) return null  // 已在摘要中展示，跳过
            const isHighlight = f.key === 'rebateAmount'
            return (
              <div key={f.key} className="flex items-start gap-2 text-[12px]">
                <span className="text-ink-500 shrink-0 min-w-[78px]">{f.label}</span>
                <span className={`flex-1 break-all ${isHighlight ? 'text-danger font-medium' : 'text-ink-900'}`}>
                  {v === '' || v == null ? <span className="text-ink-300">--</span> : (f.type === 'money' ? `¥ ${typeof v === 'number' ? v.toFixed(2) : v}` : String(v))}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============ 通用消耗报表 - 高级筛选 Sheet ============
function ConsumptionAdvancedFilter({ values, setValues, fields, selectOptionsByField, onClose }) {
  const [active, setActive] = useState(fields[0]?.key)
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)
  const activeOptions = activeField?.options || selectOptionsByField[active] || []

  const handleReset = () => {
    setValues(buildAdvancedInit(fields))
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
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeOptions.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.dateStart || ''} onChange={e => set('dateStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.dateEnd || ''} onChange={e => set('dateEnd', e.target.value)}
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

// ============ 运营消耗列表 - 高级筛选 Sheet（全部查询条件）============
function OperationAdvancedFilter({ values, setValues, platformOptions, onClose }) {
  const fields = [
    { key: 'advId', label: '广告主ID', kind: 'input' },
    { key: 'groupName', label: '集团名称', kind: 'input' },
    { key: 'platform', label: '媒体平台', kind: 'select', options: platformOptions },
    { key: 'operator', label: '运营人员', kind: 'input' },
    { key: 'dateRange', label: '创建时间', kind: 'daterange' },
  ]
  const [active, setActive] = useState('advId')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

  const handleReset = () => {
    setValues({ advId: '', groupName: '', platform: '', operator: '', dateStart: '', dateEnd: '' })
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
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.dateStart || ''} onChange={e => set('dateStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.dateEnd || ''} onChange={e => set('dateEnd', e.target.value)}
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

// ============ 账户ID（表格 + 钉钉式筛选 + 单/批量 tab + 高级搜索 + 批量认领/分配运营）============
function AccountIdSection({ node }) {
  const nav = useNavigate()
  const data = node.data || []
  const fields = node.fields || []
  const PAGE_SIZE = 15
  const total = data.length

  // 钉钉式筛选 — 顶部 2 字段（广告主ID + 集团名称） + 漏斗 sheet
  const [keyword, setKeyword] = useState('')
  const [groupKeyword, setGroupKeyword] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    sales: '', operator: '', platform: '', policyName: '', dateStart: '', dateEnd: '',
  })
  // Tab: 认领/分配运营 | 未绑定运营人员
  const [tab, setTab] = useState('all') // 'all' | 'unbound'
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(new Set())
  const [batchOpen, setBatchOpen] = useState(false)

  const PLATFORM_OPTIONS = ['头条-AD', '磁力金牛', '聚光', '腾讯广告', '千川']
  const OPERATOR_OPTIONS = Array.from(new Set(data.map(d => d.operatorInfo?.split(' · ')[0]).filter(Boolean)))

  const activeAdvancedCount = Object.values(advanced).filter(v => v).length

  const filtered = data.filter(r => {
    if (keyword && !r.advId?.includes(keyword)) return false
    if (groupKeyword && !r.customerGroup?.includes(groupKeyword)) return false
    if (tab === 'unbound' && r.hasOperator) return false
    if (advanced.sales && !r.sales?.includes(advanced.sales)) return false
    if (advanced.operator && !r.operatorInfo?.includes(advanced.operator)) return false
    if (advanced.platform && r.platform !== advanced.platform) return false
    if (advanced.policyName && !r.policyName?.includes(advanced.policyName)) return false
    return true
  })
  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const list = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
    setSelected(new Set())
  }, [keyword, groupKeyword, advanced, tab])

  const hasAnyFilter = Boolean(keyword || groupKeyword || activeAdvancedCount > 0)

  const handleReset = () => {
    setKeyword('')
    setGroupKeyword('')
    setAdvanced({ sales: '', operator: '', platform: '', policyName: '', dateStart: '', dateEnd: '' })
  }

  const toggleAll = () => {
    if (selected.size === list.length) setSelected(new Set())
    else setSelected(new Set(list.map(r => r.advId)))
  }
  const toggleOne = (advId) => {
    const ns = new Set(selected)
    if (ns.has(advId)) ns.delete(advId)
    else ns.add(advId)
    setSelected(ns)
  }

  const totalWidth = fields.reduce((s, f) => s + (f.width || 100), 0) + 100

  return (
    <div className="bg-ink-50 pb-4">
      {/* 顶部查询条件（2 输入 + 漏斗 icon） */}
      <div className="px-3 pt-3 relative">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-400 mb-1">广告主ID</div>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="请输入广告主ID"
                className="w-full h-7 px-2 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand placeholder:text-ink-300"/>
            </div>
            <div className="w-px h-10 bg-ink-100"/>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink-400 mb-1">集团名称</div>
              <input value={groupKeyword} onChange={e => setGroupKeyword(e.target.value)}
                placeholder="请输入集团名称"
                className="w-full h-7 px-2 bg-ink-50 rounded text-[11px] text-ink-900 outline-none border border-transparent focus:border-brand placeholder:text-ink-300"/>
            </div>
            <button onClick={() => setFilterOpen(true)}
              className="ml-1 w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeAdvancedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeAdvancedCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab：认领/分配运营 | 未绑定运营人员 */}
      <div className="px-3 pt-3 flex items-center gap-4 border-b border-ink-100">
        <button onClick={() => setTab('all')}
          className={`pb-2 text-[13px] tap relative ${tab === 'all' ? 'text-brand font-medium' : 'text-ink-500'}`}>
          认领/分配运营
          {tab === 'all' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t"/>}
        </button>
        <button onClick={() => setTab('unbound')}
          className={`pb-2 text-[13px] tap relative ${tab === 'unbound' ? 'text-brand font-medium' : 'text-ink-500'}`}>
          未绑定运营人员
          {tab === 'unbound' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t"/>}
        </button>
        {selected.size > 0 && (
          <button onClick={() => setBatchOpen(true)}
            className="ml-auto h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
            批量认领/分配运营 ({selected.size})
          </button>
        )}
      </div>

      {/* 表格（横向滚动） */}
      <div className="mx-3 mt-2 bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="text-[12px]" style={{ minWidth: totalWidth }}>
            <thead className="bg-ink-50 text-ink-500">
              <tr>
                <th className="px-2 py-2.5 w-8 whitespace-nowrap">
                  <span onClick={toggleAll} className="inline-flex items-center justify-center w-4 h-4 rounded border-2 border-ink-300 cursor-pointer">
                    {selected.size === list.length && list.length > 0 && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l4 4L19 6" stroke="#2D7FF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </th>
                {fields.map(f => (
                  <th key={f.key} className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: f.width }}>
                    {f.label}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left font-medium w-16 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {list.map((row, i) => (
                <tr key={row.advId || i} className="hover:bg-ink-50/50">
                  <td className="px-2 py-2.5">
                    <span onClick={() => toggleOne(row.advId)} className="inline-flex items-center justify-center w-4 h-4 rounded border-2 border-ink-300 cursor-pointer">
                      {selected.has(row.advId) && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12l4 4L19 6" stroke="#2D7FF9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                  </td>
                  {fields.map(f => (
                    <td key={f.key} className="px-3 py-2.5 whitespace-nowrap" style={{ minWidth: f.width }}>
                      <FieldCell field={f} value={row[f.key]}/>
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <button className="text-brand text-[11px] tap" onClick={() => nav(`/account/operator-edit/${row.advId}`)}>修改运营</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 2} className="px-3 py-8 text-center text-[12px] text-ink-400">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <PoolDataPagination total={filtered.length} page={safePage} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onChange={setPage}/>

      {/* 底部：重置 + 确认（仅当有任意筛选条件时显示） */}
      {hasAnyFilter && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={() => setFilterOpen(false)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      )}

      {/* 高级筛选 Sheet */}
      {filterOpen && (
        <AccountIdAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          platformOptions={PLATFORM_OPTIONS}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* 批量认领/分配运营 Modal */}
      {batchOpen && (
        <BatchAssignModal
          count={selected.size}
          operatorOptions={OPERATOR_OPTIONS}
          onClose={() => setBatchOpen(false)}
        />
      )}
    </div>
  )
}

// ============ 账户ID - 高级筛选 Sheet ============
function AccountIdAdvancedFilter({ values, setValues, platformOptions, onClose }) {
  const fields = [
    { key: 'sales', label: '销售', kind: 'input' },
    { key: 'operator', label: '运营人员', kind: 'input' },
    { key: 'platform', label: '媒体平台', kind: 'select', options: platformOptions },
    { key: 'policyName', label: '政策名称', kind: 'input' },
    { key: 'dateRange', label: '创建时间', kind: 'daterange' },
  ]
  const [active, setActive] = useState('sales')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

  const handleReset = () => {
    setValues({ sales: '', operator: '', platform: '', policyName: '', dateStart: '', dateEnd: '' })
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
          <div className="w-[110px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {activeField?.kind === 'daterange' && (
              <div className="flex items-center gap-2">
                <input type="date" value={values.dateStart || ''} onChange={e => set('dateStart', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
                <span className="text-ink-400 text-[12px]">~</span>
                <input type="date" value={values.dateEnd || ''} onChange={e => set('dateEnd', e.target.value)}
                  className="flex-1 h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={handleReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重置筛选</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
        </div>
      </div>
    </div>
  )
}

// ============ 批量认领/分配运营 Modal ============
function BatchAssignModal({ count, operatorOptions, onClose }) {
  const [status, setStatus] = useState('')
  const [operator, setOperator] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const STATUS_OPTIONS = ['生效', '失效']

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4" onClick={onClose}>
      <div className="w-full max-w-[400px] bg-white rounded-xl flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">认领/分配运营</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-[12px] text-ink-500 mb-1">已选 {count} 个广告主</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"/>
                运营状态：
              </label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand appearance-none">
                <option value="">请选择运营状态</option>
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"/>
                运营人员：
              </label>
              <select value={operator} onChange={e => setOperator(e.target.value)}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand appearance-none">
                <option value="">请选择运营人员</option>
                {operatorOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"/>
                状态生效日期：
              </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
            </div>
            <div>
              <label className="text-[11px] text-ink-700 mb-1 block">状态失效日期：</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[12px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand"/>
            </div>
          </div>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onClose} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

// ============ 工具函数 ============
// eslint-disable-next-line no-unused-vars
function pageNumbers(current, total) {
  const pages = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (current > 4) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 3) pages.push('...')
  pages.push(total)
  return pages
}

// ============ 运营报表（日/周/月/季 - 媒体卡联动 + 饼图 + 柱状图 + 二级卡 + 导出）============
function OperationReportSection({ node }) {
  const nav = useNavigate()
  // 根据 node.index 解析期间类型：daily / weekly / monthly / quarterly
  const PERIOD_MAP = {
    operationDaily: 'daily',
    operationWeekly: 'weekly',
    operationMonthly: 'monthly',
    operationQuarterly: 'quarterly',
  }
  const period = PERIOD_MAP[node?.index] || 'monthly'
  const data = operationReportData[period]
  const dim = data.operator // 当前维度（运营 / 部门）

  const [tab, setTab] = useState('operator') // 'operator' | 'dept'
  const [selectedMedia, setSelectedMedia] = useState('total')
  const [filterOpen, setFilterOpen] = useState(false)
  const [advanced, setAdvanced] = useState({
    platform: '', department: '', cooperation: '', payment: '', group: '',
  })
  const [qoqFilter, setQoqFilter] = useState('all') // 全部 / 上升 / 下降
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  // 行业维度柱状图：可点击图例控制堆叠媒体显示
  const [activeStacks, setActiveStacks] = useState(['头条-AD', '头条-千川', '头条-本地推'])
  const PAGE_SIZE = 8

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const dimData = tab === 'operator' ? data.operator : data.dept
  const mediaItem = dimData.byMedia.find(m => m.key === selectedMedia) || dimData.byMedia[0]
  const cards = mediaItem.cards

  const activeAdvancedCount = Object.values(advanced).filter(v => v).length

  // 环比筛选
  const filteredCards = cards.filter(c => {
    if (qoqFilter === 'up' && !(c.qoq > 0)) return false
    if (qoqFilter === 'down' && !(c.qoq < 0)) return false
    return true
  })

  // 二级卡分页
  const totalCardPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE))
  const safePage = Math.min(page, totalCardPages)
  const pagedCards = filteredCards.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const sumNonGift = filteredCards.reduce((s, c) => s + c.nonGift, 0)

  useEffect(() => { setPage(1) }, [tab, selectedMedia, qoqFilter])

  const trend = dimData.trends[selectedMedia] || []
  const trendAvg = trend.length ? trend.reduce((s, t) => s + t.value, 0) / trend.length : 0

  const handleReset = () => {
    setAdvanced({ platform: '', department: '', cooperation: '', payment: '', group: '' })
  }

  const handleExport = () => {
    const total = filteredCards.length
    showToast(`已导出 ${tab === 'operator' ? '运营' : '部门'}维度 · ${mediaItem.name} · ${total} 条`)
  }

  const PIE_COLORS = ['#2D7FF9', '#FAAD14', '#F5222D']

  return (
    <div className="bg-ink-50 pb-4">
      {/* 顶部筛选行：统计月份 + 🔍 + 漏斗 + 导出 */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <div className="flex items-center gap-1 h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 shrink-0">
              <span className="text-ink-400 text-[11px]">统计{data.periodLabel}</span>
              <span className="font-mono">{data.period}</span>
            </div>
            <button className="w-9 h-9 flex items-center justify-center tap shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
                <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => setFilterOpen(true)}
              className="w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap relative shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              {activeAdvancedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">{activeAdvancedCount}</span>
              )}
            </button>
            <button onClick={handleExport}
              className="ml-auto h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90 shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              导出
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: 运营 / 部门 */}
      <div className="px-3 pt-3">
        <div className="flex border-b border-ink-100">
          {[
            { key: 'operator', label: '运营' },
            { key: 'dept', label: '部门' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 h-10 text-[14px] tap relative ${
                tab === t.key ? 'text-brand font-medium' : 'text-ink-700'
              }`}>
              {t.label}
              {tab === t.key && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-0.5 bg-brand rounded"/>}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: 媒体消耗概览（9 卡 2 列网格） */}
      <div className="px-3 pt-3">
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-brand rounded-sm"/>
              <span className="text-[14px] font-medium text-ink-900">媒体消耗概览</span>
            </div>
            <span className="text-[10px] text-ink-400">按媒体平台汇总，总消耗与赠款非赠款、日均消耗一目了然</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dimData.byMedia.map(m => {
              const isSelected = selectedMedia === m.key
              return (
                <button key={m.key} onClick={() => setSelectedMedia(m.key)}
                  className={`text-left rounded-lg p-2.5 relative transition ${
                    isSelected ? 'bg-brand/5 border border-brand' : 'bg-ink-50 border border-transparent'
                  }`}>
                  {isSelected && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-brand rounded-r"/>}
                  <div className="text-[12px] text-ink-900 font-medium mb-1">{m.name}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] text-ink-400">非赠款消耗</span>
                    <span className="text-[15px] font-bold text-ink-900">{m.nonGift.toFixed(2)}<span className="text-[10px] font-normal text-ink-400 ml-0.5">万</span></span>
                  </div>
                  <div className="text-[10px] mt-0.5">
                    <span className="text-ink-400">环比 </span>
                    <span className={m.qoq > 0 ? 'text-emerald-500' : m.qoq < 0 ? 'text-red-500' : 'text-ink-400'}>
                      {m.qoq > 0 ? '+' : ''}{m.qoq.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-ink-100 grid grid-cols-3 gap-1 text-center">
                    <div>
                      <div className="text-[9px] text-ink-400">总消耗</div>
                      <div className="text-[10px] text-ink-700">{m.total.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-ink-400">赠款</div>
                      <div className="text-[10px] text-ink-700">{m.gift.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-ink-400">日均</div>
                      <div className="text-[10px] text-ink-700">{m.dailyAvg.toFixed(2)}</div>
                    </div>
                  </div>
                </button>
              )
            })}
            {/* 饼图卡 - col-span-2 */}
            <div className="col-span-2 bg-ink-50 rounded-lg p-2.5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-ink-900 font-medium mb-1">二代/非二代</div>
                <div className="space-y-1">
                  {mediaItem.pie.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }}/>
                        <span className="text-ink-700">{p.name}</span>
                      </div>
                      <span className="text-ink-900 font-medium">{p.value.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-20 h-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={mediaItem.pie} dataKey="value" innerRadius={22} outerRadius={38} paddingAngle={2}>
                      {mediaItem.pie.map((_, i) => (
                        <PieCell key={i} fill={PIE_COLORS[i]}/>
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: 消耗总额柱状图 */}
      <div className="px-3 pt-3">
        <div className="card p-3">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-ink-900">消耗总额（单位万元）</span>
            </div>
            <div className="text-[10px] text-ink-400">
              总计: <span className="text-ink-700 font-mono">{mediaItem.nonGift.toFixed(2)}</span>
              {' '}平均值: <span className="text-ink-700 font-mono">{trendAvg.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false}/>
                <YAxis
                  tick={{ fontSize: 10, fill: '#999' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #eee' }}
                  formatter={(v) => `${Number(v).toFixed(2)} 万`}
                />
                {trendAvg > 0 && (
                  <ReferenceLine
                    y={trendAvg}
                    stroke="#FAAD14"
                    strokeDasharray="4 4"
                    label={{
                      value: `平均值: ${trendAvg.toFixed(2)}万`,
                      position: 'right',
                      fill: '#FAAD14',
                      fontSize: 10,
                    }}
                  />
                )}
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 3: 环比筛选 + 总和 + 二级卡片网格 */}
      <div className="px-3 pt-3">
        <div className="card p-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <select value={qoqFilter} onChange={e => setQoqFilter(e.target.value)}
                className="h-7 px-2 bg-ink-50 rounded text-[11px] text-ink-900 focus:outline-none appearance-none cursor-pointer">
                <option value="all">环比筛选：全部</option>
                <option value="up">环比上升</option>
                <option value="down">环比下降</option>
              </select>
            </div>
            <div className="text-[11px] text-ink-500">
              非赠款消耗总和: <span className="text-ink-900 font-bold font-mono">{sumNonGift.toFixed(2)}</span> 万元
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pagedCards.map((c, i) => (
              <button key={`${c.name}-${i}`}
                onClick={() => {
                  const dimName = tab === 'operator' ? 'operator' : 'dept'
                  nav(`/monthly/detail?dim=${dimName}&media=${selectedMedia}&name=${encodeURIComponent(c.name)}&total=${c.nonGift}`)
                }}
                className="bg-ink-50 rounded-lg p-2.5 text-left tap active:bg-ink-100">
                <div className="text-[12px] text-ink-900 font-medium mb-1 truncate">{c.name}</div>
                <div className="text-[10px] text-ink-400">非赠款消耗（万元）</div>
                <div className="text-[15px] font-bold text-ink-900 font-mono mt-0.5">{c.nonGift.toFixed(2)}<span className="text-[10px] font-normal text-ink-400 ml-0.5">万</span></div>
                <div className="text-[10px] mt-1">
                  <span className="text-ink-400">环比上月 </span>
                  <span className={c.qoq > 0 ? 'text-emerald-500 font-mono' : c.qoq < 0 ? 'text-red-500 font-mono' : 'text-ink-400 font-mono'}>
                    {c.qoq > 0 ? '+' : ''}{c.qoq.toFixed(2)}%
                  </span>
                </div>
              </button>
            ))}
            {pagedCards.length === 0 && (
              <div className="col-span-2 py-6 text-center text-[12px] text-ink-400">暂无数据</div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 text-[10px] text-ink-400">
            <span>{PAGE_SIZE} 条/页</span>
            <span>共 {filteredCards.length} 条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1}
                className="w-5 h-5 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <span className="px-2 text-ink-700">{safePage}/{totalCardPages}</span>
              <button onClick={() => setPage(Math.min(totalCardPages, safePage + 1))} disabled={safePage === totalCardPages}
                className="w-5 h-5 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 高级筛选 Sheet */}
      {filterOpen && (
        <MonthlyReportAdvancedFilter
          values={advanced}
          setValues={setAdvanced}
          onClose={() => setFilterOpen(false)}
          onReset={handleReset}
        />
      )}

      {/* Section 4: 行业维度 Top10 堆叠柱状图（仅季报） */}
      {period === 'quarterly' && data.industryStack && (
        <div className="px-3 pt-3">
          <div className="card p-3">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-ink-900">消耗总额（行业维度：头条Top10）</span>
              </div>
              <div className="text-[10px] text-ink-400 text-right shrink-0">
                <div>总计: <span className="text-ink-700 font-mono">{data.industryStack.reduce((s, r) => s + activeStacks.reduce((ss, k) => ss + (r[k] || 0), 0), 0).toFixed(2)}</span>万</div>
                <div>平均值: <span className="text-ink-700 font-mono">{(data.industryStack.reduce((s, r) => s + activeStacks.reduce((ss, k) => ss + (r[k] || 0), 0), 0) / data.industryStack.length).toFixed(2)}</span>万</div>
              </div>
            </div>
            {/* 图例（可点击切换显示） */}
            <div className="flex items-center justify-center gap-3 mb-2 text-[10px]">
              {[
                { key: '头条-AD', color: '#FAAD14' },
                { key: '头条-千川', color: '#10B981' },
                { key: '头条-本地推', color: '#2D7FF9' },
              ].map(l => {
                const isActive = activeStacks.includes(l.key)
                return (
                  <button
                      key={l.key}
                      onClick={() => {
                        setActiveStacks(prev => {
                          if (prev.includes(l.key)) {
                            const next = prev.filter(k => k !== l.key)
                            return next.length === 0 ? ['头条-AD', '头条-千川', '头条-本地推'] : next
                          }
                          return [...prev, l.key]
                        })
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                        isActive ? 'text-ink-900' : 'text-ink-300'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm transition"
                        style={{ background: isActive ? l.color : '#e5e5e5' }}
                      />
                      {l.key}
                    </button>
                  )
              })}
            </div>
            {/* 堆叠柱状图 - X 轴行业名，宽度溢出滚动 */}
            <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
              <div style={{ width: Math.max(380, data.industryStack.length * 60), height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.industryStack}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
                    <XAxis
                      dataKey="industry"
                      tick={{ fontSize: 10, fill: '#999' }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#999' }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #eee' }}
                      formatter={(v) => `${Number(v).toFixed(2)} 万`}
                    />
                    {activeStacks.includes('头条-AD') && (
                      <Bar dataKey="头条-AD" stackId="a" fill="#FAAD14" radius={[0, 0, 0, 0]}/>
                    )}
                    {activeStacks.includes('头条-千川') && (
                      <Bar dataKey="头条-千川" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]}/>
                    )}
                    {activeStacks.includes('头条-本地推') && (
                      <Bar dataKey="头条-本地推" stackId="a" fill="#2D7FF9" radius={[4, 4, 0, 0]}/>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] bg-black/80 text-white text-[13px] px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

// ============ 月报 - 高级筛选 Sheet ============
function MonthlyReportAdvancedFilter({ values, setValues, onClose, onReset }) {
  const fields = [
    { key: 'platform', label: '媒体平台', kind: 'select', options: ['头条-AD', '磁力金牛', '千川', 'TikTok', '腾讯广告', '聚光', '小红书', '微博'] },
    { key: 'department', label: '部门', kind: 'input' },
    { key: 'cooperation', label: '合作模式', kind: 'select', options: ['代理', '直营', '代运营'] },
    { key: 'payment', label: '付款方式', kind: 'select', options: ['预付', '后付', '月结'] },
    { key: 'group', label: '集团', kind: 'input' },
  ]
  const [active, setActive] = useState('platform')
  const set = (k, v) => setValues(s => ({ ...s, [k]: v }))
  const activeField = fields.find(f => f.key === active)

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
          <div className="w-[100px] bg-ink-50 overflow-y-auto">
            {fields.map(f => (
              <button key={f.key} onClick={() => setActive(f.key)}
                className={`w-full px-3 py-3 text-left text-[12px] tap border-l-2 ${
                  active === f.key ? 'bg-white text-brand border-brand font-medium' : 'text-ink-700 border-transparent'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeField?.kind === 'input' && (
              <input value={values[active] || ''} onChange={e => set(active, e.target.value)}
                placeholder={`请输入${activeField.label}`}
                className="w-full h-9 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
            )}
            {activeField?.kind === 'select' && (
              <div className="space-y-2">
                <label onClick={() => set(active, '')} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!values[active] ? 'border-brand' : 'border-ink-200'}`}>
                    {!values[active] && <span className="w-2 h-2 rounded-full bg-brand"/>}
                  </span>
                  <span className="text-[13px] text-ink-900">全部</span>
                </label>
                {activeField.options.map(opt => (
                  <label key={opt} onClick={() => set(active, opt)} className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${values[active] === opt ? 'border-brand' : 'border-ink-200'}`}>
                      {values[active] === opt && <span className="w-2 h-2 rounded-full bg-brand"/>}
                    </span>
                    <span className="text-[13px] text-ink-900">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onReset} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}
