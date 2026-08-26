import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../Reports'

/**
 * 提交工单（App 端）
 * - 01 工单类型：系统问题 / 业务问题（radio cards）
 * - 02 问题描述：textarea（1-2000 字符，带计数器）
 * - 附件：拖拽/点选上传（.png .jpg .txt .rar .doc .xls .zip .7z .mp4 / 单文件 512M / 最多 10 个）
 * - 03 归属部门：select
 */
export default function WorkOrderCreatePage() {
  const nav = useNavigate()
  const [type, setType] = useState('')              // 系统问题 / 业务问题
  const [desc, setDesc] = useState('')
  const [files, setFiles] = useState([])           // [{name, size}]
  const [dept, setDept] = useState('')              // 部门
  const [toast, setToast] = useState('')
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const DEPT_OPTIONS = ['技术部', '人事行政部', '媒介部', '成都分公司']

  const submit = () => {
    if (!type) return showToast('请选择工单类型')
    if (!desc.trim()) return showToast('请填写问题描述')
    if (desc.length > 2000) return showToast('问题描述不能超过 2000 字')
    if (!dept) return showToast('请选择归属部门')

    // 构造工单数据 + 持久化到 localStorage（列表页会读取）
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`
    const seq = Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0')
    const wo = {
      id: `WT${stamp}${seq}`,
      type,
      system: type === '系统问题' ? '人事行政OA系统' : 'CRM系统',
      dept,
      companyCode: 'YGSD',
      status: '处理中',
      desc: desc.trim(),
      attachments: files.map(f => f.name),
      submitter: '冯孙杰',
      createdAt: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      handler: '未分配',
      reply: '—',
      closeReason: '—',
      closedAt: '—',
    }
    try {
      const list = JSON.parse(localStorage.getItem('wo_submitted') || '[]')
      list.unshift(wo)
      localStorage.setItem('wo_submitted', JSON.stringify(list))
    } catch {}

    showToast('提交成功')
    setTimeout(() => nav('/me/workorder'), 800)
  }

  const addFiles = (fileList) => {
    const arr = Array.from(fileList || [])
    const newFiles = arr.map(f => ({ name: f.name, size: f.size }))
    setFiles(prev => {
      const merged = [...prev, ...newFiles]
      if (merged.length > 10) {
        showToast('最多上传 10 个附件')
        return merged.slice(0, 10)
      }
      // 单文件不超过 512M
      const oversized = newFiles.find(f => f.size > 512 * 1024 * 1024)
      if (oversized) showToast(`${oversized.name} 超过 512M`)
      return merged.filter(f => f.size <= 512 * 1024 * 1024)
    })
  }

  return (
    <div className="bg-ink-50 min-h-full pb-4 relative">
      <TopBar title="提交工单"/>

      {/* ===== 01 工单类型 ===== */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-brand text-white text-[11px] font-medium flex items-center justify-center">01</span>
          <span className="text-[14px] font-medium text-ink-900">工单类型</span>
        </div>
        <div className="px-4 pb-1 text-[12px] text-ink-400">选择与您的问题最匹配的分类，便于快速路由到对应团队</div>
        <div className="px-4 pb-3 pt-2 grid grid-cols-2 gap-2.5">
          <TypeCard
            active={type === '系统问题'}
            onClick={() => setType('系统问题')}
            color={{ bg: '#FFE9E9', fg: '#FF5A5A' }}
            icon="x"
            title="系统问题"
            desc="系统异常、登录故障、功能不可用"
          />
          <TypeCard
            active={type === '业务问题'}
            onClick={() => setType('业务问题')}
            color={{ bg: '#E8F8EA', fg: '#34A853' }}
            icon="briefcase"
            title="业务问题"
            desc="业务流程、合同、财务、数据问题"
          />
        </div>
      </div>

      {/* ===== 02 问题描述 ===== */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-brand text-white text-[11px] font-medium flex items-center justify-center">02</span>
          <span className="text-[14px] font-medium text-ink-900">问题描述</span>
        </div>
        <div className="px-4 pb-1 text-[12px] text-ink-400">请详细描述您遇到的问题，1-2000 字符</div>
        <div className="px-4 pb-3 pt-2 relative">
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value.slice(0, 2000))}
            placeholder="请详细描述您遇到的问题，便于工程师快速定位"
            className="w-full h-32 px-3 py-2.5 bg-ink-50 rounded text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-brand resize-none"
          />
          <div className="absolute bottom-5 right-5 text-[11px] text-ink-400 pointer-events-none">
            {desc.length}/2000
          </div>
        </div>

        {/* 附件上传 */}
        <div className="px-4 pb-3">
          <div className="text-[12px] text-ink-700 mb-1.5">附件</div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            className={`rounded-xl border-2 border-dashed py-5 px-3 cursor-pointer text-center transition-colors ${
              dragOver ? 'border-brand bg-brand/5' : 'border-ink-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-[13px] text-ink-700">
              <span className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              将文件拖拽到此处，或 <span className="text-success font-medium">点击上传</span>
            </div>
            <div className="text-[11px] text-ink-400 mt-2">
              支持 .png .jpg .txt .rar .doc .xls .zip .7z .mp4 等格式，单个附件不得超过 512M，最多上传 10 个附件
            </div>
          </div>
          <input ref={fileInputRef} type="file" multiple className="hidden"
            onChange={e => { addFiles(e.target.files); e.target.value = '' }}/>

          {files.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-ink-50 rounded text-[12px] text-ink-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M16 6l-8 8a3 3 0 004 4l9-9a5 5 0 00-7-7L5 11a7 7 0 0010 10l8-8" stroke="#86909C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="flex-1 truncate">{f.name}</span>
                  <span className="text-ink-400 text-[11px]">{formatSize(f.size)}</span>
                  <button onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))} className="tap p-0.5 text-ink-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 03 归属部门 ===== */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-brand text-white text-[11px] font-medium flex items-center justify-center">03</span>
          <span className="text-[14px] font-medium text-ink-900">归属部门</span>
        </div>
        <div className="px-4 pb-1 text-[12px] text-ink-400">系统问题默认归属技术部，便于精准分派处理人员</div>
        <div className="px-4 pb-3 pt-2">
          <button onClick={() => openDeptPicker(DEPT_OPTIONS, setDept)} className="w-full h-11 px-3 bg-ink-50 rounded text-left flex items-center justify-between text-[13px] tap">
            <span className={dept ? 'text-ink-900' : 'text-ink-400'}>{dept || '请选择部门'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ===== 底部按钮：取消 + 提交工单 ===== */}
      <div className="mx-3 mt-4 flex items-center gap-3 sticky bottom-0 bg-ink-50 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
        <button onClick={() => nav(-1)}
          className="flex-1 h-11 bg-white border border-ink-200 rounded-full text-[14px] text-ink-700 tap">取 消</button>
        <button onClick={submit}
          className="flex-1 h-11 bg-brand text-white rounded-full text-[14px] tap flex items-center justify-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
          提交工单
        </button>
      </div>

      {toast && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] text-white text-[14px] px-5 py-2.5 rounded-lg bg-black/80">
          {toast}
        </div>
      )}
    </div>
  )
}

function TypeCard({ active, onClick, color, icon, title, desc }) {
  return (
    <button onClick={onClick}
      className={`relative rounded-xl p-3 text-left tap transition-all ${
        active ? 'border-2 border-brand bg-brand/5' : 'border-2 border-ink-100 bg-white'
      }`}>
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: color.bg }}>
          {icon === 'x' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={color.fg} strokeWidth="1.6"/>
              <path d="M9 9l6 6M15 9l-6 6" stroke={color.fg} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2" stroke={color.fg} strokeWidth="1.6"/>
              <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" stroke={color.fg} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-ink-900">{title}</div>
          <div className="text-[11px] text-ink-500 mt-0.5">{desc}</div>
        </div>
      </div>
      <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        active ? 'border-brand' : 'border-ink-200'
      }`}>
        {active && <span className="w-2 h-2 rounded-full bg-brand"/>}
      </div>
    </button>
  )
}

// ============ 部门选择 Sheet ============
function openDeptPicker(options, setDept) {
  // 简化为原生 confirm 风格弹层（无 router，简单可靠）
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 z-[60] bg-black/40 flex items-end'
  modal.innerHTML = `
    <div class="w-full bg-white rounded-t-2xl flex flex-col" style="max-height:60vh">
      <div class="flex items-center justify-between px-4 py-3 border-b border-ink-100">
        <h2 class="text-[15px] font-medium text-ink-900">选择归属部门</h2>
        <button id="wo-close" class="w-7 h-7 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="#999" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        ${options.map(o => `
          <button data-dept="${o}" class="wo-opt w-full text-left px-3 py-3 rounded text-[14px] text-ink-900 hover:bg-ink-50">${o}</button>
        `).join('')}
      </div>
    </div>
  `
  document.body.appendChild(modal)
  const close = () => modal.remove()
  modal.addEventListener('click', e => { if (e.target === modal) close() })
  modal.querySelector('#wo-close').onclick = close
  modal.querySelectorAll('.wo-opt').forEach(btn => {
    btn.onclick = () => { setDept(btn.dataset.dept); close() }
  })
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + 'M'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + 'G'
}