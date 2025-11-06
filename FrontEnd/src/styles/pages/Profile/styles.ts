import styled, { keyframes } from 'styled-components'
import { theme } from '../../theme'

// ============================================
// ANIMATIONS
// ============================================

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

// ============================================
// MAIN CONTAINER
// ============================================

export const ProfilePage = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`

// ============================================
// HERO SECTION
// ============================================

export const ProfileHero = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  position: relative;
  width: 100%;
  max-width: 1200px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 2rem 1rem;
  }
`

export const EditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: var(--color-text-primary);
  cursor: pointer;
  transition: ${theme.transitions.base};

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    color: var(--color-blue-400);
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
    margin-bottom: 2rem;
  }
`

// ============================================
// AVATAR
// ============================================

export const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 120px;
    height: 120px;
  }
`

export const Avatar = styled.div`
  width: 150px;
  height: 150px;
  background: var(--color-surface);
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  font-size: 4rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarEditButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  background: var(--gradient-blue);
  border: 3px solid var(--color-text-primary);
  border-radius: ${theme.borderRadius.full};
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: ${theme.transitions.all};

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
`

export const HiddenInput = styled.input`
  display: none;
`

// ============================================
// IMAGE UPLOAD OPTIONS
// ============================================

export const ImageUploadOptions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: ${slideDown} 0.3s ease;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
`

export const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  font-size: 0.9375rem;
  background: ${theme.gradients.blue};
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`

export const RemoveButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-red-500);
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  font-size: 0.9375rem;
  background: var(--color-surface);
  color: var(--color-red-500);

  &:hover {
    background: var(--color-red-500);
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`

// ============================================
// USER INFO
// ============================================

export const ProfileName = styled.h1`
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin-bottom: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes['2xl']};
  }
`

export const BadgeIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${theme.gradients.yellow};
  border-radius: ${theme.borderRadius.sm};
  color: white;
  font-size: ${theme.fontSizes['2xl']};
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
`

// ============================================
// STATS
// ============================================

export const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: 2rem;
  }
`

export const StatItem = styled.div`
  text-align: center;
`

export const StatLabel = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  font-weight: ${theme.fontWeights.medium};
`

export const StatValue = styled.p`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
`

// ============================================
// XP PROGRESS
// ============================================

export const XpProgressContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`

export const XpProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--color-border);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`

interface XpProgressFillProps {
  $progress: number
}

export const XpProgressFill = styled.div<XpProgressFillProps>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: var(--gradient-blue);
  border-radius: ${theme.borderRadius.full};
  transition: width 0.5s ease;
`

// ============================================
// ACHIEVEMENTS SECTION
// ============================================

export const AchievementsSection = styled.section`
  margin-top: 3rem;
  text-align: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
`

export const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
`

export const SectionSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`

// ============================================
// TOP BADGES
// ============================================

export const TopBadges = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: 1rem;
  }
`

export const TopBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface BadgeTrophyProps {
  position: 1 | 2 | 3
}

export const BadgeTrophy = styled.div<BadgeTrophyProps>`
  font-size: ${(props) => {
    switch (props.position) {
      case 1:
        return '4rem'
      case 2:
        return '3.5rem'
      case 3:
        return '3rem'
    }
  }};
  color: ${theme.colors.secondary};
  margin-bottom: 0.5rem;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.5));

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${(props) => {
    switch (props.position) {
      case 1:
        return '3rem'
      case 2:
        return '2.5rem'
      case 3:
        return '2.5rem'
    }
  }};
  }
`

export const BadgePedestal = styled.div`
  width: 80px;
  height: 12px;
  background: ${theme.gradients.blue};
  border-radius: ${theme.borderRadius.full};
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`

// ============================================
// ALL BADGES
// ============================================

export const AllBadges = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  justify-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`

interface BadgeItemProps {
  isEarned: boolean
  colorIndex: number
}

export const BadgeItem = styled.div<BadgeItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: ${theme.transitions.all};
  cursor: pointer;

  svg {
    font-size: 2.5rem;
    transition: ${theme.transitions.all};
    color: ${(props) => {
    if (!props.isEarned) return theme.colors.gray[300]
    const colors = [
      theme.colors.secondary,
      '#c0c0c0',
      '#cd7f32',
      '#8b5cf6',
      theme.colors.red[500],
      theme.colors.green[400],
    ]
    return colors[props.colorIndex % 6]
  }};
    opacity: ${(props) => (props.isEarned ? 1 : 0.5)};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 2rem;
    }
  }

  &:hover svg {
    transform: ${(props) =>
    props.isEarned ? 'scale(1.1) rotate(5deg)' : 'none'};
    filter: ${(props) =>
    props.isEarned ? 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))' : 'none'};
  }
`

export const BadgeBase = styled.div<{ isEarned: boolean }>`
  width: 50px;
  height: 8px;
  background: ${(props) =>
    props.isEarned ? theme.gradients.blue : theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.full};
`

// ============================================
// EMPTY STATES
// ============================================

export const LoadingBadges = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  font-size: ${theme.fontSizes.lg};
`

export const NoBadgesMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-secondary);

  svg {
    font-size: 3rem;
    color: var(--color-gray-300);
    margin-bottom: 1rem;
  }

  p {
    font-size: ${theme.fontSizes.lg};
    line-height: 1.6;
    margin: 0;
  }
`

