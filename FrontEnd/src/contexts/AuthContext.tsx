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
    let isMounted = true

    async function initializeAuth() {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          if (isMounted) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        // Só faz logout se o erro for 401 (não autorizado)
        const apiError = error as any
        if (apiError.statusCode === 401) {
          authService.logout()
          if (isMounted) {
            setUser(null)
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listener para evento de 401 não autorizado
    const handleUnauthorized = () => {
      if (isMounted) {
        setUser(null)
        setLoading(false)
      }
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      isMounted = false
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

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
