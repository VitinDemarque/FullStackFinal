import styled from 'styled-components'

export const RankingContainer = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`

export const RankingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }
`

export const TotalEntries = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`

export const MyPositionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text);

  strong {
    color: var(--color-primary);
    font-weight: 600;
  }
`

export const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RankingEntry = styled.div<{ $isCurrentUser?: boolean; $isTopThree?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: ${(props) =>
    props.$isCurrentUser
      ? 'var(--color-primary-light)'
      : props.$isTopThree
      ? 'var(--color-surface-elevated)'
      : 'var(--color-surface)'};
  border: 1px solid
    ${(props) =>
      props.$isCurrentUser
        ? 'var(--color-primary)'
        : props.$isTopThree
        ? 'var(--color-border-hover)'
        : 'var(--color-border)'};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const PositionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
`

export const PositionIcon = styled.span`
  font-size: 1.25rem;
`

export const PositionNumber = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
`

export const UserCell = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const UserName = styled.div`
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const YouBadge = styled.span`
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875rem;
`

export const ScoreCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120px;
`

export const ScoreValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
`

export const ScoreBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;

  span {
    white-space: nowrap;
  }
`

export const MetricsCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 100px;
`

export const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);

  svg {
    font-size: 0.875rem;
  }
`

export const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
`

export const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-error);
  background: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: 8px;
`

export const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
`

