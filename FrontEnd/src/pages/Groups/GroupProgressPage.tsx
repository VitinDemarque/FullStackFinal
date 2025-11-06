import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { groupService } from "../../services/group.service";
import { exercisesService } from "../../services/exercises.service";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  font-size: 2rem;
`;

const GroupInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatCardLarge = styled(StatCard)`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-light);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: ${props => props.color || 'var(--color-blue-500)'};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Section = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0 0 20px 0;
  font-size: 1.5rem;
`;

const ExercisesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExerciseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-surface-hover);
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ExerciseIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-blue-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ExerciseDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExerciseName = styled.div`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const ExerciseMeta = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const ExerciseStatus = styled.div<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: var(--color-green-100);
          color: var(--color-green-700);
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Spinner = styled.div`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 20px;
  border-radius: 8px;
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
      const groupData = await groupService.getById(id);
      setGroup(groupData);

      const exercisesResponse = await exercisesService.getAll({ limit: 100 });
      const groupExercises = exercisesResponse.items
        .filter(ex => ex.groupId === id)
        .map(exercise => ({
          ...exercise,
          languageId: exercise.languageId || null
        }));

      const mockProgress: ExerciseProgress[] = groupExercises.map(exercise => {
        const randomStatus = Math.random();
        let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        let xpEarned: number | undefined;

        if (randomStatus > 0.7) {
          status = 'completed';
          xpEarned = exercise.baseXp * (0.8 + Math.random() * 0.4);
        } else if (randomStatus > 0.3) {
          status = 'in-progress';
        }

        return {
          exercise,
          status,
          xpEarned,
          submittedAt: status !== 'not-started' ? new Date() : undefined
        };
      });

      setProgress(mockProgress);

      const completed = mockProgress.filter(p => p.status === 'completed').length;
      const inProgress = mockProgress.filter(p => p.status === 'in-progress').length;
      const totalXp = mockProgress
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.xpEarned || 0), 0);
      const averageDifficulty = groupExercises.length > 0 
        ? groupExercises.reduce((sum, ex) => sum + ex.difficulty, 0) / groupExercises.length
        : 0;
      const completionRate = groupExercises.length > 0 ? (completed / groupExercises.length) * 100 : 0;

      setStats({
        totalExercises: groupExercises.length,
        completedExercises: completed,
        inProgressExercises: inProgress,
        totalXp,
        averageDifficulty,
        completionRate,
        memberCount: groupData.members?.length || 0,
        rankInGroup: Math.floor(Math.random() * (groupData.members?.length || 1)) + 1
      });

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
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

  return (
    <AuthenticatedLayout>
      <Container>
        <BackButton to={`/grupos/${id}`}>← Voltar para o Grupo</BackButton>
        
        <Header>
          <Title>Meu Progresso no Grupo</Title>
          <GroupInfo>{group.name}</GroupInfo>
        </Header>

        <DashboardGrid>
          <StatCard>
            <StatValue>{stats.completedExercises}/{stats.totalExercises}</StatValue>
            <StatLabel>Exercícios Concluídos</StatLabel>
            <ProgressBar>
              <ProgressFill percentage={stats.completionRate} color="var(--color-green-500)" />
            </ProgressBar>
            <StatDescription>
              {stats.completionRate.toFixed(1)}% de conclusão
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{stats.totalXp.toFixed(0)}</StatValue>
            <StatLabel>XP Total Conquistado</StatLabel>
            <StatDescription>
              No grupo {group.name}
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>#{stats.rankInGroup}</StatValue>
            <StatLabel>Posição no Ranking</StatLabel>
            <StatDescription>
              Entre {stats.memberCount} membros
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatValue>{stats.averageDifficulty.toFixed(1)}/5</StatValue>
            <StatLabel>Dificuldade Média</StatLabel>
            <StatDescription>
              Dos exercícios do grupo
            </StatDescription>
          </StatCard>

          <StatCardLarge>
            <StatValue>📊 Resumo de Progresso</StatValue>
            <StatLabel>Atividade no {group.name}</StatLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-green-600)' }}>
                  {stats.completedExercises}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Concluídos</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-yellow-600)' }}>
                  {stats.inProgressExercises}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Em Andamento</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-blue-600)' }}>
                  {stats.totalExercises - stats.completedExercises - stats.inProgressExercises}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Para Fazer</div>
              </div>
            </div>
          </StatCardLarge>
        </DashboardGrid>

        <Section>
          <SectionTitle>Meu Progresso nos Exercícios</SectionTitle>
          <ExercisesList>
            {progress.map((item) => (
              <ExerciseItem key={item.exercise.id}>
                <ExerciseInfo>
                  <ExerciseIcon>💻</ExerciseIcon>
                  <ExerciseDetails>
                    <ExerciseName>{item.exercise.title}</ExerciseName>
                    <ExerciseMeta>
                      Dificuldade: {item.exercise.difficulty}/5 • 
                      XP: {item.exercise.baseXp}
                      {item.xpEarned && ` • Ganhou: ${item.xpEarned.toFixed(0)} XP`}
                    </ExerciseMeta>
                  </ExerciseDetails>
                </ExerciseInfo>
                <ExerciseStatus status={item.status}>
                  {item.status === 'completed' && '✅ Concluído'}
                  {item.status === 'in-progress' && '🔄 Em Andamento'}
                  {item.status === 'not-started' && '⏳ Não Iniciado'}
                </ExerciseStatus>
              </ExerciseItem>
            ))}
          </ExercisesList>
        </Section>

        <Section>
          <SectionTitle>Próximos Desafios Sugeridos</SectionTitle>
          <ExercisesList>
            {progress
              .filter(item => item.status === 'not-started')
              .slice(0, 3)
              .map((item) => (
                <ExerciseItem key={item.exercise.id}>
                  <ExerciseInfo>
                    <ExerciseIcon>🎯</ExerciseIcon>
                    <ExerciseDetails>
                      <ExerciseName>{item.exercise.title}</ExerciseName>
                      <ExerciseMeta>
                        Dificuldade: {item.exercise.difficulty}/5 • 
                        XP: {item.exercise.baseXp}
                      </ExerciseMeta>
                    </ExerciseDetails>
                  </ExerciseInfo>
                  <Link 
                    to={`/exercises/${item.exercise.id}`}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--color-blue-500)',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.875rem'
                    }}
                  >
                    Iniciar
                  </Link>
                </ExerciseItem>
              ))}
          </ExercisesList>
        </Section>
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupProgressPage;