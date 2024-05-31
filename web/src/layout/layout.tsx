import { useState } from "react"
import { Layout } from "antd"
import styled from "styled-components"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import NavBar from "../components/common/nav"

interface props {
  type: "Admin" | "User"
  children?: any
}

const { Content, Sider, Header } = Layout

const LayoutContent = styled(Content)`
  min-height: 100vh;
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 2rem;
`

const BasicLayout = ({ type, children }: props) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSider = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout
      style={{
        backgroundColor: "#fff",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Header
          style={{
            paddingRight: "20px",
            textAlign: "right",
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ color: "white", fontSize: "1.3rem" }}
              onClick={() => {
                toggleSider()
              }}
            />
          ) : (
            <MenuFoldOutlined
              style={{ color: "white", fontSize: "1.3rem" }}
              onClick={() => {
                toggleSider()
              }}
            />
          )}
        </Header>
        <NavBar type={type} />
      </Sider>
      <LayoutContent>{children}</LayoutContent>
    </Layout>
  )
}

export default BasicLayout
