import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/auth.service'
import type { User, LoginCredentials, SignupData } from '../types/index'

interface AuthContextData {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          if (isMounted) {
            const localAvatar = localStorage.getItem(`avatar_${currentUser.id}`)
            if (localAvatar) {
              currentUser.avatarUrl = localAvatar
            }
            setUser(currentUser)
          }
        }
      } catch (error) {
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
    const localAvatar = localStorage.getItem(`avatar_${response.user.id}`)
    if (localAvatar) {
      response.user.avatarUrl = localAvatar
    }
    setUser(response.user)
  }

  async function signup(data: SignupData) {
    const response = await authService.signup(data)
    setUser(response.user)
  }

  async function loginWithGoogle(idToken: string) {
    const response = await authService.loginWithGoogle(idToken)
    const localAvatar = localStorage.getItem(`avatar_${response.user.id}`)
    if (localAvatar) {
      response.user.avatarUrl = localAvatar
    }
    setUser(response.user)
    
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  function updateUser(userData: Partial<User>) {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
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
