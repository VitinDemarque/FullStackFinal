import { apiRequest } from './api'
import type { College, PaginatedResponse } from '../types'

function getMockColleges(): PaginatedResponse<College> {
  return {
    items: [
      { id: '1', name: 'Faculdade de Minas', acronym: 'FAMINAS', city: 'Muriaé', state: 'MG' },
      { id: '2', name: 'Universidade de São Paulo', acronym: 'USP', city: 'São Paulo', state: 'SP' },
      { id: '3', name: 'Universidade Federal do Rio de Janeiro', acronym: 'UFRJ', city: 'Rio de Janeiro', state: 'RJ' },
      { id: '4', name: 'Universidade Estadual de Campinas', acronym: 'UNICAMP', city: 'Campinas', state: 'SP' },
      { id: '5', name: 'Universidade Federal de Minas Gerais', acronym: 'UFMG', city: 'Belo Horizonte', state: 'MG' },
      { id: '6', name: 'Pontifícia Universidade Católica', acronym: 'PUC-SP', city: 'São Paulo', state: 'SP' },
      { id: '7', name: 'Universidade Federal de São Paulo', acronym: 'UNIFESP', city: 'São Paulo', state: 'SP' },
      { id: '8', name: 'Universidade Federal do Paraná', acronym: 'UFPR', city: 'Curitiba', state: 'PR' },
      { id: '9', name: 'Universidade Federal de Santa Catarina', acronym: 'UFSC', city: 'Florianópolis', state: 'SC' },
      { id: '10', name: 'Universidade Federal do Rio Grande do Sul', acronym: 'UFRGS', city: 'Porto Alegre', state: 'RS' },
      { id: '11', name: 'Universidade de Brasília', acronym: 'UnB', city: 'Brasília', state: 'DF' },
      { id: '12', name: 'Universidade Federal da Bahia', acronym: 'UFBA', city: 'Salvador', state: 'BA' },
      { id: '13', name: 'Universidade Federal de Pernambuco', acronym: 'UFPE', city: 'Recife', state: 'PE' },
      { id: '14', name: 'Universidade Federal do Ceará', acronym: 'UFC', city: 'Fortaleza', state: 'CE' },
      { id: '15', name: 'Instituto Federal de Minas Gerais', acronym: 'IFMG', city: 'Belo Horizonte', state: 'MG' },
    ],
    meta: {
      page: 1,
      limit: 100,
      total: 15,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }
}

export const collegesService = {
  async getAll(page = 1, limit = 100): Promise<PaginatedResponse<College>> {
    try {
      const response = await apiRequest<PaginatedResponse<College>>('GET', '/colleges', undefined, {
        params: { page, limit },
      })

      if (response && response.items && response.items.length > 0) {
        return response
      }

      return getMockColleges()

    } catch (error) {
      return getMockColleges()
    }
  },

  async getById(id: string): Promise<College> {
    return apiRequest<College>('GET', `/colleges/${id}`)
  },

  async create(data: Partial<College>): Promise<College> {
    return apiRequest<College>('POST', '/colleges', data)
  },

  async search(q: string, limit = 10): Promise<PaginatedResponse<College>> {
    try {
      const response = await apiRequest<PaginatedResponse<College>>('GET', '/colleges', undefined, {
        params: { q, page: 1, limit },
      })
      if (response && response.items) return response
      return getMockColleges()
    } catch (error) {
      // Fallback: filtra o mock localmente
      const mock = getMockColleges()
      const term = (q || '').trim().toLowerCase()
      const filtered = mock.items.filter((c) =>
        c.name.toLowerCase().includes(term) || (c.acronym || '').toLowerCase().includes(term)
      )
      return { ...mock, items: filtered, meta: { ...mock.meta, total: filtered.length } }
    }
  },
}
