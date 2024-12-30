import { Input, Button, Form, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import gqlError from "../../libs/gql-error";
import { useCallback } from "react";
import { useNavigate } from "react-router";


const InitAdminMutation = gql`
  mutation InitAdmin(
    $account:String!,
    $password:String!,
    $name:String!
  ){
    initAdmin(
      account:$account,
      password:$password,
      name:$name
    )
  }
`
const InitPage = () => {
  const nav = useNavigate()
  const client = useApolloClient()
  const [auth, { loading }] = useMutation(InitAdminMutation, {
    onCompleted({ initAdmin }) {
      if (initAdmin) {
        message.success("初始化成功")
        nav("/login")
        client.clearStore()
      } else {
        message.error("初始化失败")
      }
    },
    onError(error) {
      gqlError(error)
    },
  })
  const onFinish = useCallback((variables: any) => {
    if (variables.password !== variables.confirmPassword) {
      message.error("两次密码不一致")
      return
    }
    auth({ variables })
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">初始化管理员账户</h1>
        <p className="text-gray-600 mb-6 text-center">
        </p>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号！" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入账号"
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              loading={loading}
            >
              初始化账户
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default InitPage;