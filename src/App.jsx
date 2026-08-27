import { Routes, Route, useLocation } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Reports from './pages/Reports'
import Work from './pages/Work'
import Approval from './pages/Approval'
import Me from './pages/Me'
import Login from './pages/Login'
import MenuPage from './pages/MenuPage'
import GroupCreatePage from './pages/GroupCreatePage'
import GroupDetailPage from './pages/GroupDetailPage'
import GroupEditPage from './pages/GroupEditPage'
import GroupHandoverPage from './pages/GroupHandoverPage'
import InitialBalancePage from './pages/InitialBalancePage'
import SubjectDetailPage from './pages/SubjectDetailPage'
import SubjectEditPage from './pages/SubjectEditPage'
import ContactCreatePage from './pages/ContactCreatePage'
import BackgroundEditPage from './pages/BackgroundEditPage'
import AccountCreatePage from './pages/AccountCreatePage'
import AccountOperatorEditPage from './pages/AccountOperatorEditPage'
import ProjectCreatePage from './pages/ProjectCreatePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectRestartPage from './pages/ProjectRestartPage'
import AdvertiserApplyPage from './pages/AdvertiserApplyPage'
import AdvertiserDetailPage from './pages/AdvertiserDetailPage'
import AdvertiserAccountDetailPage from './pages/AdvertiserAccountDetailPage'
import AdvertiserTaskDetailPage from './pages/AdvertiserTaskDetailPage'
import PolicyDetailPage from './pages/PolicyDetailPage'
import PolicyChangePage from './pages/PolicyChangePage'
import LivePolicyCreatePage from './pages/LivePolicyCreatePage'
import LivePolicyDetailPage from './pages/LivePolicyDetailPage'
import MaterialPurchaseCreatePage from './pages/MaterialPurchaseCreatePage'
import MaterialPurchaseDetailPage from './pages/MaterialPurchaseDetailPage'
import AdvertiserDetailEntryPage from './pages/AdvertiserDetailEntryPage'
import ApprovalDetailPage from './pages/ApprovalDetailPage'
import PersonalInfo from './pages/PersonalInfo'
import WorkOrderListPage from './pages/WorkOrderListPage'
import WorkOrderDetailPage from './pages/WorkOrderDetailPage'
import WorkOrderCreatePage from './pages/WorkOrderCreatePage'
import PerformancePage from './pages/PerformancePage'

export default function App() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <main className={`flex-1 overflow-y-auto scrollbar-hide ${isLogin ? '' : 'pb-16'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/work" element={<Work />} />
            {/* /approval 页面已全局移除（直接跳转 /m/2278 审批列表） */}
            <Route path="/me" element={<Me />} />
            <Route path="/m/:id" element={<MenuPage />} />
            <Route path="/m/:id/:subId" element={<MenuPage />} />
            {/* 业绩汇总（独立页面，4 维度 + 媒体消耗概览）*/}
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/group/create" element={<GroupCreatePage />} />
            <Route path="/group/edit/:id" element={<GroupEditPage />} />
            <Route path="/group/detail/:id" element={<GroupDetailPage />} />
            <Route path="/group/handover/:id" element={<GroupHandoverPage />} />
            <Route path="/group/balance/:id" element={<InitialBalancePage />} />
            <Route path="/subject/create" element={<SubjectEditPage />} />
            <Route path="/subject/edit/:id" element={<SubjectEditPage />} />
            <Route path="/subject/detail/:id" element={<SubjectDetailPage />} />
            <Route path="/group/contact/:id" element={<ContactCreatePage />} />
            <Route path="/group/background/:id" element={<BackgroundEditPage />} />
            <Route path="/account/create" element={<AccountCreatePage />} />
            <Route path="/account/edit/:id" element={<AccountCreatePage />} />
            <Route path="/account/operator-edit/:advId" element={<AccountOperatorEditPage />} />
            <Route path="/project/create" element={<ProjectCreatePage />} />
            <Route path="/project/edit/:id" element={<ProjectCreatePage />} />
            <Route path="/project/detail/:id" element={<ProjectDetailPage />} />
            <Route path="/project/restart/:id" element={<ProjectRestartPage />} />
            {/* 广告主 ID 管理 */}
            <Route path="/advertiser/apply/new" element={<AdvertiserApplyPage />} />
            <Route path="/advertiser/apply/edit/:id" element={<AdvertiserApplyPage />} />
            <Route path="/advertiser/apply/detail/:id" element={<AdvertiserDetailPage />} />
            <Route path="/advertiser/detail/info/:id" element={<AdvertiserDetailPage />} />
            <Route path="/advertiser/detail/entry/:id" element={<AdvertiserDetailEntryPage />} />
            <Route path="/advertiser/detail/import" element={<AdvertiserApplyPage />} />
            <Route path="/advertiser/account/detail/:id" element={<AdvertiserAccountDetailPage />} />
            <Route path="/advertiser/account/batch-policy" element={<AdvertiserAccountDetailPage />} />
            <Route path="/advertiser/task/detail/:id" element={<AdvertiserTaskDetailPage />} />
            {/* 政策管理 */}
            <Route path="/policy/detail/:id" element={<PolicyDetailPage />} />
            <Route path="/policy/change/:id" element={<PolicyChangePage />} />
            <Route path="/policy/live/create" element={<LivePolicyCreatePage />} />
            <Route path="/policy/live/detail/:code" element={<LivePolicyDetailPage />} />
            <Route path="/policy/material/create" element={<MaterialPurchaseCreatePage />} />
            <Route path="/policy/material/detail/:id" element={<MaterialPurchaseDetailPage />} />
            {/* 审批中心 */}
            <Route path="/approval/detail/:id" element={<ApprovalDetailPage />} />
            {/* 我的 */}
            <Route path="/me/personal-info" element={<PersonalInfo />} />
            {/* 工单（App 端独有）*/}
            <Route path="/me/workorder" element={<WorkOrderListPage />} />
            <Route path="/me/workorder/detail/:id" element={<WorkOrderDetailPage />} />
            <Route path="/me/workorder/create" element={<WorkOrderCreatePage />} />
          </Routes>
        </main>
        {!isLogin && <TabBar />}
      </div>
    </PhoneFrame>
  )
}
