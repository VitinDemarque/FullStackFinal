import { useEffect } from 'react'
import Header from '@components/Layout/Header'
import { useAuth } from '@contexts/AuthContext'
import { useAsync } from '@hooks/useAsync'
import { userService } from '@services/user.service'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: scoreboard, loading, execute } = useAsync(
    () => userService.getScoreboard(user!.id),
    false
  )

  useEffect(() => {
    if (user) {
      execute()
    }
  }, [user, execute])

  if (!user) return null

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>Meu Perfil</h1>

        <div style={{ marginTop: '2rem' }}>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Handle: @{user.handle}</p>
          <p>Nível: {user.level}</p>
          <p>XP Total: {user.xpTotal}</p>
        </div>

        {loading && <div>Carregando estatísticas...</div>}

        {scoreboard && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Estatísticas</h3>
            <p>Exercícios criados: {scoreboard.created}</p>
            <p>Exercícios resolvidos: {scoreboard.solved}</p>
          </div>
        )}
      </main>
    </div>
  )
}
