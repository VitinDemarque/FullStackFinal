import styled from 'styled-components'
import { theme } from '../../theme'
import { Link } from 'react-router-dom'

// ============================================
// SIDEBAR CONTAINER
// ============================================

export const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;

  @media (max-width: ${theme.breakpoints.tablet}) {
    transform: translateX(-100%);
  }
`

// ============================================
// HEADER
// ============================================

export const SidebarHeader = styled.div`
  margin-bottom: 2rem;
`

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  text-decoration: none;
  color: white;
  transition: ${theme.transitions.all};

  &:hover {
    transform: scale(1.05);
  }
`

export const LogoBracket = styled.span`
  color: ${theme.colors.blue[400]};
`

export const LogoText = styled.span`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

// ============================================
// USER INFO
// ============================================

export const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: ${theme.transitions.all};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateX(2px);
  }

  &:active {
    transform: scale(0.98);
  }
`

export const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
`;

export const UserAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`

export const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`

export const UserName = styled.p`
  color: white;
  font-weight: ${theme.fontWeights.semibold};
  font-size: 0.9375rem;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserLevel = styled.p`
  color: #94a3b8;
  font-size: 0.8125rem;
  margin: 0;

  .dark & {
    color: white;
  }
`

// ============================================
// NAVIGATION
// ============================================

export const Navigation = styled.nav`
  flex: 1;
  overflow-y: auto;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 0.5rem;
  }
`

interface NavItemProps {
  $isActive?: boolean
}

export const NavItem = styled(Link) <NavItemProps>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: ${(props) => (props.$isActive ? 'var(--color-text-primary)' : 'var(--color-text-light)')};
  text-decoration: none;
  border-radius: 10px;
  transition: ${theme.transitions.base};
  font-weight: ${theme.fontWeights.medium};
  font-size: 0.9375rem;
  background: ${(props) => (props.$isActive ? 'var(--color-surface)' : 'transparent')};
  border: ${(props) => (props.$isActive ? '1px solid var(--color-blue-400)' : '1px solid transparent')};
  box-shadow: ${(props) => (props.$isActive ? 'var(--shadow-sm)' : 'none')};

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
    border-color: var(--color-blue-400);
    transform: translateX(4px);
  }

  /* Dark mode: força texto branco para máxima legibilidade */
  .dark & {
    color: white;
  }

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
    color: ${(props) => (props.$isActive ? 'var(--color-text-primary)' : 'var(--color-text-light)')};

    .dark & {
      color: white;
    }
  }

  span {
    flex: 1;
  }
`

// ============================================
// LOGOUT BUTTON
// ============================================

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: ${theme.colors.red[500]};
  font-weight: ${theme.fontWeights.medium};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: ${theme.transitions.base};
  margin-top: 1rem;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
  }
`

