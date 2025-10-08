import Header from '@components/Layout/Header'

export default function HomePage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>Bem-vindo à Plataforma de Ranking</h1>
        <p>Plataforma para exercícios de programação com sistema de ranking.</p>
      </main>
    </div>
  )
}
