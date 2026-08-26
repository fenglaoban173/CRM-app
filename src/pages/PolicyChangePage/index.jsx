import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policiesData } from '../../data/mock'

/**
 * 政策变更页
 * 来源：PC 政策变更弹窗（图2）
 * App 端：双栏 → 上下堆叠，顶部 X 关闭 + 顶部栏
 * 字段：
 *   政策信息（5 双列 + 业绩归属人单列 = 11 行）：
 *     政策名称 / 投放平台
 *     初始合作模式 / 服务单类型
 *     付款方式 / 服务费(%)
 *     垫款账期(天) / 客户类别
 *     业绩归属人
 *   返点信息（3 双列 + 备注单列 = 7 行）：
 *     * 原返点失效日期 / * 新返点生效日期
 *     * 客户返点(%) / 服务费比例(%)
 *     备注
 *
 * 底部 sticky：取消 + 提交
 */
export default function PolicyChangePage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = policiesData.find(p => p.id === id) || policiesData[0]

  const [platform, setPlatform] = useState(item.platform || '巨量引擎')
  const [coopMode, setCoopMode] = useState(item.coopMode || '走量')
  const [serviceType, setServiceType] = useState('')
  const [payType, setPayType] = useState(item.payType || '垫款')
  const [serviceFee, setServiceFee] = useState('0')
  const [creditDays, setCreditDays] = useState(String(item.creditDays ?? 0))
  const [customerType, setCustomerType] = useState('')
  const [salesOwner, setSalesOwner] = useState(item.salesOwner || '')

  const [oldExpire, setOldExpire] = useState('2026-08-25')
  const [newEffective, setNewEffective] = useState('2026-08-25')
  const [newRebate, setNewRebate] = useState('0')
  const [newServiceFee, setNewServiceFee] = useState('0')
  const [remark, setRemark] = useState('')

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }

  const handleSubmit = () => {
    // 必填校验
    if (!newRebate || newRebate === '0') {
      showToast('请填写客户返点', 'error')
      return
    }
    if (!oldExpire || !newEffective) {
      showToast('请选择日期', 'error')
      return
    }
    showToast('变更已提交', 'success')
    setTimeout(() => nav(-1), 1000)
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="变更政策" onClose={() => nav(-1)}/>

      <div className="pt-3 space-y-3">
        {/* 政策信息 */}
        <Section title="政策信息">
          <Row2>
            <Field label="政策名称" required>
              <ReadonlyField value={item.name}/>
            </Field>
            <Field label="投放平台">
              <SelectField value={platform} onChange={setPlatform} options={['巨量引擎', '巨量AD', '头条-AD', '千川', '磁力金牛', '聚光', '快手', '小红书', '腾讯广告', '视频号']}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="初始合作模式">
              <SelectField value={coopMode} onChange={setCoopMode} options={['走量', '包断', '代投']}/>
            </Field>
            <Field label="服务单类型">
              <SelectField value={serviceType} onChange={setServiceType} placeholder="请选择服务单类型" options={['标准服务单', '专项服务单', '年度服务单']}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="付款方式">
              <SelectField value={payType} onChange={setPayType} options={['垫款', '预付', '后付']}/>
            </Field>
            <Field label="服务费(%)" suffix="%">
              <NumberField value={serviceFee} onChange={setServiceFee}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="垫款账期(天)" suffix="天">
              <NumberField value={creditDays} onChange={setCreditDays}/>
            </Field>
            <Field label="客户类别">
              <SelectField value={customerType} onChange={setCustomerType} placeholder="请输入客户类别" options={['直接客户', '代理', '二代']}/>
            </Field>
          </Row2>
          <Row1>
            <Field label="业绩归属人">
              <SelectField value={salesOwner} onChange={setSalesOwner} placeholder="请选择业绩归属人" options={['王春雷', '冯孙杰', '刘欢', '王靖雅', '李基彬', '张朔', '孙迢', '高丽岩', '陈志伟', '潘建民']}/>
            </Field>
          </Row1>
        </Section>

        {/* 返点信息 */}
        <Section title="返点信息">
          <Row2>
            <Field label="原返点失效日期" required>
              <DateField value={oldExpire} onChange={setOldExpire}/>
            </Field>
            <Field label="新返点生效日期" required>
              <DateField value={newEffective} onChange={setNewEffective}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="客户返点(%)" required suffix="%">
              <NumberField value={newRebate} onChange={setNewRebate}/>
            </Field>
            <Field label="服务费比例(%)" suffix="%">
              <NumberField value={newServiceFee} onChange={setNewServiceFee}/>
            </Field>
          </Row2>
          <Row1>
            <Field label="备注">
              <div className="bg-ink-50 rounded-lg px-3 py-2 text-[13px] min-h-[44px]">
                <input value={remark} onChange={e => setRemark(e.target.value)}
                  placeholder="请输入备注"
                  className="w-full bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
              </div>
            </Field>
          </Row1>
        </Section>
      </div>

      {/* 底部 sticky 按钮 */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={handleSubmit} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type}/>}
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ title, onClose }) {
  return (
    <div className="bg-brand text-white sticky top-0 z-30">
      <div className="px-2 h-12 flex items-center relative">
        <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center tap ml-auto relative z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ============ Section 容器（白底卡片）============
function Section({ title, children }) {
  return (
    <div className="mx-3 card overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-100">
        <div className="text-[14px] font-medium text-ink-900">{title}</div>
      </div>
      <div className="divide-y divide-ink-100">
        {children}
      </div>
    </div>
  )
}

function Row1({ children }) {
  return <div className="px-4 py-2.5">{children}</div>
}
function Row2({ children }) {
  return <div className="px-4 py-2.5 grid grid-cols-2 gap-3">{children}</div>
}

// ============ 字段（label 在上，输入在下，符合移动端竖向堆叠）============
function Field({ label, required, suffix, children }) {
  return (
    <div>
      <div className="text-[11px] text-ink-500 mb-1">
        {required && <span className="text-red-500 mr-0.5">*</span>}
        {label}
        {suffix && <span className="text-ink-400 ml-0.5">({suffix})</span>}
      </div>
      {children}
    </div>
  )
}

// ============ 只读字段 ============
function ReadonlyField({ value }) {
  return (
    <div className="bg-ink-100 rounded-md h-9 flex items-center px-3 text-[13px] text-ink-500 cursor-not-allowed">
      {value || '—'}
    </div>
  )
}

// ============ 数字输入 ============
function NumberField({ value, onChange }) {
  return (
    <div className="bg-ink-50 rounded-md h-9 flex items-center px-3 text-[13px]">
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 focus:outline-none"/>
    </div>
  )
}

// ============ 日期输入 ============
function DateField({ value, onChange }) {
  return (
    <div className="bg-ink-50 rounded-md h-9 flex items-center px-3 text-[13px]">
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-ink-900 focus:outline-none"/>
    </div>
  )
}

// ============ 下拉选择 ============
function SelectField({ value, onChange, placeholder, options = [] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full appearance-none bg-ink-50 rounded-md h-9 pl-3 pr-8 text-[13px] focus:outline-none ${value ? 'text-ink-900' : 'text-ink-400'}`}>
        {placeholder && !value && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ============ Toast ============
function Toast({ type = 'success', message }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5">
        {type === 'success' && (
          <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
        {type === 'error' && (
          <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        <span className="text-[14px] font-medium">{message}</span>
      </div>
    </div>
  )
}
