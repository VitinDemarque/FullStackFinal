import { useEffect, useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { FaCode, FaTrophy, FaDumbbell, FaFire, FaStar } from 'react-icons/fa'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import './DashboardPage.css'

interface Exercise {
  id: string
  title: string
  difficulty: string
  xp: number
  language: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [inProgress, setInProgress] = useState({
    languages: 5,
    challenges: 12,
    exercises: 8,
  })
  const [recommendations, setRecommendations] = useState<Exercise[]>([])

  useEffect(() => {
    // Mock de dados - substituir por chamadas à API
    setRecommendations([
      { id: '1', title: 'Arrays e Loops', difficulty: 'Fácil', xp: 50, language: 'Python' },
      { id: '2', title: 'Funções Recursivas', difficulty: 'Médio', xp: 100, language: 'JavaScript' },
      { id: '3', title: 'Algoritmos de Ordenação', difficulty: 'Difícil', xp: 150, language: 'Java' },
      { id: '4', title: 'Estruturas de Dados', difficulty: 'Médio', xp: 120, language: 'C++' },
      { id: '5', title: 'Programação Orientada', difficulty: 'Médio', xp: 110, language: 'Python' },
      { id: '6', title: 'API REST', difficulty: 'Difícil', xp: 180, language: 'Node.js' },
    ])
  }, [])

  return (
    <AuthenticatedLayout>
      <div className="dashboard-page">
        <div className="dashboard-container">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="bracket">{'{'}</span>
              Hello World!
              <span className="bracket">{'}'}</span>
            </h1>
            <p className="hero-description">
              Bem-vindo de volta, <strong>{user?.name}</strong>! Continue sua jornada de aprendizado
              e conquiste novos desafios. Você está indo muito bem!
            </p>
            <button className="btn-action">
              <FaFire className="btn-icon" />
              Iniciar Desafio
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <FaTrophy className="stat-icon trophy" />
              <div>
                <p className="stat-value">Level {user?.level || 1}</p>
                <p className="stat-label">Seu Nível</p>
              </div>
            </div>
            <div className="stat-card">
              <FaStar className="stat-icon star" />
              <div>
                <p className="stat-value">{user?.xp || 0} XP</p>
                <p className="stat-label">Experiência</p>
              </div>
            </div>
          </div>
        </section>

        {/* Em Andamento */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <FaFire className="title-icon" />
            Em Andamento
          </h2>
          <div className="progress-grid">
            <div className="progress-card card-purple">
              <FaCode className="progress-icon" />
              <div className="progress-info">
                <h3>{inProgress.languages}</h3>
                <p>Linguagens</p>
              </div>
            </div>
            <div className="progress-card card-blue">
              <FaTrophy className="progress-icon" />
              <div className="progress-info">
                <h3>{inProgress.challenges}</h3>
                <p>Desafios</p>
              </div>
            </div>
            <div className="progress-card card-green">
              <FaDumbbell className="progress-icon" />
              <div className="progress-info">
                <h3>{inProgress.exercises}</h3>
                <p>Exercícios</p>
              </div>
            </div>
          </div>
        </section>

        {/* Em Desenvolvimento */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <FaCode className="title-icon" />
            Em Desenvolvimento
          </h2>
          <div className="development-banner">
            <div className="banner-content">
              <h3>🚀 Continue Aprendendo!</h3>
              <p>
                Você está progredindo bem! Mantenha o ritmo e complete seus desafios
                para desbloquear novas conquistas.
              </p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <p className="progress-text">65% dos desafios completos esta semana</p>
            </div>
          </div>
        </section>

        {/* Recomendações */}
        <section className="dashboard-section">
          <h2 className="section-title">
            <FaStar className="title-icon" />
            Recomendações
          </h2>
          <div className="recommendations-grid">
            {recommendations.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="card-header">
                  <span className={`difficulty-badge ${exercise.difficulty.toLowerCase()}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="xp-badge">
                    <FaStar /> {exercise.xp} XP
                  </span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{exercise.title}</h3>
                  <p className="card-language">
                    <FaCode /> {exercise.language}
                  </p>
                </div>
                <div className="card-footer">
                  <button className="btn-start">Começar</button>
                  <button className="btn-details">Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    </AuthenticatedLayout>
  )
}

