import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '首页', icon: 'home' },
  // { to: '/reports', label: '报表', icon: 'chart' },
  { to: '/work', label: '工作', icon: 'briefcase' },
  { to: '/m/2278', label: '审批', icon: 'check' },
  { to: '/me', label: '我的', icon: 'user' },
]

const icons = {
  home: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z"
        stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chart: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  briefcase: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8"/>
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  check: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8"/>
      <path d="M7 12l3 3 7-7" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  user: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8"/>
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" stroke={active ? '#2D7FF9' : '#999'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
}

export default function TabBar() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-ink-100 flex items-center justify-around z-50">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) =>
            `tap flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
              isActive ? 'text-brand' : 'text-ink-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {icons[t.icon](isActive)}
              <span className="text-[11px]">{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
