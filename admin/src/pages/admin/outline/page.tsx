import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Card, Form, message, Modal, Space } from "antd"
import { useCallback } from "react";
import { Link } from "react-router";
import { TextViewButton, TextDeleteButton } from "../../../components/BaseRoleButtonGroups";
import DelPopover from "../../../components/DelPopover";
import EditTable from "../../../components/EditTable";
import FormFactory from "../../../components/FormFactory";
import SearchForm from "../../../components/SearchForm";
import useRole from "../../../hooks/useRole";
import { useDataSource, useColumns } from "../../../hooks/useTable";
import gqlError from "../../../libs/gql-error";
import { OutlineEntity, OutlineFields } from "../../../queries/outline";
import { BaseFields } from "../../../queries/base";
import useOpen from "../../../hooks/useOpen";
import { outlineUploadFile } from "../../../api/upload";
import { baseURL } from "../../../api";


export const QueryOutlineQuery = gql`
  query QueryOutline{
    queryOutline{
      ${OutlineFields}
      ${BaseFields}
    }
  }
`
export interface QueryOutlineQueryResult {
  queryOutline: OutlineEntity[]
}
export const CreateOutlineMutation = gql`
  mutation CreateOutline(
    $name:String!,
    $order:Int,
    $status:Boolean,
    $comment:String,
  ){
    createOutline(
      name:$name,
      order:$order,
      status:$status,
      comment:$comment
    ){
      id
    }
  }
`
export const UpdateOutlineMutation = gql`
  mutation UpdateOutline(
    $id:Int!,
    $name:String!,
    $order:Int,
    $status:Boolean,
    $comment:String,
  ){
    updateOutline(
      id:$id,
      name:$name,
      order:$order,
      status:$status,
      comment:$comment
    ){
      id
    }
  }
`
export const DeleteOutlineMutation = gql`
  mutation DeleteOutline(
    $ids:[Int!]!
  ){
    deleteOutline(
      ids:$ids
    )
  }
`
const AdminOutlinePage = () => {
  const [getRole, query] = useLazyQuery<QueryOutlineQueryResult>(QueryOutlineQuery)
  const dataSource = useDataSource(query.data?.queryOutline);
  const hasRole = useRole("/outline");
  const [form] = Form.useForm()
  const [update] = useMutation(UpdateOutlineMutation, {
    onCompleted: () => {
      message.success("操作成功")
      form.submit()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [createTodo, create] = useMutation(CreateOutlineMutation, {
    onCompleted: () => {
      message.success("操作成功")
      onCancel()
      form.submit()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [del] = useMutation(DeleteOutlineMutation, {
    onCompleted: ({ deleteOutline }) => {
      message.success(`成功删除${deleteOutline}条数据`)
      form.submit()
    },
    onError: (err) => {
      gqlError(err)
    }
  });
  const columns = useColumns([
    { title: "知识大纲ID", dataIndex: "id" },
    { title: '文件名称', dataIndex: 'name', type: "text" },
    { title: '状态', dataIndex: 'status', type: "switch" },
    { title: '备注', dataIndex: 'comment', type: "textarea" },
    {
      title: "操作",
      dataIndex: "action",
      render: (_: any, record: any) => {
        return (
          <Space>
            <Link target="_blank" to={`${baseURL}outline/${record.id}/download`}>
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
    }
  ])
  // const searchOptions: FormFactoryItem[] = [{
  //   type: "number",
  //   label: "知识大纲ID",
  //   name: "id",
  //   min: 1
  // }, {
  //   type: "text",
  //   label: "文件名称",
  //   name: "name"
  // }, {
  //   type: "switch",
  //   label: "状态",
  //   name: "status"
  // }, {
  //   type: "text",
  //   label: "备注",
  //   name: "comment"
  // }]
  const onFinish = useCallback((variables: any) => {
    getRole({ variables, fetchPolicy: "network-only" })
  }, [])
  const onChangeItem = useCallback(({
    id,
    name,
    status,
    comment
  }: any, rest: any) => {
    update({
      variables: {
        id,
        name,
        status,
        comment,
        ...rest
      }
    })
  }, [])
  const [createForm] = Form.useForm()
  const [open, onOpen, onCancel] = useOpen()
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <SearchForm
          options={[]}
          name="outline"
          formProps={{
            layout: "inline",
            onFinish,
            form
          }}
        />
        {/* <SearchButtonGroup
          onSearch={form.submit}
          onReset={() => form.resetFields()}
        /> */}
        <Modal
          title="创建知识大纲"
          open={open}
          onOk={() => createForm.submit()}
          loading={create.loading}
          onCancel={onCancel}
        >
          <FormFactory
            formProps={{
              form: createForm,
              name: "outline",
              onFinish: (variables) => {
                createTodo({
                  variables
                }).then(({ data }) => {
                  const { id } = data.createOutline
                  outlineUploadFile(id, variables.file[0].originFileObj)
                })
              },
            }}
            options={[{
              type: "text",
              label: "文件名称",
              name: "name",
              rules: [{
                required: true,
                message: "请输入文件名称"
              }]
            }, {
              type: "file",
              label: "文件",
              name: "file",
              rules: [{
                required: true,
                message: "请上传文件"
              }],
              accept: ".pdf"
            }, {
              label: "状态",
              name: "status",
              type: "switch",
              valuePropName: "checked"
            }, {
              type: "textarea",
              label: "备注",
              name: "comment",
            }]}
          />
        </Modal>
        <EditTable
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          loading={query.loading}
          hasRole={hasRole}
          onDelete={(ids) => {
            del({
              variables: {
                ids
              }
            })
          }}
          onChangeItem={onChangeItem}
          onCreate={onOpen}
        />
      </div>
    </Card>
  )
}
export default AdminOutlinePage