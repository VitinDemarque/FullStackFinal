import styled from 'styled-components'
import { theme } from '../../theme'

// ============================================
// CONTAINER PRINCIPAL
// ============================================

export const DashboardPage = styled.div`
  min-height: 100vh;
  width: 100%;
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
  background: white;
  color: ${theme.colors.primary};
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
  variant?: 'trophy' | 'star'
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
      props.variant === 'trophy'
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

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[800]};
  margin-bottom: 1.5rem;

  svg {
    color: ${theme.colors.primary};
  }
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
  variant?: 'purple' | 'blue' | 'green'
}

export const ProgressCard = styled.div<ProgressCardProps>`
  background: white;
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
    font-size: 3rem;
    color: white;
    padding: 1rem;
    border-radius: ${theme.borderRadius.md};
    background: ${(props) => {
      switch (props.variant) {
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
  }
`

export const ProgressInfo = styled.div`
  h3 {
    font-size: ${theme.fontSizes['4xl']};
    font-weight: ${theme.fontWeights.bold};
    margin: 0;
    color: ${theme.colors.gray[800]};
  }

  p {
    font-size: ${theme.fontSizes.base};
    margin: 0;
    color: ${theme.colors.gray[500]};
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const ExerciseCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: ${theme.transitions.all};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: ${theme.colors.gray[50]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`

interface DifficultyBadgeProps {
  difficulty: 'fácil' | 'médio' | 'difícil' | 'expert'
}

export const DifficultyBadge = styled.span<DifficultyBadgeProps>`
  padding: 0.25rem 0.75rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.difficulty) {
      case 'fácil':
        return theme.colors.success.bg
      case 'médio':
        return theme.colors.warning.bg
      case 'difícil':
      case 'expert':
        return theme.colors.danger.bg
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
      case 'expert':
        return theme.colors.danger.text
      default:
        return theme.colors.warning.text
    }
  }};
`

export const XpBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.sm};

  svg {
    font-size: 1rem;
  }
`

export const CardBody = styled.div`
  padding: 1.5rem;
`

export const CardTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.gray[800]};
  margin-bottom: 0.75rem;
`

export const CardLanguage = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.gray[500]};
  font-size: ${theme.fontSizes.sm};

  svg {
    font-size: 1rem;
  }
`

export const CardFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
`

export const StartButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  background: ${theme.gradients.primary};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
    background: #f5f7ff;
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
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};

  p {
    margin-bottom: 1rem;
    color: ${theme.colors.gray[600]};
  }
`

// ============================================
// ERROR ALERT
// ============================================

export const ErrorAlert = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: ${theme.borderRadius.sm};
  color: #c33;

  strong {
    font-weight: ${theme.fontWeights.bold};
  }

  button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: #c33;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: ${theme.fontWeights.medium};

    &:hover {
      background-color: #a22;
    }
  }
`

