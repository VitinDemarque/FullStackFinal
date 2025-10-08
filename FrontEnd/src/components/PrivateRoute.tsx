import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
