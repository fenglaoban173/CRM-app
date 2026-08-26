import { useNavigate } from 'react-router-dom'

// 当前登录用户信息
const CURRENT_USER = {
  id: 1,
  name: '冯孙杰',
  dept: '技术部',
  company: '北京央广时代',
  position: '产品经理',
  phone: '13800138000',
  email: 'fengsunjie@crm.com',
  createdAt: '2025-08-01 09:00:00',
}

export default function PersonalInfo() {
  const nav = useNavigate()
  const u = CURRENT_USER

  return (
    <div className="bg-ink-50 pb-4 min-h-full">
      <TopBar title="个人信息" onBack={() => nav(-1)}/>

      {/* 头像卡片 */}
      <div className="bg-white px-4 py-5 mt-3 mx-3 rounded-lg card">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center border-[3px border-brand/30]">
              <span className="text-[28px] font-medium text-white">{u.name[0]}</span>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-[12px] text-ink-400 mt-2">ID: {u.id}</div>
          </div>
        </div>
      </div>

      {/* 基础信息 */}
      <div className="bg-white mt-3 mx-3 rounded-lg card overflow-hidden">
        <SectionHeader title="基础信息"/>
        <InfoRow label="姓名" value={u.name}/>
        <InfoRow label="部门" value={`${u.dept} / ${u.company}`}/>
        <InfoRow label="职位" value={u.position}/>
      </div>

      {/* 联系信息 */}
      <div className="bg-white mt-3 mx-3 rounded-lg card overflow-hidden">
        <SectionHeader title="联系信息"/>
        <InfoRow label="联系方式" value={u.phone}/>
        <InfoRow label="企业账号" value={u.email}/>
      </div>

      {/* 账号信息 */}
      <div className="bg-white mt-3 mx-3 rounded-lg card overflow-hidden">
        <SectionHeader title="账号信息"/>
        <InfoRow label="注册时间" value={u.createdAt}/>
      </div>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="px-4 py-2.5 bg-ink-50 border-b border-ink-100">
      <span className="text-[12px] font-medium text-ink-700">{title}</span>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 last:border-b-0">
      <span className="text-[13px] text-ink-700 shrink-0">{label}</span>
      <span className="text-[13px] text-ink-900 font-medium text-right truncate ml-3">{value || '--'}</span>
    </div>
  )
}

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
        <div className="w-8 h-8"/>
      </div>
    </div>
  )
}