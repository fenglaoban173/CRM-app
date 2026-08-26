import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { findNode } from '../../data/mock'

/**
 * 集团交接 - 表单 + 交接记录
 * 来源：集团列表 PC + 集团交接弹窗
 */
export default function GroupHandoverPage() {
  const nav = useNavigate()
  const { id: groupId } = useParams()
  const listNode = findNode(99)
  const group = (listNode?.data || []).find(g => g.id === groupId) || {}
  const [dept, setDept] = useState('')
  const [to, setTo] = useState('')
  const [content, setContent] = useState('')

  // Mock：交接记录（按 PC 截图 1 条）
  const records = [
    {
      groupName: group.name || '共读科技',
      contentType: '集团',
      creator: '潘建民',
      operator: '宋雅倩',
      to: '陈志伟',
      time: '2026-08-24 09:51:06',
    },
  ]

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar onClose={() => nav(-1)}/>

      <div className="px-3 pt-3">
        {/* 顶部 3 列只读信息卡 */}
        <div className="card overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-ink-100">
            <DisplayCell label="集团名称" value={group.name || '共读科技'}/>
            <DisplayCell label="创建人" value={group.creator || '潘建民'}/>
            <DisplayCell label="当前销售人员" value={group.sales || '陈志伟'}/>
          </div>
        </div>

        {/* 部门 + 交接人 */}
        <div className="card overflow-hidden mt-3">
          <div className="px-4 py-3 grid grid-cols-2 gap-x-3 border-b border-ink-100">
            <Field label="部门" required>
              <SelectField value={dept} onChange={setDept} placeholder="请选择部门"
                options={['销售一部', '销售二部', '销售三部']}/>
            </Field>
            <Field label="交接人" required last>
              <SelectField value={to} onChange={setTo} placeholder="请先选择部门"
                options={['宋雅倩', '王春雷', '冯孙杰', '陈志伟']}/>
            </Field>
          </div>
          <div className="px-4 py-3">
            <Field label="交接内容" required last>
              <SelectField value={content} onChange={setContent} placeholder="请选择交接内容"
                options={['集团', '项目']}/>
            </Field>
          </div>
        </div>

        {/* 交接记录 */}
        <div className="card overflow-hidden mt-3">
          <div className="group-title flex items-center justify-between">
            <span>交接记录</span>
            <span className="text-[11px] text-ink-400 font-normal">共 {records.length} 条</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-ink-50 text-ink-500 text-left">
                  <th className="py-2 px-3 font-normal">集团名称</th>
                  <th className="py-2 px-3 font-normal">交接内容</th>
                  <th className="py-2 px-3 font-normal">创建人</th>
                  <th className="py-2 px-3 font-normal">操作人</th>
                  <th className="py-2 px-3 font-normal">交接人</th>
                  <th className="py-2 px-3 font-normal whitespace-nowrap">交接时间</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} className="border-t border-ink-100">
                    <td className="py-2.5 px-3 text-ink-900">{r.groupName}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand">{r.contentType}</span>
                    </td>
                    <td className="py-2.5 px-3 text-ink-900">{r.creator}</td>
                    <td className="py-2.5 px-3 text-ink-900">{r.operator}</td>
                    <td className="py-2.5 px-3 text-ink-900">{r.to}</td>
                    <td className="py-2.5 px-3 text-ink-900 whitespace-nowrap">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex items-center justify-end gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="h-10 px-6 bg-white border border-ink-200 rounded text-[13px] text-ink-700 active:bg-ink-50 tap">取消</button>
        <button onClick={() => nav(-1)} className="h-10 px-6 bg-brand text-white rounded text-[13px] active:opacity-90 tap">确认交接</button>
      </div>
    </div>
  )
}

// ============ 顶部栏 ============
function TopBar({ onClose }) {
  return (
    <div className="bg-white sticky top-0 z-30">
      <div className="px-3 pt-3 pb-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded bg-brand/10 flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 12h12M14 6l4 4M18 14l-4-4" stroke="#2D7FF9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h1 className="text-base font-medium text-ink-900 leading-tight">集团交接</h1>
          <p className="text-[11px] text-ink-400 mt-1 leading-relaxed">将集团或项目资源交接给指定员工</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap -mr-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="h-px bg-ink-100"/>
    </div>
  )
}

// ============ 只读单元格 ============
function DisplayCell({ label, value }) {
  return (
    <div className="px-3 py-3">
      <div className="text-[11px] text-ink-400 mb-1">{label}</div>
      <div className="text-[13px] text-ink-900 truncate">{value}</div>
    </div>
  )
}

// ============ 字段 ============
function Field({ label, required, last, children }) {
  return (
    <div className={last ? '' : ''}>
      <div className="text-[13px] text-ink-900 mb-2 leading-tight">
        {required && <span className="text-danger mr-1">*</span>}
        {label}
      </div>
      {children}
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