import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { BaseFields } from "../../../../queries/base"
import { RoleFields } from "../../../../queries/role"
import { MenuOnRoleEntity, MenuOnRoleFields } from "../../../../queries/on"
import { Card, Form, message, Space } from 'antd';
import { useColumns, useDataSource } from "../../../../hooks/useTable"
import useRole from "../../../../hooks/useRole"
import SearchForm from "../../../../components/SearchForm"
import { useCallback } from "react"
import { TextDeleteButton, TextViewButton } from "../../../../components/BaseRoleButtonGroups"
import { Link, useNavigate } from "react-router"
import SearchButtonGroup from "../../../../components/SearchButtonGroup"
import EditTable from "../../../../components/EditTable"
import { FormFactoryItem } from "../../../../components/FormFactory";
import gqlError from "../../../../libs/gql-error";
import DelPopover from "../../../../components/DelPopover";
import { UpdateRoleMutation } from "./action/page";
//获取角色
export const GetRoleQuery = gql`
  query GetRole(
    $id:Int,
    $name:String,
    $status:Boolean,
    $comment:String
  ){
    getRole(
      id:$id,
      name:$name,
      status:$status,
      comment:$comment
    ){
      ${BaseFields}
      ${RoleFields}
      sys_menu_on_role{
        ${MenuOnRoleFields}
      }
    }
  }
`
export type GetRoleQueryResult = {
  getRole: {
    id: number
    name: string
    sys_menu_on_role: MenuOnRoleEntity[]
  }[]
}
export const DelteRoleMutation = gql`
  mutation DelteRole(
    $ids:[Int!]!
  ){
    deleteRole(
      ids:$ids
    )
  }
`

const AdminSystemRolePage = () => {
  const [getRole, roleQuery] = useLazyQuery<GetRoleQueryResult>(GetRoleQuery)
  const roles = useDataSource(roleQuery.data?.getRole);
  const hasRole = useRole("/system/role");
  const [form] = Form.useForm()
  const [updateRole] = useMutation(UpdateRoleMutation, {
    onCompleted: () => {
      message.success("操作成功")
      form.submit()
    },
    onError(error) {
      gqlError(error)
    },
  })
  const [deleteRole] = useMutation(DelteRoleMutation, {
    onCompleted: ({ deleteRole }) => {
      message.success(`成功删除${deleteRole}条数据`)
      form.submit()
    },
    onError: (err) => {
      gqlError(err)
    }
  });
  const nav = useNavigate()
  const columns = useColumns([
    { title: "角色ID", dataIndex: "id" },
    { title: '角色名称', dataIndex: 'name', type: "text" },
    { title: '状态', dataIndex: 'status', type: "switch" },
    { title: '备注', dataIndex: 'comment', type: "textarea" },
    {
      title: "操作",
      dataIndex: "action",
      render: (_: any, record: any) => {
        return (
          <Space>
            <Link to={`/system/role/action?id=${record?.id}`}>
              <TextViewButton />
            </Link>
            <DelPopover
              onDelete={() => {
                deleteRole({
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
  const searchOptions: FormFactoryItem[] = [{
    type: "number",
    label: "角色ID",
    name: "id",
    min: 1
  }, {
    type: "text",
    label: "角色名称",
    name: "name"
  }, {
    type: "switch",
    label: "状态",
    name: "status"
  }, {
    type: "text",
    label: "备注",
    name: "comment"
  }]
  const onFinish = useCallback((variables: any) => {
    getRole({ variables, fetchPolicy: "network-only" })
  }, [])
  const onChangeItem = useCallback(({
    id,
    name,
    status,
    comment
  }: any, rest: any) => {
    updateRole({
      variables: {
        id,
        name,
        status,
        comment,
        ...rest
      }
    })
  }, [])
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <SearchForm
          options={searchOptions}
          name="role"
          formProps={{
            layout: "inline",
            onFinish,
            form
          }}
        />
        <SearchButtonGroup
          onSearch={form.submit}
          onReset={() => form.resetFields()}
        />
        <EditTable
          dataSource={roles}
          columns={columns}
          pagination={false}
          loading={roleQuery.loading}
          hasRole={hasRole}
          onDelete={(ids) => {
            deleteRole({
              variables: {
                ids
              }
            })
          }}
          onChangeItem={onChangeItem}
          onCreate={() => {
            nav("/system/role/action")
          }}
        />
      </div>
    </Card>
  )
}
export default AdminSystemRolePage


