import styled, { keyframes, css } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

interface NotificationContainerProps {
  type: 'success' | 'error';
}

export const NotificationContainer = styled.div<NotificationContainerProps>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-width: 90vw;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out;
  z-index: 9999;
  border-top: 3px solid ${({ type, theme }) => 
    type === 'success' ? theme.colors.accentGreen : theme.colors.danger};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
`;

export const NotificationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
`;

interface NotificationIconProps {
  type: 'success' | 'error';
}

export const NotificationIcon = styled.div<NotificationIconProps>`
  flex-shrink: 0;
  font-size: 28px;
  margin-top: 2px;
  color: ${({ type, theme }) => 
    type === 'success' ? theme.colors.accentGreen : theme.colors.danger};
`;

export const NotificationMessage = styled.div`
  flex: 1;
`;

export const NotificationTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const NotificationText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const NotificationCloseButton = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

interface NotificationProgressProps {
  type: 'success' | 'error';
}

export const NotificationProgress = styled.div<NotificationProgressProps>`
  height: 4px;
  width: 100%;
  animation: ${progress} 5s linear;
  background: ${({ type, theme }) => 
    type === 'success' ? theme.gradients.green : 'linear-gradient(90deg, #ef4444, #dc2626)'};
`;

