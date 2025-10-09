import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

export default function RankingPage() {
  return (
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          🏆 Ranking Global
        </h1>
        <p style={{ color: '#6b7280' }}>
          Veja sua posição no ranking global e compita com outros desenvolvedores!
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

