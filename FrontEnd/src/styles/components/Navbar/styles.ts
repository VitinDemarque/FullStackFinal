import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

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

export const Nav = styled.nav`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

export const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.25rem 2rem;
  }
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 0.25rem;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoBracket = styled.span`
  color: ${({ theme }) => theme.colors.accentBlue};
  font-weight: 600;
`;

export const LogoText = styled.span`
  background: ${({ theme }) => theme.gradients.blue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const NavMenu = styled.div`
  display: none;
  align-items: center;
  gap: 2.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.laptop}) {
    gap: 3rem;
  }
`;

export const NavLink = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  position: relative;
  transition: color 0.2s ease;
  padding: 0.5rem 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.gradients.blue};
    transition: width 0.3s ease;
  }

  &:hover {
    color: var(--color-blue-400);

    &::after {
      width: 100%;
    }
  }
`;

export const NavActions = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.laptop}) {
    gap: 1.25rem;
  }
`;

export const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.625rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  background: transparent;
  border: 1px solid var(--color-border);

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    color: var(--color-blue-400);
  }
`;

export const SignupButton = styled(Link)`
  color: var(--color-blue-400);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.625rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface);
  border: 1px solid var(--color-blue-400);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: var(--color-surface);
    color: var(--color-blue-500);
    border-color: var(--color-blue-500);
  }

  &:focus-visible {
    outline: 3px solid var(--color-blue-400);
    outline-offset: 2px;
  }
`;

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-blue-400);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileMenu = styled.div`
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 1.5rem 2rem;
  animation: ${slideDown} 0.3s ease;
  transition: background 0.3s ease, border-color 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const MobileNavLink = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  display: block;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-blue-400);
  }
`;

export const MobileMenuActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  transition: border-color 0.3s ease;
`;

export const MobileLoginButton = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  background: transparent;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    color: var(--color-blue-400);
  }
`;

export const MobileSignupButton = styled(Link)`
  color: var(--color-blue-400);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-blue-400);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    box-shadow: var(--shadow-lg);
    background: var(--color-surface);
    color: var(--color-blue-500);
    border-color: var(--color-blue-500);
  }

  &:focus-visible {
    outline: 3px solid var(--color-blue-400);
    outline-offset: 2px;
  }
`;

