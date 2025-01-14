import { Outlet } from "react-router"
import useViewer from "../../hooks/useViewer"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import gqlError from "../../libs/gql-error"
import { Layout } from 'antd';
import UserMenus from "./UserMenus"

// import { SwitchTransition, CSSTransition } from "react-transition-group";

const { Header, Content, Sider } = Layout;
const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  )
}
const AdminLayout = () => {
  const { user, error, loading } = useViewer();
  const { pathname } = useLocation();
  const nav = useNavigate()
  useEffect(() => {
    if (!error) return;
    gqlError(error);
    if (pathname !== "/login") {
      nav("/login")
    }
  }, [error])
  if (loading) return <Loading />
  if (!user) return <Loading />
  return (
    <Layout className="h-full">
      <Sider style={{ background: "#fff", height: "100%" }}>
        <div className="h-full flex flex-col justify-between px-2">
          <div className="flex flex-col gap-2">
            <div className="h-16 flex justify-center items-center">Logo</div>
            <div>icon</div>
            <UserMenus user={user} />
          </div>
          <div className="py-10 flex justify-center">logout</div>
        </div>
      </Sider>
      <Layout>
        <Header className="bg-white flex items-center px-4 shadow">header</Header>
        <Content
          className="p-2 overflow-y-auto bg-gray-100"
          style={{ height: "calc(100% - 64px)" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
export default AdminLayout


