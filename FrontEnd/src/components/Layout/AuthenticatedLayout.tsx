import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import * as S from '@/styles/components/AuthenticatedLayout/styles'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <S.LayoutContainer>
      <Sidebar />
      <S.MainContent>
        {children}
      </S.MainContent>
    </S.LayoutContainer>
  )
}

