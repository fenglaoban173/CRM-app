import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { findNode, advertiserAppsData } from '../../data/mock'
import { TopBar, Section, Field, SelectField, FormActions } from '../../components/FormKit'

/**
 * 开户申请表单页 — PC §3.4.1「开户」弹窗 + 批量添加账户
 * 共享：集团池 / 政策 / 服务商池
 * 批量：每条「账户 N」卡 9 字段（明细名称 / 开户主体 / 类型 / 一级行业 / 二级行业 / 关键词 / 开户ID总数 / 媒介开户人 / 备注）
 * 操作：顶部「添加账户」/「新建主体」；每卡「复制」/「删除」
 */
export default function AdvertiserApplyPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const isImport = window.location.hash.includes('/advertiser/detail/import')

  const editItem = isEdit ? advertiserAppsData.find(a => a.id === id) : null

  // 共享字段
  const [shared, setShared] = useState({
    groupPool: editItem?.groupName || '',
    policy: '',
    pool: editItem?.pool || '',
  })
  const setSharedF = (k, v) => setShared(s => ({ ...s, [k]: v }))

  // 账户数组（每条 9 字段）
  const [accounts, setAccounts] = useState([
    blankAccount(),
  ])

  // 主体列表（可新建主体往里加）
  const initialSubjects = (findNode(99)?.data || []).map(g => `${g.name}有限公司`).filter(Boolean)
  const [subjects, setSubjects] = useState(initialSubjects)

  // 新建主体 modal
  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')

  // 行业选项
  const TYPE_OPTIONS = ['企业', '个人', '个体工商户']
  const INDUSTRY_L1 = ['互联网', '电商', '广告', '文化', '医疗', '食品', '美业', '交通', '旅游', '教育', '金融']
  const INDUSTRY_L2 = {
    '互联网': ['电商', '阅读', '游戏', '工具'],
    '电商': ['美妆', '服饰', '日用', '数码'],
    '医疗': ['口腔', '医美', '药品'],
    '美业': ['美容', 'SPA', '美发'],
    '交通': ['物流', '出行'],
    '旅游': ['出境游', '国内游', '酒店'],
  }

  // 下拉选项
  const GROUP_OPTIONS = (findNode(99)?.data || []).map(g => g.name).filter(Boolean)
  const POLICY_OPTIONS = ['巨量 Q3 返点政策', '磁力金牛 Q3 返点政策', '腾讯 Q3 返点政策', '聚光 Q3 返点政策', '快手 Q3 返点政策', '小红书 Q3 返点政策']
  const POLICY_TO_POOL = {
    '巨量 Q3 返点政策': '央广-巨量服务商池',
    '磁力金牛 Q3 返点政策': '央广-磁力服务商池',
    '腾讯 Q3 返点政策': '央广-腾讯服务商池',
    '聚光 Q3 返点政策': '央广-聚光服务商池',
    '快手 Q3 返点政策': '央广-快手服务商池',
    '小红书 Q3 返点政策': '央广-小红书服务商池',
  }

  // 选择政策后自动带出服务商池
  const handlePolicyChange = (v) => {
    setSharedF('policy', v)
    if (POLICY_TO_POOL[v]) setSharedF('pool', POLICY_TO_POOL[v])
  }

  // 添加账户（默认复制上一条内容）
  const addAccount = () => {
    setAccounts(arr => [...arr, blankAccount(accounts[accounts.length - 1])])
  }
  const copyAccount = (idx) => {
    setAccounts(arr => [...arr, { ...arr[idx] }])
  }
  const deleteAccount = (idx) => {
    setAccounts(arr => arr.length === 1 ? arr : arr.filter((_, i) => i !== idx))
  }
  const updateAccount = (idx, key, val) => {
    setAccounts(arr => arr.map((a, i) => i === idx ? { ...a, [key]: val } : a))
  }

  // 新建主体
  const confirmCreateSubject = () => {
    const name = newSubjectName.trim()
    if (!name) return
    setSubjects(arr => name.includes('有限公司') ? [name, ...arr.filter(s => s !== name)] : [`${name}有限公司`, ...arr.filter(s => s !== `${name}有限公司`)])
    setNewSubjectName('')
    setSubjectModalOpen(false)
  }

  const handleSubmit = () => {
    nav('/m/1562')
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar
        title={isImport ? '多开户导入' : (isEdit ? '编辑开户申请' : '新建开户申请')}
        onBack={() => nav(-1)}
      />

      <div className="px-4 pt-3 pb-1">
        <h2 className="text-[15px] font-medium text-ink-900">
          {isImport ? '批量开户导入' : (isEdit ? '编辑申请' : '新建申请')}
        </h2>
      </div>

      {/* 共享：开户主体信息 */}
      <Section title="开户主体信息">
        <Field label="集团池" required>
          <SelectField value={shared.groupPool} onChange={v => setSharedF('groupPool', v)} placeholder="请选择" options={GROUP_OPTIONS}/>
        </Field>
        <Field label="政策" required>
          <SelectField value={shared.policy} onChange={handlePolicyChange} placeholder="请选择政策" options={POLICY_OPTIONS}/>
        </Field>
        <Field label="服务商池" required last>
          <SelectField value={shared.pool} onChange={v => setSharedF('pool', v)} placeholder={shared.policy ? '选择政策后自动带出' : '请先选择政策'} options={Object.values(POLICY_TO_POOL)}/>
        </Field>
      </Section>

      {/* 开户明细 - 批量账户 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
          <div className="text-[14px] font-medium text-ink-900">开户明细</div>
          <div className="flex items-center gap-2">
            <button onClick={addAccount}
              className="h-7 px-3 bg-brand text-white rounded text-[12px] flex items-center gap-1 tap active:opacity-90">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              添加账户
            </button>
            <button onClick={() => setSubjectModalOpen(true)}
              className="h-7 px-3 bg-brand text-white rounded text-[12px] flex items-center gap-1 tap active:opacity-90">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              新建主体
            </button>
          </div>
        </div>

        <div className="space-y-3 p-3">
          {accounts.map((acc, idx) => (
            <AccountCard
              key={idx}
              index={idx}
              total={accounts.length}
              account={acc}
              subjects={subjects}
              onChange={(k, v) => updateAccount(idx, k, v)}
              onCopy={() => copyAccount(idx)}
              onDelete={() => deleteAccount(idx)}
              industryL2Map={INDUSTRY_L2}
              typeOptions={TYPE_OPTIONS}
              industryL1Options={INDUSTRY_L1}
            />
          ))}
        </div>
      </div>

      <FormActions
        onCancel={() => nav(-1)}
        onSubmit={handleSubmit}
        submitText={isImport ? '提 交' : (isEdit ? '保 存' : '提 交')}
      />

      {/* 新建主体 modal */}
      {subjectModalOpen && (
        <SubjectCreateModal
          name={newSubjectName}
          onChange={setNewSubjectName}
          onCancel={() => { setNewSubjectName(''); setSubjectModalOpen(false) }}
          onConfirm={confirmCreateSubject}
        />
      )}
    </div>
  )
}

function blankAccount(prev) {
  return {
    detailName: '',
    subject: '',
    type: '',
    industryL1: prev?.industryL1 || '',
    industryL2: prev?.industryL2 || '',
    keywords: prev?.keywords || '',
    totalIds: '',
    operator: prev?.operator || '',
    remark: '',
  }
}

// 单条账户卡（9 字段 + 复制 / 删除）
function AccountCard({ index, total, account, subjects, onChange, onCopy, onDelete, industryL2Map, typeOptions, industryL1Options }) {
  const industryL2Opts = industryL2Map[account.industryL1] || []
  const isOnly = total === 1
  return (
    <div className="border border-ink-200 rounded-lg overflow-hidden bg-white">
      <div className="px-4 py-2.5 border-b border-ink-100 flex items-center justify-between">
        <div className="text-[13px] font-medium text-ink-900">账户 {index + 1}</div>
        <div className="flex items-center gap-2">
          <button onClick={onCopy}
            className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M5 15V6a2 2 0 012-2h9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
            复制
          </button>
          {!isOnly && (
            <button onClick={onDelete}
              className="h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
              删除
            </button>
          )}
        </div>
      </div>

      <div>
        <Field label="明细名称" required>
          <input className="form-input" value={account.detailName} onChange={e => onChange('detailName', e.target.value)} placeholder="请输入明细名称"/>
        </Field>
        <Field label="开户主体" required>
          <SelectField value={account.subject} onChange={v => onChange('subject', v)} placeholder="请选择" options={subjects}/>
        </Field>
        <Field label="类型" required>
          <SelectField value={account.type} onChange={v => onChange('type', v)} placeholder="请选择类型" options={typeOptions}/>
        </Field>
        <Field label="一级行业">
          <SelectField value={account.industryL1} onChange={v => { onChange('industryL1', v); onChange('industryL2', '') }} placeholder="暂无" options={industryL1Options}/>
        </Field>
        <Field label="二级行业">
          <SelectField value={account.industryL2} onChange={v => onChange('industryL2', v)} placeholder={account.industryL1 ? '请选择二级行业' : '暂无'} options={industryL2Opts}/>
        </Field>
        <Field label="关键词">
          <input className="form-input" value={account.keywords} onChange={e => onChange('keywords', e.target.value)} placeholder="请输入关键词"/>
        </Field>
        <Field label="开户ID总数" required>
          <input type="number" className="form-input" value={account.totalIds} onChange={e => onChange('totalIds', e.target.value)} placeholder="请输入开户ID总数"/>
        </Field>
        <Field label="媒介开户人" required>
          <SelectField value={account.operator} onChange={v => onChange('operator', v)} placeholder="请选择媒介开户人" options={['冯孙杰', '张朔', '李基彬', '刘欢', '王靖雅', '潘建民', '陈志伟', '孙迢', '高丽岩', '孟丽珊']}/>
        </Field>
        <Field label="备注" last>
          <textarea rows={2} className="form-input resize-none w-full" value={account.remark} onChange={e => onChange('remark', e.target.value)} placeholder="请输入备注（可空）"/>
        </Field>
      </div>
    </div>
  )
}

// 新建主体 modal（图3）
function SubjectCreateModal({ name, onChange, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-6" onClick={onCancel}>
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="text-[16px] font-medium text-ink-900">新建主体</h3>
          <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="px-5 pt-1 pb-4">
          <div className="text-[13px] text-ink-700 mb-2">请输入主体名称</div>
          <input value={name} onChange={e => onChange(e.target.value)}
            placeholder="请输入主体名称"
            className="w-full h-10 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
        </div>
        <div className="flex-none flex border-t border-ink-100 px-3 py-3 gap-3">
          <button onClick={onCancel} className="flex-1 h-10 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
          <button onClick={onConfirm} className="flex-1 h-10 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">确认创建</button>
        </div>
      </div>
    </div>
  )
}