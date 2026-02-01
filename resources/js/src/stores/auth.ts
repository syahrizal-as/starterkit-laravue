import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type User, type LoginCredentials, type RegisterData } from '@/services/authService'
import { router } from '@/plugins/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRoles = computed(() => user.value?.roles?.map(r => r.name) || [])
  const userPermissions = computed(() => user.value?.permissions?.map(p => p.name) || [])
  
  // Check if user is super-admin
  const isSuperAdmin = computed(() => userRoles.value.includes('super-admin'))

  // Check if user has a specific role
  const hasRole = (role: string) => userRoles.value.includes(role)
  
  // Check if user has a specific permission (super-admin has all permissions)
  const hasPermission = (permission: string) => {
    // if (isSuperAdmin.value) return true
    return userPermissions.value.includes(permission)
  }
  
  // Check if user has any of the given roles
  const hasAnyRole = (roles: string[]) => roles.some(role => hasRole(role))
  
  // Check if user has any of the given permissions
  const hasAnyPermission = (permissions: string[]) => {
    // if (isSuperAdmin.value) return true
    return permissions.some(perm => userPermissions.value.includes(perm))
  }

  // Check if user has all of the given permissions
  const hasAllPermissions = (permissions: string[]) => {
    // if (isSuperAdmin.value) return true
    return permissions.every(perm => userPermissions.value.includes(perm))
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        token.value = response.data.access_token
        user.value = response.data.user
        
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        router.push('/')
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.register(data)
      
      if (response.success) {
        token.value = response.data.access_token
        user.value = response.data.user
        
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        router.push('/')
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    
    try {
      await authService.logout()
    } catch (err) {
      // Ignore logout errors
    } finally {
      token.value = null
      user.value = null
      
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      loading.value = false
      router.push('/login')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    loading.value = true
    
    try {
      const response = await authService.me()
      
      if (response.success) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    } catch (err) {
      // Token might be invalid
      await logout()
    } finally {
      loading.value = false
    }
  }

  function initialize() {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken) {
      token.value = storedToken
      
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch {
          user.value = null
        }
      }
      
      // Verify token by fetching user
      fetchUser()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRoles,
    userPermissions,
    isSuperAdmin,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
    login,
    register,
    logout,
    fetchUser,
    initialize,
  }
})
