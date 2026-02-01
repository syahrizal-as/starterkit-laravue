import api from './api'

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

export interface PermissionParams {
  search?: string
  group?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export const permissionService = {
  async getAll(params?: PermissionParams): Promise<PaginatedResponse<Permission>> {
    const response = await api.get('/permissions', { params })
    return response.data
  },

  async getList(): Promise<{ success: boolean; data: Array<{ id: number; name: string }> }> {
    const response = await api.get('/permissions/list')
    return response.data
  },

  async getGrouped(): Promise<{ success: boolean; data: Record<string, Permission[]> }> {
    const response = await api.get('/permissions/grouped')
    return response.data
  },

  async getById(id: number): Promise<{ success: boolean; data: Permission }> {
    const response = await api.get(`/permissions/${id}`)
    return response.data
  },

  async create(data: { name: string }): Promise<{ success: boolean; message: string; data: Permission }> {
    const response = await api.post('/permissions', data)
    return response.data
  },

  async bulkCreate(permissions: string[]): Promise<{ success: boolean; message: string; data: { created: Permission[]; skipped: string[] } }> {
    const response = await api.post('/permissions/bulk', { permissions })
    return response.data
  },

  async update(id: number, data: { name: string }): Promise<{ success: boolean; message: string; data: Permission }> {
    const response = await api.put(`/permissions/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/permissions/${id}`)
    return response.data
  },
}

export default permissionService
