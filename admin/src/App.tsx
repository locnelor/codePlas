import { ApolloProvider } from '@apollo/client'
import makeClient from './libs/apollo-client'
import { HashRouter, Route, Routes } from 'react-router'
import NotFoundPage from './pages/404'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import AdminLayout from './pages/admin/layout'
import AdminPage from './pages/admin/page'
import HomeLayout from './pages/layout'
import HomePage from './pages/page'
import AdminLoginPage from './pages/admin/login/page'
import AdminInitPage from './pages/admin/init/page'
import AdminSystemRolePage from './pages/admin/system/role/page'
import AdminSystemRoleActionPage from './pages/admin/system/role/action/page'
import AdminSystemUsersPage from './pages/admin/system/users/page'
import AdminNoticePage from './pages/admin/notices/page'
import AdminNoticeAction from './pages/admin/notices/action/page'
import AdminPartnerPage from './pages/admin/partner/page'
import AdminSoftwarePage from './pages/admin/software/page'
import AdminOutlinePage from './pages/admin/outline/page'
import NoticePage from './pages/notice/page'
import SoftwarePage from './pages/software/page'
import PartnerPage from './pages/partners/page'

function App() {
  const client = makeClient()
  return (
    <ConfigProvider locale={zhCN}>
      <ApolloProvider client={client}>
        <HashRouter>
          <Routes>
            <Route element={<HomeLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/:type/notice' element={<NoticePage />} />
              <Route path='/software' element={<SoftwarePage />} />
              <Route path='/partners' element={<PartnerPage />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
            <Route path='/admin/login' element={<AdminLoginPage />} />
            <Route path='/admin/init' element={<AdminInitPage />} />
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='' element={<AdminPage />} />
              <Route path='system/role' element={<AdminSystemRolePage />} />
              <Route path='system/role/action' element={<AdminSystemRoleActionPage />} />
              <Route path='system/users' element={<AdminSystemUsersPage />} />
              <Route path='notices' element={<AdminNoticePage />} />
              <Route path='notice/action' element={<AdminNoticeAction />} />
              <Route path='partner' element={<AdminPartnerPage />} />
              <Route path='software' element={<AdminSoftwarePage />} />
              <Route path='outline' element={<AdminOutlinePage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ApolloProvider >
    </ConfigProvider>
  )
}

export default App
