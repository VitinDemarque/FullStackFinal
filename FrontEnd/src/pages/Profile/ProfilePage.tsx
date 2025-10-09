import { useEffect } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { useAsync } from '@hooks/useAsync'
import { userService } from '@services/user.service'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

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
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
          👤 Meu Perfil
        </h1>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
            {user.name}
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <p style={{ fontSize: '1rem', color: '#4b5563' }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ fontSize: '1rem', color: '#4b5563' }}>
              <strong>Handle:</strong> @{user.handle}
            </p>
            <p style={{ fontSize: '1rem', color: '#4b5563' }}>
              <strong>Nível:</strong> {user.level}
            </p>
            <p style={{ fontSize: '1rem', color: '#4b5563' }}>
              <strong>XP Total:</strong> {user.xpTotal}
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Carregando estatísticas...
          </div>
        )}

        {scoreboard && (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
              📊 Estatísticas
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <p style={{ fontSize: '1rem', color: '#4b5563' }}>
                <strong>Exercícios criados:</strong> {scoreboard.created}
              </p>
              <p style={{ fontSize: '1rem', color: '#4b5563' }}>
                <strong>Exercícios resolvidos:</strong> {scoreboard.solved}
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
