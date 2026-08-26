import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { advertiserAppsData, advertiserDetailsData } from '../../data/mock'
import { TopBar, Section, Field } from '../../components/FormKit'

/**
 * 广告主详情页 — 共用（开户申请 / 开户明细）
 * 根据 id 路由前缀判断数据源：
 *   /advertiser/apply/detail/:id   → advertiserAppsData
 *   /advertiser/detail/info/:id    → advertiserDetailsData
 */
export default function AdvertiserDetailPage() {
  const nav = useNavigate()
  const { id } = useParams()
  const hash = window.location.hash
  const isApply = hash.includes('/advertiser/apply/detail/')
  const data = isApply ? advertiserAppsData : advertiserDetailsData
  const item = data.find(d => d.id === id || d.seqNo === id)

  if (!item) {
    return (
      <div className="bg-ink-50 min-h-full">
        <TopBar title={isApply ? '开户申请详情' : '开户明细详情'} onBack={() => nav(-1)}/>
        <div className="p-12 text-center text-ink-500 text-[13px]">未找到该记录</div>
      </div>
    )
  }

  return (
    <div className="bg-ink-50 min-h-full pb-8">
      <TopBar title={isApply ? '开户申请详情' : '开户明细详情'} onBack={() => nav(-1)}/>

      {/* 头部信息卡 */}
      <div className="bg-white px-4 py-4 border-b border-ink-100 mx-3 mt-3 rounded-card">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[16px] font-medium text-ink-900 leading-tight">
            {isApply ? item.groupName : item.detailName}
          </div>
          <span className="text-[13px] text-ink-700 shrink-0">{item.status}</span>
        </div>
        <div className="text-[11px] text-ink-400 mt-1">
          {isApply ? `开户序列号: ${item.seqNo}` : `开户序列号: ${item.seqNo} · 媒体: ${item.platform}`}
        </div>
      </div>

      {/* 基本信息 */}
      <Section title={isApply ? '申请基本信息' : '明细基本信息'}>
        {isApply ? (
          <>
            <KV label="开户序列号" value={item.seqNo}/>
            <KV label="集团名称" value={item.groupName}/>
            <KV label="复制广告主ID" value={item.copyAdvId}/>
            <KV label="服务商池" value={item.pool}/>
            <KV label="开户状态" value={item.status}/>
            <KV label="销售" value={item.sales}/>
            <KV label="创建人" value={item.creator}/>
            <KV label="创建时间" value={item.created}/>
            <KV label="更新时间" value={item.updated} last/>
          </>
        ) : (
          <>
            <KV label="开户序列号" value={item.seqNo}/>
            <KV label="明细名称" value={item.detailName}/>
            <KV label="集团名称" value={item.groupName}/>
            <KV label="政策名称" value={item.policyName}/>
            <KV label="客户返点比例" value={item.rebateRate}/>
            <KV label="媒体平台" value={item.platform}/>
            <KV label="复制广告主ID" value={item.copyAdvId}/>
            <KV label="开户主体" value={item.subject}/>
            <KV label="一级行业" value={item.industryL1}/>
            <KV label="二级行业" value={item.industryL2}/>
            <KV label="关键词" value={item.keywords}/>
            <KV label="媒介开户人" value={item.operator}/>
            <KV label="开户ID总数" value={item.totalIds}/>
            <KV label="成功数量" value={item.successCount}/>
            <KV label="待开数量" value={item.pendingCount}/>
            <KV label="类型" value={item.type}/>
            <KV label="服务商池" value={item.pool}/>
            <KV label="状态" value={item.status}/>
            <KV label="备注" value={item.remark}/>
            <KV label="销售" value={item.sales}/>
            <KV label="创建人" value={item.creator}/>
            <KV label="创建时间" value={item.created}/>
            <KV label="更新时间" value={item.updated} last/>
          </>
        )}
      </Section>

      {/* 底部按钮（开户明细详情保留返回，开户申请详情无按钮） */}
      {!isApply && (
        <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
          <button onClick={() => nav(-1)} className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap">返 回</button>
        </div>
      )}
    </div>
  )
}

// 简化 key-value 行
function KV({ label, value, last }) {
  return (
    <div className={`flex items-start px-4 py-2.5 ${last ? '' : 'border-b border-ink-100'}`}>
      <div className="w-[110px] shrink-0 text-[12px] text-ink-500 pt-0.5">{label}</div>
      <div className="flex-1 min-w-0 text-[13px] text-ink-900 break-all">{value || '--'}</div>
    </div>
  )
}