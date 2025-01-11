import { gql, useMutation, useQuery } from "@apollo/client"
import { Card, Form, Image, message, Space } from "antd"
import { BaseFields } from "../../queries/base"
import gqlError from "../../libs/gql-error"
import { useColumns, useDataSource } from "../../hooks/useTable"
import EditTable from "../../components/EditTable"
import useRole from "../../hooks/useRole"
import FormModal from "../../components/FormModal"
import useOpen from "../../hooks/useOpen"
import { Link } from "react-router"
import { TextViewButton, TextDeleteButton } from "../../components/BaseRoleButtonGroups"
import DelPopover from "../../components/DelPopover"
import { SoftwareEntity, SoftwareFields } from "../../queries/software"
import { joinPath } from "../../libs/http-fetch"


export const QuerySoftwareQuery = gql`
  query QuerySoftware{
    querySoftware{
      ${BaseFields}
      ${SoftwareFields}
    }
  }
`
export interface QuerySoftwareResult {
  querySoftware: SoftwareEntity[]
}
export const CreateSoftwareMutation = gql`
  mutation CreateSoftware(
    $base64: String!,
    $title: String!,
    $href: String!,
    $description: String!,
  ){
    createSoftware(
      base64: $base64,
      title: $title,
      href: $href,
      description: $description,
    ){
      id
    }
  }
`
export const UpdateSoftwareMutation = gql`
  mutation UpdateSoftware(
    $id: Int!,
    $base64: String,
    $title: String!,
    $href: String!,
    $description: String!,
  ){
    updateSoftware(
      base64: $base64,
      title: $title,
      href: $href,
      description: $description,
      id: $id
    ){
      id
    }
  }
`
export const DeleteSoftwareMutation = gql`
  mutation DeleteSoftware(
    $ids: [Int!]!
  ){
    deleteSoftware(
      ids: $ids
    )
  }
`
const SoftwarePage = () => {
  const { data, loading, refetch } = useQuery<QuerySoftwareResult>(QuerySoftwareQuery)
  const [update, { loading: updateLoading }] = useMutation(UpdateSoftwareMutation, {
    onCompleted() {
      message.success("修改成功")
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del, { loading: deleteLoading }] = useMutation(DeleteSoftwareMutation, {
    onCompleted({ deletePartner }) {
      message.success(`成功删除${deletePartner}条数据`)
      refetch()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const hasRole = useRole("/partner")
  const dataSource = useDataSource(data?.querySoftware)
  const columns = useColumns([{
    title: "ID",
    dataIndex: "id"
  }, {
    title: "图片",
    render: (record: any) => {
      return (
        <div>
          <Image
            src={joinPath(`/media/software/${record.id}/cover`)}
          />
        </div>
      )
    }
  }, {
    title: "标题",
    dataIndex: "title",
    type: "text"
  }, {
    title: "链接",
    dataIndex: "href",
    type: "text"
  }, {
    title: "描述",
    dataIndex: "description",
    type: "textarea"
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
        query={CreateSoftwareMutation}
        options={[
          {
            label: "图片",
            name: "base64",
            type: "cover",
            rules: [{ required: true, message: "请上传图片" }]
          },
          {
            label: "标题",
            name: "title",
            type: "text",
            rules: [{ required: true, message: "请输入标题" }]
          },
          {
            label: "链接",
            name: "href",
            type: "text",
            rules: [{ required: true, message: "请输入链接" }]
          },
          {
            label: "描述",
            name: "description",
            type: "textarea",
            rules: [{ required: true, message: "请输入描述" }]
          }
        ]}
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
export default SoftwarePage