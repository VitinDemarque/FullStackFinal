import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';
import { exercisesService } from '@services/exercises.service';
import { useErrorHandler } from '@hooks/useErrorHandler';
import { FaCode, FaFire, FaUsers } from 'react-icons/fa';
import type { Exercise } from '@/types';
import * as S from '@/styles/pages/InProgress/styles';

export default function InProgressPage() {
  const [challenges, setChallenges] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useErrorHandler();

  const loadCommunityChallenges = async () => {
    try {
      setIsLoading(true);
      const response = await exercisesService.getCommunityChallenges({
        page: 1,
        limit: 50,
      });
      setChallenges(response.items);
    } catch (error) {
      setError(error, 'Erro ao carregar desafios da comunidade');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityChallenges();
  }, []);

  const getChallengeIcon = (challenge: Exercise) => {
    const title = challenge.title.toLowerCase();
    if (title.includes('árvore') || title.includes('tree')) return '🌳';
    if (title.includes('pilha') || title.includes('stack')) return '📚';
    if (title.includes('lista') || title.includes('list')) return '📋';
    if (title.includes('grafo') || title.includes('graph')) return '🕸️';
    if (title.includes('algoritmo') || title.includes('algorithm')) return '⚙️';
    if (title.includes('array') || title.includes('vetor')) return '📊';
    if (title.includes('string') || title.includes('palavra')) return '📝';
    if (title.includes('número') || title.includes('number')) return '🔢';
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

  const getDifficultyLabel = (difficulty: number): 'Fácil' | 'Médio' | 'Difícil' | 'Expert' => {
    if (difficulty <= 1) return 'Fácil';
    if (difficulty <= 2) return 'Médio';
    if (difficulty <= 3) return 'Difícil';
    return 'Expert';
  };

  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.HeroSection>
          <S.BackgroundShape />
          <S.Title>
            <span className="brackets">{'{'}</span>
            Desafios da Comunidade
            <span className="brackets">{'}'}</span>
          </S.Title>
          <S.Subtitle>
            Explore desafios criados por outros programadores da comunidade e expanda seus conhecimentos!
          </S.Subtitle>
        </S.HeroSection>

        <S.ChallengesSection>
          <S.SectionTitle>
            <FaUsers style={{ marginRight: '0.5rem', color: '#667eea' }} />
            Desafios Publicados ({challenges.length})
          </S.SectionTitle>
          
          <S.PurpleBackgroundShape />
          
          {isLoading ? (
            <S.LoadingState>
              <S.LoadingIcon>⏳</S.LoadingIcon>
              <S.EmptyText>Carregando desafios...</S.EmptyText>
            </S.LoadingState>
          ) : challenges.length > 0 ? (
            challenges.map((challenge) => (
              <S.ChallengeCard key={challenge.id}>
                <S.CardHeader>
                  <S.CardIcon>
                    {getChallengeIcon(challenge)}
                  </S.CardIcon>
                  <S.CardContent>
                    <S.CardTitle>{challenge.title}</S.CardTitle>
                    <S.CardDescription>
                      {challenge.description || 'Sem descrição disponível'}
                    </S.CardDescription>
                    <S.AuthorInfo>
                      Criado por outro programador
                    </S.AuthorInfo>
                  </S.CardContent>
                </S.CardHeader>
                
                <S.CardFooter>
                  <S.Stats>
                    <S.DifficultyBadge difficulty={getDifficultyLabel(challenge.difficulty)}>
                      {getDifficultyLabel(challenge.difficulty)}
                    </S.DifficultyBadge>
                    <S.XpBadge>
                      <FaFire style={{ marginRight: '0.25rem' }} /> {challenge.baseXp} XP
                    </S.XpBadge>
                  </S.Stats>
                  <S.StartButton>
                    <FaCode style={{ marginRight: '0.5rem' }} />
                    Aceitar Desafio
                  </S.StartButton>
                </S.CardFooter>
              </S.ChallengeCard>
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyIcon>🌐</S.EmptyIcon>
              <S.EmptyText>Nenhum desafio disponível</S.EmptyText>
              <S.EmptySubtext>
                Ainda não há desafios públicos da comunidade. Seja o primeiro a criar um!
              </S.EmptySubtext>
            </S.EmptyState>
          )}
        </S.ChallengesSection>
      </S.Container>
    </AuthenticatedLayout>
  );
}

