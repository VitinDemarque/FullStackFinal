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

  async getById(id: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `/forum/foruns/${id}`)
  },

  async criar(data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('POST', '/forum/foruns', data)
  },

  async atualizar(id: string, data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('PATCH', `/forum/foruns/${id}`, data)
  },

  async excluir(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `/forum/foruns/${id}`)
  },
}