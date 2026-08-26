import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * 新建直播政策 - 独立表单页
 * 来源：PC 新建直播政策弹窗（图1-4，共 5 个 section）
 * 字段：
 *   1. 客户信息（3 项必填）：集团 / 客户名称 / 代投客户政策 / 行业 / 基础费用 / GMV 分佣 / 备注情况
 *   2. 投放要求（2 项必填）：投放媒体 / 日预算 / 月预算 / 阶梯预算 / 人群定位 / 投放点位
 *   3. 直播要求（1 项必填）：时长要求 / 代播账号名称 / 粉丝量 / 历史开播情况 / 直播现状 /
 *                          主播要求 / 整体货盘 / 直播风格 / 营销侧重 / 营销链路要求 / 品牌红线
 *   4. 考核标准（选填）：投放目标 / 销售额及核销目标规划及阶段目标拆解 / 客户考核要求 / 结算情况 / 数据复盘节点
 *   5. 申请信息（*）：申请人
 *
 * 底部 sticky：取消 + 提交
 */
export default function LivePolicyCreatePage() {
  const nav = useNavigate()
  const location = useLocation()
  // 支持从「重新发起」跳过来时预填历史数据
  const prefill = location.state?.prefill || {}
  const isRestart = Boolean(location.state?.prefill)
  const [fields, setFields] = useState({ ...prefill })
  const [toast, setToast] = useState(null)

  // 进入页面（特别是「重新发起」跳转）时滚到顶部
  useEffect(() => {
    const m = document.querySelector('main')
    if (m) m.scrollTop = 0
    window.scrollTo(0, 0)
  }, [])
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }
  const set = (k, v) => setFields(s => ({ ...s, [k]: v }))

  const handleSubmit = () => {
    if (!fields.groupName) { showToast('请填写集团', 'error'); return }
    if (!fields.customerName) { showToast('请填写客户名称', 'error'); return }
    if (!fields.platform) { showToast('请选择投放媒体', 'error'); return }
    if (!fields.duration) { showToast('请填写时长要求', 'error'); return }
    if (!fields.applicant) { showToast('请填写申请人', 'error'); return }
    showToast('提交成功，等待审批', 'success')
    setTimeout(() => nav(-1), 1000)
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title={isRestart ? '重新发起直播政策' : '新建直播政策'} onBack={() => nav(-1)}/>

      <div className="pt-3 space-y-3">
        {/* ============ 1. 客户信息（3 项必填）============ */}
        <Section title="客户信息">
          <Field label="集团" required>
            <Input value={fields.groupName} onChange={v => set('groupName', v)} placeholder="请输入或搜索集团"/>
            <HelpText text="搜索下拉选择·必填"/>
          </Field>
          <Field label="客户名称" required>
            <SelectField value={fields.customerName} onChange={v => set('customerName', v)}
              placeholder="请先选择集团"
              options={['北京小米科技有限公司', '上海蔚来汽车', '深圳华为技术', '广州网易游戏', '杭州阿里巴巴']}/>
          </Field>
          <Field label="代投客户政策">
            <ReadonlyField value="该客户暂无关联的政策"/>
            <HelpText text="依赖客户名称·单选·远程搜索"/>
          </Field>
          <Row2>
            <Field label="行业" required>
              <Input value={fields.industry} onChange={v => set('industry', v)} placeholder="请输入行业"/>
            </Field>
            <Field label="基础费用" required>
              <SuffixInput value={fields.baseFee} onChange={v => set('baseFee', v)}
                suffix="元" type="number" placeholder="请输入基础费用(元)"/>
              <HelpText text="必填·单位：元" error={fields.submitAttempted && !fields.baseFee}/>
              {fields.submitAttempted && !fields.baseFee && (
                <p className="text-[11px] text-danger mt-1">请输入基础费用</p>
              )}
            </Field>
          </Row2>
          <Field label="GMV 分佣" required>
            <SuffixInput value={fields.gmvShare} onChange={v => set('gmvShare', v)}
              suffix="%" type="number" placeholder="请输入 GMV 分佣比例"/>
            <HelpText text="必填·例如：10"/>
          </Field>
          <Field label="备注情况" last>
            <Textarea value={fields.remark} onChange={v => set('remark', v)}
              placeholder="请输入备注情况" rows={3}/>
          </Field>
        </Section>

        {/* ============ 2. 投放要求（2 项必填）============ */}
        <Section title="投放要求">
          <Row2>
            <Field label="投放媒体" required>
              <SelectField value={fields.platform} onChange={v => set('platform', v)}
                placeholder="请选择"
                options={['小红书-品牌', '抖音-品牌', '快手-品牌', '视频号-品牌', '微博-品牌', 'B站-品牌']}/>
              <HelpText text="下拉单选·已有媒体平台"/>
            </Field>
            <Field label="日预算">
              <SuffixInput value={fields.dayBudget} onChange={v => set('dayBudget', v)}
                suffix="元" type="number" placeholder="请输入日预算"/>
            </Field>
          </Row2>
          <Row2>
            <Field label="月预算">
              <SuffixInput value={fields.monthBudget} onChange={v => set('monthBudget', v)}
                suffix="元" type="number" placeholder="请输入月预算"/>
            </Field>
            <Field label="阶梯预算">
              <Textarea value={fields.stepBudget} onChange={v => set('stepBudget', v)}
                placeholder="请输入阶梯预算和阶梯规则" rows={2}/>
            </Field>
          </Row2>
          <Field label="人群定位">
            <Textarea value={fields.audience} onChange={v => set('audience', v)}
              placeholder="请输入人群定位" rows={3}/>
          </Field>
          <Field label="投放点位" last>
            <Textarea value={fields.placement} onChange={v => set('placement', v)}
              placeholder="请输入投放点位" rows={3}/>
          </Field>
        </Section>

        {/* ============ 3. 直播要求（1 项必填）============ */}
        <Section title="直播要求">
          <Row2>
            <Field label="时长要求" required>
              <Textarea value={fields.duration} onChange={v => set('duration', v)}
                placeholder="请输入时长要求" rows={3}/>
              <HelpText text="必填·描述单场时长与场次"/>
            </Field>
            <Field label="代播账号名称" required>
              <CounterInput value={fields.accountName} onChange={v => set('accountName', v)}
                placeholder="如：抖音号@xxx" maxLength={255}/>
              <HelpText text="必填·平台账号 + @ 标识"/>
            </Field>
          </Row2>
          <Row2>
            <Field label="粉丝量" required>
              <CounterInput value={fields.fans} onChange={v => set('fans', v)}
                placeholder="如：100万 / 1.2万" maxLength={100}/>
              <HelpText text='必填·全字符串写法（如 "1.2万"）'/>
            </Field>
            <Field label="历史开播情况" required>
              <Textarea value={fields.history} onChange={v => set('history', v)}
                placeholder="如：日播1年，月均 50w GMV" rows={2}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="直播现状">
              <Textarea value={fields.currentStatus} onChange={v => set('currentStatus', v)}
                placeholder="请输入直播现状" rows={3}/>
            </Field>
            <Field label="主播要求">
              <Textarea value={fields.hostReq} onChange={v => set('hostReq', v)}
                placeholder="请输入主播要求" rows={3}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="整体货盘">
              <Textarea value={fields.goods} onChange={v => set('goods', v)}
                placeholder="请输入整体货盘" rows={3}/>
            </Field>
            <Field label="直播风格">
              <Textarea value={fields.style} onChange={v => set('style', v)}
                placeholder="请输入直播风格" rows={3}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="营销侧重">
              <Textarea value={fields.marketingFocus} onChange={v => set('marketingFocus', v)}
                placeholder="请输入营销侧重" rows={3}/>
            </Field>
            <Field label="营销链路要求">
              <Textarea value={fields.marketingChain} onChange={v => set('marketingChain', v)}
                placeholder="请输入营销链路要求" rows={3}/>
            </Field>
          </Row2>
          <Field label="品牌红线" last>
            <Textarea value={fields.brandRedLine} onChange={v => set('brandRedLine', v)}
              placeholder="请输入品牌红线" rows={3}/>
          </Field>
        </Section>

        {/* ============ 4. 考核标准（选填）============ */}
        <Section title="考核标准">
          <Field label="投放目标">
            <Textarea value={fields.targetGoal} onChange={v => set('targetGoal', v)}
              placeholder="请输入投放目标" rows={3}/>
          </Field>
          <Field label="销售额及核销目标规划及阶段目标拆解">
            <Textarea value={fields.salesPlan} onChange={v => set('salesPlan', v)}
              placeholder="请输入销售额及核销目标规划及阶段目标拆解" rows={4}/>
          </Field>
          <Row2>
            <Field label="客户考核要求">
              <Textarea value={fields.customerKpi} onChange={v => set('customerKpi', v)}
                placeholder="请输入客户考核要求" rows={3}/>
            </Field>
            <Field label="结算情况">
              <Textarea value={fields.settlement} onChange={v => set('settlement', v)}
                placeholder="请输入结算情况" rows={3}/>
            </Field>
          </Row2>
          <Field label="数据复盘节点" last>
            <Textarea value={fields.reviewNode} onChange={v => set('reviewNode', v)}
              placeholder="请输入数据复盘节点" rows={3}/>
          </Field>
        </Section>

        {/* ============ 5. 申请信息（必填）============ */}
        <Section title="申请信息" required>
          <Field label="申请人" required last>
            <Input value={fields.applicant} onChange={v => set('applicant', v)}
              placeholder="请输入或搜索申请人"/>
          </Field>
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
function Section({ title, required, badge, children }) {
  return (
    <div className="mx-3 card overflow-hidden">
      <div className="group-title">
        <span>
          {title}
          {required && <span className="text-danger ml-1">*</span>}
        </span>
        {badge && (
          <span className="ml-auto text-[11px] text-ink-500 bg-ink-50 border border-ink-100 rounded-full px-2 py-0.5 font-normal">
            {badge}
          </span>
        )}
      </div>
      <div className="px-4 pb-3">{children}</div>
    </div>
  )
}

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

function Row2({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

// ============ 输入框（带 helper text）============
function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="form-input"/>
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value || ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="form-input min-h-[60px] py-2 leading-relaxed"/>
  )
}

function ReadonlyField({ value }) {
  return (
    <div className="bg-ink-50 rounded h-10 px-3 flex items-center text-[13px] text-ink-500 border border-ink-100">
      {value}
    </div>
  )
}

// ============ 后缀输入框（元 / %）============
function SuffixInput({ value, onChange, suffix, type = 'text', placeholder }) {
  return (
    <div className="relative">
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`form-input ${suffix ? 'pr-10' : ''}`}/>
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500 pointer-events-none bg-white pl-1">
          {suffix}
        </span>
      )}
    </div>
  )
}

// ============ 带字数计数的输入框 ============
function CounterInput({ value, onChange, placeholder, maxLength }) {
  const len = (value || '').length
  return (
    <div className="relative">
      <input value={value || ''} onChange={e => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        maxLength={maxLength}
        className="form-input pr-12"/>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-400 pointer-events-none">
        {len}/{maxLength}
      </span>
    </div>
  )
}

// ============ 帮助文本 ============
function HelpText({ text, error }) {
  return (
    <p className={`text-[11px] mt-1.5 ${error ? 'text-danger' : 'text-ink-500'}`}>{text}</p>
  )
}

// ============ 选择字段（下拉）============
function SelectField({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select className="form-input appearance-none pr-8" value={value || ''} onChange={e => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
