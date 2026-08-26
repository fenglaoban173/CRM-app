import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { findNode } from '../../data/mock'

/**
 * 期初余额 - 弹窗表单
 * 来源：集团列表 PC + 期初余额弹窗
 */
export default function InitialBalancePage() {
  const nav = useNavigate()
  const { id: groupId } = useParams()
  const listNode = findNode(99)
  const group = (listNode?.data || []).find(g => g.id === groupId) || {}
  const [balance, setBalance] = useState(group.initialBalance || '')

  return (
    <div className="bg-ink-50 min-h-full">
      <TopBar title="期初余额" onClose={() => nav(-1)}/>

      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          <div className="px-4 py-3">
            <div className="text-[13px] text-ink-900 mb-2 leading-tight">请输入期初余额</div>
            <input
              className="form-input"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              placeholder="请输入期初余额"
              type="number"
            />
          </div>
        </div>
      </div>

      {/* 底部按钮（钉钉式 sticky） */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex items-center justify-end gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="h-10 px-6 bg-white border border-ink-200 rounded text-[13px] text-ink-700 active:bg-ink-50 tap">取消</button>
        <button onClick={() => nav(-1)} className="h-10 px-6 bg-brand text-white rounded text-[13px] active:opacity-90 tap">确定</button>
      </div>
    </div>
  )
}

// ============ 顶部栏（带关闭按钮的弹窗样式）============
function TopBar({ title, onClose }) {
  return (
    <div className="bg-white sticky top-0 z-30 border-b border-ink-100">
      <div className="px-3 h-12 flex items-center justify-between">
        <h1 className="text-base font-medium text-ink-900">{title}</h1>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center tap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="#666" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}