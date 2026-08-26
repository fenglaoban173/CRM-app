import { useState } from 'react'

/**
 * 通用表单 UI 套件（参考 AccountCreatePage/GroupCreatePage 提取）
 *  - TopBar / Section / Field / SelectField / DateField / RadioGroup
 *  钉钉式风格：白卡 + 圆角输入 + 底部 sticky 按钮
 */

export function TopBar({ title, onBack, right }) {
  return (
    <div className="bg-white border-b border-ink-100 flex items-center justify-between px-2 h-12 sticky top-0 z-30">
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center tap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="text-[15px] font-medium text-ink-900">{title}</div>
      <div className="w-9 h-9 flex items-center justify-center">{right}</div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title">{title}</div>
      <div>{children}</div>
    </div>
  )
}

export function Field({ label, required, last, children }) {
  return (
    <div className={`flex items-center px-4 py-3 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="w-[100px] shrink-0 text-[13px] text-ink-700">
        {required && <span className="text-danger mr-0.5">*</span>}
        {label}
      </div>
      <div className="flex-1 min-w-0 text-[13px] text-ink-900">{children}</div>
    </div>
  )
}

export function SelectField({ value, onChange, placeholder, options = [] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative w-full">
      <button onClick={() => setOpen(o => !o)}
        className={`w-full h-9 px-3 bg-ink-50 rounded text-[13px] flex items-center justify-between tap ${value ? 'text-ink-900' : 'text-ink-400'}`}>
        <span className="truncate">{value || placeholder || '请选择'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ink-100 rounded-lg shadow-lg z-50 max-h-[220px] overflow-y-auto py-1">
            <button onClick={() => { onChange(''); setOpen(false) }}
              className={`w-full px-3 py-2 text-left text-[13px] tap ${!value ? 'text-brand bg-brand/5' : 'text-ink-700'}`}>
              全部
            </button>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-[13px] tap ${value === o ? 'text-brand bg-brand/5' : 'text-ink-700'}`}>
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function DateField({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full">
      <input type="date" value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-9 px-3 bg-ink-50 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-brand ${value ? 'text-ink-900' : 'text-ink-400'}`}/>
    </div>
  )
}

export function RadioGroup({ value, onChange, options = [] }) {
  return (
    <div className="flex items-center gap-4">
      {options.map(o => (
        <label key={o.value} className="flex items-center gap-1.5 cursor-pointer tap">
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${value === o.value ? 'border-brand' : 'border-ink-200'}`}>
            {value === o.value && <span className="w-2 h-2 rounded-full bg-brand"/>}
          </span>
          <span className="text-[13px] text-ink-700">{o.label}</span>
        </label>
      ))}
    </div>
  )
}

/**
 * 底部 sticky 按钮（取消 / 提交）
 */
export function FormActions({ onCancel, onSubmit, submitText = '提 交' }) {
  return (
    <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
      <button onClick={onCancel}
        className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
      <button onClick={onSubmit}
        className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">{submitText}</button>
    </div>
  )
}