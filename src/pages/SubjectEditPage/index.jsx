import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { customersData, findNode } from '../../data/mock'

/**
 * 主体编辑/新建页面
 * 来源：主体管理 PC + 主体编辑弹窗
 * - /subject/edit/:id   → 编辑（按 id 预填）
 * - /subject/create     → 新建（空白）
 */
export default function SubjectEditPage() {
  const nav = useNavigate()
  const { id: subjectId } = useParams()
  const isEdit = Boolean(subjectId)
  const subject = isEdit ? customersData.find(c => c.id === subjectId) || {} : {}

  // 集团池 chip 列表（多选）
  const listNode = findNode(99)
  const allGroups = (listNode?.data || []).map(g => g.name).filter(Boolean)
  const [groupPools, setGroupPools] = useState(subject.groupName ? [subject.groupName] : [])
  const [poolOpen, setPoolOpen] = useState(false)

  const [form, setForm] = useState({
    name: subject.name || '',
    fullName: subject.name || '',
    creditCode: subject.creditCode || '',
    accountType: subject.accountType || '',
    phone: subject.phone || '',
    bankName: '',
    bankAccount: subject.bankAccount || '',
    registerAddress: '',
    industry: subject.industry || '',
    remark: subject.remark || '',
  })
  const set = (k, v) => setForm(s => ({ ...s, [k]: v }))

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title={isEdit ? '编辑主体' : '新建主体'} onBack={() => nav(-1)}/>

      {/* 基础信息 */}
      <Section title="基础信息">
        <Field label="客户名称" required>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="请输入客户名称"/>
        </Field>
        <Field label="集团池" required last>
          {/* chip 多选 */}
          <div className="flex items-center flex-wrap gap-2 min-h-[36px] px-2 py-1 bg-ink-50 rounded">
            {groupPools.map(g => (
              <span key={g} className="inline-flex items-center gap-1 h-7 px-2 bg-white border border-ink-200 rounded text-[12px] text-ink-900">
                {g}
                <button onClick={() => setGroupPools(groupPools.filter(x => x !== g))} className="w-4 h-4 flex items-center justify-center tap">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </span>
            ))}
            <button onClick={() => setPoolOpen(true)} className="text-[12px] text-brand tap">+ 添加</button>
          </div>
        </Field>
      </Section>

      {/* 工商信息 */}
      <Section title="工商信息">
        <Field label="客户名称" last>
          <input className="form-input" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="请输入客户全称"/>
        </Field>
        <Field label="统一社会信用代码">
          <input className="form-input" value={form.creditCode} onChange={e => set('creditCode', e.target.value)} placeholder="请输入统一社会信用代码"/>
        </Field>
        <Field label="账户类型">
          <SelectField value={form.accountType} onChange={v => set('accountType', v)} placeholder="可手动搜索" options={['对公账户', '对私账户']}/>
        </Field>
        <Field label="注册电话">
          <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="请输入注册电话"/>
        </Field>
        <Field label="开户银行">
          <input className="form-input" value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="请输入开户银行"/>
        </Field>
        <Field label="开户银行账号">
          <input className="form-input" value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="请输入开户银行账号"/>
        </Field>
        <Field label="注册地址" last>
          <input className="form-input" value={form.registerAddress} onChange={e => set('registerAddress', e.target.value)} placeholder="请输入注册地址"/>
        </Field>
      </Section>

      {/* 其他信息 */}
      <Section title="其他信息">
        <Field label="所属行业">
          <SelectField value={form.industry} onChange={v => set('industry', v)} placeholder="暂无" options={['互联网', '电商', '广告', '文化', '医疗', '食品', '美业']}/>
        </Field>
        <Field label="客户备注" last>
          <textarea className="form-input min-h-[80px] py-2 leading-relaxed" value={form.remark} onChange={e => set('remark', e.target.value)} placeholder="请输入客户备注" rows={3}/>
        </Field>
      </Section>

      {/* 底部按钮 */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
      </div>

      {/* 集团池多选弹窗 */}
      {poolOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-end" onClick={() => setPoolOpen(false)}>
          <div className="w-full bg-white rounded-t-2xl h-[60vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100">
              <h2 className="text-[15px] font-medium text-ink-900">选择集团池</h2>
              <button onClick={() => setPoolOpen(false)} className="w-7 h-7 flex items-center justify-center tap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {allGroups.map(g => {
                const selected = groupPools.includes(g)
                return (
                  <label key={g} onClick={() => setGroupPools(selected ? groupPools.filter(x => x !== g) : [...groupPools, g])}
                    className="flex items-center gap-2 px-2 py-2 rounded tap cursor-pointer">
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${selected ? 'bg-brand border-brand' : 'border-ink-200'}`}>
                      {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span className="text-[13px] text-ink-900">{g}</span>
                  </label>
                )
              })}
            </div>
            <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
              <button onClick={() => setGroupPools([])} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">清 空</button>
              <button onClick={() => setPoolOpen(false)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 认</button>
            </div>
          </div>
        </div>
      )}
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