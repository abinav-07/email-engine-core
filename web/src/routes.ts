import BlankLayout from "./layout/blank"
import BasicLayout from "./layout/layout"
import FeatureList from "./pages/admin/features"

import LoginAdminPage from "./pages/admin/login"
import MemberList from "./pages/admin/members"
import RegisterAdminPage from "./pages/admin/register"

const PageRoutes = [
  // Admin Pages

  {
    name: "Register Page",
    path: "/admin/register",
    privateRoute: false, //access to all users
    adminRoute: false,
    layout: BlankLayout,
    component: RegisterAdminPage,
  },

  {
    name: "Admin Login Page",
    path: "/admin/login",
    privateRoute: false,
    adminRoute: false,
    layout: BlankLayout,
    component: LoginAdminPage,
  },
  {
    name: "Admin Features Page",
    path: "/admin/features",
    privateRoute: true,
    adminRoute: true,
    layout: BasicLayout,
    component: FeatureList,
  },
  {
    name: "Admin Members Page",
    path: "/admin/members",
    privateRoute: true,
    adminRoute: true,
    layout: BasicLayout,
    component: MemberList,
  },
]

export default PageRoutes
