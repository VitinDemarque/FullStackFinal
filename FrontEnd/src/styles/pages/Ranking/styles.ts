import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { theme } from '../../theme'

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

export const RankingPage = styled.div<{ $isDark?: boolean }>`
  min-height: 100vh;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#f9fafb')};
  transition: background 0.3s ease;
`

export const HeroSection = styled.section<{ $isDark?: boolean }>`
  position: relative;
  background: ${({ $isDark }) => 
    $isDark 
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 3rem 2rem 2.5rem;
  overflow: hidden;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : 'rgba(255, 255, 255, 0.1)')};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 2rem;
  }
`

export const YellowDecoration = styled.div`
  position: absolute;
  right: -10%;
  top: -20%;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  filter: blur(80px);

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`

export const HeroTitle = styled.h1<{ $isDark?: boolean }>`
  font-size: 3rem;
  font-weight: 800;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : '#ffffff')};
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const HeroSubtitle = styled.p<{ $isDark?: boolean }>`
  font-size: 1.25rem;
  color: ${({ $isDark }) => ($isDark ? '#cbd5e1' : 'rgba(255, 255, 255, 0.95)')};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const ContentSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

export const MainContent = styled.div<{ $isDark?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border-radius: 16px;
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)'};
  padding: 0;
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: none;

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`

export const SectionHeader = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[50])};
  transition: border-color 0.3s ease;
`

export const SectionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
`

export const SectionTitle = styled.h2<{ $isDark?: boolean }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : theme.colors.gray[900])};
  margin: 0;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const LeaderboardTable = styled.div<{ $noScroll?: boolean }>`
  width: 100%;
  ${({ $noScroll }) => !$noScroll && 'overflow-x: auto;'}
`

export const TableHeader = styled.div<{ $isDark?: boolean }>`
  display: grid;
  grid-template-columns: 8% 25% 12% 12% 12% 12% 12%;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[50])};
  border-radius: 12px 12px 0 0;
  transition: background 0.3s ease;

  @media (max-width: 1024px) {
    grid-template-columns: 10% 30% 12% 12% 12% 12% 12%;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
`

export const HeaderCell = styled.div<{ width?: string; $isDark?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`

export const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: none;
  overflow: visible;
`

export const TableRow = styled.div<{ $isDark?: boolean }>`
  display: grid;
  grid-template-columns: 8% 25% 12% 12% 12% 12% 12%;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[100])};
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[50])};
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 10% 30% 12% 12% 12% 12% 12%;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
`

export const TableCell = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ $isDark }) => ($isDark ? '#cbd5e1' : theme.colors.gray[700])};
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    gap: 0.5rem;
  }
`

export const PositionBadge = styled.div<{ $position: number }>`
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $position }) =>
        $position === 1
            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
            : $position === 2
                ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)'
                : $position === 3
                    ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                    : theme.colors.gray[100]};
  color: ${({ $position }) => ($position <= 3 ? '#ffffff' : theme.colors.gray[700])};
  border-radius: ${theme.borderRadius.lg};
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: ${({ $position }) =>
        $position <= 3 ? '0 4px 10px rgba(0, 0, 0, 0.15)' : 'none'};

  @media (max-width: 768px) {
    min-width: 35px;
    height: 35px;
    font-size: 0.75rem;
  }
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

export const UserAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
`

export const UserAvatarImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`

export const UserName = styled.span<{ $isDark?: boolean }>`
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
  transition: color 0.3s ease;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const UserNameLink = styled(Link)<{ $isDark?: boolean }>`
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#93c5fd' : theme.colors.primary)};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ $isDark }) => ($isDark ? '#bfdbfe' : '#2563eb')};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const Points = styled.span`
  font-weight: 700;
  color: ${theme.colors.primary};
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const MedalIcon = styled.div<{ color: 'gold' | 'silver' | 'bronze' }>`
  font-size: 1.75rem;
  color: ${({ color }) =>
        color === 'gold'
            ? '#fbbf24'
            : color === 'silver'
                ? '#cbd5e1'
                : '#f97316'};
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const XpBadge = styled.div<{ $isDark?: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[100])};
  border-radius: ${theme.borderRadius.full};
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[700])};
  font-size: 0.875rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
`

export const Pagination = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  transition: border-color 0.3s ease;
`

export const PaginationDot = styled.button<{ $active?: boolean; $isDark?: boolean }>`
  width: ${({ $active }) => ($active ? '32px' : '10px')};
  height: 10px;
  border-radius: ${theme.borderRadius.full};
  background: ${({ $active, $isDark }) =>
    $active
      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
      : $isDark
      ? '#475569'
      : theme.colors.gray[300]};
  border: none;
  cursor: pointer;
  transition: ${theme.transitions.all};

  &:hover {
    background: ${({ $active, $isDark }) =>
      $active
        ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
        : $isDark
        ? '#64748b'
        : theme.colors.gray[400]};
  }
`

export const NoDataRow = styled(TableRow)`
  grid-template-columns: 1fr;
  justify-content: center;
  text-align: center;
  padding: 3rem;

  &:hover {
    transform: none;
    box-shadow: none;
    border-color: ${theme.colors.gray[200]};
  }
`

export const NoDataCell = styled.div<{ colSpan?: number }>`
  grid-column: span ${({ colSpan }) => colSpan || 1};
`

export const NoDataMessage = styled.p<{ $isDark?: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
`

export const SkeletonText = styled.div<{ width?: string; $isDark?: boolean }>`
  width: ${({ width }) => width || '100px'};
  height: 20px;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
      : `linear-gradient(90deg, ${theme.colors.gray[200]} 0%, ${theme.colors.gray[100]} 50%, ${theme.colors.gray[200]} 100%)`};
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${theme.borderRadius.sm};
`

export const SkeletonAvatar = styled.div<{ $isDark?: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
      : `linear-gradient(90deg, ${theme.colors.gray[200]} 0%, ${theme.colors.gray[100]} 50%, ${theme.colors.gray[200]} 100%)`};
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`

// Cards de Estatísticas
export const StatsCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const StatCard = styled.div<{ $isDark?: boolean; $large?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  border-radius: 12px;
  padding: ${({ $large }) => ($large ? '1.75rem' : '1.5rem')};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, ${({ $isDark }) => ($isDark ? '0.05' : '0.1')}),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: ${({ $isDark }) =>
      $isDark 
        ? '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.1)' 
        : '0 8px 20px rgba(0, 0, 0, 0.12), 0 0 20px rgba(59, 130, 246, 0.08)'};
    border-color: ${({ $isDark }) => ($isDark ? '#475569' : theme.colors.gray[300])};
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
  }
`

export const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1.5rem;
  flex-shrink: 0;
`

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`

export const StatValue = styled.div<{ $isDark?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
  margin-bottom: 0.25rem;
  line-height: 1.2;
  white-space: nowrap;
`

export const StatLabel = styled.div<{ $isDark?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  font-weight: 500;
  line-height: 1.4;
`

export const StatHint = styled.div<{ $isDark?: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isDark }) => ($isDark ? '#64748b' : theme.colors.gray[500])};
  margin-top: 0.5rem;
  line-height: 1.4;
`

export const StatValueSmall = styled.div<{ $isDark?: boolean }>`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#cbd5e1' : theme.colors.gray[700])};
`

// Top 3 Cards
export const TopThreeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const TopThreeCard = styled.div<{ $position: number; $isDark?: boolean }>`
  position: relative;
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border: 2px solid ${({ $position, $isDark }) => {
    if ($position === 1) return '#fbbf24';
    if ($position === 2) return '#cbd5e1';
    if ($position === 3) return '#f97316';
    return $isDark ? '#334155' : theme.colors.gray[200];
  }};
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  cursor: pointer;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 16px;
    background: ${({ $position }) => {
      if ($position === 1) return 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0))';
      if ($position === 2) return 'linear-gradient(135deg, rgba(203, 213, 225, 0.3), rgba(203, 213, 225, 0))';
      if ($position === 3) return 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0))';
      return 'transparent';
    }};
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: ${({ $position, $isDark }) => {
      if ($position === 1) return '0 12px 40px rgba(251, 191, 36, 0.4), 0 0 30px rgba(251, 191, 36, 0.2)';
      if ($position === 2) return '0 12px 40px rgba(203, 213, 225, 0.4), 0 0 30px rgba(203, 213, 225, 0.2)';
      if ($position === 3) return '0 12px 40px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.2)';
      return $isDark ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)';
    }};
  }

  &:hover::after {
    opacity: 1;
  }
`

export const TopThreeMedal = styled.div<{ $position: number }>`
  position: absolute;
  top: -10px;
  right: 1rem;
  font-size: 3rem;
  color: ${({ $position }) => {
    if ($position === 1) return '#fbbf24';
    if ($position === 2) return '#cbd5e1';
    if ($position === 3) return '#f97316';
    return '#94a3b8';
  }};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  z-index: 1;
`

export const TopThreeAvatarContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`

export const TopThreeAvatar = styled.div<{ $isDark?: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2.25rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  border: 3px solid ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
`

export const TopThreeAvatarImg = styled.img<{ $isDark?: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  border: 3px solid ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
`

export const TopThreeBadge = styled.div<{ $position: number }>`
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $position }) => {
    if ($position === 1) return '#fbbf24';
    if ($position === 2) return '#cbd5e1';
    if ($position === 3) return '#f97316';
    return '#94a3b8';
  }};
  color: ${({ $position }) => ($position <= 3 ? '#ffffff' : '#1e293b')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  border: 3px solid ${({ $position }) => {
    if ($position === 1) return '#fbbf24';
    if ($position === 2) return '#cbd5e1';
    if ($position === 3) return '#f97316';
    return '#94a3b8';
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`

export const TopThreeName = styled.div<{ $isDark?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
  margin-bottom: 0.25rem;
  margin-top: 0.75rem;
`

export const TopThreeHandle = styled.div<{ $isDark?: boolean }>`
  font-size: 0.8rem;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  margin-bottom: 1rem;
`

export const TopThreeStats = styled.div<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
`

export const TopThreeStatItem = styled.div<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex: 1;

  span {
    font-size: 0.7rem;
    color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  strong {
    font-size: 1rem;
    color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
    font-weight: 700;
  }
`

export const PositionNumber = styled.span<{ $isDark?: boolean }>`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ $isDark }) => ($isDark ? '#cbd5e1' : theme.colors.gray[700])};
`

