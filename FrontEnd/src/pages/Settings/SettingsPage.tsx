import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
          ⚙️ Configurações
        </h1>
        <p style={{ color: '#6b7280' }}>
          Configure suas preferências, notificações e privacidade.
        </p>
      </div>
    </AuthenticatedLayout>
  )
}

