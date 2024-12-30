import { Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Link } from "react-router"

type HeadBackProps = {
  href: string
}
const HeadBack = ({ href }: HeadBackProps) => {
  return (
    <div className="my-2">
      <Link to={href}>
        <Button
          icon={<ArrowLeftOutlined />}
          type="primary"
        >
          返回
        </Button>
      </Link>
    </div>
  )
}
export default HeadBack