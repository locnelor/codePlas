import { gql, useMutation, useQuery } from "@apollo/client"
import { Card, Form, message, Space } from "antd"
import { Link, useParams } from "react-router"
import { QueryGroupByIdResult, QueryGroupByIdQuery } from "../../page"
import { QeuryTestByIdResult, QeuryTestByIdQuery } from "../page"
import { TextViewButton, TextDeleteButton } from "../../../../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../../../../components/DelPopover"
import EditTable from "../../../../../../components/EditTable"
import FormModal from "../../../../../../components/FormModal"
import HeadBack from "../../../../../../components/HeadBack"
import useOpen from "../../../../../../hooks/useOpen"
import useRole from "../../../../../../hooks/useRole"
import { useDataSource, useColumns } from "../../../../../../hooks/useTable"
import gqlError from "../../../../../../libs/gql-error"
import { BaseFields } from "../../../../../../queries/base"
import { TestGroupFields, TestChapterEntity, TestChapterItemFields, TestChapterItemEntity } from "../../../../../../queries/test"


export const QueryTestGroupByIdQuery = gql`
  query QueryTestGroupById(
    $id: Int!
  ){
    queryTestGroupById(
      id: $id
    ){
      ${BaseFields}
      ${TestGroupFields}
    }
  }
`
export interface QueryTestGroupByIdResult {
  queryTestGroupById: TestChapterEntity
}

const QueryTestChapterItemQuery = gql`
  query QueryTestChapterItem(
    $id: Int!
  ){
    queryTestChapterItem(
      sys_test_chapterId:$id
    ){
      ${BaseFields}
      ${TestChapterItemFields}
    }
  }
`
export interface QueryTestChapterItemResult {
  queryTestChapterItem: TestChapterItemEntity[]
}

const CreateTestChapterItemMutation = gql`
  mutation CreateTestChapterItem(
    $name: String!,
    $desc: String,
    $time: Int,
    $order: Int,
    $id: Int!
  ){
    createTestQuestion(
      sys_test_chapterId: $id,
      name: $name,
      desc: $desc,
      time: $time,
      order: $order
    ){
      id
    }
  }
`
const UpdateTestChapterItemMutation = gql`
  mutation UpdateTestChapterItem(
    $name: String!,
    $desc: String,
    $time: Int,
    $order: Int,
    $id: Int!
  ){
    updateTestQuestion(
      id: $id,
      name: $name,
      desc: $desc,
      time: $time,
      order: $order,
    ){
      id
    }
  }
`
const DeleteTestChapterItemMutation = gql`
  mutation DeleteTestChapterItem(
    $id: Int!
  ){
    deleteTestQuestion(
      id: $id
    )
  }
`
const AdminTesgroupChapterPaperPage = () => {
  const params = useParams()
  const groupId = parseInt(params.groupId || "0")
  const testId = parseInt(params.testId || "0")
  const chapterId = parseInt(params.chapterId || "0")
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
  const chapter = useQuery<QueryTestGroupByIdResult>(QueryTestGroupByIdQuery, {
    variables: {
      id: chapterId
    }
  })
  const { data, loading, refetch } = useQuery<QueryTestChapterItemResult>(QueryTestChapterItemQuery, {
    variables: {
      id: chapterId
    }
  })
  const hasRole = useRole("/test")
  const dataSource = useDataSource([...(data?.queryTestChapterItem || [])])
  const [update, { loading: updateLoading }] = useMutation(UpdateTestChapterItemMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeleteTestChapterItemMutation, {
    onCompleted() {
      message.success(`删除成功`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [createForm] = Form.useForm()
  const [open, onOpen, onCancel] = useOpen()
  //新增一个章节
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "章节名称",
    dataIndex: "title",
    type: "text"
  },
  {
    title: "排序",
    dataIndex: "order",
    type: "number"
  },
  {
    title: "单选题",
    dataIndex: "single_count",
    type: "text"
  },
  {
    title: "多选题",
    dataIndex: "multiple_count",
    type: "text"
  },
  {
    title: "判断题",
    dataIndex: "judge_count",
    type: "text"
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
  return (
    <Card>
      <h1 className="text-2xl font-bold">
        queryTestChapterItem {group.data?.queryGroupById.name} - {test.data?.queryTestById.name} - {chapter.data?.queryTestGroupById.name}
      </h1>
      <HeadBack
        href={`/admin/test/${groupId}/group/${testId}/chapter`}
      />
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建章节"
        query={CreateTestChapterItemMutation}
        variables={{
          id: testId,
        }}
        options={[{
          type: "text",
          label: "章节名称",
          name: "name",
          rules: [{ required: true, message: "名称不能为空" }]
        }, {
          label: "备注",
          name: "desc",
          type: "textarea"
        }, {
          type: "number",
          label: "排序",
          name: "order",
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
export default AdminTesgroupChapterPaperPage