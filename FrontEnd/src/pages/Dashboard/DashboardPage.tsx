import { useEffect, useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { FaCode, FaTrophy, FaDumbbell, FaFire, FaStar } from 'react-icons/fa'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { exercisesService, statsService } from '@services/index'
import type { Exercise } from '../../types'
import './DashboardPage.css'

interface DashboardStats {
  languages: number
  challenges: number
  exercises: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    languages: 0,
    challenges: 0,
    exercises: 0,
  })
  const [recommendations, setRecommendations] = useState<Exercise[]>([])
  const [weekProgress, setWeekProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  async function loadDashboardData() {
    try {
      setLoading(true)
      
      // Carregar stats e recomendações em paralelo
      const [dashboardStats, exercisesList] = await Promise.all([
        statsService.getDashboardStats(user!.id),
        exercisesService.getRecommendations(6),
      ])

      setStats({
        languages: dashboardStats.languages,
        challenges: dashboardStats.challenges,
        exercises: dashboardStats.exercises,
      })
      setWeekProgress(dashboardStats.weekProgress)
      setRecommendations(exercisesList)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

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
                <h3>{loading ? '...' : stats.languages}</h3>
                <p>Linguagens</p>
              </div>
            </div>
            <div className="progress-card card-blue">
              <FaTrophy className="progress-icon" />
              <div className="progress-info">
                <h3>{loading ? '...' : stats.challenges}</h3>
                <p>Desafios</p>
              </div>
            </div>
            <div className="progress-card card-green">
              <FaDumbbell className="progress-icon" />
              <div className="progress-info">
                <h3>{loading ? '...' : stats.exercises}</h3>
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
                <div className="progress-fill" style={{ width: `${weekProgress}%` }}></div>
              </div>
              <p className="progress-text">{weekProgress}% dos desafios completos esta semana</p>
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="exercise-card skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-body"></div>
                  <div className="skeleton-footer"></div>
                </div>
              ))
            ) : recommendations.length > 0 ? (
              recommendations.map((exercise) => {
                // Mapear dificuldade numérica para texto
                const difficultyMap: Record<number, string> = {
                  1: 'Fácil',
                  2: 'Médio',
                  3: 'Difícil',
                  4: 'Expert',
                }
                const difficultyText = difficultyMap[exercise.difficulty] || 'Médio'
                
                return (
                  <div key={exercise.id} className="exercise-card">
                    <div className="card-header">
                      <span className={`difficulty-badge ${difficultyText.toLowerCase()}`}>
                        {difficultyText}
                      </span>
                      <span className="xp-badge">
                        <FaStar /> {exercise.baseXp} XP
                      </span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{exercise.title}</h3>
                      <p className="card-language">
                        <FaCode /> {exercise.languageId || 'Multi-linguagem'}
                      </p>
                    </div>
                    <div className="card-footer">
                      <button className="btn-start">Começar</button>
                      <button className="btn-details">Detalhes</button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="no-recommendations">
                <p>Nenhuma recomendação disponível no momento.</p>
                <button onClick={loadDashboardData} className="btn-refresh">
                  Recarregar
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      </div>
    </AuthenticatedLayout>
  )
}

