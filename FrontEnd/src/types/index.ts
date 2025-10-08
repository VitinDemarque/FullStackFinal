// ============================================
// MODELS (Types/Interfaces) - Camada Model
// ============================================

export interface User {
  id: string
  name: string
  email: string
  handle: string
  collegeId?: string | null
  level: number
  xpTotal: number
  avatarUrl?: string | null
  bio?: string | null
  role: 'USER' | 'ADMIN'
}

export interface College {
  id: string
  name: string
  acronym?: string
  city?: string
  state?: string
}

export interface Exercise {
  id: string
  authorUserId: string
  languageId?: string | null
  title: string
  description?: string
  difficulty: number
  baseXp: number
  isPublic: boolean
  codeTemplate: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  iconUrl?: string
}

export interface Title {
  id: string
  name: string
  description?: string
  minLevel?: number
  minXp?: number
}

export interface UserBadge {
  id: string
  name: string
  iconUrl?: string
  awardedAt: string
}

export interface UserTitle {
  id: string
  name: string
  awardedAt: string
}

export interface UserStats {
  userId: string
  exercisesCreatedCount: number
  exercisesSolvedCount: number
  lastUpdatedAt?: string | null
}

export interface PublicProfile {
  user: User
  badges: UserBadge[]
  titles: UserTitle[]
  scoreboard: {
    created: number
    solved: number
  }
  exercises: Exercise[]
}

// Auth
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  handle: string
  collegeId?: string
}

export interface AuthResponse {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

// API Response
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ApiError {
  message: string
  statusCode: number
  details?: unknown
}
