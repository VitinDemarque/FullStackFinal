import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  position: relative;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

export const HeroSection = styled.div`
  position: relative;
  margin-bottom: 3rem;
  padding: 2rem 0;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Força alto contraste no modo escuro */
  .dark & {
    color: white;
  }

  .brackets {
    color: var(--color-yellow-400);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

export const BackgroundShape = styled.div`
  position: absolute;
  top: -50px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.purple} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  border-radius: 50%;
  opacity: 0.6;
  z-index: -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 200px;
    height: 200px;
    top: -30px;
    right: -50px;
  }
`;

export const ChallengesSection = styled.div`
  position: relative;
  margin-top: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

export const ChallengeCard = styled.div`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.gradients.purple};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const CardContent = styled.div`
  flex: 1;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const CardDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

export const AuthorInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

export const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const DifficultyBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'difficulty'
})<{ difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Expert' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  
  background: ${({ theme, difficulty }) => {
    if (difficulty === 'Fácil') return theme.colors.green[400] + '20';
    if (difficulty === 'Médio') return theme.colors.yellow[400] + '20';
    if (difficulty === 'Difícil') return '#fb923c20';
    return theme.colors.red[500] + '20';
  }};
  
  color: ${({ theme, difficulty }) => {
    if (difficulty === 'Fácil') return theme.colors.green[500];
    if (difficulty === 'Médio') return theme.colors.yellow[500];
    if (difficulty === 'Difícil') return '#fb923c';
    return theme.colors.red[600];
  }};
`;

export const XpBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-blue-100);
  color: var(--color-blue-600);
  font-size: 0.75rem;
  font-weight: 600;
`;

export const StartButton = styled.button`
  background: ${({ theme }) => theme.gradients.purple};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const PurpleBackgroundShape = styled.div`
  position: absolute;
  bottom: -100px;
  left: -150px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.4;
  z-index: -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 250px;
    height: 250px;
    bottom: -50px;
    left: -100px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

export const EmptySubtext = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

