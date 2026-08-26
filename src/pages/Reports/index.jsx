import { useNavigate } from 'react-router-dom'
import FeatureIcon from '../../components/FeatureIcon'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'
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

const boardConfigs = [
  { label: '业务管理报表', source: '业务管理', color: 'blue', desc: '销售日报/周报/月报' },
  { label: '运营中心报表', source: '运营中心', color: 'orange', desc: '投放消耗报表' },
  { label: '媒介数据看板', source: '媒介数据看板', color: 'green', desc: '媒体报表' },
  { label: '财务数据看板', source: '财务数据看板', color: 'purple', desc: '利润汇总' },
  { label: 'KPI 报表', source: 'KPI管理', color: 'red', desc: '业绩考核' },
  { label: '客户健康', source: '客户健康报表', color: 'orange', desc: '客户状态' },
]

export default function Reports() {
  const nav = useNavigate()

  return (
    <div className="bg-ink-50 pb-4">
      <TopBar title="报表中心"/>

      {/* KPI */}
      <div className="px-3 pt-3">
        <div className="card grid grid-cols-2 gap-px bg-ink-100">
          <KpiItem label="本月总消耗" value="¥ 3,856,200" trend="+12.5%" up color="blue"/>
          <KpiItem label="本月回款" value="¥ 2,580,000" trend="+8.3%" up color="green"/>
          <KpiItem label="总客户数" value="48" trend="+5" up color="orange"/>
          <KpiItem label="平均 ROI" value="3.85" trend="-0.2" color="purple"/>
        </div>
      </div>

      {/* 报表入口宫格 - 全部链入 caidan.json 节点 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">报表分类</div>
        <div className="grid grid-cols-3 gap-y-4 px-2 pb-3">
          {boardConfigs.map(c => {
            const node = findByLabel(c.source)
            return (
              <button key={c.label} onClick={() => node && nav(`/m/${node.id}`)} className="flex flex-col items-center gap-1.5 tap">
                <FeatureIcon name={c.label === '客户健康' ? '客户' : c.label === 'KPI 报表' ? 'KPI管理' : c.label === '业务管理报表' ? '销售报表' : c.label === '运营中心报表' ? '运营报表' : c.label === '媒介数据看板' ? '媒介报表' : '财务看板'} color={c.color} size={44}/>
                <div className="text-center">
                  <div className="text-[11px] text-ink-900">{c.label}</div>
                  <div className="text-[9px] text-ink-400 mt-0.5">{c.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 销售日报 - 折线图 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title justify-between">
          <span>近 7 日销售业绩</span>
          <span className="text-[11px] text-ink-400 ml-auto">日 (万元)</span>
        </div>
        <div className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={[
              { date: '08-18', amount: 85, customers: 12 },
              { date: '08-19', amount: 92, customers: 15 },
              { date: '08-20', amount: 78, customers: 10 },
              { date: '08-21', amount: 105, customers: 18 },
              { date: '08-22', amount: 118, customers: 22 },
              { date: '08-23', amount: 96, customers: 16 },
              { date: '08-24', amount: 128, customers: 24 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999' }}/>
              <YAxis tick={{ fontSize: 10, fill: '#999' }} width={28}/>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}/>
              <Line type="monotone" dataKey="amount" stroke="#2D7FF9" strokeWidth={2} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="customers" stroke="#FF9A3C" strokeWidth={2} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 媒体渠道占比 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">媒体渠道消耗占比</div>
        <div className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[
                { name: '巨量引擎', value: 38 },
                { name: '千川', value: 28 },
                { name: '磁力金牛', value: 18 },
                { name: '腾讯广告', value: 10 },
                { name: '其他', value: 6 },
              ]} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={2}>
                {['#2D7FF9','#FF9A3C','#5BC85B','#9B7FF5','#BFBFBF'].map((c, i) => <Cell key={i} fill={c}/>)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 销售排行 */}
      <div className="mx-3 mt-3 card overflow-hidden">
        <div className="group-title">销售业绩排行 (Top 5)</div>
        <div className="px-2 pb-3">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={[
              { name: '冯孙杰', value: 580 },
              { name: '张三', value: 520 },
              { name: '李四', value: 480 },
              { name: '王五', value: 360 },
              { name: '赵六', value: 290 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#999' }}/>
              <YAxis tick={{ fontSize: 10, fill: '#999' }} width={32}/>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}/>
              <Bar dataKey="value" fill="#2D7FF9" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function KpiItem({ label, value, trend, up, color }) {
  const colors = { blue:'#2D7FF9', green:'#34A853', orange:'#FF9A3C', purple:'#9B7FF5' }
  return (
    <div className="bg-white p-3">
      <div className="text-[20px] font-bold leading-tight" style={{ color: colors[color] }}>{value}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-ink-500">{label}</span>
        <span className={`text-[10px] ${up ? 'text-success' : 'text-danger'}`}>{trend}</span>
      </div>
    </div>
  )
}

export function TopBar({ title, right }) {
  return (
    <div className="bg-brand text-white px-4 h-12 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-base font-medium">{title}</h1>
      {right}
    </div>
  )
}
