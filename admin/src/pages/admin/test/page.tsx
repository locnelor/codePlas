import { gql, useMutation, useQuery } from "@apollo/client"
import { BaseFields } from "../../../queries/base"
import { GroupEntity, GroupFields } from "../../../queries/test"
import { message, Space, Card, Form, Image } from "antd"
import { Link } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../components/DelPopover"
import EditTable from "../../../components/EditTable"
import FormModal from "../../../components/FormModal"
import useOpen from "../../../hooks/useOpen"
import useRole from "../../../hooks/useRole"
import { useDataSource, useColumns } from "../../../hooks/useTable"
import gqlError from "../../../libs/gql-error"
import { joinPath } from "../../../libs/http-fetch"

export const QueryGroupsQuery = gql`
  query QueryGroups{
    queryGroups{
      ${BaseFields}
      ${GroupFields}
    }
  }
`
export interface QueryGroupsResult {
  queryGroups: GroupEntity[]
}

const CreateGroupMutation = gql`
  mutation CreateGroup(
    $name: String!,
    $base64: String!
  ){
    createGroup(
      name: $name,
      base64: $base64
    ){
      id
    }
  }
`
const UpdateGroupMutation = gql`
  mutation UpdateGroup(
    $id: Int!,
    $name: String!,
    $base64: String
  ){
    updateGroup(
      id: $id,
      name: $name,
      base64: $base64
    ){
      id
    }
  }
`
const DeleteGroupMutation = gql`
  mutation DeleteGroup(
    $id: Int!
  ){
    deleteGroup(
      id: $id
    ){
      id
    }
  }
`


const AdminTestPage = () => {
  const { data, loading, refetch } = useQuery<QueryGroupsResult>(QueryGroupsQuery)
  const [update, { loading: updateLoading }] = useMutation(UpdateGroupMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeleteGroupMutation, {
    onCompleted() {
      message.success(`删除成功`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const hasRole = useRole("/test")
  const dataSource = useDataSource([...(data?.queryGroups || [])])
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "图片",
    render: (record: any) => {
      return (
        <div>
          <Image
            src={joinPath(`/media/group/${record.id}/cover`)}
            width={100}

          />
        </div>
      )
    }
  }, {
    title: "名称",
    dataIndex: "name",
    type: "text"
  }, {
    title: "操作",
    render: (_: any, record: any) => {
      return (
        <Space>
          <Link to={`/admin/test/${record.id}/group`}>
            <TextViewButton />
          </Link>
          <DelPopover
            onDelete={() => {
              del({
                variables: {
                  id: record.id
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
      <h1 className="text-2xl font-bold">模拟测试组 queryGroups</h1>
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建合作伙伴"
        query={CreateGroupMutation}
        options={[{
          type: "text",
          label: "名称",
          name: "name",
          rules: [{ required: true, message: "名称不能为空" }]
        }, {
          label: "图片",
          name: "base64",
          type: "cover",
          rules: [{ required: true, message: "请上传图片" }]
        },]}
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
export default AdminTestPage