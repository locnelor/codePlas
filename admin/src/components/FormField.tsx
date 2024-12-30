import { Input, InputNumber, Switch } from "antd"


export type FormFieldType = "text" | "password" | "number" | "select" | "switch" | "date" | "time" | "checkbox" | "radio" | "textarea" | "upload" | "image" | "file" | "url" | "email" | "phone" | "idcard" | "address" | "province" | "city" | "district" | "zip"
type FormFieldProps = {
  type?: FormFieldType,
  value?: any,
  onChange?: (value: any) => void,
  style?: React.CSSProperties
}
function FormField({
  type,
  value,
  onChange = () => { },
  ...rest
}: FormFieldProps) {
  if (type === "text") {
    return (
      <Input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  if (type === "number") {
    return (
      <InputNumber
        {...rest}
        value={value}
        onChange={(e) => onChange(e)}
        type="number"
      />
    )
  }
  if (type === "textarea") {
    return (
      <Input.TextArea
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }
  if (type === "switch") {
    return (
      <Switch
        {...rest}
        checked={value}
        onChange={(e) => onChange(e)}
      />
    )
  }

  return value
}
export default FormField