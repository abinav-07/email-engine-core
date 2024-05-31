import React, { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Layout, { Header, Content } from "antd/lib/layout/layout"
import { Row, Col, Form, Input, Button, message } from "antd"
import { LeftOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { AuthContext, parseJwt } from "../../../utils"
import { useMutation } from "react-query"
import { createUser } from "../../../services/users"

const RegisterUserPage = () => {
  const history = useNavigate()

  const { setUser } = useContext(AuthContext)

  const { mutate, isLoading: createLoading } = useMutation(createUser, {
    onSuccess: ({ data }: any) => {
      localStorage.setItem("role-token", data?.token)
      // Set Auth Context USer
      setUser(parseJwt())
      history("/admin/login")
    },
    onError: (err: any) => {
      message.open({
        type: "error",
        content: err?.response?.data?.message || "Error while registering User",
      })
    },
  })

  const onSubmit = (values) => {
    const formValues = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.registerEmail,
      password: values.registerPassword,
      confirm_password: values.registerConfirmPassword,
    }

    mutate(formValues)
  }

  //Redirect to Landing if already Logged In
  useEffect(() => {
    if (parseJwt()) {
      history("/admin/features")
    }
  })

  return (
    <>
      <Layout>
        <Header style={{ background: "#fff" }}>
          <Row>
            <Col xs={{ span: 2 }} md={{ span: 8 }}>
              <Button onClick={() => history("/")}>
                <LeftOutlined />
                Back
              </Button>
            </Col>
            <Col
              xs={{ span: 4, offset: 6 }}
              md={{ span: 8, offset: 8 }}
              style={{ textAlign: "end" }}
            >
              <Button>
                <Link to="/admin/login">Already have an account? Log In</Link>
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
              <h2>Sign Up</h2>
            </Row>
            <Row
              gutter={24}
              style={{
                width: "100%",
                paddingTop: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Col md={{ span: 8 }}>
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} onFinish={onSubmit}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Please Enter Your First Name!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Please Enter Your Last Name!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="registerEmail"
                    rules={[{ required: true, message: "Please Enter Email!" }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="registerPassword"
                    rules={[{ required: true, message: "Please Enter Password!" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    ></Input.Password>
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="registerConfirmPassword"
                    rules={[{ required: true, message: "Please Enter Password!" }]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                      }
                    ></Input.Password>
                  </Form.Item>
                  <Form.Item
                    name="signUp"
                    wrapperCol={{
                      xs: { offset: 0, span: 8 },
                      md: { offset: 8, span: 8 },
                    }}
                    style={{ textAlign: "center" }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "50%" }}
                      loading={createLoading}
                    >
                      Sign Up
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

export default RegisterUserPage
