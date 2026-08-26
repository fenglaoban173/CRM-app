import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { advertiserAccountsData, colorMap } from '../../data/mock'
import { TopBar, Section, Field } from '../../components/FormKit'

/**
 * 账户详情页 — PC §3.4.3
 * 两种入口：
 *   /advertiser/account/detail/:id    → 单个账户详情
 *   /advertiser/account/batch-policy  → 批量更换政策 / 批量共享钱包 入口
 */
export default function AdvertiserAccountDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const hash = window.location.hash
  const isBatch = hash.includes('/advertiser/account/batch-policy')

  if (isBatch) return <BatchOpsPage onBack={() => nav(-1)}/>

  const item = advertiserAccountsData.find(a => a.id === id)
  if (!item) {
    return (
      <div className="bg-ink-50 min-h-full">
        <TopBar title="账户详情" onBack={() => nav(-1)}/>
        <div className="p-12 text-center text-ink-500 text-[13px]">未找到该账户</div>
      </div>
    )
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="账户详情" onBack={() => nav(-1)}/>

      <div className="bg-white px-4 py-4 border-b border-ink-100 mx-3 mt-3 rounded-card">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[16px] font-medium text-ink-900 leading-tight">{item.advName}</div>
          <Tag text={item.accountStatus} type={colorMap[item.accountStatus] || 'blue'}/>
        </div>
        <div className="text-[11px] text-ink-400 mt-1">
          广告主ID: {item.advId} · 媒体平台: {item.platform}
        </div>
      </div>

      <Section title="账户信息">
        <KV label="开户序列号" value={item.seqNo}/>
        <KV label="任务记录ID" value={item.taskId}/>
        <KV label="广告主ID" value={item.advId}/>
        <KV label="广告主名称" value={item.advName}/>
        <KV label="绑定钱包ID" value={item.walletId}/>
        <KV label="媒体账号状态" value={<Tag text={item.accountStatus} type={colorMap[item.accountStatus] || 'blue'}/>}/>
        <KV label="政策名称" value={item.policyName}/>
        <KV label="所属销售" value={item.sales}/>
        <KV label="一级行业" value={item.industryL1}/>
        <KV label="二级行业" value={item.industryL2}/>
        <KV label="媒体平台" value={item.platform}/>
        <KV label="客户名称" value={item.customerName}/>
        <KV label="客户集团" value={item.groupName}/>
        <KV label="充值录入返点" value={item.rechargeRebate}/>
        <KV label="政策返点比例" value={item.policyRebate}/>
        <KV label="来源" value={item.source}/>
        <KV label="创建人" value={item.creator}/>
        <KV label="创建时间" value={item.created}/>
        <KV label="更新时间" value={item.updated} last/>
      </Section>

      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">返 回</button>
        <button
          onClick={() => alert('已导出该账户的广告主ID')}
          className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">
          导出ID
        </button>
      </div>
    </div>
  )
}

// 批量操作页（无 id 时）
function BatchOpsPage({ onBack }) {
  const nav = useNavigate()
  const [op, setOp] = useState('policy')  // policy | wallet
  const [selectedPolicy, setSelectedPolicy] = useState('')
  const [walletId, setWalletId] = useState('')

  const POLICIES = ['巨量 Q3 返点政策', '磁力金牛 Q3 返点政策', '腾讯 Q3 返点政策', '聚光 Q3 返点政策', '快手 Q3 返点政策', '小红书 Q3 返点政策']

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="批量操作" onBack={onBack}/>

      <div className="px-3 pt-3">
        <div className="card p-1 flex items-center bg-ink-50">
          <button onClick={() => setOp('policy')}
            className={`flex-1 h-9 rounded-full text-[13px] tap ${op === 'policy' ? 'bg-brand text-white font-medium' : 'text-ink-700'}`}>
            批量更换政策
          </button>
          <button onClick={() => setOp('wallet')}
            className={`flex-1 h-9 rounded-full text-[13px] tap ${op === 'wallet' ? 'bg-brand text-white font-medium' : 'text-ink-700'}`}>
            批量共享钱包
          </button>
        </div>
      </div>

      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">{op === 'policy' ? '更换政策' : '共享钱包'}</div>
        <div>
          {op === 'policy' ? (
            <div className="px-4 py-3">
              <div className="text-[13px] text-ink-700 mb-2">
                <span className="text-danger mr-0.5">*</span>目标政策
              </div>
              <select value={selectedPolicy} onChange={e => setSelectedPolicy(e.target.value)}
                className="w-full h-10 px-3 bg-ink-50 rounded text-[13px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-brand">
                <option value="">请选择政策</option>
                {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="text-[11px] text-ink-400 mt-2 leading-relaxed">
                说明：将列表中已选中的账户批量更换到目标政策，原政策下的返点比例将失效。
              </div>
            </div>
          ) : (
            <div className="px-4 py-3">
              <div className="text-[13px] text-ink-700 mb-2">
                <span className="text-danger mr-0.5">*</span>目标钱包 ID
              </div>
              <input value={walletId} onChange={e => setWalletId(e.target.value)}
                placeholder="请输入共享钱包ID"
                className="w-full h-10 px-3 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand"/>
              <div className="text-[11px] text-ink-400 mt-2 leading-relaxed">
                说明：勾选的账户将共享同一钱包，账户余额将合并到目标钱包中。
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button onClick={onBack} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">取 消</button>
        <button
          onClick={() => {
            const ok = op === 'policy' ? Boolean(selectedPolicy) : Boolean(walletId)
            if (!ok) return alert('请填写完整信息')
            alert(op === 'policy' ? '已发起批量更换政策' : '已发起批量共享钱包')
            nav('/m/2276')
          }}
          className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">
          确认提交
        </button>
      </div>
    </div>
  )
}

function KV({ label, value, last }) {
  return (
    <div className={`flex items-start px-4 py-2.5 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="w-[110px] shrink-0 text-[12px] text-ink-500 pt-0.5">{label}</div>
      <div className="flex-1 min-w-0 text-[13px] text-ink-900 break-all">{value || '--'}</div>
    </div>
  )
}

function Tag({ text, type = 'gray' }) {
  const map = {
    green: 'bg-success/10 text-success',
    orange: 'bg-warning/10 text-warning',
    red: 'bg-danger/10 text-danger',
    blue: 'bg-brand/10 text-brand',
    gray: 'bg-ink-100 text-ink-500',
    purple: 'bg-purple/10 text-purple',
  }
  return <span className={`text-[10px] px-1.5 py-0.5 rounded ${map[type]}`}>{text}</span>
}