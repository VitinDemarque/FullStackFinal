import { useEffect, useState } from 'react'
import { rankingService } from '@/services/ranking.service'
import type { RankingResult, RankingEntry, UserPosition } from '@/services/ranking.service'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { FaTrophy, FaMedal, FaAward, FaClock, FaCode } from 'react-icons/fa'
import * as S from '@/styles/components/ExerciseRanking'

interface ExerciseRankingProps {
  exerciseId: string
  limit?: number
  showMyPosition?: boolean
}

export default function ExerciseRanking({
  exerciseId,
  limit = 10,
  showMyPosition = true,
}: ExerciseRankingProps) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ranking, setRanking] = useState<RankingResult | null>(null)
  const [myPosition, setMyPosition] = useState<UserPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRanking()
  }, [exerciseId, limit])

  const loadRanking = async () => {
    try {
      setLoading(true)
      setError(null)

      const [rankingData, positionData] = await Promise.all([
        rankingService.getExerciseRanking(exerciseId, {
          limit,
          populateUser: true,
        }),
        showMyPosition && user
          ? rankingService.getMyPosition(exerciseId).catch(() => null)
          : Promise.resolve(null),
      ])

      setRanking(rankingData)
      setMyPosition(positionData)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar ranking')
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar ranking:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <FaTrophy style={{ color: '#FFD700' }} />
    if (position === 2) return <FaMedal style={{ color: '#C0C0C0' }} />
    if (position === 3) return <FaMedal style={{ color: '#CD7F32' }} />
    return <FaAward />
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  if (loading) {
    return (
      <S.RankingContainer $isDark={isDark}>
        <S.RankingHeader $isDark={isDark}>
          <h3>Ranking</h3>
        </S.RankingHeader>
        <S.LoadingMessage $isDark={isDark}>Carregando ranking...</S.LoadingMessage>
      </S.RankingContainer>
    )
  }

  if (error) {
    return (
      <S.RankingContainer $isDark={isDark}>
        <S.RankingHeader $isDark={isDark}>
          <h3>Ranking</h3>
        </S.RankingHeader>
        <S.ErrorMessage $isDark={isDark}>{error}</S.ErrorMessage>
      </S.RankingContainer>
    )
  }

  if (!ranking || ranking.entries.length === 0) {
    return (
      <S.RankingContainer $isDark={isDark}>
        <S.RankingHeader $isDark={isDark}>
          <h3>Ranking</h3>
        </S.RankingHeader>
        <S.EmptyMessage $isDark={isDark}>
          Ainda não há submissões aceitas para este exercício.
        </S.EmptyMessage>
      </S.RankingContainer>
    )
  }

  return (
    <S.RankingContainer $isDark={isDark}>
      <S.RankingHeader $isDark={isDark}>
        <h3>Ranking</h3>
        {ranking.totalEntries > limit && (
          <S.TotalEntries $isDark={isDark}>
            Mostrando {limit} de {ranking.totalEntries}
          </S.TotalEntries>
        )}
      </S.RankingHeader>

      {myPosition && myPosition.hasSubmission && (
        <S.MyPositionBadge $isDark={isDark}>
          <FaCode /> Sua posição: <strong>#{myPosition.position}</strong>
        </S.MyPositionBadge>
      )}

      <S.RankingList>
        {ranking.entries.map((entry) => (
          <S.RankingEntry
            key={entry.submissionId}
            $isCurrentUser={user?.id === entry.userId}
            $isTopThree={entry.position <= 3}
            $isDark={isDark}
          >
            <S.PositionCell>
              <S.PositionIcon>{getPositionIcon(entry.position)}</S.PositionIcon>
              <S.PositionNumber $isDark={isDark} $position={entry.position}>
                #{entry.position}
              </S.PositionNumber>
            </S.PositionCell>

            <S.UserCell>
              <S.UserName $isDark={isDark}>
                {entry.userName || `Usuário ${entry.userId.slice(0, 8)}`}
                {user?.id === entry.userId && <S.YouBadge> (Você)</S.YouBadge>}
              </S.UserName>
            </S.UserCell>

            <S.ScoreCell>
              <S.ScoreValue $isDark={isDark}>{entry.finalScore.toFixed(1)}</S.ScoreValue>
              <S.ScoreBreakdown $isDark={isDark}>
                <span>Testes: {entry.testScore.toFixed(1)}</span>
                {entry.bonusPoints > 0 && (
                  <span>+ Bônus: {entry.bonusPoints.toFixed(1)}</span>
                )}
              </S.ScoreBreakdown>
            </S.ScoreCell>

            <S.MetricsCell>
              <S.Metric $isDark={isDark}>
                <FaCode /> {entry.complexityScore.toFixed(0)}
              </S.Metric>
              <S.Metric $isDark={isDark}>
                <FaClock /> {formatTime(entry.timeSpentMs)}
              </S.Metric>
            </S.MetricsCell>
          </S.RankingEntry>
        ))}
      </S.RankingList>
    </S.RankingContainer>
  )
}

