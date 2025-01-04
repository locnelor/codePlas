import { FormInstance, message, Modal } from "antd"
import FormFactory, { FormFactoryItem } from "./FormFactory"
import { DocumentNode } from "graphql"
import { useState } from "react"
import { useMutation } from "@apollo/client"


export type FormModalProps = {
  query: DocumentNode,
  onCompleted?: (data: any) => Promise<void> | void
  onError?: (error: any) => void
  open: boolean,
  onCancel: () => void,
  title?: string,
  options: FormFactoryItem[],
  form: FormInstance<any>
}
const FormModal = ({
  query,
  open,
  onCompleted = () => { },
  title,
  onError = (error) => message.error(error.message),
  onCancel,
  options,
  form
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
          onFinish: (variables) => {
            setLoading(true)
            mutation({
              variables
            })
          }
        }}
      />
    </Modal>
  )
}
export default FormModal