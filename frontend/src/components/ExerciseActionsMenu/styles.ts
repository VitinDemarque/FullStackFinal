import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 160px;
  z-index: 1000;
  margin-top: 0.25rem;
  overflow: hidden;
`;

export const MenuItem = styled.button<{ danger?: boolean }>`
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
  color: ${({ theme, danger }) => danger ? theme.colors.red[500] : theme.colors.gray[700]};
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme, danger }) => danger ? theme.colors.red[50] : theme.colors.gray[50]};
    color: ${({ theme, danger }) => danger ? theme.colors.red[600] : theme.colors.gray[900]};
  }

  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  }
`;

export const MenuIcon = styled.span`
  font-size: 1rem;
  width: 1rem;
  text-align: center;
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[200]};
  margin: 0.25rem 0;
`;
