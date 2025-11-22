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

export const ProfilePageContainer = styled.div<{ $isDark?: boolean }>`
  min-height: 100vh;
  background: ${({ $isDark }) => ($isDark ? 'var(--color-background)' : '#f9fafb')};
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
`

// ============================================
// HEADER (TryHackMe style - dark blue)
// ============================================

export const ProfileHeader = styled.div`
  background: ${theme.gradients.primary};
  padding: 2rem;
  color: white;
  box-shadow: ${theme.shadows.primary};
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`

export const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`

export const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
    border-width: 2px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    border-width: 2px;
  }
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarEditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: ${theme.colors.secondary};
  border: 2px solid white;
  border-radius: ${theme.borderRadius.full};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: ${theme.transitions.all};

  &:hover {
    transform: scale(1.1);
    background: ${theme.colors.secondaryDark};
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
    border-width: 1.5px;
  }
`

export const HiddenInput = styled.input`
  display: none;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: center;
    width: 100%;
  }
`

export const Username = styled.h1`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes['2xl']};
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xl};
  }
`

export const UserTitle = styled.span`
  color: ${theme.colors.secondary};
  font-weight: ${theme.fontWeights.normal};
  font-size: ${theme.fontSizes.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.lg};
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.base};
  }
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
  }
`

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.secondary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: white;
  font-weight: ${theme.fontWeights.semibold};
  cursor: pointer;
  transition: ${theme.transitions.base};
  font-size: ${theme.fontSizes.sm};

  &:hover {
    background: ${theme.colors.secondaryDark};
    transform: translateY(-1px);
  }

  &:nth-child(2), &:nth-child(3) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.75rem;
    font-size: ${theme.fontSizes.xs};
  }
`

export const SocialInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
    gap: 1rem;
  }
`

export const XpInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`

export const XpLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.8);
  font-weight: ${theme.fontWeights.medium};
`

export const XpValue = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: white;
  font-weight: ${theme.fontWeights.bold};
`

export const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`

export const LevelLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.8);
  font-weight: ${theme.fontWeights.medium};
`

export const LevelValue = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: white;
  font-weight: ${theme.fontWeights.bold};
`

export const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`

export const ProgressLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.8);
  font-weight: ${theme.fontWeights.medium};
`

export const ProgressValue = styled.span`
  font-size: ${theme.fontSizes.lg};
  color: white;
  font-weight: ${theme.fontWeights.bold};
`


// ============================================
// STATS CARDS
// ============================================

export const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  min-width: 500px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    min-width: auto;
    width: 100%;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
`

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.md};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  transition: ${theme.transitions.all};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
    gap: 0.25rem;
  }
`

export const StatIcon = styled.div`
  color: ${theme.colors.secondary};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

export const StatValue = styled.div`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: white;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xl};
  }
`

export const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: rgba(255, 255, 255, 0.8);
  text-align: center;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
`

// ============================================
// TABS
// ============================================

export const TabsContainer = styled.div<{ $isDark?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'var(--color-surface)' : '#ffffff')};
  border-bottom: 2px solid ${({ $isDark }) => ($isDark ? 'var(--color-border)' : '#e5e7eb')};
  box-shadow: ${theme.shadows.sm};
  transition: background 0.3s ease, border-color 0.3s ease;
`

export const Tabs = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding: 0 2rem;
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.gray[400]} transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[400]};
    border-radius: ${theme.borderRadius.full};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`

interface TabProps {
  $active: boolean;
  $isDark?: boolean;
}

export const Tab = styled.button<TabProps>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? theme.colors.accentBlue : 'transparent'};
  color: ${props => {
    if (props.$active) return theme.colors.accentBlue;
    return props.$isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500];
  }};
  font-weight: ${props => props.$active ? theme.fontWeights.semibold : theme.fontWeights.normal};
  cursor: pointer;
  transition: ${theme.transitions.base};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: ${theme.fontSizes.sm};
  flex-shrink: 0;

  &:hover {
    color: ${props => props.$isDark ? theme.colors.accentBlue : theme.colors.accentBlue};
    background: ${props => props.$isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: ${theme.fontSizes.xs};
    gap: 0.375rem;

    svg {
      font-size: 0.875rem;
    }
  }
`

// ============================================
// CONTENT AREA
// ============================================

export const ContentArea = styled.div<{ $isDark?: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  background: ${({ $isDark }) => ($isDark ? 'var(--color-surface)' : '#ffffff')};
  min-height: 400px;
  transition: background 0.3s ease;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    min-height: 300px;
  }
`

export const EmptyState = styled.div<{ $isDark?: boolean }>`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};

  p {
    font-size: ${theme.fontSizes.lg};
    margin: 0;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 3rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;

    p {
      font-size: ${theme.fontSizes.base};
    }
  }
`

// ============================================
// COMPLETED EXERCISES CONTENT
// ============================================

export const CompletedContent = styled.div<{ $isDark?: boolean }>`
  width: 100%;
`

export const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

export const ExerciseCard = styled.div<{ $isDark?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'var(--color-surface)' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'var(--color-border)' : theme.colors.gray[200])};
  border-radius: ${theme.borderRadius.md};
  padding: 1.5rem;
  transition: ${theme.transitions.all};
  box-shadow: ${({ $isDark }) => ($isDark ? theme.shadows.sm : '0 2px 8px rgba(0, 0, 0, 0.08)')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) => ($isDark ? theme.shadows.md : '0 4px 12px rgba(0, 0, 0, 0.12)')};
    border-color: ${theme.colors.accentBlue};
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`

export const ExerciseCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

export const ExerciseTitle = styled.h3<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-primary)' : theme.colors.gray[900])};
  margin: 0;
  flex: 1;
`

export const DifficultyBadge = styled.span<{ $difficulty: number; $isDark?: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  white-space: nowrap;
  background: ${({ $difficulty, $isDark }) => {
    if ($difficulty <= 2) return $isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5';
    if ($difficulty <= 3) return $isDark ? 'rgba(251, 191, 36, 0.2)' : '#fef3c7';
    return $isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2';
  }};
  color: ${({ $difficulty, $isDark }) => {
    if ($difficulty <= 2) return $isDark ? theme.colors.green[400] : theme.colors.green[600];
    if ($difficulty <= 3) return $isDark ? theme.colors.yellow[400] : theme.colors.yellow[600];
    return $isDark ? theme.colors.red[400] : theme.colors.red[600];
  }};
`

export const ExerciseDescription = styled.p<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[600])};
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ExerciseFooter = styled.div<{ $isDark?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ $isDark }) => ($isDark ? 'var(--color-border)' : theme.colors.gray[200])};
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

export const ExerciseXp = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${({ $isDark }) => ($isDark ? theme.colors.secondary : theme.colors.yellow[500])};

  svg {
    font-size: ${theme.fontSizes.base};
  }
`

export const ExerciseSubject = styled.span<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};
  padding: 0.25rem 0.75rem;
  background: ${({ $isDark }) => ($isDark ? 'rgba(59, 130, 246, 0.1)' : theme.colors.blue[50])};
  border-radius: ${theme.borderRadius.sm};
`

// ============================================
// BADGES CONTENT
// ============================================

export const BadgesContent = styled.div`
  width: 100%;
`

export const TitlesContent = styled.div<{ $isDark?: boolean }>`
  width: 100%;
`

export const TitlesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`

export const SectionTitle = styled.h2<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-primary)' : theme.colors.gray[900])};
  margin-bottom: 0.5rem;
  letter-spacing: 1px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.fontSizes.xl};
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
    letter-spacing: 0.5px;
  }
`

export const SectionSubtitle = styled.p<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};
  margin-bottom: 0;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
`

export const AllBadges = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
  margin: 0 auto;
  justify-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.75rem;
  }
`

export const BadgeItem = styled.div<{ $isEarned: boolean; $colorIndex: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: ${theme.transitions.all};
  cursor: pointer;
  position: relative;

  svg {
    font-size: 3rem;
    transition: ${theme.transitions.all};
    color: ${({ $isEarned, $colorIndex }) => {
    if (!$isEarned) return theme.colors.gray[300]
    const colors = [
      theme.colors.secondary,
      '#c0c0c0',
      '#cd7f32',
      theme.colors.primary,
      theme.colors.red[500],
      theme.colors.green[400],
    ]
    return colors[$colorIndex % 6]
  }};
    opacity: ${({ $isEarned }) => ($isEarned ? 1 : 0.5)};
    filter: ${({ $isEarned }) => $isEarned ? 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' : 'none'};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 2.5rem;
    }
  }

  &:hover svg {
    transform: ${({ $isEarned }) =>
    $isEarned ? 'scale(1.15) rotate(8deg)' : 'none'};
    filter: ${({ $isEarned }) =>
    $isEarned ? 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.3))' : 'none'};
  }

  &:hover img {
    transform: ${({ $isEarned }) =>
    $isEarned ? 'scale(1.15) rotate(8deg)' : 'none'};
    filter: ${({ $isEarned }) =>
    $isEarned ? 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.3)) brightness(1.1)' : 'none'};
  }
`

export const BadgeImage = styled.img<{ $isDark?: boolean }>`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: ${theme.borderRadius.full};
  border: 3px solid ${({ $isDark }) => ($isDark ? theme.colors.gray[700] : theme.colors.gray[200])};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 
              0 0 0 2px rgba(255, 255, 255, 0.1),
              inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: ${theme.transitions.all};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 0.25rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 3.5rem;
    height: 3.5rem;
  }
`

export const BadgeBase = styled.div<{ $isEarned: boolean }>`
  width: 60px;
  height: 6px;
  background: ${({ $isEarned }) =>
    $isEarned ? theme.gradients.blue : theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${({ $isEarned }) => 
    $isEarned ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'};
  transition: ${theme.transitions.all};

  @media (max-width: 480px) {
    width: 50px;
    height: 5px;
  }
`

export const BadgeName = styled.span<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-primary)' : theme.colors.gray[700])};
  text-align: center;
  margin-top: 0.35rem;
  max-width: 8rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
    max-width: 6rem;
    letter-spacing: 0.03em;
  }
`

export const LoadingBadges = styled.div<{ $isDark?: boolean }>`
  text-align: center;
  padding: 3rem;
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};
  font-size: ${theme.fontSizes.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 2rem 1.5rem;
    font-size: ${theme.fontSizes.base};
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    font-size: ${theme.fontSizes.sm};
  }
`

export const NoBadgesMessage = styled.div<{ $isDark?: boolean }>`
  text-align: center;
  padding: 3rem 2rem;
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};

  svg {
    font-size: 3rem;
    color: ${({ $isDark }) => ($isDark ? theme.colors.gray[600] : theme.colors.gray[300])};
    margin-bottom: 1rem;
  }

  p {
    font-size: ${theme.fontSizes.lg};
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 2rem 1.5rem;

    svg {
      font-size: 2.5rem;
    }

    p {
      font-size: ${theme.fontSizes.base};
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;

    svg {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    p {
      font-size: ${theme.fontSizes.sm};
    }
  }
`

// ============================================
// LEGACY STYLES (mantidos para compatibilidade)
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

export const BackCircleButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: ${theme.transitions.base};
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 36px;
    height: 36px;
  }
`

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

export const XpProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.5rem auto 0;
`

export const XpProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
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

export const XpProgressPercentContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0.25rem auto 0;
  position: relative;
  height: 20px;
`

interface XpProgressPercentProps {
  $progress: number
}

export const XpProgressPercent = styled.span<XpProgressPercentProps>`
  position: absolute;
  top: 0;
  left: ${(props) => `${Math.max(5, Math.min(95, props.$progress))}%`};
  transform: translateX(-50%);
  font-size: ${theme.fontSizes.sm};
  color: var(--color-text-secondary);
  white-space: nowrap;
  pointer-events: none;
`

export const AchievementsSection = styled.section`
  margin-top: 3rem;
  text-align: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
`

export const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  color: var(--color-text-secondary);

  svg {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-left: 0;
    width: 100%;
  }

  @media (max-width: 480px) {
    gap: 0.375rem;

    svg {
      font-size: 0.875rem;
    }
  }
`

export const FilterSelect = styled.select`
  appearance: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 0.35rem 0.5rem;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;

  &:hover {
    border-color: var(--color-blue-400);
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.4rem;
    font-size: ${theme.fontSizes.xs};
    flex: 1;
  }
`

export const CategoryTitle = styled.h3<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-primary)' : theme.colors.gray[900])};
  text-align: left;
  margin: 1rem 0 0.5rem;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.base};
    margin: 0.75rem 0 0.5rem;
  }
`

export const TitlesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-flow: row;
  gap: 1rem;
  margin: 0;
  justify-items: stretch;
  align-items: stretch;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

export const EarnedChip = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${theme.gradients.green};
  color: white;
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  padding: 0.25rem 0.5rem;
  border-radius: ${theme.borderRadius.full};
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  pointer-events: none;
  z-index: 1;

  @media (max-width: 480px) {
    top: 0.375rem;
    right: 0.375rem;
    font-size: 0.625rem;
    padding: 0.2rem 0.4rem;
  }
`

export const TitleCard = styled.div<{ $isDark?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'var(--color-surface)' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'var(--color-border)' : theme.colors.gray[200])};
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  height: 100%;
  min-height: 160px;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  box-shadow: ${({ $isDark }) => ($isDark ? theme.shadows.md : '0 4px 12px rgba(0, 0, 0, 0.06)')};
  transition: ${theme.transitions.all};

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.colors.accentBlue};
    box-shadow: ${({ $isDark }) => ($isDark ? theme.shadows.lg : '0 8px 20px rgba(59, 130, 246, 0.15)')};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-height: 140px;
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    min-height: auto;
    padding: 1rem;
  }
`

export const TitleHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`

export const TitleName = styled.strong<{ $isDark?: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-primary)' : theme.colors.gray[900])};
  font-weight: ${theme.fontWeights.semibold};
  font-size: ${theme.fontSizes.base};
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.sm};
  }
`

export const TitleLabel = styled.span<{ $earned?: boolean; $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $earned, $isDark }) => {
    if ($earned) return theme.colors.green[400];
    return $isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500];
  }};
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
`

export const TitleDescription = styled.div<{ $isDark?: boolean }>`
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};
  margin-top: 0.25rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
    margin-top: 0.5rem;
  }
`

export const TitleProgressWrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`

export const TitleProgressBar = styled.div<{ $isDark?: boolean }>`
  width: 100%;
  height: 8px;
  background: ${({ $isDark }) => ($isDark ? 'var(--color-border)' : theme.colors.gray[200])};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`

interface TitleProgressFillProps { $progress: number }
export const TitleProgressFill = styled.div<TitleProgressFillProps>`
  height: 100%;
  width: ${(props) => Math.max(0, Math.min(100, props.$progress))}%;
  background: var(--gradient-blue);
  border-radius: ${theme.borderRadius.full};
  transition: width 0.5s ease;
  filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.35));
`

export const TitleProgressPercentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  margin-top: 0.25rem;
`

interface TitleProgressPercentProps { $progress: number; $isDark?: boolean }
export const TitleProgressPercent = styled.span<TitleProgressPercentProps>`
  position: absolute;
  top: 0;
  left: ${(props) => `${Math.max(5, Math.min(95, props.$progress))}%`};
  transform: translateX(-50%);
  font-size: ${theme.fontSizes.sm};
  color: ${({ $isDark }) => ($isDark ? 'var(--color-text-secondary)' : theme.colors.gray[500])};
  white-space: nowrap;
  pointer-events: none;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
  }
`
