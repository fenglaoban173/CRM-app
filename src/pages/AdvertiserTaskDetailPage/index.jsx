import { useNavigate, useParams } from 'react-router-dom'
import { advertiserTasksData, colorMap } from '../../data/mock'
import { TopBar, Section } from '../../components/FormKit'

/**
 * 任务详情页 — PC §3.4.4
 * 路由：/advertiser/task/detail/:id
 */
export default function AdvertiserTaskDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const item = advertiserTasksData.find(t => t.id === id)

  if (!item) {
    return (
      <div className="bg-ink-50 min-h-full">
        <TopBar title="任务详情" onBack={() => nav(-1)}/>
        <div className="p-12 text-center text-ink-500 text-[13px]">未找到该任务</div>
      </div>
    )
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="任务详情" onBack={() => nav(-1)}/>

      {/* 头部 */}
      <div className="bg-white px-4 py-4 border-b border-ink-100 mx-3 mt-3 rounded-card">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[16px] font-medium text-ink-900 leading-tight">{item.copyAdvId}</div>
          <Tag text={item.status} type={colorMap[item.status] || 'blue'}/>
        </div>
        <div className="text-[11px] text-ink-400 mt-1">
          任务ID: {item.id} · 集团: {item.groupName}
        </div>
      </div>

      <Section title="任务信息">
        <KV label="任务ID" value={item.id}/>
        <KV label="复制广告主ID" value={item.copyAdvId}/>
        <KV label="集团" value={item.groupName}/>
        <KV label="任务类型" value={item.type}/>
        <KV label="任务状态" value={<Tag text={item.status} type={colorMap[item.status] || 'blue'}/>}/>
        <KV label="录入数量" value={item.inputCount}/>
        <KV label="录入结果" value={item.result}/>
        <KV label="失败原因" value={item.failReason}/>
        <KV label="创建时间" value={item.created}/>
        <KV label="更新时间" value={item.updated} last/>
      </Section>

      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">返 回</button>
        <button
          onClick={() => alert('已导出任务ID：' + item.id)}
          className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap">
          导出ID
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