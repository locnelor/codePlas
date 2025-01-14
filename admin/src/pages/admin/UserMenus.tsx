import { gql, useQuery } from "@apollo/client"
import { UserEntity } from "../../queries/user"
import { Menu } from "antd"
import { useCallback, useMemo } from "react"
import { MenuEntity, MenuFields } from "../../queries/menu"
import { MenuOnRoleEntity } from "../../queries/on"
import { useLocation, useNavigate } from "react-router"
import {
  HomeOutlined,
  SettingOutlined,
  KeyOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BaseFields } from "../../queries/base"
//获取菜单
export const GetMenuQuery = gql`
  query GetMenu{
    getMenu{
      ${BaseFields}
      ${MenuFields}
    }
  }
`
export interface GetMenuQueryResult {
  getMenu: MenuEntity[]
}
const icons = {
  "/system": <SettingOutlined />,
  "/system/menu": <KeyOutlined />,
  "/system/role": <TeamOutlined />,
  "/system/users": <UserOutlined />,
};

const makeTreeMenu = (menu: MenuEntity[], parentId: number | null = null) => {
  const array = menu.filter(e => e.parentId === parentId);
  const result: MenuEntity[] = array.map((item) => ({
    ...item,
    children: makeTreeMenu(menu, item.id)
  }))
  return result;
}
const filterTreeMenu = (menu: MenuEntity[], roles: MenuOnRoleEntity[]) => {
  const array = menu.filter((e) => roles.some(r => r.sys_menuId === e.id));
  const result: MenuEntity[] = array.map((item) => {
    return {
      ...item,
      children: filterTreeMenu(item.children || [], roles)
    }
  })
  return result
}
const renderTreeMenu: any = (menu: MenuEntity[]) => {
  return menu.map((item: any) => {
    const key = `/admin${item.path}`
    return {
      key,
      icon: icons[item.path as keyof typeof icons],
      label: item.name,
      path: key,
      children: item.children.length > 0 ? renderTreeMenu(item.children) : undefined
    }
  })
}
const UserMenus = ({
  user
}: {
  user: UserEntity
}) => {
  const location = useLocation();
  const nav = useNavigate();
  const { data } = useQuery<GetMenuQueryResult>(GetMenuQuery)
  const items = useMemo(() => {
    const home = {
      key: "/admin",
      label: "首页",
      icon: <HomeOutlined />,
    }
    if (!data) return [home]
    const menu = makeTreeMenu(data.getMenu)
    const items = filterTreeMenu(menu, user.role?.sys_menu_on_role || [])
    return [home, { type: "divider" }, ...renderTreeMenu(items)]
  }, [data])
  const onSelect = useCallback(({ key }: { key: string }) => {
    nav(key);
  }, [])
  return (
    <div className="self-side-menu">
      <Menu onSelect={onSelect} mode="inline" defaultSelectedKeys={[location.pathname]} items={items} />
    </div>
  )
}
export default UserMenus