import { useCallback, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider, parseJwt } from "./utils"
import { message } from "antd"
import { Navigate, Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Roles } from "./utils/constants"
import PageRoutes from "./routes"
import BasicLayout from "./layout/layout"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

const PrivateRouter = () => {
  useEffect(() => {
    message.info({
      content: "You must login to view this page!",
    })
  }, [])

  return <Navigate to={"/admin/login"} />
}

const AdminPrivateRouter = () => {
  useEffect(() => {
    message.info({
      content: "You must be admin to view this page!",
    })
  }, [])
  return <Navigate to="/admin/login" />
}

const App = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(parseJwt())

  const initialLoad = useCallback(() => {
    try {
      const parsedUser = parseJwt()

      setUser(parsedUser)

      return
    } catch (error) {
      setUser(null)
      message.error("Unauthorized User")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initialLoad()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider loading={loading} user={user} setUser={setUser} role={user?.role as Roles}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                user?.role == "Admin" ? (
                  <Navigate to="/admin/features" />
                ) : (
                  <AdminPrivateRouter />
                )
              }
            />

            {PageRoutes.map(
              ({ path, privateRoute, adminRoute, layout: Layout, component: Component }, i) => {
                if (privateRoute && !adminRoute) {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        user?.role ? (
                          <Layout type="User">
                            <Component />
                          </Layout>
                        ) : (
                          <PrivateRouter />
                        )
                      }
                    />
                  )
                } else if (privateRoute && adminRoute) {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        user?.role !== "Admin" ? (
                          <AdminPrivateRouter />
                        ) : (
                          <Layout type="Admin">
                            <Component />
                          </Layout>
                        )
                      }
                    />
                  )
                } else {
                  return (
                    <Route
                      key={`${path}_${i}`}
                      path={path}
                      element={
                        <Layout type="Admin">
                          <Component />
                        </Layout>
                      }
                    ></Route>
                  )
                }
              },
            )}
            <Route
              path="*"
              element={
                user?.role ? (
                  <BasicLayout type="Admin">
                    <div
                      style={{
                        display: "flex",
                        height: "100vh",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Page Not Found!
                    </div>
                  </BasicLayout>
                ) : (
                  <PrivateRouter />
                )
              }
            ></Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}
export default App
