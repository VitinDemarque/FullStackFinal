import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Modal = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  background: ${({ theme, $isDark }) => ($isDark ? '#1e293b' : theme.colors.white)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  border: ${({ $isDark }) => ($isDark ? '1px solid #334155' : 'none')};
`;

export const Header = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme, $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
`;

export const Icon = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$type'
})<{ $type: 'danger' | 'warning' | 'info' }>`
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'danger': return theme.colors.red[100];
      case 'warning': return theme.colors.yellow[100];
      case 'info': return theme.colors.blue[100];
      default: return theme.colors.gray[100];
    }
  }};
`;

export const Title = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme, $isDark }) => ($isDark ? '#e2e8f0' : theme.colors.gray[900])};
  margin: 0;
`;

export const Content = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  padding: 1.5rem;
`;

export const Message = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  color: ${({ theme, $isDark }) => ($isDark ? '#cbd5e1' : theme.colors.gray[600])};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-line;
`;

export const Footer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background: ${({ theme, $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[50])};
  border-top: 1px solid ${({ theme, $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
`;

export const CancelButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isDark'
})<{ $isDark?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, $isDark }) => ($isDark ? '#475569' : theme.colors.gray[300])};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $isDark }) => ($isDark ? '#1e293b' : theme.colors.white)};
  color: ${({ theme, $isDark }) => ($isDark ? '#e2e8f0' : theme.colors.gray[700])};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme, $isDark }) => ($isDark ? '#334155' : theme.colors.gray[50])};
    border-color: ${({ theme, $isDark }) => ($isDark ? '#64748b' : theme.colors.gray[400])};
  }
`;

export const ConfirmButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$type'
})<{ $type: 'danger' | 'warning' | 'info' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'danger': return theme.colors.red[500];
      case 'warning': return theme.colors.yellow[500];
      case 'info': return theme.colors.blue[500];
      default: return theme.colors.blue[500];
    }
  }};
  
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme, $type }) => {
      switch ($type) {
        case 'danger': return theme.colors.red[600];
        case 'warning': return theme.colors.yellow[600];
        case 'info': return theme.colors.blue[600];
        default: return theme.colors.blue[600];
      }
    }};
    transform: translateY(-1px);
  }
`;
