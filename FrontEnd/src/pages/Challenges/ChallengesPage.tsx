import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

export default function ChallengesPage() {
  return (
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          🎯 Desafios
        </h1>
        <p style={{ color: '#6b7280' }}>
          Em breve você terá acesso a centenas de desafios de programação!
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

