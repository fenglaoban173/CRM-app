import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { TopBar } from '../../components/FormKit'
import { operationReportDetailData, monthlyReportDetailData } from '../../data/mock'

/**
 * 月报二级详情
 * 来源：PC 月报 - 运营/部门卡片点击详情（图2 / 图5）
 *
 * URL 参数：?dim=operator|dept&media=total|toutiao|...&name=xxx&total=xxx
 *
 * 顶部：TopBar（{实体名} - 非赠款消耗 {N}）
 * 上段：横滑聚合卡（媒体平台列表 / 客户列表）— 选中态高亮
 * 下段：明细表格（日期/广告主ID/广告主名称/媒体平台/客户名称/行业/非赠款消耗金额）
 * 分页 15条/页
 */
export default function MonthlyReportDetailPage() {
  const nav = useNavigate()
  const [search] = useSearchParams()
  const dim = search.get('dim') === 'dept' ? 'dept' : 'operator'
  const mediaKey = search.get('media') || 'total'
  const name = search.get('name') || ''
  const total = parseFloat(search.get('total') || '0')

  const dimData = monthlyReportDetailData[dim]
  // 根据当前选中媒体过滤子聚合
  const allSubs = dimData.subs
  const subsForMedia = (allSubs[mediaKey] && allSubs[mediaKey].length > 0)
    ? allSubs[mediaKey]
    : (allSubs.total || [])
  const [activeSub, setActiveSub] = useState(0)

  const PAGE_SIZE = 15
  const rows = dimData.rows
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="bg-ink-50 min-h-full pb-20">
      <TopBar title={`${name} - 非赠款消耗 ${total.toFixed(2)}`} onBack={() => nav(-1)}/>

      {/* 聚合卡片横滑条 */}
      <div className="px-3 pt-3">
        <div className="card p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-3.5 bg-brand rounded-sm"/>
            <span className="text-[13px] font-medium text-ink-900">
              {dim === 'operator' ? '媒体平台' : '客户'}（{subsForMedia.length}）
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
            <div className="flex gap-2 pb-1">
              {subsForMedia.map((sub, i) => {
                const isActive = i === activeSub
                return (
                  <button key={`${sub.name}-${i}`} onClick={() => setActiveSub(i)}
                    className={`shrink-0 w-28 rounded-lg p-2.5 text-left relative transition ${
                      isActive ? 'bg-brand/5 border border-brand' : 'bg-ink-50 border border-transparent'
                    }`}>
                    {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-brand rounded-r"/>}
                    <div className="text-[11px] text-ink-700 truncate">{sub.name}</div>
                    <div className="text-[9px] text-ink-400 mt-0.5">非赠款消耗</div>
                    <div className="text-[13px] font-bold text-ink-900 font-mono mt-0.5">{sub.nonGift.toFixed(2)}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 明细表格 */}
      <div className="px-3 pt-3">
        <div className="card overflow-hidden">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-brand rounded-sm"/>
              <span className="text-[13px] font-medium text-ink-900">明细数据</span>
            </div>
            <span className="text-[11px] text-ink-400">共 {rows.length} 条</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-[11px]" style={{ minWidth: 560 }}>
              <thead className="bg-ink-50 text-ink-500">
                <tr>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 90 }}>日期</th>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 100 }}>广告主ID</th>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 110 }}>广告主名称</th>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 90 }}>媒体平台</th>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 110 }}>客户名称</th>
                  <th className="px-3 py-2.5 text-left font-medium whitespace-nowrap" style={{ minWidth: 80 }}>行业</th>
                  <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap" style={{ minWidth: 100 }}>非赠款消耗金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {pagedRows.map((row, i) => (
                  <tr key={i} className="hover:bg-ink-50/50">
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-700" style={{ minWidth: 90 }}>{row.date}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-900 font-mono" style={{ minWidth: 100 }}>{row.advId}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-900" style={{ minWidth: 110 }}>{row.advName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-700" style={{ minWidth: 90 }}>{row.platform}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-700" style={{ minWidth: 110 }}>{row.customer}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-700" style={{ minWidth: 80 }}>{row.industry}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-ink-900 font-mono text-right" style={{ minWidth: 100 }}>{row.nonGift.toFixed(2)}</td>
                  </tr>
                ))}
                {pagedRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-[12px] text-ink-400">暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between px-3 py-3 text-[11px] text-ink-400">
            <span>{PAGE_SIZE} 条/页</span>
            <span>共 {rows.length} 条</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1}
                className="w-6 h-6 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <span className="px-2 text-ink-700">{safePage}/{totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages}
                className="w-6 h-6 rounded border border-ink-200 bg-white flex items-center justify-center disabled:opacity-40">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#666" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}