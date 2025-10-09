import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

export default function RecommendationsPage() {
  return (
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          ⭐ Recomendações
        </h1>
        <p style={{ color: '#6b7280' }}>
          Desafios personalizados baseados no seu histórico e nível!
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

