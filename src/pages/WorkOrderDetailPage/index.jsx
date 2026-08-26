import { useNavigate, useParams } from 'react-router-dom'
import { workOrdersData } from '../../data/mock'

/**
 * 工单详情（App 端）
 * 展示 PC 全部字段：工单编号 / 类型 / 系统 / 部门 / 公司编码 / 状态
 *                问题描述 / 附件 / 提交人 / 创建时间
 *                处理人员 / 回复内容 / 关闭原因 / 关闭时间
 */
export default function WorkOrderDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()

  // 查找工单（含 localStorage 新提交）
  const item = useMemo(() => {
    try {
      const submitted = JSON.parse(localStorage.getItem('wo_submitted') || '[]')
      return submitted.find(o => o.id === id) || workOrdersData.find(o => o.id === id) || workOrdersData[0]
    } catch {
      return workOrdersData[0]
    }
  }, [id])

  const statusBar = {
    '处理中': { bg: 'bg-warning/10', fg: 'text-warning', label: '处理中' },
    '已完成': { bg: 'bg-success/10', fg: 'text-success', label: '已完成' },
    '已关闭': { bg: 'bg-ink-100',   fg: 'text-ink-500', label: '已关闭' },
  }[item.status]

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="工单详情" onBack={() => nav(-1)}/>

      {/* 状态条 */}
      <div className={`mx-3 mt-3 px-4 py-3 rounded-xl flex items-center gap-2 ${statusBar.bg}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {item.status === '处理中' && <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>}
          {item.status === '已完成' && <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>}
          {item.status === '已关闭' && <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>}
        </svg>
        <span className={`text-[14px] font-medium ${statusBar.fg}`}>{item.status}</span>
        <span className="text-[12px] text-ink-400 ml-auto">{item.id}</span>
      </div>

      {/* 基本信息 */}
      <Section title="基本信息">
        <Row label="工单编号" value={item.id}/>
        <Row label="工单类型" value={
          <span className={`text-[11px] px-2 py-0.5 rounded ${
            item.type === '系统问题' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
          }`}>{item.type}</span>
        }/>
        <Row label="归属系统" value={item.system}/>
        <Row label="归属部门" value={item.dept}/>
        <Row label="公司编码" value={item.companyCode}/>
        <Row label="状态" value={
          <span className={`text-[11px] px-2 py-0.5 rounded ${statusBar.bg} ${statusBar.fg}`}>{item.status}</span>
        } last/>
      </Section>

      {/* 问题描述 */}
      <Section title="问题描述">
        <div className="px-4 py-3 text-[13px] text-ink-900 leading-relaxed whitespace-pre-wrap break-all">
          {item.desc || <span className="text-ink-300">（无描述）</span>}
        </div>
        {item.attachments && item.attachments.length > 0 && (
          <div className="px-4 pb-3">
            <div className="text-[11px] text-ink-400 mb-1.5">附件（{item.attachments.length}）</div>
            <div className="space-y-1.5">
              {item.attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-ink-50 rounded text-[12px] text-ink-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M16 6l-8 8a3 3 0 004 4l9-9a5 5 0 00-7-7L5 11a7 7 0 0010 10l8-8" stroke="#86909C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="truncate">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* 流转信息 */}
      <Section title="流转信息">
        <Row label="提交人" value={item.submitter}/>
        <Row label="创建时间" value={item.createdAt}/>
        <Row label="处理人员" value={item.handler} muted={item.handler === '未分配'}/>
        <Row label="回复内容" value={item.reply} muted={item.reply === '—'}/>
        <Row label="关闭原因" value={item.closeReason} muted={item.closeReason === '—'}/>
        <Row label="关闭时间" value={item.closedAt} muted={item.closedAt === '—'} last/>
      </Section>

      {/* 底部操作：处理中才显示 */}
      {item.status === '处理中' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ink-100 px-3 py-3 flex items-center gap-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <button onClick={() => nav(-1)}
            className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap">关闭工单</button>
          <button onClick={() => nav(-1)}
            className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap">标记完成</button>
        </div>
      )}
    </div>
  )
}

import { useMemo } from 'react'

// ============ 顶部栏 ============
function TopBar({ title, onBack }) {
  return (
    <div className="bg-brand text-white px-2 h-12 flex items-center sticky top-0 z-30 relative">
      <button onClick={onBack} className="w-8 h-8 flex items-center justify-center tap relative z-10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h1 className="text-base font-medium absolute left-0 right-0 text-center pointer-events-none">{title}</h1>
    </div>
  )
}

// ============ Section / Row ============
function Section({ title, children }) {
  return (
    <div className="mx-3 mt-3 card overflow-hidden">
      <div className="group-title"><span>{title}</span></div>
      <div className="pb-2">{children}</div>
    </div>
  )
}

function Row({ label, value, muted, last }) {
  return (
    <div className={`flex items-start justify-between px-4 py-2.5 text-[13px] gap-3 ${last ? '' : 'border-b border-ink-100/60'}`}>
      <span className="text-ink-500 shrink-0">{label}</span>
      <span className={`text-right break-all ${muted ? 'text-ink-300' : 'text-ink-900'}`}>
        {value || <span className="text-ink-300">--</span>}
      </span>
    </div>
  )
}