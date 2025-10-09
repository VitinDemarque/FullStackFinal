import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaCode, FaTrophy, FaStar, FaUser, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa'
import { useAuth } from '@contexts/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/desafios', icon: FaCode, label: 'Desafios' },
    { path: '/em-andamento', icon: FaChartLine, label: 'Em Andamento' },
    { path: '/ranking', icon: FaTrophy, label: 'Ranking' },
    { path: '/recomendacoes', icon: FaStar, label: 'Recomendações' },
    { path: '/profile', icon: FaUser, label: 'Perfil' },
    { path: '/configuracoes', icon: FaCog, label: 'Configurações' },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <span className="logo-bracket">{'{'}</span>
          <span className="logo-text">DevQuest</span>
          <span className="logo-bracket">{'}'}</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <FaUser />
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'Usuário'}</p>
          <p className="user-level">Level {user?.level || 1}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt className="logout-icon" />
        <span>Sair</span>
      </button>
    </aside>
  )
}

