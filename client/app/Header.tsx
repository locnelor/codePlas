import { Col, Row } from "antd"
import Link from "next/link"
import { usePathname } from "next/navigation"


const Header = () => {
  const hrefSet = {
    "/": "首页",
    "/test": "模拟测试",
    "/testInfo": "考试信息",
    "/news": "行业动态",
    "/exams": "试卷下载",
    "/software": "软件平台",
    "/partners": "合作机构",
    "/about": "站点介绍",
    "/login": "登录",
    "/register": "注册"
  }
  const menu: (keyof typeof hrefSet)[] = [
    "/",
    "/test",
    "/testInfo",
    "/news",
    "/exams",
    "/software",
    "/partners",
    "/about",
  ]
  const pathname = usePathname()
  return (
    <div
      style={{ background: "#1D90FF" }}
      className="py-2 text-white"
    >
      <Row>
        <Col span={18}>
          <h1 className="text-2xl text-center font-bold">
            编程小伙伴测试网
          </h1>
        </Col>
        <Col span={6}></Col>
        <Col span={9}>
          <div className="flex gap-2 justify-center font-bold">
            <div>
              11人在线
            </div>
            <div className="flex gap-1">
              已进行了
              <Link href="/siteDataPage" className="text-white">
                114514次测真题模拟测试
              </Link>
            </div>
          </div>
        </Col>
        <Col span={9} className="text-center font-bold">
          www.cierobot.com
        </Col>
        <Col span={6} className="flex justify-end">
          <div className="flex justify-end gap-2">
            <Link href="/login" className="text-white">
              登录
            </Link>
            <div>|</div>
            <Link href="/register" className="text-white">
              注册
            </Link>
          </div>
        </Col>
      </Row>
      <div className="flex justify-between gap-2 bg-blue-900 px-2">
        {menu.map((href) => {
          return (
            <Link key={href} href={href} className="text-white hover:text-white">
              <div className="hover:bg-blue-800 p-2">
                {hrefSet[href]}
              </div>
            </Link>
          )
        })}
      </div>
      <div className="pl-4 pt-1 font-bold">当前位置:{hrefSet[pathname as keyof typeof hrefSet]}</div>
    </div>
  )
}
export default Header