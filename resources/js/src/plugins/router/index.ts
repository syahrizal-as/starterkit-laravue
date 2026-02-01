import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const isAuthenticated = !!token
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  
  // Redirect authenticated users away from guest pages (login/register)
  if (to.meta.guest && isAuthenticated) {
    return next({ name: 'dashboard' })
  }
  
  // Check for permission if specified
  if (to.meta.permission && isAuthenticated) {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        const userPermissions = user.permissions?.map((p: any) => p.name) || []
        const userRoles = user.roles?.map((r: any) => r.name) || []
        
        // Super-admin has all permissions
        if (!userRoles.includes('super-admin')) {
          if (!userPermissions.includes(to.meta.permission)) {
            // User doesn't have permission, redirect to dashboard
            return next({ name: 'dashboard' })
          }
        }
      } catch {
        // If we can't parse user, continue anyway
      }
    }
  }
  
  next()
})

export default function (app: App) {
  app.use(router)
}

export { router }
