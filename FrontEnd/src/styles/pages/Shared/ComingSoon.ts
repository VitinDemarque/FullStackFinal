import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.75rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const Description = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.95rem;
  }
`;

export const Card = styled.div`
  background: var(--color-surface);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 3rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  margin-top: 2rem;
  text-align: center;
  max-width: 800px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

export const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 3rem;
  }
`;

export const ComingSoonText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

export const ComingSoonDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
`;

