import api from './api'
import type { Role } from './roleService'

export interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  email_verified_at: string | null
  roles: Role[]
  permissions: Array<{ id: number; name: string }>
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface UserParams {
  search?: string
  role?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  roles?: number[]
}

export interface UpdateUserData {
  name: string
  email: string
  password?: string
  roles?: number[]
}

export const userService = {
  async getAll(params?: UserParams): Promise<PaginatedResponse<User>> {
    const response = await api.get('/users', { params })
    return response.data
  },

  async getById(id: number): Promise<{ success: boolean; data: User }> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(data: CreateUserData | FormData): Promise<{ success: boolean; message: string; data: User }> {
    const response = await api.post('/users', data)
    return response.data
  },

  async update(id: number, data: UpdateUserData | FormData): Promise<{ success: boolean; message: string; data: User }> {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      const response = await api.post(`/users/${id}`, data)
      return response.data
    }
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async assignRoles(id: number, roles: number[]): Promise<{ success: boolean; message: string; data: User }> {
    const response = await api.post(`/users/${id}/assign-roles`, { roles })
    return response.data
  },

  async getPermissions(id: number): Promise<{ success: boolean; data: { roles: string[]; permissions: string[] } }> {
    const response = await api.get(`/users/${id}/permissions`)
    return response.data
  },
}

export default userService
