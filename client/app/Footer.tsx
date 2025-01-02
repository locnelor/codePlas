import { Col, Row } from "antd"



const Footer = () => {

  return (
    <div
      style={{ background: "#1E3C8F" }}
      className="p-4 text-white"
    >
      <Row gutter={[20, 20]}>
        <Col span={8}>
          友情链接
        </Col>
        <Col span={8}>
          机器人编程小伙伴测试网
        </Col>
        <Col span={8}>
        二维码
        </Col>
      </Row>
    </div>
  )
}
export default Footer