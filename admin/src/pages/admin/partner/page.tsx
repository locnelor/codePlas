import { gql, useMutation, useQuery } from "@apollo/client"
import { Card, Form, message, Space } from "antd"
import { BaseFields } from "../../../queries/base"
import { PartnerEntity, PartnerFields } from "../../../queries/partner"
import gqlError from "../../../libs/gql-error"
import { useColumns, useDataSource } from "../../../hooks/useTable"
import EditTable from "../../../components/EditTable"
import useRole from "../../../hooks/useRole"
import FormModal from "../../../components/FormModal"
import useOpen from "../../../hooks/useOpen"
import { Link } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../components/DelPopover"


export const QueryPartnerQuery = gql`
  query QueryPartner{
    queryPartner{
      ${BaseFields}
      ${PartnerFields}
    }
  }
`
export interface QueryPArtnerResult {
  queryPartner: PartnerEntity[]
}
export const CreatePartnerMutation = gql`
  mutation CreatePartner(
    $name: String!,
    $order: Int!
  ){
    createPartner(
      name: $name,
      order: $order
    ){
      id
    }
  }
`
export const UpdatePartnerMutation = gql`
  mutation UpdatePartner(
    $id: Int!,
    $name: String!,
    $order: Int!
  ){
    updatePartner(
      id: $id,
      name: $name,
      order: $order
    ){
      id
    }
  }
`
export const DeletePartnerMutation = gql`
  mutation DeletePartner(
    $ids: [Int!]!
  ){
    deletePartner(
      ids: $ids
    )
  }
`
const AdminPartnerPage = () => {
  const { data, loading, refetch } = useQuery<QueryPArtnerResult>(QueryPartnerQuery)
  const [update, { loading: updateLoading }] = useMutation(UpdatePartnerMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeletePartnerMutation, {
    onCompleted({ deletePartner }) {
      message.success(`成功删除${deletePartner}条数据`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const hasRole = useRole("/partner")
  const dataSource = useDataSource([...(data?.queryPartner || [])].sort((a, b) => a.order - b.order))
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "名称",
    dataIndex: "name",
    type: "text"
  }, {
    title: "排序",
    dataIndex: "order",
    type: "number"
  }, {
    title: "操作",
    render: (_: any, record: any) => {
      return (
        <Space>
          <Link to={`/notice/action?id=${record?.id}`}>
            <TextViewButton />
          </Link>
          <DelPopover
            onDelete={() => {
              del({
                variables: {
                  ids: [record.id]
                }
              })
            }}
          >
            <TextDeleteButton />
          </DelPopover>
        </Space>
      )
    }
  }])
  const [createForm] = Form.useForm()
  const [open, onOpen, onCancel] = useOpen()
  return (
    <Card>
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建合作伙伴"
        query={CreatePartnerMutation}
        options={[{
          type: "text",
          label: "名称",
          name: "name",
          rules: [{ required: true, message: "名称不能为空" }]
        }, {
          type: "number",
          label: "排序",
          name: "order",
          rules: [{ required: true, message: "排序不能为空" }]
        }]}
        onCompleted={() => { refetch() }}
      />
      <EditTable
        dataSource={dataSource}
        loading={
          loading || updateLoading || deleteLoading
        }
        columns={columns}
        hasRole={hasRole}
        pagination={false}
        onCreate={onOpen}
        onChangeItem={(record, edit) => {
          update({
            variables: {
              ...record,
              ...edit
            }
          })
        }}
      />
    </Card>
  )
}
export default AdminPartnerPage