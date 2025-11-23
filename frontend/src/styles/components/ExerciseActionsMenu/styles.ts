import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: inline-block;
  z-index: 10000;
`;

export const MenuButton = styled.button`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
  transition: ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &:hover {
    background: var(--color-surface-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  z-index: 10000;
  margin-top: 0.25rem;
  overflow: hidden;
`;

export const MenuItem = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'danger'
})<{ danger?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ danger }) => danger ? 'var(--color-red-500)' : 'var(--color-text-primary)'};
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ danger }) => danger ? 'var(--color-red-50)' : 'var(--color-surface-hover)'};
    color: ${({ danger }) => danger ? 'var(--color-red-600)' : 'var(--color-text-primary)'};
  }

  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  }
`;

export const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: var(--color-border);
  margin: 0.25rem 0;
`;
