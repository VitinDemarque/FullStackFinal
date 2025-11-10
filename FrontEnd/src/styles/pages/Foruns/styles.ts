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

export const ForumCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$inactive'
})<{ $inactive?: boolean }>`
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
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary);
  }

  ${({ $inactive }) => $inactive ? `
    filter: saturate(0.85);
    opacity: 0.96;
  ` : ''}
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`

export const CardTopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* padrão seguro: uma coluna para evitar quebra em cards estreitos */
  gap: 0.75rem 1rem;
  align-items: start;
  margin-bottom: 1rem;

  /* Em telas maiores (laptop+), divide em duas metades */
  @media (min-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr 1fr;
  }

  /* Evita overflow dos filhos dentro das colunas */
  > div {
    min-width: 0;
  }
`

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  line-height: 1.4;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`

export const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 100%;
`

export const Badge = styled.span<{ variant?: 'public' | 'private' }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: inline-block;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
  max-width: 100%;

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
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
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

export const OwnerInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`

export const OwnerAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
`

export const OwnerAvatarFallback = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-blue-100);
  color: var(--color-blue-600);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: 1px solid var(--color-border);
`

export const OwnerNameLink = styled.span`
  color: var(--color-blue-600);
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  &:hover {
    color: var(--color-blue-700);
    text-decoration: underline;
  }
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

export const DetailContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$inactive'
})<{ $inactive?: boolean }>`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  position: relative;

  ${({ $inactive }) => $inactive ? `
    filter: saturate(0.85);
    opacity: 0.96;
  ` : ''}
`

export const DetailTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
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
  max-width: 100%;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
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

// ============================================
// DETAIL PAGE – UI COMPONENTS
// ============================================

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1rem 0 0 0;
`

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};
  box-shadow: var(--shadow-sm);
  border: 1px solid transparent;

  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: var(--color-surface);
          color: var(--color-text-primary);
          border-color: var(--color-border);
          &:hover { background: var(--color-surface-hover); border-color: var(--color-blue-400); color: var(--color-blue-400); }
        `
      case 'success':
        return `
          background: var(--gradient-green);
          color: #fff;
          border: none;
          &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        `
      case 'danger':
        return `
          background: var(--color-red-500);
          color: #fff;
          border: none;
          &:hover { background: var(--color-red-600); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        `
      default:
        return `
          background: var(--gradient-blue);
          color: #fff;
          border: none;
          &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        `
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--shadow-sm);
  }
`

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: ${({ theme }) => theme.transitions.base};

  &:focus {
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    outline: none;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: ${({ theme }) => theme.transitions.base};
  min-height: 140px;
  resize: vertical;

  &:focus {
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    outline: none;
  }
`

export const TopicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const TopicCard = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== 'menuAberto' && prop !== '$inactive'
})<{ menuAberto?: boolean; $inactive?: boolean }>`
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  z-index: ${(props) => (props.menuAberto ? 100 : 'auto')};
  overflow: visible;

  &:hover {
    background: var(--color-surface-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  ${({ $inactive }) => $inactive ? `
    filter: saturate(0.85);
    opacity: 0.96;
  ` : ''}
`

export const TopicHeader = styled.div`
  flex: 1;
`

export const TopicTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: var(--color-text-primary);
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`

export const TopicContent = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`

export const TopicActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: inherit;
`

export const OptionsMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: var(--shadow-lg);
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 1000;
`

export const OptionsItem = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--color-surface-hover);
  }

  &.danger {
    color: var(--color-danger-text);
  }
`

export const OptionsDivider = styled.div`
  height: 1px;
  background: var(--color-border);
  margin: 0.25rem 0;
`

// ------- Topic details page: comments UI -------
export const CommentsHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
`

export const CommentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const CommentsListWrapper = styled.div`
  position: relative;
`

export const CommentItem = styled.li`
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: var(--shadow-sm);
`

export const CommentContent = styled.p`
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
`

export const CommentMeta = styled.div`
  margin-top: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: var(--color-text-light);
`

export const CommentActions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`

export const FadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--color-surface) 80%);
`

export const CommentsFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`

// Reuso do padrão visual de cartões inativos
export const InactiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  background: rgba(2, 6, 23, 0.25);
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
`

export const InactiveLabel = styled.div`
  font-weight: 800;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #111827;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(17, 24, 39, 0.2);
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.15);
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const TopicsSearchBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--color-surface);
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  width: 320px;
  max-width: 100%;

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
