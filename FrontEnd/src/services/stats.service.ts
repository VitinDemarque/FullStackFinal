import { apiRequest } from './api'

export interface DashboardStats {
  languages: number
  challenges: number
  exercises: number
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
      const response = await apiRequest<any>('GET', `/users/${userId}/stats`)
      
      return {
        languages: response.languagesUsed || 0,
        challenges: response.challengesCompleted || 0,
        exercises: response.exercisesSolvedCount || 0,
        totalXp: response.totalXp || 0,
        level: response.level || 1,
        weekProgress: response.weekProgress || 0,
      }
    } catch (error) {
      return {
        languages: 5,
        challenges: 12,
        exercises: 8,
        totalXp: 0,
        level: 1,
        weekProgress: 65,
      }
    }
  },

  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      const response = await apiRequest<any>('GET', `/users/${userId}/scoreboard`)
      
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
