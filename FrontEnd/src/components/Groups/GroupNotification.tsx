import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'isVisible', 'offsetY'].includes(prop),
})<{ variant: 'success' | 'error' | 'info' | 'warning'; isVisible: boolean; offsetY?: number }>`
  position: fixed;
  top: ${props => (props.offsetY ?? 20)}px;
  right: 20px;
  z-index: 10000;
  min-width: 320px;
  max-width: 500px;
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
      case 'error':
        return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      default:
        return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    }
  }};
  border: 2px solid ${props => {
    switch (props.variant) {
      case 'success':
        return 'var(--color-green-500)';
      case 'error':
        return 'var(--color-red-500)';
      case 'warning':
        return 'var(--color-yellow-500)';
      default:
        return 'var(--color-blue-500)';
    }
  }};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 768px) {
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: 100%;
  }
`;

const IconContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'success' | 'error' | 'info' | 'warning' }>`
  flex-shrink: 0;
  font-size: 1.5rem;
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return 'var(--color-green-600)';
      case 'error':
        return 'var(--color-red-600)';
      case 'warning':
        return 'var(--color-yellow-600)';
      default:
        return 'var(--color-blue-600)';
    }
  }};
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'success' | 'error' | 'info' | 'warning' }>`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#065f46';
      case 'error':
        return '#991b1b';
      case 'warning':
        return '#92400e';
      default:
        return '#1e40af';
    }
  }};
`;

const Message = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'success' | 'error' | 'info' | 'warning' }>`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return '#047857';
      case 'error':
        return '#7f1d1d';
      case 'warning':
        return '#78350f';
      default:
        return '#1e3a8a';
    }
  }};
`;

const CloseButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant: 'success' | 'error' | 'info' | 'warning' }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return 'var(--color-green-600)';
      case 'error':
        return 'var(--color-red-600)';
      case 'warning':
        return 'var(--color-yellow-600)';
      default:
        return 'var(--color-blue-600)';
    }
  }};
  font-size: 1.125rem;
  transition: all 0.2s;
  flex-shrink: 0;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
  }
`;

export interface GroupNotificationProps {
  variant: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  offsetY?: number;
}

export default function GroupNotification({
  variant,
  title,
  message,
  duration = 3000,
  onClose,
  offsetY
}: GroupNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Aguarda a animação de saída
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <NotificationContainer variant={variant} isVisible={isVisible} offsetY={offsetY}>
      <IconContainer variant={variant}>
        {getIcon()}
      </IconContainer>
      <Content>
        <Title variant={variant}>{title}</Title>
        {message && <Message variant={variant}>{message}</Message>}
      </Content>
      <CloseButton variant={variant} onClick={handleClose} aria-label="Fechar notificação">
        <FaTimes />
      </CloseButton>
    </NotificationContainer>
  );
}

