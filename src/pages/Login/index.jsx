import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()
  const [phone, setPhone] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState({ phone: '', pwd: '' })
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const submit = () => {
    const e = { phone: '', pwd: '' }
    if (!phone) e.phone = '请输入手机号'
    else if (!/^1[3-9]\d{9}$/.test(phone)) e.phone = '请输入正确的手机号'
    if (!pwd) e.pwd = '请输入密码'
    else if (pwd.length < 6) e.pwd = '密码至少 6 位'
    setError(e)
    if (e.phone || e.pwd) return
    showToast('登录成功')
    setTimeout(() => nav('/work'), 600)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ===== 上 2/3 蓝色背景 ===== */}
      <div className="relative" style={{ flex: '2 1 0%', background: 'linear-gradient(180deg, #1E5FD8 0%, #2D7FF9 60%, #4A95FF 100%)' }}>
        {/* 装饰光晕 */}
        <div className="absolute top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"/>
        <div className="absolute top-48 -left-12 w-48 h-48 rounded-full bg-cyan-300/15 blur-3xl pointer-events-none"/>

        {/* 装饰圆点 */}
        <svg className="absolute top-16 left-6 pointer-events-none" width="60" height="40" viewBox="0 0 60 40" fill="none">
          <circle cx="6"  cy="10" r="1"   fill="white" fillOpacity="0.4"/>
          <circle cx="22" cy="6"  r="1.4" fill="white" fillOpacity="0.5"/>
          <circle cx="40" cy="16" r="0.8" fill="white" fillOpacity="0.6"/>
          <circle cx="52" cy="6"  r="1.2" fill="white" fillOpacity="0.45"/>
          <circle cx="48" cy="28" r="1"   fill="white" fillOpacity="0.55"/>
        </svg>
        <svg className="absolute top-40 right-8 pointer-events-none" width="50" height="30" viewBox="0 0 50 30" fill="none">
          <circle cx="6"  cy="6"  r="1.2" fill="#7DD3FC" fillOpacity="0.6"/>
          <circle cx="22" cy="18" r="1"   fill="#7DD3FC" fillOpacity="0.5"/>
          <circle cx="40" cy="10" r="1.4" fill="#7DD3FC" fillOpacity="0.7"/>
        </svg>

        {/* 顶部 logo */}
        <div className="relative z-10 pt-12 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="央广"
            className="h-12 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* 主标题 */}
        <div className="relative z-10 mt-10 text-center text-white px-7">
          <div className="text-[30px] font-bold leading-tight tracking-wide">CRM管理系统</div>
          <div className="text-[14px] text-white/90 mt-3 tracking-wider">开户、投放、消耗、返点，一屏掌控</div>
        </div>
      </div>

      {/* ===== 下 1/3 白色背景 + 表单卡 ===== */}
      <div className="relative bg-white flex flex-col" style={{ flex: '1 1 0%', minHeight: '380px' }}>
        <div className="px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl px-8 py-12 shadow-[0_8px_32px_rgba(10,37,64,0.18)]">
            {/* 手机号 */}
            <div>
              <div className="flex items-center gap-2.5 px-5 h-16 rounded-full border border-ink-200 bg-white">
                <PersonIcon color="#4E5969"/>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); if (error.phone) setError(s => ({ ...s, phone: '' })) }}
                  placeholder="手机号"
                  maxLength={11}
                  className="flex-1 bg-transparent border-0 outline-none text-[17px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
                />
                {phone && (
                  <button type="button" onClick={() => { setPhone(''); setError(s => ({ ...s, phone: '' })) }} className="tap p-0.5 text-ink-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
              {error.phone && <div className="text-[11px] text-danger mt-1.5 ml-4">{error.phone}</div>}
            </div>

            {/* 密码 */}
            <div className="mt-5">
              <div className="flex items-center gap-2 px-5 h-16 rounded-full border border-ink-200 bg-white">
                <LockIcon color="#4E5969"/>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={e => { setPwd(e.target.value); if (error.pwd) setError(s => ({ ...s, pwd: '' })) }}
                  placeholder="密码"
                  maxLength={20}
                  className="flex-1 bg-transparent border-0 outline-none text-[17px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-0"
                />
                {pwd && (
                  <button type="button" onClick={() => setPwd('')} className="tap p-0.5 text-ink-400" aria-label="清除">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
                <button type="button" onClick={() => setShowPwd(s => !s)} className="tap p-0.5 text-ink-400" aria-label={showPwd ? '隐藏密码' : '显示密码'}>
                  {showPwd ? <EyeOff/> : <Eye/>}
                </button>
              </div>
              {error.pwd && <div className="text-[11px] text-danger mt-1.5 ml-4">{error.pwd}</div>}
            </div>

            {/* 登录按钮 */}
            <button onClick={submit}
                className="w-full h-16 mt-8 text-white rounded-full text-[17px] font-medium active:opacity-90 tap shadow-[0_4px_16px_rgba(45,127,249,0.4)]"
                style={{ background: 'linear-gradient(135deg, #2D7FF9 0%, #1A5FCC 100%)' }}>
              登录工作台
            </button>
          </div>
        </div>

        {/* 底部备案 — 推到页面最下 */}
        <div className="mt-auto text-center pb-6 pt-6">
          <div className="text-[10px] text-ink-400">v1.0.0  ·  央广时代（北京）文化传播有限公司</div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-white text-[14px] px-5 py-2.5 rounded-lg bg-black/80">
          {toast}
        </div>
      )}
    </div>
  )
}

// ============ icons ============
function Eye() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function EyeOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18M10.6 6.1A11.7 11.7 0 0112 6c7 0 11 7 11 7a18 18 0 01-3.4 4.2M6.6 6.6C3.4 8.6 1 12 1 12s4 7 11 7c1.6 0 3-.3 4.3-.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9.9 9.9a3 3 0 004.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}
function PersonIcon({ color = '#fff' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.6"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function LockIcon({ color = '#fff' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth="1.6"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}