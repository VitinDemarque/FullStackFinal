// ============================================
// EXERCISES SERVICE - Gerenciamento de exercícios
// ============================================

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
  /**
   * Listar todos os exercícios (com filtros)
   */
  async getAll(filters?: ExerciseFilters): Promise<PaginatedResponse<Exercise>> {
    return apiRequest<PaginatedResponse<Exercise>>('GET', '/exercises', undefined, {
      params: filters,
    })
  },

  /**
   * Obter exercício por ID
   */
  async getById(id: string): Promise<Exercise> {
    return apiRequest<Exercise>('GET', `/exercises/${id}`)
  },

  /**
   * Obter recomendações de exercícios
   */
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

  /**
   * Criar novo exercício
   */
  async create(data: Partial<Exercise>): Promise<Exercise> {
    return apiRequest<Exercise>('POST', '/exercises', data)
  },

  /**
   * Atualizar exercício
   */
  async update(id: string, data: Partial<Exercise>): Promise<Exercise> {
    return apiRequest<Exercise>('PATCH', `/exercises/${id}`, data)
  },

  /**
   * Deletar exercício
   */
  async delete(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `/exercises/${id}`)
  },
}

