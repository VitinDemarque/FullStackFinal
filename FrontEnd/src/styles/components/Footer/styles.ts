import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FooterContainer = styled.footer`
  background: var(--color-surface);
  color: var(--color-text-secondary);
  padding: 3rem 2rem;
  border-top: 1px solid var(--color-border);
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  .dark & {
    background: #0f172a;
    border-top-color: #1e293b;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1.5rem;
  }
`;

export const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const LogoSection = styled.div`
  margin-bottom: 2rem;
`;

export const LogoTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

export const LogoBracket = styled.span`
  color: var(--color-blue-400);
  transition: color 0.3s ease;
`;

export const LogoDescription = styled.p`
  color: var(--color-text-light);
  max-width: 28rem;
  transition: color 0.3s ease;
`;

export const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1.5rem;
  }
`;

export const LinkColumn = styled.div``;

export const ColumnTitle = styled.h4`
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
`;

export const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

export const LinkItem = styled.li``;

export const FooterLink = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-blue-400);
  }
`;

export const EmailText = styled.span`
  color: var(--color-text-light);
  padding-top: 0.5rem;
  display: block;
  font-size: 0.875rem;
  transition: color 0.3s ease;
`;

export const Divider = styled.div`
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
  transition: border-color 0.3s ease;
`;

export const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

interface SocialLinkProps {
  $hoverColor?: string;
}

export const SocialLink = styled.a<SocialLinkProps>`
  color: var(--color-text-light);
  font-size: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ $hoverColor }) => $hoverColor || 'var(--color-blue-400)'};
  }
`;

export const Copyright = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
  transition: color 0.3s ease;
`;

