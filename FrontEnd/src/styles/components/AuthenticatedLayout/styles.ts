import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

