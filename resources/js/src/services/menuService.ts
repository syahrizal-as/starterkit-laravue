import api from './api'
import type { Role } from './roleService'

export interface Menu {
  id: number
  title: string
  icon: string | null
  to: string | null
  href: string | null
  target: string | null
  parent_id: number | null
  order: number
  is_section_title: boolean
  is_active: boolean
  permission: string | null
  roles: Role[]
  parent?: Menu
  children?: Menu[]
  created_at: string
  updated_at: string
}

export interface MenuParams {
  search?: string
  parent_id?: string | number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  perPage?: number
  page?: number
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

export interface CreateMenuData {
  title: string
  icon?: string
  to?: string
  href?: string
  target?: string
  parent_id?: number | null
  order?: number
  is_section_title?: boolean
  is_active?: boolean
  permission?: string
  roles?: number[]
}

export const menuService = {
  async getAll(params?: MenuParams): Promise<PaginatedResponse<Menu>> {
    const response = await api.get('/menus', { params })
    return response.data
  },

  async getTree(): Promise<{ success: boolean; data: Menu[] }> {
    const response = await api.get('/menus/tree')
    return response.data
  },

  async getUserMenus(): Promise<{ success: boolean; data: Menu[] }> {
    const response = await api.get('/menus/user')
    return response.data
  },

  async getList(): Promise<{ success: boolean; data: Array<{ id: number; title: string; parent_id: number | null }> }> {
    const response = await api.get('/menus/list')
    return response.data
  },

  async getById(id: number): Promise<{ success: boolean; data: Menu }> {
    const response = await api.get(`/menus/${id}`)
    return response.data
  },

  async create(data: CreateMenuData): Promise<{ success: boolean; message: string; data: Menu }> {
    const response = await api.post('/menus', data)
    return response.data
  },

  async update(id: number, data: CreateMenuData): Promise<{ success: boolean; message: string; data: Menu }> {
    const response = await api.put(`/menus/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/menus/${id}`)
    return response.data
  },

  async reorder(menus: Array<{ id: number; order: number }>): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/menus/reorder', { menus })
    return response.data
  },
}

export default menuService
