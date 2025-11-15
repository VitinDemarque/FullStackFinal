import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  position: relative;
  min-height: 100vh;
  background: var(--color-background);

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

export const CreateButton = styled.button`
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: var(--shadow-sm);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    color: var(--color-blue-400);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .icon {
    font-size: 1.25rem;
  }
`;

export const BackgroundShape = styled.div`
  position: absolute;
  top: -50px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--color-blue-100) 0%, var(--color-blue-200) 100%);
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

export const ExercisesSection = styled.div`
  position: relative;
  margin-top: 2rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
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

export const FilterIconButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: var(--color-surface-hover);
  }
`;

export const FilterMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: var(--shadow-lg);
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 1000;
`;

export const FilterItem = styled.button<{ selected?: boolean }>`
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;

  ${({ selected }) => selected ? `
    background: var(--color-surface-hover);
    font-weight: 600;
  ` : ''}

  &:hover {
    background: var(--color-surface-hover);
  }
`;

export const ExerciseCard = styled.div`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
    z-index: 5;
  }

  &:focus-within {
    z-index: 5;
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
  background: var(--color-blue-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-blue-600);
  flex-shrink: 0;
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
`;

export const CardStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

export const StatsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const VoteCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

export const VoteIcon = styled.span`
  color: var(--color-green-500);
  font-size: 1rem;
`;

export const CommentsCount = styled.div`
  color: var(--color-text-secondary);
`;

export const EditButton = styled.button`
  background: ${({ theme }) => theme.colors.blue[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.blue[600]};
    transform: translateY(-1px);
  }
`;

export const YellowBackgroundShape = styled.div`
  position: absolute;
  bottom: -100px;
  left: -150px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, var(--color-yellow-200) 0%, var(--color-yellow-300) 100%);
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
  color: var(--color-text-secondary);
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
`;

export const EmptySubtext = styled.p`
  font-size: 0.95rem;
  color: var(--color-text-secondary);
`;
