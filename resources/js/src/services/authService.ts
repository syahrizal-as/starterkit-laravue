import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  roles: Array<{ id: number; name: string }>
  permissions: Array<{ id: number; name: string }>
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    access_token: string
    token_type: string
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<{ success: boolean; data: { user: User; roles: string[]; permissions: string[] } }> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refresh(): Promise<{ success: boolean; data: { access_token: string; token_type: string } }> {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

export default authService
