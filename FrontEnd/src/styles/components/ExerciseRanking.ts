import styled from 'styled-components'
import { theme } from '../theme'

export const RankingContainer = styled.div<{ $isDark?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
`

export const RankingHeader = styled.div<{ $isDark?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[200])};
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : theme.colors.gray[50])};

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
  }
`

export const TotalEntries = styled.span<{ $isDark?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  font-weight: 500;
`

export const MyPositionBadge = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${({ $isDark }) => ($isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)')};
  border-radius: 12px;
  margin: 1.5rem 2rem;
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? '#cbd5e1' : theme.colors.gray[700])};

  strong {
    color: ${theme.colors.primary};
    font-weight: 700;
  }
`

export const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const RankingEntry = styled.div<{ $isCurrentUser?: boolean; $isTopThree?: boolean; $isDark?: boolean }>`
  display: grid;
  grid-template-columns: 80px 1fr 140px 140px;
  gap: 1.5rem;
  align-items: center;
  padding: 1.25rem 2rem;
  background: ${(props) => {
    if (props.$isCurrentUser) {
      return props.$isDark ? 'rgba(102, 126, 234, 0.08)' : 'rgba(102, 126, 234, 0.03)';
    }
    if (props.$isTopThree) {
      return props.$isDark ? '#1e293b' : '#ffffff';
    }
    return props.$isDark ? '#1e293b' : '#ffffff';
  }};
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[100])};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isDark }) => ($isDark ? '#334155' : theme.colors.gray[50])};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const PositionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const PositionIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`

export const PositionNumber = styled.span<{ $isDark?: boolean; $position?: number }>`
  font-weight: 700;
  font-size: 1rem;
  color: ${({ $position, $isDark }) => {
    if ($position === 1) return '#fbbf24';
    if ($position === 2) return '#cbd5e1';
    if ($position === 3) return '#f97316';
    return $isDark ? '#cbd5e1' : theme.colors.gray[700];
  }};
`

export const UserCell = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const UserName = styled.div<{ $isDark?: boolean }>`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : theme.colors.gray[900])};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const YouBadge = styled.span`
  color: ${theme.colors.primary};
  font-weight: 600;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`

export const ScoreCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`

export const ScoreValue = styled.div<{ $isDark?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.primary};
`

export const ScoreBreakdown = styled.div<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: 0.75rem;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
  text-align: right;

  span {
    white-space: nowrap;
  }
`

export const MetricsCell = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
`

export const Metric = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[600])};
  font-weight: 500;

  svg {
    font-size: 0.875rem;
    color: ${({ $isDark }) => ($isDark ? '#64748b' : theme.colors.gray[400])};
  }
`

export const LoadingMessage = styled.div<{ $isDark?: boolean }>`
  padding: 3rem;
  text-align: center;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
  font-size: 0.95rem;
`

export const ErrorMessage = styled.div<{ $isDark?: boolean }>`
  padding: 1.5rem 2rem;
  margin: 1.5rem 2rem;
  text-align: center;
  color: ${theme.colors.red[500]};
  background: ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')};
  border-radius: 12px;
  font-size: 0.95rem;
`

export const EmptyMessage = styled.div<{ $isDark?: boolean }>`
  padding: 3rem;
  text-align: center;
  color: ${({ $isDark }) => ($isDark ? '#94a3b8' : theme.colors.gray[500])};
  font-size: 0.95rem;
`
