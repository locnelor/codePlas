import { Input, Button, Form } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import gqlError from "../../libs/gql-error";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";


const AuthMutation = gql`
  mutation Auth(
    $account:String!,
    $password:String!
  ){
    auth(
      account:$account,
      password:$password
    )
  }
`
const IsAdminQuery = gql`
  query IsAdmin{
    isAdmin
  }
`
const LoginPage = () => {
  const { data } = useQuery(IsAdminQuery)
  const nav = useNavigate()
  const [auth, { loading }] = useMutation(AuthMutation, {
    onCompleted({ auth }) {
      window.localStorage.setItem("token", auth)
      nav("/")
    },
    onError(error) {
      gqlError(error)
    },
  })
  const onFinish = useCallback((variables: any) => {
    auth({ variables })
  }, []);
  useEffect(() => {
    if (!data) return;
    if (!data.isAdmin) {
      nav("/init")
    }
  }, [data])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">登录</h1>
        <p className="text-gray-600 mb-6 text-center">
        </p>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;