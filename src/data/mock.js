/**
 * Mock 数据 + 菜单树（基于 caidan.json）
 * 每个菜单节点配置：
 *  - id/pid/label/index/icon: 对应 caidan.json
 *  - template: list / report / detail / form / dashboard
 *  - fields: 表格字段定义（仅 list）
 *  - data: 表格/详情 mock 数据
 *  - children: 子菜单
 *
 * 路由：/m/<id>  渲染该节点
 *      /m/<id>/<dataId>  渲染该节点下某条数据的详情
 */

const COLOR = {
  blue: '#2D7FF9', green: '#34A853', orange: '#FF9A3C',
  red: '#FF5A5A', gray: '#999999', purple: '#9B7FF5',
}

// ============ 通用列定义工具 ============
const F = {
  text: (key, label, w = 100) => ({ key, label, type: 'text', width: w }),
  money: (key, label, w = 110) => ({ key, label, type: 'money', width: w }),
  date: (key, label, w = 100) => ({ key, label, type: 'date', width: w }),
  tag: (key, label, w = 90, colorMap) => ({ key, label, type: 'tag', width: w, colorMap }),
  num: (key, label, w = 70) => ({ key, label, type: 'num', width: w }),
  percent: (key, label, w = 80) => ({ key, label, type: 'percent', width: w }),
}

// ============ 数据集（按 caidan.json 业务划分）============
// === 业务管理 - 客户/主体/集团 ===
const groups = [
  { id: 'J0920', shortId: 'J0920', name: '艾麦交接集团', remark: '--', score: 5, shortName: '123', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-09 17:32:59', sales: '冯孙杰', creator: '王春雷', updated: '2026-07-28 14:50:07' },
  { id: 'J0919', shortId: 'J0919', name: '完美交接集团', remark: '完美交接集团', score: 5, shortName: '完美交接集团', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-09 16:50:51', sales: '冯孙杰', creator: '王春雷', updated: '2026-07-28 14:50:06' },
  { id: 'J0918', shortId: 'J0918', name: '跨江大桥', remark: '1', score: 4, shortName: '1', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-09 15:08:26', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:06' },
  { id: 'J0917', shortId: 'J0917', name: '中粮集团', remark: '1', score: 5, shortName: '中粮', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-09 14:59:58', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:06' },
  { id: 'J0916', shortId: 'J0916', name: '测试交接集团和项目', remark: '测试交接集团和项目', score: 5, shortName: '测试交接集团和项目', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-09 14:29:40', sales: '冯孙杰', creator: '王春雷', updated: '2026-07-28 14:50:05' },
  { id: 'J0914', shortId: 'J0914', name: '测试交接集团', remark: '测试交接集团测试交接集团测试交接集团', score: 5, shortName: '交接集团', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-05 09:49:49', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:05' },
  { id: 'J0913', shortId: 'J0913', name: '测试交接集团', remark: '测试交接集团测试交接集团测试交接集团测试交接集团', score: 5, shortName: '交接集团', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-05 09:49:06', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:05' },
  { id: 'J0912', shortId: 'J0912', name: '测试1', remark: '--', score: '--', shortName: '--', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-06-04 11:29:23', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:04' },
  { id: 'J0911', shortId: 'J0911', name: 'test联系人', remark: '--', score: '--', shortName: '--', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-05-27 17:25:02', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:04' },
  { id: 'J0910', shortId: 'J0910', name: 'test联系人', remark: '--', score: '--', shortName: '--', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-05-27 17:22:29', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:04' },
  { id: 'J0909', shortId: 'J0909', name: 'test联系人', remark: '--', score: '--', shortName: '--', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-05-27 17:22:22', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:03' },
  { id: 'J0908', shortId: 'J0908', name: 'test联系人', remark: '--', score: '--', shortName: '--', tag: '--', initialBalance: '0.00', attr: '非二代', groupType: '预付', reportEndTime: '--', created: '2026-05-27 17:22:16', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:03' },
  { id: 'J0907', shortId: 'J0907', name: '嘉禾电商集团', remark: '--', score: '--', shortName: '嘉禾电商', tag: '视频号', initialBalance: '0.00', attr: '二代', groupType: '预付', reportEndTime: '--', created: '2026-07-15 10:11:32', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:08' },
  { id: 'J0906', shortId: 'J0906', name: '云锐互动集团', remark: '--', score: '--', shortName: '云锐互动', tag: '快手', initialBalance: '0.00', attr: '二代', groupType: '预付', reportEndTime: '--', created: '2026-07-15 10:11:32', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:08' },
  { id: 'J0905', shortId: 'J0905', name: '薇光传媒集团', remark: '--', score: '--', shortName: '薇光传媒', tag: '抖音', initialBalance: '0.00', attr: '二代', groupType: '预付', reportEndTime: '--', created: '2026-07-15 10:11:14', sales: '王春雷', creator: '王春雷', updated: '2026-07-28 14:50:08' },
]

const customers = [
  { id: '2979970', customerCode: 'C023766', name: '内蒙古名帅堂心理咨询有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '--', accountType: '--', groupId: 'J0908', groupName: '山东陆路', sales: '张朔', creator: '张朔', created: '2026-08-24 11:24:55', updated: '2026-08-24 11:24:55' },
  { id: '2979969', customerCode: 'C023765', name: '广州烧颜贸易有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '电商', tag: '--', bankAccount: '--', phone: '--', creditCode: '--', accountType: '--', groupId: 'J0909', groupName: '深圳艾斯', sales: '李基彬', creator: '李基彬', created: '2026-08-24 11:18:22', updated: '2026-08-24 11:18:22' },
  { id: '2979968', customerCode: 'C023764', name: '文成牙贝恩口腔诊所有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91330328MAD61B255G', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:09:58', updated: '2026-08-24 11:09:58' },
  { id: '2979967', customerCode: 'C023763', name: '泰顺牙贝恩口腔门诊部有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91330329MA2L7EBY4W', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:08:36', updated: '2026-08-24 11:08:36' },
  { id: '2979966', customerCode: 'C023762', name: '珠海诺贝尔香山口腔门诊部有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440402MAE3G79U4U', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:06:35', updated: '2026-08-24 11:06:35' },
  { id: '2979965', customerCode: 'C023761', name: '珠海诺贝尔时代口腔门诊部有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440402MA7EBL1D22', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:06:21', updated: '2026-08-24 11:06:21' },
  { id: '2979964', customerCode: 'C023760', name: '珠海诺贝尔瑞恒口腔门诊部有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440402MA7M3B7949', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:06:09', updated: '2026-08-24 11:06:09' },
  { id: '2979963', customerCode: 'C023759', name: '珠海诺贝尔昌盛口腔诊所有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440402MAK8KFK082', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:05:56', updated: '2026-08-24 11:05:56' },
  { id: '2979962', customerCode: 'C023758', name: '珠海融和诺贝尔口腔门诊部有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440402MA54R7FF42', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:05:02', updated: '2026-08-24 11:05:02' },
  { id: '2979961', customerCode: 'C023757', name: '珠海金湾诺贝尔口腔医院有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440404MACGBHFPXT', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:03:31', updated: '2026-08-24 11:03:31' },
  { id: '2979960', customerCode: 'C023756', name: '福州美橙口腔医院有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91350111MA8UDD9J8T', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-24 11:02:23', updated: '2026-08-24 11:02:23' },
  { id: '2979959', customerCode: 'C023755', name: '郑州佑享品牌运营管理有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '美业', tag: '--', bankAccount: '--', phone: '--', creditCode: '91410100MAEDJ01W6K', accountType: '--', groupId: 'J0911', groupName: '雕享美舍', sales: '王靖雅', creator: '王靖雅', created: '2026-08-24 09:09:41', updated: '2026-08-24 09:09:41' },
  { id: '2979958', customerCode: 'C023754', name: '郑州晨光悦禾商务服务有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '美业', tag: '--', bankAccount: '--', phone: '--', creditCode: '92410104MADLHJ1001', accountType: '--', groupId: 'J0911', groupName: '雕享美舍', sales: '王靖雅', creator: '王靖雅', created: '2026-08-24 09:08:31', updated: '2026-08-24 09:08:31' },
  { id: '2979957', customerCode: 'C023753', name: '共读科技有限公司', remark: '重点客户', oaDate: '0000-00-00', status: '生效', industry: '互联网', tag: '服务号', bankAccount: '--', phone: '--', creditCode: '--', accountType: '对公账户', groupId: '1014536', groupName: '共读科技', sales: '陈志伟', creator: '潘建民', created: '2026-08-22 13:00:11', updated: '2026-08-24 09:52:02' },
  { id: '2979956', customerCode: 'C023752', name: '深圳美沃达牙科技有限公司', remark: '--', oaDate: '0000-00-00', status: '生效', industry: '医疗', tag: '--', bankAccount: '--', phone: '--', creditCode: '91440300618900019A', accountType: '--', groupId: 'J0910', groupName: 'JT-比利', sales: '刘欢', creator: '刘欢', created: '2026-08-21 17:53:59', updated: '2026-08-21 17:53:59' },
]

const projects = [
  { name: '共读科技-1k', code: 'J0994-XS2392', internalCode: 'XS2392', level: '0', status: '活跃', groupName: '共读科技', projectId: '--', salesName: '潘建民', created: '2026-08-22 13:01:30', updated: '2026-08-22 19:00:55' },
  { name: '云锐互动-巨量代投', code: 'J0993-JL2391', internalCode: 'JL2391', level: '0', status: '活跃', groupName: '云锐互动集团', projectId: '--', salesName: '王春雷', created: '2026-08-21 10:32:18', updated: '2026-08-22 18:14:33' },
  { name: '薇光文化-抖音投放', code: 'J0992-DY2390', internalCode: 'DY2390', level: '0', status: '活跃', groupName: '薇光传媒集团', projectId: '--', salesName: '王春雷', created: '2026-08-20 09:51:24', updated: '2026-08-21 16:42:08' },
  { name: '嘉禾电商-视频号代投', code: 'J0991-SPH2389', internalCode: 'SPH2389', level: '0', status: '暂停', groupName: '嘉禾电商集团', projectId: '--', salesName: '王春雷', created: '2026-08-19 15:58:46', updated: '2026-08-20 11:32:57' },
  { name: '中粮-快手食品投放', code: 'J0990-KS2388', internalCode: 'KS2388', level: '0', status: '活跃', groupName: '中粮集团', projectId: '--', salesName: '王春雷', created: '2026-08-18 11:42:09', updated: '2026-08-19 17:23:41' },
]

// 业务主体表数据（暴露供详情页使用）
export const customersData = customers

// 项目列表数据（暴露供详情页使用）
export const projectsData = projects

// === 广告主管理 ===
// PC §3.4.1 开户申请 `/AdvertiserID` —— 11 列
const advertiserApps = [
  { id: 'AD-202608-001', seqNo: 'SQ2026080001', pool: '央广-巨量服务商池', groupName: '艾麦交接集团', copyAdvId: 'TT-DY-202608-001', status: '开户中', sales: '冯孙杰', creator: '冯孙杰', created: '2026-08-23 14:20:11', updated: '2026-08-23 14:20:11' },
  { id: 'AD-202608-002', seqNo: 'SQ2026080002', pool: '央广-巨量服务商池', groupName: '山东陆路', copyAdvId: 'TT-DY-202608-002', status: '开户中', sales: '张朔', creator: '张朔', created: '2026-08-23 11:05:48', updated: '2026-08-23 16:30:21' },
  { id: 'AD-202608-003', seqNo: 'SQ2026080003', pool: '央广-磁力服务商池', groupName: '深圳艾斯', copyAdvId: 'ML-JN-202608-003', status: '完成', sales: '李基彬', creator: '李基彬', created: '2026-08-22 09:42:13', updated: '2026-08-22 17:15:30' },
  { id: 'AD-202608-004', seqNo: 'SQ2026080004', pool: '央广-腾讯服务商池', groupName: 'JT-比利', copyAdvId: 'TX-AD-202608-004', status: '完成', sales: '刘欢', creator: '刘欢', created: '2026-08-21 16:08:55', updated: '2026-08-21 16:08:55' },
  { id: 'AD-202608-005', seqNo: 'SQ2026080005', pool: '央广-聚光服务商池', groupName: '雕享美舍', copyAdvId: 'JG-202608-005', status: '开户中', sales: '王靖雅', creator: '王靖雅', created: '2026-08-21 10:24:32', updated: '2026-08-22 11:48:00' },
  { id: 'AD-202608-006', seqNo: 'SQ2026080006', pool: '央广-巨量服务商池', groupName: '共读科技', copyAdvId: 'TT-DY-202608-006', status: '开户中', sales: '潘建民', creator: '潘建民', created: '2026-08-20 13:32:09', updated: '2026-08-23 09:11:45' },
  { id: 'AD-202608-007', seqNo: 'SQ2026080007', pool: '央广-小红书服务商池', groupName: '海南迈尚', copyAdvId: 'XHS-202608-007', status: '撤销', sales: '陈志伟', creator: '陈志伟', created: '2026-08-19 15:50:27', updated: '2026-08-20 09:23:14' },
  { id: 'AD-202608-008', seqNo: 'SQ2026080008', pool: '央广-巨量服务商池', groupName: '南京紫金', copyAdvId: 'TT-DY-202608-008', status: '开户中', sales: '孙迢', creator: '孙迢', created: '2026-08-18 11:14:56', updated: '2026-08-22 14:08:33' },
  { id: 'AD-202608-009', seqNo: 'SQ2026080009', pool: '央广-快手服务商池', groupName: '广州速推', copyAdvId: 'KS-202608-009', status: '完成', sales: '高丽岩', creator: '高丽岩', created: '2026-08-17 09:38:42', updated: '2026-08-17 17:22:08' },
  { id: 'AD-202608-010', seqNo: 'SQ2026080010', pool: '央广-腾讯服务商池', groupName: '深圳美沃达', copyAdvId: 'TX-AD-202608-010', status: '开户中', sales: '刘欢', creator: '刘欢', created: '2026-08-16 14:45:19', updated: '2026-08-20 10:15:36' },
  { id: 'AD-202608-011', seqNo: 'SQ2026080011', pool: '央广-巨量服务商池', groupName: '郑州晨光', copyAdvId: 'TT-DY-202608-011', status: '撤销', sales: '王靖雅', creator: '王靖雅', created: '2026-08-15 16:27:53', updated: '2026-08-16 11:42:17' },
  { id: 'AD-202608-012', seqNo: 'SQ2026080012', pool: '央广-聚光服务商池', groupName: '艾麦交接集团', copyAdvId: 'JG-202608-012', status: '开户中', sales: '冯孙杰', creator: '冯孙杰', created: '2026-08-14 10:08:31', updated: '2026-08-18 09:34:12' },
]
// 暴露供详情页使用
export const advertiserAppsData = advertiserApps

// PC §3.4.2 开户明细 `/openAccount` —— 24 列（精简显示核心 14 项）
const advertiserDetails = [
  { id: 'SQ2026080001', detailName: '示例客户1-巨量主账号', groupName: '艾麦交接集团', policyName: '巨量 Q3 返点政策', rebateRate: '6.5%', platform: '巨量引擎', copyAdvId: 'TT-DY-202608-001', subject: '艾麦交接（深圳）有限公司', industryL1: '互联网', industryL2: '电商', keywords: '电商,日用,服装', operator: '冯孙杰', totalIds: 100, successCount: 100, pendingCount: 0, type: '企业', pool: '央广-巨量服务商池', status: '完成', remark: '--', sales: '冯孙杰', creator: '冯孙杰', created: '2026-08-23 14:20:11', updated: '2026-08-23 16:30:21' },
  { id: 'SQ2026080002', detailName: '山东陆路-巨量子账号', groupName: '山东陆路', policyName: '巨量 Q3 返点政策', rebateRate: '5.0%', platform: '巨量引擎', copyAdvId: 'TT-DY-202608-002', subject: '山东陆路（青岛）有限公司', industryL1: '交通', industryL2: '物流', keywords: '物流,货运', operator: '张朔', totalIds: 50, successCount: 48, pendingCount: 2, type: '企业', pool: '央广-巨量服务商池', status: '开户中', remark: '部分账户审核中', sales: '张朔', creator: '张朔', created: '2026-08-23 11:05:48', updated: '2026-08-23 16:30:21' },
  { id: 'SQ2026080003', detailName: '深圳艾斯-磁力金牛', groupName: '深圳艾斯', policyName: '磁力金牛 Q3 返点政策', rebateRate: '7.2%', platform: '磁力金牛', copyAdvId: 'ML-JN-202608-003', subject: '深圳艾斯科技有限公司', industryL1: '电商', industryL2: '美妆', keywords: '美妆,护肤,面膜', operator: '李基彬', totalIds: 200, successCount: 200, pendingCount: 0, type: '企业', pool: '央广-磁力服务商池', status: '完成', remark: '美妆类目', sales: '李基彬', creator: '李基彬', created: '2026-08-22 09:42:13', updated: '2026-08-22 17:15:30' },
  { id: 'SQ2026080004', detailName: 'JT-比利-腾讯广告', groupName: 'JT-比利', policyName: '腾讯 Q3 返点政策', rebateRate: '4.8%', platform: '腾讯广告', copyAdvId: 'TX-AD-202608-004', subject: '珠海诺贝尔口腔门诊部有限公司', industryL1: '医疗', industryL2: '口腔', keywords: '口腔,种植,正畸', operator: '刘欢', totalIds: 30, successCount: 30, pendingCount: 0, type: '企业', pool: '央广-腾讯服务商池', status: '完成', remark: '--', sales: '刘欢', creator: '刘欢', created: '2026-08-21 16:08:55', updated: '2026-08-21 16:08:55' },
  { id: 'SQ2026080005', detailName: '雕享美舍-聚光', groupName: '雕享美舍', policyName: '聚光 Q3 返点政策', rebateRate: '8.0%', platform: '聚光', copyAdvId: 'JG-202608-005', subject: '郑州晨光悦禾商务服务有限公司', industryL1: '美业', industryL2: '美容', keywords: '美容,医美,护肤', operator: '王靖雅', totalIds: 60, successCount: 55, pendingCount: 5, type: '企业', pool: '央广-聚光服务商池', status: '开户中', remark: '5 个账户等待聚光审核', sales: '王靖雅', creator: '王靖雅', created: '2026-08-21 10:24:32', updated: '2026-08-22 11:48:00' },
  { id: 'SQ2026080006', detailName: '共读科技-巨量主账号', groupName: '共读科技', policyName: '巨量 Q3 返点政策', rebateRate: '6.5%', platform: '巨量引擎', copyAdvId: 'TT-DY-202608-006', subject: '共读科技有限公司', industryL1: '互联网', industryL2: '阅读', keywords: '阅读,知识付费', operator: '潘建民', totalIds: 80, successCount: 80, pendingCount: 0, type: '企业', pool: '央广-巨量服务商池', status: '完成', remark: '重点客户', sales: '潘建民', creator: '潘建民', created: '2026-08-20 13:32:09', updated: '2026-08-23 09:11:45' },
  { id: 'SQ2026080007', detailName: '海南迈尚-小红书', groupName: '海南迈尚', policyName: '小红书 Q3 返点政策', rebateRate: '5.5%', platform: '小红书', copyAdvId: 'XHS-202608-007', subject: '海南迈尚旅游服务有限公司', industryL1: '旅游', industryL2: '出境游', keywords: '旅游,出境', operator: '陈志伟', totalIds: 20, successCount: 0, pendingCount: 20, type: '企业', pool: '央广-小红书服务商池', status: '撤销', remark: '客户主动撤销', sales: '陈志伟', creator: '陈志伟', created: '2026-08-19 15:50:27', updated: '2026-08-20 09:23:14' },
  { id: 'SQ2026080008', detailName: '南京紫金-巨量子账号', groupName: '南京紫金', policyName: '巨量 Q3 返点政策', rebateRate: '5.0%', platform: '巨量引擎', copyAdvId: 'TT-DY-202608-008', subject: '南京紫金传媒有限公司', industryL1: '文化', industryL2: '影视', keywords: '影视,综艺', operator: '孙迢', totalIds: 40, successCount: 35, pendingCount: 5, type: '企业', pool: '央广-巨量服务商池', status: '开户中', remark: '--', sales: '孙迢', creator: '孙迢', created: '2026-08-18 11:14:56', updated: '2026-08-22 14:08:33' },
  { id: 'SQ2026080009', detailName: '广州速推-快手', groupName: '广州速推', policyName: '快手 Q3 返点政策', rebateRate: '6.0%', platform: '快手', copyAdvId: 'KS-202608-009', subject: '广州速推文化传播有限公司', industryL1: '电商', industryL2: '服饰', keywords: '服装,直播', operator: '高丽岩', totalIds: 70, successCount: 70, pendingCount: 0, type: '企业', pool: '央广-快手服务商池', status: '完成', remark: '--', sales: '高丽岩', creator: '高丽岩', created: '2026-08-17 09:38:42', updated: '2026-08-17 17:22:08' },
  { id: 'SQ2026080010', detailName: '深圳美沃达-腾讯', groupName: '深圳美沃达', policyName: '腾讯 Q3 返点政策', rebateRate: '4.5%', platform: '腾讯广告', copyAdvId: 'TX-AD-202608-010', subject: '深圳美沃达牙科技有限公司', industryL1: '医疗', industryL2: '口腔', keywords: '口腔,牙科', operator: '刘欢', totalIds: 25, successCount: 22, pendingCount: 3, type: '企业', pool: '央广-腾讯服务商池', status: '开户中', remark: '3 个待补资料', sales: '刘欢', creator: '刘欢', created: '2026-08-16 14:45:19', updated: '2026-08-20 10:15:36' },
  { id: 'SQ2026080011', detailName: '郑州晨光-巨量', groupName: '郑州晨光', policyName: '巨量 Q3 返点政策', rebateRate: '5.0%', platform: '巨量引擎', copyAdvId: 'TT-DY-202608-011', subject: '郑州晨光悦禾商务服务有限公司', industryL1: '美业', industryL2: '美容', keywords: '美容,SPA', operator: '王靖雅', totalIds: 40, successCount: 0, pendingCount: 40, type: '企业', pool: '央广-巨量服务商池', status: '撤销', remark: '客户主动撤销', sales: '王靖雅', creator: '王靖雅', created: '2026-08-15 16:27:53', updated: '2026-08-16 11:42:17' },
  { id: 'SQ2026080012', detailName: '艾麦-聚光', groupName: '艾麦交接集团', policyName: '聚光 Q3 返点政策', rebateRate: '7.5%', platform: '聚光', copyAdvId: 'JG-202608-012', subject: '艾麦交接（深圳）有限公司', industryL1: '电商', industryL2: '日用', keywords: '日用,百货', operator: '冯孙杰', totalIds: 30, successCount: 28, pendingCount: 2, type: '企业', pool: '央广-聚光服务商池', status: '开户中', remark: '--', sales: '冯孙杰', creator: '冯孙杰', created: '2026-08-14 10:08:31', updated: '2026-08-18 09:34:12' },
]
// 暴露供详情页使用
export const advertiserDetailsData = advertiserDetails

// PC §3.4.3 账户列表 `/AccountList` —— 19 列（精简显示核心 14 项）
const advertiserAccounts = [
  { id: 'GD-202608-001', taskId: 'T001', advId: 'TT-DY-202608-001', advName: '示例客户1-巨量主账号', walletId: 'W-202608-001', accountStatus: '正常', policyName: '巨量 Q3 返点政策', sales: '冯孙杰', industryL1: '互联网', industryL2: '电商', platform: '巨量引擎', customerName: '示例客户1', groupName: '艾麦交接集团', rechargeRebate: '5.0%', policyRebate: '6.5%', source: '开户录入', creator: '冯孙杰', created: '2026-08-23 14:20:11', updated: '2026-08-23 16:30:21' },
  { id: 'GD-202608-002', taskId: 'T002', advId: 'TT-DY-202608-002', advName: '山东陆路-巨量子账号', walletId: '--', accountStatus: '正常', policyName: '巨量 Q3 返点政策', sales: '张朔', industryL1: '交通', industryL2: '物流', platform: '巨量引擎', customerName: '山东陆路', groupName: '山东陆路', rechargeRebate: '4.0%', policyRebate: '5.0%', source: '原OA系统同步', creator: '张朔', created: '2026-08-23 11:05:48', updated: '2026-08-23 16:30:21' },
  { id: 'GD-202608-003', taskId: 'T003', advId: 'ML-JN-202608-003', advName: '深圳艾斯-磁力金牛', walletId: 'W-202608-002', accountStatus: '正常', policyName: '磁力金牛 Q3 返点政策', sales: '李基彬', industryL1: '电商', industryL2: '美妆', platform: '磁力金牛', customerName: '深圳艾斯', groupName: '深圳艾斯', rechargeRebate: '5.5%', policyRebate: '7.2%', source: '充值录入', creator: '李基彬', created: '2026-08-22 09:42:13', updated: '2026-08-22 17:15:30' },
  { id: 'GD-202608-004', taskId: 'T004', advId: 'TX-AD-202608-004', advName: 'JT-比利-腾讯广告', walletId: 'W-202608-003', accountStatus: '正常', policyName: '腾讯 Q3 返点政策', sales: '刘欢', industryL1: '医疗', industryL2: '口腔', platform: '腾讯广告', customerName: '珠海诺贝尔口腔', groupName: 'JT-比利', rechargeRebate: '4.0%', policyRebate: '4.8%', source: '媒体同步', creator: '刘欢', created: '2026-08-21 16:08:55', updated: '2026-08-21 16:08:55' },
  { id: 'GD-202608-005', taskId: 'T005', advId: 'JG-202608-005', advName: '雕享美舍-聚光', walletId: 'W-202608-004', accountStatus: '异常', policyName: '聚光 Q3 返点政策', sales: '王靖雅', industryL1: '美业', industryL2: '美容', platform: '聚光', customerName: '郑州晨光', groupName: '雕享美舍', rechargeRebate: '6.0%', policyRebate: '8.0%', source: '开户录入', creator: '王靖雅', created: '2026-08-21 10:24:32', updated: '2026-08-22 11:48:00' },
  { id: 'GD-202608-006', taskId: 'T006', advId: 'TT-DY-202608-006', advName: '共读科技-巨量主账号', walletId: 'W-202608-005', accountStatus: '正常', policyName: '巨量 Q3 返点政策', sales: '潘建民', industryL1: '互联网', industryL2: '阅读', platform: '巨量引擎', customerName: '共读科技', groupName: '共读科技', rechargeRebate: '5.0%', policyRebate: '6.5%', source: '原OA系统同步', creator: '潘建民', created: '2026-08-20 13:32:09', updated: '2026-08-23 09:11:45' },
  { id: 'GD-202608-007', taskId: 'T007', advId: 'XHS-202608-007', advName: '海南迈尚-小红书', walletId: '--', accountStatus: '已撤销', policyName: '小红书 Q3 返点政策', sales: '陈志伟', industryL1: '旅游', industryL2: '出境游', platform: '小红书', customerName: '海南迈尚', groupName: '海南迈尚', rechargeRebate: '--', policyRebate: '5.5%', source: '充值录入', creator: '陈志伟', created: '2026-08-19 15:50:27', updated: '2026-08-20 09:23:14' },
  { id: 'GD-202608-008', taskId: 'T008', advId: 'TT-DY-202608-008', advName: '南京紫金-巨量子账号', walletId: 'W-202608-006', accountStatus: '正常', policyName: '巨量 Q3 返点政策', sales: '孙迢', industryL1: '文化', industryL2: '影视', platform: '巨量引擎', customerName: '南京紫金', groupName: '南京紫金', rechargeRebate: '4.0%', policyRebate: '5.0%', source: '媒体同步', creator: '孙迢', created: '2026-08-18 11:14:56', updated: '2026-08-22 14:08:33' },
  { id: 'GD-202608-009', taskId: 'T009', advId: 'KS-202608-009', advName: '广州速推-快手', walletId: 'W-202608-007', accountStatus: '正常', policyName: '快手 Q3 返点政策', sales: '高丽岩', industryL1: '电商', industryL2: '服饰', platform: '快手', customerName: '广州速推', groupName: '广州速推', rechargeRebate: '5.0%', policyRebate: '6.0%', source: '开户录入', creator: '高丽岩', created: '2026-08-17 09:38:42', updated: '2026-08-17 17:22:08' },
  { id: 'GD-202608-010', taskId: 'T010', advId: 'TX-AD-202608-010', advName: '深圳美沃达-腾讯', walletId: '--', accountStatus: '异常', policyName: '腾讯 Q3 返点政策', sales: '刘欢', industryL1: '医疗', industryL2: '口腔', platform: '腾讯广告', customerName: '深圳美沃达', groupName: '深圳美沃达', rechargeRebate: '3.5%', policyRebate: '4.5%', source: '原OA系统同步', creator: '刘欢', created: '2026-08-16 14:45:19', updated: '2026-08-20 10:15:36' },
  { id: 'GD-202608-011', taskId: 'T011', advId: 'TT-DY-202608-011', advName: '郑州晨光-巨量', walletId: '--', accountStatus: '已撤销', policyName: '巨量 Q3 返点政策', sales: '王靖雅', industryL1: '美业', industryL2: '美容', platform: '巨量引擎', customerName: '郑州晨光', groupName: '郑州晨光', rechargeRebate: '--', policyRebate: '5.0%', source: '充值录入', creator: '王靖雅', created: '2026-08-15 16:27:53', updated: '2026-08-16 11:42:17' },
  { id: 'GD-202608-012', taskId: 'T012', advId: 'JG-202608-012', advName: '艾麦-聚光', walletId: 'W-202608-008', accountStatus: '正常', policyName: '聚光 Q3 返点政策', sales: '冯孙杰', industryL1: '电商', industryL2: '日用', platform: '聚光', customerName: '艾麦', groupName: '艾麦交接集团', rechargeRebate: '5.5%', policyRebate: '7.5%', source: '媒体同步', creator: '冯孙杰', created: '2026-08-14 10:08:31', updated: '2026-08-18 09:34:12' },
]
// 暴露供详情页使用
export const advertiserAccountsData = advertiserAccounts

// 共享钱包变更记录（图3）
const walletChangeRecords = [
  { id: 1, advId: '1794645226771594', walletId: '7356464482472689946', opType: '绑定', operator: '王春雷', opTime: '2026-06-01 13:38:23' },
  { id: 2, advId: '1794645226771594', walletId: '7356464482472689946', opType: '解绑', operator: '王春雷', opTime: '2026-06-01 13:37:24' },
  { id: 3, advId: '4419658317834263', walletId: '7356464482472689946', opType: '绑定', operator: '王春雷', opTime: '2026-06-01 13:23:19' },
  { id: 4, advId: '1794645226771594', walletId: '7356464482472689946', opType: '解绑', operator: '王春雷', opTime: '2026-06-01 11:03:38' },
  { id: 5, advId: '1794645226771594', walletId: '7356464482472689946', opType: '绑定', operator: '王春雷', opTime: '2026-05-29 14:11:45' },
  { id: 6, advId: '1794645226771594', walletId: '12123', opType: '绑定', operator: '王春雷', opTime: '2026-05-29 11:41:59' },
  { id: 7, advId: '44332121', walletId: '1312', opType: '绑定', operator: '王春雷', opTime: '2026-05-28 17:54:09' },
  { id: 8, advId: '44332121', walletId: '1242', opType: '绑定', operator: '王春雷', opTime: '2026-05-28 17:54:09' },
  { id: 9, advId: '1234567890', walletId: '7356464482472689946', opType: '解绑', operator: '王春雷', opTime: '2026-05-27 10:22:18' },
  { id: 10, advId: '1234567890', walletId: '88001', opType: '绑定', operator: '王春雷', opTime: '2026-05-27 10:18:42' },
  { id: 11, advId: '9876543210', walletId: '88002', opType: '更换', operator: '王春雷', opTime: '2026-05-26 16:33:05' },
  { id: 12, advId: '9876543210', walletId: '88003', opType: '解绑', operator: '王春雷', opTime: '2026-05-26 16:30:27' },
  { id: 13, advId: '5544332211', walletId: '88004', opType: '绑定', operator: '王春雷', opTime: '2026-05-25 09:15:48' },
  { id: 14, advId: '1122334455', walletId: '88005', opType: '更换', operator: '王春雷', opTime: '2026-05-24 14:42:31' },
  { id: 15, advId: '6677889900', walletId: '88006', opType: '绑定', operator: '王春雷', opTime: '2026-05-23 11:08:55' },
]
export const walletChangeRecordsData = walletChangeRecords

// 政策变更记录（图4）
const policyChangeRecords = [
  { id: 1, customerName: '襄阳高新技术产业开发...', advId: '444', advName: '444', oldPolicy: '测试多政策审批-快手-AD', newPolicy: '柔肤美容-本地推-走量，头条-...', operator: '王春雷', opTime: '2026-05-29 11:0' },
  { id: 2, customerName: '襄阳高新技术产业开发...', advId: '17728777', advName: '17728777', oldPolicy: '测试多政策审批-快手-AD', newPolicy: '测试飞书回调，头条-AD', operator: '王春雷', opTime: '2026-05-29 10:3' },
  { id: 3, customerName: '襄阳高新技术产业开发...', advId: '555', advName: '555', oldPolicy: '测试多政策审批-快手-AD', newPolicy: '超好看小红书，小红书-聚光', operator: '焦帅乾', opTime: '2026-05-29 10:3' },
]
export const policyChangeRecordsData = policyChangeRecords

// 集团账户ID（按截图 14 字段：广告主ID/广告主名称/媒体账号状态/生效状态/一级行业/二级行业/媒体平台名称/政策编号/客户名称/客户集团名称/客户返点比例/创建人/创建时间/更新时间）
const groupAccountIds = [
  { id: 'GD-202608-001', name: '共读科技-TikTok主账号', accountStatus: '正常', status: '生效', industryL1: '互联网', industryL2: '电商', platform: 'TikToK', policyCode: 'GP001', customerName: '共读科技有限公司', groupName: '共读科技', rebateRate: '6.5%', creator: '潘建民', created: '2026-08-22 13:30:11', updated: '2026-08-24 09:52:02', groupId: '1014536' },
  { id: 'GD-202608-002', name: '共读科技-巨量子账号', accountStatus: '正常', status: '生效', industryL1: '互联网', industryL2: '电商', platform: '巨量引擎', policyCode: 'GP001', customerName: '共读科技有限公司', groupName: '共读科技', rebateRate: '5.0%', creator: '潘建民', created: '2026-08-22 14:15:32', updated: '2026-08-23 16:48:09', groupId: '1014536' },
]
// 暴露供详情页使用
export const groupAccountIdsData = groupAccountIds

// 集团充值记录（按截图 18 字段：订单号/充值集团名称/充值返点/转账单号/代理商ID/转出方ID/转入方ID/操作类型/资金类型/操作币金额/充值现金/充值类型/状态/错误原因/操作人/所属群名称/付款截图/操作时间）
const groupRecharges = [
  { id: 'CZ202608220001', groupName: '共读科技', rebate: '6.5%', transferNo: 'TF20260822001', agentId: 'A001', fromId: 'GD-202608-001', toId: 'GD-202608-002', opType: '账户间转账', fundType: '对公', amount: '5000.00', cash: '5000.00', rechargeType: '现金', status: '成功', errorReason: '--', operator: '潘建民', chatGroup: '共读科技-内部群', screenshot: '已上传', opTime: '2026-08-22 14:30:11', groupId: '1014536' },
  { id: 'CZ202608220002', groupName: '共读科技', rebate: '6.5%', transferNo: 'TF20260822002', agentId: 'A001', fromId: '--', toId: 'GD-202608-001', opType: '外部充值', fundType: '对公', amount: '50000.00', cash: '50000.00', rechargeType: '现金', status: '成功', errorReason: '--', operator: '潘建民', chatGroup: '共读科技-内部群', screenshot: '已上传', opTime: '2026-08-22 15:42:09', groupId: '1014536' },
  { id: 'CZ202608230001', groupName: '共读科技', rebate: '5.0%', transferNo: 'TF20260823001', agentId: 'A001', fromId: 'GD-202608-001', toId: '--', opType: '提现', fundType: '对公', amount: '8000.00', cash: '8000.00', rechargeType: '现金', status: '处理中', errorReason: '--', operator: '潘建民', chatGroup: '共读科技-内部群', screenshot: '--', opTime: '2026-08-23 10:15:33', groupId: '1014536' },
  { id: 'CZ202608240001', groupName: '共读科技', rebate: '6.5%', transferNo: '--', agentId: 'A001', fromId: '--', toId: 'GD-202608-001', opType: '外部充值', fundType: '授信', amount: '100000.00', cash: '0.00', rechargeType: '授信', status: '失败', errorReason: '银行账户验证未通过', operator: '潘建民', chatGroup: '共读科技-内部群', screenshot: '已上传', opTime: '2026-08-24 09:18:47', groupId: '1014536' },
]
// 暴露供详情页使用
export const groupRechargesData = groupRecharges

// 集团备款（按截图 12 字段：集团名称/银行名称/银行账户/账户名称/对私金额/对公金额/备款状态/备款单号/实际打款人/备注/创建时间/更新时间）
const groupReserves = [
  { id: 'BK202608220001', groupName: '共读科技', bankName: '中国工商银行北京分行', bankAccount: '6222 0202 0202 0202', accountName: '共读科技有限公司', privateAmount: '0.00', publicAmount: '50000.00', status: '已确认', actualPayer: '潘建民', remark: 'Q3 季度备款', created: '2026-08-22 13:30:11', updated: '2026-08-24 09:52:02', groupId: '1014536' },
  { id: 'BK202608230001', groupName: '共读科技', bankName: '招商银行海淀支行', bankAccount: '6225 8888 8888 8888', accountName: '潘建民', privateAmount: '20000.00', publicAmount: '0.00', status: '待确认', actualPayer: '潘建民', remark: '差旅垫付', created: '2026-08-23 10:15:33', updated: '2026-08-23 16:48:09', groupId: '1014536' },
]
// 暴露供详情页使用
export const groupReservesData = groupReserves

const advertiserTasks = [
  { id: 'T001', copyAdvId: 'TT-DY-202608-001', groupName: '艾麦交接集团', type: '多开户导入', status: '已完成', inputCount: 100, result: '成功 100 个', failReason: '--', created: '2026-08-23 14:20:11', updated: '2026-08-23 16:30:21' },
  { id: 'T002', copyAdvId: 'TT-DY-202608-002', groupName: '山东陆路', type: '手动录入', status: '处理中', inputCount: 50, result: '成功 48 / 失败 2', failReason: '2 个账户资质过期', created: '2026-08-23 11:05:48', updated: '2026-08-23 16:30:21' },
  { id: 'T003', copyAdvId: 'ML-JN-202608-003', groupName: '深圳艾斯', type: '多开户导入', status: '已完成', inputCount: 200, result: '成功 200 个', failReason: '--', created: '2026-08-22 09:42:13', updated: '2026-08-22 17:15:30' },
  { id: 'T004', copyAdvId: 'TX-AD-202608-004', groupName: 'JT-比利', type: '手动录入', status: '已完成', inputCount: 30, result: '成功 30 个', failReason: '--', created: '2026-08-21 16:08:55', updated: '2026-08-21 16:08:55' },
  { id: 'T005', copyAdvId: 'JG-202608-005', groupName: '雕享美舍', type: '批量导入', status: '处理中', inputCount: 60, result: '成功 55 / 处理中 5', failReason: '5 个待聚光审核', created: '2026-08-21 10:24:32', updated: '2026-08-22 11:48:00' },
  { id: 'T006', copyAdvId: 'TT-DY-202608-006', groupName: '共读科技', type: '多开户导入', status: '已完成', inputCount: 80, result: '成功 80 个', failReason: '--', created: '2026-08-20 13:32:09', updated: '2026-08-23 09:11:45' },
  { id: 'T007', copyAdvId: 'XHS-202608-007', groupName: '海南迈尚', type: '手动录入', status: '已失败', inputCount: 20, result: '失败 20 个', failReason: '客户主动撤销开户申请', created: '2026-08-19 15:50:27', updated: '2026-08-20 09:23:14' },
  { id: 'T008', copyAdvId: 'TT-DY-202608-008', groupName: '南京紫金', type: '批量导入', status: '处理中', inputCount: 40, result: '成功 35 / 处理中 5', failReason: '5 个待审核', created: '2026-08-18 11:14:56', updated: '2026-08-22 14:08:33' },
  { id: 'T009', copyAdvId: 'KS-202608-009', groupName: '广州速推', type: '多开户导入', status: '已完成', inputCount: 70, result: '成功 70 个', failReason: '--', created: '2026-08-17 09:38:42', updated: '2026-08-17 17:22:08' },
  { id: 'T010', copyAdvId: 'TX-AD-202608-010', groupName: '深圳美沃达', type: '手动录入', status: '处理中', inputCount: 25, result: '成功 22 / 待补 3', failReason: '3 个待补资料', created: '2026-08-16 14:45:19', updated: '2026-08-20 10:15:36' },
  { id: 'T011', copyAdvId: 'TT-DY-202608-011', groupName: '郑州晨光', type: '多开户导入', status: '已失败', inputCount: 40, result: '失败 40 个', failReason: '客户主动撤销开户申请', created: '2026-08-15 16:27:53', updated: '2026-08-16 11:42:17' },
  { id: 'T012', copyAdvId: 'JG-202608-012', groupName: '艾麦交接集团', type: '手动录入', status: '处理中', inputCount: 30, result: '成功 28 / 处理中 2', failReason: '2 个待补资料', created: '2026-08-14 10:08:31', updated: '2026-08-18 09:34:12' },
  { id: 'T013', copyAdvId: 'BD-COPY-202608-013', groupName: '艾麦交接集团', type: '复制账户', status: '已完成', inputCount: 25, result: '成功 25 个', failReason: '--', created: '2026-08-13 10:00:11', updated: '2026-08-13 17:30:21' },
  { id: 'T014', copyAdvId: 'BD-COPY-202608-014', groupName: '山东陆路', type: '复制账户', status: '处理中', inputCount: 15, result: '成功 13 / 处理中 2', failReason: '2 个待审核', created: '2026-08-12 14:25:48', updated: '2026-08-12 17:10:00' },
]
// 暴露供详情页使用
export const advertiserTasksData = advertiserTasks

// （开户状态 / 任务状态 / 媒体账号状态 的颜色已合并到全局 tagColor，见下方）

// === 政策管理 ===
// 政策列表（按 PC §3.5.1：22 字段）
const policies = [
  { id: 'PL001', name: '巨量引擎 Q3 返点政策', project: '云锐-巨量代投', created: '2026-07-01 10:00', updated: '2026-08-20 14:25', rebate: '8.0%', serviceFee: '3%', payType: '预付', coopMode: '走量', firstRecharge: '0.00', prepaidAmount: '50000.00', customerName: '云锐互动传媒有限公司', customerType: '代理', platform: '巨量引擎', bidType: '信息流', creditDays: 30, groupName: '云锐互动集团', agentName: '李四', salesOwner: '王春雷', creator: '王春雷', remark: '季度合作', approval: '审批通过' },
  { id: 'PL002', name: '千川 Q3 大客户政策', project: '示例客户1-千川', created: '2026-07-02 11:20', updated: '2026-08-22 16:30', rebate: '12.0%', serviceFee: '2%', payType: '预付', coopMode: '包断', firstRecharge: '100000.00', prepaidAmount: '200000.00', customerName: '示例客户1', customerType: '直接客户', platform: '千川', bidType: '信息流', creditDays: 0, groupName: '艾麦交接集团', agentName: '冯孙杰', salesOwner: '冯孙杰', creator: '冯孙杰', remark: '重点客户', approval: '审批通过' },
  { id: 'PL003', name: '磁力金牛 Q4 返点', project: '深圳艾斯-磁力金牛', created: '2026-07-05 09:35', updated: '2026-08-23 11:15', rebate: '10.0%', serviceFee: '3%', payType: '后付', coopMode: '走量', firstRecharge: '50000.00', prepaidAmount: '--', customerName: '深圳艾斯科技有限公司', customerType: '直接客户', platform: '磁力金牛', bidType: '信息流', creditDays: 45, groupName: '深圳艾斯', agentName: '李基彬', salesOwner: '李基彬', creator: '李基彬', remark: '--', approval: '审批中' },
  { id: 'PL004', name: '腾讯 Q3 标准返点', project: 'JT-比利-腾讯', created: '2026-07-08 14:50', updated: '2026-08-23 17:00', rebate: '4.8%', serviceFee: '2%', payType: '预付', coopMode: '走量', firstRecharge: '30000.00', prepaidAmount: '80000.00', customerName: '珠海诺贝尔口腔', customerType: '直接客户', platform: '腾讯广告', bidType: '信息流', creditDays: 30, groupName: 'JT-比利', agentName: '刘欢', salesOwner: '刘欢', creator: '刘欢', remark: '医疗类目', approval: '审批通过' },
  { id: 'PL005', name: '聚光 Q3 返点政策', project: '郑州晨光-聚光', created: '2026-07-12 10:25', updated: '2026-08-22 09:48', rebate: '8.0%', serviceFee: '4%', payType: '预付', coopMode: '走量', firstRecharge: '20000.00', prepaidAmount: '50000.00', customerName: '郑州晨光悦禾商务服务有限公司', customerType: '直接客户', platform: '聚光', bidType: '信息流', creditDays: 0, groupName: '郑州晨光', agentName: '王靖雅', salesOwner: '王靖雅', creator: '王靖雅', remark: '美业类目', approval: '审批通过' },
  { id: 'PL006', name: '快手 Q3 中小客户政策', project: '广州速推-快手', created: '2026-07-15 16:40', updated: '2026-08-21 15:30', rebate: '6.0%', serviceFee: '2%', payType: '后付', coopMode: '走量', firstRecharge: '0.00', prepaidAmount: '--', customerName: '广州速推文化传播有限公司', customerType: '代理', platform: '快手', bidType: '信息流', creditDays: 60, groupName: '广州速推', agentName: '高丽岩', salesOwner: '高丽岩', creator: '高丽岩', remark: '--', approval: '审批中' },
  { id: 'PL007', name: '小红书 Q3 返点政策', project: '海南迈尚-小红书', created: '2026-07-18 11:55', updated: '2026-08-20 10:12', rebate: '5.5%', serviceFee: '3%', payType: '预付', coopMode: '走量', firstRecharge: '10000.00', prepaidAmount: '30000.00', customerName: '海南迈尚旅游服务有限公司', customerType: '直接客户', platform: '小红书', bidType: '信息流', creditDays: 0, groupName: '海南迈尚', agentName: '陈志伟', salesOwner: '陈志伟', creator: '陈志伟', remark: '旅游类目', approval: '已驳回' },
  { id: 'PL008', name: '巨量引擎 Q3 子账号政策', project: '南京紫金-巨量', created: '2026-07-20 13:10', updated: '2026-08-19 17:20', rebate: '5.0%', serviceFee: '2%', payType: '预付', coopMode: '走量', firstRecharge: '30000.00', prepaidAmount: '60000.00', customerName: '南京紫金传媒有限公司', customerType: '直接客户', platform: '巨量引擎', bidType: '信息流', creditDays: 0, groupName: '南京紫金', agentName: '孙迢', salesOwner: '孙迢', creator: '孙迢', remark: '--', approval: '审批通过' },
  { id: 'PL009', name: '巨量引擎 Q4 预热政策', project: '山东陆路-巨量', created: '2026-08-15 10:00', updated: '2026-08-23 14:00', rebate: '7.0%', serviceFee: '3%', payType: '预付', coopMode: '包断', firstRecharge: '80000.00', prepaidAmount: '150000.00', customerName: '山东陆路（青岛）有限公司', customerType: '直接客户', platform: '巨量引擎', bidType: '信息流', creditDays: 0, groupName: '山东陆路', agentName: '张朔', salesOwner: '张朔', creator: '张朔', remark: 'Q4 预热', approval: '审批中' },
  { id: 'PL010', name: '共读科技-TikTok 政策', project: '共读-TikTok', created: '2026-07-25 09:30', updated: '2026-08-22 16:45', rebate: '6.5%', serviceFee: '3%', payType: '预付', coopMode: '走量', firstRecharge: '20000.00', prepaidAmount: '50000.00', customerName: '共读科技有限公司', customerType: '直接客户', platform: 'TikToK', bidType: '信息流', creditDays: 0, groupName: '共读科技', agentName: '潘建民', salesOwner: '潘建民', creator: '潘建民', remark: '--', approval: '审批通过' },
  { id: 'PL011', name: '美沃达-腾讯口腔专项', project: '深圳美沃达-腾讯', created: '2026-08-01 14:20', updated: '2026-08-20 09:15', rebate: '4.5%', serviceFee: '2%', payType: '预付', coopMode: '走量', firstRecharge: '15000.00', prepaidAmount: '40000.00', customerName: '深圳美沃达牙科技有限公司', customerType: '直接客户', platform: '腾讯广告', bidType: '信息流', creditDays: 0, groupName: '深圳美沃达', agentName: '刘欢', salesOwner: '刘欢', creator: '刘欢', remark: '口腔专项', approval: '审批通过' },
  { id: 'PL012', name: '艾麦-聚光 Q3 政策', project: '艾麦-聚光', created: '2026-07-30 15:40', updated: '2026-08-21 11:30', rebate: '7.5%', serviceFee: '3%', payType: '预付', coopMode: '走量', firstRecharge: '25000.00', prepaidAmount: '60000.00', customerName: '艾麦交接（深圳）有限公司', customerType: '直接客户', platform: '聚光', bidType: '信息流', creditDays: 0, groupName: '艾麦交接集团', agentName: '冯孙杰', salesOwner: '冯孙杰', creator: '冯孙杰', remark: '--', approval: '审批通过' },
]
export const policiesData = policies

// 政策审批流节点（详情页用）
// 每个节点：{ name, role, status: '通过' | '审批中' | '驳回' | '待审批', time, remark }
const policyApprovalNodes = {
  PL001: [
    { name: '王春雷', role: '申请人', status: '已提交', time: '2026-07-01 09:00:00', remark: '提交政策申请' },
    { name: '李基彬', role: '媒介主管', status: '通过', time: '2026-07-01 14:20:00', remark: '已审核' },
    { name: '张朔', role: '部门负责人', status: '通过', time: '2026-07-02 10:15:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-03 16:40:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-04 11:00:00', remark: '审批通过' },
  ],
  PL002: [
    { name: '冯孙杰', role: '申请人', status: '已提交', time: '2026-07-02 10:30:00', remark: '提交政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-07-02 15:00:00', remark: '已审核' },
    { name: '刘欢', role: '部门负责人', status: '通过', time: '2026-07-03 09:20:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-03 17:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-04 14:30:00', remark: '审批通过' },
  ],
  PL003: [
    { name: '李基彬', role: '申请人', status: '已提交', time: '2026-07-05 09:00:00', remark: '提交政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-07-05 14:30:00', remark: '已审核' },
    { name: '刘欢', role: '部门负责人', status: '审批中', time: '', remark: '待审批' },
  ],
  PL004: [
    { name: '刘欢', role: '申请人', status: '已提交', time: '2026-07-08 14:00:00', remark: '提交政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-07-08 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-07-09 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-09 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-10 11:00:00', remark: '审批通过' },
  ],
  PL005: [
    { name: '王靖雅', role: '申请人', status: '已提交', time: '2026-07-12 10:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-07-12 16:30:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-07-13 11:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-13 17:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-14 09:30:00', remark: '审批通过' },
  ],
  PL006: [
    { name: '高丽岩', role: '申请人', status: '已提交', time: '2026-07-15 16:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-07-16 10:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '审批中', time: '', remark: '待审批' },
  ],
  PL007: [
    { name: '陈志伟', role: '申请人', status: '已提交', time: '2026-07-18 11:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-07-18 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '驳回', time: '2026-07-19 11:00:00', remark: '返点过高，需重新谈判' },
  ],
  PL008: [
    { name: '孙迢', role: '申请人', status: '已提交', time: '2026-07-20 13:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-07-20 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-07-21 10:30:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-21 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-22 09:30:00', remark: '审批通过' },
  ],
  PL009: [
    { name: '张朔', role: '申请人', status: '已提交', time: '2026-08-15 10:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '审批中', time: '', remark: '待审批' },
  ],
  PL010: [
    { name: '潘建民', role: '申请人', status: '已提交', time: '2026-07-25 09:00:00', remark: '提交政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-07-25 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-07-26 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-26 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-07-27 09:30:00', remark: '审批通过' },
  ],
  PL011: [
    { name: '刘欢', role: '申请人', status: '已提交', time: '2026-08-01 14:00:00', remark: '提交政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-08-01 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-02 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-02 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-03 11:00:00', remark: '审批通过' },
  ],
  PL012: [
    { name: '冯孙杰', role: '申请人', status: '已提交', time: '2026-07-30 15:00:00', remark: '提交政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-07-30 18:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-07-31 10:30:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-07-31 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-01 09:30:00', remark: '审批通过' },
  ],
}
export const policyApprovalNodesData = policyApprovalNodes

// 政策原政策信息（变更记录后展示的原政策快照）
const policyOriginals = {
  PL001: { id: 'PL001-OLD', name: '巨量引擎 Q3 返点政策 - 旧版', project: '云锐-巨量代投', created: '2026-04-01 10:00:00', updated: '2026-07-01 09:00:00', rebate: '7.0%', serviceFee: '3%', payType: '预付', coopMode: '走量', firstRecharge: '0.00', prepaidAmount: '30000.00', customerName: '云锐互动传媒有限公司', customerType: '代理', platform: '巨量引擎', bidType: '信息流', creditDays: 30, groupName: '云锐互动集团', agentName: '李四', salesOwner: '王春雷', creator: '王春雷', remark: '旧版返点' },
}
export const policyOriginalsData = policyOriginals

// 集团政策（按截图 18 字段：政策名称/付款方式/返点比例/首充预估金额/预付资金金额/合作模式/项目编号/客户行业/垫款账期/客户类型/竞价类型/备注/客户名称/服务费比例/集团名称/创建人/媒体平台/媒介开户人）
const groupPolicies = [
  { id: 'GP001', name: '共读科技-1k', payType: '预付', rebateRate: '6.5%', firstRecharge: '0.0000', prepaidAmount: '--', coopMode: '走量', projectCode: '--', industry: '--', creditDays: '0', customerType: '直接客户', bidType: '无', remark: '--', customerName: '共读科技有限公司', serviceRate: '0%', groupName: '共读科技', creator: '潘建民', platform: 'TikToK', agentName: '--' },
  { id: 'GP002', name: '云锐互动-巨量代投', payType: '后付', rebateRate: '8.0%', firstRecharge: '50000.00', prepaidAmount: '--', coopMode: '包断', projectCode: 'XS2391', industry: '广告', creditDays: '30', customerType: '代理', bidType: '信息流', remark: '季度合作', customerName: '云锐互动传媒有限公司', serviceRate: '3%', groupName: '云锐互动集团', creator: '王春雷', platform: '巨量引擎', agentName: '李四' },
]
// 暴露供详情页使用
export const groupPoliciesData = groupPolicies

const livePolicies = [
  {
    // LP001：完整 35 字段示例，用于详情页展示
    id: 'LP001', code: 'ZB-202608-001',
    // 客户信息
    groupName: '艾麦交接集团', customerName: '艾麦交接（深圳）有限公司', industry: '电商-美妆',
    customerPolicy: '艾麦-巨量 Q3 政策',
    baseFee: '50000', gmvShare: '10',
    remark: '美妆带货专场',
    // 投放要求
    platform: '小红书-品牌',
    dayBudget: '5000', monthBudget: '150000',
    stepBudget: '5万以下返 8%\n5-10万返 10%\n10万以上返 12%',
    audience: '25-35 岁女性，一二线城市，美妆护肤兴趣',
    placement: '小红书发现页信息流 + 搜索页',
    // 直播要求
    duration: '单场 4 小时，每周 3 场',
    accountName: '小红书号@aimai_jp',
    fans: '120万',
    history: '日播 2 年，月均 GMV 80w',
    currentStatus: '当前固定 2 位主播轮播',
    hostReq: '有美妆带货经验 3 年以上',
    goods: '护肤全套 12 个 SKU，客单价 300-800',
    style: '亲测型 + 知识科普',
    marketingFocus: '转化 + 复购',
    marketingChain: '短视频种草 → 直播拔草 → 私域沉淀',
    brandRedLine: '不可夸大功效，不可承诺疗效',
    // 考核标准
    targetGoal: '月 GMV 150w',
    salesPlan: 'Q3 完成 450w 销售额，每月 150w 递增',
    customerKpi: 'GMV 完成率 ≥ 95%',
    settlement: '次月 10 号前对账，20 号前回款',
    reviewNode: '每周一上午 10:00 数据复盘',
    // 申请信息
    applicant: '冯孙杰', applyDate: '2026-08-15',
    sales: '冯孙杰', department: '业务一部',
    financeQuote: '150000.00', approval: '审批通过',
    created: '2026-08-15 10:00:00',
  },
  { id: 'LP002', code: 'ZB-202608-002', groupName: '山东陆路', customerName: '山东陆路（青岛）有限公司', industry: '电商-服饰', customerPolicy: '山东陆路-快手 Q3', remark: '服装直播带货', sales: '张朔', department: '业务二部', platform: '快手直播', applicant: '张朔', applyDate: '2026-08-12', financeQuote: '120000.00', approval: '审批通过', created: '2026-08-12 14:25:00' },
  { id: 'LP003', code: 'ZB-202608-003', groupName: '深圳艾斯', customerName: '深圳艾斯科技有限公司', industry: '电商-美妆', customerPolicy: '艾斯-磁力金牛 Q3', remark: '护肤专场', sales: '李基彬', department: '业务一部', platform: '抖音直播', applicant: '李基彬', applyDate: '2026-08-18', financeQuote: '180000.00', approval: '审批中', created: '2026-08-18 09:42:00' },
  { id: 'LP004', code: 'ZB-202608-004', groupName: 'JT-比利', customerName: '珠海诺贝尔口腔门诊部有限公司', industry: '医疗-口腔', customerPolicy: 'JT-比利-腾讯 Q3', remark: '口腔直播问诊', sales: '刘欢', department: 'KA销售部', platform: '视频号', applicant: '刘欢', applyDate: '2026-08-10', financeQuote: '80000.00', approval: '审批通过', created: '2026-08-10 16:08:00' },
  { id: 'LP005', code: 'ZB-202608-005', groupName: '郑州晨光', customerName: '郑州晨光悦禾商务服务有限公司', industry: '美业-美容', customerPolicy: '晨光-聚光 Q3', remark: '美容 SPA', sales: '王靖雅', department: '业务三部', platform: '抖音直播', applicant: '王靖雅', applyDate: '2026-08-20', financeQuote: '95000.00', approval: '审批通过', created: '2026-08-20 11:24:00' },
  { id: 'LP006', code: 'ZB-202608-006', groupName: '共读科技', customerName: '共读科技有限公司', industry: '互联网-阅读', customerPolicy: '共读-TikTok Q3', remark: '知识付费直播', sales: '潘建民', department: '业务一部', platform: '视频号', applicant: '潘建民', applyDate: '2026-08-22', financeQuote: '60000.00', approval: '审批中', created: '2026-08-22 13:30:00' },
  { id: 'LP007', code: 'ZB-202608-007', groupName: '海南迈尚', customerName: '海南迈尚旅游服务有限公司', industry: '旅游-出境游', customerPolicy: '迈尚-小红书 Q3', remark: '出境游种草', sales: '陈志伟', department: '小红书营销中心', platform: '小红书直播', applicant: '陈志伟', applyDate: '2026-08-08', financeQuote: '50000.00', approval: '已撤销', created: '2026-08-08 15:50:00' },
  { id: 'LP008', code: 'ZB-202608-008', groupName: '南京紫金', customerName: '南京紫金传媒有限公司', industry: '文化-影视', customerPolicy: '紫金-巨量 Q3', remark: '影视综艺直播', sales: '孙迢', department: '业务二部', platform: '抖音直播', applicant: '孙迢', applyDate: '2026-08-05', financeQuote: '110000.00', approval: '审批通过', created: '2026-08-05 11:14:00' },
  { id: 'LP009', code: 'ZB-202608-009', groupName: '广州速推', customerName: '广州速推文化传播有限公司', industry: '电商-服饰', customerPolicy: '速推-快手 Q3', remark: '服装带货', sales: '高丽岩', department: '业务三部', platform: '快手直播', applicant: '高丽岩', applyDate: '2026-08-14', financeQuote: '70000.00', approval: '已驳回', created: '2026-08-14 09:38:00' },
  { id: 'LP010', code: 'ZB-202608-010', groupName: '深圳美沃达', customerName: '深圳美沃达牙科技有限公司', industry: '医疗-口腔', customerPolicy: '美沃达-腾讯 Q3', remark: '口腔科普', sales: '刘欢', department: 'KA销售部', platform: '视频号', applicant: '刘欢', applyDate: '2026-08-19', financeQuote: '45000.00', approval: '审批通过', created: '2026-08-19 14:45:00' },
]
export const livePoliciesData = livePolicies

// 直播政策审批流（节点 timeline，按 code 作为 key）
const livePolicyApprovalNodes = {
  'ZB-202608-001': [
    { name: '冯孙杰', role: '申请人', status: '已提交', time: '2026-08-15 10:00:00', remark: '提交直播政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-08-15 14:20:00', remark: '已审核' },
    { name: '李基彬', role: '部门负责人', status: '通过', time: '2026-08-16 09:15:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-17 11:40:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-18 16:00:00', remark: '审批通过' },
  ],
  'ZB-202608-002': [
    { name: '张朔', role: '申请人', status: '已提交', time: '2026-08-12 14:25:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-12 17:40:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-13 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-13 16:20:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-14 11:30:00', remark: '审批通过' },
  ],
  'ZB-202608-003': [
    { name: '李基彬', role: '申请人', status: '已提交', time: '2026-08-18 09:42:00', remark: '提交直播政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-08-18 14:30:00', remark: '已审核' },
    { name: '李基彬', role: '部门负责人', status: '审批中', time: '', remark: '' },
  ],
  'ZB-202608-004': [
    { name: '刘欢', role: '申请人', status: '已提交', time: '2026-08-10 16:08:00', remark: '提交直播政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-08-10 18:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-11 10:30:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-11 15:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-12 09:20:00', remark: '审批通过' },
  ],
  'ZB-202608-005': [
    { name: '王靖雅', role: '申请人', status: '已提交', time: '2026-08-20 11:24:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-20 16:30:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-21 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-21 17:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-22 11:00:00', remark: '审批通过' },
  ],
  'ZB-202608-006': [
    { name: '潘建民', role: '申请人', status: '已提交', time: '2026-08-22 13:30:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-22 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '审批中', time: '', remark: '' },
  ],
  'ZB-202608-007': [
    { name: '陈志伟', role: '申请人', status: '已提交', time: '2026-08-08 15:50:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-09 10:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '审批中', time: '', remark: '' },
    { name: '陈志伟', role: '申请人', status: '已撤销', time: '2026-08-09 14:30:00', remark: '客户主动撤销' },
  ],
  'ZB-202608-008': [
    { name: '孙迢', role: '申请人', status: '已提交', time: '2026-08-05 11:14:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-05 16:30:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-06 10:00:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-06 17:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-07 11:00:00', remark: '审批通过' },
  ],
  'ZB-202608-009': [
    { name: '高丽岩', role: '申请人', status: '已提交', time: '2026-08-14 09:38:00', remark: '提交直播政策申请' },
    { name: '刘欢', role: '媒介主管', status: '通过', time: '2026-08-14 17:30:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '驳回', time: '2026-08-15 11:00:00', remark: '返点过高，需重新谈判' },
  ],
  'ZB-202608-010': [
    { name: '刘欢', role: '申请人', status: '已提交', time: '2026-08-19 14:45:00', remark: '提交直播政策申请' },
    { name: '王靖雅', role: '媒介主管', status: '通过', time: '2026-08-19 17:00:00', remark: '已审核' },
    { name: '王春雷', role: '部门负责人', status: '通过', time: '2026-08-20 10:30:00', remark: '同意' },
    { name: '财务部', role: '财务审核', status: '通过', time: '2026-08-20 16:00:00', remark: '报价确认' },
    { name: '王春雷', role: '总经理', status: '通过', time: '2026-08-21 11:00:00', remark: '审批通过' },
  ],
}
export const livePolicyApprovalNodesData = livePolicyApprovalNodes

const materialPurchases = [
  {
    // SC-202608-001：完整字段示例（对应图4 详情页）
    id: 'SC-202608-001', code: 'MP202607150002',
    groupName: '美画轻奢', customerName: '杭州爱森文化', industry: '医疗',
    platform: '腾讯-广点通', requirement: '医疗设备销售',
    videoTypes: ['口播', '剧情', '混剪'],
    videoTypeConfig: {
      口播: { type: '单人口播', actorReq: '形象气质', count: 1 },
      剧情: { actorCount: '三人', actorReq: '——', count: 4 },
      混剪: { desc: '仅素材数量', count: 2 },
    },
    budget: '20000.00', videoLinks: 'http://test-crm.ygsdmedia.cn/MaterialPurchase',
    applicant: '焦帅乾', sales: '王春雷', applyDate: '2026-07-15',
    financeQuote: '1.00', approval: '审批通过', created: '2026-07-15 16:57:28',
  },
  { id: 'SC-202608-002', code: 'MP202608-002', groupName: '艾麦交接集团', customerName: '艾麦交接（深圳）有限公司', industry: '电商-美妆', platform: '巨量引擎', requirement: '美妆带货视频 15 秒 × 30 条', videoTypes: ['口播'], videoTypeConfig: { 口播: { type: '单人口播', actorReq: '美妆主播 3 年以上', count: 30 } }, budget: '150000.00', videoLinks: '', applicant: '冯孙杰', sales: '冯孙杰', applyDate: '2026-08-15', financeQuote: '142500.00', approval: '审批通过', created: '2026-08-15 10:00:00' },
  { id: 'SC-202608-003', code: 'MP202608-003', groupName: '山东陆路', customerName: '山东陆路（青岛）有限公司', industry: '电商-服饰', platform: '快手', requirement: '服装走量视频 30 秒 × 20 条', videoTypes: ['剧情'], videoTypeConfig: { 剧情: { actorCount: '双人', actorReq: '情侣档剧情', count: 20 } }, budget: '120000.00', videoLinks: '', applicant: '张朔', sales: '张朔', applyDate: '2026-08-12', financeQuote: '115000.00', approval: '审批通过', created: '2026-08-12 14:25:00' },
  { id: 'SC-202608-004', code: 'MP202608-004', groupName: '深圳艾斯', customerName: '深圳艾斯科技有限公司', industry: '电商-美妆', platform: '磁力金牛', requirement: '护肤品种草 15-60 秒', videoTypes: ['混剪'], videoTypeConfig: { 混剪: { desc: '素材拼接', count: 50 } }, budget: '180000.00', videoLinks: '', applicant: '李基彬', sales: '李基彬', applyDate: '2026-08-18', financeQuote: '172000.00', approval: '审批中', created: '2026-08-18 09:42:00' },
  { id: 'SC-202608-005', code: 'MP202608-005', groupName: 'JT-比利', customerName: '珠海诺贝尔口腔门诊部有限公司', industry: '医疗-口腔', platform: '腾讯广告', requirement: '口腔科普 60 秒 × 10 条', videoTypes: ['口播'], videoTypeConfig: { 口播: { type: '单人口播', actorReq: '专业医师形象', count: 10 } }, budget: '80000.00', videoLinks: '', applicant: '刘欢', sales: '刘欢', applyDate: '2026-08-10', financeQuote: '76000.00', approval: '审批通过', created: '2026-08-10 16:08:00' },
  { id: 'SC-202608-006', code: 'MP202608-006', groupName: '郑州晨光', customerName: '郑州晨光悦禾商务服务有限公司', industry: '美业-美容', platform: '聚光', requirement: '美容 SPA 场景 30 秒 × 15 条', videoTypes: ['剧情'], videoTypeConfig: { 剧情: { actorCount: '三人', actorReq: '美容师 + 客户', count: 15 } }, budget: '95000.00', videoLinks: '', applicant: '王靖雅', sales: '王靖雅', applyDate: '2026-08-20', financeQuote: '90000.00', approval: '审批通过', created: '2026-08-20 11:24:00' },
  { id: 'SC-202608-007', code: 'MP202608-007', groupName: '共读科技', customerName: '共读科技有限公司', industry: '互联网-阅读', platform: 'TikToK', requirement: '知识付费口播 60 秒 × 20 条', videoTypes: ['口播'], videoTypeConfig: { 口播: { type: '单人口播', actorReq: '学者气质', count: 20 } }, budget: '60000.00', videoLinks: '', applicant: '潘建民', sales: '潘建民', applyDate: '2026-08-22', financeQuote: '57000.00', approval: '审批中', created: '2026-08-22 13:30:00' },
  { id: 'SC-202608-008', code: 'MP202608-008', groupName: '海南迈尚', customerName: '海南迈尚旅游服务有限公司', industry: '旅游-出境游', platform: '小红书', requirement: '出境游种草图文 + 短视频', videoTypes: ['混剪'], videoTypeConfig: { 混剪: { desc: '图文物料', count: 30 } }, budget: '50000.00', videoLinks: '', applicant: '陈志伟', sales: '陈志伟', applyDate: '2026-08-08', financeQuote: '47500.00', approval: '已撤销', created: '2026-08-08 15:50:00' },
  { id: 'SC-202608-009', code: 'MP202608-009', groupName: '南京紫金', customerName: '南京紫金传媒有限公司', industry: '文化-影视', platform: '巨量引擎', requirement: '影视宣发切片 60 秒 × 25 条', videoTypes: ['混剪'], videoTypeConfig: { 混剪: { desc: '影视切片', count: 25 } }, budget: '110000.00', videoLinks: '', applicant: '孙迢', sales: '孙迢', applyDate: '2026-08-05', financeQuote: '105000.00', approval: '审批通过', created: '2026-08-05 11:14:00' },
  { id: 'SC-202608-010', code: 'MP202608-010', groupName: '广州速推', customerName: '广州速推文化传播有限公司', industry: '电商-服饰', platform: '快手', requirement: '服装展示 15 秒 × 30 条', videoTypes: ['口播'], videoTypeConfig: { 口播: { type: '单人口播', actorReq: '时尚博主', count: 30 } }, budget: '70000.00', videoLinks: '', applicant: '高丽岩', sales: '高丽岩', applyDate: '2026-08-14', financeQuote: '66500.00', approval: '已驳回', created: '2026-08-14 09:38:00' },
]
export const materialPurchasesData = materialPurchases

// 素材采买审批流（节点 timeline，按 code 作为 key）
const materialPurchaseApprovalNodes = {
  'SC-202608-001': [
    { name: '焦帅乾', role: '申请人', status: '已提交', time: '2026-07-15 16:57:28', remark: '提交素材采买申请', platform: '飞书' },
    { name: '房思楠', role: '媒介主管', status: '已通过', time: '2026-07-15 16:57:56', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-07-15 16:57:28', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-002': [
    { name: '冯孙杰', role: '申请人', status: '已提交', time: '2026-08-15 10:00:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '王靖雅', role: '媒介主管', status: '已通过', time: '2026-08-15 14:20:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '已通过', time: '2026-08-16 09:15:00', remark: '同意', platform: 'CRM' },
    { name: '财务部', role: '财务审核', status: '已通过', time: '2026-08-17 11:40:00', remark: '报价确认', platform: 'CRM' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-08-18 16:00:00', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-003': [
    { name: '张朔', role: '申请人', status: '已提交', time: '2026-08-12 14:25:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-12 17:40:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '已通过', time: '2026-08-13 10:00:00', remark: '同意', platform: 'CRM' },
    { name: '财务部', role: '财务审核', status: '已通过', time: '2026-08-13 16:20:00', remark: '报价确认', platform: 'CRM' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-08-14 11:30:00', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-004': [
    { name: '李基彬', role: '申请人', status: '已提交', time: '2026-08-18 09:42:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '王靖雅', role: '媒介主管', status: '已通过', time: '2026-08-18 14:30:00', remark: '已审核', platform: '飞书' },
    { name: '李基彬', role: '部门负责人', status: '审批中', time: '', remark: '', platform: 'CRM' },
  ],
  'SC-202608-005': [
    { name: '刘欢', role: '申请人', status: '已提交', time: '2026-08-10 16:08:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '王靖雅', role: '媒介主管', status: '已通过', time: '2026-08-10 18:00:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '已通过', time: '2026-08-11 10:30:00', remark: '同意', platform: 'CRM' },
    { name: '财务部', role: '财务审核', status: '已通过', time: '2026-08-11 15:00:00', remark: '报价确认', platform: 'CRM' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-08-12 09:20:00', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-006': [
    { name: '王靖雅', role: '申请人', status: '已提交', time: '2026-08-20 11:24:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-20 16:30:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '已通过', time: '2026-08-21 10:00:00', remark: '同意', platform: 'CRM' },
    { name: '财务部', role: '财务审核', status: '已通过', time: '2026-08-21 17:00:00', remark: '报价确认', platform: 'CRM' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-08-22 11:00:00', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-007': [
    { name: '潘建民', role: '申请人', status: '已提交', time: '2026-08-22 13:30:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-22 17:00:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '审批中', time: '', remark: '', platform: 'CRM' },
  ],
  'SC-202608-008': [
    { name: '陈志伟', role: '申请人', status: '已提交', time: '2026-08-08 15:50:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-09 10:00:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '审批中', time: '', remark: '', platform: 'CRM' },
    { name: '陈志伟', role: '申请人', status: '已撤销', time: '2026-08-09 14:30:00', remark: '客户主动撤销', platform: 'CRM' },
  ],
  'SC-202608-009': [
    { name: '孙迢', role: '申请人', status: '已提交', time: '2026-08-05 11:14:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-05 16:30:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '已通过', time: '2026-08-06 10:00:00', remark: '同意', platform: 'CRM' },
    { name: '财务部', role: '财务审核', status: '已通过', time: '2026-08-06 17:00:00', remark: '报价确认', platform: 'CRM' },
    { name: '王春雷', role: '总经理', status: '已通过', time: '2026-08-07 11:00:00', remark: '审批通过', platform: 'CRM' },
  ],
  'SC-202608-010': [
    { name: '高丽岩', role: '申请人', status: '已提交', time: '2026-08-14 09:38:00', remark: '提交素材采买申请', platform: 'CRM' },
    { name: '刘欢', role: '媒介主管', status: '已通过', time: '2026-08-14 17:30:00', remark: '已审核', platform: '飞书' },
    { name: '王春雷', role: '部门负责人', status: '驳回', time: '2026-08-15 11:00:00', remark: '返点过高，需重新谈判', platform: 'CRM' },
  ],
}
export const materialPurchaseApprovalNodesData = materialPurchaseApprovalNodes

// === KPI 管理 ===
const deptKpiReports = [
  { id: 'DK001', dept: '业务一部', month: '2026-08', target: '3000000', actual: '2580000', percent: 86, rank: 1 },
  { id: 'DK002', dept: '业务二部', month: '2026-08', target: '2500000', actual: '2100000', percent: 84, rank: 2 },
  { id: 'DK003', dept: '业务三部', month: '2026-08', target: '2000000', actual: '1450000', percent: 72, rank: 3 },
]

// ============ 部门 KPI 报表（按 PC 端 部门 KPI 报表 - 投放消耗表）============
// 数据结构（参考 PC 截图）：
//   销售部门 → 媒体 → 9 项指标
//   每部门一份明细 + 一份汇总
//   移动端按"部门维度分组 + 每媒体一张卡片"展示
const DEPT_LIST = [
  { id: 'all',       label: '全部',          isAll: true },
  { id: 'shenzhen',  label: '深圳分公司' },
  { id: 'sales',     label: '销售部' },
  { id: 'ka',        label: 'KA 销售部' },
  { id: 'xhs',       label: '小红书营销中心' },
  { id: 'group',     label: '销售组' },
]

const MEDIA_LIST = [
  { id: 'toutiao-ad',   label: '头条-AD' },
  { id: 'toutiao-qc',   label: '头条-千川' },
  { id: 'toutiao-local',label: '头条-本地推' },
  { id: 'xhs-brand',    label: '小红书-品牌' },
  { id: 'xhs-jg',       label: '小红书-聚光' },
  { id: 'wb-new',       label: '微博-新客' },
  { id: 'wb-frame',     label: '微博-框架' },
  { id: 'ks-ad',        label: '快手-AD' },
  { id: 'tx-gdt',       label: '腾讯-广点通' },
]

// 单条指标生成器：依据基准值上下浮动生成 KPI 数据
// 媒体基准消耗（万）用于横向对比
const MEDIA_BASE = {
  'toutiao-ad':    788.79,
  'toutiao-qc':    897.99,
  'toutiao-local': 241.38,
  'xhs-brand':      0,
  'xhs-jg':         0.31,
  'wb-new':         0,
  'wb-frame':       0.08,
  'ks-ad':          0.65,
  'tx-gdt':       227.56,
}

// 生成 KPI 数据：KPI目标 / 总消耗 / 平均月消耗 / 平均日消耗 / 时间进度 / 完成率 / 剩余目标 / 剩余日耗 / 权重 / 环比
// deptId: 销售部门（汇总 / 特定分公司）；mediaId: 媒体
// 返回结构：{ kpiTarget, totalCost, monthAvg, dayAvg, timeProgress, completionRate, remainTarget, remainDayCost, weight, ringRatio }
function buildMediaKpi(deptId, mediaId) {
  const seed = (deptId + ':' + mediaId)
    .split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const base = MEDIA_BASE[mediaId] ?? 0
  // KPI目标 ≈ base * 12 ~ 13（按年）
  const kpiTarget = +(base * 12.5 + (seed % 17)).toFixed(2)
  // 总消耗（年度至今）≈ base * 累计月份天数/365 ≈ base * 0.55 ~ 0.65
  const totalCost = +(base * (0.55 + (seed % 11) / 100)).toFixed(2)
  const monthAvg  = +(totalCost / 8).toFixed(2)  // 已过去 8 个月
  const dayAvg    = +(totalCost / 245).toFixed(2) // 245 天
  const timeProgress = 64.66                       // 当前年度时间进度（统一）
  const completionRate = +((totalCost / kpiTarget) * 100).toFixed(2) || 0
  const remainTarget = +(kpiTarget - totalCost).toFixed(2)
  const remainDayCost = +((remainTarget / (365 - 245))).toFixed(2)
  const weight = +(base * 0.04 + (seed % 5)).toFixed(2)
  const ringRatio = ((seed % 7) - 3).toFixed(1) + '%' // -3% ~ +3%
  return {
    kpiTarget, totalCost, monthAvg, dayAvg, timeProgress,
    completionRate: completionRate > 100 ? 100 : completionRate,
    remainTarget, remainDayCost, weight, ringRatio,
  }
}

// 汇总级别：所有媒体相加
function buildAggregate(deptId) {
  const all = MEDIA_LIST.map(m => ({ mediaId: m.id, kpi: buildMediaKpi(deptId, m.id) }))
  const sum = (key) => all.reduce((s, x) => s + (x.kpi[key] || 0), 0)
  const totalCost = sum('totalCost')
  const kpiTarget = sum('kpiTarget')
  const remainTarget = sum('remainTarget')
  const remainDayCost = +(remainTarget / 120).toFixed(2)
  const monthAvg = +(totalCost / 8).toFixed(2)
  const dayAvg = +(totalCost / 245).toFixed(2)
  return {
    totalCost, kpiTarget, remainTarget, remainDayCost, monthAvg, dayAvg,
    timeProgress: 64.66,
    completionRate: +((totalCost / kpiTarget) * 100).toFixed(2) || 0,
    weight: 100,
    ringRatio: '--',
    mediaRows: all,
  }
}

// 部门 × 媒体 明细数据集
const DEPT_KPI_DATA = {
  all:      buildAggregate('all'),
  shenzhen: buildAggregate('shenzhen'),
  sales:    buildAggregate('sales'),
  ka:       buildAggregate('ka'),
  xhs:      buildAggregate('xhs'),
  group:    buildAggregate('group'),
}

// 顶部 5 张 KPI 概览卡（统一显示汇总口径，不随部门切换）
const DEPT_KPI_OVERVIEW = {
  yearTarget:    { value: '9,775.46',  unit: '万元',    color: 'orange', label: '年计划目标' },
  timeProgress:  { value: '64.66',     unit: '%',       color: 'red',    label: '年时间进度', progress: 64.66, progressColor: '#FF5A5A' },
  completion:    { value: '0.24',      unit: '%',       color: 'green',  label: '年完成率',   progress: 0.24,   progressColor: '#34A853' },
  remainTarget:  { value: '9,751.91',  unit: '万元',    color: 'cyan',   label: '年剩余目标' },
  remainDayCost: { value: '75.60',     unit: '万元/日', color: 'blue',   label: '年剩余日耗' },
}

export const deptKpiOverviewData = DEPT_KPI_OVERVIEW
export const deptKpiData = DEPT_KPI_DATA
export const deptListOptions = DEPT_LIST
export const mediaListOptions = MEDIA_LIST

const deptKpiSettings = [
  { id: 'DKS001', dept: '业务一部', year: '2026', quarter: 'Q3', target: '9000000', kpiType: '回款', updater: '管理员', updated: '2026-07-01' },
  { id: 'DKS002', dept: '业务二部', year: '2026', quarter: 'Q3', target: '7500000', kpiType: '回款', updater: '管理员', updated: '2026-07-01' },
]

// ============ 部门 KPI 目标设置（按 PC 端"部门 KPI 目标设置"重设计）============
// 2D 结构：部门 × 月份 × 媒体 × 数值
// PC 表是"部门(行) × 媒体(列) × 月份(date)"，移动端转换为：
//   顶部 = 全局 (公司总 KPI + 当前月份)
//   部门 chip = 切换部门
//   卡片 = 部门内 9 媒体的 KPI 输入
const DEPT_KPI_SETTING_DATA = {
  // 全局公司总 KPI（按月份）
  companyTotal: {
    '2026-01': 150000, '2026-02': 160000, '2026-03': 170000, '2026-04': 175000,
    '2026-05': 180000, '2026-06': 185000, '2026-07': 190000, '2026-08': 192200,
    '2026-09': 200000, '2026-10': 210000, '2026-11': 220000, '2026-12': 230000,
  },
  // 部门 × 月份 × 媒体 KPI（按部门分组，每部门 12 个月 × 9 媒体的二维表）
  // 这里用确定性算法生成（按部门 id + 月份 + 媒体 id hash 浮动）
  byDeptMonthMedia: (deptId, month) => {
    const seed = (deptId + ':' + month).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
    const result = {}
    MEDIA_LIST.forEach((m, idx) => {
      // 各媒体权重不同（基于 MEDIA_BASE）
      const base = MEDIA_BASE[m.id] ?? 0
      const variance = ((seed + idx * 13) % 17) - 8
      result[m.id] = Math.max(0, Math.round(base * 1000 + variance * 500))
    })
    return result
  },
  // 部门总 KPI（按月份）— 由 9 媒体相加得出
  deptTotal: (deptId, month) => {
    const medias = DEPT_KPI_SETTING_DATA.byDeptMonthMedia(deptId, month)
    return Object.values(medias).reduce((s, v) => s + v, 0)
  },
}

export const deptKpiSettingData = DEPT_KPI_SETTING_DATA
export const deptKpiMonthsOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

// === 员工 KPI 设置（按员工×月份×媒体维度）===
const STAFF_LIST = [
  // 深圳分公司
  { id: 'sh01', name: '冯孙杰', deptId: 'shenzhen' },
  { id: 'sh02', name: '王志远', deptId: 'shenzhen' },
  { id: 'sh03', name: '李慧敏', deptId: 'shenzhen' },
  // 销售部
  { id: 'xs01', name: '王春雷', deptId: 'sales' },
  { id: 'xs02', name: '郑昊坤', deptId: 'sales' },
  { id: 'xs03', name: '张佳宝', deptId: 'sales' },
  { id: 'xs04', name: '解金群', deptId: 'sales' },
  { id: 'xs05', name: '张朔',   deptId: 'sales' },
  { id: 'xs06', name: '李慧彬', deptId: 'sales' },
  { id: 'xs07', name: '孙超',   deptId: 'sales' },
  { id: 'xs08', name: '刘欢',   deptId: 'sales' },
  { id: 'xs09', name: '韩元月', deptId: 'sales' },
  { id: 'xs10', name: '宫丽岩', deptId: 'sales' },
  // KA 销售部
  { id: 'ka01', name: '孟丽珊', deptId: 'ka' },
  { id: 'ka02', name: '王靖雅', deptId: 'ka' },
  // 小红书营销中心
  { id: 'xhs01', name: '李聪聪', deptId: 'xhs' },
  { id: 'xhs02', name: '段玉',   deptId: 'xhs' },
  // 销售组
  { id: 'sg01', name: '宋雅倩', deptId: 'group' },
  { id: 'sg02', name: '潘建民', deptId: 'group' },
  { id: 'sg03', name: '秦伟飞', deptId: 'group' },
  { id: 'sg04', name: '杜天琪', deptId: 'group' },
  { id: 'sg05', name: '张永永', deptId: 'group' },
  { id: 'sg06', name: '吴晗',   deptId: 'group' },
  { id: 'sg07', name: '李梦竹', deptId: 'group' },
]

// 员工 KPI 设置数据（按员工 × 月份 × 媒体）
const STAFF_KPI_SETTING_DATA = {
  // 给定员工 id 和月份 'YYYY-MM'，返回 9 媒体 KPI 数值对象
  byEmpMonthMedia: (empId, month) => {
    const seed = (empId + ':' + month).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
    const result = {}
    MEDIA_LIST.forEach((m, idx) => {
      const base = MEDIA_BASE[m.id] ?? 0
      const variance = ((seed + idx * 7) % 23) - 10
      result[m.id] = Math.max(0, Math.round(base * 200 + variance * 300))
    })
    return result
  },
  // 员工 KPI 合计（9 媒体相加）
  empTotal: (empId, month) => {
    const medias = STAFF_KPI_SETTING_DATA.byEmpMonthMedia(empId, month)
    return Object.values(medias).reduce((s, v) => s + v, 0)
  },
}

export const staffList = STAFF_LIST
export const staffKpiSettingData = STAFF_KPI_SETTING_DATA

// === 员工 KPI 报表 ===
// 全公司 KPI 概览（受汇总日期影响）
const STAFF_KPI_OVERVIEW = {
  yearTarget:  { value: '1922',   unit: '万' },
  timeProgress:  { value: '66.67%', progress: 66.67, progressColor: '#FF9A3C' },
  completion:    { value: '52.30%', progress: 52.30, progressColor: '#2D7FF9' },
  remainTarget:  { value: '917',   unit: '万' },
  remainDayCost: { value: '15.6',  unit: '万/日' },
}

// 媒体 × KPI（用于汇总 section）
const buildStaffKpiRow = (seed, base, weightRatio = 1) => {
  const kpiTarget = Math.round(base * (1 + (seed % 30 - 15) / 100) * weightRatio)
  const totalCost = Math.round(kpiTarget * ((seed % 70) / 100 + 0.2))
  const completionRate = +(totalCost / kpiTarget * 100).toFixed(2)
  const timeProgress = 66.67
  const remainTarget = Math.max(0, kpiTarget - totalCost)
  const monthAvg = +(totalCost / 8).toFixed(2)
  const dayAvg = +(totalCost / 240).toFixed(2)
  const remainDayCost = +(remainTarget / 75).toFixed(2)
  return {
    kpiTarget, totalCost, monthAvg, dayAvg,
    timeProgress, completionRate, remainTarget, remainDayCost,
    weight: +((kpiTarget / 1922) * 100).toFixed(2),
    ringRatio: ((seed % 11) - 5) + '%',
  }
}

const buildMediaRows = (seedBase) => {
  return MEDIA_LIST.map((m, idx) => ({
    mediaId: m.id,
    kpi: buildStaffKpiRow(seedBase + idx * 31, MEDIA_BASE[m.id] / 100, 0.5),
  }))
}

const STAFF_KPI_DATA = {
  // 全公司汇总（用于汇总 section）
  all: {
    kpiTarget: 1922,
    totalCost: 1005,
    monthAvg: 126,
    dayAvg: 4.2,
    timeProgress: 66.67,
    completionRate: 52.30,
    remainTarget: 917,
    remainDayCost: 15.6,
    weight: 100,
    ringRatio: '+5.2%',
    mediaRows: buildMediaRows(100),
  },
  // 按员工（empId: data）
  byEmp: (() => {
    const map = {}
    STAFF_LIST.forEach((emp, idx) => {
      const seed = emp.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0) + idx * 13
      const baseKpi = 80 + (seed % 120) // 80 ~ 200 万
      const baseCost = baseKpi * ((seed % 70) / 100 + 0.15)
      const completionRate = +(baseCost / baseKpi * 100).toFixed(2)
      map[emp.id] = {
        kpiTarget: Math.round(baseKpi),
        totalCost: Math.round(baseCost),
        monthAvg: +(baseCost / 8).toFixed(2),
        dayAvg: +(baseCost / 240).toFixed(2),
        timeProgress: 66.67,
        completionRate,
        remainTarget: Math.max(0, Math.round(baseKpi - baseCost)),
        remainDayCost: +((baseKpi - baseCost) / 75).toFixed(2),
        weight: +((baseKpi / 1922) * 100).toFixed(2),
        ringRatio: ((seed % 13) - 6) + '%',
        mediaRows: buildMediaRows(seed),
      }
    })
    return map
  })(),
}

export const staffKpiOverviewData = STAFF_KPI_OVERVIEW
export const staffKpiData = STAFF_KPI_DATA

const empKpiSettings = [
  { id: 'EKS001', name: '冯孙杰', dept: '业务一部', month: '2026-08', salesTarget: '800000', paymentTarget: '600000', updater: '主管', updated: '2026-08-01' },
  { id: 'EKS002', name: '张三', dept: '业务二部', month: '2026-08', salesTarget: '600000', paymentTarget: '450000', updater: '主管', updated: '2026-08-01' },
]

const empKpiReports = [
  { id: 'EKR001', name: '冯孙杰', dept: '业务一部', salesActual: '580000', salesTarget: '800000', percent: 72, rank: 1 },
  { id: 'EKR002', name: '张三', dept: '业务二部', salesActual: '520000', salesTarget: '600000', percent: 87, rank: 2 },
  { id: 'EKR003', name: '李四', dept: '业务二部', salesActual: '480000', salesTarget: '550000', percent: 87, rank: 3 },
]

const changeLogs = (() => {
  const types = ['部门KPI设置', '员工KPI设置']
  const medias = ['头条-AD', '头条-千川', '头条-品牌', '头条-星图', '头条-本地推']
  const sources = ['KA部', '深圳分公司', '销售部', '小红书营销中心', '销售组']
  const operators = ['王春雷', '刘欢', '郑昊坤', '孟丽珊', '管理员', '韩元月']
  const records = []
  for (let i = 0; i < 56; i++) {
    const type = types[i % 2 === 0 ? 0 : 1]
    const media = medias[i % medias.length]
    const source = sources[i % sources.length]
    const operator = operators[i % operators.length]
    const date = `2026-03-${String((i % 28) + 1).padStart(2, '0')}`
    const before = (i % 11).toFixed(2)
    const after = (i + 1).toFixed(2)
    const hour = 8 + (i * 3) % 14
    const minute = (i * 7) % 60
    const second = (i * 11) % 60
    const time = `2026-03-${String(20 + (i % 8)).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    const desc = `【${operator}】为【${source}】在【${media}】设置了【${date}】的KPI，从【${before}】调整为【${after}】`
    records.push({
      id: `CL${String(i + 1).padStart(3, '0')}`,
      type,
      media,
      date,
      source,
      before,
      after,
      description: desc,
      operator,
      time,
    })
  }
  return records
})()

export const changeLogData = changeLogs

// === 销售报表 ===
const salesDaily = [
  { id: 'SD240824', date: '2026-08-24', name: '冯孙杰', sales: '128000', newCustomers: 3, newOpportunities: 1, visits: 4 },
  { id: 'SD240823', date: '2026-08-23', name: '冯孙杰', sales: '96000', newCustomers: 2, newOpportunities: 0, visits: 3 },
  { id: 'SD240822', date: '2026-08-22', name: '冯孙杰', sales: '118000', newCustomers: 1, newOpportunities: 2, visits: 5 },
]
const salesWeekly = [
  { id: 'SW2026-W34', week: '2026-W34', name: '冯孙杰', sales: '685000', newCustomers: 12, newOpportunities: 5 },
  { id: 'SW2026-W33', week: '2026-W33', name: '冯孙杰', sales: '620000', newCustomers: 9, newOpportunities: 3 },
]
const salesMonthly = [
  { id: 'SM2026-08', month: '2026-08', name: '冯孙杰', sales: '2580000', newCustomers: 28, newOpportunities: 12, completion: 86 },
  { id: 'SM2026-07', month: '2026-07', name: '冯孙杰', sales: '2380000', newCustomers: 25, newOpportunities: 10, completion: 79 },
]
const salesQuarterly = [
  { id: 'SQ2026-Q3', quarter: '2026-Q3', name: '冯孙杰', sales: '4960000', target: '6000000', completion: 82 },
]

// === 财务中心 ===
const contracts = [
  { id: 'HT-2026-001', title: '示例客户1 千川代投年框', customer: '示例客户1', amount: 580000, date: '2026-08-15', status: '执行中', owner: '冯孙杰' },
  { id: 'HT-2026-002', title: '某电商品牌 磁力金牛 Q3', customer: '某电商品牌', amount: 300000, date: '2026-07-20', status: '执行中', owner: '冯孙杰' },
  { id: 'HT-2026-003', title: '美妆品牌 巨量开户合同', customer: '美妆品牌-小红书', amount: 200000, date: '2026-08-10', status: '待审核', owner: '冯孙杰' },
  { id: 'HT-2026-004', title: '本地推-餐饮试投', customer: '本地推-餐饮连锁', amount: 80000, date: '2026-08-22', status: '待审核', owner: '冯孙杰' },
]

const payments = [
  { id: 'PAY001', contract: 'HT-2026-001', customer: '示例客户1', amount: '290000', due: '2026-09-15', status: '待回款', invoice: '是' },
  { id: 'PAY002', contract: 'HT-2026-002', customer: '某电商品牌', amount: '150000', due: '2026-08-25', status: '已回款', invoice: '是' },
  { id: 'PAY003', contract: 'HT-2026-001', customer: '示例客户1', amount: '290000', due: '2026-08-15', status: '已回款', invoice: '是' },
]

const balances = [
  { id: 'B001', customer: '示例客户1', balance: '50000', type: '预付', updated: '2026-08-24' },
  { id: 'B002', customer: '某电商品牌', balance: '120000', type: '预付', updated: '2026-08-23' },
]

const refunds = [
  { id: 'RF001', contract: 'HT-2026-003', customer: '美妆品牌', amount: '50000', reason: '投放未达标', applicant: '李娜', status: '审批中', date: '2026-08-20' },
]

const reserves = [
  { id: 'RV001', platform: '巨量引擎', customer: '示例客户1', amount: '1000000', date: '2026-07-15', status: '已备款' },
  { id: 'RV002', platform: '磁力金牛', customer: '某电商品牌', amount: '500000', date: '2026-07-20', status: '已备款' },
]

const invoices = [
  { id: 'INV001', contract: 'HT-2026-002', customer: '某电商品牌', amount: '300000', type: '专票', status: '已开具', date: '2026-07-25' },
  { id: 'INV002', contract: 'HT-2026-001', customer: '示例客户1', amount: '580000', type: '专票', status: '待开具', date: '2026-08-15' },
]

// === 运营中心 ===
const operations = [
  { advId: '1754341994330189', advName: '北京央广时代', date: '2026-08-24', groupId: 'G001', groupName: '央广时代传媒', platform: '巨量引擎', projectName: '618品牌推广', operator: '王春雷', totalConsumption: '12680.50', giftConsumption: '3200.00', nonGiftConsumption: '9480.50' },
  { advId: '1754341994330201', advName: '深圳市美妆优选', date: '2026-08-24', groupId: 'G002', groupName: '美妆优选集团', platform: '磁力金牛', projectName: '美妆种草', operator: '李晓晨', totalConsumption: '8950.00', giftConsumption: '1500.00', nonGiftConsumption: '7450.00' },
  { advId: '1754341994330287', advName: '上海电商科技', date: '2026-08-24', groupId: 'G003', groupName: '电商品牌联盟', platform: '千川', projectName: '服饰大促', operator: '张静怡', totalConsumption: '15800.75', giftConsumption: '4000.00', nonGiftConsumption: '11800.75' },
  { advId: '1754341994330312', advName: '广州本地推餐饮', date: '2026-08-24', groupId: 'G004', groupName: '本地生活集团', platform: '腾讯广告', projectName: '本地推餐饮', operator: '陈大伟', totalConsumption: '4280.30', giftConsumption: '800.00', nonGiftConsumption: '3480.30' },
  { advId: '1754341994330356', advName: '杭州美妆品牌', date: '2026-08-23', groupId: 'G002', groupName: '美妆优选集团', platform: '聚光', projectName: '面膜专项', operator: '李晓晨', totalConsumption: '6520.00', giftConsumption: '1200.00', nonGiftConsumption: '5320.00' },
  { advId: '1754341994330421', advName: '成都游戏科技', date: '2026-08-23', groupId: 'G005', groupName: '游戏联盟', platform: '巨量引擎', projectName: '游戏买量', operator: '赵宇航', totalConsumption: '22150.00', giftConsumption: '5500.00', nonGiftConsumption: '16650.00' },
  { advId: '1754341994330498', advName: '武汉教育集团', date: '2026-08-23', groupId: 'G006', groupName: '教育联盟', platform: '磁力金牛', projectName: '暑期班推广', operator: '王春雷', totalConsumption: '7890.50', giftConsumption: '1800.00', nonGiftConsumption: '6090.50' },
  { advId: '1754341994330553', advName: '南京本地服务', date: '2026-08-22', groupId: 'G004', groupName: '本地生活集团', platform: '巨量引擎', projectName: '本地推美业', operator: '陈大伟', totalConsumption: '3420.00', giftConsumption: '600.00', nonGiftConsumption: '2820.00' },
  { advId: '1754341994330612', advName: '深圳跨境电商', date: '2026-08-22', groupId: 'G003', groupName: '电商品牌联盟', platform: 'TikTok', projectName: '跨境爆款', operator: '张静怡', totalConsumption: '18560.40', giftConsumption: '4200.00', nonGiftConsumption: '14360.40' },
  { advId: '1754341994330678', advName: '苏州医美机构', date: '2026-08-22', groupId: 'G007', groupName: '医美联盟', platform: '聚光', projectName: '医美抗衰', operator: '李晓晨', totalConsumption: '9870.00', giftConsumption: '2200.00', nonGiftConsumption: '7670.00' },
  { advId: '1754341994330734', advName: '天津家居建材', date: '2026-08-21', groupId: 'G008', groupName: '家居建材联盟', platform: '腾讯广告', projectName: '装修旺季', operator: '赵宇航', totalConsumption: '5430.20', giftConsumption: '1000.00', nonGiftConsumption: '4430.20' },
  { advId: '1754341994330791', advName: '北京汽车服务', date: '2026-08-21', groupId: 'G009', groupName: '汽车服务联盟', platform: '巨量引擎', projectName: '汽车后市场', operator: '王春雷', totalConsumption: '11240.00', giftConsumption: '2800.00', nonGiftConsumption: '8440.00' },
  { advId: '1754341994330856', advName: '上海金融科技', date: '2026-08-21', groupId: 'G010', groupName: '金融服务联盟', platform: '磁力金牛', projectName: '金融APP拉新', operator: '陈大伟', totalConsumption: '16780.50', giftConsumption: '3800.00', nonGiftConsumption: '12980.50' },
  { advId: '1754341994330912', advName: '广州母婴品牌', date: '2026-08-20', groupId: 'G011', groupName: '母婴用品联盟', platform: '千川', projectName: '母婴节活动', operator: '张静怡', totalConsumption: '8910.00', giftConsumption: '2100.00', nonGiftConsumption: '6810.00' },
  { advId: '1754341994330978', advName: '杭州食品饮料', date: '2026-08-20', groupId: 'G012', groupName: '食品饮料联盟', platform: '巨量引擎', projectName: '夏季饮品', operator: '李晓晨', totalConsumption: '4560.30', giftConsumption: '900.00', nonGiftConsumption: '3660.30' },
  { advId: '1754341994331034', advName: '成都宠物用品', date: '2026-08-20', groupId: 'G013', groupName: '宠物用品联盟', platform: '聚光', projectName: '宠物食品', operator: '赵宇航', totalConsumption: '3120.00', giftConsumption: '500.00', nonGiftConsumption: '2620.00' },
  { advId: '1754341994331091', advName: '深圳运动健身', date: '2026-08-19', groupId: 'G014', groupName: '运动健身联盟', platform: '腾讯广告', projectName: '健身课程', operator: '王春雷', totalConsumption: '6230.50', giftConsumption: '1400.00', nonGiftConsumption: '4830.50' },
  { advId: '1754341994331156', advName: '武汉旅游服务', date: '2026-08-19', groupId: 'G015', groupName: '旅游服务联盟', platform: '磁力金牛', projectName: '暑期旅游', operator: '陈大伟', totalConsumption: '7560.00', giftConsumption: '1700.00', nonGiftConsumption: '5860.00' },
  { advId: '1754341994331212', advName: '上海教育培训', date: '2026-08-19', groupId: 'G006', groupName: '教育联盟', platform: '千川', projectName: '在线课程', operator: '李晓晨', totalConsumption: '13240.75', giftConsumption: '3200.00', nonGiftConsumption: '10040.75' },
  { advId: '1754341994331278', advName: '北京文化传媒', date: '2026-08-18', groupId: 'G016', groupName: '文化传媒联盟', platform: '巨量引擎', projectName: '影视宣发', operator: '张静怡', totalConsumption: '19850.00', giftConsumption: '4500.00', nonGiftConsumption: '15350.00' },
]

const accountBindings = [
  { advId: '1874478597113179', advName: '央广-罗定市罗镜镇蒲又青百货店-90', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478596509899', advName: '央广-罗定市罗镜镇蒲又青百货店-89', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478595905546', advName: '央广-罗定市罗镜镇蒲又青百货店-88', operatorInfo: '王春雷 · 2026-08-20', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478595264523', advName: '央广-罗定市罗镜镇蒲又青百货店-87', operatorInfo: '李晓晨 · 2026-08-18', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478594767449', advName: '央广-罗定市罗镜镇蒲又青百货店-86', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478594143499', advName: '央广-罗定市罗镜镇蒲又青百货店-85', operatorInfo: '陈大伟 · 2026-08-15', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478593638810', advName: '央广-罗定市罗镜镇蒲又青百货店-84', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478593113162', advName: '央广-罗定市罗镜镇蒲又青百货店-83', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478592379274', advName: '央广-罗定市罗镜镇蒲又青百货店-82', operatorInfo: '赵宇航 · 2026-08-10', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478591761675', advName: '央广-罗定市罗镜镇蒲又青百货店-81', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478587495433', advName: '央广-罗定市罗镜镇蒲又青百货店-80', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478588687021', advName: '央广-罗定市罗镜镇蒲又青百货店-79', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478586320907', advName: '央广-罗定市罗镜镇蒲又青百货店-78', operatorInfo: '王春雷 · 2026-08-05', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478585758793', advName: '央广-罗定市罗镜镇蒲又青百货店-77', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478585179339', advName: '央广-罗定市罗镜镇蒲又青百货店-76', operatorInfo: '— —', policyName: '深圳艾斯，头条-AD', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '头条-AD', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478584512498', advName: '央广-罗定市罗镜镇蒲又青百货店-75', operatorInfo: '李晓晨 · 2026-07-30', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478583967312', advName: '央广-罗定市罗镜镇蒲又青百货店-74', operatorInfo: '— —', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478583345421', advName: '央广-罗定市罗镜镇蒲又青百货店-73', operatorInfo: '— —', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478582749187', advName: '央广-罗定市罗镜镇蒲又青百货店-72', operatorInfo: '陈大伟 · 2026-07-25', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478582178539', advName: '央广-罗定市罗镜镇蒲又青百货店-71', operatorInfo: '— —', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478581632412', advName: '央广-罗定市罗镜镇蒲又青百货店-70', operatorInfo: '— —', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478581015687', advName: '央广-罗定市罗镜镇蒲又青百货店-69', operatorInfo: '王春雷 · 2026-07-20', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478580472891', advName: '央广-罗定市罗镜镇蒲又青百货店-68', operatorInfo: '— —', policyName: '深圳艾斯，磁力金牛', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '磁力金牛', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478579937415', advName: '央广-罗定市罗镜镇蒲又青百货店-67', operatorInfo: '— —', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478579341572', advName: '央广-罗定市罗镜镇蒲又青百货店-66', operatorInfo: '— —', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478578812694', advName: '央广-罗定市罗镜镇蒲又青百货店-65', operatorInfo: '李晓晨 · 2026-07-10', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478578241538', advName: '央广-罗定市罗镜镇蒲又青百货店-64', operatorInfo: '— —', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478577659412', advName: '央广-罗定市罗镜镇蒲又青百货店-63', operatorInfo: '— —', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
  { advId: '1874478577124371', advName: '央广-罗定市罗镜镇蒲又青百货店-62', operatorInfo: '陈大伟 · 2026-07-05', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: true },
  { advId: '1874478576582914', advName: '央广-罗定市罗镜镇蒲又青百货店-61', operatorInfo: '— —', policyName: '深圳艾斯，聚光', customerName: '罗定市罗镜镇蒲又青百货店（个体工商户）', customerGroup: '深圳艾斯', platform: '聚光', industryL1: '本地服务', industryL2: '餐饮', sales: '李慧彬', createTime: '2026-08-25 15:14:57', hasOperator: false },
]

const wphReports = [
  { id: 'WPH001', advertiser: '某电商品牌', date: '2026-08-24', consumption: '8950', gmv: '89500', roas: '10.0' },
  { id: 'WPH002', advertiser: '美妆品牌', date: '2026-08-24', consumption: '4280', gmv: '42800', roas: '10.0' },
]

const opDaily = [
  { id: 'OPD240824', date: '2026-08-24', totalConsumption: '28225', totalConversions: 695, avgRoas: '3.65' },
]
const opWeekly = [
  { id: 'OPW2026-W34', week: '2026-W34', totalConsumption: '186450', totalConversions: 4521, avgRoas: '3.72' },
]
const opMonthly = [
  { id: 'OPM2026-08', month: '2026-08', totalConsumption: '785600', totalConversions: 19453, avgRoas: '3.85' },
]
const opQuarterly = [
  { id: 'OPQ2026-Q3', quarter: '2026-Q3', totalConsumption: '2150000', totalConversions: 52840, avgRoas: '3.78' },
]

// === 财务数据看板 ===
const rebates = [
  { id: 'RB001', platform: '巨量引擎', policy: 'Q3 标准返点 8%', rebateRate: '8%', month: '2026-08', amount: '102760', status: '已配置' },
  { id: 'RB002', platform: '磁力金牛', policy: 'Q3 大客户返点 12%', rebateRate: '12%', month: '2026-08', amount: '107424', status: '已配置' },
  { id: 'RB003', platform: '千川', policy: 'Q3 中小客户 6%', rebateRate: '6%', month: '2026-08', amount: '7800', status: '已配置' },
]

const performanceData = [
  { id: 'PD001', month: '2026-08', consumption: '3856200', revenue: '2580000', profit: '420000', margin: '16.3%' },
  { id: 'PD002', month: '2026-07', consumption: '3620000', revenue: '2380000', profit: '380000', margin: '16.0%' },
]

// ============ 业绩汇总（App 端 4 维度 + 媒体消耗概览）============
// 9 个媒体卡（按 PC 截图）
const mediaOverview = [
  { key: 'total', label: '总计', nonGift: '235,520.65', total: '393,349.32', gift: '157,508.46', daily: '22,308.19', qoq: 0 },
  { key: 'tt-all', label: '头条总', nonGift: '235,195.36', total: '393,014.38', gift: '157,368.74', daily: '22,269.71', qoq: 0 },
  { key: 'tt-ad', label: '头条-AD', nonGift: '78,537.30', total: '131,136.63', gift: '52,449.18', daily: '2,379.92', qoq: 0 },
  { key: 'tt-qc', label: '头条-千川', nonGift: '78,225.11', total: '130,830.03', gift: '52,454.86', daily: '11,175.02', qoq: 0 },
  { key: 'tt-lpc', label: '头条-本地推', nonGift: '78,432.96', total: '131,047.72', gift: '52,464.71', daily: '8,714.77', qoq: 0 },
  { key: 'tx', label: '腾讯', nonGift: '227.13', total: '227.18', gift: '139.36', daily: '6.88', qoq: 0 },
  { key: 'ks', label: '快手', nonGift: '1.62', total: '1.80', gift: '0.18', daily: '0.40', qoq: 0 },
  { key: 'xhs', label: '小红书', nonGift: '39.75', total: '39.76', gift: '0.02', daily: '17.00', qoq: 0 },
  { key: 'wb', label: '微博', nonGift: '56.79', total: '66.20', gift: '0.15', daily: '14.20', qoq: 0 },
]

// 集团维度（按非赠款消耗降序）
const perfByGroup = [
  { group: '美画轻奢', subject: '广州画标文化传媒有限公司', mode: '走量 自运营', amount: 468121701.35 },
  { group: '优品齐家具', subject: '测试主体_7', mode: '--', amount: 467614684.05 },
  { group: '厦门迦卓', subject: '测试主体_5', mode: '--', amount: 464611232.91 },
  { group: '杭州浙理驾培', subject: '测试主体_9', mode: '--', amount: 463810664.01 },
  { group: '十越九成集团', subject: '测试主体_8', mode: '--', amount: 462683312.52 },
  { group: '薪火集团', subject: '广西邑仔泊舒亮颜定制美容店（个体工商户）', mode: '走量', amount: 5685312.19 },
  { group: 'JT-西安富隆来', subject: '宁夏县刘楼乡天马门业', mode: '走量', amount: 2559444.44 },
  { group: 'JT-比利', subject: '珠海斗门区测北信息服务有限公司', mode: '收量 走量', amount: 2207790.01 },
  { group: '劲松口腔', subject: '北京整齐娃娃口腔', mode: '走量 自运营', amount: 1584758.56 },
  { group: '雍禾集团', subject: '北京雍禾毛发健康管理服务有限公司', mode: '走量', amount: 1501127.46 },
  { group: '深圳艾斯', subject: '广州舒悦服装有限公司', mode: '走量', amount: 1390329.28 },
  { group: '尘多集团', subject: '成都青羊丝缘格纹医疗美容门诊部有限公司', mode: '自运营', amount: 1148246.86 },
  { group: '秀域健康', subject: '北京秀域健康管理有限公司-第一分公司', mode: '走量 自运营', amount: 1116812.00 },
  { group: '碧莲盛', subject: '深圳碧莲盛嘉通专科门诊部', mode: '走量', amount: 930316.24 },
  { group: '上海环裴（待物）', subject: '莓APP', mode: '自运营', amount: 872542.28 },
  { group: '深圳碧莲盛', subject: '测试主体_11', mode: '走量', amount: 745821.36 },
  { group: '华熙生物', subject: '测试主体_12', mode: '自运营', amount: 698432.10 },
  { group: '海伦堡', subject: '测试主体_13', mode: '走量 自运营', amount: 642187.55 },
  { group: '长安信托', subject: '测试主体_14', mode: '走量', amount: 587321.49 },
  { group: '美吉姆', subject: '测试主体_15', mode: '收量', amount: 534678.92 },
  { group: '锦江酒店', subject: '测试主体_16', mode: '走量 自运营', amount: 487654.31 },
  { group: '波司登', subject: '测试主体_17', mode: '走量', amount: 432198.76 },
  { group: '海底捞', subject: '测试主体_18', mode: '自运营', amount: 387654.32 },
  { group: '喜茶', subject: '测试主体_19', mode: '走量 自运营', amount: 345678.90 },
  { group: '百果园', subject: '测试主体_20', mode: '走量', amount: 298765.43 },
  { group: '永辉超市', subject: '测试主体_21', mode: '走量 自运营', amount: 254321.98 },
  { group: '孩子王', subject: '测试主体_22', mode: '走量', amount: 218765.43 },
  { group: '良品铺子', subject: '测试主体_23', mode: '自运营', amount: 187654.32 },
  { group: '奈雪', subject: '测试主体_24', mode: '走量 自运营', amount: 165432.10 },
  { group: '瑞幸咖啡', subject: '测试主体_25', mode: '走量', amount: 143210.98 },
]

// 销售维度
const perfBySales = [
  { name: '杨兴', amount: 2326795279.86 },
  { name: '李婧怡', amount: 9745052.23 },
  { name: '袁芳芳', amount: 4899253.27 },
  { name: '赵伟月', amount: 3993781.91 },
  { name: '郑萍', amount: 2239956.82 },
  { name: '孟丽珊', amount: 2223861.77 },
  { name: '李雪', amount: 1324026.29 },
  { name: '杨新宇', amount: 1188060.56 },
  { name: '未匹配', amount: 701904.32 },
  { name: '宋佳豪', amount: 631798.77 },
  { name: '伊朝阳', amount: 540755.21 },
  { name: '卞明月', amount: 206966.42 },
  { name: '未匹配', amount: 170489.11 },
  { name: '李骏', amount: 160956.67 },
  { name: '张朔', amount: 115645.16 },
  { name: '郭威', amount: 98542.36 },
  { name: '王欣', amount: 87423.50 },
  { name: '陈晨', amount: 76211.88 },
  { name: '林涛', amount: 64320.45 },
  { name: '黄敏', amount: 52187.23 },
  { name: '周楠', amount: 48956.71 },
  { name: '吴昊', amount: 41328.96 },
  { name: '徐明', amount: 38762.41 },
  { name: '孙瑶', amount: 32145.78 },
  { name: '朱琳', amount: 27834.62 },
  { name: '马超', amount: 23456.91 },
  { name: '韩冰', amount: 19876.34 },
  { name: '杨阳', amount: 16543.87 },
  { name: '范丽', amount: 14289.55 },
  { name: '罗丹', amount: 12156.73 },
  { name: '宋宇', amount: 9876.42 },
]

// 业绩归属人维度
const perfByPerfOwner = [
  { name: '未匹配', amount: 2327513184.18 },
  { name: '李婧怡', amount: 9745052.23 },
  { name: '袁芳芳', amount: 4894753.27 },
  { name: '赵伟月', amount: 3993781.91 },
  { name: '郑萍', amount: 2239956.82 },
  { name: '李雪', amount: 1324026.29 },
  { name: '杨新宇', amount: 1188060.56 },
  { name: '宋佳豪', amount: 1087171.76 },
  { name: '张娜', amount: 717989.41 },
  { name: '徐平平', amount: 589536.92 },
  { name: '伊朝阳', amount: 540755.21 },
  { name: '郑明慧', amount: 283005.36 },
  { name: '卞明月', amount: 206966.42 },
  { name: '孟丽珊', amount: 182557.00 },
  { name: '未匹配', amount: 170489.11 },
  { name: '何静', amount: 156432.85 },
  { name: '高翔', amount: 134287.64 },
  { name: '梁爽', amount: 118654.32 },
  { name: '宋丹', amount: 98765.43 },
  { name: '罗成', amount: 84567.21 },
  { name: '蒋琳', amount: 72345.67 },
  { name: '潘悦', amount: 61234.56 },
  { name: '蔡明', amount: 53456.78 },
  { name: '邱芳', amount: 45678.90 },
  { name: '龙威', amount: 38765.43 },
  { name: '夏雨', amount: 32456.78 },
  { name: '贺平', amount: 27654.32 },
  { name: '田恬', amount: 22876.54 },
  { name: '白雪', amount: 18765.43 },
  { name: '冯玥', amount: 15432.10 },
]

// 运营维度
const perfByOperator = [
  { name: '未匹配', amount: 2326803279.86 },
  { name: '未匹配', amount: 21510358.14 },
  { name: '未匹配', amount: 6495548.13 },
  { name: '邹靖泽', amount: 68463.11 },
  { name: '未匹配', amount: 49453.61 },
  { name: '王佩戴', amount: 33183.63 },
  { name: '邢虹蕾', amount: 33123.96 },
  { name: '孙诗源', amount: 31718.07 },
  { name: '未匹配', amount: 30801.38 },
  { name: '黄亚雄', amount: 27130.65 },
  { name: '张佳宝', amount: 25349.22 },
  { name: '苗苗', amount: 24835.07 },
  { name: '李慧彬', amount: 20298.45 },
  { name: '李玉玲', amount: 10869.37 },
  { name: '陈淑倩', amount: 10379.85 },
  { name: '邹阳泽', amount: 9876.43 },
  { name: '陈雪滢', amount: 8543.21 },
  { name: '邢虹蕾', amount: 7654.32 },
  { name: '李基彬', amount: 6543.21 },
  { name: '梁欢', amount: 5432.10 },
  { name: '潘建民', amount: 4321.09 },
  { name: '张朔', amount: 3876.54 },
  { name: '陈志伟', amount: 3210.98 },
  { name: '孙迢', amount: 2765.43 },
  { name: '高丽岩', amount: 2345.67 },
  { name: '王靖雅', amount: 1987.65 },
  { name: '刘欢', amount: 1654.32 },
  { name: '王春雷', amount: 1432.10 },
  { name: '冯孙杰', amount: 1234.56 },
  { name: '李雪', amount: 987.65 },
  { name: '李慧彬', amount: 876.54 },
]

export const performanceMediaOverview = mediaOverview
export const performanceByGroup = perfByGroup
export const performanceBySales = perfBySales
export const performanceByPerfOwner = perfByPerfOwner
export const performanceByOperator = perfByOperator

const settlements = [
  { id: 'ST001', serviceNo: 'SVC-202608-001', customer: '示例客户1', amount: '120000', type: '服务费', status: '待结算', date: '2026-08-20' },
  { id: 'ST002', serviceNo: 'SVC-202608-002', customer: '某电商品牌', amount: '85000', type: '服务费', status: '已结算', date: '2026-08-18' },
]

// 明点全景 - 客户消耗明细（按 PC 截图 8 列字段）
const MINGDIAN_MEDIA = ['头条-AD', '头条-千川', '头条-本地推', '腾讯广告', '快手', '小红书', '磁力金牛']
const MINGDIAN_CUSTOMERS = [
  { name: '内蒙古名帅堂心理咨询有限公司', group: '山东陆路' },
  { name: '广州烧颜贸易有限公司', group: '深圳艾斯' },
  { name: '文成牙贝恩口腔诊所有限公司', group: 'JT-比利' },
  { name: '泰顺牙贝恩口腔门诊部有限公司', group: 'JT-比利' },
  { name: '珠海诺贝尔香山口腔门诊部有限公司', group: 'JT-比利' },
  { name: '珠海诺贝尔时代口腔门诊部有限公司', group: 'JT-比利' },
  { name: '福州美橙口腔医院有限公司', group: 'JT-比利' },
  { name: '郑州晨光悦禾商务服务有限公司', group: '雕享美舍' },
  { name: '共读科技有限公司', group: '共读科技' },
  { name: '深圳美沃达牙科技有限公司', group: 'JT-比利' },
  { name: '艾麦交接集团总部', group: '艾麦交接集团' },
  { name: '完美交接集团总部', group: '完美交接集团' },
  { name: '中粮食品官方旗舰店', group: '中粮集团' },
  { name: '嘉禾电商-视频号旗舰店', group: '嘉禾电商集团' },
  { name: '云锐互动-巨量', group: '云锐互动集团' },
  { name: '薇光文化-抖音品牌', group: '薇光传媒集团' },
]
const MINGDIAN_POLICIES = ['Q3 标准返点 8%', 'Q4 大客户返点 12%', '品牌广告专项 6%', '本地推专项 5%', '千川放量 10%', '磁力金牛返点 9%', '默认返点 4%']
const mingdian = (() => {
  const list = []
  for (let i = 0; i < 28; i++) {
    const media = MINGDIAN_MEDIA[i % MINGDIAN_MEDIA.length]
    const cust = MINGDIAN_CUSTOMERS[i % MINGDIAN_CUSTOMERS.length]
    const policy = MINGDIAN_POLICIES[i % MINGDIAN_POLICIES.length]
    const month = 8 + (i % 5)  // 8-12 月
    const day = 15 - (i % 4) * 3  // 15, 12, 9, 6
    const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const points = +(500 + (i * 137) % 4500 + Math.random() * 200).toFixed(2)
    const rate = 4 + (i % 9)
    const amount = +(points * rate / 100).toFixed(2)
    list.push({
      id: `MD${String(i + 1).padStart(4, '0')}`,
      consumeDate: date,
      mediaPlatform: media,
      customerName: cust.name,
      groupName: cust.group,
      consumePoints: points,
      rebateRate: `${rate}%`,
      rebateAmount: amount,
      salesPolicy: policy,
    })
  }
  return list
})()

const profits = [
  { id: 'PR001', month: '2026-08', revenue: '2580000', cost: '2160000', profit: '420000', margin: '16.3%' },
  { id: 'PR002', month: '2026-07', revenue: '2380000', cost: '2000000', profit: '380000', margin: '16.0%' },
]

const opDashboards = [
  { id: 'ODB001', operator: '张三', month: '2026-08', consumption: '1280000', roas: '3.85', rank: 1 },
  { id: 'ODB002', operator: '李四', month: '2026-08', consumption: '1050000', roas: '3.62', rank: 2 },
  { id: 'ODB003', operator: '王五', month: '2026-08', consumption: '920000', roas: '3.45', rank: 3 },
]

// 运营人员看板 - 每日投放明细（按 PC 截图 15 列字段）
const OP_DASH_MEDIA = ['头条-AD', '头条-千川', '头条-本地推', '腾讯广告', '快手', '小红书', '磁力金牛']
const OP_DASH_ADV = [
  { id: 'TEST_ZJB_A001', name: '测试广告主A-001' },
  { id: 'TEST_ZJB_A002', name: '测试广告主A-002' },
  { id: 'TEST_ZJB_A003', name: '测试广告主A-003' },
  { id: 'TEST_ZJB_SALES_8', name: '测试销售8' },
  { id: 'TEST_ZJB_SALES_9', name: '测试销售9' },
  { id: 'TEST_ZJB_SALES_10', name: '测试销售10' },
  { id: 'TEST_ZJB_SALES_11', name: '测试销售11' },
  { id: 'TEST_ZJB_SALES_12', name: '测试销售12' },
]
const OP_DASH_PROJECTS = ['APP下载投放', '品牌曝光', '线索收集', '直播间引流', '电商转化', '本地推-门店', '快手-短视频', '千川-直播间']
const OP_DASH_POLICIES = ['Q3 标准返点 8%', 'Q4 大客户返点 12%', '品牌广告专项 6%', '本地推专项 5%', '千川放量 10%', '磁力金牛返点 9%']
const OP_DASH_SALES = ['张佳宝', '李基彬', '王春雷', '刘欢', '冯孙杰', '陈志伟']
const OP_DASH_OPERATORS = ['王明阳', '李婷', '张磊', '陈静', '刘洋', '赵敏', '孙浩']
const OP_DASH_OWNERS = ['张佳宝', '王春雷', '冯孙杰', '陈志伟']
const OP_DASH_DEPTS = ['华东运营一组', '华南运营二组', '华北运营三组', '西南运营一组']
const opDashboardReport = (() => {
  const list = []
  for (let i = 0; i < 24; i++) {
    const adv = OP_DASH_ADV[i % OP_DASH_ADV.length]
    const project = OP_DASH_PROJECTS[i % OP_DASH_PROJECTS.length]
    const policy = OP_DASH_POLICIES[i % OP_DASH_POLICIES.length]
    const month = 8 + (i % 5)
    const day = 15 - (i % 4) * 3
    const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const consumption = +(500 + (i * 173) % 4500 + Math.random() * 200).toFixed(2)
    const rebateRate = 4 + (i % 9)
    const rebate = +(consumption * rebateRate / 100).toFixed(2)
    list.push({
      id: `ODR${String(i + 1).padStart(4, '0')}`,
      date,
      mediaPlatform: OP_DASH_MEDIA[i % OP_DASH_MEDIA.length],
      advId: adv.id,
      advName: adv.name,
      customerName: '测试广告主',
      groupName: '未匹配',
      projectName: project,
      directCustomer: '未匹配',
      nonGiftConsumption: consumption,
      rebateRate: `${rebateRate}%`,
      rebateAmount: rebate,
      salesPolicy: policy,
      sales: OP_DASH_SALES[i % OP_DASH_SALES.length],
      operator: OP_DASH_OPERATORS[i % OP_DASH_OPERATORS.length],
      perfOwner: OP_DASH_OWNERS[i % OP_DASH_OWNERS.length],
      dept: OP_DASH_DEPTS[i % OP_DASH_DEPTS.length],
    })
  }
  return list
})()

const serviceTickets = [
  { id: 'TK001', serviceNo: 'SVC-202608-001', customer: '示例客户1', consumption: '120000', commission: '12000', date: '2026-08-20' },
]

const customerPolicyDetails = [
  { id: 'CPD001', customer: '示例客户1', platform: '巨量引擎', policy: 'Q3 标准返点 8%', rebateRate: '8%', month: '2026-08', rebate: '10276' },
]

// 客户政策明细 - 22 列宽表 → App 卡片列表（按 PC 截图字段）
const CP_AD_TYPES = ['微娅-框架', '微娅-微娅', '嘉禾-直播', 'JT比利-医疗', '千寻-品牌', '完美-代理']
const CP_PRODUCTS = ['框架', '微娅', '快手-直播', '腾讯视频流', '小红书种草', '百度信息流']
const CP_INDUSTRIES = ['服饰箱包', '美妆个护', '食品饮料', '家居建材', '教育', '医疗健康']
const CP_SERVICE_TAGS = ['走量', '跨价一类', '跨价二类', '品牌专项', '本地推专项']
const CP_SALES_NAMES = ['王春雷', '熊孙蛇', '冯孙杰', '李基彬', '陈志伟']
const CP_FIRST_AGENTS = ['微娅-框架', '微娅-微娅', '微娅-嘉禾', '完美-代理', '云锐-巨量', '未匹配']
const CP_GROUPS = ['美黛经营', '艾麦交接集团', '完美交接集团', '深圳艾斯', 'JT-比利', '未匹配']
const CP_COMPANIES = [
  '北京快抖科技有限公司', '北京三快在线科技有限公司', '广州唯品会电子商务有限公司',
  '北京卡书面科技有限公司', '锦江琴学科技有限公司', '车好多旧机动车经纪（北京）',
  '成都快购科技有限公司', '小刘妮妮吃喝玩乐', '小象超市好物指南', '用户4063318261',
  '时尚追光者', '菠萝测评师', '思想物语小学堂', '思想小学堂', '小型化学小组长',
  '小型数学小组长', '思想研学馆', '高价收车上瓜子二手车', '专业收车上瓜子', '快手小店商家学院',
]
const CP_POLICIES = ['直播项目_头条-AD', '直播项目_磁力金牛', '直播项目_快手直播', '千川-直播间', '本地推-品牌', '未匹配']
const customerPolicyData = (() => {
  const list = []
  for (let i = 0; i < 24; i++) {
    const adType = CP_AD_TYPES[i % CP_AD_TYPES.length]
    const product = CP_PRODUCTS[i % CP_PRODUCTS.length]
    const advId = `4063662${String(300 + i).padStart(4, '0')}`
    const company = CP_COMPANIES[i % CP_COMPANIES.length]
    const sharedConsumption = +(Math.random() * 20000).toFixed(2)
    const rebateRate = [3, 5, 8, 12, 500, 0][i % 6]
    const rebateAmount = rebateRate === 500
      ? +(sharedConsumption * 5).toFixed(2)
      : +(sharedConsumption * rebateRate / 100).toFixed(2)
    const policyName = CP_POLICIES[i % CP_POLICIES.length]
    const mediaPlatform = policyName.includes('头条') ? '头条-AD'
      : policyName.includes('磁力') ? '磁力金牛'
      : policyName.includes('千川') ? '千川'
      : policyName.includes('快手') ? '快手直播'
      : '未匹配'
    list.push({
      id: `CPR${String(i + 1).padStart(4, '0')}`,
      date: '2026-08',
      group: CP_GROUPS[i % CP_GROUPS.length],
      adType,
      productLine: product,
      customerName: company,
      firstAgent: CP_FIRST_AGENTS[i % CP_FIRST_AGENTS.length],
      advId,
      advCompany: company,
      advAccount: `用户${advId.slice(-10)}`,
      customerId: '0',
      nonGiftConsumption: 0,
      sharedWalletConsumption: sharedConsumption,
      sharedWalletId: '0',
      policyName,
      mediaPlatform,
      rebateRate: `${rebateRate}%`,
      rebateAmount,
      serviceTag: CP_SERVICE_TAGS[i % CP_SERVICE_TAGS.length],
      settlementStat: i % 3 === 0 ? '' : `${1000 + i * 137}`,
      industryL1: i % 4 === 3 ? '无' : CP_INDUSTRIES[i % CP_INDUSTRIES.length],
      industryL2: i % 5 === 0 ? '未匹配' : CP_INDUSTRIES[(i + 2) % CP_INDUSTRIES.length],
      industrySub: i % 3 === 0 ? '' : `${CP_INDUSTRIES[i % CP_INDUSTRIES.length]}-子类`,
      sales: i % 5 === 0 ? '未匹配' : CP_SALES_NAMES[i % CP_SALES_NAMES.length],
    })
  }
  return list
})()

// === 媒介数据看板 ===
// 底池数据列表：60 条数据，已匹配/未匹配 1:1 拆分，覆盖 5 大媒体平台 + 22 列 PC 字段
const PLATFORM_OPTIONS = ['头条', '腾讯', '快手', '小红书', '微博']
const INDUSTRY_L1_OPTS = ['家居建材', '医疗机构', '本地服务', '招商加盟', '医疗健康', '美妆个护', '食品饮料', '教育培训']
const INDUSTRY_L2_OPTS = ['家装主材', '心理咨询', '美甲美睫', '美容美体加盟', '医药健康', '短视频', '粮油干货', '综合电商平台']
const AGENT_IDS = ['17528913969632615', '16349249455226969', '18509179446139864', '18555407629299270']
const ADVERTISERS_POOL = [
  '沈阳市铁西硕永...', '南京长江心理咨询', '广州市拾空癸甲', '广州蓝标文化传媒', '超体经典·T-Garden',
  '天下五分·泽恩·滑...', '北京聚合天众', '成都HLO1·央广聚...', '颜廷瑶·呈一HLO1', '北一HQ01·央广聚',
  '宏桌&量多众Z·Y', '沈阳HD01·央广聚', '成都BQ01·央广聚', '基伙一HMO1·央广', '韶一伙一HMO1·央广',
  '欧一伙一HMO1·央广', '冯斯蓬北三HMO1', '上海得物信息集团',
]
const poolData = (() => {
  const list = []
  for (let i = 0; i < 200; i++) {
    const matched = i % 2 === 0  // 一半已匹配，一半未匹配
    const platform = PLATFORM_OPTIONS[i % PLATFORM_OPTIONS.length]
    const adv = ADVERTISERS_POOL[i % ADVERTISERS_POOL.length]
    const agentId = AGENT_IDS[i % AGENT_IDS.length]
    const industryL1 = INDUSTRY_L1_OPTS[i % INDUSTRY_L1_OPTS.length]
    const industryL2 = INDUSTRY_L2_OPTS[i % INDUSTRY_L2_OPTS.length]
    const totalConsumption = +(Math.random() * 5000).toFixed(2)
    const hasSubWallet = !matched && i % 3 === 0  // 未匹配的某些有子钱包
    list.push({
      id: `PD${String(i + 1).padStart(4, '0')}`,
      matched,
      platform,
      statDate: i % 5 === 0 ? '2025-12-30' : (i % 3 === 0 ? '2026-06-02' : '2026-04-12'),
      agentId,
      customerId: `18515570051854${String(12 + i).padStart(2, '0')}`,
      customerName: adv,
      directCustomerId: `753361${String(800 + i).padStart(3, '0')}`,
      directCustomerName: ADVERTISERS_POOL[(i + 1) % ADVERTISERS_POOL.length],
      industryL1,
      industryL2,
      regDate: '2025-12-15',
      totalConsumption,
      giftConsumption: matched ? 0 : +(Math.random() * 200).toFixed(2),
      nonGiftConsumption: +(Math.random() * 800).toFixed(2),
      prepaidConsumption: +(totalConsumption * 0.6).toFixed(2),
      creditConsumption: +(totalConsumption * 0.4).toFixed(2),
      subWalletId: hasSubWallet ? `7620${String(25411 + i).padStart(6, '0')}` : '0',
      sharedSubWalletName: hasSubWallet ? `共享子钱包-${i + 1}` : '',
      sharedWalletConsumption: hasSubWallet ? +(Math.random() * 1000).toFixed(2) : 0,
      sharedPrepaidConsumption: hasSubWallet ? +(Math.random() * 600).toFixed(2) : 0,
      sharedCreditConsumption: hasSubWallet ? +(Math.random() * 400).toFixed(2) : 0,
      agentSubAccountId: `0`,
      agentSubAccountName: matched ? `代理商子账户-${i + 1}` : '',
      level1AgentCustomerId: agentId,
    })
  }
  return list
})()

const poolTasks = [
  { id: 'PT001', name: '示例客户1-巨量主池任务', pool: '巨量-8月主池', target: '500000', actual: '320000', progress: 64, status: '进行中' },
]

const toutiaoLpcPool = [
  { id: 'LPC001', name: '头条本地推-8月池', region: '北京', size: '500000', used: '320000', rate: 64 },
]

const mediaTasks = [
  { id: 'MT001', name: '示例客户1-巨量排期', platform: '巨量引擎', start: '2026-08-01', end: '2026-08-31', budget: '500000', actual: '320000', status: '进行中' },
]

const mediaDaily = [
  { id: 'MD240824', date: '2026-08-24', totalConsumption: '28225', totalConversions: 695, avgRoas: '3.65' },
]
const mediaWeekly = [{ id: 'MW2026-W34', week: '2026-W34', totalConsumption: '186450' }]
const mediaMonthly = [{ id: 'MM2026-08', month: '2026-08', totalConsumption: '785600' }]
const mediaQuarterly = [{ id: 'MQ2026-Q3', quarter: '2026-Q3', totalConsumption: '2150000' }]
const mediaSemiAnnual = [{ id: 'MS2026-H2', half: '2026-H2', totalConsumption: '4200000' }]
const mediaYearly = [{ id: 'MY2026', year: '2026', totalConsumption: '8500000' }]

const mediaAccounts = [
  { id: 'MA001', name: '示例客户1-巨量账户', platform: '巨量引擎', accountId: 'TT-DY-001', balance: '50000', status: '正常' },
]

const toutiaoBalance = [
  { id: 'TB001', group: '完美交接集团', subject: '完美交接（北京）文化传媒有限公司', coopMode: '走量', yesterdayBalance: 86.42, yesterdayCost: 12.32, weekCost: 88.45, platform: 'AD', availableDays: 12, payType: '预付', date: '2026-08-24' },
  { id: 'TB002', group: '完美交接集团', subject: '完美交接（上海）文化传播有限公司', coopMode: '走量', yesterdayBalance: 32.10, yesterdayCost: 8.45, weekCost: 62.31, platform: '千川', availableDays: 5, payType: '预付', date: '2026-08-24' },
  { id: 'TB003', group: '艾麦交接集团', subject: '艾麦交接（北京）信息科技有限公司', coopMode: '包断', yesterdayBalance: 158.73, yesterdayCost: 21.40, weekCost: 142.80, platform: 'AD', availableDays: 18, payType: '垫款', date: '2026-08-24' },
  { id: 'TB004', group: '艾麦交接集团', subject: '艾麦交接（深圳）数字传媒有限公司', coopMode: '包断', yesterdayBalance: 6.20, yesterdayCost: 3.10, weekCost: 18.95, platform: '本地推', availableDays: 2, payType: '预付', date: '2026-08-24' },
  { id: 'TB005', group: '中粮集团', subject: '中粮我买网（北京）商贸有限公司', coopMode: '走量', yesterdayBalance: 245.18, yesterdayCost: 32.85, weekCost: 198.20, platform: 'AD', availableDays: 25, payType: '垫款', date: '2026-08-24' },
  { id: 'TB006', group: '中粮集团', subject: '中粮食品（深圳）有限公司', coopMode: '走量', yesterdayBalance: 78.50, yesterdayCost: 9.20, weekCost: 67.40, platform: '千川', availableDays: 6, payType: '预付', date: '2026-08-24' },
  { id: 'TB007', group: '薇光传媒集团', subject: '薇光文化传媒（北京）有限公司', coopMode: '自运营', yesterdayBalance: 412.65, yesterdayCost: 56.30, weekCost: 380.45, platform: 'AD', availableDays: 30, payType: '垫款', date: '2026-08-24' },
  { id: 'TB008', group: '薇光传媒集团', subject: '薇光互娱文化（上海）有限公司', coopMode: '自运营', yesterdayBalance: 4.80, yesterdayCost: 2.40, weekCost: 15.60, platform: '本地推', availableDays: 1, payType: '预付', date: '2026-08-24' },
  { id: 'TB009', group: '嘉禾电商集团', subject: '嘉禾电商（北京）科技有限公司', coopMode: '走量', yesterdayBalance: 98.30, yesterdayCost: 14.20, weekCost: 92.45, platform: '千川', availableDays: 9, payType: '预付', date: '2026-08-24' },
  { id: 'TB010', group: '云锐互动集团', subject: '云锐互动（北京）网络科技有限公司', coopMode: '包断', yesterdayBalance: 156.40, yesterdayCost: 22.85, weekCost: 168.30, platform: 'AD', availableDays: 14, payType: '垫款', date: '2026-08-24' },
  { id: 'TB011', group: '完美交接集团', subject: '完美交接（深圳）影视传媒有限公司', coopMode: '走量', yesterdayBalance: 45.20, yesterdayCost: 11.30, weekCost: 78.50, platform: '本地推', availableDays: 4, payType: '预付', date: '2026-08-24' },
  { id: 'TB012', group: '艾麦交接集团', subject: '艾麦交接（上海）数字科技有限公司', coopMode: '包断', yesterdayBalance: 78.60, yesterdayCost: 15.40, weekCost: 105.20, platform: '千川', availableDays: 7, payType: '预付', date: '2026-08-24' },
  { id: 'TB013', group: '薇光传媒集团', subject: '薇光互娱文化（深圳）有限公司', coopMode: '自运营', yesterdayBalance: 18.90, yesterdayCost: 4.20, weekCost: 28.60, platform: '本地推', availableDays: 11, payType: '垫款', date: '2026-08-24' },
  { id: 'TB014', group: '中粮集团', subject: '中粮食品（广州）有限公司', coopMode: '走量', yesterdayBalance: 132.50, yesterdayCost: 18.40, weekCost: 124.80, platform: 'AD', availableDays: 22, payType: '垫款', date: '2026-08-24' },
  { id: 'TB015', group: '嘉禾电商集团', subject: '嘉禾电商（上海）贸易有限公司', coopMode: '走量', yesterdayBalance: 56.80, yesterdayCost: 9.60, weekCost: 65.30, platform: '千川', availableDays: 13, payType: '预付', date: '2026-08-24' },
  { id: 'TB016', group: '云锐互动集团', subject: '云锐互动（深圳）网络科技有限公司', coopMode: '包断', yesterdayBalance: 23.10, yesterdayCost: 5.80, weekCost: 38.40, platform: '本地推', availableDays: 8, payType: '预付', date: '2026-08-24' },
  { id: 'TB017', group: '完美交接集团', subject: '完美交接（广州）影视有限公司', coopMode: '走量', yesterdayBalance: 1.20, yesterdayCost: 0.80, weekCost: 5.20, platform: 'AD', availableDays: 3, payType: '预付', date: '2026-08-24' },
  { id: 'TB018', group: '艾麦交接集团', subject: '艾麦交接（广州）信息科技有限公司', coopMode: '包断', yesterdayBalance: 88.50, yesterdayCost: 13.20, weekCost: 92.10, platform: 'AD', availableDays: 16, payType: '垫款', date: '2026-08-24' },
  { id: 'TB019', group: '薇光传媒集团', subject: '薇光文化传媒（深圳）有限公司', coopMode: '自运营', yesterdayBalance: 65.30, yesterdayCost: 10.50, weekCost: 72.40, platform: '千川', availableDays: 10, payType: '垫款', date: '2026-08-24' },
  { id: 'TB020', group: '中粮集团', subject: '中粮我买网（上海）商贸有限公司', coopMode: '走量', yesterdayBalance: 42.60, yesterdayCost: 7.80, weekCost: 54.20, platform: '千川', availableDays: 8, payType: '预付', date: '2026-08-24' },
  { id: 'TB021', group: '嘉禾电商集团', subject: '嘉禾电商（深圳）贸易有限公司', coopMode: '走量', yesterdayBalance: 0.00, yesterdayCost: 0.00, weekCost: 0.00, platform: '本地推', availableDays: 0, payType: '预付', date: '2026-08-24' },
  { id: 'TB022', group: '云锐互动集团', subject: '云锐互动（广州）网络科技有限公司', coopMode: '包断', yesterdayBalance: 112.40, yesterdayCost: 18.60, weekCost: 128.30, platform: 'AD', availableDays: 19, payType: '垫款', date: '2026-08-24' },
  { id: 'TB023', group: '完美交接集团', subject: '完美交接（杭州）影视有限公司', coopMode: '走量', yesterdayBalance: 67.80, yesterdayCost: 11.40, weekCost: 82.50, platform: '千川', availableDays: 15, payType: '预付', date: '2026-08-24' },
  { id: 'TB024', group: '艾麦交接集团', subject: '艾麦交接（杭州）信息科技有限公司', coopMode: '包断', yesterdayBalance: 35.20, yesterdayCost: 6.80, weekCost: 48.30, platform: '本地推', availableDays: 5, payType: '预付', date: '2026-08-24' },
  { id: 'TB025', group: '薇光传媒集团', subject: '薇光文化传媒（杭州）有限公司', coopMode: '自运营', yesterdayBalance: 92.40, yesterdayCost: 14.80, weekCost: 102.60, platform: 'AD', availableDays: 17, payType: '垫款', date: '2026-08-24' },
  { id: 'TB026', group: '中粮集团', subject: '中粮食品（杭州）有限公司', coopMode: '走量', yesterdayBalance: 51.30, yesterdayCost: 8.90, weekCost: 62.40, platform: '千川', availableDays: 12, payType: '预付', date: '2026-08-24' },
  { id: 'TB027', group: '嘉禾电商集团', subject: '嘉禾电商（杭州）贸易有限公司', coopMode: '走量', yesterdayBalance: 28.70, yesterdayCost: 5.20, weekCost: 36.80, platform: '本地推', availableDays: 6, payType: '预付', date: '2026-08-24' },
  { id: 'TB028', group: '云锐互动集团', subject: '云锐互动（杭州）网络科技有限公司', coopMode: '包断', yesterdayBalance: 76.50, yesterdayCost: 12.30, weekCost: 88.40, platform: 'AD', availableDays: 14, payType: '垫款', date: '2026-08-24' },
  { id: 'TB029', group: '完美交接集团', subject: '完美交接（成都）影视有限公司', coopMode: '走量', yesterdayBalance: 38.90, yesterdayCost: 7.10, weekCost: 52.60, platform: '千川', availableDays: 11, payType: '预付', date: '2026-08-24' },
  { id: 'TB030', group: '薇光传媒集团', subject: '薇光互娱文化（成都）有限公司', coopMode: '自运营', yesterdayBalance: 0.50, yesterdayCost: 0.20, weekCost: 1.40, platform: '本地推', availableDays: 2, payType: '预付', date: '2026-08-24' },
]

const selfOpReports = [
  // 完美交接集团
  { id: 'SO001', group: '完美交接集团', advId: 'AD10086', advName: '完美交接-小红书代投',    nonGiftConsumption: 18520.32, selfOpRatio: 78, subject: '完美交接（北京）文化传媒有限公司', dept: '北京-代投一组',   sales: '王芳',   ip: '192.168.10.15', vpnRate: 85, arkOps: 142, nonCoopOps: 5,  date: '2026-08-25' },
  { id: 'SO002', group: '完美交接集团', advId: 'AD10087', advName: '完美交接-抖音直播带货',  nonGiftConsumption: 9280.50,  selfOpRatio: 62, subject: '完美交接（上海）文化传播有限公司', dept: '上海-直播组',     sales: '李娜',   ip: '192.168.10.86', vpnRate: 55, arkOps: 88,  nonCoopOps: 12, date: '2026-08-25' },
  // 艾麦交接集团
  { id: 'SO003', group: '艾麦交接集团', advId: 'AD20103', advName: '艾麦交接-本地推-餐饮',   nonGiftConsumption: 45210.80, selfOpRatio: 92, subject: '艾麦交接（北京）信息科技有限公司', dept: '北京-本地推组',   sales: '张磊',   ip: '192.168.12.34', vpnRate: 95, arkOps: 256, nonCoopOps: 2,  date: '2026-08-25' },
  { id: 'SO004', group: '艾麦交接集团', advId: 'AD20104', advName: '艾麦交接-快手-美妆',     nonGiftConsumption: 1280.42,  selfOpRatio: 28, subject: '艾麦交接（深圳）数字传媒有限公司', dept: '深圳-短视频组',   sales: '刘洋',   ip: '192.168.12.99', vpnRate: 12, arkOps: 18,  nonCoopOps: 32, date: '2026-08-25' },
  // 中粮集团
  { id: 'SO005', group: '中粮集团',     advId: 'AD30215', advName: '中粮-我买网',            nonGiftConsumption: 32150.00, selfOpRatio: 84, subject: '中粮我买网（北京）商贸有限公司',   dept: '北京-品牌组',     sales: '陈静',   ip: '192.168.15.21', vpnRate: 70, arkOps: 198, nonCoopOps: 8,  date: '2026-08-25' },
  { id: 'SO006', group: '中粮集团',     advId: 'AD30216', advName: '中粮-食品饮料',          nonGiftConsumption: 6840.20,  selfOpRatio: 55, subject: '中粮食品（深圳）有限公司',         dept: '深圳-食品组',     sales: '王芳',   ip: '192.168.15.42', vpnRate: 38, arkOps: 72,  nonCoopOps: 18, date: '2026-08-25' },
  // 薇光传媒集团
  { id: 'SO007', group: '薇光传媒集团', advId: 'AD40301', advName: '薇光-互娱文化',          nonGiftConsumption: 56820.45, selfOpRatio: 88, subject: '薇光互娱文化（上海）有限公司',     dept: '上海-游戏组',     sales: '李娜',   ip: '192.168.20.18', vpnRate: 90, arkOps: 312, nonCoopOps: 3,  date: '2026-08-25' },
  { id: 'SO008', group: '薇光传媒集团', advId: 'AD40302', advName: '薇光-文化传媒',          nonGiftConsumption: 3120.18,  selfOpRatio: 22, subject: '薇光文化传媒（北京）有限公司',     dept: '北京-内容组',     sales: '张磊',   ip: '192.168.20.77', vpnRate: 8,  arkOps: 24,  nonCoopOps: 42, date: '2026-08-25' },
  // 嘉禾电商集团
  { id: 'SO009', group: '嘉禾电商集团', advId: 'AD50012', advName: '嘉禾-快消电商',          nonGiftConsumption: 18920.65, selfOpRatio: 73, subject: '嘉禾电商（北京）科技有限公司',     dept: '北京-电商组',     sales: '刘洋',   ip: '192.168.25.50', vpnRate: 60, arkOps: 156, nonCoopOps: 11, date: '2026-08-25' },
  // 云锐互动集团
  { id: 'SO010', group: '云锐互动集团', advId: 'AD60008', advName: '云锐-互动营销',          nonGiftConsumption: 24210.30, selfOpRatio: 81, subject: '云锐互动（北京）网络科技有限公司', dept: '北京-营销组',     sales: '陈静',   ip: '192.168.30.66', vpnRate: 78, arkOps: 210, nonCoopOps: 6,  date: '2026-08-25' },
  // 鸿星传媒
  { id: 'SO011', group: '鸿星传媒',     advId: 'AD70055', advName: '鸿星-游戏投放',          nonGiftConsumption: 38210.00, selfOpRatio: 86, subject: '鸿星传媒（北京）有限公司',         dept: '北京-游戏组',     sales: '王芳',   ip: '192.168.35.12', vpnRate: 88, arkOps: 278, nonCoopOps: 4,  date: '2026-08-25' },
  { id: 'SO012', group: '鸿星传媒',     advId: 'AD70056', advName: '鸿星-短视频MCN',         nonGiftConsumption: 5210.78,  selfOpRatio: 45, subject: '鸿星传媒（杭州）有限公司',         dept: '杭州-短视频组',   sales: '李娜',   ip: '192.168.35.88', vpnRate: 28, arkOps: 56,  nonCoopOps: 24, date: '2026-08-25' },
  // 智云科技
  { id: 'SO013', group: '智云科技',     advId: 'AD80032', advName: '智云-SaaS工具',          nonGiftConsumption: 16420.50, selfOpRatio: 76, subject: '智云科技（北京）有限公司',         dept: '北京-企业服务组', sales: '张磊',   ip: '192.168.40.45', vpnRate: 65, arkOps: 132, nonCoopOps: 9,  date: '2026-08-25' },
  { id: 'SO014', group: '智云科技',     advId: 'AD80033', advName: '智云-教育SaaS',          nonGiftConsumption: 2840.30,  selfOpRatio: 32, subject: '智云教育（成都）有限公司',         dept: '成都-教育组',     sales: '刘洋',   ip: '192.168.40.99', vpnRate: 18, arkOps: 32,  nonCoopOps: 28, date: '2026-08-25' },
  // 悦动出行
  { id: 'SO015', group: '悦动出行',     advId: 'AD90115', advName: '悦动-网约车',            nonGiftConsumption: 22820.00, selfOpRatio: 79, subject: '悦动出行（北京）科技有限公司',     dept: '北京-出行组',     sales: '陈静',   ip: '192.168.45.21', vpnRate: 72, arkOps: 188, nonCoopOps: 7,  date: '2026-08-25' },
  { id: 'SO016', group: '悦动出行',     advId: 'AD90116', advName: '悦动-共享单车',          nonGiftConsumption: 4980.50,  selfOpRatio: 52, subject: '悦动出行（深圳）有限公司',         dept: '深圳-出行组',     sales: '王芳',   ip: '192.168.45.55', vpnRate: 33, arkOps: 68,  nonCoopOps: 16, date: '2026-08-25' },
  // 医美集团
  { id: 'SO017', group: '医美集团',     advId: 'AD100012', advName: '医美-小红书种草',         nonGiftConsumption: 31200.40, selfOpRatio: 85, subject: '医美集团（北京）医疗美容有限公司', dept: '北京-医美组',     sales: '李娜',   ip: '192.168.50.10', vpnRate: 82, arkOps: 225, nonCoopOps: 4,  date: '2026-08-25' },
  { id: 'SO018', group: '医美集团',     advId: 'AD100013', advName: '医美-抖音直播',           nonGiftConsumption: 7820.30,  selfOpRatio: 58, subject: '医美集团（成都）医疗美容有限公司', dept: '成都-医美组',     sales: '张磊',   ip: '192.168.50.80', vpnRate: 40, arkOps: 86,  nonCoopOps: 14, date: '2026-08-25' },
  // 母婴联盟
  { id: 'SO019', group: '母婴联盟',     advId: 'AD110021', advName: '母婴-奶粉电商',           nonGiftConsumption: 12650.20, selfOpRatio: 71, subject: '母婴联盟（北京）商贸有限公司',     dept: '北京-母婴组',     sales: '刘洋',   ip: '192.168.55.32', vpnRate: 58, arkOps: 118, nonCoopOps: 10, date: '2026-08-25' },
  { id: 'SO020', group: '母婴联盟',     advId: 'AD110022', advName: '母婴-童装品牌',           nonGiftConsumption: 3640.80,  selfOpRatio: 38, subject: '母婴联盟（杭州）服饰有限公司',     dept: '杭州-服饰组',     sales: '陈静',   ip: '192.168.55.78', vpnRate: 22, arkOps: 42,  nonCoopOps: 22, date: '2026-08-25' },
  // 金融科技
  { id: 'SO021', group: '金融科技',     advId: 'AD120045', advName: '金融-信用卡推广',         nonGiftConsumption: 48200.00, selfOpRatio: 90, subject: '金融科技（北京）有限公司',         dept: '北京-金融组',     sales: '王芳',   ip: '192.168.60.05', vpnRate: 92, arkOps: 290, nonCoopOps: 2,  date: '2026-08-25' },
  { id: 'SO022', group: '金融科技',     advId: 'AD120046', advName: '金融-理财APP',            nonGiftConsumption: 4280.50,  selfOpRatio: 48, subject: '金融科技（上海）有限公司',         dept: '上海-金融组',     sales: '李娜',   ip: '192.168.60.66', vpnRate: 30, arkOps: 62,  nonCoopOps: 19, date: '2026-08-25' },
  // 房产服务
  { id: 'SO023', group: '房产服务',     advId: 'AD130077', advName: '房产-新房中介',           nonGiftConsumption: 14820.30, selfOpRatio: 68, subject: '房产服务（北京）网络科技有限公司', dept: '北京-房产组',     sales: '张磊',   ip: '192.168.65.18', vpnRate: 52, arkOps: 134, nonCoopOps: 12, date: '2026-08-25' },
  { id: 'SO024', group: '房产服务',     advId: 'AD130078', advName: '房产-二手房',             nonGiftConsumption: 2150.40,  selfOpRatio: 25, subject: '房产服务（深圳）网络科技有限公司', dept: '深圳-房产组',     sales: '刘洋',   ip: '192.168.65.92', vpnRate: 10, arkOps: 28,  nonCoopOps: 38, date: '2026-08-25' },
  // 在线教育
  { id: 'SO025', group: '在线教育',     advId: 'AD140091', advName: '教育-K12网课',            nonGiftConsumption: 6820.18,  selfOpRatio: 60, subject: '在线教育（北京）科技有限公司',     dept: '北京-教育组',     sales: '陈静',   ip: '192.168.70.24', vpnRate: 45, arkOps: 92,  nonCoopOps: 15, date: '2026-08-25' },
  { id: 'SO026', group: '在线教育',     advId: 'AD140092', advName: '教育-职业培训',           nonGiftConsumption: 1840.50,  selfOpRatio: 30, subject: '在线教育（成都）科技有限公司',     dept: '成都-培训组',     sales: '王芳',   ip: '192.168.70.85', vpnRate: 15, arkOps: 26,  nonCoopOps: 30, date: '2026-08-25' },
  // 跨境电商
  { id: 'SO027', group: '跨境电商',     advId: 'AD150110', advName: '跨境-亚马逊代运营',       nonGiftConsumption: 22540.00, selfOpRatio: 82, subject: '跨境电商（深圳）贸易有限公司',     dept: '深圳-跨境组',     sales: '李娜',   ip: '192.168.75.10', vpnRate: 75, arkOps: 188, nonCoopOps: 5,  date: '2026-08-25' },
  { id: 'SO028', group: '跨境电商',     advId: 'AD150111', advName: '跨境-eBay店铺',           nonGiftConsumption: 5640.30,  selfOpRatio: 50, subject: '跨境电商（广州）贸易有限公司',     dept: '广州-跨境组',     sales: '张磊',   ip: '192.168.75.55', vpnRate: 35, arkOps: 78,  nonCoopOps: 17, date: '2026-08-25' },
  // 本地推专项
  { id: 'SO029', group: '本地推联盟',   advId: 'AD160033', advName: '本地推-餐饮连锁',         nonGiftConsumption: 32210.65, selfOpRatio: 87, subject: '本地推联盟（北京）餐饮管理有限公司', dept: '北京-本地推组',  sales: '刘洋',   ip: '192.168.80.42', vpnRate: 80, arkOps: 232, nonCoopOps: 3,  date: '2026-08-25' },
  { id: 'SO030', group: '本地推联盟',   advId: 'AD160034', advName: '本地推-美容美发',         nonGiftConsumption: 5240.80,  selfOpRatio: 42, subject: '本地推联盟（上海）美容美发有限公司', dept: '上海-本地推组',  sales: '陈静',   ip: '192.168.80.95', vpnRate: 25, arkOps: 58,  nonCoopOps: 20, date: '2026-08-25' },
]

const customerHealth = [
  // 集团 1：JT-西安富瑞来（复投，KA 销售部，刘欢）
  {
    name: 'JT-西安富瑞来', groupCustomerType: '复投',
    platforms: ['头条-本地推', '头条-千川'],
    sales: '刘欢', dept: 'KA销售部',
    totalCost: 928569.41, lastCostTime: '2026-08-24',
    subjects: [
      { name: '朔州牙博士口腔诊所有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 958.55, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '信阳新享家居有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 300.00, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '绵阳婷天宠物服务有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 245.43, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '湖南益草百康生物科技有限公司', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 4762.58, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '广州亮靓服饰有限公司', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 3132.08, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '孝感市孝南区桔子百货店（个体工商户）', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 185.60, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '衡水市桃城区景阳防腐木经销处', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 49.87, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
    ],
  },
  // 集团 2：JT-比利（复投，刘欢）
  {
    name: 'JT-比利', groupCustomerType: '复投',
    platforms: ['头条-本地推', '头条-巨量'],
    sales: '刘欢', dept: 'KA销售部',
    totalCost: 834286.13, lastCostTime: '2026-08-24',
    subjects: [
      { name: '上海洁雅口腔门诊部有限公司芙蓉洁雅雅口腔诊所', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1580.20, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '杭州喜乐口腔门诊部有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 824.50, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '苏州美华口腔诊所', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 3260.00, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
      { name: '宁波康宁口腔门诊部', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 1280.45, lastCostTime: '2026-08-24', sales: '刘欢', dept: 'KA销售部' },
    ],
  },
  // 集团 3：流量引擎（湖北）（复投，李慧彬）
  {
    name: '流量引擎（湖北）', groupCustomerType: '复投',
    platforms: ['头条-巨量', '腾讯广告'],
    sales: '李慧彬', dept: 'KA销售部',
    totalCost: 773498.51, lastCostTime: '2026-08-24',
    subjects: [
      { name: '湖北正度梦服饰科技有限公司', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 5680.20, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '武汉奥康运动用品有限公司', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 3260.50, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '宜昌众诚商贸有限公司', customerType: '复投', platform: '腾讯广告', initOpMode: '走量', cost: 8450.32, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '荆门华瑞运动服饰', customerType: '复投', platform: '腾讯广告', initOpMode: '走量', cost: 4280.15, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '黄石博凡体育用品有限公司', customerType: '复投', platform: '腾讯广告', initOpMode: '包断', cost: 2180.00, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
    ],
  },
  // 集团 4：劲松口腔（复投，孟丽珊，未匹配）
  {
    name: '劲松口腔', groupCustomerType: '复投',
    platforms: ['头条-本地推'],
    sales: '孟丽珊', dept: '未匹配',
    totalCost: 440157.80, lastCostTime: '2026-08-24',
    subjects: [
      { name: '北京劲松口腔门诊部（朝阳望京）', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1480.20, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
      { name: '北京劲松口腔门诊部（海淀分部）', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 2280.50, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
    ],
  },
  // 集团 5：雍禾集团（复投，李慧彬）
  {
    name: '雍禾集团', groupCustomerType: '复投',
    platforms: ['头条-巨量'],
    sales: '李慧彬', dept: 'KA销售部',
    totalCost: 240774.43, lastCostTime: '2026-08-24',
    subjects: [
      { name: '广州雍禾医疗美容门诊部有限公司', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 5680.20, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '深圳雍禾植发门诊部', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 3280.45, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '上海雍禾植发医疗美容门诊部', customerType: '复投', platform: '头条-巨量', initOpMode: '走量', cost: 4150.30, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
    ],
  },
  // 集团 6：碧莲盛（复投，郑昊坤）
  {
    name: '碧莲盛', groupCustomerType: '复投',
    platforms: ['头条-本地推'],
    sales: '郑昊坤', dept: 'KA销售部',
    totalCost: 208325.80, lastCostTime: '2026-08-24',
    subjects: [
      { name: '深圳莲佳佳护理发有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1480.20, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '北京碧莲盛植发医院', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 2280.50, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '上海碧莲盛医疗美容门诊部', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1850.30, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
      { name: '广州碧莲盛植发医疗美容', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 3260.45, lastCostTime: '2026-08-24', sales: '郑昊坤', dept: 'KA销售部' },
    ],
  },
  // 集团 7：上海驭宠（宠物）（复投，孟丽珊，未匹配）
  {
    name: '上海驭宠（宠物）', groupCustomerType: '复投',
    platforms: ['头条-千川'],
    sales: '孟丽珊', dept: '未匹配',
    totalCost: 166672.30, lastCostTime: '2026-08-24',
    subjects: [
      { name: '上海驭宠宠物用品有限公司', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 1480.20, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
      { name: '上海驭宠 APP', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 880.30, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
      { name: '上海宠物之家商贸有限公司', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 520.15, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
      { name: '上海萌宠星球宠物服务有限公司', customerType: '复投', platform: '头条-千川', initOpMode: '走量', cost: 220.45, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
    ],
  },
  // 集团 8：深圳艾斯（复投，李慧彬）
  {
    name: '深圳艾斯', groupCustomerType: '复投',
    platforms: ['头条-本地推', '巨量引擎'],
    sales: '李慧彬', dept: 'KA销售部',
    totalCost: 163856.29, lastCostTime: '2026-08-24',
    subjects: [
      { name: '广州艾焰商贸有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1280.50, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '深圳艾斯医疗美容门诊部', customerType: '复投', platform: '巨量引擎', initOpMode: '走量', cost: 2280.20, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
      { name: '深圳艾斯护理有限公司', customerType: '复投', platform: '巨量引擎', initOpMode: '走量', cost: 880.30, lastCostTime: '2026-08-24', sales: '李慧彬', dept: 'KA销售部' },
    ],
  },
  // 集团 9：唯品会（复投，孟丽珊，未匹配）
  {
    name: '唯品会', groupCustomerType: '复投',
    platforms: ['腾讯广告'],
    sales: '孟丽珊', dept: '未匹配',
    totalCost: 157364.19, lastCostTime: '2026-08-24',
    subjects: [
      { name: '广州唯品会电子商务有限公司', customerType: '复投', platform: '腾讯广告', initOpMode: '走量', cost: 4280.50, lastCostTime: '2026-08-24', sales: '孟丽珊', dept: '未匹配' },
    ],
  },
  // 集团 10：山东一木图书（复投，王炳雅，销售部）
  {
    name: '山东一木图书', groupCustomerType: '复投',
    platforms: ['头条-本地推'],
    sales: '王炳雅', dept: '销售部',
    totalCost: 140062.51, lastCostTime: '2026-08-24',
    subjects: [
      { name: '山东一木图书有限公司', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 1480.20, lastCostTime: '2026-08-24', sales: '王炳雅', dept: '销售部' },
      { name: '一木童书馆', customerType: '复投', platform: '头条-本地推', initOpMode: '走量', cost: 280.50, lastCostTime: '2026-08-24', sales: '王炳雅', dept: '销售部' },
    ],
  },
  // 集团 11：活跃新客示例（极小集团）
  {
    name: '搜索新势力（活跃新客）', groupCustomerType: '活跃新客',
    platforms: ['头条-千川'],
    sales: '刘洋', dept: 'KA销售部',
    totalCost: 5680.20, lastCostTime: '2026-08-22',
    subjects: [
      { name: '深圳搜索新势力有限公司', customerType: '活跃新客', platform: '头条-千川', initOpMode: '走量', cost: 980.50, lastCostTime: '2026-08-22', sales: '刘洋', dept: 'KA销售部' },
    ],
  },
  // 集团 12：无效新客示例
  {
    name: '健坤美妆（无效新客）', groupCustomerType: '无效新客',
    platforms: ['头条-巨量'],
    sales: '陈静', dept: 'KA销售部',
    totalCost: 0.00, lastCostTime: '2026-07-15',
    subjects: [
      { name: '健坤美妆（杭州）有限公司', customerType: '无效新客', platform: '头条-巨量', initOpMode: '走量', cost: 0.00, lastCostTime: '2026-07-15', sales: '陈静', dept: 'KA销售部' },
    ],
  },
  // 集团 13：存量客户示例
  {
    name: '云锐存量老客户', groupCustomerType: '存量客户',
    platforms: ['头条-本地推'],
    sales: '周婷', dept: '存量客户部',
    totalCost: 285000.00, lastCostTime: '2026-08-20',
    subjects: [
      { name: '云锐存量北京-餐饮', customerType: '存量客户', platform: '头条-本地推', initOpMode: '走量', cost: 5800.50, lastCostTime: '2026-08-20', sales: '周婷', dept: '存量客户部' },
      { name: '云锐存量-教育', customerType: '存量客户', platform: '头条-本地推', initOpMode: '走量', cost: 2280.20, lastCostTime: '2026-08-20', sales: '周婷', dept: '存量客户部' },
    ],
  },
  // 集团 14：停投客户示例
  {
    name: '速腾食品（停投）', groupCustomerType: '停投客户',
    platforms: ['头条-巨量'],
    sales: '张磊', dept: 'KA销售部',
    totalCost: 0.00, lastCostTime: '2026-06-10',
    subjects: [
      { name: '速腾食品（北京）有限公司', customerType: '停投客户', platform: '头条-巨量', initOpMode: '走量', cost: 0.00, lastCostTime: '2026-06-10', sales: '张磊', dept: 'KA销售部' },
    ],
  },
]

// ============ 媒介数据看板 - 媒介月报 ============
// 集团选项（供 Sheet 搜索框）
const mediaMonthlyGroups = [
  '完美交接集团', '艾麦交接集团', '中粮集团', '薇光传媒集团', '嘉禾电商集团',
  '云锐互动集团', '深圳艾斯', 'JT-比利', '流量引擎（湖北）', '劲松口腔',
  '雍禾集团', '碧莲盛', '上海驭宠（宠物', 'JT-西安富瑞来',
]
// 顶部 10 张统计卡（媒体消耗概览 — 恢复 PC 原版 10 个媒体平台）
const mediaMonthlyKpis = [
  { key: 'total',    label: '总计',        value: 19077.31, delta: '+1,234.56', deltaPct: '+6.92%',  borderTone: 'blue',   deltaTone: 'positive' },
  { key: 'tt',       label: '头条总',      value: 12720.34, delta: '+856.42',   deltaPct: '+7.22%',  borderTone: 'blue',   deltaTone: 'positive' },
  { key: 'ttad',     label: '头条-AD',     value: 5380.20,  delta: '0',         deltaPct: '0%',      borderTone: 'blue',   deltaTone: 'neutral'  },
  { key: 'ttqc',     label: '头条-千川',   value: 4120.85,  delta: '+186.32',   deltaPct: '+4.74%',  borderTone: 'purple', deltaTone: 'positive' },
  { key: 'ttlpc',    label: '头条-本地推', value: 3219.29,  delta: '+357.30',   deltaPct: '+12.49%', borderTone: 'orange', deltaTone: 'positive' },
  { key: 'tx',       label: '腾讯',        value: 2456.78,  delta: '+102.15',   deltaPct: '+4.34%',  borderTone: 'green',  deltaTone: 'positive' },
  { key: 'ks',       label: '快手',        value: 1548.30,  delta: '−28.45',    deltaPct: '−1.81%',  borderTone: 'red',    deltaTone: 'negative' },
  { key: 'xhs',      label: '小红书',      value: 1265.60,  delta: '0',         deltaPct: '0%',      borderTone: 'pink',   deltaTone: 'neutral'  },
  { key: 'wb',       label: '微博',        value: 728.50,   delta: '+18.32',    deltaPct: '+2.58%',  borderTone: 'cyan',   deltaTone: 'positive' },
  { key: 'tiktok',   label: 'TikToK',      value: 357.79,   delta: '0',         deltaPct: '0%',      borderTone: 'gray',   deltaTone: 'neutral'  },
]
// 媒体消耗概览卡的下钻数据 — 核心指标 + 二代/非二代·交易/线索拆分
// 结构：{ [kpiKey]: { metrics:[3项], splits:[4项] } }
//   metrics: [{ key, label, value(万), borderTone, deltaTone }]
//     - nonGift: 非赠款消耗（永远 = kpi.value）
//     - trade: 交易类消耗
//     - lead: 线索类消耗
//     - trade + lead = 100%（占 nonGift 的比例）
//   splits: [{ key, label, value(万), borderTone }]
//     - 'gen2-trade' / 'gen2-lead' / 'noGen2-trade' / 'noGen2-lead'
//     - 同前缀下两个 splits 加起来 = 对应 parent（trade 或 lead）
const _buildDrilldown = (kpiValue, tradeRatio, gen2TradeRatio) => ({
  metrics: [
    { key: 'nonGift',  label: '非赠款消耗', value: kpiValue,                          borderTone: 'blue',   deltaTone: 'positive' },
    { key: 'trade',    label: '交易类消耗', value: +(kpiValue * tradeRatio).toFixed(2), borderTone: 'cyan', deltaTone: 'positive' },
    { key: 'lead',     label: '线索类消耗', value: +(kpiValue * (1 - tradeRatio)).toFixed(2), borderTone: 'purple', deltaTone: 'positive' },
  ],
  splits: [
    { key: 'gen2-trade',   label: '二代·交易类',   value: +(kpiValue * tradeRatio * gen2TradeRatio).toFixed(2),         borderTone: 'blue' },
    { key: 'noGen2-trade', label: '非二代·交易类', value: +(kpiValue * tradeRatio * (1 - gen2TradeRatio)).toFixed(2),  borderTone: 'orange' },
    { key: 'gen2-lead',    label: '二代·线索类',   value: +(kpiValue * (1 - tradeRatio) * gen2TradeRatio).toFixed(2), borderTone: 'blue' },
    { key: 'noGen2-lead',  label: '非二代·线索类', value: +(kpiValue * (1 - tradeRatio) * (1 - gen2TradeRatio)).toFixed(2), borderTone: 'orange' },
  ],
})
const mediaMonthlyDrilldown = {
  total:    _buildDrilldown(19077.31, 0.45, 0.55),
  tt:       _buildDrilldown(12720.34, 0.50, 0.55),
  ttad:     _buildDrilldown(5380.20,  0.60, 0.60),
  ttqc:     _buildDrilldown(4120.85,  0.40, 0.50),
  ttlpc:    _buildDrilldown(3219.29,  0.108, 0.107),  // 头条-本地推：交易类 10.8% / 二代·交易类 10.7%（对齐截图）
  tx:       _buildDrilldown(2456.78,  0.35, 0.50),
  ks:       _buildDrilldown(1548.30,  0.55, 0.60),
  xhs:      _buildDrilldown(1265.60,  0.30, 0.45),
  wb:       _buildDrilldown(728.50,   0.25, 0.40),
  tiktok:   _buildDrilldown(357.79,   0.20, 0.50),
}

// 二代 / 非二代 / 其他 饼图数据
const mediaMonthlyPie = [
  { name: '二代',   value: 9451.04, color: '#2D7FF9' },
  { name: '非二代', value: 9397.20, color: '#FF9A3C' },
  { name: '其他',   value: 229.07,  color: '#FF5A5A' },
]
// 31 天每日消耗（万） — 平均 615.39
const mediaMonthlyBars = [
  { day: '07-01', value: 412.50 }, { day: '07-02', value: 528.30 }, { day: '07-03', value: 615.20 },
  { day: '07-04', value: 732.85 }, { day: '07-05', value: 458.60 }, { day: '07-06', value: 386.40 },
  { day: '07-07', value: 502.15 }, { day: '07-08', value: 648.90 }, { day: '07-09', value: 712.50 },
  { day: '07-10', value: 825.30 }, { day: '07-11', value: 612.40 }, { day: '07-12', value: 528.75 },
  { day: '07-13', value: 498.20 }, { day: '07-14', value: 686.50 }, { day: '07-15', value: 745.80 },
  { day: '07-16', value: 562.30 }, { day: '07-17', value: 628.90 }, { day: '07-18', value: 715.40 },
  { day: '07-19', value: 802.65 }, { day: '07-20', value: 548.20 }, { day: '07-21', value: 478.30 },
  { day: '07-22', value: 612.45 }, { day: '07-23', value: 695.80 }, { day: '07-24', value: 768.20 },
  { day: '07-25', value: 842.60 }, { day: '07-26', value: 538.40 }, { day: '07-27', value: 612.35 },
  { day: '07-28', value: 695.80 }, { day: '07-29', value: 728.50 }, { day: '07-30', value: 812.45 },
  { day: '07-31', value: 648.30 },
]
// === 其他周期的柱状图（按相同口径生成）===

// 日报：单日单条柱
const mediaDailyBars = [
  { day: '08-25', value: 586.42 },
]

// 周报：7 天单条柱（一周 7 天）
const mediaWeeklyBars = [
  { day: '08-19', value: 528.30 }, { day: '08-20', value: 612.45 }, { day: '08-21', value: 695.80 },
  { day: '08-22', value: 732.85 }, { day: '08-23', value: 612.40 }, { day: '08-24', value: 548.20 },
  { day: '08-25', value: 586.42 },
]

// 季报：3 个月柱（按月聚合）
const mediaQuarterlyBars = [
  { day: '07月', value: 19077.31 }, { day: '08月', value: 18756.45 }, { day: '09月', value: 19548.20 },
]

// 半年报：6 个月柱
const mediaSemiAnnualBars = [
  { day: '01月', value: 16485.30 }, { day: '02月', value: 14256.80 }, { day: '03月', value: 18965.42 },
  { day: '04月', value: 17842.65 }, { day: '05月', value: 19568.30 }, { day: '06月', value: 19077.31 },
]

// 年报：12 个月柱
const mediaYearlyBars = [
  { day: '01月', value: 16485.30 }, { day: '02月', value: 14256.80 }, { day: '03月', value: 18965.42 },
  { day: '04月', value: 17842.65 }, { day: '05月', value: 19568.30 }, { day: '06月', value: 19077.31 },
  { day: '07月', value: 21056.85 }, { day: '08月', value: 18756.45 }, { day: '09月', value: 19548.20 },
  { day: '10月', value: 20358.40 }, { day: '11月', value: 17865.32 }, { day: '12月', value: 21456.78 },
]

// 5 维度排名（每维度 8 条）
const mediaMonthlyRankings = {
  // 集团
  group: [
    { rank: 1, name: '完美交接集团',   value: 2856.42, delta: '+12.45%' },
    { rank: 2, name: '艾麦交接集团',   value: 2148.30, delta: '+8.62%'  },
    { rank: 3, name: '中粮集团',       value: 1842.50, delta: '+5.38%'  },
    { rank: 4, name: '薇光传媒集团',   value: 1528.75, delta: '+15.27%' },
    { rank: 5, name: '嘉禾电商集团',   value: 1148.30, delta: '+3.18%'  },
    { rank: 6, name: '云锐互动集团',   value: 956.40,  delta: '+2.45%'  },
    { rank: 7, name: '深圳艾斯',       value: 728.50,  delta: '−1.28%'  },
    { rank: 8, name: 'JT-比利',        value: 612.80,  delta: '+4.62%'  },
  ],
  // 销售
  sales: [
    { rank: 1, name: '刘欢',    value: 3256.85, delta: '+18.42%' },
    { rank: 2, name: '李慧彬',  value: 2865.40, delta: '+12.85%' },
    { rank: 3, name: '孟丽珊',  value: 2156.30, delta: '+8.65%'  },
    { rank: 4, name: '郑昊坤',  value: 1842.50, delta: '+6.32%'  },
    { rank: 5, name: '王炳雅',  value: 1428.65, delta: '+4.18%'  },
    { rank: 6, name: '刘洋',    value: 1128.40, delta: '+2.85%'  },
    { rank: 7, name: '陈静',    value: 856.20,  delta: '−0.85%'  },
    { rank: 8, name: '周婷',    value: 642.30,  delta: '+1.42%'  },
  ],
  // 业绩归属人
  performer: [
    { rank: 1, name: '刘欢',        value: 2856.40, delta: '+15.62%' },
    { rank: 2, name: '李慧彬',      value: 2548.30, delta: '+10.85%' },
    { rank: 3, name: '王春雷',      value: 1986.50, delta: '+8.32%'  },
    { rank: 4, name: '孟丽珊',      value: 1658.75, delta: '+6.45%'  },
    { rank: 5, name: '冯孙杰',      value: 1285.40, delta: '+4.28%'  },
    { rank: 6, name: '闫建亮',      value: 985.20,  delta: '+3.15%'  },
    { rank: 7, name: '郑昊坤',      value: 728.50,  delta: '+2.45%'  },
    { rank: 8, name: '潘建民',      value: 542.30,  delta: '−1.85%'  },
  ],
  // 运营
  operator: [
    { rank: 1, name: '李基彬',      value: 3128.65, delta: '+22.45%' },
    { rank: 2, name: '陈志伟',      value: 2658.40, delta: '+14.82%' },
    { rank: 3, name: '高丽岩',      value: 2156.30, delta: '+10.45%' },
    { rank: 4, name: '王靖雅',      value: 1748.85, delta: '+8.62%'  },
    { rank: 5, name: '张朔',        value: 1325.40, delta: '+5.85%'  },
    { rank: 6, name: '周婷',        value: 985.60,  delta: '+3.42%'  },
    { rank: 7, name: '潘建民',      value: 685.30,  delta: '+1.85%'  },
    { rank: 8, name: '王芳',        value: 458.20,  delta: '−2.15%'  },
  ],
  // 部门
  dept: [
    { rank: 1, name: 'KA销售部',    value: 8256.40, delta: '+14.85%' },
    { rank: 2, name: '存量客户部',  value: 4128.50, delta: '+8.62%'  },
    { rank: 3, name: '销售部',      value: 3148.65, delta: '+6.45%'  },
    { rank: 4, name: '媒介部',      value: 1856.30, delta: '+4.28%'  },
    { rank: 5, name: '运营部',      value: 1128.85, delta: '+2.85%'  },
    { rank: 6, name: '市场部',      value: 358.20,  delta: '+1.42%'  },
    { rank: 7, name: '财务部',      value: 142.85,  delta: '—'       },
    { rank: 8, name: '人事行政部',  value: 58.50,   delta: '—'       },
  ],
}
// 媒体消耗概览（10 张媒体平台卡，由 mediaMonthlyKpis 提供）
const mediaMonthlyTotal = 19077.31
const mediaMonthlyNonGiftTotal = 17892.45  // 非赠款消耗总和（mock 占位，总消耗的 ≈94%）

// 集团详情：三层结构 集团 → 子公司 → 广告主消耗明细
// 字段：子公司数 + 子公司名 + 子公司非赠款总消耗 + 明细行
const mediaMonthlyGroupDetails = {
  '完美交接集团': [
    {
      name: '厦门时帧智作科技有限公司',
      nonGift: 840168.27,
      rows: [
        { date: '2026-07-17', advId: '1868686742398019', advName: '时帧香氛沐浴露', platform: '头条-千川', industry: '日化', nonGift: 20771.18 },
        { date: '2026-07-27', advId: '1868686801582090', advName: '时帧-沐浴露-衍赢2', platform: '头条-千川', industry: '日化', nonGift: 182.01 },
        { date: '2026-07-26', advId: '1868686742398019', advName: '时帧-沐浴露-衍赢3-直播户', platform: '头条-千川', industry: '日化', nonGift: 614.64 },
        { date: '2026-07-08', advId: '1868686801582090', advName: '时帧香氛沐浴露2', platform: '头条-千川', industry: '日化', nonGift: 0.00 },
        { date: '2026-07-17', advId: '1868686801582090', advName: '时帧香氛沐浴露2', platform: '头条-千川', industry: '日化', nonGift: 20.79 },
        { date: '2026-07-30', advId: '1868686801582090', advName: '时帧-沐浴露-衍赢2', platform: '头条-千川', industry: '日化', nonGift: 312.58 },
        { date: '2026-07-28', advId: '1868686967342602', advName: '时帧-沐浴露-衍赢1-彬煌', platform: '头条-千川', industry: '日化', nonGift: 630.62 },
        { date: '2026-07-12', advId: '1868686801582090', advName: '时帧香氛沐浴露2', platform: '头条-千川', industry: '日化', nonGift: 159.82 },
        { date: '2026-07-13', advId: '1868686742398019', advName: '时帧香氛沐浴露', platform: '头条-千川', industry: '日化', nonGift: 41625.26 },
        { date: '2026-07-16', advId: '1868686742398019', advName: '时帧香氛沐浴露', platform: '头条-千川', industry: '日化', nonGift: 23669.05 },
        { date: '2026-07-05', advId: '1868686742398019', advName: '时帧香氛沐浴露', platform: '头条-千川', industry: '日化', nonGift: 65010.97 },
        { date: '2026-07-18', advId: '1868686742398019', advName: '时帧香氛沐浴露', platform: '头条-千川', industry: '日化', nonGift: 5712.40 },
        { date: '2026-07-31', advId: '1868686930937884', advName: '时帧-沐浴露-衍赢5-金明', platform: '头条-千川', industry: '日化', nonGift: 353.55 },
        { date: '2026-07-04', advId: '1868686801582090', advName: '时帧香氛沐浴露2', platform: '头条-千川', industry: '日化', nonGift: 37.83 },
        { date: '2026-07-19', advId: '1868686801582090', advName: '时帧香氛沐浴露2', platform: '头条-千川', industry: '日化', nonGift: 16.60 },
      ],
    },
    {
      name: '中国邮政集团有限公司江苏省靖江市分公司',
      nonGift: 789190.50,
      rows: [
        { date: '2026-07-05', advId: '1869705112234001', advName: '靖江邮政鲜花直营', platform: '腾讯', industry: '鲜花', nonGift: 125480.30 },
        { date: '2026-07-08', advId: '1869705112234001', advName: '靖江邮政鲜花直营', platform: '腾讯', industry: '鲜花', nonGift: 98420.65 },
        { date: '2026-07-15', advId: '1869705112234001', advName: '靖江邮政鲜花直营', platform: '小红书', industry: '鲜花', nonGift: 76230.45 },
        { date: '2026-07-22', advId: '1869705112234001', advName: '靖江邮政鲜花直营', platform: '快手', industry: '鲜花', nonGift: 156842.30 },
      ],
    },
    {
      name: '仙游翰曜冒商贸行（个体工商户）',
      nonGift: 787600.82,
      rows: [
        { date: '2026-07-03', advId: '1869811223456700', advName: '仙游翰曜冒木雕旗舰', platform: '抖音', industry: '工艺品', nonGift: 198420.30 },
        { date: '2026-07-11', advId: '1869811223456700', advName: '仙游翰曜冒木雕旗舰', platform: '抖音', industry: '工艺品', nonGift: 142850.65 },
        { date: '2026-07-19', advId: '1869811223456700', advName: '仙游翰曜冒木雕旗舰', platform: '头条-千川', industry: '工艺品', nonGift: 87420.45 },
        { date: '2026-07-26', advId: '1869811223456700', advName: '仙游翰曜冒木雕旗舰', platform: '快手', industry: '工艺品', nonGift: 358909.42 },
      ],
    },
    {
      name: '义乌市图勐电子商务有限公司',
      nonGift: 500824.10,
      rows: [
        { date: '2026-07-04', advId: '1869922334455600', advName: '义乌图勐饰品批发', platform: '头条-千川', industry: '饰品', nonGift: 142850.30 },
        { date: '2026-07-14', advId: '1869922334455600', advName: '义乌图勐饰品批发', platform: '快手', industry: '饰品', nonGift: 168420.45 },
        { date: '2026-07-25', advId: '1869922334455600', advName: '义乌图勐饰品批发', platform: '小红书', industry: '饰品', nonGift: 189553.35 },
      ],
    },
    {
      name: '义乌市锋怒电子商务商行（个体工商户）',
      nonGift: 470228.45,
      rows: [
        { date: '2026-07-06', advId: '1870033445566700', advName: '义乌锋怒小家电旗舰', platform: '头条-千川', industry: '家电', nonGift: 132845.20 },
        { date: '2026-07-18', advId: '1870033445566700', advName: '义乌锋怒小家电旗舰', platform: '抖音', industry: '家电', nonGift: 198420.65 },
        { date: '2026-07-27', advId: '1870033445566700', advName: '义乌锋怒小家电旗舰', platform: '快手', industry: '家电', nonGift: 138962.60 },
      ],
    },
    {
      name: '镇平县接财工艺品店（个体工商户）',
      nonGift: 464679.65,
      rows: [
        { date: '2026-07-09', advId: '1870144556677800', advName: '镇平接财玉器直营', platform: '抖音', industry: '玉器', nonGift: 186420.30 },
        { date: '2026-07-20', advId: '1870144556677800', advName: '镇平接财玉器直营', platform: '快手', industry: '玉器', nonGift: 158420.45 },
        { date: '2026-07-30', advId: '1870144556677800', advName: '镇平接财玉器直营', platform: '小红书', industry: '玉器', nonGift: 119838.90 },
      ],
    },
    {
      name: '漯河市源汇区玮静食品店（个体工商户）',
      nonGift: 455810.65,
      rows: [
        { date: '2026-07-07', advId: '1870255667788900', advName: '源汇玮静零食旗舰店', platform: '头条-千川', industry: '食品', nonGift: 168420.30 },
        { date: '2026-07-19', advId: '1870255667788900', advName: '源汇玮静零食旗舰店', platform: '抖音', industry: '食品', nonGift: 142850.65 },
        { date: '2026-07-28', advId: '1870255667788900', advName: '源汇玮静零食旗舰店', platform: '快手', industry: '食品', nonGift: 144539.70 },
      ],
    },
    {
      name: '山东坤阳供应链科技有限公司',
      nonGift: 440498.18,
      rows: [
        { date: '2026-07-08', advId: '1870366778899000', advName: '山东坤阳物流广告', platform: '腾讯', industry: '物流', nonGift: 158420.30 },
        { date: '2026-07-17', advId: '1870366778899000', advName: '山东坤阳物流广告', platform: '头条-千川', industry: '物流', nonGift: 142850.65 },
        { date: '2026-07-26', advId: '1870366778899000', advName: '山东坤阳物流广告', platform: '小红书', industry: '物流', nonGift: 139227.23 },
      ],
    },
    {
      name: '江苏贝朵阳塑业有限公司',
      nonGift: 424216.73,
      rows: [
        { date: '2026-07-10', advId: '1870477889900100', advName: '江苏贝朵阳塑业直营', platform: '头条-千川', industry: '制造', nonGift: 132845.30 },
        { date: '2026-07-21', advId: '1870477889900100', advName: '江苏贝朵阳塑业直营', platform: '抖音', industry: '制造', nonGift: 156842.45 },
        { date: '2026-07-31', advId: '1870477889900100', advName: '江苏贝朵阳塑业直营', platform: '快手', industry: '制造', nonGift: 134528.98 },
      ],
    },
  ],
  '艾麦交接集团': [
    {
      name: '艾麦交接（北京）信息科技有限公司',
      nonGift: 1248560.30,
      rows: [
        { date: '2026-07-08', advId: '1882201456789012', advName: '艾麦直营旗舰', platform: '腾讯', industry: '科技', nonGift: 4258.30 },
        { date: '2026-07-14', advId: '1882201456789012', advName: '艾麦直营旗舰', platform: '腾讯', industry: '科技', nonGift: 3128.45 },
        { date: '2026-07-21', advId: '1882201456789012', advName: '艾麦直营旗舰', platform: '快手', industry: '科技', nonGift: 5648.20 },
        { date: '2026-07-25', advId: '1882201456789012', advName: '艾麦直营旗舰', platform: '快手', industry: '科技', nonGift: 1248.65 },
      ],
    },
    {
      name: '艾麦交接（深圳）数字传媒有限公司',
      nonGift: 899720.85,
      rows: [
        { date: '2026-07-09', advId: '1882201456789013', advName: '艾麦数字传媒', platform: '抖音', industry: '科技', nonGift: 198420.30 },
        { date: '2026-07-18', advId: '1882201456789013', advName: '艾麦数字传媒', platform: '快手', industry: '科技', nonGift: 268420.55 },
        { date: '2026-07-29', advId: '1882201456789013', advName: '艾麦数字传媒', platform: '小红书', industry: '科技', nonGift: 432880.00 },
      ],
    },
  ],
  '中粮集团': [
    {
      name: '中粮我买网（北京）商贸有限公司',
      nonGift: 1142850.45,
      rows: [
        { date: '2026-07-03', advId: '1893302567890123', advName: '中粮我买网主店', platform: '小红书', industry: '食品', nonGift: 1842.50 },
        { date: '2026-07-10', advId: '1893302567890123', advName: '中粮我买网主店', platform: '小红书', industry: '食品', nonGift: 928.45 },
        { date: '2026-07-19', advId: '1893302567890123', advName: '中粮我买网主店', platform: '微博', industry: '食品', nonGift: 3142.85 },
      ],
    },
    {
      name: '中粮食品（深圳）有限公司',
      nonGift: 699650.05,
      rows: [
        { date: '2026-07-04', advId: '1893302567890124', advName: '中粮食品深圳', platform: '抖音', industry: '食品', nonGift: 285420.30 },
        { date: '2026-07-15', advId: '1893302567890124', advName: '中粮食品深圳', platform: '快手', industry: '食品', nonGift: 414229.75 },
      ],
    },
  ],
  '薇光传媒集团': [
    {
      name: '薇光文化传媒（北京）有限公司',
      nonGift: 928540.30,
      rows: [
        { date: '2026-07-02', advId: '1904403678901234', advName: '薇光直营门店', platform: '抖音', industry: '传媒', nonGift: 4285.30 },
        { date: '2026-07-09', advId: '1904403678901234', advName: '薇光直营门店', platform: '抖音', industry: '传媒', nonGift: 3128.45 },
      ],
    },
    {
      name: '薇光互娱文化（上海）有限公司',
      nonGift: 600210.45,
      rows: [
        { date: '2026-07-12', advId: '1904403678901235', advName: '薇光互娱上海', platform: '快手', industry: '传媒', nonGift: 285420.30 },
        { date: '2026-07-23', advId: '1904403678901235', advName: '薇光互娱上海', platform: '小红书', industry: '传媒', nonGift: 314790.15 },
      ],
    },
  ],
}
// 销售维度的明细：销售 → 客户 → 广告主消耗明细
// PC 截图字段：日期 / 广告主ID / 广告主名称 / 媒体平台 / 客户名称 / 行业 / 非赠款消耗金额
const mediaMonthlySalesDetails = {
  '刘欢': [
    {
      name: '深圳雅涅盛普通专科门诊部',
      nonGift: 7040192.10,
      rows: [
        { date: '2026-07-04', advId: '1848647437606915', advName: '亦佳亦棉品生活馆2', platform: '头条-千川', customer: '龙山呗哎好百货店（个体工商户）', industry: '家居建材', nonGift: 0.00 },
        { date: '2026-07-15', advId: '1861350283911800', advName: '婚姻_HZY_旗下_11', platform: '头条-本地推', customer: '高新枝木产业开发区晓明卖店（个体工商户）', industry: '丽人', nonGift: 130.63 },
        { date: '2026-07-23', advId: '1861349905741888', advName: 'zxx蝉润跌下', platform: '头条-本地推', customer: '高新枝木产业开发区晓明卖店（个体工商户）', industry: '丽人', nonGift: 285.69 },
        { date: '2026-07-26', advId: '1861349905741888', advName: 'zxx蝉润跌下', platform: '头条-本地推', customer: '高新枝木产业开发区晓明卖店（个体工商户）', industry: '丽人', nonGift: 1.38 },
        { date: '2026-07-09', advId: '1861350283911800', advName: '婚姻_HZY_旗下_11', platform: '头条-本地推', customer: '高新枝木产业开发区晓明卖店（个体工商户）', industry: '丽人', nonGift: 6.55 },
        { date: '2026-07-01', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 6582.41 },
        { date: '2026-07-21', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 6146.85 },
        { date: '2026-07-23', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 6338.55 },
        { date: '2026-07-13', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 5868.71 },
        { date: '2026-07-10', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 8018.63 },
        { date: '2026-07-12', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 12678.39 },
        { date: '2026-07-08', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 6992.38 },
        { date: '2026-07-20', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 8166.93 },
        { date: '2026-07-27', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 1003.39 },
        { date: '2026-07-19', advId: '1863246823318667', advName: '运帆瓶遇铺-在用①', platform: '头条-千川', customer: '高新投运帆电子商务中心（个体工商户）', industry: '家居建材', nonGift: 2932.33 },
      ],
    },
    {
      name: '内蒙古创联科技有限公司',
      nonGift: 3181542.47,
      rows: [
        { date: '2026-07-02', advId: '1871144556677800', advName: '内蒙古创联直营旗舰', platform: '头条-千川', customer: '内蒙古创联科技有限公司', industry: '科技', nonGift: 156420.30 },
        { date: '2026-07-11', advId: '1871144556677800', advName: '内蒙古创联直营旗舰', platform: '抖音', customer: '内蒙古创联科技有限公司', industry: '科技', nonGift: 198420.65 },
        { date: '2026-07-22', advId: '1871144556677800', advName: '内蒙古创联直营旗舰', platform: '快手', customer: '内蒙古创联科技有限公司', industry: '科技', nonGift: 168420.45 },
      ],
    },
    {
      name: '荆门市东宝区蓝锃百货店（个体工商户）',
      nonGift: 1522225.32,
      rows: [
        { date: '2026-07-05', advId: '1871255667788900', advName: '荆门蓝锃百货直营', platform: '头条-千川', customer: '荆门市东宝区蓝锃百货店（个体工商户）', industry: '家居', nonGift: 84520.30 },
        { date: '2026-07-16', advId: '1871255667788900', advName: '荆门蓝锃百货直营', platform: '抖音', customer: '荆门市东宝区蓝锃百货店（个体工商户）', industry: '家居', nonGift: 56842.45 },
        { date: '2026-07-28', advId: '1871255667788900', advName: '荆门蓝锃百货直营', platform: '快手', customer: '荆门市东宝区蓝锃百货店（个体工商户）', industry: '家居', nonGift: 124580.20 },
      ],
    },
    {
      name: '漯河市源汇区膨腾食品铺（个体工商户）',
      nonGift: 1178327.11,
      rows: [
        { date: '2026-07-08', advId: '1871366778899000', advName: '源汇膨腾食品旗舰', platform: '小红书', customer: '漯河市源汇区膨腾食品铺（个体工商户）', industry: '食品', nonGift: 98542.30 },
        { date: '2026-07-19', advId: '1871366778899000', advName: '源汇膨腾食品旗舰', platform: '微博', customer: '漯河市源汇区膨腾食品铺（个体工商户）', industry: '食品', nonGift: 142850.65 },
        { date: '2026-07-30', advId: '1871366778899000', advName: '源汇膨腾食品旗舰', platform: '头条-千川', customer: '漯河市源汇区膨腾食品铺（个体工商户）', industry: '食品', nonGift: 168420.45 },
      ],
    },
    {
      name: '湖南毅火生物科技有限公司',
      nonGift: 1182914.74,
      rows: [
        { date: '2026-07-04', advId: '1871477889900100', advName: '湖南毅火生物直营', platform: '腾讯', customer: '湖南毅火生物科技有限公司', industry: '医药', nonGift: 198420.30 },
        { date: '2026-07-17', advId: '1871477889900100', advName: '湖南毅火生物直营', platform: '小红书', customer: '湖南毅火生物科技有限公司', industry: '医药', nonGift: 142850.65 },
        { date: '2026-07-28', advId: '1871477889900100', advName: '湖南毅火生物直营', platform: '头条-千川', customer: '湖南毅火生物科技有限公司', industry: '医药', nonGift: 168420.45 },
      ],
    },
    {
      name: '日腾（温州）商贸有限公司',
      nonGift: 1020898.01,
      rows: [
        { date: '2026-07-06', advId: '1871588990011100', advName: '日腾商贸直营旗舰', platform: '抖音', customer: '日腾（温州）商贸有限公司', industry: '服饰', nonGift: 142850.30 },
        { date: '2026-07-18', advId: '1871588990011100', advName: '日腾商贸直营旗舰', platform: '快手', customer: '日腾（温州）商贸有限公司', industry: '服饰', nonGift: 198420.45 },
        { date: '2026-07-29', advId: '1871588990011100', advName: '日腾商贸直营旗舰', platform: '小红书', customer: '日腾（温州）商贸有限公司', industry: '服饰', nonGift: 165820.30 },
      ],
    },
    {
      name: '北京中诺第二口腔医院有限公司',
      nonGift: 895901.46,
      rows: [
        { date: '2026-07-07', advId: '1871699001122200', advName: '北京中诺口腔直营', platform: '头条-千川', customer: '北京中诺第二口腔医院有限公司', industry: '医疗', nonGift: 198420.30 },
        { date: '2026-07-20', advId: '1871699001122200', advName: '北京中诺口腔直营', platform: '抖音', customer: '北京中诺第二口腔医院有限公司', industry: '医疗', nonGift: 142850.65 },
        { date: '2026-07-31', advId: '1871699001122200', advName: '北京中诺口腔直营', platform: '快手', customer: '北京中诺第二口腔医院有限公司', industry: '医疗', nonGift: 84520.45 },
      ],
    },
    {
      name: '北京翰遵盛护发有限公司',
      nonGift: 616949.52,
      rows: [
        { date: '2026-07-03', advId: '1871700112233300', advName: '北京翰遵盛护发直营', platform: '小红书', customer: '北京翰遵盛护发有限公司', industry: '美容', nonGift: 142850.30 },
        { date: '2026-07-14', advId: '1871700112233300', advName: '北京翰遵盛护发直营', platform: '头条-千川', customer: '北京翰遵盛护发有限公司', industry: '美容', nonGift: 98542.45 },
        { date: '2026-07-25', advId: '1871700112233300', advName: '北京翰遵盛护发直营', platform: '微博', customer: '北京翰遵盛护发有限公司', industry: '美容', nonGift: 65842.20 },
      ],
    },
    {
      name: '株洲市渌口区宗子忠电子商务服务部（个体工商户）',
      nonGift: 602361.01,
      rows: [
        { date: '2026-07-09', advId: '1871811223344400', advName: '株洲宗子忠电商直营', platform: '腾讯', customer: '株洲市渌口区宗子忠电子商务服务部（个体工商户）', industry: '服饰', nonGift: 84520.30 },
        { date: '2026-07-21', advId: '1871811223344400', advName: '株洲宗子忠电商直营', platform: '抖音', customer: '株洲市渌口区宗子忠电子商务服务部（个体工商户）', industry: '服饰', nonGift: 142850.65 },
        { date: '2026-07-30', advId: '1871811223344400', advName: '株洲宗子忠电商直营', platform: '快手', customer: '株洲市渌口区宗子忠电子商务服务部（个体工商户）', industry: '服饰', nonGift: 98542.45 },
      ],
    },
    {
      name: '温州嘉视明光学有限公司',
      nonGift: 596632.00,
      rows: [
        { date: '2026-07-10', advId: '1871922334455600', advName: '温州嘉视明光学直营', platform: '小红书', customer: '温州嘉视明光学有限公司', industry: '医疗', nonGift: 98542.30 },
        { date: '2026-07-22', advId: '1871922334455600', advName: '温州嘉视明光学直营', platform: '头条-千川', customer: '温州嘉视明光学有限公司', industry: '医疗', nonGift: 142850.65 },
        { date: '2026-07-31', advId: '1871922334455600', advName: '温州嘉视明光学直营', platform: '快手', customer: '温州嘉视明光学有限公司', industry: '医疗', nonGift: 168420.45 },
      ],
    },
  ],
  '李慧彬': [
    {
      name: '贵州黔香酒业有限公司',
      nonGift: 2856420.30,
      rows: [
        { date: '2026-07-04', advId: '1882201456000001', advName: '贵州黔香旗舰直营', platform: '头条-千川', customer: '贵州黔香酒业有限公司', industry: '食品', nonGift: 425830.30 },
        { date: '2026-07-15', advId: '1882201456000001', advName: '贵州黔香旗舰直营', platform: '抖音', customer: '贵州黔香酒业有限公司', industry: '食品', nonGift: 568420.45 },
        { date: '2026-07-26', advId: '1882201456000001', advName: '贵州黔香旗舰直营', platform: '小红书', customer: '贵州黔香酒业有限公司', industry: '食品', nonGift: 342850.65 },
      ],
    },
    {
      name: '佛山锐驰运动用品有限公司',
      nonGift: 1856420.50,
      rows: [
        { date: '2026-07-08', advId: '1882201456000002', advName: '佛山锐驰运动旗舰', platform: '头条-千川', customer: '佛山锐驰运动用品有限公司', industry: '服饰', nonGift: 285420.30 },
        { date: '2026-07-19', advId: '1882201456000002', advName: '佛山锐驰运动旗舰', platform: '快手', customer: '佛山锐驰运动用品有限公司', industry: '服饰', nonGift: 168420.45 },
        { date: '2026-07-30', advId: '1882201456000002', advName: '佛山锐驰运动旗舰', platform: '抖音', customer: '佛山锐驰运动用品有限公司', industry: '服饰', nonGift: 142850.65 },
      ],
    },
  ],
  '孟丽珊': [
    {
      name: '南京聚尚电商有限公司',
      nonGift: 2156300.42,
      rows: [
        { date: '2026-07-03', advId: '1893302567000001', advName: '南京聚尚电商旗舰', platform: '小红书', customer: '南京聚尚电商有限公司', industry: '服饰', nonGift: 198420.30 },
        { date: '2026-07-14', advId: '1893302567000001', advName: '南京聚尚电商旗舰', platform: '抖音', customer: '南京聚尚电商有限公司', industry: '服饰', nonGift: 142850.65 },
        { date: '2026-07-25', advId: '1893302567000001', advName: '南京聚尚电商旗舰', platform: '头条-千川', customer: '南京聚尚电商有限公司', industry: '服饰', nonGift: 84520.45 },
      ],
    },
  ],
  '郑昊坤': [
    {
      name: '济南微巢科技有限公司',
      nonGift: 1842500.32,
      rows: [
        { date: '2026-07-05', advId: '1904403678000001', advName: '济南微巢科技旗舰', platform: '头条-千川', customer: '济南微巢科技有限公司', industry: '科技', nonGift: 198420.30 },
        { date: '2026-07-16', advId: '1904403678000001', advName: '济南微巢科技旗舰', platform: '抖音', customer: '济南微巢科技有限公司', industry: '科技', nonGift: 142850.65 },
        { date: '2026-07-27', advId: '1904403678000001', advName: '济南微巢科技旗舰', platform: '快手', customer: '济南微巢科技有限公司', industry: '科技', nonGift: 168420.45 },
      ],
    },
    {
      name: '合肥锐捷智能装备有限公司',
      nonGift: 1128560.45,
      rows: [
        { date: '2026-07-09', advId: '1904403678000002', advName: '合肥锐捷装备直营', platform: '腾讯', customer: '合肥锐捷智能装备有限公司', industry: '工业', nonGift: 84520.30 },
        { date: '2026-07-20', advId: '1904403678000002', advName: '合肥锐捷装备直营', platform: '头条-千川', customer: '合肥锐捷智能装备有限公司', industry: '工业', nonGift: 142850.65 },
        { date: '2026-07-31', advId: '1904403678000002', advName: '合肥锐捷装备直营', platform: '小红书', customer: '合肥锐捷智能装备有限公司', industry: '工业', nonGift: 98542.45 },
      ],
    },
  ],
}

// 业绩归属人/运营维度的明细：人 → 客户 → 广告主消耗明细
// 复用销售维度的列结构（日期/广告主ID/广告主名称/媒体平台/客户名称/行业/非赠款消耗金额）
// 参数 ownerNames: 该维度下排名卡里所有"人名"
const _buildPersonDetails = (ownerNames, customerPool) => {
  const out = {}
  ownerNames.forEach((person, idx) => {
    // 每个业绩归属人/运营 分到 4 个客户（轮询分配）
    const custs = []
    for (let i = 0; i < 4; i++) {
      custs.push(customerPool[(idx * 4 + i) % customerPool.length])
    }
    out[person] = custs.map((c, i) => ({
      name: c.name,
      nonGift: c.nonGift,
      rows: [
        { date: '2026-07-04', advId: `18${(idx + 1).toString().padStart(3, '0')}${(i + 1).toString().padStart(3, '0')}001`, advName: `${c.name}旗舰直营`, platform: '头条-千川', customer: c.name, industry: '服饰', nonGift: Math.round(c.nonGift * 0.35) },
        { date: '2026-07-15', advId: `18${(idx + 1).toString().padStart(3, '0')}${(i + 1).toString().padStart(3, '0')}002`, advName: `${c.name}旗舰直营`, platform: '抖音',     customer: c.name, industry: '服饰', nonGift: Math.round(c.nonGift * 0.40) },
        { date: '2026-07-26', advId: `18${(idx + 1).toString().padStart(3, '0')}${(i + 1).toString().padStart(3, '0')}003`, advName: `${c.name}旗舰直营`, platform: '小红书',   customer: c.name, industry: '服饰', nonGift: Math.round(c.nonGift * 0.25) },
      ],
    }))
  })
  return out
}
const performerOwnerNames = ['刘欢', '李慧彬', '王春雷', '孟丽珊', '冯孙杰', '闫建亮', '郑昊坤', '潘建民']
const performerCustomerPool = [
  { name: '青岛肤润化妆品旗舰店',     nonGift: 2338218.08 },
  { name: '泰安市诺泰电子科技有限公司', nonGift: 404344.23 },
  { name: '南宁健师仕心理咨询有限公司', nonGift: 283062.84 },
  { name: '吉林省朗大心理咨询有限公司', nonGift: 214859.76 },
  { name: '哈尔滨世纪北一心理咨询有限公司', nonGift: 171840.71 },
  { name: '上海携程国际旅行社有限公司厦门分公司', nonGift: 154528.82 },
  { name: '北京豆神之明今教育科技有限公司', nonGift: 143131.36 },
  { name: '深圳市壳缘帝珠宝电子商务科技有限公司', nonGift: 121611.55 },
  { name: '常州名师堂心理咨询有限公司', nonGift: 112838.66 },
  { name: '内蒙古朗大心理咨询有限公司', nonGift: 104494.43 },
]
const mediaMonthlyPerformerDetails = _buildPersonDetails(performerOwnerNames, performerCustomerPool)

const operatorOwnerNames = ['李基彬', '陈志伟', '高丽岩', '王靖雅', '张朔', '周婷', '潘建民', '王芳']
const operatorCustomerPool = [
  { name: '上海携程国际旅行社有限公司厦门分公司', nonGift: 154528.82 },
  { name: '宁波龙腾户外用品有限公司',     nonGift: 138420.30 },
  { name: '杭州京西智能家居有限公司',     nonGift: 128456.45 },
  { name: '深圳市芯锐半导体有限公司',     nonGift: 116852.60 },
  { name: '苏州昆泰精密机械有限公司',     nonGift: 98542.30 },
  { name: '武汉鼎瑞广告有限公司',         nonGift: 85642.45 },
  { name: '成都云熙互娱文化有限公司',     nonGift: 72458.20 },
  { name: '西安铭瑞教育科技有限公司',     nonGift: 61254.85 },
]
const mediaMonthlyOperatorDetails = _buildPersonDetails(operatorOwnerNames, operatorCustomerPool)

// 集团维度的明细（其他维度点击显示空白态）
const mediaMonthlyDimensionDetails = {
  group: mediaMonthlyGroupDetails,
  sales: mediaMonthlySalesDetails,
  performer: mediaMonthlyPerformerDetails,
  operator: mediaMonthlyOperatorDetails,
  dept: {},
}

const mediaMonthlyReport = {
  total: mediaMonthlyTotal,
  nonGiftTotal: mediaMonthlyNonGiftTotal,
  kpis: mediaMonthlyKpis,           // 顶部 媒体消耗概览（10 张媒体平台卡）
  rankings: mediaMonthlyRankings,   // 排名列表（5 维度 × 8 卡片）
  details: mediaMonthlyDimensionDetails,
  groups: mediaMonthlyGroups,       // 集团选项
  pie: mediaMonthlyPie,
  bars: mediaMonthlyBars,
  drilldown: mediaMonthlyDrilldown,// 媒体消耗概览卡的下钻数据（核心指标 + 二代/非二代·交易/线索拆分）
}

// 6 种周期统一共享 kpis / rankings / details / groups / pie / drilldown
// 仅 bars 按周期粒度区分（日/周/月/季/半年/年）
const _buildMediaReport = (bars) => ({
  total: mediaMonthlyTotal,
  nonGiftTotal: mediaMonthlyNonGiftTotal,
  kpis: mediaMonthlyKpis,
  rankings: mediaMonthlyRankings,
  details: mediaMonthlyDimensionDetails,
  groups: mediaMonthlyGroups,
  pie: mediaMonthlyPie,
  bars,
  drilldown: mediaMonthlyDrilldown,
})
const mediaReportByType = {
  day:      _buildMediaReport(mediaDailyBars),
  week:     _buildMediaReport(mediaWeeklyBars),
  month:    _buildMediaReport(mediaMonthlyBars),
  quarter:  _buildMediaReport(mediaQuarterlyBars),
  halfYear: _buildMediaReport(mediaSemiAnnualBars),
  year:     _buildMediaReport(mediaYearlyBars),
}

// === 审批中心 ===
const APPROVERS = ['王春雷', '闫建亮', '冯孙杰', '李娜', '张磊', '王芳', '刘洋', '陈静']
const APPROVAL_TYPES = ['直播政策', '项目', '合同审批', '回款审批', '退款审批', '开户申请', '媒体备款']
const APPROVAL_STATUS = ['审批中', '通过', '拒绝', '撤销', '驳回', '无需处理']
const APPROVAL_OPINION = ['同意', '同意，请财务尽快处理', '请补充材料', '驳回：金额超出预算', '同意通过', '——']
const APPROVAL_BIZ_NAMES = [
  '示例客户1 直播政策审批',
  '某电商品牌 本地推项目',
  '美妆品牌-小红书 Q3 回款审批',
  '凯斯荣谷 本地推',
  '某新客户 巨量引擎开户',
  '直播带货-美妆专场 政策申请',
  '某快消品牌 千川代投年框',
  '本地推-餐饮 投放申请',
  '某教育品牌 暑期投放方案',
  '直播带货-服饰专场 政策申请',
  '巨量引擎 Q3 备款申请',
  '某电商品牌-小红书 退款',
  '直播带货-食品专场 政策申请',
  '某医美品牌 巨量开户',
  '某汽车品牌 腾讯广告投放',
]
const APPROVAL_APPLICANTS = ['闫建亮', '王春雷', '冯孙杰', '李娜', '张磊', '王芳', '刘洋']

const approvals = (() => {
  const list = []
  for (let i = 0; i < 18; i++) {
    const type = APPROVAL_TYPES[i % APPROVAL_TYPES.length]
    const status = APPROVAL_STATUS[i % APPROVAL_STATUS.length]
    const level = (i % 3) + 1
    const bizName = APPROVAL_BIZ_NAMES[i % APPROVAL_BIZ_NAMES.length]
    const applicant = APPROVAL_APPLICANTS[i % APPROVAL_APPLICANTS.length]
    const approver = APPROVERS[i % APPROVERS.length]
    const day = 14 + (i % 11)
    const hour = 8 + (i * 3) % 12
    const minute = (i * 7) % 60
    const second = (i * 11) % 60
    const createTime = `2026-07-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    const updateTime = `2026-07-${String(day).padStart(2, '0')} ${String(hour + 1).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    const opinion = (status === '审批中' || status === '无需处理') ? '——' : APPROVAL_OPINION[i % APPROVAL_OPINION.length]
    list.push({
      nodeId: 2965 + i,
      level,
      bizName,
      type,
      applicant,
      actualApprover: status === '审批中' ? approver : '——',
      approver,
      status,
      opinion,
      createTime,
      updateTime,
    })
  }
  return list
})()

export const approvalsData = approvals

const approvalFlows = [
  { id: 'AF001', name: '合同审批流', steps: '申请人 → 主管 → 财务 → 总经办', enabled: true },
  { id: 'AF002', name: '回款审批流', steps: '申请人 → 财务 → 总经办', enabled: true },
  { id: 'AF003', name: '退款审批流', steps: '申请人 → 主管 → 财务 → 总经办', enabled: true },
  { id: 'AF004', name: '媒体备款审批流', steps: '申请人 → 财务 → 总经办', enabled: true },
]

// === 人事/行政/风控 占位数据 ===
const employees = [
  { id: 'E001', name: '冯孙杰', dept: '业务一部', position: '高级销售', phone: '13900000001', status: '在职' },
  { id: 'E002', name: '张三', dept: '业务二部', position: '销售', phone: '13900000002', status: '在职' },
  { id: 'E003', name: '李四', dept: '业务二部', position: '销售', phone: '13900000003', status: '在职' },
  { id: 'E004', name: '王芳', dept: '财务部', position: '财务经理', phone: '13900000004', status: '在职' },
  { id: 'E005', name: '张磊', dept: '运营部', position: '运营主管', phone: '13900000005', status: '在职' },
]

const adminItems = [
  { id: 'A001', type: '办公用品', name: 'A4 打印纸', applicant: '行政部', amount: '1200', date: '2026-08-15', status: '已审批' },
  { id: 'A002', type: '差旅', name: '上海出差', applicant: '冯孙杰', amount: '3500', date: '2026-08-18', status: '已审批' },
]

const riskItems = [
  { id: 'R001', type: '客户风险', name: '本地推-餐饮 投放异常', level: '中', discoverer: '系统', date: '2026-08-23', status: '处理中' },
  { id: 'R002', type: '账户风险', name: '美妆品牌-聚光账户冻结', level: '高', discoverer: '运营', date: '2026-08-20', status: '已处理' },
]

// ============ 颜色映射 ============
const tagColor = {
  // 通用状态
  '已成交': 'green', '已回款': 'green', '已通过': 'green', '已配置': 'green', '已开具': 'green', '已审批': 'green',
  '已审核': 'green', '已绑定': 'green', '已备款': 'green', '已结算': 'green', '已采购': 'green', '已完成': 'green',
  '正常': 'green', '在职': 'green', '已处理': 'green', '已生效': 'green', '生效中': 'green', '健康': 'green', '稳定': 'green',
  '执行中': 'blue', '已启动': 'blue', '进行中': 'blue', '审核中': 'blue', '审批中': 'blue', '待审批': 'blue',
  '跟进中': 'orange', '初步沟通': 'orange', '待启动': 'orange', '待提交': 'orange', '待审核': 'orange',
  '待回款': 'orange', '待开具': 'orange', '待结算': 'orange', '待生效': 'orange',
  '风险': 'red', '异常': 'red', '冻结': 'red', '紧急': 'red', '高': 'red',
  '一般': 'orange', '中': 'orange', '下降': 'red',
  '未成交': 'gray', '低': 'gray',
  // 广告主开户状态
  '开户中': 'blue', '完成': 'green', '撤销': 'gray',
  // 任务状态
  '处理中': 'orange', '已完成': 'green', '已失败': 'red',
  // 审批通用
  '审批通过': 'green', '已驳回': 'red', '已撤销': 'gray',
}

// ============ 首页用的辅助数据 ============
export const dashboardKpi = [
  { id: 'a', name: '今日业绩', value: '¥ 128k' },
  { id: 'b', name: '本月回款', value: '¥ 258w' },
  { id: 'c', name: '活跃客户', value: '48' },
  { id: 'd', name: '待办审批', value: '5' },
]

export const quickActions = [
  { id: 1, name: '新建拜访', color: 'blue' },
  { id: 2, name: '新建跟进', color: 'green' },
  { id: 3, name: '新建合同', color: 'orange' },
  { id: 4, name: '扫描名片', color: 'purple' },
]

export const salesFunnel = [
  { stage: '线索', value: 120 },
  { stage: '商机', value: 86 },
  { stage: '报价', value: 52 },
  { stage: '合同', value: 32 },
  { stage: '回款', value: 22 },
]

export const todos = [
  { id: 1, label: '待开户需求', count: 3, target: '/m/1563' },
  { id: 2, label: '服务商充值(审批中)', count: 5, target: '/m/2278' },
  { id: 3, label: '退款申请(审批中)', count: 2, target: '/m/2278' },
  { id: 4, label: '销售政策(待审批)', count: 4, target: '/m/2278' },
  { id: 5, label: '变更政策(待审批)', count: 1, target: '/m/2278' },
  { id: 6, label: '项目(待审批)', count: 7, target: '/m/2278' },
  { id: 7, label: '结算单(待审批)', count: 6, target: '/m/2278' },
]

// ============ 工单（PC §工单记录 / 工作台 / 我的-工单）============
const workOrders = [
  { id: 'WT202608250003', type: '业务问题', system: '人事行政OA系统', dept: '人事行政部', companyCode: 'YGSD', status: '处理中', desc: '业务流程、合同、财务、数据问题', attachments: ['客户消耗报表_20260727-20260727_23850172.xlsx'], submitter: '冯孙杰', createdAt: '2026-08-25 10:51:05', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608250002', type: '系统问题', system: '人事行政OA系统', dept: '技术部', companyCode: 'YGSD', status: '处理中', desc: '系统异常、登录故障、功能不可用', attachments: ['BpSuUPwuZP49JSGF7XXmV', 'TVeBCuz5KJdIFwHKrVKs.xlsx', 'addrole.png'], submitter: '李基彬', createdAt: '2026-08-25 10:30:11', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608250001', type: '系统问题', system: 'CRM系统', dept: '技术部', companyCode: 'YGSD', status: '已关闭', desc: 'etrew', attachments: [], submitter: '李基彬', createdAt: '2026-08-25 10:28:45', handler: '王春雷', reply: '重复', closeReason: '关闭', closedAt: '2026-08-25 10:30:47' },
  { id: 'WT202608240031', type: '业务问题', system: 'CRM系统', dept: '技术部', companyCode: 'YGSD', status: '处理中', desc: '21312312312', attachments: [], submitter: '王春雷', createdAt: '2026-08-24 18:04:14', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240030', type: '业务问题', system: 'CRM系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '[verify] 字符串数组', attachments: [], submitter: '陈志伟', createdAt: '2026-08-24 18:03:16', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240029', type: '业务问题', system: 'CRM系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '[verify] 对象数组', attachments: ['客户消耗报表_20260727-20260727_23850172 (1).xlsx', 'b.png'], submitter: '陈志伟', createdAt: '2026-08-24 18:03:16', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240028', type: '业务问题', system: 'CRM系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '[verify] 字符串数组', attachments: [], submitter: '高丽岩', createdAt: '2026-08-24 18:02:36', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240027', type: '业务问题', system: 'CRM系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '[verify] 对象数组', attachments: ['客户消耗报表_20260727-20260727_23850172 (1).xlsx', 'b.png'], submitter: '高丽岩', createdAt: '2026-08-24 18:02:36', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240026', type: '业务问题', system: 'CRM系统', dept: '媒介部', companyCode: 'YGSD', status: '处理中', desc: '123123', attachments: [], submitter: '刘欢', createdAt: '2026-08-24 17:57:49', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240025', type: '业务问题', system: 'CRM系统', dept: '人事行政部', companyCode: 'YGSD', status: '处理中', desc: '请详细描述您遇到的问题，1-2000 字符', attachments: [], submitter: '刘欢', createdAt: '2026-08-24 17:56:04', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240024', type: '系统问题', system: 'CRM系统', dept: '技术部', companyCode: 'YGSD', status: '已完成', desc: '测试工单213123', attachments: [], submitter: '刘欢', createdAt: '2026-08-24 17:21:16', handler: '王春雷', reply: '测试完成工单', closeReason: '完成', closedAt: '2026-08-24 17:27:39' },
  { id: 'WT202608240023', type: '业务问题', system: '人事行政OA系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '媒体平台账户余额对不上', attachments: [], submitter: '潘建民', createdAt: '2026-08-24 17:16:31', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240022', type: '系统问题', system: 'CRM系统', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: 'CRM 退款审核通过后未生成 ap_payapply', attachments: [], submitter: '潘建民', createdAt: '2026-08-24 17:16:31', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
  { id: 'WT202608240021', type: '系统问题', system: '央广控制台', dept: '成都分公司', companyCode: 'YGSD', status: '处理中', desc: '考勤系统打卡记录丢失', attachments: [], submitter: '潘建民', createdAt: '2026-08-24 17:16:31', handler: '未分配', reply: '—', closeReason: '—', closedAt: '—' },
]
export const workOrdersData = workOrders

// ============ 首页核心数据（截图看板适配）============
// 核心客户数据 5 列 KPI
export const coreKpi = [
  { id: 'consumption', label: '消耗(元)', value: 5511152.88, formatted: '5,511,152.88', trend: 9.17, up: true },
  { id: 'advertisers', label: '广告主客户数', value: 9387, formatted: '9,387', trend: 5.2, up: true },
  { id: 'activeAdv', label: '有消耗客户数', value: 1046, formatted: '1,046', trend: 3.1, up: true },
  { id: 'accounts', label: '账户数', value: 297998, formatted: '297,998', trend: 1.8, up: true },
  { id: 'activeAcc', label: '有消耗账户数', value: 2776, formatted: '2,776', trend: 0.9, up: true },
]

// 媒体平台 + 7 日消耗（头条总默认）
const ttDaily = [
  { date: '08-17', value: 4250000 },
  { date: '08-18', value: 4880000 },
  { date: '08-19', value: 4520000 },
  { date: '08-20', value: 5210000 },
  { date: '08-21', value: 4860000 },
  { date: '08-22', value: 5120000 },
  { date: '08-23', value: 5055606 },
]
const buildSeries = (ratio) => ttDaily.map(d => ({ date: d.date, value: Math.round(d.value * ratio) }))

export const platforms = [
  { id: 'all',     label: '头条总',     value: 33845606.83, formatted: '33,845,606.83', trend: 2.50, up: true,  series: ttDaily },
  { id: 'ttad',    label: '头条-AD',    value: 12450000,    formatted: '12,450,000',    trend: 1.20, up: true,  series: buildSeries(0.36) },
  { id: 'ttqc',    label: '头条-千川',  value: 9800000,     formatted: '9,800,000',     trend: 4.30, up: true,  series: buildSeries(0.29) },
  { id: 'ttlpc',   label: '头条-本地推',value: 6200000,     formatted: '6,200,000',     trend: -1.20,up: false, series: buildSeries(0.18) },
  { id: 'tx',      label: '腾讯',       value: 8600000,     formatted: '8,600,000',     trend: 0.80, up: true,  series: buildSeries(0.25) },
  { id: 'ks',      label: '快手',       value: 5400000,     formatted: '5,400,000',     trend: 3.20, up: true,  series: buildSeries(0.16) },
  { id: 'xhs',     label: '小红书',     value: 4200000,     formatted: '4,200,000',     trend: 6.50, up: true,  series: buildSeries(0.12) },
  { id: 'wb',      label: '微博',       value: 3100000,     formatted: '3,100,000',     trend: -2.10,up: false, series: buildSeries(0.09) },
  { id: 'tk',      label: 'TikToK',     value: 2800000,     formatted: '2,800,000',     trend: 8.40, up: true,  series: buildSeries(0.08) },
  { id: 'meta',    label: 'Meta',       value: 1800000,     formatted: '1,800,000',     trend: -0.50,up: false, series: buildSeries(0.05) },
  { id: 'gg',      label: 'google',     value: 1200000,     formatted: '1,200,000',     trend: 1.10, up: true,  series: buildSeries(0.04) },
]

// 销售排行（集团/公司）
export const rankings = {
  group: [
    { rank: 1, name: '比利集团',     sales: '郑奥坤', amount: 1943144.19, formatted: '1,943,144.19', trend: 10.05 },
    { rank: 2, name: '美妆集团',     sales: '林美',   amount: 1685470.50, formatted: '1,685,470.50', trend: 8.50 },
    { rank: 3, name: '电商集团',     sales: '吴昕',   amount: 1320256.80, formatted: '1,320,256.80', trend: 5.20 },
    { rank: 4, name: '云拓集团',     sales: '王浩',   amount: 1185620.00, formatted: '1,185,620.00', trend: 4.10 },
    { rank: 5, name: '光云集团',     sales: '陈总',   amount: 1093650.32, formatted: '1,093,650.32', trend: 19.89 },
    { rank: 6, name: '启航集团',     sales: '李娜',   amount: 986520.00,  formatted: '986,520.00',   trend: -1.20 },
    { rank: 7, name: '蓝海集团',     sales: '张磊',   amount: 875430.50,  formatted: '875,430.50',   trend: 3.40 },
    { rank: 8, name: '华彩集团',     sales: '王芳',   amount: 762180.00,  formatted: '762,180.00',   trend: -2.50 },
  ],
  company: [
    { rank: 1, name: '光云科技',     sales: '陈总',   amount: 1850000.00, formatted: '1,850,000.00', trend: 12.30 },
    { rank: 2, name: '美妆电商',     sales: '林美',   amount: 1560000.00, formatted: '1,560,000.00', trend: 8.40 },
    { rank: 3, name: '电商科技A',    sales: '吴昕',   amount: 1320256.80, formatted: '1,320,256.80', trend: 5.20 },
    { rank: 4, name: '云拓传媒',     sales: '王浩',   amount: 1185620.00, formatted: '1,185,620.00', trend: 4.10 },
    { rank: 5, name: '启航数字',     sales: '李娜',   amount: 986520.00,  formatted: '986,520.00',   trend: -1.20 },
  ],
}

// ============ 菜单树（按 caidan.json 完整复刻）============
export const MENU_TREE = [
  // 系统首页
  { id: 2271, pid: 0, label: '系统首页', index: 'homePage', icon: 'dashboard', template: 'dashboard', color: 'blue', sort: 99 },

  // 业务管理
  {
    id: 98, pid: 0, label: '业务管理', index: 'business', icon: 'briefcase', color: 'blue', sort: 10,
    children: [
      { id: 99, pid: 98, label: '集团管理', index: 'GroupManagement', icon: 'briefcase', template: 'groupList', color: 'blue',
        fields: [F.text('id','集团ID'), F.text('name','集团名称'), F.text('remark','集团备注'), F.num('score','综合评分',70), F.text('shortName','看板简称'), F.tag('tag','标签',80), F.money('initialBalance','期初余额'), F.tag('attr','集团属性',80), F.tag('groupType','集团类型',80), F.text('reportEndTime','报值结束时间'), F.text('created','创建时间'), F.text('sales','销售'), F.text('creator','创建人'), F.text('updated','更新时间')],
        data: groups },
      { id: 100, pid: 98, label: '主体管理', index: 'Customer', icon: 'document', template: 'subjectList', color: 'blue',
        fields: [F.text('id','主体编号'), F.text('customerCode','客户编号'), F.text('name','客户全称'), F.text('remark','客户备注'), F.text('bankAccount','银行账号'), F.text('phone','注册电话'), F.text('creditCode','统一社会信用代码'), F.tag('status','生效状态',70), F.text('industry','所属行业'), F.tag('tag','标签',80), F.tag('accountType','账户类型',80), F.text('groupName','集团名称'), F.text('sales','销售'), F.text('creator','创建人'), F.date('created','创建时间')],
        data: customers },
      {
        id: 101, pid: 98, label: '项目管理', index: 'project', icon: 'files', color: 'purple',
        children: [
          { id: 2277, pid: 101, label: '项目列表', index: 'Project', icon: 'files', template: 'projectList', color: 'purple',
            fields: [F.text('name','名称'), F.text('code','编码'), F.text('internalCode','内部自动编码'), F.text('level','销售控制等级'), F.tag('status','活跃状态'), F.text('groupName','客户集团全称'), F.text('projectId','项目编号'), F.text('salesName','销售人姓名'), F.date('created','创建时间'), F.date('updated','更新时间')],
            data: projects },
        ]
      },
      {
        id: 104, pid: 98, label: '广告主管理', index: 'advertiser', icon: 'edit', color: 'orange',
        children: [
          { id: 1562, pid: 104, label: '开户申请', index: 'AdvertiserID', icon: 'edit', template: 'advertiserApplyList', color: 'orange',
            fields: [F.text('seqNo','开户序列号'), F.text('groupName','集团名称'), F.text('copyAdvId','复制广告主ID'), F.text('status','开户状态',90), F.text('pool','服务商池'), F.text('sales','销售'), F.text('creator','创建人'), F.date('created','创建时间'), F.date('updated','更新时间')],
            data: advertiserApps },
          { id: 1563, pid: 104, label: '开户明细', index: 'openAccount', icon: 'document', template: 'advertiserDetailList', color: 'blue',
            fields: [F.text('seqNo','开户序列号'), F.text('detailName','明细名称'), F.text('groupName','集团名称'), F.text('policyName','政策名称'), F.percent('rebateRate','客户返点比例'), F.text('platform','媒体平台'), F.text('copyAdvId','复制广告主ID'), F.text('subject','开户主体'), F.text('industryL1','一级行业'), F.text('industryL2','二级行业'), F.text('operator','媒介开户人'), F.num('totalIds','开户ID总数'), F.num('successCount','成功数量'), F.num('pendingCount','待开数量'), F.text('type','类型'), F.text('pool','服务商池'), F.text('status','状态'), F.text('remark','备注'), F.text('sales','销售'), F.text('creator','创建人'), F.date('created','创建时间'), F.date('updated','更新时间')],
            data: advertiserDetails },
          { id: 2276, pid: 104, label: '账户列表', index: 'AccountList', icon: 'files', template: 'advertiserAccountList', color: 'blue',
            fields: [F.text('seqNo','开户序列号'), F.text('taskId','任务记录ID'), F.text('advId','广告主ID'), F.text('advName','广告主名称'), F.text('walletId','绑定钱包ID'), F.tag('accountStatus','媒体账号状态'), F.text('policyName','政策名称'), F.text('sales','所属销售'), F.text('industryL1','一级行业'), F.text('industryL2','二级行业'), F.text('platform','媒体平台'), F.text('customerName','客户名称'), F.text('groupName','客户集团'), F.percent('rechargeRebate','充值录入客户返点比例'), F.percent('policyRebate','政策客户返点比例'), F.text('source','来源'), F.text('creator','创建人'), F.date('created','创建时间'), F.date('updated','更新时间')],
            data: advertiserAccounts },
          { id: 2313, pid: 104, label: '任务列表', index: 'TaskData', icon: 'tickets', template: 'advertiserTaskList', color: 'orange',
            fields: [F.text('id','任务ID'), F.text('copyAdvId','复制广告主ID'), F.text('groupName','集团'), F.text('type','任务类型'), F.tag('status','任务状态'), F.num('inputCount','录入数量'), F.text('result','录入结果'), F.text('failReason','失败原因'), F.date('created','创建时间'), F.date('updated','更新时间')],
            data: advertiserTasks },
        ]
      },
      {
        id: 2275, pid: 98, label: '政策管理', index: 'policy', icon: 'notebook', color: 'green',
        children: [
          { id: 2279, pid: 2275, label: '政策列表', index: 'Policy', icon: 'notebook', template: 'subjectList', color: 'green',
            fields: [F.text('id','政策编号'), F.text('name','政策名称'), F.text('project','项目名称'), F.date('created','创建时间'), F.date('updated','更新时间'), F.percent('rebate','返点比例(%)'), F.percent('serviceFee','服务费比例(%)'), F.text('payType','付款方式'), F.text('coopMode','合作模式'), F.money('firstRecharge','首充预估金额'), F.money('prepaidAmount','预付资金金额'), F.text('customerName','客户名称'), F.text('customerType','客户类型'), F.text('platform','媒体平台'), F.text('bidType','竞价类型'), F.num('creditDays','垫款账期(天)'), F.text('groupName','集团名称'), F.text('agentName','媒介开户人'), F.text('salesOwner','业绩归属人'), F.text('creator','创建人'), F.text('remark','备注'), F.tag('approval','审批状态')],
            data: policies },
          { id: 2756, pid: 2275, label: '直播政策', index: 'LivePolicy', icon: 'video', template: 'subjectList', color: 'orange',
            fields: [F.text('code','政策编号'), F.text('groupName','集团'), F.text('customerName','客户名称'), F.text('industry','行业'), F.text('customerPolicy','代投客户政策'), F.text('remark','备注情况'), F.text('sales','销售'), F.text('department','部门'), F.text('platform','投放媒体'), F.text('applicant','申请人'), F.date('applyDate','申请日期'), F.money('financeQuote','财务报价'), F.tag('approval','审批状态'), F.date('created','创建时间')],
            data: livePolicies },
          { id: 2757, pid: 2275, label: '素材采买', index: 'MaterialPurchase', icon: 'document', template: 'subjectList', color: 'blue',
            fields: [F.text('id','审批单号'), F.text('groupName','集团'), F.text('customerName','客户名称'), F.text('industry','行业'), F.text('platform','媒体'), F.text('requirement','详细需求'), F.text('videoType','视频类型'), F.text('applicant','申请人'), F.date('applyDate','申请日期'), F.money('budget','客户总预算'), F.money('financeQuote','财务报价'), F.tag('approval','审批状态')],
            data: materialPurchases },
        ]
      },
      {
        id: 2416, pid: 98, label: 'KPI管理', index: 'kpi', icon: 'chart', color: 'orange',
        children: [
          { id: 2417, pid: 2416, label: '部门KPI报表', index: 'KPIlist', icon: 'chart', template: 'deptKpi', color: 'orange',
            fields: [F.text('id','编号'), F.text('dept','部门'), F.text('month','月份'), F.money('target','目标'), F.money('actual','实际'), F.percent('percent','完成率'), F.num('rank','排名',60)],
            data: deptKpiReports },
          { id: 2418, pid: 2416, label: '部门KPI设置', index: 'departmentKPISetting', icon: 'setting', template: 'deptKpiSetting', color: 'blue',
            fields: [F.text('id','编号'), F.text('dept','部门'), F.text('year','年份'), F.text('quarter','季度'), F.money('target','目标'), F.text('kpiType','KPI类型'), F.text('updater','更新人'), F.date('updated','更新日期')],
            data: deptKpiSettings },
          { id: 2419, pid: 2416, label: '员工KPI设置', index: 'employeeKPI', icon: 'user', template: 'staffKpiSetting', color: 'green',
            fields: [F.text('id','编号'), F.text('name','员工'), F.text('dept','部门'), F.text('month','月份'), F.money('salesTarget','销售目标'), F.money('paymentTarget','回款目标'), F.text('updater','更新人'), F.date('updated','更新日期')],
            data: empKpiSettings },
          { id: 2420, pid: 2416, label: '员工KPI报表', index: 'employeeKPIList', icon: 'chart', template: 'staffKpiReport', color: 'orange',
            fields: [F.text('id','编号'), F.text('name','员工'), F.text('dept','部门'), F.money('salesActual','实际销售'), F.money('salesTarget','目标'), F.percent('percent','完成率'), F.num('rank','排名',60)],
            data: empKpiReports },
          { id: 2449, pid: 2416, label: '变更记录', index: 'changeLog', icon: 'edit', template: 'changeLog', color: 'gray',
            fields: [F.text('id','编号'), F.tag('type','类型'), F.text('target','变更对象'), F.text('before','原值'), F.text('after','新值'), F.text('operator','操作人'), F.text('time','时间')],
            data: changeLogs },
        ]
      },
      /* 销售报表 - 暂时隐藏
      {
        id: 2452, pid: 98, label: '销售报表', index: 'sales-report', icon: 'document', color: 'blue',
        children: [
          { id: 2453, pid: 2452, label: '销售日报', index: 'salesDaily', icon: 'document', template: 'list', color: 'blue',
            fields: [F.text('id','编号'), F.date('date','日期'), F.text('name','员工'), F.money('sales','销售额'), F.num('newCustomers','新客户'), F.num('newOpportunities','新机会'), F.num('visits','拜访')],
            data: salesDaily },
          { id: 2454, pid: 2452, label: '销售周报', index: 'salesWeeklyReport', icon: 'document', template: 'list', color: 'blue',
            fields: [F.text('id','编号'), F.text('week','周'), F.text('name','员工'), F.money('sales','销售额'), F.num('newCustomers','新客户'), F.num('newOpportunities','新机会')],
            data: salesWeekly },
          { id: 2455, pid: 2452, label: '销售季度报表', index: 'salesQuarterlyReport', icon: 'document', template: 'list', color: 'purple',
            fields: [F.text('id','编号'), F.text('quarter','季度'), F.text('name','员工'), F.money('sales','销售额'), F.money('target','目标'), F.percent('completion','完成率')],
            data: salesQuarterly },
          { id: 2456, pid: 2452, label: '销售月报', index: 'salesMonthlyReport', icon: 'document', template: 'list', color: 'blue',
            fields: [F.text('id','编号'), F.text('month','月份'), F.text('name','员工'), F.money('sales','销售额'), F.num('newCustomers','新客户'), F.num('newOpportunities','新机会'), F.percent('completion','完成率')],
            data: salesMonthly },
        ]
      },
      */
    ]
  },

  // 人事管理
  { id: 97, pid: 0, label: '人事管理', index: 'hr', icon: 'user', color: 'blue', sort: 8, template: 'list',
    fields: [F.text('id','员工编号'), F.text('name','姓名'), F.text('dept','部门'), F.text('position','职位'), F.text('phone','电话'), F.tag('status','状态')],
    data: employees },

  // 财务中心
  {
    id: 397, pid: 0, label: '财务中心', index: 'financialManage', icon: 'money', color: 'orange', sort: 8,
    children: [
      { id: 2281, pid: 397, label: '合同列表', index: 'contractList', icon: 'tickets', template: 'list', color: 'blue',
        fields: [F.text('id','合同编号'), F.text('title','合同标题'), F.text('customer','客户'), F.money('amount','金额'), F.date('date','签约日期'), F.tag('status','状态'), F.text('owner','负责人')],
        data: contracts },
      { id: 2324, pid: 397, label: '回款管理', index: 'paymentList', icon: 'money', template: 'list', color: 'orange',
        fields: [F.text('id','编号'), F.text('contract','合同'), F.text('customer','客户'), F.money('amount','金额'), F.date('due','到期'), F.tag('status','状态'), F.tag('invoice','已开票',70) ],
        data: payments },
      { id: 2325, pid: 397, label: '余额管理', index: 'balanceList', icon: 'card', template: 'list', color: 'green',
        fields: [F.text('id','编号'), F.text('customer','客户'), F.money('balance','余额'), F.tag('type','类型'), F.date('updated','更新日期')],
        data: balances },
      { id: 2326, pid: 397, label: '退款管理', index: 'refundList', icon: 'document', template: 'list', color: 'red',
        fields: [F.text('id','编号'), F.text('contract','合同'), F.text('customer','客户'), F.money('amount','金额'), F.text('reason','原因'), F.text('applicant','申请人'), F.tag('status','状态'), F.date('date','日期')],
        data: refunds },
      { id: 2327, pid: 397, label: '媒体备款管理', index: 'reserveList', icon: 'document', template: 'list', color: 'gray',
        fields: [F.text('id','编号'), F.text('platform','媒体'), F.text('customer','客户'), F.money('amount','金额'), F.date('date','日期'), F.tag('status','状态')],
        data: reserves },
      { id: 2328, pid: 397, label: '开票管理', index: 'invoiceList', icon: 'edit', template: 'list', color: 'blue',
        fields: [F.text('id','编号'), F.text('contract','合同'), F.text('customer','客户'), F.money('amount','金额'), F.tag('type','类型'), F.tag('status','状态'), F.date('date','日期')],
        data: invoices },
    ]
  },

  // 行政管理
  { id: 96, pid: 0, label: '行政管理', index: 'admin', icon: 'setting', color: 'gray', sort: 7, template: 'list',
    fields: [F.text('id','编号'), F.tag('type','类型'), F.text('name','事项'), F.text('applicant','申请人'), F.money('amount','金额'), F.date('date','日期'), F.tag('status','状态')],
    data: adminItems },

  // 风控管理
  { id: 2274, pid: 0, label: '风控管理', index: 'risk', icon: 'risk', color: 'red', sort: 0, template: 'list',
    fields: [F.text('id','编号'), F.tag('type','类型'), F.text('name','事项'), F.tag('level','等级'), F.text('discoverer','发现人'), F.date('date','日期'), F.tag('status','状态')],
    data: riskItems },

  // 运营中心
  {
    id: 2392, pid: 0, label: '运营中心', index: 'operation', icon: 'chart', color: 'orange', sort: 0,
    children: [
      { id: 2393, pid: 2392, label: '运营消耗列表', index: 'operationList', icon: 'chart', template: 'operationList', color: 'orange',
        fields: [F.text('advId','广告主ID',140), F.text('advName','广告主名称',130), F.date('date','日期',100), F.text('groupId','集团ID',90), F.text('groupName','集团名称',140), F.text('platform','媒体平台',110), F.text('projectName','项目名称',130), F.text('operator','运营人员',100), F.money('totalConsumption','总消耗',110), F.money('giftConsumption','总赠款消耗',120), F.money('nonGiftConsumption','总非赠款消耗',130)],
        data: operations },
      { id: 2398, pid: 2392, label: '账户ID', index: 'accountBinding', icon: 'user', template: 'accountIdList', color: 'blue',
        fields: [F.text('advId','广告主ID',150), F.text('advName','广告主名称',170), F.text('operatorInfo','运营信息',140), F.text('policyName','政策名称',150), F.text('customerName','客户名称',160), F.text('customerGroup','客户集团',110), F.text('platform','媒体平台',110), F.text('industryL1','一级行业',100), F.text('industryL2','二级行业',100), F.text('sales','所属销售',100), F.date('createTime','创建时间',150)],
        data: accountBindings },
      {
        id: 2766, pid: 2392, label: '运营报表', index: 'op-report', icon: 'document', color: 'blue',
        children: [
          { id: 2767, pid: 2766, label: '运营日报', index: 'operationDaily', icon: 'document', template: 'operationReport', color: 'blue',
            fields: [F.text('id','编号'), F.date('date','日期'), F.money('totalConsumption','总消耗'), F.num('totalConversions','总转化'), F.text('avgRoas','平均ROAS')],
            data: opDaily },
          { id: 2768, pid: 2766, label: '运营周报', index: 'operationWeekly', icon: 'document', template: 'operationReport', color: 'blue',
            fields: [F.text('id','编号'), F.text('week','周'), F.money('totalConsumption','总消耗'), F.num('totalConversions','总转化'), F.text('avgRoas','平均ROAS')],
            data: opWeekly },
          { id: 2769, pid: 2766, label: '运营月报', index: 'operationMonthly', icon: 'document', template: 'operationReport', color: 'blue',
            fields: [F.text('id','编号'), F.text('month','月份'), F.money('totalConsumption','总消耗'), F.num('totalConversions','总转化'), F.text('avgRoas','平均ROAS')],
            data: opMonthly },
          { id: 2770, pid: 2766, label: '运营季报', index: 'operationQuarterly', icon: 'document', template: 'operationReport', color: 'purple',
            fields: [F.text('id','编号'), F.text('quarter','季度'), F.money('totalConsumption','总消耗'), F.num('totalConversions','总转化'), F.text('avgRoas','平均ROAS')],
            data: opQuarterly },
        ]
      },
    ]
  },

  // 财务数据看板
  {
    id: 2397, pid: 0, label: '财务数据看板', index: 'financeBoard', icon: 'board', color: 'purple', sort: 0,
    children: [
      { id: 2401, pid: 2397, label: '业绩汇总', index: 'performanceDataList', icon: 'chart', template: 'list', color: 'orange',
        fields: [F.text('id','编号'), F.text('month','月份'), F.money('consumption','消耗'), F.money('revenue','收入'), F.money('profit','利润'), F.text('margin','利润率')],
        data: performanceData },
      { id: 2405, pid: 2397, label: '明点全景', index: 'mingDianList', icon: 'board', template: 'mingdian', color: 'purple',
        fields: [F.date('consumeDate','消耗日期'), F.text('mediaPlatform','媒体平台'), F.text('customerName','客户主体名称',160), F.text('groupName','集团'), F.money('consumePoints','消耗点数'), F.text('rebateRate','客户返点率'), F.money('rebateAmount','客户返点金额'), F.text('salesPolicy','销售政策',140)],
        data: mingdian },
      { id: 2407, pid: 2397, label: '运营人员看板', index: 'OperatorDashboard', icon: 'monitor', template: 'operatorDashboard', color: 'orange',
        fields: [F.date('date','日期'), F.text('mediaPlatform','媒体平台'), F.text('advId','广告主ID'), F.text('advName','广告主名称',140), F.text('customerName','客户名称'), F.text('groupName','集团'), F.text('projectName','项目名称',120), F.text('directCustomer','直客主体'), F.money('nonGiftConsumption','非赠返消耗(元)'), F.text('rebateRate','客户返点'), F.text('salesPolicy','销售政策',120), F.text('sales','销售'), F.text('operator','运营'), F.text('perfOwner','业绩归属人'), F.text('dept','部门')],
        data: opDashboardReport },
      { id: 2638, pid: 2397, label: '客户政策明细', index: 'customerPolicyDetails', icon: 'monitor', template: 'customerPolicy', color: 'purple',
        fields: [F.text('date','日期'), F.text('group','集团'), F.text('adType','广告类型'), F.text('productLine','产品线'), F.text('customerName','客户主体',160), F.text('firstAgent','一级代理商'), F.text('advId','广告主ID'), F.text('advCompany','广告主公司',140), F.text('advAccount','广告主账户',140), F.text('customerId','客户ID'), F.money('nonGiftConsumption','非赠返消耗(元)'), F.money('sharedWalletConsumption','共货钱包消耗(元)'), F.text('sharedWalletId','共货钱包ID'), F.text('mediaPlatform','媒体平台'), F.text('policyName','政策名称',140), F.text('rebateRate','客户返点系数'), F.money('rebateAmount','客户返点金额(元)'), F.text('serviceTag','服务标签'), F.text('settlementStat','结算行业统计'), F.text('industryL1','一级行业'), F.text('industryL2','二级行业'), F.text('industrySub','行业类目'), F.text('sales','销售')],
        data: customerPolicyData },
    ]
  },

  // 媒介数据看板
  {
    id: 2408, pid: 0, label: '媒介数据看板', index: 'mediaBoard', icon: 'monitor', color: 'purple', sort: 0,
    children: [
      {
        id: 2411, pid: 2408, label: '媒介报表', index: 'media-report', icon: 'document', color: 'green',
        children: [
          { id: 2412, pid: 2411, label: '媒介日报', index: 'mediaDaily', icon: 'document', template: 'mediaDailyReport', color: 'blue',
            fields: [],
            data: mediaReportByType.day },
          { id: 2413, pid: 2411, label: '媒介周报', index: 'mediaWeeklyReport', icon: 'document', template: 'mediaWeeklyReport', color: 'green',
            fields: [],
            data: mediaReportByType.week },
          { id: 2414, pid: 2411, label: '媒介月报', index: 'mediaMonthlyReport', icon: 'document', template: 'mediaMonthlyReport', color: 'green',
            fields: [],
            data: mediaMonthlyReport },
          { id: 2415, pid: 2411, label: '媒介季度报表', index: 'mediaQuarterlyReport', icon: 'document', template: 'mediaQuarterlyReport', color: 'purple',
            fields: [],
            data: mediaReportByType.quarter },
          { id: 2450, pid: 2411, label: '媒介半年报', index: 'mediaSemiAnnualReport', icon: 'document', template: 'mediaSemiAnnualReport', color: 'green',
            fields: [],
            data: mediaReportByType.halfYear },
          { id: 2451, pid: 2411, label: '媒介年报', index: 'mediaYearlyReport', icon: 'document', template: 'mediaYearlyReport', color: 'green',
            fields: [],
            data: mediaReportByType.year },
        ]
      },
      { id: 2553, pid: 2408, label: '头条账户余额', index: 'balanceReport', icon: 'money', template: 'balanceReport', color: 'orange',
        fields: [F.text('id','编号'), F.text('group','集团'), F.text('subject','开户主体'), F.text('coopMode','合作模式'), F.money('yesterdayBalance','前一日余额(万)'), F.money('yesterdayCost','昨日消耗(万)'), F.money('weekCost','近7日消耗(万)'), F.text('platform','端口'), F.num('availableDays','余额可用天数'), F.text('payType','付款方式'), F.date('date','归属日期')],
        data: toutiaoBalance },
      { id: 2777, pid: 2408, label: '自运营操作看板', index: 'selfOperationReport', icon: 'tickets', template: 'selfOperationReport', color: 'purple',
        fields: [F.text('id','编号'), F.text('group','集团'), F.text('advId','广告主ID'), F.text('advName','广告主名称'), F.money('nonGiftConsumption','非赠款消耗(元)'), F.num('selfOpRatio','自运营操作占比%'), F.text('subject','开户主体'), F.text('dept','部门'), F.text('sales','销售'), F.text('ip','IP地址'), F.num('vpnRate','VPN使用率%'), F.num('arkOps','方舟操作次数'), F.num('nonCoopOps','非配合操作次数'), F.date('date','归属日期')],
        data: selfOpReports },
      { id: 2778, pid: 2408, label: '客户健康报表', index: 'customerHealthReport', icon: 'document', template: 'customerHealthReport', color: 'red',
        fields: [F.text('name','集团名称'), F.tag('groupCustomerType','集团客户类型'), F.text('subjectCount','开户主体数'), F.text('platformCount','媒体平台数'), F.money('totalCost','累计消耗'), F.date('lastCostTime','最后消耗时间'), F.text('sales','销售'), F.text('dept','部门')],
        data: customerHealth },
    ]
  },

  // 审批中心
  {
    id: 2447, pid: 0, label: '审批中心', index: 'approval', icon: 'check', color: 'blue', sort: 0,
    children: [
      { id: 2278, pid: 2447, label: '审批列表', index: 'ApprovalList', icon: 'tickets', template: 'approval', color: 'blue',
        data: approvalsData },
      { id: 2771, pid: 2447, label: '审批流配置', index: 'ApprovalFlowConfig', icon: 'setting', template: 'list', color: 'green',
        fields: [F.text('id','编号'), F.text('name','审批流名称'), F.text('steps','流程步骤'), F.tag('enabled','启用',70,{'true':'green','false':'gray'})],
        data: approvalFlows.map(a => ({ ...a, enabled: a.enabled ? 'true' : 'false' })) },
    ]
  },
]

// ============ 工具函数 ============
const nodeMap = new Map()
function buildNodeMap(nodes, map = nodeMap) {
  for (const n of nodes) {
    map.set(n.id, n)
    if (n.children) buildNodeMap(n.children, map)
  }
}
buildNodeMap(MENU_TREE)

export function findNode(id) {
  return nodeMap.get(Number(id))
}

export function findPath(id) {
  // 返回从一级菜单到当前节点的路径（id 数组）
  const path = []
  let node = findNode(id)
  while (node) {
    path.unshift(node)
    node = findNode(node.pid)
  }
  return path
}

export function getChildModules(id) {
  // 获取指定 id 的所有叶子子节点（用于分类入口）
  const node = findNode(id)
  if (!node) return []
  if (!node.children) return [node]
  const result = []
  const walk = (n) => {
    if (!n.children) {
      result.push(n)
    } else {
      n.children.forEach(walk)
    }
  }
  walk(node)
  return result
}

export const colorMap = tagColor

// ============ 运营报表 mock（日/周/月/季 共用结构）============
// byMedia 共 9 项（total + 8 媒体平台），按当前选中媒体切换下方图表与汇总卡
// cards 二级卡：运营维度=运营人员，部门维度=部门
// detail 子聚合 + 明细行：用于二级详情页

// 生成周报/季报用的衍生数据（基于月报基础上缩放/调整日期）
function buildTrendDates(prefix, count) {
  return Array.from({ length: count }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`)
}
function scaleTrend(baseTrend, dates, scale) {
  return dates.map((d, i) => ({ date: d, value: Number(((baseTrend[i]?.value || 0) * scale).toFixed(2)) }))
}

const OPERATORS_14 = [
  { name: '未匹配', nonGift: 563.38, qoq: 743618.96 },
  { name: '未匹配', nonGift: 4.95, qoq: 0 },
  { name: '邢虹蕾', nonGift: 2.74, qoq: 0 },
  { name: '苗苗', nonGift: 2.48, qoq: 1578.27 },
  { name: '张佳宝', nonGift: 1.68, qoq: 0 },
  { name: '王佩戴', nonGift: 1.47, qoq: 0 },
  { name: '未匹配', nonGift: 1.42, qoq: 0 },
  { name: '孙诗源', nonGift: 1.14, qoq: 0 },
  { name: '李玉玲', nonGift: 1.09, qoq: 0 },
  { name: '李慧彬', nonGift: 0.95, qoq: 0 },
  { name: '陈淑倩', nonGift: 0.93, qoq: 0 },
  { name: '邹阳泽', nonGift: 0.92, qoq: 0 },
  { name: '陈雪滢', nonGift: 0.75, qoq: 0 },
  { name: '黄亚雄', nonGift: 0.62, qoq: 0 },
]

const DEPARTMENTS_14 = [
  { name: '成都素材部', nonGift: 4.85, qoq: 0 },
  { name: '未匹配', nonGift: 4.35, qoq: 0 },
  { name: '苗苗', nonGift: 1.41, qoq: 0 },
  { name: '未匹配', nonGift: 1.02, qoq: 0 },
  { name: '未匹配', nonGift: 0.85, qoq: 0 },
  { name: '未匹配', nonGift: 0.71, qoq: 0 },
  { name: '未匹配', nonGift: 0.20, qoq: 0 },
  { name: '未匹配', nonGift: 0.16, qoq: 0 },
  { name: '未匹配', nonGift: 0.13, qoq: 0 },
  { name: '未匹配', nonGift: 0.10, qoq: 0 },
  { name: '未匹配', nonGift: 0.05, qoq: 0 },
  { name: '未匹配', nonGift: 0.04, qoq: 0 },
  { name: '苗苗', nonGift: 0.04, qoq: 0 },
  { name: '李玉玲', nonGift: 0.03, qoq: 0 },
]

// 每个媒体对应一组数据（total 是汇总）
const OPERATOR_BY_MEDIA = {
  total: { cards: OPERATORS_14 },
  toutiao: { cards: OPERATORS_14.slice(0, 12) },
  'toutiao-ad': { cards: OPERATORS_14.slice(0, 8) },
  'toutiao-qianchuan': { cards: OPERATORS_14.slice(0, 10) },
  'toutiao-local': { cards: OPERATORS_14.slice(0, 9) },
  tencent: { cards: OPERATORS_14.slice(0, 4) },
  kuaishou: { cards: [] },
  xiaohongshu: { cards: OPERATORS_14.slice(2, 7) },
  weibo: { cards: OPERATORS_14.slice(5, 9) },
}

const DEPT_BY_MEDIA = {
  total: { cards: [{ name: '成都素材部', nonGift: 13.95, qoq: 0 }] },
  toutiao: { cards: DEPARTMENTS_14.slice(0, 3) },
  'toutiao-ad': { cards: [] },
  'toutiao-qianchuan': { cards: [] },
  'toutiao-local': { cards: [] },
  tencent: { cards: [] },
  kuaishou: { cards: [] },
  xiaohongshu: { cards: [{ name: '成都素材部', nonGift: 13.95, qoq: 0 }] },
  weibo: { cards: [] },
}

const MEDIA_META = [
  { key: 'total', name: '总计', nonGift: 584.61, qoq: -99.75, total: 596.11, gift: 8.51, dailyAvg: 560.23, pie: [{ name: '二代', value: 36.56 }, { name: '非二代', value: 38.32 }, { name: '其他', value: 25.12 }] },
  { key: 'toutiao', name: '头条总', nonGift: 507.05, qoq: -99.78, total: 515.39, gift: 8.34, dailyAvg: 482.67, pie: [{ name: '二代', value: 40.12 }, { name: '非二代', value: 35.20 }, { name: '其他', value: 24.68 }] },
  { key: 'toutiao-ad', name: '头条-AD', nonGift: 48.76, qoq: -99.94, total: 49.02, gift: 0.26, dailyAvg: 24.38, pie: [{ name: '二代', value: 45.10 }, { name: '非二代', value: 30.20 }, { name: '其他', value: 24.70 }] },
  { key: 'toutiao-qianchuan', name: '头条-千川', nonGift: 234.22, qoq: -99.70, total: 238.15, gift: 3.93, dailyAvg: 234.22, pie: [{ name: '二代', value: 38.10 }, { name: '非二代', value: 36.50 }, { name: '其他', value: 25.40 }] },
  { key: 'toutiao-local', name: '头条-本地推', nonGift: 224.07, qoq: -99.71, total: 228.22, gift: 4.15, dailyAvg: 224.07, pie: [{ name: '二代', value: 33.40 }, { name: '非二代', value: 40.10 }, { name: '其他', value: 26.50 }] },
  { key: 'tencent', name: '腾讯', nonGift: 35.54, qoq: 0, total: 35.55, gift: 0.01, dailyAvg: 35.54, pie: [{ name: '二代', value: 30.20 }, { name: '非二代', value: 42.10 }, { name: '其他', value: 27.70 }] },
  { key: 'kuaishou', name: '快手', nonGift: 0.00, qoq: 0, total: 0.00, gift: 0.00, dailyAvg: 0.00, pie: [{ name: '二代', value: 0 }, { name: '非二代', value: 0 }, { name: '其他', value: 0 }] },
  { key: 'xiaohongshu', name: '小红书', nonGift: 32.30, qoq: 0, total: 32.31, gift: 0.01, dailyAvg: 32.30, pie: [{ name: '二代', value: 36.50 }, { name: '非二代', value: 38.20 }, { name: '其他', value: 25.30 }] },
  { key: 'weibo', name: '微博', nonGift: 9.71, qoq: 0, total: 12.87, gift: 0.15, dailyAvg: 9.71, pie: [{ name: '二代', value: 28.30 }, { name: '非二代', value: 44.20 }, { name: '其他', value: 27.50 }] },
]

const TREND_BY_MEDIA = {
  total: [{ date: '07-01', value: 0.1 }, { date: '07-05', value: 0.05 }, { date: '07-10', value: 0.0 }, { date: '07-15', value: 0.2 }, { date: '07-20', value: 584.4 }],
  toutiao: [{ date: '07-01', value: 0.1 }, { date: '07-05', value: 0.0 }, { date: '07-10', value: 0.0 }, { date: '07-15', value: 0.15 }, { date: '07-20', value: 506.9 }],
  'toutiao-ad': [{ date: '07-01', value: 0.0 }, { date: '07-10', value: 0.0 }, { date: '07-15', value: 0.05 }, { date: '07-20', value: 48.71 }],
  'toutiao-qianchuan': [{ date: '07-15', value: 0.05 }, { date: '07-20', value: 234.17 }],
  'toutiao-local': [{ date: '07-15', value: 0.10 }, { date: '07-20', value: 223.97 }],
  tencent: [{ date: '07-15', value: 0.04 }, { date: '07-20', value: 35.50 }],
  kuaishou: [{ date: '07-15', value: 0.0 }, { date: '07-20', value: 0.0 }],
  xiaohongshu: [{ date: '07-15', value: 0.01 }, { date: '07-20', value: 32.29 }],
  weibo: [{ date: '07-15', value: 0.05 }, { date: '07-20', value: 9.66 }],
}

export const monthlyReportData = {
  period: '2026-07',
  periodLabel: '月份',
  operator: {
    byMedia: MEDIA_META.map(m => ({ ...m, cards: OPERATOR_BY_MEDIA[m.key].cards })),
    trends: TREND_BY_MEDIA,
  },
  dept: {
    byMedia: MEDIA_META.map(m => ({ ...m, cards: DEPT_BY_MEDIA[m.key].cards })),
    trends: TREND_BY_MEDIA,
  },
}

// 生成日报/周报/季报数据
function scaleMeta(meta, scale) {
  return meta.map(m => ({
    ...m,
    nonGift: Number((m.nonGift * scale).toFixed(2)),
    qoq: Number((m.qoq * scale).toFixed(2)),
    total: Number((m.total * scale).toFixed(2)),
    gift: Number((m.gift * scale).toFixed(2)),
    dailyAvg: Number((m.dailyAvg * scale).toFixed(2)),
    pie: m.pie.map(p => ({ ...p })),
  }))
}

function buildByMedia(scale, dim) {
  // dim = 'operator' | 'dept'
  const cardsMap = dim === 'operator' ? OPERATOR_BY_MEDIA : DEPT_BY_MEDIA
  return scaleMeta(MEDIA_META, scale).map(m => ({
    ...m,
    cards: (cardsMap[m.key]?.cards || []).map(c => ({
      ...c,
      nonGift: Number((c.nonGift * scale).toFixed(2)),
      qoq: Number((c.qoq * scale).toFixed(2)),
    })),
  }))
}

const dailyDates = buildTrendDates('08-', 25)
const weeklyDates = buildTrendDates('W', 7)
const quarterlyDates = ['Q3-W1', 'Q3-W2', 'Q3-W3', 'Q3-W4', 'Q3-W5', 'Q3-W6', 'Q3-W7', 'Q3-W8', 'Q3-W9', 'Q3-W10', 'Q3-W11', 'Q3-W12']

// 日报 = 缩放 × 0.05（一天数据量约为月 1/20），趋势用日维度
const dailyTrends = {
  total: scaleTrend(TREND_BY_MEDIA.total, dailyDates, 0.05),
  toutiao: scaleTrend(TREND_BY_MEDIA.toutiao, dailyDates, 0.05),
  'toutiao-ad': scaleTrend(TREND_BY_MEDIA['toutiao-ad'], dailyDates, 0.05),
  'toutiao-qianchuan': scaleTrend(TREND_BY_MEDIA['toutiao-qianchuan'], dailyDates, 0.05),
  'toutiao-local': scaleTrend(TREND_BY_MEDIA['toutiao-local'], dailyDates, 0.05),
  tencent: scaleTrend(TREND_BY_MEDIA.tencent, dailyDates, 0.05),
  kuaishou: scaleTrend(TREND_BY_MEDIA.kuaishou, dailyDates, 0.05),
  xiaohongshu: scaleTrend(TREND_BY_MEDIA.xiaohongshu, dailyDates, 0.05),
  weibo: scaleTrend(TREND_BY_MEDIA.weibo, dailyDates, 0.05),
}

// 周报 = 缩放 × 0.25（一周约为月 1/4）
const weeklyTrends = {
  total: scaleTrend(TREND_BY_MEDIA.total, weeklyDates, 0.25),
  toutiao: scaleTrend(TREND_BY_MEDIA.toutiao, weeklyDates, 0.25),
  'toutiao-ad': scaleTrend(TREND_BY_MEDIA['toutiao-ad'], weeklyDates, 0.25),
  'toutiao-qianchuan': scaleTrend(TREND_BY_MEDIA['toutiao-qianchuan'], weeklyDates, 0.25),
  'toutiao-local': scaleTrend(TREND_BY_MEDIA['toutiao-local'], weeklyDates, 0.25),
  tencent: scaleTrend(TREND_BY_MEDIA.tencent, weeklyDates, 0.25),
  kuaishou: scaleTrend(TREND_BY_MEDIA.kuaishou, weeklyDates, 0.25),
  xiaohongshu: scaleTrend(TREND_BY_MEDIA.xiaohongshu, weeklyDates, 0.25),
  weibo: scaleTrend(TREND_BY_MEDIA.weibo, weeklyDates, 0.25),
}

// 季报 = 缩放 × 3（一季度约为月 × 3）
const quarterlyTrends = {
  total: scaleTrend(TREND_BY_MEDIA.total, quarterlyDates, 3),
  toutiao: scaleTrend(TREND_BY_MEDIA.toutiao, quarterlyDates, 3),
  'toutiao-ad': scaleTrend(TREND_BY_MEDIA['toutiao-ad'], quarterlyDates, 3),
  'toutiao-qianchuan': scaleTrend(TREND_BY_MEDIA['toutiao-qianchuan'], quarterlyDates, 3),
  'toutiao-local': scaleTrend(TREND_BY_MEDIA['toutiao-local'], quarterlyDates, 3),
  tencent: scaleTrend(TREND_BY_MEDIA.tencent, quarterlyDates, 3),
  kuaishou: scaleTrend(TREND_BY_MEDIA.kuaishou, quarterlyDates, 3),
  xiaohongshu: scaleTrend(TREND_BY_MEDIA.xiaohongshu, quarterlyDates, 3),
  weibo: scaleTrend(TREND_BY_MEDIA.weibo, quarterlyDates, 3),
}

// 通用：构建指定 period 的数据
function buildReport(scale, trends) {
  return {
    byMedia: buildByMedia(scale, 'operator'),
    trends,
  }
}
function buildReportDept(scale, trends) {
  return {
    byMedia: buildByMedia(scale, 'dept'),
    trends,
  }
}

export const operationReportData = {
  daily: {
    period: '2026-08-25',
    periodLabel: '日期',
    operator: buildReport(0.05, dailyTrends),
    dept: buildReportDept(0.05, dailyTrends),
  },
  weekly: {
    period: '2026-W34',
    periodLabel: '周',
    operator: buildReport(0.25, weeklyTrends),
    dept: buildReportDept(0.25, weeklyTrends),
  },
  monthly: monthlyReportData,
  quarterly: {
    period: '2026-Q3',
    periodLabel: '季度',
    operator: buildReport(3, quarterlyTrends),
    dept: buildReportDept(3, quarterlyTrends),
    // 行业 Top10 - 头条-AD / 头条-本地推 / 头条-千川 三媒体堆叠
    // 总计 ≈ 48,539.83 万；平均值 ≈ 4,853.98 万
    industryStack: [
      { industry: '丽人',       '头条-AD': 8016.79, '头条-本地推': 4606.36, '头条-千川':      0.00 },
      { industry: '医疗机构',   '头条-AD':   40.32, '头条-本地推': 10434.39,'头条-千川':     0.00 },
      { industry: '实体书籍',   '头条-AD':    0.00, '头条-本地推':    0.00, '头条-千川':  4877.06 },
      { industry: '服装配饰',   '头条-AD':   71.55, '头条-本地推':    0.00, '头条-千川':  3188.65 },
      { industry: '传媒资讯',   '头条-AD': 3305.72, '头条-本地推':    0.00, '头条-千川':     8.05 },
      { industry: '食品饮料',   '头条-AD':  819.07, '头条-本地推':    0.00, '头条-千川':  2279.73 },
      { industry: '家居建材',   '头条-AD':   67.14, '头条-本地推':    0.00, '头条-千川':  3003.96 },
      { industry: '美妆',       '头条-AD':   72.81, '头条-本地推':    0.00, '头条-千川':  2976.97 },
      { industry: '教育培训',   '头条-AD':  854.67, '头条-本地推': 1061.95, '头条-千川':   702.95 },
      { industry: '日化',       '头条-AD':  111.81, '头条-本地推':    0.00, '头条-千川':  1635.82 },
    ],
  },
}

// 媒介季报附加：行业 Top10 三媒体堆叠（与 operationReportData.quarterly.industryStack 共享）
mediaReportByType.quarter.industryStack = operationReportData.quarterly.industryStack

// 兼容旧名
export { monthlyReportData as legacyMonthlyReportData }

// 二级详情 — 运营维度：点击运营人员进入，按媒体维度子聚合（媒体平台列表）+ 明细行
const OP_DETAIL_SUB = {
  total: [
    { name: '冯APP', nonGift: 22724.27 },
    { name: '瓜子二手车', nonGift: 3850.00 },
    { name: '-', nonGift: 806.08 },
  ],
  toutiao: [
    { name: '冯APP', nonGift: 20000.00 },
    { name: '瓜子二手车', nonGift: 3850.00 },
    { name: '其他', nonGift: 580.00 },
  ],
  'toutiao-ad': [
    { name: '冯APP', nonGift: 1954.80 },
    { name: '瓜子二手车', nonGift: 15.53 },
  ],
  'toutiao-qianchuan': [
    { name: '冯APP', nonGift: 2000.00 },
    { name: '瓜子二手车', nonGift: 2641.53 },
  ],
  xiaohongshu: [
    { name: '小红书-聚光', nonGift: 5000.00 },
  ],
  weibo: [
    { name: '微博-粉丝通', nonGift: 1500.00 },
  ],
}

const OP_DETAIL_ROWS = [
  { date: '2026-07-20', advId: '70527312', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 1954.80 },
  { date: '2026-07-20', advId: '82701266', advName: '上海嵩嵩信息科技有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 15.53 },
  { date: '2026-07-20', advId: '74196352', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 2000.00 },
  { date: '2026-07-20', advId: '71793617', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 2641.53 },
  { date: '2026-07-20', advId: '82701300', advName: '上海嵩嵩信息科技有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 98.85 },
  { date: '2026-07-20', advId: '71793756', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 217.27 },
  { date: '2026-07-20', advId: '71793729', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 2505.20 },
  { date: '2026-07-20', advId: '82587332', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 35.48 },
  { date: '2026-07-20', advId: '83631277', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 26.23 },
  { date: '2026-07-20', advId: '71793530', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 7.69 },
  { date: '2026-07-20', advId: '71793351', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 5429.97 },
  { date: '2026-07-20', advId: '82588425', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 5.24 },
  { date: '2026-07-20', advId: '71793123', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 234.95 },
  { date: '2026-07-20', advId: '71793828', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 2170.34 },
  { date: '2026-07-20', advId: '70526853', advName: '上海博物馆忠集团有限公司', platform: '腾讯-广点通', customer: '冯APP', industry: '电商服务', nonGift: 9.28 },
]

// 二级详情 — 部门维度：点击部门进入，按子部门（客户列表）+ 明细行
const DEPT_DETAIL_SUB = [
  { name: '北京果壳观景旅游有限公司', nonGift: 23493.17 },
  { name: '北京果壳亲子部落旅游有限公司', nonGift: 11926.98 },
  { name: '果壳定制（北京）旅游有限公司', nonGift: 6962.83 },
  { name: '北京果壳旅游有限公司', nonGift: 1137.86 },
]

const DEPT_DETAIL_ROWS = [
  { date: '2026-07-20', advId: '果壳旅行-果壳定制游', advName: '果壳旅行-果壳定制游', platform: '小红书-聚光', customer: '果壳定制（北京）旅游有限公司', industry: '电商服务', nonGift: 5043.88 },
  { date: '2026-07-20', advId: '果壳旅行-果壳果旅之旅', advName: '果壳旅行-果壳果旅之旅', platform: '小红书-聚光', customer: '果壳定制（北京）旅游有限公司', industry: '电商服务', nonGift: 1918.95 },
  { date: '2026-07-20', advId: '果壳旅行-童趣呼伦（果壳）2', advName: '果壳旅行-童趣呼伦（果壳）2', platform: '小红书-聚光', customer: '北京果壳观景旅游有限公司', industry: '电商服务', nonGift: 9214.87 },
  { date: '2026-07-20', advId: '果壳旅行-果壳 1 草原亲子游 2', advName: '果壳旅行-果壳 1 草原亲子游 2', platform: '小红书-聚光', customer: '北京果壳亲子部落旅游有限公司', industry: '电商服务', nonGift: 14278.30 },
  { date: '2026-07-20', advId: '果壳旅行-GK 果壳定制旅行', advName: '果壳旅行-GK 果壳定制旅行', platform: '小红书-聚光', customer: '北京果壳观景旅游有限公司', industry: '电商服务', nonGift: 627.33 },
  { date: '2026-07-20', advId: '果壳旅行-GK 果壳旅旅行', advName: '果壳旅行-GK 果壳旅旅行', platform: '小红书-聚光', customer: '北京果壳旅游有限公司', industry: '电商服务', nonGift: 510.53 },
  { date: '2026-07-20', advId: '果壳旅行-果壳 1 亲子部落 2', advName: '果壳旅行-果壳 1 亲子部落 2', platform: '小红书-聚光', customer: '北京果壳亲子部落旅游有限公司', industry: '电商服务', nonGift: 11926.98 },
]

export const monthlyReportDetailData = {
  operator: {
    total: 27380,
    entity: '邢虹蕾',
    subs: OP_DETAIL_SUB,
    rows: OP_DETAIL_ROWS,
  },
  dept: {
    total: 43520,
    entity: '果壳旅行',
    subs: DEPT_DETAIL_SUB,
    rows: DEPT_DETAIL_ROWS,
  },
}

// 日/周/月/季 共用详情数据，period 仅影响命名展示
export const operationReportDetailData = {
  daily: monthlyReportDetailData,
  weekly: monthlyReportDetailData,
  monthly: monthlyReportDetailData,
  quarterly: monthlyReportDetailData,
}

// 当前账号入驻的企业列表（用户可在「我的」页/工作台顶栏切换）
export const userEnterprisesData = [
  { id: 'E001', name: '央广代理',     role: '管理员', logoColor: '#2D7FF9' },
  { id: 'E002', name: '北方传媒',     role: '成员',   logoColor: '#FF9A3C' },
  { id: 'E003', name: '众合广告代理', role: '成员',   logoColor: '#9B7FF5' },
]
