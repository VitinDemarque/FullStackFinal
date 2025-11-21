import { apiRequest } from './api'

export interface RankingEntry {
  position: number
  userId: string
  userName?: string
  submissionId: string
  finalScore: number
  complexityScore: number
  timeSpentMs: number
  testScore: number
  bonusPoints: number
  createdAt: string
}

export interface RankingResult {
  exerciseId: string
  totalEntries: number
  entries: RankingEntry[]
}

export interface UserPosition {
  exerciseId: string
  userId: string
  position: number
  hasSubmission: boolean
}

export const rankingService = {
  /**
   * Obtém o ranking completo de um exercício
   */
  async getExerciseRanking(
    exerciseId: string,
    options?: { limit?: number; populateUser?: boolean }
  ): Promise<RankingResult> {
    const params = new URLSearchParams()
    if (options?.limit) {
      params.append('limit', String(options.limit))
    }
    if (options?.populateUser) {
      params.append('populateUser', 'true')
    }

    const queryString = params.toString()
    const url = `/ranking/exercise/${exerciseId}${queryString ? `?${queryString}` : ''}`

    return apiRequest<RankingResult>('GET', url)
  },

  /**
   * Obtém a posição de um usuário específico no ranking
   */
  async getUserPosition(
    exerciseId: string,
    userId: string
  ): Promise<UserPosition> {
    return apiRequest<UserPosition>(
      'GET',
      `/ranking/exercise/${exerciseId}/position/${userId}`
    )
  },

  /**
   * Obtém a posição do usuário autenticado no ranking
   */
  async getMyPosition(exerciseId: string): Promise<UserPosition> {
    return apiRequest<UserPosition>(
      'GET',
      `/ranking/exercise/${exerciseId}/my-position`
    )
  }
}

