import { FormInstance, message, Modal } from "antd"
import FormFactory, { FormFactoryItem } from "./FormFactory"
import { DocumentNode } from "graphql"
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { AnyObject } from "../type"


export type FormModalProps = {
  query: DocumentNode,
  onCompleted?: (data: any) => Promise<void> | void
  onError?: (error: any) => void
  open: boolean,
  onCancel: () => void,
  title?: string,
  options: FormFactoryItem[],
  form: FormInstance<any>,
  variables?: AnyObject
}
const FormModal = ({
  query,
  open,
  onCompleted = () => { },
  title,
  onError = (error) => message.error(error.message),
  onCancel,
  options,
  form,
  variables
}: FormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [mutation] = useMutation(query, {
    async onCompleted(data) {
      await onCompleted(data)
      setLoading(false)
      onCancel()
    },
    onError: (error) => {
      onError(error)
      setLoading(false)
    },
  })
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={title}
      onOk={form.submit}
      confirmLoading={loading}
    >
      <FormFactory
        options={options}
        formProps={{
          form,
          onFinish: (data) => {
            setLoading(true)
            mutation({
              variables: {
                ...variables,
                ...data
              }
            })
          }
        }}
      />
    </Modal>
  )
}
export default FormModal