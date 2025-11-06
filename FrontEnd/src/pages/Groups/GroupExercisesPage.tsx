import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { ThemedButton } from "../../styles/themed-components";
import { groupService } from "../../services/group.service";
import { exercisesService } from "../../services/exercises.service";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import ExerciseCard from "@components/ExerciseCard";
import CreateGroupExerciseModal from "../../components/Groups/CreateGroupExerciseModal";
import EditGroupExerciseModal, { UpdateGroupExerciseData } from "../../components/Groups/EditGroupExerciseModal";

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

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
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

  const [group, setGroup] = useState<Group | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    languageId: 'all'
  });

  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);

  const loadGroup = async () => {
    if (!id) return;

    try {
      const groupData = await groupService.getById(id);
      setGroup(groupData);
    } catch (error: any) {
      console.error('Erro ao carregar grupo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupExercises = async () => {
    if (!id) return;
  
    try {
      setExercisesLoading(true);
      console.log('🔍 [GroupExercisesPage] Loading exercises for group:', id);
      
      // SOLUÇÃO: Use o método listExercises que já existe no groupService
      const response = await groupService.listExercises(id, 0, 100);
      
      console.log('🔍 [GroupExercisesPage] Group exercises from API:', response.items);
      console.log('🔍 [GroupExercisesPage] Total group exercises:', response.items.length);
      
      const groupExercises = response.items.map((exercise: any) => ({
        ...exercise,
        languageId: exercise.languageId || null
      }));
      
      console.log('🔍 [GroupExercisesPage] Processed group exercises:', groupExercises);
      
      setExercises(groupExercises);
    } catch (error: any) {
      console.error('Erro ao carregar exercícios do grupo:', error);
      // Fallback: tenta buscar de outra forma se o endpoint não existir
      await loadGroupExercisesFallback();
    } finally {
      setExercisesLoading(false);
    }
  };
  
  // Fallback caso o endpoint específico não exista
  const loadGroupExercisesFallback = async () => {
    try {
      const response = await exercisesService.getAll({
        page: 1,
        limit: 100
      });
      
      // Filtro mais robusto com tipagem correta
      const groupExercises = response.items.filter((exercise: any) => {
        console.log(`🔍 Exercise ${exercise.id}: groupId=${exercise.groupId}, targetGroupId=${id}`);
        return exercise.groupId === id;
      });
      
      console.log('🔍 [Fallback] Filtered exercises:', groupExercises);
      setExercises(groupExercises);
    } catch (error) {
      console.error('Erro no fallback:', error);
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

  const filteredExercises = exercises.filter(exercise => {
    if (filters.difficulty !== 'all' && exercise.difficulty !== parseInt(filters.difficulty)) {
      return false;
    }
    if (filters.status !== 'all' && exercise.status !== filters.status) {
      return false;
    }
    if (filters.languageId !== 'all' && exercise.languageId !== filters.languageId) {
      return false;
    }
    return true;
  });

  const handleCreateExercise = async (exerciseData: any) => {
    if (!id || !user) return;

    try {
      setActionLoading(true);
      const exerciseWithGroup = {
        ...exerciseData,
        groupId: id
      };
      const created = await exercisesService.create(exerciseWithGroup);
      // Publica automaticamente para aparecer na lista do grupo
      await exercisesService.publish(created.id);
      alert('Desafio criado e publicado com sucesso!');
      setShowCreateExerciseModal(false);
      await loadGroupExercises();
    } catch (error: any) {
      alert(error.message || 'Erro ao criar Desafio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditExercise = (exerciseId: string) => {
    console.log('🔍 [DEBUG] handleEditExercise called with id:', exerciseId);
    console.log('🔍 [DEBUG] Current exercises:', exercises);
    
    const exerciseToEdit = exercises.find(ex => ex.id === exerciseId);
    console.log('🔍 [DEBUG] Found exercise:', exerciseToEdit);
    
    if (exerciseToEdit) {
      setEditingExercise(exerciseToEdit);
      setShowEditExerciseModal(true);
      console.log('🔍 [DEBUG] Modal states updated - editingExercise:', exerciseToEdit);
      console.log('🔍 [DEBUG] Modal states updated - showEditExerciseModal: true');
    } else {
      console.log('🔍 [DEBUG] Exercise not found in exercises array');
    }
  };

  const handleUpdateExercise = async (exerciseData: UpdateGroupExerciseData) => {
    if (!editingExercise) return;

    try {
      setActionLoading(true);
      
      await exercisesService.update(editingExercise.id, exerciseData);
      alert('Desafio atualizado com sucesso!');
      setShowEditExerciseModal(false);
      setEditingExercise(null);
      loadGroupExercises(); // Recarrega a lista
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar Desafio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este Desafio?')) return;

    try {
      await exercisesService.delete(exerciseId);
      alert('Exercício excluído com sucesso!');
      loadGroupExercises();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir Desafio');
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
        <BackButton to={`/grupos/${id}`}>← Voltar para o Grupo</BackButton>
        
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
            <ExercisesGrid>
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  id={exercise.id}
                  title={exercise.title}
                  description={exercise.description || ''}
                  icon="💻"
                  votes={0}
                  comments={0}
                  lastModified={new Date(exercise.updatedAt || exercise.createdAt).toLocaleDateString('pt-BR')}
                  status={exercise.status}
                  onEdit={() => handleEditExercise(exercise.id)}
                  onDelete={() => handleDeleteExercise(exercise.id)}
                  onInactivate={() => {}}
                />
              ))}
            </ExercisesGrid>
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

        <CreateGroupExerciseModal
          isOpen={showCreateExerciseModal}
          onClose={() => setShowCreateExerciseModal(false)}
          onSubmit={handleCreateExercise}
          groupId={id!}
          groupName={group.name}
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
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupExercisesPage;