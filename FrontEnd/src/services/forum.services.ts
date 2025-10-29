import { apiRequest } from './api'
import type { Forum, PaginatedResponse } from '@/types/forum'

export interface ForumFilters {
  page?: number
  limit?: number
  termo?: string
}

export const forunsService = {
  async listarPublicos(filters?: ForumFilters): Promise<PaginatedResponse<Forum>> {
    return apiRequest<PaginatedResponse<Forum>>('GET', '/foruns/publicos', undefined, {
      params: filters,
    })
  },

  async listarAleatorios(): Promise<Forum[]> {
    return apiRequest<Forum[]>('GET', '/foruns/aleatorios')
  },

  async pesquisar(termo: string, filters?: ForumFilters): Promise<PaginatedResponse<Forum>> {
    return apiRequest<PaginatedResponse<Forum>>('GET', '/foruns/pesquisar', undefined, {
      params: { termo, ...filters },
    })
  },

  async obterPorId(id: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `/foruns/${id}`)
  },

  async criar(data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('POST', '/foruns', data)
  },

  async atualizar(id: string, data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('PATCH', `/foruns/${id}`, data)
  },

  async excluir(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `/foruns/${id}`)
  },
}