import { gql, useQuery } from "@apollo/client"
import { BaseFields, BasePagination, PaginationFields } from "../../../queries/base"
import { UserEntity, UserFields } from "../../../queries/user"
import useRole from "../../../hooks/useRole"
import { GetRoleQuery, GetRoleQueryResult } from "../role/page"
import { Card, Form } from "antd"
import { useNavigate } from "react-router"
import { useColumns, useDataSource } from "../../../hooks/useTable"
import { FormFactoryItem } from "../../../components/FormFactory"
import SearchForm from "../../../components/SearchForm"
import { useCallback } from "react"
import SearchButtonGroup from "../../../components/SearchButtonGroup"
import EditTable from "../../../components/EditTable"
import usePagination from "../../../hooks/usePagination"

export const FindUsersQuery = gql`
  query FindUsers(
    $page:Int!,
    $size:Int!,
    $id:Int,
    $account:String,
    $name:String,
    $sys_roleId:Int
  ){
    findUsers(
      page:$page,
      size:$size,
      id:$id,
      account:$account,
      name:$name,
      sys_roleId:$sys_roleId
    ){
      ${PaginationFields}
      data{
        ${UserFields}
        ${BaseFields}
      }
    }
  }
`
export interface FindUsersResult {
  findUsers: BasePagination<UserEntity>
}
const SystemUsersPage = () => {
  const hasRole = useRole("/system/users")
  const roleQuery = useQuery<GetRoleQueryResult>(GetRoleQuery, {
    nextFetchPolicy: "network-only"
  })
  const [form] = Form.useForm()
  const {
    research,
    pagination,
    data
  } = usePagination({
    query: FindUsersQuery,
    name: "findUsers"
  })
  console.log(data)
  const nav = useNavigate()
  const roles = roleQuery.data?.getRole || [];
  const columns = useColumns([
    { title: "用户ID", dataIndex: "id" },
    { title: "用户名", dataIndex: "name", type: "text" },
    { title: "账号", dataIndex: "account", type: "text" },
    { title: "角色", dataIndex: "sys_roleId", type: "select" },
    { title: "操作" }
  ])
  const searchOptions: FormFactoryItem[] = [{
    type: "number",
    label: "用户ID",
    name: "id",
    min: 1
  }, {
    type: "text",
    label: "用户名",
    name: "name"
  }, {
    type: "text",
    label: "账号",
    name: "account"
  }, {
    type: "select",
    label: "角色",
    name: "sys_roleId",
    options: [{
      label: "全部",
      value: null
    }, ...roles.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })]
  }]
  const onFinish = useCallback((variables: any) => {
    research(variables)
  }, [research])
  const dataSource = useDataSource(data)
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <SearchForm
          options={searchOptions}
          name="users"
          formProps={{
            layout: "inline",
            onFinish,
            form
          }}
        />
        <SearchButtonGroup
          onSearch={form.submit}
          onReset={form.resetFields}
        />
        <EditTable
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          hasRole={hasRole}
          onChangeItem={(record, edit) => {
            console.log(record, edit)
          }}
        />
        {pagination}
      </div>
    </Card>
  )
}
export default SystemUsersPage