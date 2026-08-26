import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customersData, projectsData, groupPoliciesData } from '../../data/mock'

/**
 * 主体详情页
 * 顶部 4 个 tab：客户信息 / 项目 / 政策 / 主体
 */
export default function SubjectDetailPage() {
  const nav = useNavigate()
  const { id: subjectId } = useParams()
  const [activeTab, setActiveTab] = useState('客户信息')

  const TABS = ['客户信息', '项目', '政策', '主体']
  const subject = customersData.find(c => c.id === subjectId) || customersData[0]

  return (
    <div className="bg-ink-50 min-h-full pb-4">
      <TopBar title="主体详情" onBack={() => nav(-1)}/>

      {/* 顶部客户信息条 */}
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
            <span className="text-[18px] font-medium text-brand">{(subject.name || '客')[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-medium text-ink-900 leading-tight truncate">{subject.name || '--'}</div>
            <div className="text-[11px] text-ink-400 mt-1">主体编号: {subject.id} · 客户编号: {subject.customerCode || '--'}</div>
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
        {activeTab === '客户信息' && <CustomerInfoTab subject={subject}/>}
        {activeTab === '项目' && <ProjectTab subject={subject}/>}
        {activeTab === '政策' && <PolicyTab subject={subject}/>}
        {activeTab === '主体' && <MainSubjectTab subject={subject}/>}
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

// ============ 卡片分组 ============
function Section({ title, children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title">{title}</div>
      <div className="px-4 pb-3">{children}</div>
    </div>
  )
}

// ============ 行字段 ============
function Row({ label, value, last }) {
  const v = value == null || value === '' || value === '--' ? '--' : value
  const muted = v === '--'
  return (
    <div className={`flex items-start gap-3 py-2.5 text-[13px] ${last ? '' : 'border-b border-ink-100'}`}>
      <span className="text-ink-500 shrink-0 w-[110px]">{label}</span>
      <span className={`flex-1 ${muted ? 'text-ink-300' : 'text-ink-900'}`}>{v}</span>
    </div>
  )
}

// ============ Tab：客户信息 ============
function CustomerInfoTab({ subject }) {
  return (
    <>
      {/* 基本信息 */}
      <Section title="基本信息">
        <Row label="客户名称" value={subject.name}/>
        <Row label="客户编号" value={subject.customerCode}/>
        <Row label="集团池" value="--" last/>
      </Section>

      {/* 工商信息 */}
      <Section title="工商信息">
        <Row label="客户全称（全角括号版）" value={subject.name}/>
        <Row label="统一社会信用代码" value={subject.creditCode}/>
        <Row label="账户类型" value={subject.accountType}/>
        <Row label="注册电话" value={subject.phone}/>
        <Row label="开户银行" value="--"/>
        <Row label="开户银行账号" value={subject.bankAccount}/>
        <Row label="注册地址" value="--" last/>
      </Section>

      {/* 其他信息 */}
      <Section title="其他信息">
        <Row label="所属行业" value={subject.industry}/>
        <Row label="客户备注" value={subject.remark} last/>
      </Section>
    </>
  )
}

// ============ Tab：项目（钉钉式卡片：搜索 + 项目卡片 + 分页）============
function ProjectTab({ subject }) {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5
  // 当前主体关联的项目（演示用：mock 数据未建关联，展示全部）
  const filtered = projectsData
  const data = filtered.filter(p => !keyword || p.name?.includes(keyword))
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 项目卡片字段（按截图 10 列）
  const PROJECT_FIELDS = [
    { label: '编码' },
    { label: '内部自动编码' },
    { label: '销售控制等级' },
    { label: '活跃状态', type: 'tag' },
    { label: '客户集团名称' },
    { label: '项目编号' },
    { label: '销售人姓名' },
    { label: '创建时间' },
    { label: '更新时间' },
  ]

  return (
    <div className="px-3 pt-3">
      {/* 钉钉式搜索条（单输入） */}
      <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
        <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
          placeholder="项目名称"
          className="flex-1 h-8 bg-ink-50 rounded-full px-3 text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
        <button className="w-8 h-8 flex items-center justify-center tap shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
            <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 项目卡片列表 */}
      {paged.length === 0 ? (
        <EmptyCard/>
      ) : (
        <div className="space-y-2">
          {paged.map((p, i) => (
            <RelationCard
              key={i}
              title={p.name}
              subtitle={`项目编号: ${p.projectId || '--'}`}
              fields={PROJECT_FIELDS.map(f => ({ ...f, value: p[f.label === '活跃状态' ? 'status' : f.label.replace(/[（()].*/, '').replace('客户集团名称', 'groupName').replace('项目编号', 'projectId').replace('销售人姓名', 'salesName').replace('创建时间', 'created').replace('更新时间', 'updated').replace('编码', 'code').replace('内部自动编码', 'internalCode').replace('销售控制等级', 'level')] }))}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {data.length > 0 && <MobilePagination total={data.length} page={page} pageSize={PAGE_SIZE} totalPages={totalPages} onChange={setPage}/>}
    </div>
  )
}

// ============ Tab：政策（钉钉式卡片：搜索 + 政策卡片 + 分页）============
function PolicyTab({ subject }) {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5
  // 当前主体关联的政策（演示用：mock 数据未建关联，展示全部）
  const filtered = groupPoliciesData
  const data = filtered.filter(p => !keyword || p.name?.includes(keyword))
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 政策卡片字段（按截图 20 列，取主要字段展示）
  const POLICY_FIELDS = [
    { label: '付款方式', key: 'payType' },
    { label: '返点比例', key: 'rebateRate' },
    { label: '首负预付金额', key: 'firstRecharge' },
    { label: '预付资金金额', key: 'prepaidAmount' },
    { label: '合作情况', key: 'coopMode' },
    { label: '项目编号', key: 'projectCode' },
    { label: '客户行业', key: 'industry' },
    { label: '账政策期限(天)', key: 'creditDays' },
    { label: '客户类型', key: 'customerType' },
    { label: '竞价类型', key: 'bidType' },
    { label: '备注', key: 'remark' },
    { label: '客户名称', key: 'customerName' },
    { label: '服务课比例', key: 'serviceRate' },
    { label: '集团名称', key: 'groupName' },
    { label: '创建人', key: 'creator' },
    { label: '媒体平台', key: 'platform' },
    { label: '媒介开开人', key: 'agentName' },
    { label: '创建时间', key: 'created' },
    { label: '更新时间', key: 'updated' },
  ]

  return (
    <div className="px-3 pt-3">
      {/* 钉钉式搜索条 */}
      <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-2 mb-3">
        <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1) }}
          placeholder="政策名称"
          className="flex-1 h-8 bg-ink-50 rounded-full px-3 text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
        <button className="w-8 h-8 flex items-center justify-center tap shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#2D7FF9" strokeWidth="2"/>
            <path d="M16 16l4 4" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 政策卡片列表 */}
      {paged.length === 0 ? (
        <EmptyCard/>
      ) : (
        <div className="space-y-2">
          {paged.map((p, i) => (
            <RelationCard
              key={i}
              title={p.name}
              subtitle={`集团: ${p.groupName || '--'}`}
              fields={POLICY_FIELDS.map(f => ({ label: f.label, value: p[f.key], type: f.type }))}
            />
          ))}
        </div>
      )}

      {data.length > 0 && <MobilePagination total={data.length} page={page} pageSize={PAGE_SIZE} totalPages={totalPages} onChange={setPage}/>}
    </div>
  )
}

// ============ Tab：主体（钉钉式高级搜索：字段切换 + 输入 + chip 多维筛选 + 漏斗）============
function MainSubjectTab({ subject }) {
  const nav = useNavigate()
  // 行 1 字段切换
  const [fieldKey, setFieldKey] = useState('name')
  const [fieldDrawerOpen, setFieldDrawerOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  // 行 2 chip 多维
  const [platform, setPlatform] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const FIELD_OPTIONS = [
    { key: 'name', label: '开户主体名称' },
    { key: 'id', label: '开户主体 ID' },
    { key: 'customerCode', label: '客户编号' },
  ]
  const PLATFORM_OPTIONS = ['巨量引擎', '磁力金牛', '千川', 'TikToK', '腾讯广告', '聚光']
  const GROUP_OPTIONS = Array.from(new Set(customersData.map(c => c.groupName).filter(Boolean)))
  const currentField = FIELD_OPTIONS.find(f => f.key === fieldKey)

  // 主体列表：以同集团下的客户作为「开户主体」
  const allMainSubjects = customersData.filter(c => c.groupName === subject.groupName)
  const data = allMainSubjects.filter(c => {
    if (keyword) {
      const v = fieldKey === 'name' ? c.name : fieldKey === 'id' ? c.id : c.customerCode
      if (!v?.includes(keyword)) return false
    }
    if (groupFilter && c.groupName !== groupFilter) return false
    return true
  })
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const paged = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="px-3 pt-3">
      {/* 钉钉式高级搜索卡（2 行） */}
      <div className="card mb-3">
        {/* 第 1 行：字段切换 + 输入 + 🔍 */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={() => setFieldDrawerOpen(true)}
            className="h-9 px-3 bg-ink-50 rounded-full text-[12px] text-ink-900 flex items-center justify-between gap-1 tap shrink-0 min-w-[100px]">
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

        {/* 第 2 行：2 chip + 漏斗 */}
        <div className="flex items-center gap-2 px-3 pb-2.5 relative z-30">
          <ChipSelect value={platform} onChange={setPlatform} placeholder="媒体平台" options={PLATFORM_OPTIONS}/>
          <ChipSelect value={groupFilter} onChange={v => { setGroupFilter(v); setPage(1) }} placeholder="集团" options={GROUP_OPTIONS}/>
          <button onClick={() => setFilterOpen(true)}
            className="ml-auto w-9 h-9 bg-ink-50 rounded-full flex items-center justify-center tap shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 头部条：新增主体（右对齐） */}
      <div className="flex items-center justify-end mb-2">
        <button onClick={() => nav('/account/create')} className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          新增主体
        </button>
      </div>

      {/* 主体卡片列表 */}
      {paged.length === 0 ? (
        <EmptyCard/>
      ) : (
        <div className="space-y-2">
          {paged.map((c, i) => (
            <RelationCard
              key={i}
              title={c.name}
              subtitle={`主体编号: ${c.id} · 客户编号: ${c.customerCode || '--'}`}
              fields={[
                { label: '媒体平台', value: '--' },
                { label: '集团名称', value: c.groupName },
                { label: '注册时间', value: c.oaDate === '0000-00-00' ? '--' : c.oaDate },
                { label: '创建人', value: c.creator },
                { label: '创建时间', value: c.created },
                { label: '更新时间', value: c.updated },
              ]}
            />
          ))}
        </div>
      )}

      {data.length > 0 && <MobilePagination total={data.length} page={page} pageSize={PAGE_SIZE} totalPages={totalPages} onChange={setPage}/>}

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
        <AccountAdvancedFilter
          platform={platform}
          setPlatform={setPlatform}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          platformOptions={PLATFORM_OPTIONS}
          groupOptions={GROUP_OPTIONS}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  )
}

// ============ 主体高级筛选弹窗 ============
function AccountAdvancedFilter({ platform, setPlatform, groupFilter, setGroupFilter, platformOptions, groupOptions, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl h-[60vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">高级筛选</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <div className="text-[12px] text-ink-500 mb-2">媒体平台</div>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map(p => (
                <button key={p} onClick={() => setPlatform(platform === p ? '' : p)}
                  className={`h-7 px-3 rounded-full text-[12px] tap ${platform === p ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-ink-500 mb-2">集团</div>
            <div className="flex flex-wrap gap-2">
              {groupOptions.map(g => (
                <button key={g} onClick={() => setGroupFilter(groupFilter === g ? '' : g)}
                  className={`h-7 px-3 rounded-full text-[12px] tap ${groupFilter === g ? 'bg-brand text-white' : 'bg-ink-50 text-ink-700'}`}>{g}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={() => { setPlatform(''); setGroupFilter('') }} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">重 置</button>
          <button onClick={onClose} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
        </div>
      </div>
    </div>
  )
}

// ============ ChipSelect ============
function ChipSelect({ value, onChange, placeholder, options }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`h-9 px-3 rounded-full text-[12px] flex items-center gap-1 tap shrink-0 max-w-[140px] ${value ? 'bg-brand/10 text-brand' : 'bg-ink-50 text-ink-700'}`}>
        <span className="truncate">{value || placeholder}</span>
        <span className="text-ink-400 text-[10px] shrink-0">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute top-full left-0 mt-1 min-w-[140px] bg-white border border-ink-100 rounded shadow-lg z-50 max-h-[200px] overflow-y-auto scrollbar-hide">
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false) }}
                className={`block w-full text-left px-3 py-2 text-[12px] hover:bg-ink-50 ${value === o ? 'text-brand' : 'text-ink-700'}`}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============ FieldDrawer ============
function FieldDrawer({ fields, currentKey, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl max-h-[60vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
          <h2 className="text-[15px] font-medium text-ink-900">选择搜索字段</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {fields.map(f => (
            <button key={f.key} onClick={() => onSelect(f.key)}
              className={`w-full text-left px-3 py-2.5 rounded text-[13px] flex items-center justify-between tap ${currentKey === f.key ? 'text-brand font-medium' : 'text-ink-700'}`}>
              <span>{f.label}</span>
              {currentKey === f.key && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5 9-11" stroke="#2D7FF9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ 通用关系卡片（钉钉式：标题 + 副标题 + 2 列字段 + 可选底部）============
function RelationCard({ title, subtitle, fields, footer }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 标题区 */}
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[15px] font-medium text-ink-900 leading-tight truncate">{title || '--'}</div>
        {subtitle && <div className="text-[11px] text-ink-400 mt-0.5">{subtitle}</div>}
      </div>

      {/* 字段网格（2 列） */}
      <div className="px-4 py-2.5 grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
        {fields.map((f, i) => (
          <FieldItem key={i} field={f} value={f.value}/>
        ))}
      </div>

      {/* 底部操作（可选） */}
      {footer && (
        <div className="border-t border-ink-100 px-4 py-2 flex items-center justify-end">
          {footer}
        </div>
      )}
    </div>
  )
}

// ============ 字段项 ============
function FieldItem({ field, value }) {
  const v = value == null || value === '' || value === '--' ? '--' : value
  const muted = v === '--'
  if (field.type === 'tag' && !muted) {
    const colorMap = { '活跃': 'success', '生效': 'success', '生效中': 'success', '待生效': 'warning', '已过期': 'gray' }
    const c = colorMap[v] || 'gray'
    const colorClass = c === 'success' ? 'bg-success/10 text-success' : c === 'warning' ? 'bg-warning/10 text-warning' : 'bg-ink-100 text-ink-700'
    return (
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-ink-500 shrink-0">{field.label}</span>
        <span className={`inline-block px-1.5 h-[18px] leading-[18px] text-[11px] rounded ${colorClass}`}>{v}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-ink-500 shrink-0">{field.label}</span>
      <span className={`flex-1 truncate ${muted ? 'text-ink-300' : 'text-ink-900'}`}>{v}</span>
    </div>
  )
}

// ============ 空状态卡片 ============
function EmptyCard() {
  return (
    <div className="bg-white rounded-lg py-16 text-center">
      <div className="text-[40px] mb-2 opacity-30">📋</div>
      <div className="text-[13px] text-ink-400">暂无数据</div>
    </div>
  )
}

// ============ 移动端分页 ============
function MobilePagination({ total, page, pageSize, totalPages, onChange }) {
  if (total === 0) return null
  return (
    <div className="flex items-center justify-between px-2 py-4 mt-2">
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