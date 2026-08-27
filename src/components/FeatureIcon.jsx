/**
 * 彩色功能图标 - 参考截图里的圆角彩色图标
 * 颜色：blue / green / orange / red / gray / purple
 */
const colors = {
  blue: { bg: '#EBF3FF', fg: '#2D7FF9' },
  green: { bg: '#E8F8EA', fg: '#34A853' },
  orange: { bg: '#FFF3E5', fg: '#FF9A3C' },
  red: { bg: '#FFE9E9', fg: '#FF5A5A' },
  gray: { bg: '#F0F2F5', fg: '#999999' },
  purple: { bg: '#F0E9FF', fg: '#9B7FF5' },
}

export default function FeatureIcon({ name, color = 'blue', size = 44 }) {
  const c = colors[color] || colors.blue
  return (
    <div
      className="flex items-center justify-center rounded-[14px] shrink-0"
      style={{ width: size, height: size, background: c.bg }}
    >
      <IconSvg name={name} color={c.fg} size={size * 0.55} />
    </div>
  )
}

function IconSvg({ name, color, size }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' }
  const stroke = { stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (name) {
    case '客户':
    case 'customers':
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3.5" {...stroke} />
          <path d="M3 20c0-3 3-5 6-5s6 2 6 5" {...stroke} />
          <circle cx="17" cy="9" r="2.5" {...stroke} />
          <path d="M15 14c2-1 4-1 5 0v3" {...stroke} />
        </svg>
      )
    case '联系人':
    case 'contacts':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
          <circle cx="12" cy="11" r="2.5" {...stroke} />
          <path d="M8 17c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5" {...stroke} />
        </svg>
      )
    case '销售机会':
    case 'opportunity':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
        </svg>
      )
    case '开户':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" {...stroke} />
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path d="M5 12h14M12 9v6" {...stroke} />
        </svg>
      )
    case '直播':
    case 'video':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="13" height="12" rx="2" {...stroke} />
          <path d="M16 10l5-3v10l-5-3" {...stroke} />
        </svg>
      )
    case '素材':
    case 'image':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
          <circle cx="9" cy="10" r="1.5" fill={color}/>
          <path d="M3 17l5-5 4 4 3-3 6 6" {...stroke} />
        </svg>
      )
    case '合同订单':
    case 'contract':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 8h6M9 12h6M9 16h4" {...stroke} />
        </svg>
      )
    case '实际回款':
    case 'payment':
      return (
        <svg {...props}>
          <path d="M12 3v18M17 7H9.5a2.5 2.5 0 100 5h5a2.5 2.5 0 010 5H7" {...stroke} />
        </svg>
      )
    case '公海':
    case 'sea':
      return (
        <svg {...props}>
          <path d="M3 14c2-1 3-1 5 0s3 1 5 0 3-1 5 0 3 1 3 1" {...stroke} />
          <path d="M3 18c2-1 3-1 5 0s3 1 5 0 3-1 5 0 3 1 3 1" {...stroke} />
          <circle cx="12" cy="8" r="2.5" {...stroke} />
          <path d="M9 11l3-3 3 3" {...stroke} />
        </svg>
      )
    case '线索':
    case 'leads':
      return (
        <svg {...props}>
          <path d="M4 4h7v7H4z" {...stroke} />
          <path d="M13 4h7v7h-7z" {...stroke} />
          <path d="M4 13h7v7H4z" {...stroke} />
          <path d="M13 13h7v7h-7z" {...stroke} />
        </svg>
      )
    case '跟进记录':
    case 'follow':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
        </svg>
      )
    case '查重工具':
    case 'dedupe':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
          <path d="M8 3v4M16 3v4M3 10h18" {...stroke} />
          <circle cx="8" cy="14" r="1" fill={color}/>
          <circle cx="12" cy="14" r="1" fill={color}/>
          <circle cx="16" cy="14" r="1" fill={color}/>
        </svg>
      )
    case '附近客户':
    case 'nearby':
      return (
        <svg {...props}>
          <path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" {...stroke} />
          <circle cx="12" cy="9" r="2.5" {...stroke} />
        </svg>
      )
    case '拜访签到':
    case 'checkin':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <path d="M9 3v4M15 3v4M4 10h16" {...stroke} />
          <path d="M8 15l2 2 4-4" {...stroke} />
        </svg>
      )
    case '新建拜访':
    case 'visit':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <path d="M9 3v4M15 3v4M4 10h16" {...stroke} />
          <path d="M12 13v4M10 15h4" {...stroke} />
        </svg>
      )
    case '新建跟进':
    case 'follow-new':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
          <path d="M19 5v4M17 7h4" {...stroke} />
        </svg>
      )
    case '新建日程':
    case 'schedule':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <path d="M9 3v4M15 3v4M4 10h16" {...stroke} />
          <path d="M12 13v3M10.5 14.5h3" {...stroke} />
        </svg>
      )
    case '新建日报':
    case 'daily':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 8h6M9 12h6M9 16h4" {...stroke} />
          <circle cx="17" cy="6" r="2.5" fill={color}/>
        </svg>
      )
    case '草稿箱':
    case 'draft':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" {...stroke} />
          <path d="M3 10h18M8 6V4h8v2" {...stroke} />
        </svg>
      )
    case '扫描名片':
    case 'scan':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" {...stroke} />
          <path d="M3 10h18" {...stroke} />
          <path d="M7 14v2M11 14v2M15 14v2" {...stroke} />
        </svg>
      )
    case '拜访计划':
    case 'plan':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <path d="M9 3v4M15 3v4M4 10h16" {...stroke} />
          <path d="M9 15l2-2 2 2 3-3" {...stroke} />
        </svg>
      )
    case '报价单':
    case 'quote':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <text x="12" y="16" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">¥</text>
        </svg>
      )
    // ===== 业务管理模块（caidan.json） =====
    case '集团管理':
      return (
        <svg {...props}>
          <rect x="3" y="8" width="18" height="13" rx="1.5" {...stroke} />
          <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18" {...stroke} />
        </svg>
      )
    case '主体管理':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 8h6M9 12h6M9 16h4" {...stroke} />
        </svg>
      )
    case '项目管理':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="8" height="6" rx="1" {...stroke} />
          <rect x="13" y="5" width="8" height="6" rx="1" {...stroke} />
          <rect x="3" y="13" width="8" height="6" rx="1" {...stroke} />
          <rect x="13" y="13" width="8" height="6" rx="1" {...stroke} />
        </svg>
      )
    case '广告主管理':
      return (
        <svg {...props}>
          <path d="M12 3l9 4-9 4-9-4 9-4z" {...stroke} />
          <path d="M3 12l9 4 9-4M3 17l9 4 9-4" {...stroke} />
        </svg>
      )
    case '政策管理':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 7h6M9 11h6M9 15h4" {...stroke} />
          <circle cx="16" cy="16" r="3" fill={color}/>
          <path d="M15 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'KPI管理':
      return (
        <svg {...props}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...stroke} />
          <circle cx="10" cy="4" r="1.5" fill={color}/>
        </svg>
      )
    case '销售报表':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
          <path d="M8 8h8M8 12h8M8 16h5" {...stroke} />
        </svg>
      )
    // 财务中心
    case '合同列表':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="13" rx="1.5" {...stroke} />
          <path d="M8 6V4h8v2M4 10h16M8 14h8M8 17h5" {...stroke} />
        </svg>
      )
    case '回款管理':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" {...stroke} />
          <circle cx="12" cy="12" r="2.5" {...stroke} />
          <path d="M6 12h.01M18 12h.01" {...stroke} />
        </svg>
      )
    case '余额管理':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" {...stroke} />
          <path d="M3 10h18" {...stroke} />
          <path d="M7 15h4" {...stroke} />
        </svg>
      )
    case '退款管理':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 9l6 6M15 9l-6 6" {...stroke} />
        </svg>
      )
    case '媒体备款':
    case '媒体备款管理':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="14" rx="1" {...stroke} />
          <path d="M3 10h18M8 14h2M12 14h4" {...stroke} />
        </svg>
      )
    case '开票管理':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" {...stroke} />
          <path d="M9 8h6M9 12h6M9 16h4" {...stroke} />
          <circle cx="16" cy="16" r="3" fill={color}/>
          <path d="M15 16l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    // 报表中心
    case '业务报表':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M12 3v18M3 12h18" {...stroke} />
        </svg>
      )
    case '运营报表':
      return (
        <svg {...props}>
          <path d="M3 12l4-4 4 4 4-6 6 8" {...stroke} />
          <circle cx="7" cy="8" r="1.5" fill={color}/>
          <circle cx="11" cy="12" r="1.5" fill={color}/>
          <circle cx="15" cy="6" r="1.5" fill={color}/>
          <circle cx="21" cy="14" r="1.5" fill={color}/>
        </svg>
      )
    case '媒介报表':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
          <path d="M8 12l3 3 5-6" {...stroke} />
        </svg>
      )
    case '财务看板':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="1.5" {...stroke} />
          <path d="M7 21h10M12 17v4" {...stroke} />
          <path d="M8 11l2-2 2 2 2-4 2 3" {...stroke} />
        </svg>
      )
    // 运营中心
    case '运营消耗列表':
      return (
        <svg {...props}>
          <path d="M4 20V4M4 20h16" {...stroke} />
          <rect x="7" y="11" width="3" height="6" rx="0.5" {...stroke} />
          <rect x="12" y="7" width="3" height="10" rx="0.5" {...stroke} />
          <rect x="17" y="13" width="3" height="4" rx="0.5" {...stroke} />
        </svg>
      )
    case '账户ID':
    case 'account-id':
      return (
        <svg {...props}>
          <circle cx="12" cy="9" r="3.5" {...stroke} />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" {...stroke} />
          <circle cx="18" cy="6" r="2" fill={color}/>
        </svg>
      )
    case '唯品会报表':
      return (
        <svg {...props}>
          <path d="M5 8h14l-1 11a2 2 0 01-2 2H8a2 2 0 01-2-2L5 8z" {...stroke} />
          <path d="M9 8V6a3 3 0 016 0v2" {...stroke} />
        </svg>
      )
    // 财务数据看板
    case '媒体返点配置':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" {...stroke} />
        </svg>
      )
    case '业绩汇总':
      return (
        <svg {...props}>
          <path d="M4 20V4M4 20h16" {...stroke} />
          <path d="M7 16l3-3 3 2 5-6" {...stroke} />
          <circle cx="7" cy="16" r="1.2" fill={color}/>
          <circle cx="10" cy="13" r="1.2" fill={color}/>
          <circle cx="13" cy="15" r="1.2" fill={color}/>
        </svg>
      )
    case '服务单结算管理':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 9h6M9 13h6" {...stroke} />
          <circle cx="16" cy="17" r="3" fill={color}/>
          <path d="M15 17l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case '明点全景':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
          <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
          <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
          <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
          <circle cx="6.5" cy="6.5" r="1" fill={color}/>
          <circle cx="17.5" cy="6.5" r="1" fill={color}/>
          <circle cx="6.5" cy="17.5" r="1" fill={color}/>
          <circle cx="17.5" cy="17.5" r="1" fill={color}/>
        </svg>
      )
    case '利润列表':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <text x="12" y="16" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">¥</text>
        </svg>
      )
    case '运营人员看板':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="1.5" {...stroke} />
          <path d="M8 21h8M12 17v4" {...stroke} />
          <path d="M7 12l3-3 3 3 2-4 2 5" {...stroke} />
        </svg>
      )
    case '服务单消耗报表':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 8h6M9 12h4" {...stroke} />
          <circle cx="16" cy="15" r="3" {...stroke} />
          <path d="M14.5 15h3M16 13.5v3" {...stroke} />
        </svg>
      )
    case '开户申请':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="13" height="18" rx="2" {...stroke} />
          <path d="M7 8h7M7 12h7M7 16h4" {...stroke} />
          <circle cx="18" cy="6" r="3.5" fill={color}/>
          <path d="M18 4.5v3M16.5 6h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case '开户明细':
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" {...stroke} />
          <path d="M4 8h16" {...stroke} />
          <circle cx="8" cy="13" r="0.8" fill={color}/>
          <path d="M10.5 13h7" {...stroke} />
          <circle cx="8" cy="17" r="0.8" fill={color}/>
          <path d="M10.5 17h6" {...stroke} />
        </svg>
      )
    case '账户列表':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="4" rx="1" {...stroke} />
          <circle cx="6.5" cy="7" r="1" fill={color}/>
          <path d="M10 7h8" {...stroke} />
          <rect x="3" y="11" width="18" height="4" rx="1" {...stroke} />
          <circle cx="6.5" cy="13" r="1" fill={color}/>
          <path d="M10 13h8" {...stroke} />
          <rect x="3" y="17" width="18" height="4" rx="1" {...stroke} />
          <circle cx="6.5" cy="19" r="1" fill={color}/>
          <path d="M10 19h6" {...stroke} />
        </svg>
      )
    case '任务列表':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" {...stroke} />
          <rect x="7" y="8" width="3" height="3" rx="0.5" fill={color}/>
          <path d="M7.5 9.5l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9.5h6M12 12.5h5" {...stroke} />
          <rect x="7" y="14" width="3" height="3" rx="0.5" {...stroke}/>
          <path d="M12 15.5h6M12 18.5h4" {...stroke} />
        </svg>
      )
    case '客户政策明细':
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" {...stroke} />
          <path d="M3 20c0-3 3-5 6-5s6 2 6 5" {...stroke} />
          <rect x="14" y="11" width="7" height="9" rx="1" {...stroke} />
          <path d="M16 14h3M16 17h2" {...stroke} />
        </svg>
      )
    // 媒介数据看板
    case '底池数据管理':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="8" ry="3" {...stroke} />
          <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" {...stroke} />
          <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" {...stroke} />
        </svg>
      )
    case '媒介任务列表':
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
          <path d="M9 3v4M15 3v4M4 10h16" {...stroke} />
          <path d="M9 15l2 2 4-4" {...stroke} />
        </svg>
      )
    case '媒介账户列表':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" {...stroke} />
          <path d="M3 10h18" {...stroke} />
          <circle cx="7" cy="14" r="1" fill={color}/>
          <circle cx="12" cy="14" r="1" fill={color}/>
          <circle cx="17" cy="14" r="1" fill={color}/>
        </svg>
      )
    case '头条账户余额':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <text x="12" y="16" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">¥</text>
        </svg>
      )
    case '自运营操作看板':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="11" rx="1.5" {...stroke} />
          <path d="M8 21h8M12 16v5" {...stroke} />
          <path d="M7 11l2-2 2 2 2-3 2 2 2-4" {...stroke} />
        </svg>
      )
    case '客户健康报表':
      return (
        <svg {...props}>
          <path d="M3 12h4l2-5 3 10 2-7 2 4 2-2h3" {...stroke} />
          <circle cx="18" cy="6" r="2.5" {...stroke} />
          <path d="M16.5 6l1 1 2-2" {...stroke} />
        </svg>
      )
    // 工作 Tab
    case '客户':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" {...stroke} />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" {...stroke} />
        </svg>
      )
    case '全部':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" {...stroke} />
          <rect x="14" y="3" width="7" height="7" rx="1" {...stroke} />
          <rect x="3" y="14" width="7" height="7" rx="1" {...stroke} />
          <rect x="14" y="14" width="7" height="7" rx="1" {...stroke} />
        </svg>
      )
    // 通用
    case 'board':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" {...stroke} />
          <rect x="7" y="7" width="3" height="3" rx="0.5" fill={color}/>
          <rect x="14" y="7" width="3" height="3" rx="0.5" fill={color}/>
          <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color}/>
          <path d="M13 14h4M13 17h3" {...stroke} />
        </svg>
      )
    case 'briefcase':
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="13" rx="2" {...stroke} />
          <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" {...stroke} />
          <path d="M3 12h18" {...stroke} />
        </svg>
      )
    case 'card':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
          <path d="M3 9h18" {...stroke} />
          <path d="M6 15h4M6 17h7" {...stroke} />
        </svg>
      )
    case 'chart':
      return (
        <svg {...props}>
          <path d="M4 20V4M4 20h16" {...stroke} />
          <rect x="7" y="13" width="3" height="5" rx="0.5" fill={color} stroke={color}/>
          <rect x="12" y="9" width="3" height="9" rx="0.5" fill={color} stroke={color}/>
          <path d="M16 5l3 3-5 6" {...stroke} />
        </svg>
      )
    case 'check':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M8 12l3 3 5-6" {...stroke} />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" {...stroke} />
          <rect x="13" y="3" width="8" height="5" rx="1.5" {...stroke} />
          <rect x="13" y="10" width="8" height="11" rx="1.5" {...stroke} />
          <rect x="3" y="13" width="8" height="8" rx="1.5" {...stroke} />
        </svg>
      )
    case 'document':
      return (
        <svg {...props}>
          <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" {...stroke} />
          <path d="M14 3v6h6" {...stroke} />
          <path d="M8 13h8M8 17h5" {...stroke} />
        </svg>
      )
    case 'files':
      return (
        <svg {...props}>
          <path d="M13 3H6a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8" {...stroke} />
          <path d="M13 3v5h5" {...stroke} />
          <path d="M3 8v11a2 2 0 002 2h9" {...stroke} />
        </svg>
      )
    case 'money':
      return (
        <svg {...props}>
          <rect x="2" y="6" width="20" height="12" rx="2" {...stroke} />
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path d="M6 9v.01M18 15v.01" {...stroke} />
        </svg>
      )
    case 'monitor':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="13" rx="1.5" {...stroke} />
          <path d="M8 21h8M12 17v4" {...stroke} />
        </svg>
      )
    case 'notebook':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M5 7h14M5 11h14M5 15h14M5 19h14" {...stroke} />
          <rect x="3" y="6" width="2" height="12" rx="0.5" fill={color}/>
        </svg>
      )
    case 'risk':
      return (
        <svg {...props}>
          <path d="M12 3l10 18H2L12 3z" {...stroke} />
          <path d="M12 10v4" {...stroke} />
          <circle cx="12" cy="17" r="0.8" fill={color}/>
        </svg>
      )
    case 'setting':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" {...stroke} />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" {...stroke} />
        </svg>
      )
    case 'tickets':
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 100 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 100-4V7z" {...stroke} />
          <path d="M10 8v8" {...stroke} />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg {...props}>
          <path d="M9 6l6 6-6 6" {...stroke} />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...props}>
          <path d="M6 9l6 6 6-6" {...stroke} />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" {...stroke} />
          <path d="M16 16l4 4" {...stroke} />
        </svg>
      )
    case 'bell':
      return (
        <svg {...props}>
          <path d="M6 9a6 6 0 0112 0v4l2 3H4l2-3V9z" {...stroke} />
          <path d="M10 20a2 2 0 004 0" {...stroke} />
        </svg>
      )
    case 'user':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" {...stroke} />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" {...stroke} />
        </svg>
      )
    case 'menu':
      return (
        <svg {...props}>
          <path d="M4 6h16M4 12h16M4 18h16" {...stroke} />
        </svg>
      )
    case 'plus':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" {...stroke} />
        </svg>
      )
    case 'edit':
      return (
        <svg {...props}>
          <path d="M4 20h4l10-10-4-4L4 16v4z" {...stroke} />
          <path d="M14 6l4 4" {...stroke} />
        </svg>
      )
    case 'more':
      return (
        <svg {...props}>
          <circle cx="5" cy="12" r="1.5" fill={color}/>
          <circle cx="12" cy="12" r="1.5" fill={color}/>
          <circle cx="19" cy="12" r="1.5" fill={color}/>
        </svg>
      )
    case 'back':
      return (
        <svg {...props}>
          <path d="M15 6l-6 6 6 6" {...stroke} />
        </svg>
      )
    case 'close':
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6L6 18" {...stroke} />
        </svg>
      )
    case 'phone':
      return (
        <svg {...props}>
          <path d="M5 4l3 0 1.5 4-2 1c1 2.5 3 4.5 5.5 5.5l1-2 4 1.5v3c0 1-1 2-2 2C9 19 5 15 5 6c0-1 1-2 2-2z" {...stroke} />
        </svg>
      )
    case 'star':
      return (
        <svg {...props}>
          <path d="M12 3l2.5 5 5.5 1-4 4 1 5.5L12 16l-5 2.5 1-5.5-4-4 5.5-1L12 3z" {...stroke} />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" {...stroke} />
          <path d="M3 10h18M8 3v4M16 3v4" {...stroke} />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" {...stroke} />
        </svg>
      )
  }
}
