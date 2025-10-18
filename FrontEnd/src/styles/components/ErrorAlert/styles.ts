import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ErrorAlertContainer = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.1);
  animation: ${slideDown} 0.3s ease-out;
`;

export const ErrorAlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const ErrorAlertIcon = styled.div`
  color: ${({ theme }) => theme.colors.red600};
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const ErrorAlertText = styled.div`
  flex: 1;
`;

export const ErrorAlertTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.red700};
  margin: 0 0 0.25rem 0;
`;

export const ErrorAlertMessage = styled.p`
  font-size: 0.875rem;
  color: #7f1d1d;
  margin: 0;
  line-height: 1.5;
`;

export const ErrorAlertCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.red600};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.red700};
    transform: scale(1.1);
  }
`;

export const ErrorAlertRetryButton = styled.button`
  margin-top: 0.75rem;
  background: ${({ theme }) => theme.colors.red600};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.red700};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
  }
`;

export const WarningAlertContainer = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid ${({ theme }) => theme.colors.accentOrange};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(245, 158, 11, 0.1);
  animation: ${slideDown} 0.3s ease-out;
`;

export const WarningAlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const WarningAlertIcon = styled.div`
  color: #d97706;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const WarningAlertText = styled.div`
  flex: 1;
`;

export const WarningAlertTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 0.25rem 0;
`;

export const WarningAlertMessage = styled.p`
  font-size: 0.875rem;
  color: #78350f;
  margin: 0;
  line-height: 1.5;
`;

export const WarningAlertCloseButton = styled.button`
  background: none;
  border: none;
  color: #d97706;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #92400e;
    transform: scale(1.1);
  }
`;

