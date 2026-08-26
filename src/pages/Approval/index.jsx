import { useNavigate } from 'react-router-dom'
import { TopBar } from '../Reports'
import { MENU_TREE } from '../../data/mock'

// 在 MENU_TREE 中按 label 查找节点
const findByLabel = (label) => {
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.label === label) return n
      if (n.children) {
        const r = walk(n.children)
        if (r) return r
      }
    }
    return null
  }
  return walk(MENU_TREE)
}

const approvals = [
  { id: 1, type: '合同审批', title: '示例客户1 千川代投年框合同', applicant: '冯孙杰', date: '08-24 11:30', urgent: true, amount: '¥ 580,000' },
  { id: 2, type: '回款审批', title: '某电商品牌 Q3 回款 ¥ 300,000', applicant: '王芳', date: '08-24 10:15', urgent: true, amount: '¥ 300,000' },
  { id: 3, type: '退款审批', title: '美妆品牌-小红书 退款 ¥ 50,000', applicant: '李娜', date: '08-23 17:42', urgent: false, amount: '¥ 50,000' },
  { id: 4, type: '开户申请', title: '某新客户 巨量引擎开户', applicant: '冯孙杰', date: '08-23 14:20', urgent: false, amount: '--' },
  { id: 5, type: '媒体备款', title: '巨量引擎 Q3 备款 ¥ 1,000,000', applicant: '张磊', date: '08-23 09:00', urgent: false, amount: '¥ 1,000,000' },
]

export default function Approval() {
  const nav = useNavigate()
  // 审批列表 + 审批流配置
  const listNode = findByLabel('审批列表')
  const flowNode = findByLabel('审批流配置')

  return (
    <div className="bg-ink-50 pb-4">
      <TopBar title="审批中心"/>

      {/* KPI */}
      <div className="px-3 pt-3 grid grid-cols-3 gap-2">
        <div className="card p-3 text-center">
          <div className="text-[22px] font-bold text-danger leading-tight">5</div>
          <div className="text-[10px] text-ink-500 mt-0.5">待我审批</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-[22px] font-bold text-warning leading-tight">3</div>
          <div className="text-[10px] text-ink-500 mt-0.5">我发起的</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-[22px] font-bold text-ink-400 leading-tight">12</div>
          <div className="text-[10px] text-ink-500 mt-0.5">抄送我的</div>
        </div>
      </div>

      {/* 入口：审批列表 / 审批流配置 */}
      <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => listNode && nav(`/m/${listNode.id}`)}
          className="card p-3 tap flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-[12px] bg-brand/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#2D7FF9" strokeWidth="1.8"/>
              <path d="M8 10h8M8 14h6" stroke="#2D7FF9" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-left flex-1">
            <div className="text-[14px] font-medium">审批列表</div>
            <div className="text-[10px] text-ink-400 mt-0.5">所有审批单据</div>
          </div>
        </button>
        <button
          onClick={() => flowNode && nav(`/m/${flowNode.id}`)}
          className="card p-3 tap flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-[12px] bg-success/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="#34A853" strokeWidth="1.8"/>
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-left flex-1">
            <div className="text-[14px] font-medium">审批流配置</div>
            <div className="text-[10px] text-ink-400 mt-0.5">流程模板</div>
          </div>
        </button>
      </div>

      {/* 待审批列表 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title justify-between">
          <span>待我审批</span>
          <span
            onClick={() => listNode && nav(`/m/${listNode.id}`)}
            className="text-[11px] text-brand ml-auto"
          >
            查看全部
          </span>
        </div>
        <div className="divide-y divide-ink-100">
          {approvals.map(a => (
            <div key={a.id} className="px-4 py-3 flex items-center gap-3 tap" onClick={() => listNode && nav(`/m/${listNode.id}`)}>
              <div className={`w-1 h-10 rounded-full ${a.urgent ? 'bg-danger' : 'bg-brand'}`}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-brand bg-brand/10 px-1.5 py-0.5 rounded">{a.type}</span>
                  {a.urgent && <span className="text-[10px] text-danger bg-danger/10 px-1.5 py-0.5 rounded">紧急</span>}
                </div>
                <div className="text-[13px] text-ink-900 mt-1 truncate">{a.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-ink-400 mt-1">
                  <span>{a.applicant}</span>
                  <span>·</span>
                  <span>{a.date}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[12px] font-medium text-ink-900">{a.amount}</div>
                <button className="mt-1 text-[10px] text-brand">查看 ›</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
