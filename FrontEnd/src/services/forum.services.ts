import { apiRequest } from './api'
import type { Forum } from '@/types/forum'

export interface ForumFilters {
  page?: number
  limit?: number
  termo?: string
}

export const forunsService = {
  async listarPublicos(): Promise<Forum[]> {
    return apiRequest<Forum[]>('GET', '/forum/foruns')
  },

  async listarMeus(): Promise<Forum[]> {
    return apiRequest<Forum[]>('GET', '/forum/meus')
  },

  async getById(id: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `/forum/${id}`)
  },

  async getByExerciseId(exerciseId: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `/forum/exercise/${exerciseId}`)
  },

  async getByExerciseCode(exerciseCode: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `/forum/exercise/${exerciseCode}`)
  },

  async criar(data: Partial<Forum> & { exerciseCode?: string; exerciseId?: string }): Promise<Forum> {
    return apiRequest<Forum>('POST', '/forum/', data)
  },

  async atualizar(id: string, data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('PATCH', `/forum/${id}`, data)
  },

  async excluir(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `/forum/${id}`)
  },

  async participar(id: string): Promise<Forum> {
    return apiRequest<Forum>('POST', `/forum/${id}/participar`)
  }
}