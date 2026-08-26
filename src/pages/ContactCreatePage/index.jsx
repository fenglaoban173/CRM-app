import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

/**
 * 新建联系人 - 表单页
 * PC 来源：集团详情联系人 → 新建联系人弹窗
 */
export default function ContactCreatePage() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="新增联系人" onClose={() => nav(-1)}/>

      <div className="mx-3 mt-3 card overflow-hidden">
        <Field label="联系人" required>
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入联系人姓名"
          />
        </Field>
        <Field label="手机号" required last>
          <input
            className="form-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="请输入手机号"
            inputMode="numeric"
            maxLength={11}
          />
        </Field>
      </div>

      {/* 底部固定按钮 */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
      </div>
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ title, onClose }) {
  return (
    <div className="bg-brand text-white sticky top-0 z-30">
      <div className="px-2 h-12 flex items-center justify-between relative">
        <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center tap relative z-10 ml-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ============ 字段 ============
function Field({ label, required, last, children }) {
  return (
    <div className={`px-4 py-3 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">
        {required && <span className="text-danger mr-1">*</span>}
        {label}
      </div>
      {children}
    </div>
  )
}