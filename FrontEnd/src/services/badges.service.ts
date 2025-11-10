import { apiRequest } from './api'

export interface Badge {
  _id: string
  name: string
  description: string
  icon?: string
  type: 'gold' | 'silver' | 'bronze' | 'special'
  requirement?: string
  isTriumphant?: boolean
  linkedExerciseId?: string | null
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
}

export interface UserBadge {
  badge: Badge | string
  awardedAt: string
}

export const badgesService = {
  async getAll(): Promise<Badge[]> {
    try {
      const response = await apiRequest<any>('GET', '/badges')
      const data = response?.data ?? response
      if (Array.isArray(data)) return data
      if (Array.isArray(data?.data)) return data.data
      if (Array.isArray(data?.results)) return data.results
      return []
    } catch (error) {
      return createMockBadges()
    }
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const response = await apiRequest<any>('GET', `/users/${userId}/badges`)
      return response.data || response
    } catch (error) {
      return []
    }
  },

  async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    try {
      const response = await apiRequest<any>('POST', `/users/${userId}/badges/check`)
      return response.data || response
    } catch (error) {
      return []
    }
  },

  async create(data: { name: string; description?: string; iconUrl?: string; isTriumphant?: boolean; linkedExerciseId?: string | null; rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' }): Promise<Badge> {
    const response = await apiRequest<any>('POST', '/badges', data)
    const created = response?.data ?? response
    // normalize backend badge to frontend Badge shape
    return {
      _id: String(created._id ?? created.id),
      name: created.name,
      description: created.description ?? '',
      icon: created.iconUrl ?? created.icon ?? undefined,
      type: 'special',
      requirement: created.requirement ?? undefined,
      isTriumphant: Boolean(created.isTriumphant ?? false),
      linkedExerciseId: created.linkedExerciseId ?? null,
      rarity: created.rarity ?? data.rarity
    }
  }
}

function createMockBadges(): Badge[] {
  return [
    { _id: '1', name: 'Primeiro Desafio', description: 'Complete seu primeiro desafio', type: 'bronze', requirement: '1 desafio' },
    { _id: '2', name: '10 Desafios', description: 'Complete 10 desafios', type: 'silver', requirement: '10 desafios' },
    { _id: '3', name: '50 Desafios', description: 'Complete 50 desafios', type: 'gold', requirement: '50 desafios' },
    { _id: '4', name: 'Streak 7 dias', description: 'Pratique 7 dias seguidos', type: 'special', requirement: '7 dias consecutivos' },
    { _id: '5', name: '100 Desafios', description: 'Complete 100 desafios', type: 'gold', requirement: '100 desafios' },
    { _id: '6', name: 'Mestre Python', description: 'Domine Python', type: 'gold', requirement: '50 desafios Python' },
    { _id: '7', name: 'JavaScript Pro', description: 'Expert em JavaScript', type: 'silver', requirement: '50 desafios JS' },
    { _id: '8', name: '500 XP', description: 'Alcance 500 XP', type: 'bronze', requirement: '500 XP' },
    { _id: '9', name: 'Top 100', description: 'Entre no top 100', type: 'special', requirement: 'Top 100 ranking' },
    { _id: '10', name: '1000 XP', description: 'Alcance 1000 XP', type: 'silver', requirement: '1000 XP' },
    { _id: '11', name: 'Speed Runner', description: 'Complete em tempo recorde', type: 'gold', requirement: 'Tempo < 5min' },
    { _id: '12', name: 'Perfect Score', description: 'Nota 100% em desafio', type: 'silver', requirement: '100% score' },
    { _id: '13', name: 'Code Master', description: 'Domine as estruturas', type: 'bronze', requirement: '30 desafios' },
    { _id: '14', name: 'Team Player', description: 'Participe de grupos', type: 'bronze', requirement: 'Entre em 1 grupo' },
    { _id: '15', name: 'Bug Hunter', description: 'Encontre e corrija bugs', type: 'bronze', requirement: '10 bugs corrigidos' },
    { _id: '16', name: 'Algorithm Expert', description: 'Expert em algoritmos', type: 'silver', requirement: '20 algoritmos' },
    { _id: '17', name: 'Database Guru', description: 'Mestre em bancos de dados', type: 'gold', requirement: '15 BD desafios' },
    { _id: '18', name: 'API Master', description: 'Expert em APIs', type: 'gold', requirement: '25 APIs criadas' },
  ]
}
