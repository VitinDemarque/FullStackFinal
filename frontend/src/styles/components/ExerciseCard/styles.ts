import styled from 'styled-components';

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

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;
