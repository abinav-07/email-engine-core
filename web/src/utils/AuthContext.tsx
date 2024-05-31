import { createContext, FC, ReactNode } from "react"
import { Roles } from "./constants"

interface ContextProps {
  loading: boolean
  user: any | null
  authenticated: boolean
  setUser: any
  role: Roles
}

export const AuthContext = createContext<Partial<ContextProps>>({})

interface AuthProviderProps extends Omit<ContextProps, "authenticated"> {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ loading, user, setUser, children, role }) => {
  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        authenticated: user !== null,
        setUser,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
