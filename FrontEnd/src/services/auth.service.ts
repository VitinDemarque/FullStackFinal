import { apiRequest } from './api'
import { userService } from './user.service'
import type { LoginCredentials, SignupData, AuthResponse, User } from '../types/index'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('POST', '/auth/login', credentials)
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)
    // Atualiza streak de login após autenticar
    try { await userService.pingLoginStreak() } catch {}
    return response
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('POST', '/auth/signup', data)
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)
    return response
  },

  logout(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken')
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('GET', '/users/me')
  },

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('POST', '/auth/google', { idToken })

    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)

    return response
  },
}