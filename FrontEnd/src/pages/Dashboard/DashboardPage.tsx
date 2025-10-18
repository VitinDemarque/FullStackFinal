import { useAuth } from "@contexts/AuthContext";
import { FaCode, FaTrophy, FaDumbbell, FaFire, FaStar } from "react-icons/fa";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { exercisesService, statsService } from "@services/index";
import { useFetch } from "@hooks/useFetch";
import type { Exercise } from "../../types";
import type { DashboardStats as DashboardStatsType } from "@services/stats.service";
import {
  SkeletonCard,
  SkeletonHeader,
  SkeletonBody,
  SkeletonFooter,
} from "@/styles/components/Skeleton";
import * as S from "@/styles/pages/Dashboard/styles";

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
      <S.DashboardPage>
        <S.DashboardContainer>
          {error && (
            <S.ErrorAlert>
              <strong>Erro ao carregar dados:</strong> {error.message}
              <button onClick={refetch}>Tentar novamente</button>
            </S.ErrorAlert>
          )}

          <S.HeroSection>
            <S.HeroContent>
              <S.HeroTitle>
                <S.Bracket>{"{"}</S.Bracket>
                Hello World!
                <S.Bracket>{"}"}</S.Bracket>
              </S.HeroTitle>
              <S.HeroDescription>
                Bem-vindo de volta, <strong>{user?.name}</strong>! Continue sua
                jornada de aprendizado e conquiste novos desafios. Você está
                indo muito bem!
              </S.HeroDescription>
              <S.ActionButton>
                <FaFire />
                Iniciar Desafio
              </S.ActionButton>
            </S.HeroContent>
            <S.HeroStats>
              <S.StatCard variant="trophy">
                <FaTrophy />
                <div>
                  <S.StatValue>Level {user?.level || 1}</S.StatValue>
                  <S.StatLabel>Seu Nível</S.StatLabel>
                </div>
              </S.StatCard>
              <S.StatCard variant="star">
                <FaStar />
                <div>
                  <S.StatValue>{user?.xpTotal || 0} XP</S.StatValue>
                  <S.StatLabel>Experiência</S.StatLabel>
                </div>
              </S.StatCard>
            </S.HeroStats>
          </S.HeroSection>

          <S.Section>
            <S.SectionTitle>
              <FaFire />
              Em Andamento
            </S.SectionTitle>
            <S.ProgressGrid>
              <S.ProgressCard variant="purple">
                <FaCode />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.languages}</h3>
                  <p>Linguagens</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard variant="blue">
                <FaTrophy />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.challenges}</h3>
                  <p>Desafios</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard variant="green">
                <FaDumbbell />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.exercises}</h3>
                  <p>Exercícios</p>
                </S.ProgressInfo>
              </S.ProgressCard>
            </S.ProgressGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>
              <FaCode />
              Em Desenvolvimento
            </S.SectionTitle>
            <S.DevelopmentBanner>
              <S.BannerContent>
                <h3>🚀 Continue Aprendendo!</h3>
                <p>
                  Você está progredindo bem! Mantenha o ritmo e complete seus
                  desafios para desbloquear novas conquistas.
                </p>
                <S.ProgressBar>
                  <S.ProgressFill progress={weekProgress} />
                </S.ProgressBar>
                <S.ProgressText>
                  {weekProgress}% dos desafios completos esta semana
                </S.ProgressText>
              </S.BannerContent>
            </S.DevelopmentBanner>
          </S.Section>

          <S.Section>
            <S.SectionTitle>
              <FaStar />
              Recomendações
            </S.SectionTitle>
            <S.RecommendationsGrid>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`}>
                    <SkeletonHeader />
                    <SkeletonBody />
                    <SkeletonFooter />
                  </SkeletonCard>
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
                    <S.ExerciseCard key={exercise.id}>
                      <S.CardHeader>
                        <S.DifficultyBadge
                          difficulty={difficultyText.toLowerCase() as any}
                        >
                          {difficultyText}
                        </S.DifficultyBadge>
                        <S.XpBadge>
                          <FaStar /> {exercise.baseXp} XP
                        </S.XpBadge>
                      </S.CardHeader>
                      <S.CardBody>
                        <S.CardTitle>{exercise.title}</S.CardTitle>
                        <S.CardLanguage>
                          <FaCode /> {exercise.languageId || "Multi-linguagem"}
                        </S.CardLanguage>
                      </S.CardBody>
                      <S.CardFooter>
                        <S.StartButton>Começar</S.StartButton>
                        <S.DetailsButton>Detalhes</S.DetailsButton>
                      </S.CardFooter>
                    </S.ExerciseCard>
                  );
                })
              ) : (
                <S.NoRecommendations>
                  <p>Nenhuma recomendação disponível no momento.</p>
                  <S.RefreshButton onClick={refetch}>
                    Recarregar
                  </S.RefreshButton>
                </S.NoRecommendations>
              )}
            </S.RecommendationsGrid>
          </S.Section>
        </S.DashboardContainer>
      </S.DashboardPage>
    </AuthenticatedLayout>
  );
}
