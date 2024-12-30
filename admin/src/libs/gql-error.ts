import { message } from "antd"


const gqlError = (error: any) => {
  message.error(error.message)
}
export default gqlError