import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

/**
 * 重新发起项目 - 表单页
 * 与「新建项目」结构完全一致，但表单预填该项目已有数据
 * 字段来源：项目详情 mock（演示用）
 */
export default function ProjectRestartPage() {
  const nav = useNavigate()
  const { id } = useParams()

  // 预填数据（演示：从 mock 取，实际应通过 API 获取）
  // 这里用与详情页一致的内置 demo 数据
  const initial = getInitialProject(id)

  const [basic, setBasic] = useState({
    name: initial.name,
    groupName: initial.groupName,
    subjectPool: initial.subjectPool,
    salesType: initial.salesType,
  })

  // 项目明细：与已有政策数对应（默认带 1 个空政策用于新增）
  const emptyPolicy = () => ({
    name: '',
    platform: '',
    initialMode: '',
    serviceOrderType: '',
    payType: '',
    rebate: '',
    serviceFee: '',
    creditDays: '',
    customerType: '',
    owner: '',
    effectiveDate: '',
    expiryDate: '',
    remark: '',
  })
  const [policies, setPolicies] = useState(
    initial.policies && initial.policies.length > 0
      ? initial.policies.map(p => ({
          name: p.name || '',
          platform: p.platform || '',
          initialMode: p.initialMode || '',
          serviceOrderType: p.serviceOrderType || '',
          payType: p.payType || '',
          rebate: p.rebate || '',
          serviceFee: p.serviceFee || '',
          creditDays: p.creditDays || '',
          customerType: p.customerType || '',
          owner: p.owner || '',
          effectiveDate: p.effective || '',
          expiryDate: p.expire || '',
          remark: p.remark || '',
        }))
      : [emptyPolicy()]
  )

  const setB = (k, v) => setBasic(s => ({ ...s, [k]: v }))
  const setP = (idx, k, v) => setPolicies(list => list.map((p, i) => i === idx ? { ...p, [k]: v } : p))
  const addPolicy = () => setPolicies(list => [...list, emptyPolicy()])
  const removePolicy = (idx) => {
    if (policies.length <= 1) return
    setPolicies(list => list.filter((_, i) => i !== idx))
  }

  // 选项（演示用 mock）
  const PLATFORM_OPTIONS = ['巨量引擎', '磁力金牛', '千川', 'TikToK', '腾讯广告', '聚光', '头条-AD', '本地推']
  const INITIAL_MODE_OPTIONS = ['新签', '续约', '框架补充', '走量', '代投']
  const SERVICE_ORDER_OPTIONS = ['电商', '非电商', '品牌', '效果', '无附加服务', '基础服务']
  const PAY_TYPE_OPTIONS = ['预付', '后付', '垫付', '月结']
  const CUSTOMER_TYPE_OPTIONS = ['KA客户', 'SMB客户', '渠道客户', '直接客户', '代理客户']
  const OWNER_OPTIONS = ['潘建民', '王春雷', '李娜', '张磊', '陈晓', '李雪']
  const GROUP_OPTIONS = ['嘉禾电商集团', '共读科技', '云锐互动集团', '薇光传媒集团', '中粮集团']
  const SUBJECT_OPTIONS = ['广州市源满房地产代理有限公司', '共读科技有限公司', '云锐互动有限公司']

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="重新发起" onBack={() => nav(-1)}/>

      {/* 顶部小标题：基本信息（已预填）*/}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-[15px] font-medium text-ink-900">基本信息</h2>
      </div>

      {/* 基本信息（预填） */}
      <Section>
        <Field label="项目框架名称" required>
          <input className="form-input" value={basic.name} onChange={e => setB('name', e.target.value)} placeholder="请输入项目框架名称"/>
        </Field>
        <Field label="所属集团" required>
          <SelectField value={basic.groupName} onChange={v => setB('groupName', v)} placeholder="请选择所属集团" options={GROUP_OPTIONS}/>
        </Field>
        <Field label="主体池">
          <SelectField value={basic.subjectPool} onChange={v => setB('subjectPool', v)} placeholder="请选择主体池" options={SUBJECT_OPTIONS}/>
        </Field>
        <Field label="销售类型" required last>
          <RadioGroup value={basic.salesType} onChange={v => setB('salesType', v)} options={[{ value: 'KA服务', label: 'KA服务' }, { value: '销管', label: '销管' }, { value: '代投', label: '代投' }]}/>
        </Field>
      </Section>

      {/* 项目明细（已预填政策）*/}
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-ink-900">项目明细</h2>
        <button onClick={addPolicy} className="h-7 px-3 bg-brand text-white rounded-full text-[11px] flex items-center gap-1 tap active:opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          添加政策
        </button>
      </div>

      <div className="space-y-3 px-3 pt-2">
        {policies.map((p, idx) => (
          <PolicyCard
            key={idx}
            index={idx}
            policy={p}
            platforms={PLATFORM_OPTIONS}
            initialModes={INITIAL_MODE_OPTIONS}
            serviceOrderTypes={SERVICE_ORDER_OPTIONS}
            payTypes={PAY_TYPE_OPTIONS}
            customerTypes={CUSTOMER_TYPE_OPTIONS}
            owners={OWNER_OPTIONS}
            canDelete={policies.length > 1}
            onChange={(k, v) => setP(idx, k, v)}
            onRemove={() => removePolicy(idx)}
          />
        ))}
      </div>

      {/* 底部按钮：取 消 / 重 新 发 起（与新建项目一致） */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">重新发起</button>
      </div>
    </div>
  )
}

// ============ 演示用：根据 id 取预填数据 ============
function getInitialProject(id) {
  // 默认 demo 数据（与 ProjectDetailPage 中 mock 一致）
  return {
    name: '嘉禾食品-视频号-代投',
    groupName: '嘉禾电商集团',
    subjectPool: '广州市源满房地产代理有限公司',
    salesType: '代投',
    policies: [
      {
        name: '咸峰财税-ad-走量，头条-AD',
        platform: '头条-AD',
        initialMode: '走量',
        serviceOrderType: '无附加服务',
        payType: '预付',
        rebate: '0.00',
        serviceFee: '0.00',
        creditDays: '',
        customerType: '直接客户',
        owner: '李雪',
        effective: '2025-11-10',
        expire: '',
        remark: '',
      },
    ],
  }
}

// ============ 政策卡（与新建项目完全相同）============
function PolicyCard({ index, policy, platforms, initialModes, serviceOrderTypes, payTypes, customerTypes, owners, canDelete, onChange, onRemove }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-ink-100 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-900">政策 {index + 1}</span>
        {canDelete && (
          <button onClick={onRemove} className="h-6 px-2 text-danger text-[12px] flex items-center gap-1 tap active:opacity-80">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            删除
          </button>
        )}
      </div>

      <div className="px-4 pb-3">
        <Field label="政策名称">
          <input className="form-input bg-ink-50 text-ink-400 cursor-not-allowed" value={policy.name} onChange={e => onChange('name', e.target.value)} placeholder="政策名称自动编译" disabled/>
        </Field>
        <Field label="投放平台" required>
          <SelectField value={policy.platform} onChange={v => onChange('platform', v)} placeholder="请选择投放平台" options={platforms}/>
        </Field>
        <Field label="初始合作模式" required>
          <SelectField value={policy.initialMode} onChange={v => onChange('initialMode', v)} placeholder="请选择初始合作模式" options={initialModes}/>
        </Field>
        <Field label="服务单类型" required>
          <SelectField value={policy.serviceOrderType} onChange={v => onChange('serviceOrderType', v)} placeholder="请选择服务单类型" options={serviceOrderTypes}/>
        </Field>
        <Field label="付款方式" required>
          <SelectField value={policy.payType} onChange={v => onChange('payType', v)} placeholder="请选择付款方式" options={payTypes}/>
        </Field>
        <Field label="客户返点(%)" required>
          <input className="form-input" value={policy.rebate} onChange={e => onChange('rebate', e.target.value)} placeholder="请输入客户返点比例" inputMode="decimal"/>
        </Field>
        <Field label="服务费(%)" required>
          <input className="form-input" value={policy.serviceFee} onChange={e => onChange('serviceFee', e.target.value)} placeholder="服务费比例没有则填写 0" inputMode="decimal"/>
        </Field>
        <Field label="垫款账期(天)" required>
          <input className="form-input" value={policy.creditDays} onChange={e => onChange('creditDays', e.target.value)} placeholder="请输入垫款账期(天)" inputMode="numeric"/>
        </Field>
        <Field label="客户类别" required>
          <SelectField value={policy.customerType} onChange={v => onChange('customerType', v)} placeholder="请选择客户类别" options={customerTypes}/>
        </Field>
        <Field label="业绩归属人" required>
          <SelectField value={policy.owner} onChange={v => onChange('owner', v)} placeholder="请选择业绩归属人" options={owners}/>
        </Field>
        <Field label="生效时间" required>
          <DateField value={policy.effectiveDate} onChange={v => onChange('effectiveDate', v)} placeholder="选择生效时间"/>
        </Field>
        <Field label="失效时间">
          <DateField value={policy.expiryDate} onChange={v => onChange('expiryDate', v)} placeholder="选择失效时间"/>
        </Field>
        <Field label="备注" last>
          <input className="form-input" value={policy.remark} onChange={e => onChange('remark', e.target.value)} placeholder="请输入备注"/>
        </Field>
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
function Section({ children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
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

// ============ 日期字段 ============
function DateField({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input type="date" className="form-input pr-10" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="#999" strokeWidth="1.6"/>
        <path d="M3 9h18M8 3v4M16 3v4" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ============ 单选组 ============
function RadioGroup({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-6 py-1 flex-wrap">
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
