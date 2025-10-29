import { useLocation, useNavigate } from 'react-router-dom'
import { FaHome, FaCode, FaTrophy, FaStar, FaUser, FaCog, FaSignOutAlt, FaChartLine, FaUsers } from 'react-icons/fa'
import { useAuth } from '@contexts/AuthContext'
import * as S from '@/styles/components/Sidebar/styles'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/desafios', icon: FaCode, label: 'Desafios' },
    { path: '/grupos', icon: FaUsers, label: 'Grupos' },
    { path: '/em-andamento', icon: FaChartLine, label: 'Em Andamento' },
    { path: '/ranking', icon: FaTrophy, label: 'Ranking' },
    { path: '/recomendacoes', icon: FaStar, label: 'Recomendações' },
    { path: '/profile', icon: FaUser, label: 'Perfil' },
    { path: '/configuracoes', icon: FaCog, label: 'Configurações' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <S.SidebarContainer>
      <S.SidebarHeader>
        <S.Logo to="/dashboard">
          <S.LogoBracket>{'{'}</S.LogoBracket>
          <S.LogoText>DevQuest</S.LogoText>
          <S.LogoBracket>{'}'}</S.LogoBracket>
        </S.Logo>
      </S.SidebarHeader>

      <S.UserInfo>
        <S.UserAvatar>
          {user?.avatarUrl ? (
            <S.UserAvatarImage src={user.avatarUrl} alt={user.name} />
          ) : (
            <FaUser />
          )}
        </S.UserAvatar>
        <S.UserDetails>
          <S.UserName>{user?.name || 'Usuário'}</S.UserName>
          <S.UserLevel>Level {user?.level || 1}</S.UserLevel>
        </S.UserDetails>
      </S.UserInfo>

      <S.Navigation>
        <S.NavList>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <S.NavItem to={item.path} $isActive={isActive}>
                  <Icon />
                  <span>{item.label}</span>
                </S.NavItem>
              </li>
            )
          })}
        </S.NavList>
      </S.Navigation>

      <S.LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Sair</span>
      </S.LogoutButton>
    </S.SidebarContainer>
  )
}

