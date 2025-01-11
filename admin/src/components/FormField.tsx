import { Input, InputNumber, Select, Switch } from "antd"
import CoverInput from "./CoverInput"


export type FormFieldType = "text" | "password" | "number" | "select" | "switch" | "date" | "time" | "checkbox" | "radio" | "textarea" | "cover"
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
}: FormFieldProps & {
  [key in string]: any
}) {
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
  if (type === "select") {
    return (
      <Select
        style={{ minWidth: 200 }}
        {...rest}
        value={value}
        onChange={(e) => onChange(e)}
      />
    )
  }
  if (type === "cover") {
    return (
      <CoverInput
        {...rest}
        value={value}
        onChange={(e) => onChange(e)}
      />
    )
  }

  return value
}
export default FormField