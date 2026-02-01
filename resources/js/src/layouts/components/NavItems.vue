<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import { menuService, type Menu } from '@/services/menuService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Dynamic menus
const menus = ref<Menu[]>([])
const loading = ref(true)

// Fetch user menus
const fetchMenus = async () => {
  if (!authStore.isAuthenticated) return
  
  loading.value = true
  try {
    const response = await menuService.getUserMenus()
    menus.value = response.data
  } catch (error) {
    console.error('Failed to load menus:', error)
    // Fallback to empty if API fails
    menus.value = []
  } finally {
    loading.value = false
  }
}

// Check if user has permission (super-admin already handled in store)
const hasPermission = (permission: string | null | string[]) => {
  // No permission required
  if (!permission) return true
  
  // Handle array of permissions (user must have at least one)
  if (Array.isArray(permission)) {
    if (permission.length === 0) return true
    return authStore.hasAnyPermission(permission)
  }
  
  // Single permission check
  return authStore.hasPermission(permission)
}

// Build menu item for VerticalNavLink
const buildMenuItem = (menu: Menu) => {
  const item: any = {
    title: menu.title,
  }
  
  if (menu.icon) item.icon = menu.icon
  if (menu.to) item.to = menu.to
  if (menu.href) {
    item.href = menu.href
    item.target = menu.target || '_blank'
  }
  
  return item
}

// Build section item
const buildSectionItem = (menu: Menu) => ({
  heading: menu.title,
})

// Build group item
const buildGroupItem = (menu: Menu) => ({
  title: menu.title,
  icon: menu.icon,
})

// Watch for auth changes
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    fetchMenus()
  } else {
    menus.value = []
  }
})

// Watch for user changes (in case permissions updated)
watch(() => authStore.user, () => {
  if (authStore.isAuthenticated) {
    fetchMenus()
  }
}, { deep: true })

// Fetch on mount
onMounted(() => {
  fetchMenus()
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="pa-4">
    <VProgressLinear indeterminate color="primary" />
  </div>

  <!-- Dynamic menus -->
  <template v-else>
    <template v-for="menu in menus" :key="menu.id">
      <!-- Section Title -->
      <VerticalNavSectionTitle
        v-if="menu.is_section_title && hasPermission(menu.permission)"
        :item="buildSectionItem(menu)"
      />

      <!-- Group with children -->
      <VerticalNavGroup
        v-else-if="menu.children && menu.children.length > 0 && hasPermission(menu.permission)"
        :item="buildGroupItem(menu)"
      >
        <template v-for="child in menu.children" :key="child.id">
          <VerticalNavLink
            v-if="hasPermission(child.permission)"
            :item="buildMenuItem(child)"
          />
        </template>
      </VerticalNavGroup>

      <!-- Single link -->
      <VerticalNavLink
        v-else-if="(menu.to || menu.href) && hasPermission(menu.permission)"
        :item="buildMenuItem(menu)"
      />
    </template>
  </template>

  <!-- Fallback menus if empty -->
  <template v-if="!loading && menus.length === 0">
    <VerticalNavLink
      :item="{
        title: 'Dashboard',
        icon: 'bx-home-smile',
        to: '/dashboard',
      }"
    />

    <VerticalNavSectionTitle
      :item="{ heading: 'Settings' }"
    />

    <VerticalNavLink
      :item="{
        title: 'Account Settings',
        icon: 'bx-cog',
        to: '/account-settings',
      }"
    />
  </template>
</template>
