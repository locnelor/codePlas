import { Form, FormProps } from "antd"
import FormField, { FormFieldType } from "./FormField"
import { PropsWithChildren } from "react"


export type FormFactoryItem = {
  label: string,
  name: string | string[],
  rules?: any[]
  type: FormFieldType,
} & { [key in string]: any }
export type FormFactoryProps = {
  options: FormFactoryItem[]
  formProps?: PropsWithChildren<FormProps>
}
const FormFactory = ({
  options,
  formProps,
  children
}: PropsWithChildren<FormFactoryProps>) => {
  return (
    <Form
      {...formProps}
    >
      {options.map(({
        label,
        name,
        rules,
        type,
        ...rest
      }, key) => {
        return (
          <Form.Item
            label={label}
            name={name}
            rules={rules}
            key={key}
          >
            <FormField
              type={type}
              {...rest}
            />
          </Form.Item>
        )
      })}
      {children}
    </Form>
  )
}
export default FormFactory