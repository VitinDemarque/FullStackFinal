import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { FaCode, FaTrophy, FaFire, FaStar, FaPlus, FaUsers, FaComments, FaCheckCircle } from "react-icons/fa";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import ChallengeModal from "@components/ChallengeModal";
import {
  exercisesService,
  statsService,
  judge0Service,
  submissionsService,
  attemptsService,
} from "@services/index";
import { useFetch } from "@hooks/useFetch";
import type { Exercise } from "../../types";
import type { DashboardStats as DashboardStatsType } from "@services/stats.service";
import { deriveLevelFromXp } from "@utils/levels";
import {
  SkeletonCard,
  SkeletonHeader,
  SkeletonBody,
  SkeletonFooter,
} from "@/styles/components/Skeleton";
import * as S from "@/styles/pages/Dashboard/styles";

interface DashboardData {
  stats: DashboardStatsType;
  publishedExercises: Exercise[];
  completedExerciseIds: string[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const { data, loading, error, refetch } = useFetch<DashboardData>(
    async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const [stats, exercisesResponse, completedExerciseIds] = await Promise.all([
        statsService.getDashboardStats(user.id),
        exercisesService.getAll({
          page: 1,
          limit: 8,
          isPublic: true,
          status: "PUBLISHED",
        }),
        submissionsService.getMyCompletedExercises().catch(() => []),
      ]);

      return {
        stats,
        publishedExercises: exercisesResponse.items,
        completedExerciseIds,
      };
    },
    {
      immediate: true,
      dependencies: [user?.id],
    }
  );

  const stats = data?.stats || {
    languages: 0,
    challenges: 0,
    forumsCreated: 0,
    weekProgress: 0,
  };
  
  // Garantir que isCompleted seja definido corretamente usando completedExerciseIds
  const completedExerciseIds = data?.completedExerciseIds || [];
  const completedIdsSet = new Set(completedExerciseIds);
  
  const publishedExercises = (data?.publishedExercises || []).map(exercise => ({
    ...exercise,
    // Usar completedIdsSet como fonte primária, ou isCompleted do backend se ambos estiverem disponíveis
    isCompleted: completedIdsSet.has(exercise.id) || exercise.isCompleted === true
  }));

  // Cálculo consistente de nível a partir do XP total
  const currentXpTotal = (user as any)?.xpTotal ?? 0;
  const currentLevel = deriveLevelFromXp(currentXpTotal);

  const JAVA_LANGUAGE_ID = 62;

  const handleTestChallenge = async (code: string) => {
    try {
      const compileResult = await judge0Service.executeCode(code, JAVA_LANGUAGE_ID);

      if (!compileResult.sucesso) {
        throw new Error(compileResult.resultado || 'Erro na execução do código');
      }

      return compileResult.resultado;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.details?.resultado 
        || error?.response?.data?.error?.message 
        || error?.message 
        || 'Erro ao testar o código';
      throw new Error(errorMessage);
    }
  };

  const handleSubmitChallenge = async (code: string, timeSpent: number) => {
    if (!selectedExercise || !user) return;

    // Bloquear submissão se o desafio já foi concluído
    if (selectedExercise.isCompleted) {
      alert('Este desafio já foi concluído. Não é possível refazê-lo.');
      setSelectedExercise(null);
      return;
    }

    try {
      const compileResult = await judge0Service.executeCode(code, JAVA_LANGUAGE_ID);

      if (!compileResult.sucesso) {
        alert(`Erro na compilação:\n\n${compileResult.resultado}`);
        return;
      }

      const score = 100;
      const timeSpentMs = timeSpent * 1000;
      
      const submission = await submissionsService.create({
        exerciseId: selectedExercise.id,
        code: code,
        score: score,
        timeSpentMs: timeSpentMs,
      });

      alert(`Código compilado e submetido com sucesso!\n\nResultado:\n${compileResult.resultado}\n\nScore: ${score}%`);

      if (submission.status === "ACCEPTED") {
        await attemptsService.deleteAttempt(selectedExercise.id).catch(() => {});
        // Marcar o exercício como concluído no estado local
        setSelectedExercise({ ...selectedExercise, isCompleted: true });
      }
      
      setSelectedExercise(null);
      // Recarregar os exercícios para atualizar o status de conclusão
      refetch();
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Erro ao submeter desafio:', error);
      }
      
      // Se o erro for sobre desafio já concluído, fechar o modal e recarregar
      const errorMessage = error?.message || error?.error?.message || 'Erro desconhecido';
      if (errorMessage.includes('já foi concluído') || errorMessage.includes('não é possível refazê-lo')) {
        alert(errorMessage);
        setSelectedExercise(null);
        refetch(); // Recarregar para atualizar o status
        return;
      }
      
      alert(`Erro ao submeter desafio: ${errorMessage}`);
      throw error;
    }
  };

  return (
    <AuthenticatedLayout>
      {selectedExercise && (
        <ChallengeModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onSubmit={handleSubmitChallenge}
          onTest={handleTestChallenge}
        />
      )}
      <S.DashboardPage $isDark={isDark}>
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
              <S.ActionButton onClick={() => navigate("/desafios")}>
                <FaPlus />
                Criar Desafio
              </S.ActionButton>
            </S.HeroContent>
            <S.HeroStats>
              <S.StatCard $variant="trophy">
                <FaTrophy />
                <div>
                  <S.StatValue>Level {currentLevel}</S.StatValue>
                  <S.StatLabel>Seu Nível</S.StatLabel>
                </div>
              </S.StatCard>
              <S.StatCard $variant="star">
                <FaStar />
                <div>
                  <S.StatValue>{currentXpTotal} XP</S.StatValue>
                  <S.StatLabel>Experiência</S.StatLabel>
                </div>
              </S.StatCard>
            </S.HeroStats>
          </S.HeroSection>

          <S.Section>
            <S.SectionTitle $isDark={isDark}>
              <FaFire />
              Em Andamento
            </S.SectionTitle>
            <S.ProgressGrid>
              <S.ProgressCard $variant="purple">
                <FaCode />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.languages}</h3>
                  <p>Linguagens</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard $variant="blue">
                <FaTrophy />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.challenges}</h3>
                  <p>Desafios Publicados</p>
                </S.ProgressInfo>
              </S.ProgressCard>
            </S.ProgressGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle $isDark={isDark}>
              <FaUsers />
              Comunidade
            </S.SectionTitle>
            <S.SectionDescription $isDark={isDark}>
              Participe de grupos de estudo e fóruns de discussão
            </S.SectionDescription>
            <S.ProgressGrid>
              <S.ProgressCard 
                $variant="green" 
                onClick={() => navigate("/grupos")}
                style={{ cursor: 'pointer' }}
              >
                <FaUsers />
                <S.ProgressInfo>
                  <h3>Grupos</h3>
                  <p>Estude em grupo e compartilhe conhecimento</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard 
                $variant="purple" 
                onClick={() => navigate("/foruns")}
                style={{ cursor: 'pointer' }}
              >
                <FaComments />
                <S.ProgressInfo>
                  <h3>{loading ? "..." : stats.forumsCreated}</h3>
                  <p>Fóruns Criados</p>
                </S.ProgressInfo>
              </S.ProgressCard>
            </S.ProgressGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle $isDark={isDark}>
              <FaCode />
              Desafios Publicados
            </S.SectionTitle>
            <S.SectionDescription $isDark={isDark}>
              Todos os desafios disponíveis na plataforma
            </S.SectionDescription>
            <S.RecommendationsGrid>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`}>
                    <SkeletonHeader />
                    <SkeletonBody />
                    <SkeletonFooter />
                  </SkeletonCard>
                ))
              ) : publishedExercises.length > 0 ? (
                publishedExercises.map((exercise) => {
                  const difficultyMap: Record<number, string> = {
                    1: "Fácil",
                    2: "Médio",
                    3: "Difícil",
                    4: "Expert",
                    5: "Master",
                  };
                  const difficultyText =
                    difficultyMap[exercise.difficulty] || "Médio";

                  return (
                    <S.ExerciseCard key={exercise.id} $isDark={isDark} $isCompleted={exercise.isCompleted}>
                      <S.DifficultyBadge
                        difficulty={difficultyText.toLowerCase() as any}
                      >
                        {difficultyText}
                      </S.DifficultyBadge>
                      {exercise.language && (
                        <S.LanguageBadge>
                          {exercise.language.name}
                        </S.LanguageBadge>
                      )}
                      {exercise.isCompleted && (
                        <S.CompletedBadge>
                          <FaCheckCircle />
                          Concluído
                        </S.CompletedBadge>
                      )}
                      <S.CardHeader $isDark={isDark}>
                        <S.XpBadge>
                          <FaTrophy /> {exercise.baseXp} XP
                        </S.XpBadge>
                      </S.CardHeader>
                      <S.CardBody>
                        <S.CardTitle $isDark={isDark}>
                          {exercise.title}
                        </S.CardTitle>
                        <S.CardDescription $isDark={isDark}>
                          {exercise.description ||
                            "Resolva este desafio e ganhe experiência"}
                        </S.CardDescription>
                      </S.CardBody>
                      <S.CardFooter>
                        {exercise.isCompleted ? (
                          <S.CompletedButton disabled>
                            <FaCheckCircle />
                            Concluído
                          </S.CompletedButton>
                        ) : (
                          <S.StartButton
                            onClick={() => {
                              if (!exercise.isCompleted) {
                                setSelectedExercise(exercise);
                              }
                            }}
                          >
                            Iniciar Desafio
                          </S.StartButton>
                        )}
                      </S.CardFooter>
                    </S.ExerciseCard>
                  );
                })
              ) : (
                <S.NoRecommendations>
                  <p>Nenhum desafio disponível no momento.</p>
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
