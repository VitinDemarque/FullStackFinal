import { useAuth } from "@contexts/AuthContext";
import { FaCode, FaTrophy, FaDumbbell, FaFire, FaStar } from "react-icons/fa";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { exercisesService, statsService } from "@services/index";
import { useFetch } from "@hooks/useFetch";
import type { Exercise } from "../../types";
import type { DashboardStats as DashboardStatsType } from "@services/stats.service";
import "./DashboardPage.css";

interface DashboardData {
  stats: DashboardStatsType;
  recommendations: Exercise[];
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, loading, error, refetch } = useFetch<DashboardData>(
    async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const [stats, recommendations] = await Promise.all([
        statsService.getDashboardStats(user.id),
        exercisesService.getRecommendations(6),
      ]);

      return { stats, recommendations };
    },
    {
      immediate: true,
      dependencies: [user?.id],
    }
  );

  const stats = data?.stats || {
    languages: 0,
    challenges: 0,
    exercises: 0,
    weekProgress: 0,
  };
  const recommendations = data?.recommendations || [];
  const weekProgress = stats.weekProgress || 0;

  return (
    <AuthenticatedLayout>
      <div className="dashboard-page">
        <div className="dashboard-container">
          {error && (
            <div
              style={{
                padding: "1rem",
                margin: "1rem 0",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                color: "#c33",
              }}
            >
              <strong>Erro ao carregar dados:</strong> {error.message}
              <button
                onClick={refetch}
                style={{
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#c33",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          <section className="dashboard-hero">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="bracket">{"{"}</span>
                Hello World!
                <span className="bracket">{"}"}</span>
              </h1>
              <p className="hero-description">
                Bem-vindo de volta, <strong>{user?.name}</strong>! Continue sua
                jornada de aprendizado e conquiste novos desafios. Você está
                indo muito bem!
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
                  <p className="stat-value">{user?.xpTotal || 0} XP</p>
                  <p className="stat-label">Experiência</p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-title">
              <FaFire className="title-icon" />
              Em Andamento
            </h2>
            <div className="progress-grid">
              <div className="progress-card card-purple">
                <FaCode className="progress-icon" />
                <div className="progress-info">
                  <h3>{loading ? "..." : stats.languages}</h3>
                  <p>Linguagens</p>
                </div>
              </div>
              <div className="progress-card card-blue">
                <FaTrophy className="progress-icon" />
                <div className="progress-info">
                  <h3>{loading ? "..." : stats.challenges}</h3>
                  <p>Desafios</p>
                </div>
              </div>
              <div className="progress-card card-green">
                <FaDumbbell className="progress-icon" />
                <div className="progress-info">
                  <h3>{loading ? "..." : stats.exercises}</h3>
                  <p>Exercícios</p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-title">
              <FaCode className="title-icon" />
              Em Desenvolvimento
            </h2>
            <div className="development-banner">
              <div className="banner-content">
                <h3>🚀 Continue Aprendendo!</h3>
                <p>
                  Você está progredindo bem! Mantenha o ritmo e complete seus
                  desafios para desbloquear novas conquistas.
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${weekProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {weekProgress}% dos desafios completos esta semana
                </p>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2 className="section-title">
              <FaStar className="title-icon" />
              Recomendações
            </h2>
            <div className="recommendations-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="exercise-card skeleton"
                  >
                    <div className="skeleton-header"></div>
                    <div className="skeleton-body"></div>
                    <div className="skeleton-footer"></div>
                  </div>
                ))
              ) : recommendations.length > 0 ? (
                recommendations.map((exercise) => {
                  const difficultyMap: Record<number, string> = {
                    1: "Fácil",
                    2: "Médio",
                    3: "Difícil",
                    4: "Expert",
                  };
                  const difficultyText =
                    difficultyMap[exercise.difficulty] || "Médio";

                  return (
                    <div key={exercise.id} className="exercise-card">
                      <div className="card-header">
                        <span
                          className={`difficulty-badge ${difficultyText.toLowerCase()}`}
                        >
                          {difficultyText}
                        </span>
                        <span className="xp-badge">
                          <FaStar /> {exercise.baseXp} XP
                        </span>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{exercise.title}</h3>
                        <p className="card-language">
                          <FaCode /> {exercise.languageId || "Multi-linguagem"}
                        </p>
                      </div>
                      <div className="card-footer">
                        <button className="btn-start">Começar</button>
                        <button className="btn-details">Detalhes</button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-recommendations">
                  <p>Nenhuma recomendação disponível no momento.</p>
                  <button onClick={refetch} className="btn-refresh">
                    Recarregar
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
