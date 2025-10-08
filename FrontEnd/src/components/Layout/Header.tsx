import { Link } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        </div>

        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '1rem' }}>Olá, {user?.name}</span>
              <Link to="/profile" style={{ marginRight: '1rem' }}>Perfil</Link>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/signup">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
