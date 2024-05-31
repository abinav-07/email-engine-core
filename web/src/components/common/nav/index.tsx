import { Menu } from "antd"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { LogoutOutlined } from "@ant-design/icons"
import { NavBarDiv, NavBarMenuItem, LogoutButton } from "../../admin/nav/style"
import { NavbarItems as AdminNavBarItems } from "../../admin/nav/items"
import { NavbarItems } from "../../user/nav/items"
import { removeToken } from "../../../utils"

interface props {
  type: "Admin" | "User"
}

const NavBar = ({ type }: props) => {
  const history = useLocation()
  const navigate = useNavigate()

  const activeKey = history.pathname.split("/")[2] || history.pathname.split("/")[1]

  const logout = () => {
    removeToken("role-token")
    if (type == "Admin") {
      navigate("/admin/login")
    }
  }

  return (
    <NavBarDiv>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[activeKey]}>
        {type == "Admin" &&
          AdminNavBarItems?.map(({ key, label, path, icon }) => (
            <NavBarMenuItem key={key} icon={icon}>
              <Link to={path}>{label}</Link>
            </NavBarMenuItem>
          ))}
        {type == "User" &&
          NavbarItems?.map(({ key, label, path, icon }) => (
            <NavBarMenuItem key={key} icon={icon}>
              <Link to={path}>{label}</Link>
            </NavBarMenuItem>
          ))}
        <Menu.Item
          key="Logout"
          icon={<LogoutOutlined />}
          onClick={() => {
            logout()
          }}
        >
          <LogoutButton>Log Out</LogoutButton>
        </Menu.Item>
      </Menu>
    </NavBarDiv>
  )
}

export default NavBar
