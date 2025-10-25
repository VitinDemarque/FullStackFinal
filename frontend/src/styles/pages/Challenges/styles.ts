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
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .brackets {
    color: ${({ theme }) => theme.colors.yellow[400]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

export const CreateButton = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.blue[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.blue[600]};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.blue[50]};
    border-color: ${({ theme }) => theme.colors.blue[400]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.blue[100]} 0%, ${({ theme }) => theme.colors.blue[200]} 100%);
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

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

export const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  background: ${({ theme }) => theme.colors.blue[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.blue[600]};
  flex-shrink: 0;
`;

export const CardContent = styled.div`
  flex: 1;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const CardStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const StatsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.875rem;
`;

export const VoteCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: 500;
`;

export const VoteIcon = styled.span`
  color: ${({ theme }) => theme.colors.green[500]};
  font-size: 1rem;
`;

export const CommentsCount = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.yellow[200]} 0%, ${({ theme }) => theme.colors.yellow[300]} 100%);
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
