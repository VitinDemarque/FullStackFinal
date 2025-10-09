import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

export default function InProgressPage() {
  return (
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          📊 Em Andamento
        </h1>
        <p style={{ color: '#6b7280' }}>
          Aqui você verá todos os seus desafios em andamento!
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

