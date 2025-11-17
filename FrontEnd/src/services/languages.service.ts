import { apiRequest } from './api'

export interface Language {
  id: string
  name: string
  slug: string
}

export interface LanguagesResponse {
  items: Language[]
  total: number
}

const languagesService = {
  async getAll(): Promise<Language[]> {
    const response = await apiRequest<LanguagesResponse>('GET', '/languages', undefined, {
      params: { page: 1, limit: 100 }
    })
    return response?.items || []
  },

  async getById(id: string): Promise<Language> {
    return apiRequest<Language>('GET', `/languages/${id}`)
  }
}

export default languagesService

