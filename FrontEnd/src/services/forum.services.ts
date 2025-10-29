import { apiRequest } from './api'
import type { Forum, PaginatedResponse } from '@/types/forum'

export interface ForumFilters {
  page?: number
  limit?: number
  termo?: string
}

const BASE_URL = '/forum/foruns';

export const forunsService = {
  async listarPublicos(filters?: ForumFilters): Promise<PaginatedResponse<Forum>> {
    return apiRequest<PaginatedResponse<Forum>>('GET', `${BASE_URL}/publicos`, undefined, {
      params: filters,
    })
  },

  async listarAleatorios(): Promise<Forum[]> {
    return apiRequest<Forum[]>('GET', `${BASE_URL}/aleatorios`)
  },

  async pesquisar(termo: string, filters?: ForumFilters): Promise<PaginatedResponse<Forum>> {
    return apiRequest<PaginatedResponse<Forum>>('GET',  `${BASE_URL}/pesquisar`, undefined, {
      params: { termo, ...filters },
    })
  },

  async obterPorId(id: string): Promise<Forum> {
    return apiRequest<Forum>('GET', `${BASE_URL}/${id}`)
  },

  async criar(data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('POST', `${BASE_URL}`, data)
  },

  async atualizar(id: string, data: Partial<Forum>): Promise<Forum> {
    return apiRequest<Forum>('PATCH', `${BASE_URL}/${id}`, data)
  },

  async excluir(id: string): Promise<void> {
    return apiRequest<void>('DELETE', `${BASE_URL}/${id}`)
  },
}