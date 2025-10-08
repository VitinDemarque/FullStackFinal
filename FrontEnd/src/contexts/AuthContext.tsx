import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@services/auth.service'
import type { User, LoginCredentials, SignupData } from '@types/index'

interface AuthContextData {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      authService.logout()
    } finally {
      setLoading(false)
    }
  }

  async function login(credentials: LoginCredentials) {
    const response = await authService.login(credentials)
    setUser(response.user)
  }

  async function signup(data: SignupData) {
    const response = await authService.signup(data)
    setUser(response.user)
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
