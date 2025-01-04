import { Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Link } from "react-router"
import { PropsWithChildren } from "react"

type HeadBackProps = {
  href: string
}
const HeadBack = ({ href, children }: PropsWithChildren<HeadBackProps>) => {
  return (
    <div className="my-2 flex justify-between">
      <Link to={href}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="primary"
        >
          返回
        </Button>
      </Link>
      {children}
    </div>
  )
}
export default HeadBack