import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: var(--color-background);
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &::before {
    content: '{';
    color: var(--color-yellow-400);
    margin-right: 0.25rem;
  }

  &::after {
    content: '}';
    color: var(--color-yellow-400);
    margin-left: 0.25rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
  }
`

export const NewForumButton = styled.button`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);

  svg {
    color: var(--color-text-primary);
  }

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ForumList = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: stretch;
`

export const ForumCard = styled.div`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  line-height: 1.4;
`

export const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const Badge = styled.span<{ variant?: 'public' | 'private' }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;

  ${props => {
    if (props.variant === 'private') {
      return `
        background: var(--color-warning-bg);
        color: var(--color-warning-text);
      `
    }
    return `
      background: var(--color-blue-100);
      color: var(--color-blue-600);
    `
  }}
`

export const CardDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-size: ${({ theme }) => theme.fontSizes.base};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: var(--color-text-light);
`

export const ForumMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: var(--color-text-light);
  margin-top: 1rem;
`

export const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  font-size: ${({ theme }) => theme.fontSizes.lg};
`

export const Error = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-red-400);
`

export const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0.5rem 0;
  }
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--color-surface);
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  input {
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    outline: none;
    flex: 1;
    font-size: ${({ theme }) => theme.fontSizes.base};

    &::placeholder {
      color: var(--color-text-light);
    }
  }

  svg {
    color: var(--color-text-light);
    margin-right: 0.5rem;
  }
`

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-size: ${({ theme }) => theme.fontSizes.base};

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }
`

export const DetailContainer = styled.div`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
`

export const DetailTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
`

export const DetailSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

export const DetailSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
`

export const DetailText = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0.5rem 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
`

export const DetailLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: var(--color-text-primary);
`

export const ModeratorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ModeratorItem = styled.li`
  padding: 0.75rem 1rem;
  background: var(--color-surface-hover);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: var(--color-text-secondary);
  font-size: ${({ theme }) => theme.fontSizes.base};
`
