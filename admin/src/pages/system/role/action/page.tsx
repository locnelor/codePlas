import { gql, useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useLocation, useNavigate } from "react-router"
import { GetMenuQuery, GetMenuQueryResult } from "../../../UserMenus";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Checkbox, Col, Form, message, Row, Space, Table } from "antd";
import HeadBack from "../../../../components/HeadBack";
import { GetRoleQuery, GetRoleQueryResult } from "../page";
import gqlError from "../../../../libs/gql-error";
import FormFactory, { FormFactoryItem } from "../../../../components/FormFactory";
import { MenuEntity } from "../../../../queries/menu";
import { useColumns, useDataSource } from "../../../../hooks/useTable";
import { PowerArray } from "../../../../hooks/useRole";
import { deepCopyArray } from "../../../../libs/utils";

export const CreateRoleMutation = gql`
  mutation CreateRole(
    $name:String!,
    $status:Boolean,
    $comment:String,
    $sys_menu_on_role:[SysMenuOnRoleInput!]
  ){
    createRole(
      name:$name,
      status:$status,
      comment:$comment,
      sys_menu_on_role:$sys_menu_on_role
    ){
      id
    }
  }
`
export type CreateRoleMutationResult = {
  createRole: {
    id: number
  }
}
export const UpdateRoleMutation = gql`
  mutation UpdateRole(
    $id:Int!,
    $name:String!,
    $status:Boolean,
    $comment:String,
    $sys_menu_on_role:[SysMenuOnRoleInput!]
  ){
    updateRole(
      id:$id,
      name:$name,
      status:$status,
      comment:$comment,
      sys_menu_on_role:$sys_menu_on_role
    ){
      id
    }
  }
`

/**
 * 编辑该角色
 * 编辑使用该角色的用户
 * 编辑角色的菜单权限
 */
const SystemRoleActionPage = () => {
  const location = useLocation();
  const nav = useNavigate();
  const client = useApolloClient();
  const queryParams = new URLSearchParams(location.search);
  const id = parseInt(queryParams.get("id") || "0")
  const menuQuery = useQuery<GetMenuQueryResult>(GetMenuQuery)
  const menus = useDataSource(menuQuery.data?.getMenu || [])
  const treeMenu = useMemo(() => {
    const makeTree = (list: MenuEntity[], parent: null | number = null) => {
      const result: MenuEntity[] = [];
      for (const item of list) {
        if (item.parentId === parent) {
          const children = makeTree(list, item.id);
          result.push({ ...item, children: children.length > 0 ? children : null });
        }
      }
      return result;
    }
    const tree = makeTree([...menus]);
    return tree;
  }, [menus])
  const [getRole, roleQuery] = useLazyQuery<GetRoleQueryResult>(GetRoleQuery, {
    variables: {
      id
    }
  });
  const [form] = Form.useForm();
  const [roleOnMenu, setRoleOnMenu] = useState<{ sys_menuId: number, power: number }[]>([])
  useEffect(() => {
    if (!!id) {
      getRole({
        variables: {
          id
        },
      })
    }
  }, [])
  const [createRole] = useMutation<CreateRoleMutationResult>(CreateRoleMutation, {
    onCompleted: ({ createRole }) => {
      message.success("操作成功")
      nav("/system/role/action?id=" + createRole.id)
      client.refetchQueries({
        include: ["GetRole"]
      })
    },
    onError: (error) => {
      gqlError(error)
    }
  })
  const [updateRole] = useMutation(UpdateRoleMutation, {
    onCompleted: () => {
      message.success("操作成功")
      client.refetchQueries({
        include: ["GetRole"]
      })
      roleQuery.refetch({
        variables: {
          id
        }
      })
    },
    onError: (error) => {
      gqlError(error)
    }
  })
  const onFinish = useCallback((variables: any) => {
    console.log(variables, roleOnMenu)
    if (!!id) {
      updateRole({
        variables: {
          id,
          ...variables,
          sys_menu_on_role: roleOnMenu.map(({ sys_menuId, power }) => ({ sys_menuId, power }))
        }
      })
      return;
    }
    createRole({
      variables: {
        ...variables,
        sys_menu_on_role: roleOnMenu.map(({ sys_menuId, power }) => ({ sys_menuId, power }))
      }
    })

  }, [roleOnMenu, id])
  const menuColumns = useColumns([{
    title: "菜单名称",
    dataIndex: "name"
  }, {
    title: "菜单路径",
    dataIndex: "path"
  }, {
    title: "菜单权限",
    dataIndex: "role",
    render: (role: number, record: MenuEntity) => {
      const index = roleOnMenu.findIndex(item => item.sys_menuId === record.id);
      const findRole = roleOnMenu[index];
      return (
        <Space>
          {PowerArray.map((name, key) => {
            return (
              <Checkbox
                key={key}
                disabled={!(role & (1 << key)) || !findRole}
                checked={!!(findRole && (findRole.power & (1 << key)))}
                onChange={({ target: { checked } }) => {
                  if (!findRole) return;
                  findRole.power = checked ? findRole.power | (1 << key) : findRole.power & ~(1 << key);
                  roleOnMenu[index] = findRole;
                  setRoleOnMenu([...roleOnMenu])
                }}
              >
                {name}
              </Checkbox>
            )
          })}
        </Space>
      )
    }
  }])
  useEffect(() => {
    if (roleQuery.loading) return;
    if (!!roleQuery.error) {
      gqlError(roleQuery.error);
      return;
    }
    if (!roleQuery.data) {
      return;
    }
    const role = roleQuery.data.getRole[0];
    if (!role) {
      message.error("角色不存在");
      return;
    }
    form.setFieldsValue(role)
    setRoleOnMenu(deepCopyArray(role.sys_menu_on_role))
  }, [roleQuery.data])
  const options: FormFactoryItem[] = [{
    type: "text",
    label: "角色名称",
    name: "name"
  }, {
    type: "switch",
    label: "状态",
    name: "status"
  }, {
    type: "textarea",
    label: "备注",
    name: "comment"
  }]

  return (
    <div>
      <HeadBack href="/system/role" />
      <Row gutter={[20, 20]}>
        <Col span={8} className="">
          <Card className="h-full">
            <div>角色信息</div>
            <FormFactory
              options={options}
              formProps={{
                form,
                labelCol: {
                  span: 6
                },
                wrapperCol: {
                  span: 18
                },
                onFinish
              }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card className="h-full">
            <div>角色菜单</div>
            <div className="flex flex-col justify-between gap-2">
              <Table
                pagination={false}
                dataSource={treeMenu}
                columns={menuColumns}
                rowSelection={{
                  selectedRowKeys: roleOnMenu.map(e => e.sys_menuId),
                  onChange: (ids) => {
                    setRoleOnMenu(prev => {
                      return ids.map((sys_menuId) => {
                        sys_menuId = parseInt(sys_menuId.toString())
                        return {
                          sys_menuId,
                          power: prev.find((item) => item.sys_menuId === sys_menuId)?.power || 0
                        }
                      })
                    })
                  }
                }}
              />
              <div className="flex justify-end">
                <Button
                  onClick={form.submit}
                  type="primary"
                >
                  保存
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <div>角色用户</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default SystemRoleActionPage