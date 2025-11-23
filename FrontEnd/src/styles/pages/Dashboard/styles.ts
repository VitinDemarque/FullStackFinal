import styled from 'styled-components'
import { theme } from '../../theme'

// ============================================
// CONTAINER PRINCIPAL
// ============================================

export const DashboardPage = styled.div<{ $isDark?: boolean }>`
  min-height: 100vh;
  width: 100%;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : 'transparent')};
  transition: background 0.3s ease;
`

export const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`

// ============================================
// HERO SECTION
// ============================================

export const HeroSection = styled.section`
  background: ${theme.gradients.primary};
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  box-shadow: ${theme.shadows.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    padding: 2rem;
  }
`

export const HeroContent = styled.div`
  flex: 1;
`

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: ${theme.fontWeights.bold};
  margin-bottom: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`

export const Bracket = styled.span`
  color: ${theme.colors.secondary};
`

export const HeroDescription = styled.p`
  font-size: ${theme.fontSizes.lg};
  line-height: 1.7;
  margin-bottom: 2rem;
  opacity: 0.95;
`

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 1rem 2rem;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.all};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 1.25rem;
  }
`

// ============================================
// HERO STATS
// ============================================

export const HeroStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`

interface StatCardProps {
  $variant?: 'trophy' | 'star'
}

export const StatCard = styled.div<StatCardProps>`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }

  svg {
    font-size: 2.5rem;
    color: ${(props) =>
    props.$variant === 'trophy'
      ? theme.colors.secondary
      : theme.colors.yellow[200]};
  }
`

export const StatValue = styled.p`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  margin: 0;
`

export const StatLabel = styled.p`
  font-size: ${theme.fontSizes.sm};
  margin: 0;
  opacity: 0.9;
`

// ============================================
// SECTIONS
// ============================================

export const Section = styled.section`
  margin-bottom: 3rem;
`

export const SectionTitle = styled.h2<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${({ $isDark }) => ($isDark ? 'white' : theme.colors.gray[900])};
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;

  svg {
    color: ${theme.colors.primary};
  }
`

export const SectionDescription = styled.p<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.base};
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  margin-bottom: 1.5rem;
  margin-top: -1rem;
  transition: color 0.3s ease;
`

// ============================================
// PROGRESS GRID
// ============================================

export const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

interface ProgressCardProps {
  $variant?: 'purple' | 'blue' | 'green'
}

export const ProgressCard = styled.div<ProgressCardProps>`
  background: var(--color-surface);
  border-radius: ${theme.borderRadius.lg};
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: ${theme.transitions.all};
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  svg {
    width: 3rem;
    height: 3rem;
    color: white;
    padding: 0.75rem;
    border-radius: ${theme.borderRadius.md};
    background: ${(props) => {
    switch (props.$variant) {
      case 'purple':
        return theme.gradients.primary
      case 'blue':
        return theme.gradients.blue
      case 'green':
        return theme.gradients.green
      default:
        return theme.gradients.primary
    }
  }};
    flex-shrink: 0;
  }
`

export const ProgressInfo = styled.div`
  h3 {
    font-size: ${theme.fontSizes['4xl']};
    font-weight: ${theme.fontWeights.bold};
    margin: 0;
    color: var(--color-text-primary);
  }

  p {
    font-size: ${theme.fontSizes.base};
    margin: 0;
    color: var(--color-text-secondary);
  }
`

// ============================================
// DEVELOPMENT BANNER
// ============================================

export const DevelopmentBanner = styled.div`
  background: ${theme.gradients.yellow};
  border-radius: ${theme.borderRadius.lg};
  padding: 2.5rem;
  color: white;
  box-shadow: ${theme.shadows.yellow};
`

export const BannerContent = styled.div`
  h3 {
    font-size: ${theme.fontSizes['3xl']};
    margin-bottom: 1rem;
  }

  p {
    font-size: ${theme.fontSizes.base};
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.95;
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: 0.5rem;
`

interface ProgressFillProps {
  progress: number
}

export const ProgressFill = styled.div<ProgressFillProps>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background: white;
  border-radius: ${theme.borderRadius.full};
  transition: width 0.5s ease;
`

export const ProgressText = styled.p`
  font-size: ${theme.fontSizes.sm};
  margin: 0;
  opacity: 0.9;
`

// ============================================
// RECOMMENDATIONS GRID
// ============================================

export const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const ExerciseCard = styled.div<{ $isDark?: boolean; $isCompleted?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : 'white')};
  border-radius: ${theme.borderRadius.lg};
  overflow: visible;
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 15px rgba(0, 0, 0, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.08)'};
  transition: ${theme.transitions.all};
  border: 1px solid ${({ $isDark, $isCompleted }) => 
    $isCompleted 
      ? ($isDark ? '#10b981' : '#10b981')
      : ($isDark ? '#334155' : theme.colors.gray[200])};
  display: flex;
  flex-direction: column;
  min-height: 280px;
  position: relative;

  ${({ $isCompleted }) => $isCompleted && `
    border-width: 2px;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $isDark }) =>
    $isDark ? '0 8px 25px rgba(0, 0, 0, 0.7)' : '0 8px 25px rgba(0, 0, 0, 0.12)'};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-height: 260px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: 240px;
  }
`

export const CompletedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  animation: pulse 2s ease-in-out infinite;

  svg {
    font-size: 1rem;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    50% {
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.6);
    }
  }
`

export const CardHeader = styled.div<{ $isDark?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.25rem 1.5rem;
  min-height: 3.5rem;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[50])};
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  transition: background 0.3s ease, border-color 0.3s ease;
  overflow: visible;
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  position: relative;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem 1.25rem;
    min-height: 3rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.875rem 1rem;
    min-height: 2.75rem;
  }
`

interface DifficultyBadgeProps {
  difficulty: 'fácil' | 'médio' | 'difícil' | 'expert' | 'master'
}

export const DifficultyBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'difficulty'
})<DifficultyBadgeProps>`
  position: absolute;
  top: 0.75rem;
  left: 1rem;
  padding: 0.4rem 1rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.bold};
  text-transform: uppercase;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    top: 0.5rem;
    left: 0.75rem;
    padding: 0.35rem 0.85rem;
    font-size: 0.65rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.3rem 0.75rem;
    font-size: 0.6rem;
  }
  
  background: ${(props) => {
    switch (props.difficulty) {
      case 'fácil':
        return theme.colors.success.bg
      case 'médio':
        return theme.colors.warning.bg
      case 'difícil':
        return theme.colors.danger.bg
      case 'expert':
      case 'master':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      default:
        return theme.colors.warning.bg
    }
  }};
  color: ${(props) => {
    switch (props.difficulty) {
      case 'fácil':
        return theme.colors.success.text
      case 'médio':
        return theme.colors.warning.text
      case 'difícil':
        return theme.colors.danger.text
      case 'expert':
      case 'master':
        return 'white'
      default:
        return theme.colors.warning.text
    }
  }};
`

export const LanguageBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$center'
})<{ $center?: boolean }>`
  position: absolute;
  top: 0.75rem;
  ${props => props.$center ? `
    left: 50%;
    transform: translateX(-50%);
  ` : `
    right: 6rem;
  `}
  padding: 0.35rem 0.85rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    top: 0.5rem;
    ${props => props.$center ? `
      left: 50%;
      transform: translateX(-50%);
    ` : `
      right: 5rem;
    `}
    padding: 0.3rem 0.75rem;
    font-size: 0.65rem;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    top: 0.5rem;
    ${props => props.$center ? `
      left: 50%;
      transform: translateX(-50%);
    ` : `
      right: 4.5rem;
    `}
    padding: 0.25rem 0.65rem;
    font-size: 0.6rem;
  }
`

export const XpBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};
  min-width: 4.5rem;
  justify-content: flex-end;

  svg {
    font-size: 1rem;
  }
`

export const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 120px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1.25rem;
    min-height: 100px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem;
    min-height: 90px;
  }
`

export const CardTitle = styled.h3<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : theme.colors.gray[900])};
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.lg};
    margin-bottom: 0.5rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSizes.base};
  }
`

export const CardDescription = styled.p<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.base};
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
  flex: 1;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.sm};
    -webkit-line-clamp: 2;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    -webkit-line-clamp: 2;
  }
`

export const CardLanguage = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: ${theme.fontSizes.sm};

  svg {
    font-size: 1rem;
  }
`

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1.5rem 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 1.25rem 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 1rem 1rem;
  }
`

export const FooterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.4rem;
  }
`

export const StartButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: ${theme.transitions.base};
  background: ${theme.gradients.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.55rem 0.9rem;
    font-size: 0.8rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0.6rem 1rem;
  }
`

export const RankingButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: ${theme.transitions.base};
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.55rem 0.9rem;
    font-size: 0.8rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0.6rem 1rem;
  }
`

export const CompletedButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};
  cursor: not-allowed;
  transition: ${theme.transitions.base};
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  opacity: 0.9;
  white-space: nowrap;

  svg {
    font-size: 0.875rem;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.55rem 0.9rem;
    font-size: 0.8rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    padding: 0.6rem 1rem;
  }
`

export const DetailsButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  background: transparent;
  color: ${theme.colors.primary};

  &:hover {
    background: var(--color-surface-hover);
  }
`

export const RefreshButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`

// ============================================
// NO RECOMMENDATIONS
// ============================================

export const NoRecommendations = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: var(--color-surface);
  border-radius: ${theme.borderRadius.lg};

  p {
    margin-bottom: 1rem;
    color: var(--color-text-secondary);
  }
`

// ============================================
// ERROR ALERT
// ============================================

export const ErrorAlert = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: var(--color-danger-bg);
  border: 1px solid var(--color-red-400);
  border-radius: ${theme.borderRadius.sm};
  color: var(--color-danger-text);

  strong {
    font-weight: ${theme.fontWeights.bold};
  }

  button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--color-red-500);
    color: var(--color-text-primary);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: ${theme.fontWeights.medium};

    &:hover {
      background-color: var(--color-red-600);
    }
  }
`

