import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { advertiserDetailsData } from '../../data/mock'
import { TopBar, Section, Field, SelectField, FormActions } from '../../components/FormKit'

/**
 * 开户明细录入页 — PC §3.4.2
 * 板块 1：明细基本信息（只读）
 * 板块 2：录入方式选择（复制账户 / 批量导入 / 手工导入）
 */
export default function AdvertiserDetailEntryPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = advertiserDetailsData.find(d => d.id === id || d.seqNo === id) || {}

  const [mode, setMode] = useState('') // '' | 'copy' | 'batch' | 'manual'
  const [copyModalOpen, setCopyModalOpen] = useState(false)

  // 基本信息只读字段
  const basic = [
    ['集团池', item.groupName],
    ['政策', '--'],
    ['媒体平台', item.platform],
    ['客户返点比例', '--'],
    ['开户主体', '新开主体'],
    ['开户ID总数', item.totalIds],
    ['成功数量', '--'],
    ['待开数量', item.pendingCount],
    ['本次录入数量', '--'],
  ]

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="开户明细录入" onBack={() => nav(-1)}/>

      {/* 板块 1：明细基本信息（灰色只读 KV） */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">明细基本信息</div>
        <div>
          {basic.map(([label, value], idx) => (
            <div key={label} className={`flex items-center px-4 py-2.5 ${idx === basic.length - 1 ? '' : 'border-b border-ink-100'}`}>
              <div className="w-[110px] shrink-0 text-[12px] text-ink-500">{label}</div>
              <div className="flex-1 min-w-0 text-[13px] text-ink-900 text-right">{value ?? '--'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 板块 2：录入方式选择（3 个 chip 直接切换） */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">录入方式</div>
        <div className="px-4 py-3 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <ModeChip active={mode === 'copy'} onClick={() => { setMode('copy'); setCopyModalOpen(true) }}>复制账户</ModeChip>
            <ModeChip active={mode === 'batch'} onClick={() => setMode('batch')}>批量导入</ModeChip>
            <ModeChip active={mode === 'manual'} onClick={() => setMode('manual')}>手工录入</ModeChip>
          </div>
        </div>

        <div className="p-3">
          {mode === 'batch' && <BatchImportPanel/>}
          {mode === 'manual' && <ManualEntryPanel/>}
        </div>
      </div>

      <FormActions onCancel={() => nav(-1)} onSubmit={() => nav(-1)} submitText="保 存"/>

      {/* 复制账户 modal */}
      {copyModalOpen && (
        <CopyAccountModal
          item={item}
          onCancel={() => { setCopyModalOpen(false); setMode('') }}
          onConfirm={() => { setCopyModalOpen(false); setMode('') }}
        />
      )}
    </div>
  )
}

// ===== 批量导入面板（图3） =====
function BatchImportPanel() {
  return (
    <div className="space-y-2">
      <button className="h-7 px-3 bg-brand text-white rounded text-[12px] flex items-center gap-1 tap active:opacity-90">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        添加附件
      </button>
      <a className="text-brand text-[13px] tap ml-2">下载模板</a>
    </div>
  )
}

// ===== 手工录入面板（图4） =====
function ManualEntryPanel() {
  const [rows, setRows] = useState([blankRow()])
  const addRow = () => setRows(arr => [...arr, blankRow()])
  const updateRow = (idx, key, val) => setRows(arr => arr.map((r, i) => i === idx ? { ...r, [key]: val } : r))
  const removeRow = (idx) => setRows(arr => arr.length === 1 ? arr : arr.filter((_, i) => i !== idx))

  return (
    <div className="space-y-3">
      <button onClick={addRow}
        className="h-7 px-3 bg-brand text-white rounded text-[12px] flex items-center gap-1 tap active:opacity-90">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
        新增一行
      </button>

      {/* 表头 */}
      <div className="bg-ink-50 rounded-t-md grid grid-cols-4 text-center text-[12px] text-ink-700 py-2">
        <div>广告主ID</div>
        <div>前返比例(%)</div>
        <div>有效期开始时间</div>
        <div>有效期结束时间</div>
      </div>

      {/* 行 */}
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="relative bg-white border border-ink-100 rounded-md p-2 space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <input className="form-input" value={row.advId} onChange={e => updateRow(idx, 'advId', e.target.value)} placeholder="请输入广告主ID"/>
              <input type="number" className="form-input" value={row.rebateRate} onChange={e => updateRow(idx, 'rebateRate', e.target.value)} placeholder="请输入前返比例"/>
              <input type="date" className="form-input" value={row.startDate} onChange={e => updateRow(idx, 'startDate', e.target.value)}/>
              <input type="date" className="form-input" value={row.endDate} onChange={e => updateRow(idx, 'endDate', e.target.value)}/>
            </div>
            {rows.length > 1 && (
              <button onClick={() => removeRow(idx)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-ink-200 rounded-full flex items-center justify-center tap active:bg-ink-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function blankRow() {
  return { advId: '', rebateRate: '', startDate: '', endDate: '' }
}

// ===== 复制账户 modal（图2） =====
function CopyAccountModal({ item, onCancel, onConfirm }) {
  const [platform, setPlatform] = useState('头条-AD')
  const [agentId, setAgentId] = useState('央广时代【头条-AD】')
  const [selfReportType, setSelfReportType] = useState('收量报备') // 收量报备 / 非收量报备
  const [accountTag, setAccountTag] = useState('不复制') // 不复制 / 复制
  const [investQual, setInvestQual] = useState('不复制') // 不复制 / 复制
  const [srcId, setSrcId] = useState('123')
  const [namePrefix, setNamePrefix] = useState('')
  const [startNo, setStartNo] = useState('1')
  const [copyCount, setCopyCount] = useState('')

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-4 py-6" onClick={onCancel}>
      <div className="w-full max-w-[640px] max-h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <h3 className="text-[16px] font-medium text-ink-900">复制账户</h3>
          <button onClick={onCancel} className="w-6 h-6 flex items-center justify-center tap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
          <div className="bg-brand/5 px-3 py-2 rounded text-[13px] text-brand">复制头条账户</div>

          <FormField label="媒体平台" required>
            <SelectField value={platform} onChange={setPlatform} placeholder="请选择媒体平台" options={['头条-AD', '巨量引擎', '磁力金牛', '腾讯广告', '聚光', '小红书', '快手']}/>
          </FormField>

          <FormField label="代理商ID" required>
            <SelectField value={agentId} onChange={setAgentId} placeholder="请选择代理商" options={['央广时代【头条-AD】', '央广时代【巨量】', '央广时代【磁力】']}/>
          </FormField>

          <FormField label="自运营报备类型" required>
            <div className="flex items-center gap-2">
              <PillBtn active={selfReportType === '收量报备'} onClick={() => setSelfReportType('收量报备')}>收量报备</PillBtn>
              <PillBtn active={selfReportType === '非收量报备'} onClick={() => setSelfReportType('非收量报备')}>非收量报备</PillBtn>
            </div>
          </FormField>

          <FormField label="账户标签">
            <div className="flex items-center gap-2">
              <PillBtn active={accountTag === '不复制'} onClick={() => setAccountTag('不复制')}>不复制</PillBtn>
              <PillBtn active={accountTag === '复制'} onClick={() => setAccountTag('复制')}>复制</PillBtn>
            </div>
          </FormField>

          <FormField label="投资资质">
            <div className="flex items-center gap-2">
              <PillBtn active={investQual === '不复制'} onClick={() => setInvestQual('不复制')}>不复制</PillBtn>
              <PillBtn active={investQual === '复制'} onClick={() => setInvestQual('复制')}>复制</PillBtn>
            </div>
            <span className="text-[11px] text-ink-500 mt-1 block">注：原广告主账户的投放资质数量大于0且小于等于100时才会复制。</span>
          </FormField>

          <FormField label="被复制ID" required>
            <div className="flex items-center gap-2">
              <input className="form-input flex-1" value={srcId} onChange={e => setSrcId(e.target.value)} placeholder="请输入被复制ID"/>
              <button className="h-9 px-3 bg-brand text-white rounded text-[12px] shrink-0 tap active:opacity-90">验证并获取账户名称</button>
            </div>
            <span className="text-[11px] text-ink-500 mt-1 block">注：该操作为必须步骤</span>
          </FormField>

          <FormField label="账户名称前缀" required>
            <input className="form-input" value={namePrefix} onChange={e => setNamePrefix(e.target.value)} placeholder="请操作《验证并获取账户名称》或输入账户前缀"/>
          </FormField>

          <FormField label="起始编号" required>
            <input type="number" className="form-input" value={startNo} onChange={e => setStartNo(e.target.value)} placeholder="请输入起始编号"/>
          </FormField>

          <FormField label="复制数量" required>
            <input type="number" className="form-input" value={copyCount} onChange={e => setCopyCount(e.target.value)} placeholder="请输入复制数量"/>
          </FormField>
        </div>

        <div className="flex-none flex border-t border-ink-100 px-5 py-3 gap-3 justify-end shrink-0">
          <button onClick={onCancel} className="h-9 px-6 bg-white border border-ink-200 rounded text-[14px] text-ink-700 active:bg-ink-50 tap">取消</button>
          <button onClick={onConfirm} className="h-9 px-6 bg-brand text-white rounded text-[14px] active:opacity-90 tap">确定</button>
        </div>
      </div>
    </div>
  )
}

// 录入方式 chip（3 选 1）
function ModeChip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`h-8 px-4 rounded-full text-[13px] tap ${active ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>
      {children}
    </button>
  )
}
function PillBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className={`h-8 px-3 rounded text-[12px] tap ${active ? 'bg-brand text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>
      {children}
    </button>
  )
}

// modal 内单行（label 左 + 表单右）
function FormField({ label, required, children }) {
  return (
    <div className="flex items-start py-1.5">
      <div className="w-[110px] shrink-0 text-[13px] text-ink-700 pt-2">
        {required && <span className="text-danger mr-0.5">*</span>}
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
