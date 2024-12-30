import { Button, Modal } from "antd"
import useOpen from "../../../hooks/useOpen"


const CreateRoleButton = () => {
  const [open, onOpen, onCancel] = useOpen();
  return (
    <div>
      <Button onClick={onOpen}>新增</Button>
      <Modal
        open={open}
        onCancel={onCancel}
      ></Modal>
    </div>
  )
}
export default CreateRoleButton