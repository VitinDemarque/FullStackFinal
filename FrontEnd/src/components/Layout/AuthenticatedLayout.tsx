import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import './AuthenticatedLayout.css'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

