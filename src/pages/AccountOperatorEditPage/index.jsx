import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { TopBar } from '../../components/FormKit'

/**
 * 修改运营 - App 端版本
 * 来源：PC 修改运营弹窗（截图）
 *
 * 当前运营人员（可编辑表格：状态/日期可改）：运营人员 / 运营状态 / 生效日期 / 失效日期
 * 新增运营人员（可编辑）：默认 1 个空白行，+ 新增追加
 * 底部「取消 / 确认」：提交/放弃
 */
export default function AccountOperatorEditPage() {
  const nav = useNavigate()
  const { advId: advIdParam } = useParams()

  // 当前运营人员（可编辑字段：运营状态 / 生效日期 / 失效日期）
  const [current, setCurrent] = useState([
    { id: 'c1', name: '苏振寰', status: '运营中', startDate: '2026-08-25', endDate: '2026-08-26' },
    { id: 'c2', name: '李雪', status: '运营中', startDate: '2026-08-01', endDate: '' },
  ])

  // 新增运营人员（默认 1 个空白行）
  const [newRows, setNewRows] = useState([
    { id: 1, name: '', status: '', startDate: '', endDate: '' },
  ])

  const NAME_OPTIONS = ['王春雷', '李晓晨', '张静怡', '陈大伟', '赵宇航', '苏振寰', '李雪', '李慧彬']
  const STATUS_OPTIONS = ['运营中', '暂停', '已到期']

  const updateCurrent = (id, key, value) => {
    setCurrent(rows => rows.map(r => r.id === id ? { ...r, [key]: value } : r))
  }
  const updateNewRow = (id, key, value) => {
    setNewRows(rows => rows.map(r => r.id === id ? { ...r, [key]: value } : r))
  }
  const removeNewRow = (id) => {
    setNewRows(rows => rows.filter(r => r.id !== id))
  }
  const addNewRow = () => {
    setNewRows(rows => [...rows, { id: Date.now(), name: '', status: '', startDate: '', endDate: '' }])
  }

  const handleSubmit = () => {
    // 校验：新增行若有任一字段填写，则必填项都必须填
    const incomplete = newRows.find(r =>
      (r.name || r.status || r.startDate || r.endDate) &&
      (!r.name || !r.status || !r.startDate)
    )
    if (incomplete) {
      alert('请补全新增运营人员的必填项（运营人员/状态/生效日期）')
      return
    }
    alert('修改运营成功')
    nav(-1)
  }

  return (
    <div className="bg-ink-50 min-h-full pb-24">
      <TopBar title="修改运营" onBack={() => nav(-1)}/>

      {advIdParam && (
        <div className="px-4 pt-3 pb-1 text-[12px] text-ink-500">
          广告主ID：<span className="text-ink-700 font-mono">{advIdParam}</span>
        </div>
      )}

      {/* 当前运营人员（可编辑表格） */}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-lg">
          <div className="px-3 pt-3 pb-2 flex items-center gap-2">
            <span className="w-1 h-3.5 bg-brand rounded-sm"/>
            <span className="text-[14px] font-medium text-ink-900">当前运营人员</span>
          </div>
          <div className="px-3 pb-3">
            <div className="bg-ink-50 rounded-lg overflow-hidden">
              {/* 表头 */}
              <div className="grid grid-cols-4 text-[11px] text-ink-500 border-b border-ink-200">
                <div className="px-3 py-2.5 text-left font-normal">运营人员</div>
                <div className="px-2 py-2.5 text-left font-normal">运营状态</div>
                <div className="px-2 py-2.5 text-left font-normal">生效日期</div>
                <div className="px-2 py-2.5 text-left font-normal">失效日期</div>
              </div>
              {current.map(rowop => (
                <div key={rowop.id} className="grid grid-cols-4 items-stretch border-b border-ink-100 last:border-b-0">
                  <div className="px-3 py-2 flex items-center text-[12px] text-ink-900">{rowop.name}</div>
                  <div className="px-2 py-1.5">
                    <select
                      value={rowop.status}
                      onChange={e => updateCurrent(rowop.id, 'status', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-ink-200 rounded text-[12px] text-ink-900 focus:outline-none focus:border-brand"
                    >
                      {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="px-2 py-1.5">
                    <input
                      type="date"
                      value={rowop.startDate}
                      onChange={e => updateCurrent(rowop.id, 'startDate', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-ink-200 rounded text-[11px] text-ink-900 focus:outline-none focus:border-brand text-left"
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <input
                      type="date"
                      value={rowop.endDate}
                      onChange={e => updateCurrent(rowop.id, 'endDate', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-ink-200 rounded text-[11px] text-ink-900 focus:outline-none focus:border-brand text-left"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 新增运营人员（默认 1 个空白行） */}
      <div className="px-3 pt-3">
        <div className="bg-white rounded-lg">
          <div className="px-3 pt-3 pb-2 flex items-center gap-2">
            <span className="w-1 h-3.5 bg-brand rounded-sm"/>
            <span className="text-[14px] font-medium text-ink-900">新增运营人员</span>
            <button
              onClick={addNewRow}
              className="ml-auto h-7 px-3 bg-brand text-white rounded text-[11px] flex items-center gap-1 tap active:opacity-90"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
              </svg>
              新增
            </button>
          </div>
          <div className="px-3 pb-3 space-y-3">
            {newRows.map((row) => (
              <div key={row.id} className="bg-ink-50 rounded px-3 py-2.5 space-y-2.5">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                  <div>
                    <div className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"/>运营人员
                    </div>
                    <select
                      value={row.name}
                      onChange={e => updateNewRow(row.id, 'name', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-ink-200 rounded text-[12px] text-ink-900 focus:outline-none focus:border-brand appearance-none"
                    >
                      <option value="">请选择</option>
                      {NAME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"/>运营状态
                    </div>
                    <select
                      value={row.status}
                      onChange={e => updateNewRow(row.id, 'status', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-ink-200 rounded text-[12px] text-ink-900 focus:outline-none focus:border-brand appearance-none"
                    >
                      <option value="">请选择</option>
                      {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-red-500 mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"/>生效日期
                    </div>
                    <input
                      type="date"
                      value={row.startDate}
                      onChange={e => updateNewRow(row.id, 'startDate', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-ink-200 rounded text-[12px] text-ink-900 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-ink-700 mb-1">失效日期</div>
                    <input
                      type="date"
                      value={row.endDate}
                      onChange={e => updateNewRow(row.id, 'endDate', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-ink-200 rounded text-[12px] text-ink-900 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => removeNewRow(row.id)}
                    className="text-red-500 text-[12px] tap"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部：取消 / 确认（sticky） */}
      <div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100 mt-3">
        <button
          onClick={() => nav(-1)}
          className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 active:bg-ink-50 tap"
        >
          取 消
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] active:opacity-90 tap"
        >
          确 认
        </button>
      </div>
    </div>
  )
}