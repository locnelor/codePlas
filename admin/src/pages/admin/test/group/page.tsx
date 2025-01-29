import { gql, useMutation, useQuery } from "@apollo/client"
import { message, Space, Card, Image, Form } from "antd"
import { Link, useParams } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../../components/DelPopover"
import EditTable from "../../../../components/EditTable"
import FormModal from "../../../../components/FormModal"
import useOpen from "../../../../hooks/useOpen"
import useRole from "../../../../hooks/useRole"
import { useDataSource, useColumns } from "../../../../hooks/useTable"
import gqlError from "../../../../libs/gql-error"
import { joinPath } from "../../../../libs/http-fetch"
import { BaseFields } from "../../../../queries/base"
import { GroupFields, GroupEntity, TestFields, TestEntity } from "../../../../queries/test"
import HeadBack from "../../../../components/HeadBack"

const QueryTestsQuery = gql`
  query QueryTests(
    $id:Int!
  ){
    queryTests(
      sys_groupId:$id
    ){
      ${BaseFields}
      ${TestFields}
    }
  }
`
export interface QueryTestsResult {
  queryTests: TestEntity[]
}
const CreateTestMutation = gql`
  mutation CreateTest(
    $name: String!,
    $base64: String!,
    $sys_groupId:Int!
  ){
    createTest(
      name: $name,
      base64: $base64,
      sys_groupId:$sys_groupId
    ){
      id
    }
  }
`
const UpdateTestMutation = gql`
  mutation UpdateTest(
    $id: Int!,
    $name: String!,
    $base64: String
  ){
    updateTest(
      id: $id,
      name: $name,
      base64: $base64
    ){
      id
    }
  }
`
const DeleteTestMutation = gql`
  mutation DeleteTest(
    $id: Int!
  ){
    deleteTest(
      id: $id
    ){
      id
    }
  }
`
export const QueryGroupByIdQuery = gql`
  query QueryGroupById(
    $id:Int!
  ){
    queryGroupById(
      id:$id
    ){
      ${BaseFields}
      ${GroupFields}
    }
  }
`
export interface QueryGroupByIdResult {
  queryGroupById: GroupEntity
}

const AdminTestGroupPage = () => {
  const params = useParams()
  const id = parseInt(params.groupId || "0")
  const group = useQuery<QueryGroupByIdResult>(QueryGroupByIdQuery, {
    variables: {
      id
    }
  })
  const { data, loading, refetch } = useQuery<QueryTestsResult>(QueryTestsQuery, {
    variables: {
      id
    }
  })
  const [update, { loading: updateLoading }] = useMutation(UpdateTestMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeleteTestMutation, {
    onCompleted() {
      message.success(`删除成功`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const hasRole = useRole("/test")
  const dataSource = useDataSource([...(data?.queryTests || [])])
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "图片",
    render: (record: any) => {
      return (
        <div>
          <Image
            src={joinPath(`/media/test/${record.id}/cover`)}
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
          <Link to={`/admin/test/${id}/group/${record.id}/chapter`}>
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
      <h1 className="text-2xl font-bold">queryTests {group.data?.queryGroupById.name}</h1>
      <HeadBack
        href="/admin/test"
      />
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建合作伙伴"
        query={CreateTestMutation}
        variables={{
          id
        }}
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
export default AdminTestGroupPage