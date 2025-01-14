import { gql, useMutation } from "@apollo/client"
import { BaseFields, BasePagination, PaginationFields } from "../../../queries/base"
import { NoticeEntity, NoticeFields } from "../../../queries/notices"
import { UserFields } from "../../../queries/user"
import usePagination from "../../../hooks/usePagination"
import { FormFactoryItem } from "../../../components/FormFactory"
import { Card, Form, message, Space } from "antd"
import SearchForm from "../../../components/SearchForm"
import SearchButtonGroup from "../../../components/SearchButtonGroup"
import EditTable from "../../../components/EditTable"
import { useColumns, useDataSource } from "../../../hooks/useTable"
import useRole from "../../../hooks/useRole"
import useOpen from "../../../hooks/useOpen"
import FormModal from "../../../components/FormModal"
import { Link } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../../components/BaseRoleButtonGroups"
import DelPopover from "../../../components/DelPopover"
import gqlError from "../../../libs/gql-error"

export const NoticeTypes = [{
  value: "WEBSITE",
  label: "站务公告"
}, {
  value: "TEST_INFO",
  label: "考试信息"
}, {
  value: "DYNAMIC",
  label: "行业动态"
}, {
  value: "EXPERIENCE",
  label: "经验交流"
}].map((item, key) => ({ ...item, key }))
//获取公告
export const GetNoticesQuery = gql`
  query GetNotices(
    $page: Int!,
    $size: Int!,
    $id: Int,
    $title: String,
    $type: String,
    $orderBy:String
  ){
    getNotices(
      page: $page,
      size: $size,
      id: $id,
      title: $title,
      orderBy:$orderBy,
      type: $type
    ){
      ${PaginationFields}
      data{
        ${BaseFields}
        ${NoticeFields}
        creator{
          ${UserFields}
          ${BaseFields}
        }
      }
    }
  }
`
export interface GetNoticesResult {
  getNotices: BasePagination<NoticeEntity>
}

//创建公告
export const CreateNoticeMutation = gql`
  mutation CreateNotice(
    $title: String!,
    $type: String!
  ){
    createNotice(
      title: $title,
      type: $type
    ){
      ${BaseFields}
      ${NoticeFields}
    }
  }
`

//更新公告
export const UpdateNoticeMutation = gql`
  mutation UpdateNotice(
    $id: Int!,
    $type: String!,
    $title: String!
  ){
    updateNotice(
      id: $id,
      type: $type,
      title: $title
    ){
      ${BaseFields}
      ${NoticeFields}
    }
  }
`

//删除公告
export const DeleteNoticeMutation = gql`
  mutation DeleteNotice(
    $ids: [Int!]!
  ){
    deleteNotice(
      ids: $ids
    )
  }
`

const AdminNoticePage = () => {
  const {
    pagination,
    refetch,
    research,
    loading,
    data
  } = usePagination<NoticeEntity>({
    query: GetNoticesQuery,
    name: "getNotices"
  })
  const hasRole = useRole("/notices")
  const [open, onOpen, onCancel] = useOpen()
  const [deleteNotice] = useMutation(DeleteNoticeMutation, {
    onCompleted: ({ deleteNotice }) => {
      message.success(`成功删除${deleteNotice}条数据`)
      form.submit()
    },
    onError: (err) => {
      gqlError(err)
    }
  })
  const [updateNotice] = useMutation(UpdateNoticeMutation, {
    onCompleted: () => {
      message.success("操作成功")
    },
    onError: (err) => {
      gqlError(err)
    }
  })
  const [form] = Form.useForm()
  const searchOptions: FormFactoryItem[] = [{
    type: "number",
    label: "公告ID",
    name: "id",
    min: 1
  }, {
    type: "text",
    label: "标题",
    name: "title"
  }, {
    type: "select",
    label: "类型",
    name: "type",
    options: [{ label: "全部", value: "", key: -1 }, ...NoticeTypes]
  }]
  const dataSource = useDataSource(data)
  const columns = useColumns([
    { title: "公告ID", dataIndex: "id" },
    {
      title: "类型",
      dataIndex: "type",
      options: NoticeTypes,
      type: "select"
    },
    { title: "标题", dataIndex: "title", type: "textarea" },
    { title: "创建人", dataIndex: ["creator", "name"] },
    {
      title: "操作",
      render: (_: any, record: any) => {
        return (
          <Space>
            <Link to={`/notice/action?id=${record?.id}`}>
              <TextViewButton />
            </Link>
            <DelPopover
              onDelete={() => {
                deleteNotice({
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
    },
  ])
  const [createForm] = Form.useForm()
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <SearchForm
          options={searchOptions}
          name="notices"
          formProps={{
            layout: "inline",
            onFinish: research,
            form
          }}
        />
        <SearchButtonGroup
          onSearch={form.submit}
          onReset={form.resetFields}
        />
        <FormModal
          form={createForm}
          open={open}
          onCancel={onCancel}
          title="创建公告"
          query={CreateNoticeMutation}
          options={[{
            type: "text",
            label: "标题",
            name: "title",
            rules: [{ required: true, message: "标题不能为空" }]
          }, {
            type: "select",
            label: "类型",
            name: "type",
            options: NoticeTypes,
            rules: [{ required: true, message: "标题不能为空" }]
          }]}
          onCompleted={refetch}
        />
        <EditTable
          dataSource={dataSource}
          columns={columns}
          onCreate={onOpen}
          loading={loading}
          pagination={false}
          hasRole={hasRole}
          onDelete={(ids) => {
            deleteNotice({ variables: { ids } })
          }}
          onChangeItem={(record, edit) => {
            console.log(record, edit)
            updateNotice({
              variables: {
                ...record,
                ...edit
              }
            })
          }}
        />
        <div className="flex justify-end">
          {pagination}
        </div>
      </div>
    </Card>
  )
}
export default AdminNoticePage