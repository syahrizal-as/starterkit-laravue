import api from './api'

export interface Role {
  id: number
  name: string
  guard_name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
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

export interface RoleParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export const roleService = {
  async getAll(params?: RoleParams): Promise<PaginatedResponse<Role>> {
    const response = await api.get('/roles', { params })
    return response.data
  },

  async getList(): Promise<{ success: boolean; data: Array<{ id: number; name: string }> }> {
    const response = await api.get('/roles/list')
    return response.data
  },

  async getById(id: number): Promise<{ success: boolean; data: Role }> {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  async create(data: { name: string; permissions?: number[] }): Promise<{ success: boolean; message: string; data: Role }> {
    const response = await api.post('/roles', data)
    return response.data
  },

  async update(id: number, data: { name: string; permissions?: number[] }): Promise<{ success: boolean; message: string; data: Role }> {
    const response = await api.put(`/roles/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  },

  async assignPermissions(id: number, permissions: number[]): Promise<{ success: boolean; message: string; data: Role }> {
    const response = await api.post(`/roles/${id}/assign-permissions`, { permissions })
    return response.data
  },
}

export default roleService
