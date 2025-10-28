import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.gray900};
  color: ${({ theme }) => theme.colors.gray300};
  padding: 3rem 2rem;

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
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.75rem;
  }
`;

export const LogoBracket = styled.span`
  color: ${({ theme }) => theme.colors.accentBlue};
`;

export const LogoDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  max-width: 28rem;
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
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 0.75rem;
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
  color: ${({ theme }) => theme.colors.gray300};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentBlue};
  }
`;

export const EmailText = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  padding-top: 0.5rem;
  display: block;
  font-size: 0.875rem;
`;

export const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding-top: 2rem;
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
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ $hoverColor, theme }) => $hoverColor || theme.colors.white};
  }
`;

export const Copyright = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray500};
`;

