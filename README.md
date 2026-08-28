# CRM App · CRM 移动端

> 一个用 React + Vite + Tailwind CSS 实现的**纯移动端** CRM Demo，把 PC 端 CRM 系统重设计为「钉钉式」App 体验。覆盖开户、客户/主体/项目/政策管理、广告主 ID、审批、报表、业绩汇总、工单等核心业务流程。

---

## 📑 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [目录结构](#目录结构)
- [设计原则](#设计原则)
- [路由总览](#路由总览)
- [底部 Tab 导航](#底部-tab-导航)
- [全局通用交互](#全局通用交互)
- [页面与功能详解](#页面与功能详解)
  - [1. 登录页](#1-登录页)
  - [2. 首页 /](#2-首页-)
  - [3. 工作台 /work](#3-工作台-work)
  - [4. 通用菜单页 /m/:id](#4-通用菜单页-mid)
  - [5. 集团管理](#5-集团管理)
  - [6. 业务主体管理](#6-业务主体管理)
  - [7. 项目管理](#7-项目管理)
  - [8. 广告主 ID 管理](#8-广告主-id-管理)
  - [9. 政策管理](#9-政策管理)
  - [10. 报表中心](#10-报表中心)
  - [11. 业绩汇总 /performance](#11-业绩汇总-performance)
  - [12. 部门 KPI 报表](#12-部门-kpi-报表)
  - [13. 部门 KPI 目标设置](#13-部门-kpi-目标设置)
  - [14. 员工 KPI 目标设置](#14-员工-kpi-目标设置)
  - [15. 员工 KPI 报表](#15-员工-kpi-报表)
  - [16. 变更记录](#16-变更记录)
  - [17. 底池数据列表](#17-底池数据列表)
  - [18. 运营报表](#18-运营报表)
  - [19. 账户 ID](#19-账户-id)
  - [20. 客户政策明细](#20-客户政策明细)
  - [21. 通用消耗报表（明点全景 / 运营人员看板）](#21-通用消耗报表明点全景--运营人员看板)
  - [22. 媒体报表（日/周/月/季/半年/年）](#22-媒体报表日周月季半年年)
  - [23. 头条余额报表](#23-头条余额报表)
  - [24. 自运营报表](#24-自运营报表)
  - [25. 客户健康报表](#25-客户健康报表)
  - [26. 审批中心](#26-审批中心)
  - [27. 我的 /me](#27-我的-me)
  - [28. 工单（App 端独有）](#28-工单app-端独有)
- [复用组件](#复用组件)
- [PWA 与发布](#pwa-与发布)

---

## 项目简介

- **目标**：把 PC 端「 CRM」重设计为手机优先的 App，原生体验般的钉钉风格。
- **范围**：覆盖开户/政策/项目/广告主 ID/审批/报表/工单等核心 CRM 流程；不含 PC 端。
- **数据源**：`src/data/mock.js` —— 274 KB 的演示数据（所有列表/详情共用）。
- **视觉规范**：品牌色 `#2D7FF9`；iconfont 风格自绘 SVG。

---

## 技术栈

| 类别 | 选型 | 用途 |
| ---- | ---- | ---- |
| 前端框架 | **React 18.3** + **Vite 5** | SPA |
| 路由 | **react-router-dom 6**（`HashRouter`） | 静态部署友好，路径形如 `#/m/2278` |
| 样式 | **Tailwind CSS 3.4** + PostCSS | 设计 token 通过 `tailwind.config.js` 暴露 |
| 图表 | **Recharts 2.13** | 折线 / 柱状 / 饼图 / 横向滚动 |
| 工具 | **dayjs 1.11** | 日期格式化 |
| PWA | Service Worker（手写 `public/sw.js`） + `manifest.webmanifest` | 离线缓存 / 新版本 toast 提示 |
| E2E | **Playwright 1.62**（dev 依赖） | 自动化演示 |

> React 组件全部函数式 + Hooks；状态管理走 `useState` + `useMemo`，不引入 Redux/Zustand。

---

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（端口 5173）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

部署到 GitHub Pages 时，资源路径前缀为 `/CRM-app/`（见 `vite.config.js`）。

---

## 目录结构

```
crm-app/
├── public/
│   ├── logo.png            # 登录页 logo
│   ├── icon-192/512.png    # PWA 图标
│   ├── manifest.webmanifest
│   └── sw.js               # Service Worker
├── src/
│   ├── components/         # 复用组件
│   │   ├── PhoneFrame.jsx  # 手机外框（桌面演示用）
│   │   ├── TabBar.jsx      # 底部 4-Tab
│   │   ├── FAB.jsx
│   │   ├── FeatureIcon.jsx # 应用宫格图标（含 iconfont 兜底）
│   │   ├── FormKit.jsx     # Section / Field / SelectField / FormActions
│   │   └── DateRangePicker/  # 钉钉式日期区间选择器（portal 渲染）
│   ├── pages/              # 一个子目录 = 一个路由页
│   ├── data/
│   │   └── mock.js         # 演示数据 + 菜单树（MENU_TREE）
│   ├── App.jsx             # 路由表
│   ├── main.jsx            # 入口 + PWA 注册
│   └── index.css           # Tailwind base + 自定义工具类
├── docs/
│   └── crm-pc-crud-analysis.md   # PC 端分析文档（参考）
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 设计原则

- **钉钉式移动端**：所有 PC 端弹窗 → 底部 sheet / 居中 modal；表格 → 卡片 + 横向滚动；左右双栏 → 上下堆叠。
- **PhoneFrame 演示**：桌面浏览器打开自动套上 9:16 手机壳，避免与 PC 端混淆。
- **分组标题左对齐**：`group-title` 永远不带 `justify-between`（标题与右侧操作分离时另起一行）。
- **首卡标签稳定**：分组内首张卡片的字段标签不随筛选条件变化，确保用户对卡片布局形成稳定预期。
- **底部按钮 sticky**：所有表单底部按钮（取消/确定/返回）使用 `sticky bottom-0` 而非 `fixed`，避免在桌面浏览器跨出 PhoneFrame。
- **品牌色统一**：所有主操作按钮统一使用 `bg-brand`（白字），不再用绿色按钮。
- **筛选条件独立**：首页三大板块各自独立时间 chip，互不污染。
- **日期筛选统一 DateRangePicker**：所有列表/筛选页面的日期输入（含"创建日期 / 申请日期 / 操作时间 / 统计日期"等）一律复用 `src/components/DateRangePicker`，**禁止在业务代码里手写 `<input type="date">` 或自造"不限"文案**。组件默认对齐 `MediaDailyReportPage` 的本地版本：未选时 chip 显示「请选择」，日历内仅 4 个 preset（今日/昨日/近7日/近30日），底部按钮为「清空 + 确定」。
- **顶部栏不渲染三点（⋮）**：所有 TopBar / TopBarWithBack **不再放置右上角"更多"按钮**（commit `9faf30c`）。App 端所有功能入口已通过左侧导航 + 二级菜单完整暴露，无需占位。
- **图标语义准确**：`ChildMenuGrid` / 工作台宫格 / 工作台搜索结果统一渲染 `FeatureIcon`，按 `c.icon || c.label` 映射——优先使用 mock.js `caidan.json` 节点上手工指定的 `icon` 英文 key（如开户申请=`edit`、开户明细=`document`、账户列表=`files`、任务列表=`tickets`），fallback 才走 label 模糊匹配。**禁止在 ChildMenuGrid 用硬编码"4 宫格"图标**——会让所有子菜单看起来一模一样。

---

## 路由总览

> 文件：`src/App.jsx`，全部走 **HashRouter**。路由前缀 `#`。

| 路径 | 页面组件 | 说明 |
| --- | --- | --- |
| `/login` | `Login` | 登录页 |
| `/` | `Home` | 首页（KPI + 折线图 + 销售榜） |
| `/work` | `Work` | 工作台 |
| `/me` | `Me` | 我的 |
| `/m/:id`、`/m/:id/:subId` | `MenuPage` | 通用菜单页（按 `caidan.json` 节点渲染） |
| `/performance` | `PerformancePage` | 业绩汇总（4 维度 + 媒体卡） |
| `/group/create` | `GroupCreatePage` | 新建集团 |
| `/group/edit/:id` | `GroupEditPage` | 编辑集团 |
| `/group/detail/:id` | `GroupDetailPage` | 集团详情（9 Tab） |
| `/group/handover/:id` | `GroupHandoverPage` | 集团交接 |
| `/group/balance/:id` | `InitialBalancePage` | 期初余额 |
| `/subject/create`、`/subject/edit/:id` | `SubjectEditPage` | 新建/编辑主体 |
| `/subject/detail/:id` | `SubjectDetailPage` | 主体详情（4 Tab） |
| `/group/contact/:id` | `ContactCreatePage` | 新建联系人 |
| `/group/background/:id` | `BackgroundEditPage` | 编辑背调 |
| `/account/create`、`/account/edit/:id` | `AccountCreatePage` | 新增/编辑开户主体 |
| `/account/operator-edit/:advId` | `AccountOperatorEditPage` | 修改运营 |
| `/project/create`、`/project/edit/:id` | `ProjectCreatePage` | 新建/编辑项目 |
| `/project/detail/:id` | `ProjectDetailPage` | 项目详情 |
| `/project/restart/:id` | `ProjectRestartPage` | 项目重启 |
| `/advertiser/apply/new`、`/advertiser/apply/edit/:id`、`/advertiser/detail/import` | `AdvertiserApplyPage` | 开户申请新建/编辑/批量导入 |
| `/advertiser/apply/detail/:id` | `AdvertiserDetailPage` | 开户申请详情 |
| `/advertiser/detail/info/:id` | `AdvertiserDetailPage` | 开户明细详情 |
| `/advertiser/detail/entry/:id` | `AdvertiserDetailEntryPage` | 开户明细录入 |
| `/advertiser/account/detail/:id` | `AdvertiserAccountDetailPage` | 账户详情 |
| `/advertiser/account/batch-policy` | `AdvertiserAccountDetailPage` | 批量更换政策 / 批量共享钱包 |
| `/advertiser/task/detail/:id` | `AdvertiserTaskDetailPage` | 任务详情 |
| `/policy/detail/:id` | `PolicyDetailPage` | 政策详情 |
| `/policy/change/:id` | `PolicyChangePage` | 政策变更 |
| `/policy/live/create` | `LivePolicyCreatePage` | 新建直播政策 |
| `/policy/live/detail/:code` | `LivePolicyDetailPage` | 直播政策详情 |
| `/policy/material/create` | `MaterialPurchaseCreatePage` | 新建素材采买 |
| `/policy/material/detail/:id` | `MaterialPurchaseDetailPage` | 素材采买详情 |
| `/approval/detail/:id` | `ApprovalDetailPage` | 审批详情 |
| `/me/personal-info` | `PersonalInfo` | 个人信息 |
| `/me/workorder` | `WorkOrderListPage` | 工单列表 |
| `/me/workorder/detail/:id` | `WorkOrderDetailPage` | 工单详情 |
| `/me/workorder/create` | `WorkOrderCreatePage` | 提交工单 |

---

## 底部 Tab 导航

> 文件：`src/components/TabBar.jsx`，4 个 Tab。

| Tab | 路由 | 说明 |
| --- | --- | --- |
| 🏠 首页 | `/` | KPI 三板块 |
| 💼 工作 | `/work` | 工作台：搜索 / 快速入口 / 模块宫格 |
| ✅ 审批 | `/m/2278` | 跳转到菜单树中的「审批列表」节点 |
| 👤 我的 | `/me` | 用户卡片 + 代办 + 工单 + 设置 |

> 注：项目早期存在「报表」Tab，已注释保留代码，未在生产中渲染。

---

## 全局通用交互

### 钉钉式查询条件（所有列表页通用范式）

所有 Pattern B 列表页（主体管理、项目列表、集团列表、任务列表、政策列表、KPI 变更记录、审批中心等）的顶部查询卡统一采用「**单行：DateRangePicker + 漏斗**」结构：

```
┌────────────────────────────────────────────┐
│  [字段 ▾]  [ DateRangePicker 📅 ]   [🔽]   │  ← 单行：日期 chip + 高级筛选漏斗
│  [Chip 已选 1] [Chip 已选 2] [清空]        │  ← 已选条件 chips（漏斗产生）
└────────────────────────────────────────────┘
```

- 行内默认条件：`DateRangePicker`（创建日期 / 申请日期 / 操作时间 / 统计日期…）
  - 未选 → chip 显示 **「请选择」**（灰色 ink-400）
  - 已选 → 显示日期（`2026-08-26`）或区间（`08-26 ~ 08-30`）
  - 点击 → 弹出日历浮层（4 preset + 月份导航 + 7×6 网格 + 清空/确定）
- 漏斗按钮：右下角，激活时显示数字角标（高级筛选条件数）
- 高级筛选 Sheet：左字段栏（100px 宽）+ 右值区动态切换，支持 input / select / DateRangePicker 三种 kind
- 已选条件 chips：高级筛选 Sheet 内非空条件折叠显示在行 2，可点击 × 单项清除
- **三种 AdvancedFilter 变体**：① 钉钉式左右布局（最常用，左字段右值）；② 单列堆叠（用于字段少或语义独立的页面）；③ chip 行（与查询卡行 2 融合）。同一页面内只用一种，避免认知割裂。常见 `handleApply is not defined` bug 修复模式：组件闭包内必须显式定义 `const handleApply = () => { onClose() }`（不要在按钮 `onClick` 直接调 `onClose`，否则易漏掉重置 / 提交逻辑挂载位）。

> 早期版本曾使用「不限」chip 作为清空入口，已统一改为日历底部「**清空**」按钮 + 确定（清空后 chip 显示「请选择」），业务代码中**不得出现"不限"字样**。

### 钉钉式卡片

- 顶部：标题 + 副标题（编号/创建时间等次要信息）
- 中部：2 列字段网格（`grid-cols-2 gap-y-2 gap-x-3`）
- 底部：可扩展的操作行（详情/催办/变更等）

### Toast

- 成功：黑色背景 + 居中 + 绿色 ✓ icon
- 失败：错误描述，2 秒自动消失

### Sheet / Modal

- 底部弹出（`items-end` + `rounded-t-2xl`）默认高度 60/80vh
- 居中 modal：用于轻量确认（撤销、复制账户）
- 关闭：右上角 X、底部「取消」、点击遮罩均可

### 底部按钮 sticky 模板

```jsx
<div className="sticky bottom-0 bg-white px-3 py-3 z-30 flex gap-3 border-t border-ink-100">
  <button className="flex-1 h-11 bg-white border border-ink-200 rounded-full ...">取 消</button>
  <button className="flex-1 h-11 bg-brand text-white rounded-full ...">确 定</button>
</div>
```

---

## 页面与功能详解

> **约定**：每个页面按 `顶部栏 / 查询条件 / 列表 / 详情字段 / 按钮 / 弹窗` 6 个维度描写，确保前端工程师改不动时知道在哪改、QA 知道点哪里。

---

### 1. 登录页

**路由**：`/login` &nbsp;·&nbsp; **文件**：`src/pages/Login/index.jsx`（180 行）

- **顶部**：上 2/3 蓝色渐变 + 装饰光晕 + 圆点装饰 +  logo；下 1/3 白底表单卡。
- **主标题**：「CRM管理系统」（**注意无空格**）+ 副标题「开户、投放、消耗、返点，一屏掌控」。
- **输入区**：
  - 手机号 input（`maxLength=11`，type=`tel`），右侧一键清除按钮。
  - 密码 input（`maxLength=20`），右侧清除 + 显隐切换（👁/👁‍🗨）按钮。
- **校验**：
  - 手机号必填 + `^1[3-9]\d{9}$` 正则。
  - 密码必填 + 至少 6 位。
  - 错误信息以 `text-[11px] text-danger ml-4` 显示在输入框下方。
- **登录按钮**：「登录工作台」按钮，蓝色渐变背景 + 阴影。
- **底部备案**：`v1.0.0 ·`。
- **成功后**：toast「登录成功」→ 600ms 后跳转 `/work`。

---

### 2. 首页 `/`

**文件**：`src/pages/Home/index.jsx`

#### 顶部 CRM Bar

- 蓝色背景 `#2D7FF9` + 白字「CRM」标题，右侧一个圆形**刷新按钮**（半透明白底；当前为占位装饰，**未绑定 onClick**，刷新动作发生在各板块 chip 行的右侧按钮上）。

#### 板块 1 · 核心客户数据（5 列 KPI）

- 独立时间 chip：`昨天 / 近7天 / 本周 / 本月 / 本年`（默认 `昨天`）。
- chip 右侧一个**刷新按钮**（点击 800ms 转圈 + toast「刷新成功」）。
- 5 列横滑 KPI：每列宽 120px，纵向 3 行（标签 / 数值 / 趋势 ↑↓ %）。
- 趋势颜色：`text-danger` 表示上升，`text-success` 表示下降。

#### 板块 2 · 头条总消耗 + 折线图（独立 chip：默认本周）

- chip 区与板块 1 一致。
- 标题：当前平台名 + 数值 + 趋势。
- 平台 chips（横滑，源自 `mock.js:platforms` 共 11 个）：**头条总 / 头条-AD / 头条-千川 / 头条-本地推 / 腾讯 / 快手 / 小红书 / 微博 / TikToK / Meta / google**。
- 折线图（Recharts `LineChart`）：
  - 数据按 `plat × platTime` 动态生成（yest=1 点 / w7=7 点 / month=本月全月 / year=12 个月）。
  - 月和年节点 > 7 时，图表撑出宽度启用横向滚动；切到 month/year 自动滚到最右（最新数据）。
  - X 轴间隔按节点数动态调整；Y 轴单位「w」（万元）。

#### 板块 3 · 销售排行（独立 chip：默认昨天）

- 标题右侧切换按钮：**集团榜 / 公司榜**（单选按钮组；与左侧标题同行——**这是首页允许的极少数 `group-title justify-between` 例外**，其他所有页面必须遵守左对齐原则）。
- 列表 Top 5：每行 `排名圆形徽章 + 名称 + 副标题 + 金额 + 趋势%`。
- 排名徽章配色：1=`bg-danger` 红，2=`bg-warning` 橙，3=`bg-brand` 蓝，4-5=`bg-ink-100` 灰。

---

### 3. 工作台 `/work`

**文件**：`src/pages/Work/index.jsx`

#### 顶部栏 `TopBar`

- 标题「工作台」；非登录态可见。

#### 搜索栏 `SearchBar`

- 圆角输入框（默认 `bg-ink-100`，focus 变白底 + 品牌色边框）。
- placeholder「搜索应用名称」。
- 实时高亮匹配关键字（蓝色 + 字重）。
- 结果浮层：分组显示「快速入口 / 业务管理 / 运营中心 / 财务数据看板 / 媒介数据看板」。
- **图标准确**：搜索结果左侧 `FeatureIcon` 走 `c.icon || c.label`——优先取 mock.js 节点上的英文 icon key，未见才 fallback 到中文 label 模糊匹配；保证开"政策变更"不会显示成"政策"图标。
- 点击外部区域关闭。

#### 快速入口（4 列宫格，无「全部」按钮）

| 入口 | 跳转目标 | 图标 key |
| --- | --- | --- |
| 新建项目 | `/m/2277` | `项目管理` |
| 开户 | `/m/1562` | `开户` |
| 录入广告主ID | `/m/1563` | `主体管理` |
| 新建直播政策 | `/m/2756` | `直播` |
| 新建素材采买 | `/m/2757` | `素材` |

#### 模块区块（每个一级模块一个卡片）

- 标题 + 前 6 个子菜单 + 「全部」icon 入口。
- **图标**：每个子菜单卡片渲染 `FeatureIcon name={c.icon || c.label}`，按 mock.js 中每个菜单节点的 `icon` 字段取（业务管理=蓝、运营中心=橙、财务数据看板=紫、媒介数据看板=紫）。
- 点击「全部」→ `/m/<模块id>`。

> 模块清单（来自 `caidan.json` pid=0）：业务管理 / 财务中心（隐藏） / 运营中心 / 财务数据看板 / 媒介数据看板。

---

### 4. 通用菜单页 `/m/:id`

**文件**：`src/pages/MenuPage/index.jsx`（7922 行，全 Demo 的核心文件）

> 根据 `node.template` 路由到不同的渲染分支：

| `template` | 渲染组件 |
| --- | --- |
| `list` | `ListSection`（表格 + 横向滚动） |
| `groupList` | `GroupListSection`（卡片 + 钉钉式查询 + 分页） |
| `subjectList` | `SubjectListSection`（按 `index` 二次分发） |
| `projectList` | `ProjectListSection` |
| `poolDataList` | `PoolDataSection` |
| `operationList` | `OperationListSection` |
| `accountIdList` | `AccountIdSection` |
| `operationReport` | `<OperationReportPage node={node}/>`（独立文件，详见 §18） |
| `mingdian` | `ConsumptionReportSection` + `MINGDIAN_CONFIG` |
| `operatorDashboard` | `ConsumptionReportSection` + `OPERATOR_DASHBOARD_CONFIG` |
| `customerPolicy` | `CustomerPolicySection` |
| `approval` | `ApprovalCenterSection` |
| `dashboard` | `DashboardSection` |
| `advertiserApplyList` / `advertiserDetailList` / `advertiserAccountList` / `advertiserTaskList` | `AdvertiserListSection`（4 套 config） |
| `deptKpi` / `deptKpiSetting` / `staffKpiSetting` / `staffKpiReport` | 对应 KPI 模块 |
| `changeLog` | `ChangeLogSection` |
| `balanceReport` / `selfOperationReport` / `customerHealthReport` | 独立子页 |
| `mediaMonthlyReport` / `mediaDailyReport` / `mediaWeeklyReport` / `mediaQuarterlyReport` / `mediaSemiAnnualReport` / `mediaYearlyReport` | 对应媒体报表子页 |

#### 通用组件

- `TopBar`：标题 + 返回 + 面包屑（`我的 / xxx` 或 `工作台 / xxx` 或 `父路径 / 当前`）。来源 `?from=me|work` 自动加面包屑。
- **顶部栏已不再渲染三点（⋮）更多按钮**（commit `9faf30c`）—— 全 Demo 统一去除，避免误以为漏下"更多"功能。
- `ChildMenuGrid`：4 列宫格，显示当前节点的子菜单。**统一使用 `FeatureIcon` 渲染**，按 `c.icon || c.label` 映射图标（mock.js 中每个子菜单节点都设置了 `icon` 字段：开户申请=`edit`、开户明细=`document`、账户列表=`files`、任务列表=`tickets` 等）。
- 多个列表页右下角 **FAB**：`新建集团 / 新建项目 / 新建客户 / 新建开户主体 / 新建直播政策 / 新建素材采买`。

---

### 5. 集团管理

#### 5.1 集团列表（菜单 id=99，template=`groupList`）

- **钉钉式查询卡（2 行）**：
  - 第 1 行：字段 chip「集团名称」+ 关键字 input + 🔍。
  - 第 2 行：字段 chip「创建人」+ 关键字 input（无搜索 icon，对齐）。
- **共 N 条**：右上角统计。
- **卡片列表**：每张卡片字段见 `node.fields`。
- **分页**：底部分页器 + 跳转输入（`<input defaultValue=1 />` + 「前往 N 页」）。
- **FAB**：「新建集团」。

#### 5.2 集团详情 `/group/detail/:id`

**文件**：`src/pages/GroupDetailPage/index.jsx`（875 行）

> **9 个 Tab 横滑**：`集团信息 / 业务主体 / 项目 / 政策 / 账户ID / 充值记录 / 集团备款 / 开票 / 回款`
> **顶部栏仅 onBack + title，无 info icon**（commit `9faf30c` 同步去除三点）。

| Tab | 关键交互 |
| --- | --- |
| 集团信息 | 4 个 Section（基本信息 / 资金信息 / 联系人 / 背调信息）；联系人右上有「新建联系人」；背调信息右上有「编辑」 |
| 业务主体 | 单输入搜索 + 2 列字段卡片（12 字段） |
| 项目 | 单输入搜索 + 2 列字段卡片（9 字段） |
| 政策 | 单输入搜索 + 2 列字段卡片（17 字段） |
| 账户ID | 单输入「广告主ID」+ 2 列字段卡片（12 字段） |
| 充值记录 | **2 行查询**：第 1 行「广告主ID」+ 输入；第 2 行「充值集团名称」+ 漏斗筛选；导出按钮；2 列字段卡片（15 字段） |
| 集团备款 | 单输入「备款单号」+ 卡片列表（10 字段） |
| 开票 / 回款 | 占位「暂无数据」 |

#### 5.3 新建集团 `/group/create`

- 4 个 Section：基本信息（集团简称 + 看板分析简称）/ 评级与分类（星级 + 集团属性 + 类型）/ 其他信息（标签 + 备注）/ 附件（上传按钮）。
- **星级评分**：`StarRating` 组件（5 颗 SVG 星 + 文字「X 星 / 未评分」）。
- **下拉选择**：集团属性（`二代 / 非二代`）、集团类型（`预付 / 后付`）。
- **底部按钮**：取消 + 确定（均返回 `/m/99`）。

#### 5.4 编辑集团 `/group/edit/:id`

- 同新建，预填该集团已有数据。
- 取消/确定均 `nav(-1)`。

#### 5.5 集团交接 `/group/handover/:id`

- 顶部 3 列只读信息卡（集团名称 / 创建人 / 当前销售人员）。
- 表单：部门 + 交接人（必填）+ 交接内容（`集团 / 项目`）。
- 底部 sticky「取消 / 确定」。

#### 5.6 期初余额 `/group/balance/:id`

- 简单 input 表单（金额）。
- 底部「取消 / 确定」按钮。

#### 5.7 新建联系人 `/group/contact/:id`

- 2 字段：联系人姓名（必填）+ 手机号（必填，maxLength=11）。
- 底部「取消 / 确定」。

#### 5.8 编辑背调信息 `/group/background/:id`

- 多个 Section：上市与否 + 集团来源；合作媒体 + 申请授信额度（万）；投放产品 + 成立时间；人员规模 + 合作代理；预估日消耗 + 公司背景（textarea）；公司LOGO + 营业执照 + 办公场景（3 个 URL 字段）。
- 顶部右侧 X 关闭按钮。

---

### 6. 业务主体管理

#### 6.1 主体列表 `SubjectListSection`

- **钉钉式查询卡**：第 1 行字段 chip + 输入 + 🔍；第 2 行 chip 多维（合作模式 / 媒体平台 / 项目状态 / 行业）+ 更多筛选（漏斗）。
- **共 N 条 + 导出按钮**（右上角）。
- **卡片列表**（按 PC 截图字段）：编号 / OA创建日期 / 生效状态 / 综合评分（含进度条）/ 所属行业 / 标签 / 银行账号 / 注册电话 / 统一社会信用代码 / 账户类型 / 集团ID / 创建人 / 创建时间 / 更新时间。
- **分页** + 跳页输入。
- **FAB**：「新建客户」。

#### 6.2 新建/编辑主体 `/subject/create`、`/subject/edit/:id`

- 基础信息：客户名称（必填）+ 集团池（chip 多选，必填）→ 底部 sheet 多选。
- 工商信息：客户全称 / 统一社会信用代码 / 账户类型（下拉）/ 注册电话 / 开户银行 / 开户银行账号 / 注册地址。
- 其他信息：所属行业 + 客户备注。
- 底部「取消 / 确定」。

#### 6.3 主体详情 `/subject/detail/:id`

> **4 个 Tab**：客户信息 / 项目 / 政策 / 主体

- 客户信息：基本信息 + 工商信息 + 其他信息。
- 项目：单输入搜索「项目名称」+ 2 列字段卡片 + 分页。
- 政策：单输入搜索「政策名称」+ 2 列字段卡片 + 分页。
- 主体（高级搜索）：
  - 第 1 行：字段切换 chip（`开户主体名称 / 开户主体 ID / 客户编号`）+ 输入 + 🔍。
  - 第 2 行：chip「媒体平台」+ chip「集团」+ 漏斗。
  - 右上「新增主体」按钮 → `/account/create`。
  - 2 列卡片 + 分页 + 「高级筛选」sheet（媒体平台 + 集团 chips）。

---

### 7. 项目管理

#### 7.1 项目列表 `ProjectListSection`

- **钉钉式查询卡**：
  - 第 1 行：字段 chip（项目名称 / 项目编号 / 内部自动编码 / 项目编号(短)）+ 输入 + 🔍。
  - 第 2 行：chip「集团名称」+ chip「客户主体」+ 「更多筛选」按钮（含角标）。
- **共 N 条**。
- **项目卡片**：左侧项目名称 + 编号；右侧按审批状态显示 chip 标签；底部 3 个操作按钮（详情 / 撤销 / 重新发起）。
- **撤销**：触发居中 modal，输入撤销备注，确认后 toast「撤销成功」。
- **分页**：每页 5 条 + 跳页。
- **FAB**：「新建项目」。

#### 7.2 新建/编辑项目 `/project/create`、`/project/edit/:id`

- 基本信息：项目框架名称（必填）/ 所属集团（必填）/ 主体池 / 销售类型（单选：`KA服务 / 销管`）。
- 项目明细：可添加多个「政策」卡；**每卡 13 字段**：政策名称（只读，自动编译）/ 投放平台 / 初始合作模式 / 服务单类型 / 付款方式 / 客户返点(%) / 服务费(%) / 垫款账期(天) / 客户类别 / 业绩归属人 / 生效时间 / 失效时间 / 备注。
- 顶部「添加政策」按钮。
- 底部 sticky「取消 / 提交」。

#### 7.3 项目详情 `/project/detail/:id`

- 3 个可折叠 Section：基本信息 / 明细信息 / 审批流。
- 明细信息：政策列表（每个政策一张可折叠卡）。
- 审批流：2 个子 Tab：
  - **CRM预审流程**：3 张 KPI（通过 / 审批中 / 驳回）+ 横向双节点 timeline（申请人 ↔ 审批人）。
  - **飞书终审流程**：左侧绿点 + 连接线 + 右侧卡片列表。

#### 7.4 项目重启 `/project/restart/:id`

- 表单：项目编号（只读）+ 重新启动原因（textarea，必填）+ 截图附件上传。
- 底部「取消 / 提交」。

---

### 8. 广告主 ID 管理

> 通过 `MenuPage` 的 4 套 config 渲染：**开户申请 / 开户明细 / 账户列表 / 任务列表**。

#### 8.1 开户申请列表（template=`advertiserApplyList`）

- 查询卡（同上）；共 N 条 + 导出。
- 卡片字段：开户序列号 / 集团名称 / 政策名称 / 服务商池 / 销售 / 创建人 / 创建时间 / 状态 tag。
- 顶部有「新建申请」「多开户导入」按钮（`extraHeader`）。
- 卡片底部操作：详情 / 撤销 / 重新发起。
- FAB：「新建开户申请」→ `/advertiser/apply/new`。

#### 8.2 开户明细列表（template=`advertiserDetailList`）

- 与开户申请列表结构相似，字段不同。

#### 8.3 账户列表（template=`advertiserAccountList`）

- **钉钉式查询卡**：第 1 行字段（`账户 ID / 账户名称 / 开户序列号 / 所属客户`）+ 输入；第 2 行 chip（`生效状态 / 政策 / 媒体平台 / 行业`）+ 更多筛选。
- **共 N 条 + 导出**。
- **Tab 切换**：单个 / 批量（带复选框）。
- **卡片列表**：14 字段（含广告主ID、广告主名称、媒体平台、所属销售等）。
- 卡片操作：详情 / 更换政策 / 共享钱包 / 变更记录。
- **批量操作**（批量模式）：
  - 批量更换政策 Modal：上下分区，「目标政策」下拉 + 说明文案 + 「取消 / 确认提交」。
  - 批量共享钱包 Modal：底部 sheet，「目标钱包 ID」input + 说明文案 + 「取消 / 确认提交」。
  - 变更记录 Modal：双 tab（政策变更 / 钱包变更）列表。
- FAB：「新建账户」。

#### 8.4 任务列表（template=`advertiserTaskList`）

- 钉钉式查询 + 共 N 条 + 导出。
- 卡片：任务 ID / 复制广告主ID / 集团 / 类型 / 状态 tag / 录入数量 / 录入结果 / 失败原因 / 创建时间。
- FAB：「新建录入」。

#### 8.5 开户申请新建/编辑/导入 `/advertiser/apply/new`、`/advertiser/apply/edit/:id`、`/advertiser/detail/import`

- **共享字段**：
  - 集团池（必填，下拉）
  - 政策（必填，下拉）—— 选择后**自动带出**服务商池
  - 服务商池（必填，下拉）
- **开户明细**：可添加多个「账户」卡；每卡 9 字段：
  - 明细名称 / 开户主体 / 类型 / 一级行业 / 二级行业 / 关键词 / 开户ID总数 / 媒介开户人 / 备注
- 每卡顶部有「复制 / 删除」按钮（删除按钮仅在 >1 张时显示）。
- 卡片列表上方有「添加账户」「新建主体」按钮。
- **新建主体 Modal**：居中弹窗，输入主体名称 → 自动追加「有限公司」 → 加入开户主体下拉选项。
- 底部 sticky「提交 / 保存」按钮。

#### 8.6 开户申请/明细详情 `/advertiser/apply/detail/:id`、`/advertiser/detail/info/:id`

- 头部卡：标题 + 状态。
- Section：基本信息（KV 双列）。
- 开户申请详情无底部按钮；开户明细详情底部「返回」。

#### 8.7 开户明细录入 `/advertiser/detail/entry/:id`

- 板块 1：明细基本信息（9 字段只读 KV）。
- 板块 2：录入方式选择（3 个 chip：`复制账户 / 批量导入 / 手工录入`）。
  - 复制账户 → 居中 modal：选择源账户明细 → 确认复制。
  - 批量导入 → 「添加附件」+「下载模板」。
  - 手工录入 → 「新增一行」+ 表格 4 列（广告主ID / 前返比例 / 有效期开始 / 有效期结束）。
- 底部 sticky「取消 / 保存」。

#### 8.8 账户详情 `/advertiser/account/detail/:id`

- 头部卡：广告主名称 + 状态 tag。
- 账户信息 Section：**19 字段 KV**（开户序列号 / 任务记录ID / 广告主ID / 广告主名称 / 绑定钱包ID / 媒体账号状态 / 政策名称 / 所属销售 / 一级行业 / 二级行业 / 媒体平台 / 客户名称 / 客户集团 / 充值录入返点 / 政策返点比例 / 来源 / 创建人 / 创建时间 / 更新时间）。
- 底部 sticky「返回 / 导出ID」。

#### 8.9 任务详情 `/advertiser/task/detail/:id`

- 头部卡：复制广告主ID + 状态 tag。
- 任务信息 Section：**10 字段**（任务ID / 复制广告主ID / 集团 / 任务类型 / 任务状态 / 录入数量 / 录入结果 / 失败原因 / 创建时间 / 更新时间）。
- 底部「返回 / 导出ID」。

#### 8.10 修改运营 `/account/operator-edit/:advId`

- 顶部显示广告主ID。
- 板块 1：当前运营人员（4 列表格：运营人员 / 运营状态 / 生效日期 / 失效日期；状态/日期可编辑）。
- 板块 2：新增运营人员（默认 1 行，「新增」按钮追加；每行 2 列字段；底部「删除」按钮）。
- 底部「取消 / 确认」（含必填校验）。

---

### 9. 政策管理

#### 9.1 政策列表（template=`subjectList` & `index=Policy`）

- 钉钉式查询卡（字段 `政策名称 / 客户名称 / 项目名称 / 集团名称` + 关键字）。
- 行 2：`审批状态` chip（`审批通过 / 审批中 / 已驳回`）+ `付款方式` chip + 漏斗更多筛选。
- 共 N 条 + 「下载」按钮。
- 卡片字段：政策名称 / 政策编号 / 客户名称 / 项目名称 / 集团名称 / 媒体平台 / 客户类型 / 客户行业 / 合作模式 / 竞价类型 / 付款方式 / 返点比例 / 服务费比例 / 首充预估金额 / 预付资金金额 / 垫款账期 / 媒介开户人 / 创建人 / 创建时间 / 更新时间。
- 卡片底部操作：详情 / 催办 / 变更。
- 分页（含跳页）。

#### 9.2 政策详情 `/policy/detail/:id`

- 3 个可折叠 Section：政策信息 / 原政策信息（仅在有历史变更记录时显示）/ 审批流。
- 政策信息：22 字段双列 + 审批状态 tag。
- 审批流：竖向节点 timeline（绿点=通过、黄点=审批中、红点=驳回）。

#### 9.3 政策变更 `/policy/change/:id`

- 政策信息 Section：政策名称（只读）/ 投放平台 / 初始合作模式 / 服务单类型 / 付款方式 / 服务费(%) / 垫款账期(天) / 客户类别 / 业绩归属人。
- 返点信息 Section：原返点失效日期（必填）/ 新返点生效日期（必填）/ 客户返点(%)(必填) / 服务费比例(%) / 备注。
- 含必填校验 + toast 反馈。

#### 9.4 直播政策列表（template=`subjectList` & `index=LivePolicy`）

- 查询卡：行 1 字段 chip + 输入；行 2 起止日期 + 审批状态 chip + 漏斗。
- 共 N 条 + 导出。
- 卡片底部操作：详情 / 撤销 / 重新发起（重新发起会跳到新建页并预填）。
- 分页 + 跳页 + 重置/查询按钮（仅在有筛选时显示）。
- FAB：「新建直播政策」。

#### 9.5 新建直播政策 `/policy/live/create`

> 5 个 Section 的长表单（387 行）：

1. **客户信息**（集团 / 客户名称 / 代投客户政策 / 行业 / 基础费用 / GMV 分佣 / 备注情况）
2. **投放要求**（投放媒体 / 日预算 / 月预算 / 阶梯预算 / 人群定位 / 投放点位）
3. **直播要求**（时长要求 / 代播账号名称 / 粉丝量 / 历史开播情况 / 直播现状 / 主播要求 / 整体货盘 / 直播风格 / 营销侧重 / 营销链路要求 / 品牌红线）
4. **考核标准**（投放目标 / 销售额及核销目标 / 客户考核要求 / 结算情况 / 数据复盘节点）
5. **申请信息**（申请人）

- 必填校验（5 项）：集团 / 客户名称 / 投放媒体 / 时长要求 / 申请人。

#### 9.6 直播政策详情 `/policy/live/detail/:code`

- 顶部信息 + 5 个 Section 折叠展示（对应新建页字段）。
- 底部「撤回」按钮（按审批状态显示/隐藏）。

#### 9.7 素材采买列表（template=`subjectList` & `index=MaterialPurchase`）

- 查询卡（同上结构）。
- 卡片操作：详情 / 催办 / 变更。
- FAB：「新建素材采买」。

#### 9.8 新建素材采买 `/policy/material/create`

**文件**：`src/pages/MaterialPurchaseCreatePage/index.jsx`（375 行）

> **4 个 Section**（不是 README 早期版本描述的 7 个）：**客户信息 / 预算 / 视频类型 / 申请信息**。
> 历史命名曾有"申请信息/项目信息/素材信息/投放计划/财务信息/附件/申请说明"7 段，已重构精简。

#### 9.9 素材采买详情 `/policy/material/detail/:id`

- 多 Section 折叠展示。

---

### 10. 报表中心

> 入口：`/reports`（**已不在底部 Tab 上**，可由菜单节点跳转）

**文件**：`src/pages/Reports/index.jsx`（164 行）

- KPI 4 宫格：本月总消耗 / 本月回款 / 总客户数 / 平均 ROI。
- 报表分类 6 宫格（链入 caidan.json 节点）：业务管理报表 / 运营中心报表 / 媒介数据看板 / 财务数据看板 / KPI 报表 / 客户健康。
- 近 7 日销售业绩（折线图：金额 + 客户数）。
- 媒体渠道消耗占比（饼图）。
- 销售业绩排行 Top 5（柱状图）。

> 该页未挂在 TabBar 上，目前通过 `/reports` 路径可访问，主要供演示。
> ⚠️ Reports/index.jsx 第 71 行使用了 `group-title justify-between`（顶部 KPI 标题与右侧某个动作），**违反**设计原则（除非像首页「集团榜/公司榜」切换那种合理的例外）。建议下一轮重构清理。

---

### 11. 业绩汇总 `/performance`

**文件**：`src/pages/PerformancePage/index.jsx`

#### 顶部栏

- 标题「业绩汇总」+ 右上「**导出**」按钮（品牌色 `bg-brand text-white h-7 px-3`）。

#### 维度 Tab

- 4 个 Tab：集团 / 销售 / 业绩归属人 / 运营。
- 切换维度时自动重置分页。

#### 查询行

- 日期范围按钮（点击弹出原生日历选择 modal：开始日期 + 结束日期 + 取消/确认）。
- 右侧「更多筛选」漏斗按钮（含 active 角标）。

#### 媒体消耗概览

- 横向滚动 8 张媒体卡（180px 宽）：
  - 全部 / 头条-AD / 头条-千川 / 头条-本地推 / 腾讯 / 快手 / 小红书 / 微博。
  - 每张：媒体名 / 非赠款消耗（万）+ 总消耗 / 赠款消耗 / 日均消耗 / 环比 %。
  - 当前选中媒体高亮（`bg-brand/5` + `text-brand`）。

#### 主体内容（按维度）

- **集团**：2 列卡片 = 集团名 + 主体 + 合作模式 chip + 金额。
- **销售 / 业绩归属人 / 运营**：顶部汇总条（本维度总金额）+ 2 列网格卡片（姓名 + 金额）。
- 分页（每页 15 条）。

#### 高级筛选 Sheet

- 销售 / 业绩归属人 / 运营人员 / 集团 / 客户主体 / 媒体平台 / 销售部门 / 合作模式 等 8 个字段 chips。

---

### 12. 部门 KPI 报表

**模板**：`deptKpi` &nbsp;·&nbsp; **文件**：`src/pages/MenuPage/index.jsx` 内 `DeptKpiReportSection`

- **顶部 Sticky 筛选条**：
  - 销售部门（多选 chip，「全部」+ 所有部门）。
  - 媒体平台（单选 chip，「全部」+ 9 个媒体）。
  - 日期维度 chip：年度 / 季度 / 月度。
  - 年份 picker（← 年 →）+ 季度 / 月份 picker。
- **KPI 概览卡**：4 列（消耗 / 回款 / ROI / 客户数）+ 趋势 %。
- **媒体消耗概览**（横向滚动 9 张媒体卡）+ 选中高亮联动下方图表。
- **饼图**：非赠款消耗 vs 赠款消耗。
- **柱状图**：行业 × 媒体堆叠。
- **部门明细表**：每个部门一行（部门 / 客户数 / 消耗 / 回款 / ROI / 趋势）。
- **底部 sticky 重置 / 提交**（仅设置页有）。

---

### 13. 部门 KPI 目标设置

**模板**：`deptKpiSetting`

- 顶部：日期选择（年 + 月） + 部门 picker。
- 表格化 KPI 设置：每个部门一行，列出所有媒体列。
- 「重置 / 提交」底部按钮。

---

### 14. 员工 KPI 目标设置

**模板**：`staffKpiSetting` &nbsp;·&nbsp; **函数**：`StaffKpiSettingSection`

- 顶部 sticky：月份 picker + 销售部门 picker。
- **员工卡片列表**：每员工一张卡，含 9 媒体 × KPI 输入（2 列网格）。
- 底部 sticky「重置 / 提交」。

---

### 15. 员工 KPI 报表

**模板**：`staffKpiReport`

- 顶部：日期维度选择。
- 表格：员工 × 媒体 KPI 完成率。
- 导出按钮。

---

### 16. 变更记录

**模板**：`changeLog` &nbsp;·&nbsp; **函数**：`ChangeLogSection`

- 顶部筛选：变更类型 / 变更人 / 时间范围。
- 变更记录卡片：变更类型 + 操作人 + 变更前 / 变更后对比 + 时间。

---

### 17. 底池数据列表

**模板**：`poolDataList` &nbsp;·&nbsp; **函数**：`PoolDataSection`

#### 顶部钉钉式查询条（3 字段一行）

- 统计日期（起 / 结束）+ 账号 ID + 账号名称。

#### 状态 Tab + 平台 chip sticky

- 已匹配 / 未匹配。
- 全部 / 头条 / 腾讯 / 快手 / 小红书 / 微博 chip 横滑。

#### 列表卡片（22 字段折叠展示）

- 统计日期 / 代理商ID / 客户ID / 客户名称 / 直客ID / 直客客户名称 / 一级行业 / 二级行业 / 注册时间 / 总消耗 / 赠款消耗 / 非赠款消耗 / 预付消耗 / 授信消耗 / 子钱包ID / 共享子钱包名称 / 共享钱包消耗 / 共享预付消耗 / 共享授信消耗 / 代理商子账户ID / 代理商子账户名称 / 一级代理商客户ID。

#### 操作

- 「匹配」「导出」按钮（带 loading 蒙层）。
- 上传底池文件 Modal。
- FAB：「上传底池」。
- 分页（含跳页输入）。

---

### 18. 运营报表

**模板**：`operationReport` &nbsp;·&nbsp; **文件**：`src/pages/OperationReportPage/index.jsx`（1092 行，独立页面，与 `MediaMonthlyReportPage` 风格对齐）

> 4 个周期子节点（id `2767-2770`：运营日报 / 周报 / 月报 / 季报）共用同一组件，由 `MenuPage` 按 `node.id` 分发周期。
> 重构于 Round 1 + Round 2：详情由原来的路由跳转 (`/monthly/detail` + `MonthlyReportDetailPage`) 改为**页内全屏 Sheet**，并对齐媒介月报的 UI 范式。

#### 顶部栏

- `TopBar`：标题 = 当前周期（运营日报 / 周报 / 月报 / 季报）+ 返回 + 面包屑。

#### 行 1 · 统计周期 + 漏斗

- 「统计 + 周期标签」+ **picker**（不是 chip——按周期显示 DateRangePicker / WeekYearPicker / MonthYearPicker / QuarterYearPicker，自动按 `period` 切换）+ 🔽 高级筛选漏斗（含 active 角标）+ 导出按钮。
- 高级筛选 Sheet：左字段栏（100px 宽）+ 右值区动态切换；字段 5 项：媒体平台(多选) / 部门 / 合作模式 / 付款方式 / 集团。

#### 行 2 · Tab

- 维度 Tab：「运营 / 部门」（切换时重置 `page` 与 `activeCard`）。
- **TabRow 没有刷新按钮**——刷新通过 PeriodRow 的整体刷新按钮 + 导出邻位触发。

#### 媒体消耗概览（横向滚动 9 张卡）

- 9 张媒体卡，每张 150px 宽，含蓝色左竖条 + 媒体名 + KPI 概览。
- 点击媒体卡 → 切换 `activeCard`（不展开 drilldown；运营报表无 metric/split 数据，drilldown 没业务含义）。
- 当前选中媒体高亮（`bg-brand/5` + `text-brand`）。

#### 二代 / 非二代 / 其他 饼图

- **3 切片**（不是 2 段）：二代 / 非二代 / 其他（按当前媒体 `pie` 数据）。
- 3 色 `#2D7FF9` / `#FAAD14` / `#F5222D`。
- 点击切片 → 高亮 + 中心数字更新。

#### 消耗总额柱状图（**仅周报 / 月报 / 季报**）

- 蓝色柱体 `#2D7FF9`，**无 Recharts `<ReferenceLine>`**（对齐媒介月报样式）。
- **avg 平均值不画参考线**，而是展示在 GroupTitle 右侧 `日均 X.XX 万` 标签里。
- 顶部数值标签（白色）+ 底部 X 轴日期标签。
- 节点数 ≤ 12 时宽度撑到容器；>12 时横滑可滚动。
- 运营日报（`/m/2767`）**不渲染**此区块（单日无趋势意义）。

#### 行业 Top10 堆叠柱状图（**仅季报**）

- 数据按行业 × 媒体堆叠。
- 仅 `period === 'quarterly'` 时显示。

#### 环比筛选 + 二级卡片列表

- 环比筛选 chips：「全部 / 环比为0」（与媒介全周期统一；不再用"上升/下降"）。
- 二级卡片：运营人员或部门 + 消耗 / 回款 / ROI / 趋势。
- 分页：每页 8 条 + 跳页输入。

#### 详情 Sheet（**页内全屏**，非路由跳转）

- 点击二级卡片 → 打开页内 Sheet。
- Sheet 结构（复用 `MediaMonthlyReportPage` 的 `RankDetailSheet`）：
  - 行 1：实体名（运营人员 / 部门）+ 排名 + 关闭 X。
  - 行 2：Level-1 KPI（蓝色左竖条 + 排名 + 「环比 X · N 个客户」 + 总非赠款消耗）。
  - 行 3：Level-2 chips（按媒体平台切换）。
  - 行 4：Level-2 KPI（当前二级子项的非赠款消耗）。
  - 行 5：明细列表（**卡片**样式，与媒介月报对齐：日期 + 媒体平台 chip + 广告主名称 + 行业 chip + ID 后 6 位 + 金额，**不显示 customer 字段**）。
  - 行 6：分页（每页 5 条）。
- 数据源：`monthlyReportDetailData.{operator,dept}`（mock.js:3070）。

> ⚠️ Round 1 已删除 `src/pages/MonthlyReportDetailPage/index.jsx` 及 `/monthly/detail` 路由——直接访问会 404。

---

### 19. 账户 ID

**模板**：`accountIdList` &nbsp;·&nbsp; **函数**：`AccountIdSection`

- 钉钉式查询卡 + 共 N 条 + 下载。
- 单个 / 批量 Tab + 复选框。
- 高级筛选 Sheet。
- 「批量认领 / 分配运营」Modal。
- 分页。

---

### 20. 客户政策明细

**模板**：`customerPolicy` &nbsp;·&nbsp; **函数**：`CustomerPolicySection`

- 卡片列表，每张卡片可点击展开看全部字段。

---

### 21. 通用消耗报表（明点全景 / 运营人员看板）

**模板**：`mingdian` / `operatorDashboard` &nbsp;·&nbsp; **函数**：`ConsumptionReportSection`

- 钉钉式筛选（日期 + 维度 chip）。
- 横向滚动表格（自动撑出宽度）。
- 高级筛选 Sheet。
- 顶部「导出」按钮。

---

### 22. 媒体报表（日/周/月/季/半年/年）

| 路径 | 模板 | 文件 | 行数 | 周期选择器 |
| --- | --- | --- | --- | --- |
| `/m/...`（日） | `mediaDailyReport` | `MediaDailyReportPage` | 1227 | DateRangePicker（起止日期） |
| 同上 | `mediaWeeklyReport` | `MediaWeeklyReportPage` | 1188 | WeekYearPicker（年-周） |
| 同上 | `mediaMonthlyReport` | `MediaMonthlyReportPage` | 1202 | MonthYearPicker（**年-月**） |
| 同上 | `mediaQuarterlyReport` | `MediaQuarterlyReportPage` | 1271 | QuarterYearPicker（年-季度） |
| 同上 | `mediaSemiAnnualReport` | `MediaSemiAnnualReportPage` | 1187 | HalfYearPicker（年-上下半年） |
| 同上 | `mediaYearlyReport` | `MediaYearlyReportPage` | 1182 | YearOnlyPicker（年） |

> **6 页共用**：5 维度 Tab（集团 / 销售 / 业绩归属人 / 运营 / 部门）+ 排名卡列表（非 table）+ 媒体饼图 + KPI 卡 + 高级筛选 Sheet + 页内详情 Sheet。
> **柱状图差异**：5 张周/月/季/半年/年都有「行业维度柱状图」；**日报（`MediaDailyReportPage`）无柱状图**（与「运营日报无柱状图」同理，单日无趋势）。
> **季报**独有 2 张柱状图（行业堆叠 + BarSection）。
> **周期数据形状**：日报用 `{start, end}` 日期范围；其余 5 个用单字符串周期（`2026-W23` / `2026-07` / `2026-Q2` / `2026-H1` / `2026`）。

---

### 23. 头条余额报表

**模板**：`balanceReport` &nbsp;·&nbsp; **文件**：`src/pages/ToutiaoBalancePage/index.jsx`（553 行）

- **钉钉式查询卡**：第 1 行字段 chip（搜索集团/开户主体/广告主名称）+ 输入 + 🔍；第 2 行起止日期 picker + 漏斗更多筛选 + 刷新 + 导出按钮。
- **2 列汇总卡**：总余额 / 总消耗。
- **高级筛选 Sheet（左右布局）**：左字段栏 100px（端口 / 近7日消耗 / 余额可用天数 / 付款方式 / 合作模式 / 集团名称 / 开户主体，共 7 项）+ 右值区动态切换（select → chips，text → input）。
- 余额三色（红/黄/绿，按可用天数）。
- 客户余额表（`BalanceCard` 列表，按集团 / 子账户展开）。
- 导出按钮。
> ⚠️ README 早期版本曾提及"余额趋势折线图"，但代码中**未实现折线图组件**——只有汇总 + 客户余额列表。

---

### 24. 自运营报表

**模板**：`selfOperationReport` &nbsp;·&nbsp; **文件**：`src/pages/SelfOperationPage/index.jsx`（546 行）

- **2 列 KPI 汇总卡**：**非赠款消耗总计(元) + 方舟操作次数总计**（不是「消耗/客户数/客单价/趋势」四宫格）。
- 行 1 字段 chip（集团 / 开户主体 / 广告主名称）+ 输入 + 漏斗 + 导出。
- 高级筛选 Sheet（4 字段）：集团 / 部门 / 消耗范围(起/止) / 自运营占比(起/止)。
- 广告主卡片列表（非表格，按广告主维度排列）。
- 导出按钮（卡片右上角）。

---

### 25. 客户类型分析报表

**模板**：`customerHealthReport` &nbsp;·&nbsp; **文件**：`src/pages/CustomerHealthPage/index.jsx`（575 行）

> ⚠️ 文件名带 `Health`，实际是**「客户类型分析」报表**——按 6 类客户统计，非"健康度评分"。
> 历史命名沿袭，**不要按文件名字面理解为健康度 5 星**。

- 行 1：周期 chip（周 / 双周 / 月 / 季 / 半年 / 年）+ 漏斗。
- 6 张统计卡（横滑 150px）：存量客户 / 活跃新客 / 无效新客 / 复投客户 / 停投客户 / 整体流失率(%)。
- chips 行（4 行）：平台 / 合作模式 / 销售部门 / 销售（多选）。
- 集团客户类型 chips（活跃新客 / 无效新客 / 存量客户 / 复投 / 停投客户）切换列表内容。
- 列表头：搜索 input + 全部展开 + 刷新按钮。
- 集团卡片列表（每张含 5 类客户统计 + 详情展开）。
- 分页（每页 10 条）。

---

### 26. 审批中心

> 通过底部 Tab「审批」跳转 → `/m/2278`，对应 `MenuPage` 中的 `template='approval'`，渲染 `ApprovalCenterSection`。

#### 审批中心主页 `/approval`（已不直接挂载）

- KPI 3 列：待我审批（红）/ 我发起的（橙）/ 抄送我的（灰）。
- 两个入口卡片：「审批列表」「审批流配置」。
- 待审批列表：左侧色条（紧急红 / 普通蓝）+ 类型 chip + 标题 + 申请人 + 时间 + 金额 + 「查看 ›」按钮。

#### 审批中心 `/m/2278`（MenuPage 内部）

- 顶部：搜索 + 筛选。
- 状态 Tab：全部 / 待我审批 / 我发起的 / 抄送我的 / 已完成。
- 卡片列表：审批类型 + 标题 + 申请人 + 金额 + 「通过 / 驳回」按钮（直接在卡片操作）。
- 「驳回」弹底部 sheet：橙色警告 + 备注输入框 + 「确认驳回」。

#### 审批详情 `/approval/detail/:id`

- 3 个可折叠 Section：
  1. 基本信息（通用）
  2. 类型专属详情：
     - **直播政策** → 直播要求 / 直播时长 / 主播 / 货盘
     - **合同审批 / 回款审批 / 退款审批** → 销售政策详情（合同金额 / 回款节点 / 退款原因）
     - **项目** → 项目详情（项目名称 / 投放媒体 / 预算）
     - **开户申请** → 开户详情（开户主体 / 媒体平台）
     - **媒体备款** → 备款详情（媒体 / 备款金额 / 用途）
     - **其他** → 通用详情
  3. 审批流（节点 timeline）

---

### 27. 我的 `/me`

**文件**：`src/pages/Me/index.jsx`（198 行）

#### 顶部用户卡片

- 蓝色背景 + 头像首字「」+ 姓名「」+ 部门职位「技术部 / 产品经理」+ 右侧 chevron。

#### 我的代办（**7 类，数据源自 `mock.js:todos`**）

| 代办项 | 跳转 |
| --- | --- |
| 待开户需求 | `/m/1563?from=me` |
| 服务商充值(审批中) | `/m/2278?from=me` |
| 退款申请(审批中) | `/m/2278?from=me` |
| 销售政策(待审批) | `/m/2278?from=me` |
| 变更政策(待审批) | `/m/2278?from=me` |
| 项目(待审批) | `/m/2278?from=me` |
| 结算单(待审批) | `/m/2278?from=me` |

- 左色条：count > 5 红、> 2 橙、否则蓝。
- 数字徽章：count > 0 红字红底，count = 0 灰色。
- 顶部右侧统计：所有代办 sum（`group-title justify-between` 例外——右侧"共 N 项"为合计数）。

#### 我的工单

- 卡片 + 「工单记录」+ 副标题「查看全部工单 / 提交新工单」。
- 点击 → `/me/workorder?from=me`。

#### 设置入口

- 个人信息 → `/me/personal-info`。
- 修改密码 → 弹底部 modal（输入新密码 + 确认密码，含一致性校验）。
- 关于 CRM → v1.0.0。
- 退出登录 → `/login`。

#### 个人信息 `/me/personal-info`

- 头像卡片（首字 + ID）。
- 3 个 Section：基础信息 / 联系信息 / 账号信息。

---

### 28. 工单（App 端独有）

#### 28.1 工单列表 `/me/workorder`

- **4 个统计卡**：工单总数 / 处理中（橙）/ 已完成（绿）/ 已关闭（灰）。
- **查询行**：关键字 input（工单号 / 问题描述）+ 漏斗筛选按钮。
- **状态 Tab**：全部 / 处理中 / 已完成 / 已关闭。
- **卡片列表**：工单号 + 类型 chip（系统问题红 / 业务问题绿）+ 状态 tag。
- **FAB**：「提交工单」。

##### 高级筛选 Sheet

- 左侧字段列表 + 右侧条件。
- 字段：工单类型 / 归属系统 / 归属部门 / 状态 / 提交人 / 创建时间（日期范围）。
- 底部「重置 / 确认」。

#### 28.2 提交工单 `/me/workorder/create`

- **01 工单类型**：系统问题 / 业务问题（radio cards）。
- **02 问题描述**：textarea，1-2000 字符，带计数器；超出显示红色警告。**附件上传内嵌在本 Section 内**（不是独立 section）。
  - 拖拽 / 点击上传
  - 支持格式：`.png .jpg .txt .rar .doc .xls .zip .7z .mp4`
  - 单文件 ≤ 512M，最多 10 个，超出 toast 提示。
- **03 归属部门**：下拉（`技术部 / 人事行政部 / 媒介部 / 成都分公司`）。
- 提交后构造工单数据 → 写入 `localStorage('wo_submitted')` → toast「提交成功」→ 跳转列表。

#### 28.3 工单详情 `/me/workorder/detail/:id`

**文件**：`src/pages/WorkOrderDetailPage/index.jsx`（140 行）

- 顶部状态条（带图标 + 状态 + 工单号）。
- Section 1：基本信息（工单编号 / 类型 / 归属系统 / 归属部门 / 公司编码 / 状态）。
- Section 2：问题描述 + 附件列表（带下载 icon）。
- Section 3：**流转信息**（**不是"处理信息"**——6 字段：提交人 / 创建时间 / 处理人员 / 回复内容 / 关闭原因 / 关闭时间）。
- 底部「关闭工单」按钮（**仅 `status === '处理中'` 时显示**，点击触发确认 modal）。

---

## 复用组件

> 文件：`src/components/`

| 组件 | 说明 |
| --- | --- |
| `PhoneFrame.jsx` | 桌面演示用 9:16 手机外框（最大宽度 414px，居中显示）。 |
| `TabBar.jsx` | 底部 4-Tab 导航 + active 状态高亮。 |
| `FAB.jsx` | 通用悬浮按钮（支持右下角 + 左下角）。 |
| `FeatureIcon.jsx` | 应用宫格图标（自绘 SVG switch-case，按 `name` 精确匹配 → 中文业务名模糊匹配）。所有 menu 节点在 `mock.js` 的 `caidan.json` 上手工指定 `icon` 英文 key（如 `edit` / `document` / `files` / `tickets` / `money` / `monitor` / `risk` / `board` 等 14+），子菜单调用统一 `name={c.icon || c.label}` 兜底匹配。 |
| `FormKit.jsx` | `TopBar` / `Section` / `Field` / `SelectField` / `FormActions` 统一表单组件。 |
| `DateRangePicker/index.jsx` | 钉钉式日期区间选择器，**所有列表/筛选页面统一使用**。chip + 日历浮层；日历通过 `createPortal` 渲染到 body，避开父级 `overflow-hidden` 裁剪。默认未选显示「请选择」，已选显示日期/区间；4 preset（今日/昨日/近7日/近30日）；底部「清空 + 确定」。 |

### DateRangePicker 用法

```jsx
import DateRangePicker from '../../components/DateRangePicker'

const [dateRange, setDateRange] = useState({ start: '', end: '' })

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  label="创建日期"  // 影响 aria-label，不影响 UI
/>
```

- **value 形状**：`{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }`，可空字符串（不过滤）。
- **样式对齐**：MediaDailyReportPage 本地版本（不允许再自造"不限"文案）。
- **Portal 渲染**：日历浮层通过 `createPortal(..., document.body)` 渲染，**任何父级 `overflow-hidden` 都不会裁剪**。浮层位置由 chip `getBoundingClientRect()` 计算。
- **生命周期**：点击 chip 打开 → 点击浮层外关闭 → 选完按"确定"提交（清空按钮 = 全空提交）。

### 表单模板（来自 `FormKit.jsx`）

```jsx
<Section title="分组标题">
  <Field label="字段名" required>
    <input className="form-input" />
  </Field>
  <Field label="下拉字段">
    <SelectField value={v} onChange={setV} options={['A','B']} placeholder="请选择"/>
  </Field>
  <Field label="最后一组" last>...</Field>
</Section>

<FormActions onCancel={...} onSubmit={...} submitText="提 交"/>
```

---

## PWA 与发布

- **Manifest**：`public/manifest.webmanifest`，图标 `icon-192.png` / `icon-512.png` / `apple-touch-icon.png`。
- **Service Worker**：`public/sw.js`，network-first HTML + cache-first 静态资源。
- **新版本提示**：每 60 秒主动 `reg.update()`；发现新 SW 时弹出底部 toast「有新版本可用 → 立即刷新」，点确认调用 `SKIP_WAITING` 触发 `controllerchange` 后自动刷新页面。
- **GitHub Pages**：路径前缀 `/CRM-app/`，见 `vite.config.js` 的 `base` 配置。
- **二维码**：`crm-qr.png`（仓库根）—— 演示用扫码入口。
- **部署命令**：`npm run build`，产物输出到 `dist/`，可直接推送到 GitHub Pages。

### 部署踩坑清单

1. **`dist/` 必须 `git add -f`**：`dist/` 在 `.gitignore` 里，普通 `git add .` 会跳过；用 `git add -f dist/` 强制加入。
2. **用 subtree 推 gh-pages**：`git push origin "$(git subtree split --prefix dist main)":gh-pages --force`；最后用 `git ls-tree -r origin/gh-pages assets/` 验证 hashed JS 已上传。
3. **源码 + dist 必须同一 commit**：先 `git add src/...` 再 `git add -f dist/`，**一次 commit 内提交**。如果只 commit dist，源码改动会留在工作区，下次 pull 就丢。
4. **缓存穿透验证**（Playwright 截图）：`serviceWorkers: 'block'` + `?_=${Date.now()}` cache-bust + `waitForTimeout(4000)`。少了任意一项，SW 命中旧 bundle，看不到新功能。
5. **dist 重新构建先 `rm -rf dist`**：避免旧资源被 hash 复用；vite 会重新生成所有 hashed JS。
6. **别用 `git add -A`**：会引入未跟踪的本地临时文件（`_*.cjs` 调试脚本等），污染提交。只用 `git add <paths>`。

---

## 常用开发命令

```bash
# 启动开发服务器
npm run dev

# 打包生产
npm run build

# 预览构建结果
npm run preview
```

---

## 后续路线图

- 将 `data/mock.js` 替换为真实 API（fetch + SWR / 自实现 hook）。
- 把所有 toast 抽到全局 `<ToastProvider>`，统一 API。
- 增加 Storybook / Vitest，提升组件复用质量。

## 近期重要变更

> 维护一份 commit → 用户可感知的变更摘要，方便追溯设计决策。

| Commit | 类别 | 内容 |
| --- | --- | --- |
| `3f661f4` | UI | 广告主管理 4 子菜单图标区分（开户申请=edit / 开户明细=document / 账户列表=files / 任务列表=tickets） |
| `0dfa6a0` | UI | FeatureIcon 增 4 中文 case + 工作台搜索 `c.icon \|\| c.label` 映射修复 |
| `9d79846` / `3785c6e` | UI | 头条账户余额 AdvancedFilter 单列堆叠 → 钉钉式左右布局（7 字段） |
| `9faf30c` / `ce98b47` | UI | 全 Demo 顶部栏去除三点（⋮）更多按钮 |
| `a5971f6` | Bug | ConsumptionAdvancedFilter `handleApply is not defined` 修复 |
| 运营报表 R1 | 重构 | 新文件 `OperationReportPage/index.jsx`（1092 行）+ 删除 `MonthlyReportDetailPage` + 删除 `/monthly/detail` 路由 |
| 运营报表 R2 | UI 对齐 | 详情 Sheet 明细由表格改卡片（不显示 customer）/ 环比 chips 改 `全部 / 环比为0` / 柱状图改蓝 `#2D7FF9`（无 Recharts `<ReferenceLine>`，avg 显示在 GroupTitle 右侧）/ 运营日报移除 BarSection |

---

## 维护者

- **当前账号**：（技术部 / 产品经理）
- **Owner**：CRM 产品组
- **License**：内部演示

---

> 📌 **说明**：本 README 详细罗列了每一个导航、菜单按钮、查询条件、字段、弹窗与交互，方便前端工程师接手和用户理解产品全貌。若发现遗漏，请直接补充对应章节。
