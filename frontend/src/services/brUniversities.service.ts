import { apiRequest } from './api'

export type BRUniversity = {
  id: string
  name: string
  acronym?: string
  city?: string
  state?: string
}

export const brUniversitiesService = {
  async search(q = '', limit = 10, state?: string, city?: string): Promise<{ items: BRUniversity[] }> {
    const res = await apiRequest<{ items: BRUniversity[] }>('GET', '/br-universities', undefined, {
      params: { q, limit, state, city }
    })
    return res
  }
}