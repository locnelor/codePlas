import { Button, ButtonProps, Space } from "antd"
import { CREATE_POWER, DELETE_POWER, EXPORT_POWER, HasPowerHandler, UPDATE_POWER } from "../hooks/useRole"
import StyleButton from "./StyleButton"
import DelPopover from "./DelPopover"
import { PlusOutlined, EditOutlined, EyeFilled, DeleteOutlined, ExportOutlined } from "@ant-design/icons";

export const TextViewButton = () => {
  return (
    <Button type="link" size="small" icon={<EyeFilled />}>
      查看
    </Button>
  )
}
export const TextEditButton = () => {
  return (
    <Button type="link" size="small" icon={<EditOutlined />}>
      修改
    </Button>
  )
}
export const TextDeleteButton = (props: ButtonProps) => {
  return (
    <Button {...props} danger type="link" size="small" icon={<DeleteOutlined />}>
      删除
    </Button>
  )
}
type BaseRoleButtonGroupsProps = {
  hasRole: HasPowerHandler,
  onCreate?: () => void,
  onUpdate?: () => void,
  onDelete?: () => void,
  onExport?: () => void,
}
const BaseRoleButtonGroups = ({
  hasRole,
  onCreate,
  onUpdate,
  onDelete,
  onExport
}: BaseRoleButtonGroupsProps) => {
  return (
    <Space>
      {hasRole([CREATE_POWER]) && (
        <Button icon={<PlusOutlined />} onClick={onCreate} disabled={!onCreate} type="primary">
          新增
        </Button>
      )}
      {hasRole([UPDATE_POWER]) && (
        <StyleButton
          buttonProps={{
            onClick: onUpdate,
            disabled: !onUpdate,
            icon: <EditOutlined />
          }}
          theme={{
            defaultBg: "#d9f2e6", // 默认背景色
            defaultBorderColor: "#b0d5c3", // 默认边框色
            defaultColor: "#27a06c", // 默认文字颜色
            defaultHoverBg: "#27a06c", // 悬浮背景色
            defaultHoverBorderColor: "#208856", // 悬浮边框色
            defaultHoverColor: "#ffffff", // 悬浮文字颜色
            defaultActiveBg: "#208856", // 激活背景色
            defaultActiveBorderColor: "#166b40", // 激活边框色
            defaultActiveColor: "#ffffff", // 激活文字颜色
          }}
        >
          修改
        </StyleButton>
      )}
      {hasRole([DELETE_POWER]) && (
        <DelPopover
          onDelete={onDelete}
        >
          <Button icon={<DeleteOutlined />} disabled={!onDelete} type="primary" danger>
            删除
          </Button>
        </DelPopover>
      )}
      {hasRole([EXPORT_POWER]) && (
        <StyleButton
          buttonProps={{
            onClick: onExport,
            disabled: !onExport,
            icon: <ExportOutlined />
          }}
          theme={{
            defaultBg: "#fff8dc",
            defaultBorderColor: "#f2e5a9",
            defaultColor: "#d2a106",
            defaultHoverBg: "#d2a106",
            defaultHoverBorderColor: "#b48804",
            defaultHoverColor: "#ffffff",
            defaultActiveBg: "#b48804",
            defaultActiveBorderColor: "#8e6c02",
            defaultActiveColor: "#ffffff",
          }}
        >
          导出
        </StyleButton>
      )}
    </Space>
  )
}
export default BaseRoleButtonGroups