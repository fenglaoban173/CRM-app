import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { findNode } from '../../data/mock'

/**
 * 新增开户主体 - 表单页
 * 来源：PC 新增主体弹窗（截图）
 * 字段：开户主体ID / 媒体平台 / 开户主体名称 / 注册时间 / 集团 / 是否使用 VPN
 */
export default function AccountCreatePage() {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    accountId: '',
    platform: '',
    name: '',
    registerDate: '',
    groupName: '',
    useVpn: '否',
  })
  const set = (k, v) => setForm(s => ({ ...s, [k]: v }))

  const PLATFORM_OPTIONS = ['巨量引擎', '磁力金牛', '千川', 'TikToK', '腾讯广告', '聚光']
  const listNode = findNode(99)
  const GROUP_OPTIONS = (listNode?.data || []).map(g => g.name).filter(Boolean)

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title={isEdit ? '编辑开户主体' : '新增开户主体'} onBack={() => nav(-1)}/>

      {/* 顶部小标题：新增主体 */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-[15px] font-medium text-ink-900">{isEdit ? '编辑主体' : '新增主体'}</h2>
      </div>

      {/* 开户主体信息 */}
      <Section title="开户主体信息">
        <Field label="开户主体 ID" required>
          <input className="form-input" value={form.accountId} onChange={e => set('accountId', e.target.value)} placeholder="请输入开户主体 ID（数字）"/>
        </Field>
        <Field label="媒体平台" required>
          <SelectField value={form.platform} onChange={v => set('platform', v)} placeholder="请选择媒体平台" options={PLATFORM_OPTIONS}/>
        </Field>
        <Field label="开户主体名称" required>
          <div className="relative">
            <input className="form-input pr-12" value={form.name} onChange={e => set('name', e.target.value)} placeholder="1-255 字符" maxLength={255}/>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-400 pointer-events-none">{form.name.length}/255</span>
          </div>
        </Field>
        <Field label="注册时间" required>
          <DateField value={form.registerDate} onChange={v => set('registerDate', v)} placeholder="选择注册时间"/>
        </Field>
        <Field label="集团" last>
          <SelectField value={form.groupName} onChange={v => set('groupName', v)} placeholder="请选择集团" options={GROUP_OPTIONS}/>
        </Field>
      </Section>

      {/* VPN 设置 */}
      <Section title="VPN 设置">
        <Field label="是否使用 VPN" last>
          <RadioGroup value={form.useVpn} onChange={v => set('useVpn', v)} options={[{ value: '否', label: '否' }, { value: '是', label: '是' }]}/>
        </Field>
      </Section>

      {/* 底部固定按钮（取消 + 提交蓝色，与新建集团一致） */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
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

// ============ 字段 ============
function Field({ label, required, last, children }) {
  return (
    <div className={`pt-3 pb-1 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">
        {required && <span className="text-danger mr-1">*</span>}
        {label}
      </div>
      {children}
    </div>
  )
}

// ============ 选择字段 ============
function SelectField({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        className="form-input appearance-none pr-8"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// ============ 日期字段（PC 截图样式：📅 icon + 选择注册时间）============
function DateField({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input className="form-input pr-10" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="#999" strokeWidth="1.6"/>
        <path d="M3 9h18M8 3v4M16 3v4" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ============ 单选组（钉钉式：圆形 + 文字，统一品牌蓝）============
function RadioGroup({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-6 py-1">
      {options.map(o => {
        const selected = value === o.value
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)} className="flex items-center gap-1.5 tap">
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${selected ? 'border-brand' : 'border-ink-300'}`}>
              {selected && <span className="w-2 h-2 rounded-full bg-brand"/>}
            </span>
            <span className={`text-[13px] ${selected ? 'text-brand' : 'text-ink-700'}`}>{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}