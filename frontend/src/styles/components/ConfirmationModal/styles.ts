import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const Icon = styled.div<{ type: 'danger' | 'warning' | 'info' }>`
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme, type }) => {
    switch (type) {
      case 'danger': return theme.colors.red[100];
      case 'warning': return theme.colors.yellow[100];
      case 'info': return theme.colors.blue[100];
      default: return theme.colors.gray[100];
    }
  }};
`;

export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

export const Content = styled.div`
  padding: 1.5rem;
`;

export const Message = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

export const Footer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const ConfirmButton = styled.button<{ type: 'danger' | 'warning' | 'info' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  
  background: ${({ theme, type }) => {
    switch (type) {
      case 'danger': return theme.colors.red[500];
      case 'warning': return theme.colors.yellow[500];
      case 'info': return theme.colors.blue[500];
      default: return theme.colors.blue[500];
    }
  }};
  
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme, type }) => {
      switch (type) {
        case 'danger': return theme.colors.red[600];
        case 'warning': return theme.colors.yellow[600];
        case 'info': return theme.colors.blue[600];
        default: return theme.colors.blue[600];
      }
    }};
    transform: translateY(-1px);
  }
`;
