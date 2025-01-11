import { ApolloProvider } from '@apollo/client'
import makeClient from './libs/apollo-client'
import { HashRouter, Route, Routes } from 'react-router'
import LoginPage from './pages/login/page'
import HomeLayout from './pages/layout'
import HomePage from './pages/page'
import InitPage from './pages/init/page'
import NotFoundPage from './pages/404'
import SystemRolePage from './pages/system/role/page'
import SystemUsersPage from './pages/system/users/page'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import SystemRoleActionPage from './pages/system/role/action/page'
import NoticePage from './pages/notices/page'
import NoticeAction from './pages/notices/action/page'
import PartnerPage from './pages/partner/page'
import SoftwarePage from './pages/software/page'

function App() {
  const client = makeClient()
  return (
    <ConfigProvider locale={zhCN}>
      <ApolloProvider client={client}>
        <HashRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/init' element={<InitPage />} />
            <Route element={<HomeLayout />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/system/role' element={<SystemRolePage />} />
              <Route path='/system/role/action' element={<SystemRoleActionPage />} />
              <Route path='/system/users' element={<SystemUsersPage />} />
              <Route path='/notices' element={<NoticePage />} />
              <Route path='/notice/action' element={<NoticeAction />} />
              <Route path='/partner' element={<PartnerPage />} />
              <Route path='/software' element={<SoftwarePage />} />
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ApolloProvider >
    </ConfigProvider>
  )
}

export default App
