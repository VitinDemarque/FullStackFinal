import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';
import ExerciseCard from '@components/ExerciseCard';
import * as S from '@/styles/pages/Challenges/styles';

export default function ChallengesPage() {
  // Dados mockados dos exercícios
  const exercises = [
    {
      id: '1',
      title: 'Faça exercícios sobre árvore de decisão',
      description: 'Aproveite e teste suas habilidades supere limites e aumente ainda mais o seu conhecimento.',
      icon: '🌳',
      votes: 95,
      comments: 123,
      lastModified: '2min'
    },
    {
      id: '2',
      title: 'Faça exercícios sobre Empilhamento de Pilhas',
      description: 'Aproveite e teste suas habilidades supere limites e aumenta ainda mais o seu conhecimento.',
      icon: '📚',
      votes: 6,
      comments: 12,
      lastModified: '2min'
    }
  ];

  const handleEditExercise = (exerciseId: string) => {
    console.log('Editando exercício:', exerciseId);
    // Implementar lógica de edição
  };

  const handleCreateExercise = () => {
    console.log('Criando novo exercício');
    // Implementar lógica de criação
  };

  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.HeroSection>
          <S.BackgroundShape />
          <S.Title>
            <span className="brackets">{'{'}</span>
            Meus Exercicios
            <span className="brackets">{'}'}</span>
          </S.Title>
          <S.Subtitle>
            Aqui é onde se encontram todos os exercícios feitos por você
          </S.Subtitle>
          <S.CreateButton onClick={handleCreateExercise}>
            <span className="icon">📄</span>
            Criar exercício
          </S.CreateButton>
        </S.HeroSection>

        <S.ExercisesSection>
          <S.YellowBackgroundShape />
          <S.SectionTitle>
            Meus exercícios ({exercises.length.toString().padStart(2, '0')})
          </S.SectionTitle>
          
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                title={exercise.title}
                description={exercise.description}
                icon={exercise.icon}
                votes={exercise.votes}
                comments={exercise.comments}
                lastModified={exercise.lastModified}
                onEdit={() => handleEditExercise(exercise.id)}
              />
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyIcon>📝</S.EmptyIcon>
              <S.EmptyText>Nenhum exercício encontrado</S.EmptyText>
              <S.EmptySubtext>
                Crie seu primeiro exercício para começar a praticar!
              </S.EmptySubtext>
            </S.EmptyState>
          )}
        </S.ExercisesSection>
      </S.Container>
    </AuthenticatedLayout>
  );
}

