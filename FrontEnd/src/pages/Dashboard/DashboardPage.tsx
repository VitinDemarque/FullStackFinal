import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Trophy, 
  Flame, 
  Star, 
  Plus, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  BookOpen,
  Target,
  Languages,
  BookMarked,
  GraduationCap
} from "lucide-react";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import ChallengeModal from "@components/ChallengeModal";
import RankingModal from "@components/RankingModal";
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
  const [rankingExercise, setRankingExercise] = useState<Exercise | null>(null);

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

  // Componente para animar números
  const AnimatedNumber: React.FC<{ value: number; decimals?: number }> = ({ value, decimals = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(value, increment * step);
        setDisplayValue(current);

        if (step >= steps) {
          clearInterval(timer);
          setDisplayValue(value);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [value]);

    return <>{displayValue.toFixed(decimals)}</>;
  };

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      y: -4,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleTestChallenge = async (code: string, input?: string) => {
    try {
      const compileResult = await judge0Service.executeCode(code, JAVA_LANGUAGE_ID, input);

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
      const timeSpentMs = timeSpent * 1000;
      
      // O backend valida os testes automaticamente ao criar a submissão
      const submission = await submissionsService.create({
        exerciseId: selectedExercise.id,
        code: code,
        timeSpentMs: timeSpentMs,
      });

      const finalScore = submission.finalScore ?? submission.testScore ?? submission.score ?? 0;
      const scoreMessage = `Score Final: ${finalScore.toFixed(1)}%`;
      
      const statusMessage = submission.status === "ACCEPTED" 
        ? "✅ Aceito! Parabéns!" 
        : "❌ Rejeitado. Revise seu código e tente novamente.";

      const testsMessage = submission.totalTests 
        ? `\nTestes passados: ${submission.passedTests || 0}/${submission.totalTests}`
        : '';

      alert(`${statusMessage}\n\n${scoreMessage}${testsMessage}`);

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
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || error?.error?.message 
        || 'Erro desconhecido';
      
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
      {rankingExercise && (
        <RankingModal
          exerciseId={rankingExercise.id}
          exerciseTitle={rankingExercise.title}
          onClose={() => setRankingExercise(null)}
        />
      )}
      <S.DashboardPage $isDark={isDark}>
        <S.DashboardContainer>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <S.ErrorAlert>
                  <strong>Erro ao carregar dados:</strong> {error.message}
                  <button onClick={refetch}>Tentar novamente</button>
                </S.ErrorAlert>
              </motion.div>
            )}
          </AnimatePresence>

          <S.HeroSection
            as={motion.section}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <S.HeroContent>
              <S.HeroTitle
                as={motion.h1}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <S.Bracket>{"{"}</S.Bracket>
                Hello World!
                <S.Bracket>{"}"}</S.Bracket>
              </S.HeroTitle>
              <S.HeroDescription
                as={motion.p}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Bem-vindo de volta, <strong>{user?.name}</strong>! Continue sua
                jornada de aprendizado e conquiste novos desafios. Você está
                indo muito bem!
              </S.HeroDescription>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <S.ActionButton onClick={() => navigate("/desafios")}>
                  <Plus size={20} />
                  Criar Desafio
                </S.ActionButton>
              </motion.div>
            </S.HeroContent>
            <S.HeroStats
              as={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <S.StatCard 
                $variant="trophy"
                as={motion.div}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Trophy size={32} />
                <div>
                  <S.StatValue>
                    Level <AnimatedNumber value={currentLevel} />
                  </S.StatValue>
                  <S.StatLabel>Seu Nível</S.StatLabel>
                </div>
              </S.StatCard>
              <S.StatCard 
                $variant="star"
                as={motion.div}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Star size={32} />
                <div>
                  <S.StatValue>
                    <AnimatedNumber value={currentXpTotal} /> XP
                  </S.StatValue>
                  <S.StatLabel>Experiência</S.StatLabel>
                </div>
              </S.StatCard>
            </S.HeroStats>
          </S.HeroSection>

          <S.Section
            as={motion.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <S.SectionTitle $isDark={isDark} as={motion.h2}>
              <Flame size={24} />
              Em Andamento
            </S.SectionTitle>
            <S.ProgressGrid
              as={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <S.ProgressCard 
                $variant="purple"
                as={motion.div}
                variants={cardVariants}
                whileHover="hover"
              >
                <Languages size={40} />
                <S.ProgressInfo>
                  <h3>
                    {loading ? (
                      "..."
                    ) : (
                      <AnimatedNumber value={stats.languages} />
                    )}
                  </h3>
                  <p>Linguagens</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard 
                $variant="blue"
                as={motion.div}
                variants={cardVariants}
                whileHover="hover"
              >
                <Target size={40} />
                <S.ProgressInfo>
                  <h3>
                    {loading ? (
                      "..."
                    ) : (
                      <AnimatedNumber value={stats.challenges} />
                    )}
                  </h3>
                  <p>Desafios Publicados</p>
                </S.ProgressInfo>
              </S.ProgressCard>
            </S.ProgressGrid>
          </S.Section>

          <S.Section
            as={motion.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <S.SectionTitle $isDark={isDark} as={motion.h2}>
              <Users size={24} />
              Comunidade
            </S.SectionTitle>
            <S.SectionDescription 
              $isDark={isDark}
              as={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Participe de grupos de estudo e fóruns de discussão
            </S.SectionDescription>
            <S.ProgressGrid
              as={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <S.ProgressCard 
                $variant="green" 
                onClick={() => navigate("/grupos")}
                style={{ cursor: 'pointer' }}
                as={motion.div}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <GraduationCap size={40} />
                <S.ProgressInfo>
                  <h3>Grupos</h3>
                  <p>Estude em grupo e compartilhe conhecimento</p>
                </S.ProgressInfo>
              </S.ProgressCard>
              <S.ProgressCard 
                $variant="purple" 
                onClick={() => navigate("/foruns")}
                style={{ cursor: 'pointer' }}
                as={motion.div}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <BookMarked size={40} />
                <S.ProgressInfo>
                  <h3>
                    {loading ? (
                      "..."
                    ) : (
                      <AnimatedNumber value={stats.forumsCreated} />
                    )}
                  </h3>
                  <p>Fóruns Criados</p>
                </S.ProgressInfo>
              </S.ProgressCard>
            </S.ProgressGrid>
          </S.Section>

          <S.Section
            as={motion.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <S.SectionTitle $isDark={isDark} as={motion.h2}>
              <Target size={24} />
              Desafios Publicados
            </S.SectionTitle>
            <S.SectionDescription 
              $isDark={isDark}
              as={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              Todos os desafios disponíveis na plataforma
            </S.SectionDescription>
            <S.RecommendationsGrid
              as={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`}>
                    <SkeletonHeader />
                    <SkeletonBody />
                    <SkeletonFooter />
                  </SkeletonCard>
                ))
              ) : publishedExercises.length > 0 ? (
                publishedExercises.map((exercise, index) => {
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
                    <S.ExerciseCard 
                      key={exercise.id} 
                      $isDark={isDark} 
                      $isCompleted={exercise.isCompleted}
                      as={motion.div}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <S.DifficultyBadge
                        difficulty={difficultyText.toLowerCase() as any}
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                      >
                        {difficultyText}
                      </S.DifficultyBadge>
                      {exercise.language && (
                        <S.LanguageBadge
                          $center
                          as={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        >
                          {exercise.language.name}
                        </S.LanguageBadge>
                      )}
                      {exercise.isCompleted && (
                        <S.CompletedBadge
                          as={motion.div}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        >
                          <CheckCircle2 size={16} />
                          Concluído
                        </S.CompletedBadge>
                      )}
                      <S.CardHeader $isDark={isDark}>
                        <S.XpBadge
                          as={motion.div}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        >
                          <Trophy size={16} /> {exercise.baseXp} XP
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
                        <S.FooterButtons>
                          {exercise.isCompleted ? (
                            <S.CompletedButton 
                              disabled
                              as={motion.button}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle2 size={16} />
                              Concluído
                            </S.CompletedButton>
                          ) : (
                            <S.StartButton
                              onClick={() => {
                                if (!exercise.isCompleted) {
                                  setSelectedExercise(exercise);
                                }
                              }}
                              as={motion.button}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Iniciar Desafio
                            </S.StartButton>
                          )}
                          <S.RankingButton
                            onClick={() => setRankingExercise(exercise)}
                            title="Ver Ranking"
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <TrendingUp size={16} />
                            Ranking
                          </S.RankingButton>
                        </S.FooterButtons>
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
