import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

/**
 * 编辑背调信息 - 表单页
 * PC 来源：集团详情背调信息 → 编辑背调信息弹窗
 */
export default function BackgroundEditPage() {
  const nav = useNavigate()
  const [listed, setListed] = useState(null) // 上市与否
  const [source, setSource] = useState('')
  const [media, setMedia] = useState('')
  const [creditLine, setCreditLine] = useState('')
  const [product, setProduct] = useState('')
  const [establishDate, setEstablishDate] = useState('')
  const [staffScale, setStaffScale] = useState('')
  const [partner, setPartner] = useState('')
  const [dailySpend, setDailySpend] = useState('')
  const [companyBg, setCompanyBg] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [licenseUrl, setLicenseUrl] = useState('')
  const [officeUrl, setOfficeUrl] = useState('')

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="编辑背调信息" onClose={() => nav(-1)}/>

      <div className="mx-3 mt-3 space-y-2">
        {/* 上市与否 + 集团来源 */}
        <Section>
          <Field label="上市与否">
            <RadioGroup
              value={listed}
              onChange={setListed}
              options={[{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
            />
          </Field>
          <Field label="集团来源" last>
            <SelectField value={source} onChange={setSource} placeholder="请选择"
              options={['广告投放', '客户介绍', '市场拓展', '其他']}/>
          </Field>
        </Section>

        {/* 合作媒体 + 申请授信额度 */}
        <Section>
          <Field label="合作媒体">
            <input className="form-input" value={media} onChange={e => setMedia(e.target.value)} placeholder="请输入合作媒体"/>
          </Field>
          <Field label="申请授信额度" last>
            <SuffixInput value={creditLine} onChange={setCreditLine} placeholder="（单位万）" suffix="万"/>
          </Field>
        </Section>

        {/* 投放产品 + 成立时间 */}
        <Section>
          <Field label="投放产品">
            <input className="form-input" value={product} onChange={e => setProduct(e.target.value)} placeholder="请输入投放产品"/>
          </Field>
          <Field label="成立时间" last>
            <DateField value={establishDate} onChange={setEstablishDate}/>
          </Field>
        </Section>

        {/* 人员规模 + 合作代理 */}
        <Section>
          <Field label="人员规模">
            <SelectField value={staffScale} onChange={setStaffScale} placeholder="请选择"
              options={['1-10 人', '11-50 人', '51-200 人', '201-500 人', '500 人以上']}/>
          </Field>
          <Field label="合作代理" last>
            <input className="form-input" value={partner} onChange={e => setPartner(e.target.value)} placeholder="请输入合作代理"/>
          </Field>
        </Section>

        {/* 预估日消耗 + 公司背景 */}
        <Section>
          <Field label="预估日消耗">
            <SuffixInput value={dailySpend} onChange={setDailySpend} placeholder="（单位万）" suffix="万"/>
          </Field>
          <Field label="公司背景" last>
            <textarea className="form-input min-h-[80px] py-2 leading-relaxed" value={companyBg} onChange={e => setCompanyBg(e.target.value)} placeholder="请输入公司背景" rows={3}/>
          </Field>
        </Section>

        {/* 图片上传区 */}
        <Section title="资质材料">
          <UploadField label="公司logo" url={logoUrl} onChange={setLogoUrl}/>
          <UploadField label="营业执照" url={licenseUrl} onChange={setLicenseUrl}/>
          <UploadField label="办公场景" url={officeUrl} onChange={setOfficeUrl} last/>
        </Section>
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

// ============ 区块 ============
function Section({ title, children }) {
  return (
    <div className="card overflow-hidden">
      {title && <div className="group-title">{title}</div>}
      <div className={title ? 'pb-2' : ''}>{children}</div>
    </div>
  )
}

// ============ 字段 ============
function Field({ label, last, children }) {
  return (
    <div className={`px-4 py-3 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">{label}</div>
      {children}
    </div>
  )
}

// ============ 单选 ============
function RadioGroup({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-5 py-1.5">
      {options.map(o => (
        <label key={o.value} className="flex items-center gap-1.5 cursor-pointer">
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${value === o.value ? 'border-brand' : 'border-ink-200'}`}>
            {value === o.value && <span className="w-2 h-2 rounded-full bg-brand"/>}
          </span>
          <span className="text-[13px] text-ink-900">{o.label}</span>
        </label>
      ))}
    </div>
  )
}

// ============ 下拉 ============
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

// ============ 后缀输入 ============
function SuffixInput({ value, onChange, placeholder, suffix }) {
  return (
    <div className="relative">
      <input
        className="form-input pr-12"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-400">{suffix}</span>
      )}
    </div>
  )
}

// ============ 日期选择 ============
function DateField({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="date"
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ============ 图片上传 ============
function UploadField({ label, url, onChange, last }) {
  return (
    <div className={`px-4 py-3 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">{label}</div>
      <button
        type="button"
        onClick={() => onChange('mock-uploaded-' + Date.now())}
        className={`w-[140px] h-[140px] border border-dashed rounded flex flex-col items-center justify-center tap transition ${
          url ? 'border-brand/40 bg-brand/5' : 'border-ink-200 bg-ink-50/50'
        }`}
      >
        {url ? (
          <div className="flex flex-col items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2D7FF9" strokeWidth="1.6"/>
              <path d="M7 14l4-4 4 4M14 10l3-3M21 16l-3 3" stroke="#2D7FF9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="9" r="1.5" fill="#2D7FF9"/>
            </svg>
            <span className="text-[11px] text-brand mt-1.5">已上传</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16M4 12h16" stroke="#A9B0BA" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] text-ink-400 mt-1.5">点击上传</span>
          </div>
        )}
      </button>
    </div>
  )
}