import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../Reports'
import { todos } from '../../data/mock'

export default function Me() {
  const nav = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="bg-ink-50 pb-4 min-h-screen relative">
      <TopBar title="我的"/>

      {/* 用户卡片 */}
      <div className="bg-brand text-white px-4 pt-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-[24px] font-medium border-2 border-white/30">
            冯
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-medium">冯孙杰</div>
            <div className="text-[12px] opacity-90 mt-1">技术部 / 产品经理</div>
          </div>
          <button className="tap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ============ 我的代办 7 类带数字 ============ */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title justify-between">
          <span>我的代办</span>
          <span className="text-[11px] text-ink-400 ml-auto">共 {todos.reduce((s, t) => s + t.count, 0)} 项</span>
        </div>
        <div className="divide-y divide-ink-100">
          {todos.map(t => (
            <button key={t.id} onClick={() => nav(`${t.target}?from=me`)} className="w-full flex items-center gap-3 px-4 py-3 tap text-left">
              <div className={`w-1 h-7 rounded-full shrink-0 ${
                t.count > 5 ? 'bg-danger' : t.count > 2 ? 'bg-warning' : 'bg-brand'
              }`}/>
              <span className="flex-1 text-[13px] text-ink-900">{t.label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full min-w-[28px] text-center ${
                t.count > 0 ? 'bg-danger/10 text-danger font-medium' : 'bg-ink-100 text-ink-400'
              }`}>{t.count}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ============ 我的工单 ============ */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">
          <span>我的工单</span>
        </div>
        <button onClick={() => nav('/me/workorder?from=me')} className="w-full flex items-center gap-3 px-4 py-3 tap text-left">
          <div className="w-9 h-9 rounded-md bg-brand/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="3" width="14" height="18" rx="1.5" stroke="#2D7FF9" strokeWidth="1.6"/>
              <path d="M9 8h6M9 12h6M9 16h4" stroke="#2D7FF9" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="flex-1 text-[13px] text-ink-900">工单记录</span>
          <span className="text-[11px] text-ink-400">查看全部工单 / 提交新工单</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 设置入口 */}
      <div className="mx-3 mt-3 card overflow-hidden divide-y divide-ink-100">
        <RowItem label="个人信息" value="冯孙杰" onClick={() => nav('/me/personal-info')}/>
        <RowItem label="修改密码" onClick={() => setShowPwd(true)}/>
        <RowItem label="关于 CRM" value="v 1.0.0"/>
        <div className="px-4 py-3 text-center">
          <button className="text-[13px] text-danger tap" onClick={() => nav('/login')}>退出登录</button>
        </div>
      </div>

      {showPwd && (
        <ChangePasswordModal
          onClose={() => setShowPwd(false)}
          onToast={showToast}
        />
      )}

      {toast && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] text-white text-[14px] px-5 py-2.5 rounded-lg bg-black/80">
          {toast}
        </div>
      )}
    </div>
  )
}

function ChangePasswordModal({ onClose, onToast }) {
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')

  const submit = () => {
    if (!pwd || !pwd2) return onToast('请填写完整')
    if (pwd !== pwd2) return onToast('两次密码不一致')
    onToast('密码修改成功')
    setTimeout(onClose, 600)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-100">
          <span className="text-[16px] font-medium text-ink-900">修改密码</span>
          <button className="tap p-1 -mr-1" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="px-5 py-5 space-y-4">
          <Field
            label="新密码"
            value={pwd}
            onChange={setPwd}
          />
          <Field
            label="确认密码"
            value={pwd2}
            onChange={setPwd2}
          />
        </div>

        {/* 底部按钮 */}
        <div className="px-5 pb-4 pt-1 flex items-center gap-3">
          <button
            className="flex-1 h-9 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 tap"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="flex-1 h-9 rounded-md bg-brand text-white text-[14px] tap"
            onClick={submit}
          >
            修改
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-[13px] text-ink-900 shrink-0 w-20 text-right">{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="请输入"
        className="flex-1 px-3 py-2 bg-white border border-ink-200 rounded-md text-[13px] outline-none focus:border-brand"
      />
    </div>
  )
}

function RowItem({ label, value, onClick }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 tap" onClick={onClick}>
      <span className="text-[13px] text-ink-900">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-[12px] text-ink-400">{value}</span>}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}