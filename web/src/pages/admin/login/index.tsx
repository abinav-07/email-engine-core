import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Layout, Row, Col, Form, Input, Button, message } from "antd"
import { Content, Header } from "antd/lib/layout/layout"
import { LeftOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { AuthContext, parseJwt } from "../../../utils"
import { useMutation } from "react-query"
import { loginUser } from "../../../services"

const LoginAdminPage = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: ({ data }: any) => {
      localStorage.setItem("role-token", data?.token)

      // Set Auth Context USer
      setUser(parseJwt())

      navigate("/admin/features")
    },
    onError: (err: any) => {
      message.open({
        type: "error",
        content: err?.response?.data?.message || "Error while logging in User",
      })
    },
  })

  const onSubmit = (values) => {
    mutate(values)
  }

  //Redirect to Landing if already Logged In
  useEffect(() => {
    const user = parseJwt()
    if (user && user?.role == "Admin") {
      navigate("/admin/features")
    }
  }, [])

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <Row>
            <Col span={8}>
              <Button onClick={() => navigate("/")}>
                <LeftOutlined />
                Back
              </Button>
            </Col>
            <Col offset={8} span={8} style={{ textAlign: "end" }}>
              <Button onClick={() => navigate("/admin/register")}>
                <LeftOutlined />
                Create Account?
              </Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <Row
            justify="center"
            align="middle"
            className="main-content"
            style={{ flexDirection: "column", minHeight: "90vh" }}
          >
            <Row>
              <h2>Admin Log in</h2>
            </Row>

            <Row style={{ width: "100vw", paddingTop: "1rem" }}>
              <Col md={{ span: 12 }} offset={6}>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 8 }}
                  name="loginForm"
                  onFinish={onSubmit}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please Enter Email!" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please Enter Password!" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    ></Input.Password>
                  </Form.Item>
                  <Form.Item
                    style={{ textAlign: "center" }}
                    wrapperCol={{
                      xs: { offset: 0, span: 8 },
                      md: { offset: 8, span: 8 },
                    }}
                    name="logIn"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "50%" }}
                      loading={isLoading}
                    >
                      Log In
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Row>
        </Content>
      </Layout>
    </>
  )
}
export default LoginAdminPage
