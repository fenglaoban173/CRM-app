import dayjs from 'dayjs'

/**
 * 安卓手机外壳组件
 * - PC 浏览器打开时：手机居中显示，外围浅色背景
 * - 手机壳含状态栏（mock 时间/信号/电量）和导航栏（三金刚）
 */
export default function PhoneFrame({ children }) {
  const time = dayjs().format('HH:mm')
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-ink-100 to-ink-200 flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:w-[390px] h-screen sm:h-[844px] bg-white sm:rounded-[40px] sm:shadow-app overflow-hidden flex flex-col">
        {/* 安卓状态栏 */}
        <div className="h-7 bg-white flex items-center justify-between px-5 text-[12px] text-ink-900 font-medium shrink-0">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            {/* 信号 */}
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <rect x="0" y="7" width="2.5" height="4" rx="0.5" fill="currentColor"/>
              <rect x="3.5" y="5" width="2.5" height="6" rx="0.5" fill="currentColor"/>
              <rect x="7" y="3" width="2.5" height="8" rx="0.5" fill="currentColor"/>
              <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" fill="currentColor"/>
            </svg>
            {/* WiFi */}
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path d="M7 9.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="currentColor"/>
              <path d="M2.4 4.2a6.5 6.5 0 019.2 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M0 2a10 10 0 0114 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {/* 电池 */}
            <div className="flex items-center">
              <div className="w-6 h-3 border border-ink-900 rounded-sm relative flex items-center px-[1px]">
                <div className="h-2 bg-ink-900 rounded-[1px]" style={{ width: '78%' }}/>
              </div>
              <div className="w-[2px] h-1.5 bg-ink-900 rounded-r ml-[1px]"/>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-hidden flex flex-col bg-ink-50">
          {children}
        </div>

        {/* 安卓底部导航栏（三金刚）- 仅桌面端模拟显示 */}
        <div className="hidden sm:flex h-7 bg-white items-center justify-around shrink-0 border-t border-ink-100">
          <button className="w-8 h-1.5 rounded-full bg-ink-900"/>
          <button className="w-8 h-8 rounded-full border border-ink-900 flex items-center justify-center">
            <span className="w-3 h-3 border border-ink-900 rounded-[1px]"/>
          </button>
          <button className="w-8 h-1.5 rounded-full bg-ink-900"/>
        </div>
      </div>
    </div>
  )
}
