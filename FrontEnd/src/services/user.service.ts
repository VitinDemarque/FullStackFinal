import { apiRequest } from './api'
import type { User, PublicProfile, UserStats } from '@types/index'

export const userService = {
  async getMe(): Promise<User> {
    return apiRequest<User>('GET', '/users/me')
  },

  async updateMe(data: Partial<User>): Promise<User> {
    return apiRequest<User>('PATCH', '/users/me', data)
  },

  async getById(id: string): Promise<User> {
    return apiRequest<User>('GET', `/users/${id}`)
  },

  async getPublicProfile(id: string, page = 1, limit = 20): Promise<PublicProfile> {
    return apiRequest<PublicProfile>('GET', `/users/${id}/profile`, undefined, {
      params: { page, limit },
    })
  },

  async getScoreboard(id: string): Promise<{ created: number; solved: number }> {
    return apiRequest<{ created: number; solved: number }>('GET', `/users/${id}/scoreboard`)
  },
}
