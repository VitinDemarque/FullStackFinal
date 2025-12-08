import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaInfoCircle, FaTrash, FaCheckCircle } from 'react-icons/fa';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: var(--color-surface);
  border-radius: 16px;
  padding: 0;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.3s ease;
  overflow: hidden;
  border: 1px solid var(--color-border);

  .dark & {
    background: var(--color-dark-surface);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  }
`;

const Header = styled.div<{ $type: string }>`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${props => {
    switch (props.$type) {
      case 'danger': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'success': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      default: return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    }
  }};
`;

const IconContainer = styled.div`
  font-size: 2rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const Body = styled.div`
  padding: 1.5rem;
`;

const Message = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;

  .dark & {
    color: var(--color-dark-text-secondary);
  }
`;

const Footer = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  background: var(--color-surface-hover);
  border-top: 1px solid var(--color-border);

  .dark & {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.$variant === 'danger' ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }
  ` : props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  ` : `
    background: var(--color-surface);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    
    &:hover:not(:disabled) {
      background: var(--color-surface-hover);
      border-color: var(--color-border-hover);
    }

    .dark & {
      background: var(--color-dark-surface);
      color: var(--color-dark-text-secondary);
    }
  `}
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaTrash />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'success':
        return <FaCheckCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header $type={type}>
          <IconContainer>{getIcon()}</IconContainer>
          <HeaderContent>
            <Title>{title}</Title>
          </HeaderContent>
        </Header>
        
        <Body>
          <Message>{message}</Message>
        </Body>
        
        <Footer>
          <Button onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            $variant={type === 'danger' ? 'danger' : 'primary'} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}

