import { gql, useMutation, useQuery } from "@apollo/client"
import { Card, Form, message, Space } from "antd"
import { Link, useParams } from "react-router"
import { QueryGroupByIdResult, QueryGroupByIdQuery } from "../../../page"
import { QeuryTestByIdResult, QeuryTestByIdQuery } from "../../page"
import { TestChapterEntity, TestGroupFields, TestQuestionFields } from "../../../../../../../queries/test"
import { BaseFields } from "../../../../../../../queries/base"
import HeadBack from "../../../../../../../components/HeadBack"
import useOpen from "../../../../../../../hooks/useOpen"
import FormModal from "../../../../../../../components/FormModal"
import { useColumns, useDataSource } from "../../../../../../../hooks/useTable"
import useRole from "../../../../../../../hooks/useRole"
import EditTable from "../../../../../../../components/EditTable"
import gqlError from "../../../../../../../libs/gql-error"
import { DeletePartnerMutation } from "../../../../../partner/page"
import { TextViewButton, TextDeleteButton } from "../../../../../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../../../../../components/DelPopover"
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

const QueryTestQuestionQuery = gql`
  query QueryTestQuestion(
    $id: Int!
  ){
    queryTestQuestions(
      sys_test_chapterId:$id
    ){
      ${BaseFields}
      ${TestQuestionFields}
    }
  }
`
export interface QueryTestQuestionResult {
  queryTestQuestions: TestChapterEntity[]
}
const CreateTestQuestionMutation = gql`
  mutation CreateTestQuestion(
    $title: String!,
    $answer: String!,
    $type: String!,
    $context: String!,
    $sys_test_chapterId: Int!,
    $order: Int
  ){
    createTestQuestion(
      title: $title,
      answer: $answer,
      type: $type,
      context: $context,
      sys_test_chapterId: $sys_test_chapterId,
      order: $order
    ){
      id
    }
  }
`
const UpdateTestQuestionMutation = gql`
  mutation UpdateTestQuestion(
    $id: Int!,
    $title: String!,
    $answer: String!,
    $type: String!,
    $context: String!,
    $sys_test_chapterId: Int!,
    $order: Int
  ){
    updateTestQuestion(
      id: $id,
      title: $title,
      answer: $answer,
      type: $type,
      context: $context,
      sys_test_chapterId: $sys_test_chapterId,
      order: $order
    ){
      id
    }
  }
`
const DeleteTestQuestionMutation = gql`
  mutation DeleteTestQuestion(
    $id: Int!
  ){
    deleteTestQuestion(
      id: $id
    ){
      id
    }
  }
`
const AdminTestGroupChapterQuestionPage = () => {
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
  const { data, loading, refetch } = useQuery<QueryTestQuestionResult>(QueryTestQuestionQuery, {
    variables: {
      id: chapterId
    }
  })
  const hasRole = useRole("/test")
  const dataSource = useDataSource([...(data?.queryTestQuestions || [])])
  const [update, { loading: updateLoading }] = useMutation(UpdateTestQuestionMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeletePartnerMutation, {
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
    title: "答案",
    dataIndex: "answer",
    type: "text"
  },
  {
    title: "类型",
    dataIndex: "type",
    type: "text"
  },
  {
    title: "内容",
    dataIndex: "context",
    type: "text"
  },
  {
    title: "排序",
    dataIndex: "order",
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
        {group.data?.queryGroupById.name} - {test.data?.queryTestById.name} - {chapter.data?.queryTestGroupById.name}
      </h1>
      <HeadBack
        href={`/admin/test/${groupId}/group/${testId}/chapter`}
      />
      <FormModal
        form={createForm}
        open={open}
        onCancel={onCancel}
        title="创建章节"
        query={CreateTestQuestionMutation}
        variables={{
          id: testId,
        }}
        options={[{
          type: "text",
          label: "试卷名称",
          name: "name",
          rules: [{ required: true, message: "名称不能为空" }]
        }, {
          label: "备注",
          name: "desc",
          type: "textarea"
        },
        {
          label: "时长（分钟）",
          name: "time",
          type: "number"
        }, {
          type: "number",
          label: "排序",
          name: "order",
        }, {
          type: "switch",
          label: "是否免费",
          name: "is_free",
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
export default AdminTestGroupChapterQuestionPage