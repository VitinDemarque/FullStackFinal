import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { FaTrophy, FaCheckCircle } from "react-icons/fa";

import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { ThemedButton } from "../../styles/themed-components";
import { groupService } from "../../services/group.service";
import { exercisesService } from "../../services/exercises.service";
import { leaderboardService, type LeaderboardEntry } from "../../services/leaderboard.service";
import { judge0Service, submissionsService } from "@services/index";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import ChallengeModal from "@components/ChallengeModal";
import CreateExerciseModal, { CreateExerciseData } from "@/components/CreateExerciseModal";
import EditGroupExerciseModal, { UpdateGroupExerciseData } from "../../components/Groups/EditGroupExerciseModal";
import ExerciseActionsMenu from "@components/ExerciseActionsMenu";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";
import * as S from "@/styles/pages/Dashboard/styles";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleSection = styled.div`
  flex: 1;
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
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
`;

const Title = styled.h1`
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  font-size: 2rem;
`;

const GroupInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CreateExerciseButton = styled.button`
  background: var(--color-blue-500);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const FiltersSection = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid var(--color-border);
`;

const FiltersTitle = styled.h3`
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
  font-size: 1.125rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
  }
`;

const ClearFiltersButton = styled(ThemedButton)`
  padding: 10px 16px;
  font-size: 0.875rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-secondary);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 12px 0;
  color: var(--color-text-primary);
  font-size: 1.5rem;
`;

const EmptyStateText = styled.p`
  margin: 0 0 32px 0;
  font-size: 1.125rem;
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--color-red-400);
  margin-bottom: 20px;
`;

const ResultsCount = styled.div`
  margin-bottom: 16px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const GroupExercisesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [group, setGroup] = useState<Group | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  // Ranking oculto por desafio: mantemos em memória, sem exibir na UI
  const [exerciseRankings, setExerciseRankings] = useState<Record<string, LeaderboardEntry[]>>({});
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    languageId: 'all'
  });

  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const JAVA_LANGUAGE_ID = 62;

  useEffect(() => {
    if (!showCreateExerciseModal) return;

    const checkbox = document.getElementById('isPublic') as HTMLInputElement | null;
    if (!checkbox) return;

    const checkboxGroup = checkbox.parentElement?.parentElement as HTMLElement | null;
    if (!checkboxGroup) return;

    const previousDisplay = checkboxGroup.style.display;
    checkboxGroup.style.display = 'none';

    return () => {
      checkboxGroup.style.display = previousDisplay;
    };
  }, [showCreateExerciseModal]);

  const loadGroup = async () => {
    if (!id) return;

    try {
      const groupData = await groupService.getById(id);
      setGroup(groupData);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar grupo:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadGroupExercises = async () => {
    if (!id) return;
  
    try {
      setExercisesLoading(true);
      
      const response = await groupService.listExercises(id, 1, 100);
      
      const groupExercises = response.items.map((exercise: any) => ({
        ...exercise,
        languageId: exercise.languageId || null
      }));
      
      setExercises(groupExercises);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar exercícios do grupo:', error);
      }
      await loadGroupExercisesFallback();
    } finally {
      setExercisesLoading(false);
    }
  };
  
  const loadGroupExercisesFallback = async () => {
    try {
      const response = await exercisesService.getAll({
        page: 1,
        limit: 100
      });
      
      const groupExercises = response.items.filter((exercise: any) => {
        return exercise.groupId === id;
      });
      
      setExercises(groupExercises);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro no fallback:', error);
      }
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  useEffect(() => {
    if (group) {
      loadGroupExercises();
    }
  }, [group]);

  useEffect(() => {
    if (user) {
      submissionsService.getMyCompletedExercises()
        .then(setCompletedExerciseIds)
        .catch(() => setCompletedExerciseIds([]));
    }
  }, [user]);

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
      showError('Desafio já concluído', 'Este desafio já foi concluído. Não é possível refazê-lo.');
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

      if (submission.status === "ACCEPTED") {
        showSuccess(
          'Desafio concluído!', 
          `Parabéns! Você ganhou ${submission.xpAwarded || 0} XP!\n${scoreMessage}${testsMessage}`
        );
        setSelectedExercise(null);
        await loadGroupExercises();
        // Recarregar desafios concluídos
        if (user) {
          submissionsService.getMyCompletedExercises()
            .then(setCompletedExerciseIds)
            .catch(() => {});
        }
      } else {
        showError('Desafio não passou', `${statusMessage}\n${scoreMessage}${testsMessage}`);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || 'Erro ao submeter desafio';
      showError('Erro ao submeter desafio', errorMessage);
    }
  };

  // Pré-carrega ranking oculto por exercício sem alterar a UI
  useEffect(() => {
    const idsToLoad = exercises
      .map((e) => e.id)
      .filter((id) => id && !exerciseRankings[id]);

    if (idsToLoad.length > 0) {
      preloadExerciseRankings(idsToLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises]);

  const preloadExerciseRankings = async (exerciseIds: string[]) => {
    try {
      const results = await Promise.allSettled(
        exerciseIds.map((id) =>
          leaderboardService
            .getByExercise(id, { limit: 5, page: 1 })
            .then((entries) => ({ id, entries }))
        )
      );

      const map: Record<string, LeaderboardEntry[]> = {};
      results.forEach((res, idx) => {
        const id = exerciseIds[idx];
        if (res.status === "fulfilled") {
          map[id] = res.value.entries || res.value;
        }
      });

      if (Object.keys(map).length > 0) {
        setExerciseRankings((prev) => ({ ...prev, ...map }));
      }
    } catch (error) {
      // Silenciar erros: ranking é oculto e não deve impactar a UI
      if (import.meta.env.DEV) {
        console.error("Falha ao pré-carregar ranking por exercício", error);
      }
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    if (filters.difficulty !== 'all' && exercise.difficulty !== parseInt(filters.difficulty)) {
      return false;
    }
    if (filters.status !== 'all' && exercise.status !== filters.status) {
      return false;
    }
    if (filters.languageId !== 'all' && exercise.language?.slug !== filters.languageId) {
      return false;
    }
    return true;
  });

  const handleCreateExercise = async (exerciseData: CreateExerciseData) => {
    if (!id || !user) return;

    try {
      setActionLoading(true);
      const exerciseWithGroup = {
        ...exerciseData,
        groupId: id,
        authorUserId: user.id,
        isPublic: false,
      } as any;
      const created = await exercisesService.create(exerciseWithGroup);
      // Publica automaticamente para aparecer na lista do grupo
      await exercisesService.publish(created.id);
      showSuccess('Desafio criado!', 'Desafio criado e publicado com sucesso!');
      setShowCreateExerciseModal(false);
      await loadGroupExercises();
    } catch (error: any) {
      showError('Erro ao criar Desafio', error.message || 'Não foi possível criar o desafio. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditExercise = (exerciseId: string) => {
    const exerciseToEdit = exercises.find(ex => ex.id === exerciseId);
    
    if (exerciseToEdit) {
      setEditingExercise(exerciseToEdit);
      setShowEditExerciseModal(true);
    }
  };

  const handleUpdateExercise = async (exerciseData: UpdateGroupExerciseData) => {
    if (!editingExercise) return;

    try {
      setActionLoading(true);
      
      await exercisesService.update(editingExercise.id, exerciseData);
      showSuccess('Desafio atualizado!', 'O desafio foi atualizado com sucesso.');
      setShowEditExerciseModal(false);
      setEditingExercise(null);
      loadGroupExercises(); // Recarrega a lista
    } catch (error: any) {
      showError('Erro ao atualizar Desafio', error.message || 'Não foi possível atualizar o desafio. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este Desafio?')) return;

    try {
      await exercisesService.delete(exerciseId);
      showSuccess('Desafio excluído!', 'O desafio foi excluído com sucesso.');
      loadGroupExercises();
    } catch (error: any) {
      showError('Erro ao excluir Desafio', error.message || 'Não foi possível excluir o desafio. Tente novamente.');
    }
  };

  const handleInactivateExercise = async (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const newStatus = exercise.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    const action = newStatus === 'ARCHIVED' ? 'inativar' : 'ativar';

    if (!confirm(`Tem certeza que deseja ${action} o Desafio "${exercise.title}"?`)) return;

    try {
      setActionLoading(true);
      await exercisesService.update(exerciseId, { status: newStatus });
      showSuccess(
        newStatus === 'ARCHIVED' ? 'Desafio inativado!' : 'Desafio ativado!',
        `O desafio foi ${newStatus === 'ARCHIVED' ? 'inativado' : 'ativado'} com sucesso.`
      );
      await loadGroupExercises();
    } catch (error: any) {
      showError(
        `Erro ao ${action} Desafio`,
        error.message || `Não foi possível ${action} o desafio. Tente novamente.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: 'all',
      status: 'all',
      languageId: 'all'
    });
  };

  const getUserRole = (): 'MEMBER' | 'MODERATOR' | 'OWNER' => {
    if (!group || !user) return 'MEMBER';
    
    const member = group.members?.find(m => m.userId === user.id);
    return member?.role || 'MEMBER';
  };

  const isUserMember = group?.members?.some(
    (member) => member.userId === user?.id
  );

  const canCreateExercises = isUserMember;

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingContainer>
          <Spinner>Carregando grupo...</Spinner>
        </LoadingContainer>
      </AuthenticatedLayout>
    );
  }

  if (!group) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            <h2>Grupo não encontrado</h2>
            <p>O grupo que você está procurando não existe ou foi removido.</p>
            <Link to="/grupos">Voltar para Grupos</Link>
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  if (!isUserMember) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            <h2>Acesso Restrito</h2>
            <p>Você precisa ser membro deste grupo para ver os Desafio.</p>
            <Link to={`/grupos/${id}`}>Voltar para o Grupo</Link>
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Container>
        {notifications.map((notification, index) => (
          <GroupNotification
            key={notification.id}
            variant={notification.variant}
            title={notification.title}
            message={notification.message}
            duration={3000}
            offsetY={20 + index * 84}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        <BackButton to={`/grupos/${id}`}>
          ← Voltar para o Grupo
        </BackButton>
        
        <Header>
          <TitleSection>
            <Title>Desafios do Grupo</Title>
            <GroupInfo>{group.name}</GroupInfo>
            <Description>
              {group.description || "Exercícios criados pelos membros deste grupo"}
            </Description>
          </TitleSection>

          <ActionsSection>
            {canCreateExercises && (
              <CreateExerciseButton 
                onClick={() => setShowCreateExerciseModal(true)}
                disabled={actionLoading}
              >
                ➕ Criar Desafio
              </CreateExerciseButton>
            )}
          </ActionsSection>
        </Header>

        <FiltersSection>
          <FiltersTitle>Filtrar Desafio</FiltersTitle>
          <FiltersGrid>
            <FilterGroup>
              <FilterLabel htmlFor="difficulty">Dificuldade</FilterLabel>
              <FilterSelect
                id="difficulty"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="all">Todas as dificuldades</option>
                <option value="1">Fácil (1)</option>
                <option value="2">Médio (2)</option>
                <option value="3">Intermediário (3)</option>
                <option value="4">Difícil (4)</option>
                <option value="5">Expert (5)</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="status">Status</FilterLabel>
              <FilterSelect
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel htmlFor="language">Linguagem</FilterLabel>
              <FilterSelect
                id="language"
                value={filters.languageId}
                onChange={(e) => handleFilterChange('languageId', e.target.value)}
              >
                <option value="all">Todas as linguagens</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>&nbsp;</FilterLabel>
              <ClearFiltersButton variant="secondary" onClick={clearFilters}>
                Limpar Filtros
              </ClearFiltersButton>
            </FilterGroup>
          </FiltersGrid>
        </FiltersSection>

        {exercisesLoading ? (
          <LoadingContainer>
            <Spinner>Carregando Desafio...</Spinner>
          </LoadingContainer>
        ) : filteredExercises.length > 0 ? (
          <>
            <ResultsCount>
              Mostrando {filteredExercises.length} de {exercises.length} exercícios
            </ResultsCount>
            <S.RecommendationsGrid>
              {filteredExercises.map((exercise) => {
                const completedIdsSet = new Set(completedExerciseIds);
                const isCompleted = completedIdsSet.has(exercise.id) || exercise.isCompleted === true;
                
                const difficultyMap: Record<number, string> = {
                  1: "Fácil",
                  2: "Médio",
                  3: "Difícil",
                  4: "Expert",
                  5: "Master",
                };
                const difficultyText = difficultyMap[exercise.difficulty] || "Médio";

                // Verificação mais robusta do dono
                const exerciseAuthorId = exercise.authorUserId ? String(exercise.authorUserId) : null;
                const currentUserId = user?.id ? String(user.id) : null;
                const isOwner = exerciseAuthorId && currentUserId && exerciseAuthorId === currentUserId;
                
                return (
                  <S.ExerciseCard key={exercise.id} $isDark={isDark} $isCompleted={isCompleted}>
                    {exercise.language && (
                      <S.LanguageBadge style={isOwner ? { 
                        right: '4rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        position: 'absolute'
                      } : { 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        position: 'absolute'
                      }}>
                        {exercise.language.name}
                      </S.LanguageBadge>
                    )}
                    {isCompleted && (
                      <S.CompletedBadge>
                        <FaCheckCircle />
                        Concluído
                      </S.CompletedBadge>
                    )}
                    <S.CardHeader 
                      $isDark={isDark} 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        position: 'relative',
                        paddingTop: '1.25rem'
                      }}
                    >
                      <S.DifficultyBadge 
                        difficulty={difficultyText.toLowerCase() as any}
                        style={{ position: 'relative', top: 'auto', left: 'auto', margin: 0 }}
                      >
                        {difficultyText}
                      </S.DifficultyBadge>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginLeft: 'auto'
                      }}>
                        <S.XpBadge style={{ 
                          justifyContent: 'center',
                          alignItems: 'center',
                          display: 'flex',
                          margin: 0
                        }}>
                          <FaTrophy /> {exercise.baseXp || 0} XP
                        </S.XpBadge>
                        {isOwner && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              flexShrink: 0,
                              visibility: 'visible',
                              opacity: 1,
                              minWidth: '32px',
                              minHeight: '32px',
                              margin: 0,
                              zIndex: 10000
                            }}
                          >
                            <ExerciseActionsMenu
                              onEdit={() => handleEditExercise(exercise.id)}
                              onDelete={() => handleDeleteExercise(exercise.id)}
                              onInactivate={() => handleInactivateExercise(exercise.id)}
                              isActive={exercise.status === 'PUBLISHED'}
                            />
                          </div>
                        )}
                      </div>
                    </S.CardHeader>
                    <S.CardBody>
                      <S.CardTitle $isDark={isDark}>
                        {exercise.title}
                      </S.CardTitle>
                      <S.CardDescription $isDark={isDark}>
                        {exercise.description || "Resolva este desafio e ganhe experiência"}
                      </S.CardDescription>
                    </S.CardBody>
                    <S.CardFooter>
                      <S.FooterButtons>
                        {isCompleted ? (
                          <S.CompletedButton disabled>
                            <FaCheckCircle />
                            Concluído
                          </S.CompletedButton>
                        ) : exercise.status === 'PUBLISHED' ? (
                          <S.StartButton
                            onClick={() => {
                              setSelectedExercise({ ...exercise, isCompleted });
                            }}
                          >
                            Iniciar Desafio
                          </S.StartButton>
                        ) : (
                          <S.StartButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            Desafio Indisponível
                          </S.StartButton>
                        )}
                      </S.FooterButtons>
                    </S.CardFooter>
                  </S.ExerciseCard>
                );
              })}
            </S.RecommendationsGrid>
          </>
        ) : (
          <EmptyState>
            <EmptyStateTitle>
              {exercises.length === 0 
                ? "Nenhum Desafio no grupo"
                : "Nenhum Desafio encontrado"
              }
            </EmptyStateTitle>
            <EmptyStateText>
              {exercises.length === 0
                ? "Seja o primeiro a criar um Desafio para este grupo!"
                : "Tente ajustar os filtros para ver mais Desafios."
              }
            </EmptyStateText>
          </EmptyState>
        )}

        <CreateExerciseModal
          isOpen={showCreateExerciseModal}
          onClose={() => setShowCreateExerciseModal(false)}
          onSubmit={handleCreateExercise}
        />

        <EditGroupExerciseModal
          isOpen={showEditExerciseModal}
          onClose={() => {
            setShowEditExerciseModal(false);
            setEditingExercise(null);
          }}
          onSubmit={handleUpdateExercise}
          exercise={editingExercise}
          groupId={id!}
          groupName={group.name}
          userRole={getUserRole()}
        />

        {selectedExercise && (
          <ChallengeModal
            exercise={{
              id: selectedExercise.id,
              title: selectedExercise.title,
              description: selectedExercise.description ?? null,
              difficulty: selectedExercise.difficulty,
              baseXp: selectedExercise.baseXp,
              publicCode: (selectedExercise as any).publicCode,
              codeTemplate: (selectedExercise as any).codeTemplate,
              isCompleted: (selectedExercise as any).isCompleted,
            }}
            onClose={() => setSelectedExercise(null)}
            onTest={handleTestChallenge}
            onSubmit={handleSubmitChallenge}
          />
        )}
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupExercisesPage;