// ============================================
// USER SERVICE - Controller layer
// Handles user API calls
// ============================================

import { apiRequest } from './api'
import type { User, PublicProfile, UserStats } from '@types/index'

export const userService = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    return apiRequest<User>('GET', '/users/me')
  },

  /**
   * Update current user profile
   */
  async updateMe(data: Partial<User>): Promise<User> {
    return apiRequest<User>('PATCH', '/users/me', data)
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return apiRequest<User>('GET', `/users/${id}`)
  },

  /**
   * Get public profile
   */
  async getPublicProfile(id: string, page = 1, limit = 20): Promise<PublicProfile> {
    return apiRequest<PublicProfile>('GET', `/users/${id}/profile`, undefined, {
      params: { page, limit },
    })
  },

  /**
   * Get user scoreboard
   */
  async getScoreboard(id: string): Promise<{ created: number; solved: number }> {
    return apiRequest<{ created: number; solved: number }>('GET', `/users/${id}/scoreboard`)
  },
}
