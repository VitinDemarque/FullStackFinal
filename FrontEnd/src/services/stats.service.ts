import { apiRequest } from './api'

export interface DashboardStats {
  languages: number
  challenges: number
  forumsCreated: number
  totalXp: number
  level: number
  weekProgress: number
}

export interface UserProgress {
  exercisesSolved: number
  exercisesCreated: number
  totalSubmissions: number
  successRate: number
  averageScore: number
  streak: number
}

export const statsService = {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const response = await apiRequest<any>('GET', `/stats/users/${userId}`)

      return {
        languages: response.languagesUsed || 0,
        challenges: response.publishedChallenges || 0,
        forumsCreated: response.forumsCreated || 0,
        totalXp: response.totalXp || 0,
        level: response.level || 1,
        weekProgress: response.weekProgress || 0,
      }
    } catch (error) {
      return {
        languages: 0,
        challenges: 0,
        forumsCreated: 0,
        totalXp: 0,
        level: 1,
        weekProgress: 0,
      }
    }
  },

  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      const response = await apiRequest<any>('GET', `/stats/users/${userId}`)

      return {
        exercisesSolved: response.solved || 0,
        exercisesCreated: response.created || 0,
        totalSubmissions: response.totalSubmissions || 0,
        successRate: response.successRate || 0,
        averageScore: response.averageScore || 0,
        streak: response.streak || 0,
      }
    } catch (error) {
      return {
        exercisesSolved: 0,
        exercisesCreated: 0,
        totalSubmissions: 0,
        successRate: 0,
        averageScore: 0,
        streak: 0,
      }
    }
  },
}
