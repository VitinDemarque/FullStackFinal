import { apiRequest } from './api'

export interface Title {
  _id: string
  name: string
  description?: string | null
  minLevel?: number | null
  minXp?: number | null
}

export interface UserTitle {
  title: Title | string
  awardedAt?: string
  active: boolean
}

export const titlesService = {
  async listAll(): Promise<{ items: Title[]; total: number }> {
    return apiRequest('GET', '/titles')
  },

  async getUserTitles(userId: string): Promise<UserTitle[]> {
    try {
      const response = await apiRequest<any>('GET', `/users/${userId}/titles`)
      return response.data || response
    } catch (error) {
      return []
    }
  },
}