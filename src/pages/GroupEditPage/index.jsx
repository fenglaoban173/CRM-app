import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { findNode } from '../../data/mock'

/**
 * 编辑集团 - 表单页（预填该集团已有数据）
 * 来源：集团列表 PC + 编辑集团弹窗
 */
export default function GroupEditPage() {
  const nav = useNavigate()
  const { id: groupId } = useParams()
  const listNode = findNode(99)
  const group = (listNode?.data || []).find(g => g.id === groupId) || {}

  const [name, setName] = useState(group.name || '')
  const [shortName, setShortName] = useState(group.shortName || '')
  const [rating, setRating] = useState(typeof group.score === 'number' ? group.score : 0)
  const [attr, setAttr] = useState(group.attr || '')
  const [type, setType] = useState(group.groupType || '预付')
  const [tag, setTag] = useState(group.tag || '')
  const [remark, setRemark] = useState(group.remark || '')

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="编辑集团" onBack={() => nav(-1)}/>

      {/* 基本信息 */}
      <Section title="基本信息">
        <Field label="集团简称" required>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="建议3-6个字，不要太简洁"/>
          <p className="text-[11px] text-ink-500 mt-1.5 leading-relaxed">
            1、不要用公司全称作为集团名称，尽量用简称。<br/>
            2、不要用具体的产品作为集团名称
          </p>
        </Field>
        <Field label="集团简称（看板分析）" required last>
          <input className="form-input" value={shortName} onChange={e => setShortName(e.target.value)} placeholder="请输入客户集团简称"/>
        </Field>
      </Section>

      {/* 评级与分类 */}
      <Section title="评级与分类">
        <Field label="集团综合评级">
          <StarRating value={rating} onChange={setRating}/>
        </Field>
        <Field label="集团属性" required>
          <SelectField value={attr} onChange={setAttr} placeholder="请选择集团属性"
            options={['二代', '非二代']}/>
        </Field>
        <Field label="集团类型" required last>
          <SelectField value={type} onChange={setType}
            options={['预付', '后付']}/>
        </Field>
      </Section>

      {/* 标签 + 备注 */}
      <Section title="其他信息">
        <Field label="标签">
          <input className="form-input" value={tag} onChange={e => setTag(e.target.value)} placeholder="请输入标签"/>
        </Field>
        <Field label="集团备注" last>
          <textarea className="form-input min-h-[80px] py-2 leading-relaxed" value={remark} onChange={e => setRemark(e.target.value)} placeholder="请输入备注" rows={3}/>
        </Field>
      </Section>

      {/* 附件 */}
      <Section title="附件">
        <UploadButton/>
      </Section>

      {/* 底部固定按钮（取消/确定 → 返回上一级） */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确 定</button>
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

// ============ 星级评分（钉钉式 + 文字）============
function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center py-1.5">
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(i => (
          <button key={i} type="button" onClick={() => onChange(i)} className="tap">
            <svg width="24" height="24" viewBox="0 0 24 24"
              fill={i <= value ? '#FFB400' : 'none'}
              stroke={i <= value ? '#FFB400' : '#C9CDD4'}
              strokeWidth="1.5" strokeLinejoin="round">
              <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z"/>
            </svg>
          </button>
        ))}
      </div>
      <span className="text-[12px] text-ink-500 ml-3">
        {value > 0 ? `${value} 星` : '未评分'}
      </span>
    </div>
  )
}

// ============ 选择字段（下拉）============
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

// ============ 上传附件按钮（钉钉式虚线 + 品牌色）============
function UploadButton() {
  return (
    <button type="button" className="h-10 px-4 border border-dashed border-brand/40 bg-brand/5 rounded text-[13px] text-brand flex items-center gap-2 tap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v12M6 10l6-6 6 6M4 18v2h16v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      上传附件
    </button>
  )
}