import { useState } from 'react'
import { userEnterprisesData } from '../data/mock'

/**
 * 切换企业 sheet（钉钉式底部弹出）
 * - 列表式：左侧 logo 色块 + 企业名 + 角色，右侧当前/未选标记
 * - 底部「管理企业」入口 + 取消/确认切换双按钮
 * Props:
 *   currentId    当前企业 id
 *   onClose      关闭 sheet
 *   onSwitch(id) 确认切换回调
 */
export default function EnterpriseSwitchSheet({ currentId, onClose, onSwitch }) {
  const [picked, setPicked] = useState(currentId)
  const isSame = picked === currentId

  return (
    <div className="fixed inset-0 z-[80] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl overflow-hidden flex flex-col max-h-[80vh] animate-fade-in"
        onClick={e => e.stopPropagation()}>

        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 shrink-0">
          <h2 className="text-[15px] font-medium text-ink-900">切换企业</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center tap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto">
          {userEnterprisesData.map((ent, idx) => {
            const isCurrent = ent.id === picked
            const isLast = idx === userEnterprisesData.length - 1
            return (
              <button key={ent.id} onClick={() => setPicked(ent.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 tap text-left ${
                  isLast ? '' : 'border-b border-ink-100'
                } ${isCurrent ? 'bg-brand/5' : ''}`}>
                {/* Logo 色块 */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[14px] font-medium shrink-0"
                  style={{ background: ent.logoColor }}>
                  {ent.name.slice(0, 1)}
                </div>
                {/* 名称 + 角色 */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-ink-900 truncate">{ent.name}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">{ent.role}</div>
                </div>
                {/* 选中标记 */}
                {isCurrent ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M5 12l5 5L20 7" stroke="#2D7FF9" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="w-[18px] h-[18px] rounded-full border-2 border-ink-200 shrink-0"/>
                )}
              </button>
            )
          })}
        </div>

        {/* 底部「管理企业」入口 */}
        <div className="shrink-0 border-t border-ink-100 bg-ink-50 px-4 py-3">
          <button className="w-full flex items-center justify-between text-[13px] text-ink-700 tap">
            <span>管理企业</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="#BFBFBF" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 底部按钮（确认切换） */}
        <div className="shrink-0 flex border-t border-ink-100 px-3 py-3 gap-3 bg-white">
          <button onClick={onClose}
            className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">
            取 消
          </button>
          <button onClick={() => onSwitch(picked)} disabled={isSame}
            className={`flex-1 h-11 rounded-full text-[14px] tap ${
              isSame
                ? 'bg-ink-100 text-ink-400 cursor-not-allowed'
                : 'bg-brand text-white active:opacity-90'
            }`}>
            确认切换
          </button>
        </div>
      </div>
    </div>
  )
}