import styled, { css } from 'styled-components';

export const ExerciseCard = styled.div<{ $inactive?: boolean }>`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    z-index: 5;
  }

  &:focus-within {
    z-index: 5;
  }

  ${({ $inactive }) =>
    $inactive &&
    css`
      /* leve dessaturação para indicar estado inativo */
      filter: saturate(0.85);
      opacity: 0.95;
    `}
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
  display: flex;
  align-items: center;
`;

export const CommentsCount = styled.div`
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
  position: relative;
  z-index: 2;
`;

export const IdBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
`;

export const CopyButton = styled.button`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: var(--color-surface-hover);
  }
`;

export const InactiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  background: rgba(2, 6, 23, 0.25); /* leve escurecimento */
  border-radius: inherit;
  pointer-events: none; /* não bloquear ações do card */
  z-index: 1;
`;

export const LastModified = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const InactiveLabel = styled.div`
  font-weight: 800;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
`;
