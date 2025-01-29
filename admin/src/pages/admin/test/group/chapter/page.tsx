import { gql, useMutation, useQuery } from "@apollo/client"
import { message, Space, Card, Form } from "antd"
import { Link, useParams } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../../../components/DelPopover"
import EditTable from "../../../../../components/EditTable"
import FormModal from "../../../../../components/FormModal"
import HeadBack from "../../../../../components/HeadBack"
import useOpen from "../../../../../hooks/useOpen"
import useRole from "../../../../../hooks/useRole"
import { useDataSource, useColumns } from "../../../../../hooks/useTable"
import gqlError from "../../../../../libs/gql-error"
import { BaseFields } from "../../../../../queries/base"
import { TestGroupFields, TestGroupEntity, TestEntity, TestFields } from "../../../../../queries/test"
import { QueryGroupByIdQuery, QueryGroupByIdResult } from "../page"
export const QeuryTestByIdQuery = gql`
  query QeuryTestById(
    $id:Int!
  ){
    queryTestById(
      id:$id
    ){
      ${BaseFields}
      ${TestFields}
    }
  }
`
export interface QeuryTestByIdResult {
  queryTestById: TestEntity
}
export const QueryTestGroupQuery = gql`
  query QueryTestGroup(
    $id:Int!
  ){
    queryTestGroups(
      sys_testId:$id
    ){
      ${BaseFields}
      ${TestGroupFields}
    }
  }
`
export interface QueryTestGroupResult {
  queryTestGroups: TestGroupEntity[]
}
const CreateTestGroupMutation = gql`
  mutation CreateTestGroup(
    $id:Int!,
    $name:String!,
    $order:Int,
  ){
    createTestGroup(
      sys_testId: $id,
      name: $name,
      order: $order
    ){
      id
    }
  }
`
const UpdateTestGroupMutation = gql`
  mutation UpdateTestGroup(
    $id:Int!,
    $name:String!,
    $order:Int
  ){
    updateTestGroup(
      id: $id,
      name: $name,
      order: $order
    ){
      id
    }
  }
`
const DeleteTestGroupMutation = gql`
  mutation DeleteTestGroup(
    $id: Int!
  ){
    deleteTestGroup(
      id: $id
    ){
      id
    }
  }
`

const AdminTestGroupChapterPage = () => {
  const params = useParams()
  const groupId = parseInt(params.groupId || "0")
  const testId = parseInt(params.testId || "0")
  const group = useQuery<QueryGroupByIdResult>(QueryGroupByIdQuery, {
    variables: {
      id: groupId
    }
  })
  const test = useQuery<QeuryTestByIdResult>(QeuryTestByIdQuery, {
    variables: {
      id: testId
    }
  })
  const { data, loading, refetch } = useQuery<QueryTestGroupResult>(QueryTestGroupQuery, {
    variables: {
      id: testId
    }
  })
  const [update, { loading: updateLoading }] = useMutation(UpdateTestGroupMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeleteTestGroupMutation, {
    onCompleted() {
      message.success(`删除成功`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const hasRole = useRole("/test")
  const dataSource = useDataSource([...(data?.queryTestGroups || [])])
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "章节名称",
    dataIndex: "name",
    type: "text"
  },
  {
    title: "排序",
    dataIndex: "order",
    type: "text"
  },
  {
    title: "描述",
    dataIndex: "desc",
    type: "textarea"
  },
  {
    title: "操作",
    render: (_: any, record: any) => {
      return (
        <Space>
          <Link to={`/admin/test/${groupId}/group/${testId}/chapter/${record.id}/question`}>
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
      <h1 className="text-2xl font-bold">
        queryTestGroups {group.data?.queryGroupById.name} - {test.data?.queryTestById.name}
      </h1>
      <HeadBack
        href={`/admin/test/${groupId}/group`}
      />
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建章节"
        query={CreateTestGroupMutation}
        variables={{
          id: testId,
        }}
        options={[{
          type: "text",
          label: "名称",
          name: "name",
          rules: [{ required: true, message: "名称不能为空" }]
        }, {
          type: "number",
          label: "排序",
          name: "order",
        }, {
          type: "textarea",
          label: "描述",
          name: "desc",
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
export default AdminTestGroupChapterPage