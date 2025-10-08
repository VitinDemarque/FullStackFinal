import { Link } from 'react-router-dom'
import Header from '@components/Layout/Header'

export default function NotFoundPage() {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>404 - Página não encontrada</h1>
        <p>A página que você procura não existe.</p>
        <Link to="/">Voltar para Home</Link>
      </main>
    </div>
  )
}
