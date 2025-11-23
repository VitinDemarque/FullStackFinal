import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { groupService } from "../../services/group.service";
import { leaderboardService } from "../../services/leaderboard.service";
import submissionsService from "../../services/submissions.service";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  ArrowLeft,
  Target,
  Award,
  Zap
} from "lucide-react";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateX(-4px);
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled(motion.h1)`
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const GroupInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)<{ $gradient?: string }>`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $gradient }) => $gradient || 'var(--gradient-primary)'};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
`;

const StatIcon = styled.div<{ $color?: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $color }) => $color || 'var(--gradient-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
`;

const StatValue = styled(motion.div)`
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-light);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: var(--color-gray-200);
  border-radius: 5px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled(motion.div)<{ $percentage: number; $color?: string }>`
  height: 100%;
  background: ${({ $color }) => $color || 'var(--gradient-green)'};
  border-radius: 5px;
`;

const SummaryCard = styled(motion.div)`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SummaryTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled(motion.div)`
  text-align: center;
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
`;

const SummaryValue = styled.div<{ $color?: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $color }) => $color || 'var(--color-primary)'};
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const Section = styled(motion.div)`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ExercisesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExerciseItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  background: var(--color-surface);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    transform: translateX(4px);
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ExerciseIcon = styled.div<{ $status: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $status }) => {
    if ($status === 'completed') return 'var(--gradient-green)';
    if ($status === 'in-progress') return 'var(--gradient-yellow)';
    return 'var(--color-gray-200)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ExerciseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const ExerciseName = styled.div`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
`;

const ExerciseMeta = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ExerciseStatus = styled.div<{ $status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $status }) => {
    switch ($status) {
      case 'completed':
        return `
          background: var(--color-success-bg);
          color: var(--color-success-text);
        `;
      case 'in-progress':
        return `
          background: var(--color-yellow-100);
          color: var(--color-yellow-700);
        `;
      case 'not-started':
        return `
          background: var(--color-gray-100);
          color: var(--color-gray-600);
        `;
      default:
        return '';
    }
  }}
`;

const StartButton = styled(Link)`
  padding: 0.625rem 1.25rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const Spinner = styled.div`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  border: 1px solid var(--color-red-400);
`;

interface GroupStats {
  totalExercises: number;
  completedExercises: number;
  inProgressExercises: number;
  totalXp: number;
  averageDifficulty: number;
  completionRate: number;
  rankInGroup?: number;
  memberCount: number;
}

interface ExerciseProgress {
  exercise: Exercise;
  status: 'completed' | 'in-progress' | 'not-started';
  submittedAt?: Date;
  xpEarned?: number;
}

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

const GroupProgressPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGroupData = async () => {
    if (!id || !user) return;

    try {
      // Buscar dados do grupo
      const groupData = await groupService.getById(id);
      setGroup(groupData);

      // Buscar exercícios do grupo
      const exercisesResponse = await groupService.listExercises(id, 1, 100);
      const groupExercises = exercisesResponse.items || [];

      // Buscar submissões do usuário
      const submissionsResponse = await submissionsService.getMySubmissions(1, 1000);
      const userSubmissions = submissionsResponse.items || [];

      // Buscar exercícios concluídos
      const completedExerciseIds = await submissionsService.getMyCompletedExercises();

      // Buscar ranking do grupo
      const groupRanking = await leaderboardService.getByGroup(id, { limit: 1000 });
      const userRank = groupRanking.findIndex(entry => entry.userId === user.id) + 1;

      // Calcular progresso de cada exercício
      const exerciseProgress: ExerciseProgress[] = groupExercises.map(exercise => {
        const submission = userSubmissions.find(
          s => s.exerciseId === exercise.id && s.status === 'ACCEPTED'
        );
        const isCompleted = completedExerciseIds.includes(exercise.id);
        const hasAttempts = userSubmissions.some(s => s.exerciseId === exercise.id);

        let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        let xpEarned: number | undefined;

        if (isCompleted && submission) {
          status = 'completed';
          xpEarned = submission.xpAwarded || exercise.baseXp || 0;
        } else if (hasAttempts) {
          status = 'in-progress';
        }

        return {
          exercise,
          status,
          xpEarned,
          submittedAt: submission ? new Date(submission.createdAt) : undefined
        };
      });

      setProgress(exerciseProgress);

      // Calcular estatísticas
      const completed = exerciseProgress.filter(p => p.status === 'completed').length;
      const inProgress = exerciseProgress.filter(p => p.status === 'in-progress').length;
      const totalXp = exerciseProgress
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.xpEarned || 0), 0);
      const averageDifficulty = groupExercises.length > 0 
        ? groupExercises.reduce((sum, ex) => sum + (ex.difficulty || 0), 0) / groupExercises.length
        : 0;
      const completionRate = groupExercises.length > 0 ? (completed / groupExercises.length) * 100 : 0;

      setStats({
        totalExercises: groupExercises.length,
        completedExercises: completed,
        inProgressExercises: inProgress,
        totalXp,
        averageDifficulty,
        completionRate,
        memberCount: groupRanking.length || groupData.members?.length || 0,
        rankInGroup: userRank || undefined
      });

    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar dados:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupData();
  }, [id, user]);

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingContainer>
          <Spinner>Carregando seu progresso...</Spinner>
        </LoadingContainer>
      </AuthenticatedLayout>
    );
  }

  if (!group || !stats) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            <h2>Erro ao carregar dados</h2>
            <p>Não foi possível carregar as informações do grupo.</p>
            <Link to="/grupos">Voltar para Grupos</Link>
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AuthenticatedLayout>
      <Container>
        <BackButton to={`/grupos/${id}`}>
          <ArrowLeft size={18} />
          Voltar para o Grupo
        </BackButton>
        
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meu Progresso no Grupo
          </Title>
          <GroupInfo>{group.name}</GroupInfo>
        </Header>

        <StatsGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            variants={cardVariants}
            $gradient="var(--gradient-green)"
          >
            <StatIcon $color="var(--gradient-green)">
              <CheckCircle2 size={24} />
            </StatIcon>
            <StatValue>
              <AnimatedNumber value={stats.completedExercises} />/{stats.totalExercises}
            </StatValue>
            <StatLabel>Exercícios Concluídos</StatLabel>
            <ProgressBar>
              <ProgressFill
                $percentage={stats.completionRate}
                $color="var(--gradient-green)"
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </ProgressBar>
            <StatDescription>
              {stats.completionRate.toFixed(1)}% de conclusão
            </StatDescription>
          </StatCard>

          <StatCard
            variants={cardVariants}
            $gradient="var(--gradient-yellow)"
          >
            <StatIcon $color="var(--gradient-yellow)">
              <Trophy size={24} />
            </StatIcon>
            <StatValue>
              <AnimatedNumber value={stats.totalXp} />
            </StatValue>
            <StatLabel>XP Total Conquistado</StatLabel>
            <StatDescription>
              No grupo {group.name}
            </StatDescription>
          </StatCard>

          <StatCard
            variants={cardVariants}
            $gradient="var(--gradient-primary)"
          >
            <StatIcon $color="var(--gradient-primary)">
              <Award size={24} />
            </StatIcon>
            <StatValue>
              #{stats.rankInGroup || '-'}
            </StatValue>
            <StatLabel>Posição no Ranking</StatLabel>
            <StatDescription>
              Entre {stats.memberCount} membros
            </StatDescription>
          </StatCard>

          <StatCard
            variants={cardVariants}
            $gradient="var(--gradient-blue)"
          >
            <StatIcon $color="var(--gradient-blue)">
              <TrendingUp size={24} />
            </StatIcon>
            <StatValue>
              <AnimatedNumber value={stats.averageDifficulty} decimals={1} />/5
            </StatValue>
            <StatLabel>Dificuldade Média</StatLabel>
            <StatDescription>
              Dos exercícios do grupo
            </StatDescription>
          </StatCard>
        </StatsGrid>

        <SummaryCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SummaryHeader>
            <BarChart3 size={24} color="var(--color-primary)" />
            <SummaryTitle>Resumo de Progresso</SummaryTitle>
          </SummaryHeader>
          <SummaryGrid>
            <SummaryItem
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <SummaryValue $color="var(--color-green-500)">
                <AnimatedNumber value={stats.completedExercises} />
              </SummaryValue>
              <SummaryLabel>Concluídos</SummaryLabel>
            </SummaryItem>
            <SummaryItem
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <SummaryValue $color="var(--color-yellow-500)">
                <AnimatedNumber value={stats.inProgressExercises} />
              </SummaryValue>
              <SummaryLabel>Em Andamento</SummaryLabel>
            </SummaryItem>
            <SummaryItem
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <SummaryValue $color="var(--color-blue-500)">
                <AnimatedNumber value={stats.totalExercises - stats.completedExercises - stats.inProgressExercises} />
              </SummaryValue>
              <SummaryLabel>Para Fazer</SummaryLabel>
            </SummaryItem>
          </SummaryGrid>
        </SummaryCard>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SectionTitle>
            <Target size={24} />
            Meu Progresso nos Exercícios
          </SectionTitle>
          <ExercisesList>
            {progress.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                Nenhum exercício encontrado neste grupo.
              </div>
            ) : (
              progress.map((item, index) => (
                <ExerciseItem
                  key={item.exercise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                >
                  <ExerciseInfo>
                    <ExerciseIcon $status={item.status}>
                      {item.status === 'completed' && <CheckCircle2 size={20} />}
                      {item.status === 'in-progress' && <Clock size={20} />}
                      {item.status === 'not-started' && <Zap size={20} />}
                    </ExerciseIcon>
                    <ExerciseDetails>
                      <ExerciseName>{item.exercise.title}</ExerciseName>
                      <ExerciseMeta>
                        <span>Dificuldade: {item.exercise.difficulty || 0}/5</span>
                        <span>•</span>
                        <span>XP: {item.exercise.baseXp || 0}</span>
                        {item.xpEarned && (
                          <>
                            <span>•</span>
                            <span style={{ color: 'var(--color-green-500)', fontWeight: 600 }}>
                              Ganhou: {item.xpEarned.toFixed(0)} XP
                            </span>
                          </>
                        )}
                      </ExerciseMeta>
                    </ExerciseDetails>
                  </ExerciseInfo>
                  <ExerciseStatus $status={item.status}>
                    {item.status === 'completed' && (
                      <>
                        <CheckCircle2 size={14} />
                        Concluído
                      </>
                    )}
                    {item.status === 'in-progress' && (
                      <>
                        <Clock size={14} />
                        Em Andamento
                      </>
                    )}
                    {item.status === 'not-started' && (
                      <>
                        <Zap size={14} />
                        Não Iniciado
                      </>
                    )}
                  </ExerciseStatus>
                </ExerciseItem>
              ))
            )}
          </ExercisesList>
        </Section>

        {progress.filter(item => item.status === 'not-started').length > 0 && (
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <SectionTitle>
              <Target size={24} />
              Próximos Desafios Sugeridos
            </SectionTitle>
            <ExercisesList>
              {progress
                .filter(item => item.status === 'not-started')
                .slice(0, 3)
                .map((item, index) => (
                  <ExerciseItem
                    key={item.exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                  >
                    <ExerciseInfo>
                      <ExerciseIcon $status="not-started">
                        <Target size={20} />
                      </ExerciseIcon>
                      <ExerciseDetails>
                        <ExerciseName>{item.exercise.title}</ExerciseName>
                        <ExerciseMeta>
                          Dificuldade: {item.exercise.difficulty || 0}/5 • XP: {item.exercise.baseXp || 0}
                        </ExerciseMeta>
                      </ExerciseDetails>
                    </ExerciseInfo>
                    <StartButton to={`/dashboard?exercise=${item.exercise.id}`}>
                      Iniciar
                    </StartButton>
                  </ExerciseItem>
                ))}
            </ExercisesList>
          </Section>
        )}
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupProgressPage;
