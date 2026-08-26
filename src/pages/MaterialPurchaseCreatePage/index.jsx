import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * 素材采买页（新建 / 重新发起）
 * 来源：PC 端素材采买弹窗（图2、图3）
 * 区块：
 *   1. 客户信息（5 项必填）：集团 / 客户名称 / 行业 / 媒体 / 详细需求
 *   2. 预算（1 项必填）：客户总预算 / 参考视频链接
 *   3. 视频类型（至少选 1 项）：混剪 / 口播 / 剧情（多选，每种独立配置）
 *   4. 申请信息（1 项必填）：申请人
 *
 * 底部 sticky：取消 + 提交
 */
export default function MaterialPurchaseCreatePage() {
  const nav = useNavigate()
  const location = useLocation()
  const prefill = location.state?.prefill || {}
  const isRestart = Boolean(location.state?.prefill)
  const [fields, setFields] = useState(() => ({
    groupName: '', customerName: '', industry: '', platform: '', requirement: '',
    budget: '', videoLinks: '',
    videoTypes: [], videoTypeConfig: {},
    applicant: '',
    ...prefill,
  }))
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 1800)
  }
  const set = (k, v) => setFields(s => ({ ...s, [k]: v }))

  // 进入页面（特别是「重新发起」跳转）时滚到顶部
  useEffect(() => {
    const m = document.querySelector('main')
    if (m) m.scrollTop = 0
    window.scrollTo(0, 0)
  }, [])

  const toggleVideoType = (type) => {
    const cur = fields.videoTypes || []
    const next = cur.includes(type) ? cur.filter(t => t !== type) : [...cur, type]
    set('videoTypes', next)
  }
  const setConfig = (type, key, val) => {
    const cfg = { ...(fields.videoTypeConfig || {}) }
    cfg[type] = { ...(cfg[type] || {}), [key]: val }
    set('videoTypeConfig', cfg)
  }

  const handleSubmit = () => {
    if (!fields.groupName) { showToast('请填写集团', 'error'); return }
    if (!fields.customerName) { showToast('请填写客户名称', 'error'); return }
    if (!fields.industry) { showToast('请填写行业', 'error'); return }
    if (!fields.platform) { showToast('请选择媒体', 'error'); return }
    if (!fields.requirement) { showToast('请填写详细需求', 'error'); return }
    if (!fields.budget) { showToast('请输入客户总预算', 'error'); return }
    if (!fields.videoTypes?.length) { showToast('请至少选择一种视频类型', 'error'); return }
    if (!fields.applicant) { showToast('请选择申请人', 'error'); return }
    showToast('提交成功，等待审批', 'success')
    setTimeout(() => nav(-1), 1000)
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title={isRestart ? '重新发起素材采买' : '新建素材采买'} onBack={() => nav(-1)}/>

      <div className="pt-3 space-y-3">
        {/* ============ 1. 客户信息（5 项必填）============ */}
        <Section title="客户信息">
          <Row2>
            <Field label="集团" required>
              <input className="form-input" value={fields.groupName || ''} onChange={e => set('groupName', e.target.value)}
                placeholder="请输入或搜索集团"/>
            </Field>
            <Field label="客户名称" required>
              <SelectField value={fields.customerName || ''} onChange={v => set('customerName', v)}
                placeholder="请先选择集团"
                options={['北京小米科技有限公司', '上海蔚来汽车', '深圳华为技术', '广州网易游戏', '杭州阿里巴巴']}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="行业">
              <input className="form-input" value={fields.industry || ''} onChange={e => set('industry', e.target.value)}
                placeholder="请输入行业（选填）"/>
            </Field>
            <Field label="媒体" required>
              <SelectField value={fields.platform || ''} onChange={v => set('platform', v)}
                placeholder="请选择媒体"
                options={['腾讯-广点通', '巨量引擎', '磁力金牛', '快手', '小红书', '视频号', 'B站', '聚光', 'TikToK']}/>
              <HelpText text="必填·单选"/>
            </Field>
          </Row2>
          <Field label="详细需求" required last>
            <textarea className="form-input min-h-[100px] py-2 leading-relaxed resize-none" value={fields.requirement || ''} onChange={e => set('requirement', e.target.value)}
              placeholder="视频详细的参考样品、客户要求" rows={4}/>
          </Field>
        </Section>

        {/* ============ 2. 预算（1 项必填）============ */}
        <Section title="预算">
          <Row2>
            <Field label="客户总预算" required>
              <div className="relative">
                <input type="number" className="form-input pr-12" value={fields.budget || ''} onChange={e => set('budget', e.target.value)}
                  placeholder="请输入客户总预算"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-ink-500 pointer-events-none">元</span>
              </div>
              <HelpText text="必填·单位：元"/>
            </Field>
            <Field label="参考视频链接">
              <textarea className="form-input min-h-[80px] py-2 leading-relaxed resize-none" value={fields.videoLinks || ''} onChange={e => set('videoLinks', e.target.value)}
                placeholder="每一行一个视频地址" rows={3}/>
            </Field>
          </Row2>
          <HelpText text="换行多个地址·全部提交到 video_uri 数组" small/>
        </Section>

        {/* ============ 3. 视频类型（至少选 1 项）============ */}
        <Section title="视频类型">
          <Field label="类型">
            <HelpText text="多选·点击卡片切换·子配置紧跟对应卡片展开"/>
          </Field>
          <div className="space-y-2 mt-1">
            {/* 混剪 */}
            <VideoTypeCard
              type="混剪" color="green"
              active={fields.videoTypes?.includes('混剪')}
              onToggle={() => toggleVideoType('混剪')}
            >
              {fields.videoTypes?.includes('混剪') && (
                <ConfigBlock label="混剪配置" badge="必填">
                  <Field label="素材数量">
                    <input type="number" className="form-input" value={fields.videoTypeConfig?.混剪?.count || ''} onChange={e => setConfig('混剪', 'count', e.target.value)}
                      placeholder="请输入该类型的素材数量"/>
                  </Field>
                  <Field label="说明" last>
                    <input className="form-input" value={fields.videoTypeConfig?.混剪?.desc || ''} onChange={e => setConfig('混剪', 'desc', e.target.value)}
                      placeholder="例如：仅素材数量"/>
                  </Field>
                </ConfigBlock>
              )}
            </VideoTypeCard>

            {/* 口播 */}
            <VideoTypeCard
              type="口播" color="blue"
              active={fields.videoTypes?.includes('口播')}
              desc="单人口播 / 其他 + 演员要求"
              onToggle={() => toggleVideoType('口播')}
            >
              {fields.videoTypes?.includes('口播') && (
                <ConfigBlock label="口播配置" badge="单选">
                  <Field label="口播类型">
                    <RadioRow
                      value={fields.videoTypeConfig?.口播?.type || ''}
                      onChange={v => setConfig('口播', 'type', v)}
                      options={[{ value: '单人口播', label: '单人口播' }, { value: '其他', label: '其他' }]}
                    />
                  </Field>
                  <Field label="演员要求">
                    <textarea className="form-input min-h-[80px] py-2 leading-relaxed resize-none" value={fields.videoTypeConfig?.口播?.actorReq || ''} onChange={e => setConfig('口播', 'actorReq', e.target.value)}
                      placeholder="如：口播风格、形象气质、特殊角色等，需写明原因" rows={3}/>
                  </Field>
                  <Field label="素材数量" required>
                    <input type="number" className="form-input" value={fields.videoTypeConfig?.口播?.count || ''} onChange={e => setConfig('口播', 'count', e.target.value)}
                      placeholder="请输入该类型的素材数量"/>
                    <HelpText text="必填·整数 ≥ 1"/>
                  </Field>
                </ConfigBlock>
              )}
            </VideoTypeCard>

            {/* 剧情 */}
            <VideoTypeCard
              type="剧情" color="orange"
              active={fields.videoTypes?.includes('剧情')}
              desc="双人 / 三人 / 其他 + 演员要求"
              onToggle={() => toggleVideoType('剧情')}
            >
              {fields.videoTypes?.includes('剧情') && (
                <ConfigBlock label="剧情演员配置" badge="单选">
                  <Field label="演员人数">
                    <RadioRow
                      value={fields.videoTypeConfig?.剧情?.actorCount || ''}
                      onChange={v => setConfig('剧情', 'actorCount', v)}
                      options={[{ value: '双人', label: '双人' }, { value: '三人', label: '三人' }, { value: '其他', label: '其他' }]}
                    />
                  </Field>
                  <Field label="演员要求">
                    <textarea className="form-input min-h-[80px] py-2 leading-relaxed resize-none" value={fields.videoTypeConfig?.剧情?.actorReq || ''} onChange={e => setConfig('剧情', 'actorReq', e.target.value)}
                      placeholder="如：群演、特殊角色、表演经验等，需写明原因" rows={3}/>
                  </Field>
                  <Field label="素材数量" required last>
                    <input type="number" className="form-input" value={fields.videoTypeConfig?.剧情?.count || ''} onChange={e => setConfig('剧情', 'count', e.target.value)}
                      placeholder="请输入该类型的素材数量"/>
                    <HelpText text="必填·整数 ≥ 1"/>
                  </Field>
                </ConfigBlock>
              )}
            </VideoTypeCard>
          </div>
        </Section>

        {/* ============ 4. 申请信息（1 项必填）============ */}
        <Section title="申请信息">
          <Field label="申请人" required last>
            <input className="form-input" value={fields.applicant || ''} onChange={e => set('applicant', e.target.value)}
              placeholder="请输入或搜索申请人"/>
          </Field>
        </Section>
      </div>

      {/* 底部 sticky 按钮 */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button onClick={handleSubmit} className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">提 交</button>
      </div>

      {toast && <Toast type={toast.type} message={toast.msg}/>}
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
    <div className="mx-3 card overflow-hidden">
      <div className="group-title">
        <span>{title}</span>
      </div>
      <div className="px-4 pb-3">{children}</div>
    </div>
  )
}

function ConfigBlock({ label, badge, children }) {
  return (
    <div className="mt-2 bg-ink-50 rounded-lg overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between border-b border-ink-100">
        <span className="text-[13px] text-ink-700">
          <span className="inline-block w-[3px] h-3 bg-brand align-middle mr-1.5 rounded-sm"/>
          {label}
        </span>
        {badge && (
          <span className="text-[11px] text-ink-500 border border-ink-200 rounded-full px-2 py-0.5">{badge}</span>
        )}
      </div>
      <div className="px-4 pb-3">{children}</div>
    </div>
  )
}

function Row2({ children }) {
  return (
    <div className="grid grid-cols-2 gap-x-3">
      {children}
    </div>
  )
}

function Field({ label, required, last, children }) {
  return (
    <div className={`pt-3 ${last ? '' : 'border-b border-ink-100'} first:pt-0`}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">
        {required && <span className="text-danger mr-1">*</span>}
        {label}
      </div>
      {children}
    </div>
  )
}

function HelpText({ text, error, small }) {
  return (
    <p className={`text-[11px] mt-1 ${error ? 'text-danger' : 'text-ink-500'} ${small ? 'text-center -mt-1' : ''}`}>{text}</p>
  )
}

function SelectField({ value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select className="form-input appearance-none pr-8" value={value} onChange={e => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// ============ 视频类型卡片（多选·卡片切换）============
function VideoTypeCard({ type, color, desc, active, onToggle, children }) {
  const colorMap = {
    green: { bg: 'bg-emerald-50', border: 'border-emerald-300', check: 'bg-emerald-500', text: 'text-emerald-700' },
    blue:  { bg: 'bg-blue-50',    border: 'border-brand',      check: 'bg-brand',         text: 'text-brand' },
    orange:{ bg: 'bg-orange-50',  border: 'border-orange-300', check: 'bg-orange-500',   text: 'text-orange-700' },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className={`rounded-lg border-2 ${active ? c.border : 'border-ink-200'} overflow-hidden`}>
      <button onClick={onToggle} className={`w-full px-3 py-2.5 flex items-center gap-2 ${active ? c.bg : 'bg-white'} tap`}>
        <span className={`w-5 h-5 rounded ${active ? c.check : 'bg-white border border-ink-300'} flex items-center justify-center shrink-0`}>
          {active && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        <span className={`text-[13px] font-medium ${active ? c.text : 'text-ink-900'}`}>{type}</span>
        {desc && <span className="text-[11px] text-ink-500 ml-1">{desc}</span>}
      </button>
      {children && <div className="px-3 pb-3">{children}</div>}
    </div>
  )
}

// ============ 单选 radio 行 ============
function RadioRow({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-4">
      {options.map(o => (
        <label key={o.value} onClick={() => onChange(o.value)} className="flex items-center gap-1.5 cursor-pointer tap">
          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${value === o.value ? 'border-brand' : 'border-ink-200'}`}>
            {value === o.value && <span className="w-2 h-2 rounded-full bg-brand"/>}
          </span>
          <span className="text-[13px] text-ink-900">{o.label}</span>
        </label>
      ))}
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