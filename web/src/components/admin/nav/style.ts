import { Menu, Button } from "antd"
import styled from "styled-components"

export const NavBarDiv = styled.div`
  height: 100vh;
`

export const NavBarMenu = styled(Menu)``
export const NavBarMenuItem = styled(Menu.Item)``

export const LogoutButton = styled(Button)`
  border: none;
  padding-left: 0px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  background-color: transparent;
`
