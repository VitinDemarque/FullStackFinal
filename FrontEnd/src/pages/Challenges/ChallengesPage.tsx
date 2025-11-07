import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';
import ExerciseCard from '@components/ExerciseCard';
import CreateExerciseModal, { CreateExerciseData } from '@components/CreateExerciseModal';
import EditExerciseModal from '@components/EditExerciseModal';
import ConfirmationModal from '@components/ConfirmationModal';
import { exercisesService } from '@services/exercises.service';
import { useErrorHandler } from '@hooks/useErrorHandler';
import type { Exercise } from '@/types';
import * as S from '@/styles/pages/Challenges/styles';

export default function ChallengesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });
  const { setError } = useErrorHandler();

  // Carregar exercícios do usuário
  const loadUserExercises = async () => {
    try {
      setIsLoading(true);
      const response = await exercisesService.getMine({ 
        page: 1, 
        limit: 50
      });
      setExercises(response.items);
    } catch (error) {
      setError(error, 'Erro ao carregar Desafios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserExercises();
  }, []);

  const handleEditExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    setConfirmationModal({
      isOpen: true,
      title: 'Excluir Desafio',
      message: `Tem certeza que deseja excluir o Desafio "${exercise?.title}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await exercisesService.delete(exerciseId);
          setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
        } catch (error) {
          setError(error, 'Erro ao excluir Desafio');
        }
      },
      type: 'danger'
    });
  };

  const handleInactivateExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const newStatus = exercise.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    const action = newStatus === 'ARCHIVED' ? 'inativar' : 'ativar';

    setConfirmationModal({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Desafio`,
      message: `Tem certeza que deseja ${action} o Desafio "${exercise.title}"?`,
      onConfirm: async () => {
        try {
          const updatedExercise = await exercisesService.update(exerciseId, { status: newStatus });
          setExercises(prev => prev.map(ex => ex.id === exerciseId ? updatedExercise : ex));
        } catch (error) {
          setError(error, `Erro ao ${action} Desafio`);
        }
      },
      type: 'warning'
    });
  };

  const handleCreateExercise = () => {
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreateExercise = async (data: CreateExerciseData) => {
    try {
      const newExercise = await exercisesService.create(data);
      setExercises(prev => [newExercise, ...prev]);
      // Mostrar notificação de sucesso se necessário
    } catch (error) {
      setError(error, 'Erro ao criar Desafio');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleSubmitEditExercise = async (data: CreateExerciseData) => {
    if (!selectedExercise) return;

    try {
      const updatedExercise = await exercisesService.update(selectedExercise.id, data);
      setExercises(prev => prev.map(ex => ex.id === selectedExercise.id ? updatedExercise : ex));
    } catch (error) {
      setError(error, 'Erro ao editar Desafio');
      throw error; // Re-throw para o modal tratar
    }
  };

  const getExerciseIcon = (exercise: Exercise) => {
    // Mapear ícones baseado no título ou dificuldade
    const title = exercise.title.toLowerCase();
    if (title.includes('árvore') || title.includes('tree')) return '🌳';
    if (title.includes('pilha') || title.includes('stack')) return '📚';
    if (title.includes('lista') || title.includes('list')) return '📋';
    if (title.includes('grafo') || title.includes('graph')) return '🕸️';
    if (title.includes('algoritmo') || title.includes('algorithm')) return '⚙️';
    return '💻';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.HeroSection>
          <S.BackgroundShape />
          <S.Title>
            <span className="brackets">{'{'}</span>
            Meus Desafios
            <span className="brackets">{'}'}</span>
          </S.Title>
          <S.Subtitle>
            Aqui é onde se encontram todos os Desafios feitos por você
          </S.Subtitle>
          <S.CreateButton onClick={handleCreateExercise}>
            
            Criar Desafios
          </S.CreateButton>
        </S.HeroSection>

        <S.ExercisesSection>
          <S.YellowBackgroundShape />
          <S.SectionTitle>
            Meus Desafios ({exercises.length.toString().padStart(2, '0')})
          </S.SectionTitle>
          
          {isLoading ? (
            <S.EmptyState>
              <S.EmptyIcon>⏳</S.EmptyIcon>
              <S.EmptyText>Carregando Desafios...</S.EmptyText>
            </S.EmptyState>
          ) : exercises.length > 0 ? (
            exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                title={exercise.title}
                description={exercise.description || 'Sem descrição'}
                icon={getExerciseIcon(exercise)}
                votes={Math.floor(Math.random() * 100)} // Mock data - implementar sistema de votos
                comments={Math.floor(Math.random() * 50)} // Mock data - implementar sistema de comentários
                lastModified={formatTimeAgo(exercise.updatedAt)}
                status={exercise.status}
                onEdit={() => handleEditExercise(exercise.id)}
                onDelete={() => handleDeleteExercise(exercise.id)}
                onInactivate={() => handleInactivateExercise(exercise.id)}
              />
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyIcon>📝</S.EmptyIcon>
              <S.EmptyText>Nenhum Desafios encontrado</S.EmptyText>
              <S.EmptySubtext>
                Crie seu primeiro Desafio para começar a praticar!
              </S.EmptySubtext>
            </S.EmptyState>
          )}
        </S.ExercisesSection>

        <CreateExerciseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmitCreateExercise}
        />

        <EditExerciseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExercise(null);
          }}
          onSubmit={handleSubmitEditExercise}
          exercise={selectedExercise}
        />

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type={confirmationModal.type}
          confirmText={confirmationModal.type === 'danger' ? 'Excluir' : 'Confirmar'}
        />
      </S.Container>
    </AuthenticatedLayout>
  );
}

