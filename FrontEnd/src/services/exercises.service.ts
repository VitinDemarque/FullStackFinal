import { apiRequest } from './api'
import type { Exercise, PaginatedResponse } from '../types'

export interface ExerciseFilters {
  page?: number
  limit?: number
  difficulty?: number
  languageId?: string
  isPublic?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export const exercisesService = {
  async getAll(filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> {
    return apiRequest<PaginatedResponse<Exercise>>('GET', '/exercises', undefined, {
      params: filters,
    })
  },

  async getById(id: string): Promise<Exercise> {
    return apiRequest<Exercise>('GET', `/exercises/${id}`)
  },

  async getRecommendations(limit = 6): Promise<Exercise[]> {
    const response = await apiRequest<PaginatedResponse<Exercise>>(
      'GET',
      '/exercises',
      undefined,
      {
        params: {
          isPublic: true,
          status: 'PUBLISHED',
          limit,
          page: 1,
        },
      }
    )
    return response.items
  },

  async create(data: Partial<Exercise>): Promise<Exercise> {
    return apiRequest<Exercise>('POST', '/exercises', data)
  },

  async update(id: string, data: Partial<Exercise>): Promise<Exercise> {
    return apiRequest<Exercise>('PATCH', `/exercises/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `/exercises/${id}`)
  },

  async getMine(filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> {
    return apiRequest<PaginatedResponse<Exercise>>('GET', '/exercises/mine', undefined, {
      params: filters,
    })
  },

  async getCommunityChallenges(filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> {
    return apiRequest<PaginatedResponse<Exercise>>('GET', '/exercises/community', undefined, {
      params: filters,
    })
  },
}
