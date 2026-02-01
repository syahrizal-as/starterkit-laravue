<script setup lang="ts">
import { menuService, type Menu } from '@/services/menuService'
import { permissionService } from '@/services/permissionService'
import MenuTreeItem from '@/components/MenuTreeItem.vue'

// Data
const menus = ref<Menu[]>([])
const permissions = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)

// Dialog
const dialogVisible = ref(false)
const dialogTitle = ref('Add Menu')
const isEdit = ref(false)
const selectedMenu = ref<Menu | null>(null)
const formLoading = ref(false)

// Delete dialog
const deleteDialogVisible = ref(false)
const menuToDelete = ref<Menu | null>(null)
const deleteLoading = ref(false)

// Form
const form = ref({
  title: '',
  icon: '',
  to: '',
  href: '',
  target: '_self',
  parent_id: null as number | null,
  order: 0,
  is_section_title: false,
  is_active: true,
  permission: null as string | null, // Single permission
})

// Search states
const permissionSearch = ref('')

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'primary',
})

// Target options
const targetOptions = [
  { title: 'Same Window', value: '_self' },
  { title: 'New Tab', value: '_blank' },
]

// Icon suggestions (boxicons)
const iconSuggestions = [
  'bx-home', 'bx-home-smile', 'bx-user', 'bx-cog', 'bx-shield', 'bx-key', 'bx-lock',
  'bx-file', 'bx-folder', 'bx-menu', 'bx-grid', 'bx-table', 'bx-layout', 'bx-text',
  'bx-package', 'bx-credit-card', 'bx-chart', 'bx-bar-chart', 'bx-envelope', 'bx-chat',
  'bx-calendar', 'bx-bell', 'bx-search', 'bx-plus', 'bx-edit', 'bx-trash', 'bx-check',
  'bx-x', 'bx-info-circle', 'bx-help-circle', 'bx-shield-quarter', 'bx-list-ul',
  'bx-briefcase', 'bx-building', 'bx-group', 'bx-user-circle', 'bx-map', 'bx-time',
  'bx-task', 'bx-note', 'bx-document', 'bx-archive', 'bx-badge-check', 'bx-support',
]

// Fetch menus as tree
const fetchMenus = async () => {
  loading.value = true
  try {
    const response = await menuService.getTree()
    menus.value = response.data
  } catch (error) {
    showSnackbar('Failed to load menus', 'error')
  } finally {
    loading.value = false
  }
}

// Fetch permissions
const fetchPermissions = async () => {
  try {
    const response = await permissionService.getList()
    permissions.value = response.data
  } catch (error) {
    console.error('Failed to load permissions')
  }
}

// Open add dialog
const openAddDialog = (parentId: number | null = null) => {
  dialogTitle.value = parentId ? 'Add Child Menu' : 'Add Menu'
  isEdit.value = false
  selectedMenu.value = null
  
  // Calculate next order
  let nextOrder = 0
  if (parentId) {
    const parent = findMenuById(menus.value, parentId)
    if (parent && parent.children) {
      nextOrder = parent.children.length + 1
    }
  } else {
    nextOrder = menus.value.length + 1
  }
  
  form.value = {
    title: '',
    icon: '',
    to: '',
    href: '',
    target: '_self',
    parent_id: parentId,
    order: nextOrder,
    is_section_title: false,
    is_active: true,
    permission: null,
  }
  permissionSearch.value = ''
  dialogVisible.value = true
}

// Find menu by ID recursively
const findMenuById = (menuList: Menu[], id: number): Menu | null => {
  for (const menu of menuList) {
    if (menu.id === id) return menu
    if (menu.children) {
      const found = findMenuById(menu.children, id)
      if (found) return found
    }
  }
  return null
}

// Open edit dialog
const openEditDialog = (menu: Menu) => {
  dialogTitle.value = 'Edit Menu'
  isEdit.value = true
  selectedMenu.value = menu
  
  form.value = {
    title: menu.title,
    icon: menu.icon || '',
    to: menu.to || '',
    href: menu.href || '',
    target: menu.target || '_self',
    parent_id: menu.parent_id,
    order: menu.order,
    is_section_title: menu.is_section_title,
    is_active: menu.is_active,
    permission: menu.permission || null,
  }
  permissionSearch.value = ''
  dialogVisible.value = true
}

// Save menu
const saveMenu = async () => {
  formLoading.value = true
  try {
    const data: any = { ...form.value }
    
    // Clean up empty strings to undefined
    if (!data.icon) data.icon = undefined
    if (!data.to) data.to = undefined
    if (!data.href) data.href = undefined
    if (!data.permission) data.permission = undefined
    
    if (isEdit.value && selectedMenu.value) {
      await menuService.update(selectedMenu.value.id, data)
      showSnackbar('Menu updated successfully', 'success')
    } else {
      await menuService.create(data)
      showSnackbar('Menu created successfully', 'success')
    }
    dialogVisible.value = false
    fetchMenus()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to save menu', 'error')
  } finally {
    formLoading.value = false
  }
}

// Confirm delete
const confirmDelete = (menu: Menu) => {
  menuToDelete.value = menu
  deleteDialogVisible.value = true
}

// Delete menu
const deleteMenu = async () => {
  if (!menuToDelete.value) return
  
  deleteLoading.value = true
  try {
    await menuService.delete(menuToDelete.value.id)
    showSnackbar('Menu deleted successfully', 'success')
    deleteDialogVisible.value = false
    fetchMenus()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to delete menu', 'error')
  } finally {
    deleteLoading.value = false
  }
}

// Show snackbar
const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
}

// Get permission color based on group
const getPermissionColor = (permName: string) => {
  if (permName.startsWith('user.')) return 'primary'
  if (permName.startsWith('role.')) return 'warning'
  if (permName.startsWith('permission.')) return 'error'
  if (permName.startsWith('menu.')) return 'info'
  if (permName.startsWith('dashboard.')) return 'success'
  if (permName.startsWith('settings.')) return 'secondary'
  return 'default'
}

// Get all flat menus for parent selection
const flatMenus = computed(() => {
  const result: Array<{ id: number; title: string; level: number }> = []
  
  const flatten = (menuList: Menu[], level: number = 0) => {
    for (const menu of menuList) {
      if (!menu.is_section_title) {
        result.push({
          id: menu.id,
          title: '—'.repeat(level) + ' ' + menu.title,
          level,
        })
        if (menu.children) {
          flatten(menu.children, level + 1)
        }
      }
    }
  }
  
  flatten(menus.value)
  return result
})

// Count total menus
const totalMenus = computed(() => {
  const count = (menuList: Menu[]): number => {
    let total = menuList.length
    for (const menu of menuList) {
      if (menu.children) {
        total += count(menu.children)
      }
    }
    return total
  }
  return count(menus.value)
})

// Initial fetch
onMounted(() => {
  fetchMenus()
  fetchPermissions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
        <div>
          <h4 class="text-h4">Menu Management</h4>
          <p class="text-body-1 mb-0">
            Manage navigation menus in tree structure
            <VChip v-if="totalMenus > 0" size="small" color="primary" variant="tonal" class="ms-2">
              {{ totalMenus }} menus
            </VChip>
          </p>
        </div>
        <VBtn
          color="primary"
          prepend-icon="bx-plus"
          @click="openAddDialog(null)"
        >
          Add Root Menu
        </VBtn>
      </VCardTitle>
    </VCard>

    <!-- Tree Card -->
    <VCard>
      <VCardText class="pa-6">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="48" />
          <p class="text-medium-emphasis mt-4">Loading menus...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="menus.length === 0" class="text-center py-8">
          <VIcon icon="bx-folder-open" size="64" color="secondary" class="mb-4" />
          <h5 class="text-h5 mb-2">No menus yet</h5>
          <p class="text-medium-emphasis mb-4">Create your first menu to get started</p>
          <VBtn color="primary" prepend-icon="bx-plus" @click="openAddDialog(null)">
            Add First Menu
          </VBtn>
        </div>

        <!-- Menu Tree -->
        <div v-else class="menu-tree">
          <MenuTreeItem
            v-for="menu in menus"
            :key="menu.id"
            :menu="menu"
            :level="0"
            @edit="openEditDialog"
            @delete="confirmDelete"
            @add-child="openAddDialog"
            @refresh="fetchMenus"
          />

          <!-- Add root menu at the end -->
          <div 
            class="add-root-menu d-flex align-center gap-2 py-3 px-3 rounded cursor-pointer text-primary mt-2"
            @click="openAddDialog(null)"
          >
            <VIcon icon="bx-plus-circle" size="20" color="primary" />
            <span class="text-body-2 font-weight-medium">Tambah Menu</span>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Add/Edit Dialog -->
    <VDialog
      v-model="dialogVisible"
      max-width="700"
      persistent
      scrollable
    >
      <VCard>
        <VCardTitle class="pa-6 d-flex align-center justify-space-between">
          <span>{{ dialogTitle }}</span>
          <VBtn icon variant="text" @click="dialogVisible = false">
            <VIcon icon="bx-x" />
          </VBtn>
        </VCardTitle>
        <VDivider />
        <VCardText style="max-height: 60vh;" class="pa-6">
          <VForm @submit.prevent="saveMenu">
            <VRow>
              <!-- Title -->
              <VCol cols="12" md="8">
                <VTextField
                  v-model="form.title"
                  label="Title *"
                  placeholder="Enter menu title"
                  :disabled="formLoading"
                  density="comfortable"
                />
              </VCol>

              <!-- Order -->
              <VCol cols="12" md="4">
                <VTextField
                  v-model.number="form.order"
                  label="Order"
                  type="number"
                  :disabled="formLoading"
                  density="comfortable"
                />
              </VCol>

              <!-- Menu Type -->
              <VCol cols="12">
                <VSwitch
                  v-model="form.is_section_title"
                  label="Section Title / Divider"
                  color="primary"
                  :disabled="formLoading"
                  hint="Enable this to create a section header (non-clickable)"
                  persistent-hint
                />
              </VCol>

              <VDivider class="my-2" />

              <!-- Icon -->
              <VCol cols="12" md="6" v-if="!form.is_section_title">
                <VAutocomplete
                  v-model="form.icon"
                  :items="iconSuggestions"
                  label="Icon"
                  placeholder="Select or type icon name"
                  clearable
                  :disabled="formLoading"
                  density="comfortable"
                >
                  <template #prepend-inner>
                    <VIcon v-if="form.icon" :icon="form.icon" />
                  </template>
                  <template #item="{ props, item }">
                    <VListItem v-bind="props">
                      <template #prepend>
                        <VIcon :icon="item.raw" class="me-2" />
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
              </VCol>

              <!-- Parent -->
              <VCol cols="12" :md="form.is_section_title ? 12 : 6">
                <VAutocomplete
                  v-model="form.parent_id"
                  :items="flatMenus.filter(m => m.id !== selectedMenu?.id)"
                  item-title="title"
                  item-value="id"
                  label="Parent Menu"
                  placeholder="Select parent (optional)"
                  clearable
                  :disabled="formLoading"
                  density="comfortable"
                  hint="Leave empty for root level menu"
                  persistent-hint
                />
              </VCol>

              <!-- Internal Route -->
              <VCol cols="12" md="6" v-if="!form.is_section_title">
                <VTextField
                  v-model="form.to"
                  label="Internal Route"
                  placeholder="/dashboard"
                  :disabled="formLoading || !!form.href"
                  density="comfortable"
                  hint="Vue Router path (e.g., /users)"
                  persistent-hint
                />
              </VCol>

              <!-- External URL -->
              <VCol cols="12" md="6" v-if="!form.is_section_title">
                <VTextField
                  v-model="form.href"
                  label="External URL"
                  placeholder="https://example.com"
                  :disabled="formLoading || !!form.to"
                  density="comfortable"
                  hint="External link (opens in new tab)"
                  persistent-hint
                />
              </VCol>

              <!-- Target -->
              <VCol cols="12" md="6" v-if="form.href && !form.is_section_title">
                <VSelect
                  v-model="form.target"
                  :items="targetOptions"
                  item-title="title"
                  item-value="value"
                  label="Link Target"
                  :disabled="formLoading"
                  density="comfortable"
                />
              </VCol>

              <VDivider class="my-2" />

              <!-- Permission (Single Select) -->
              <VCol cols="12">
                <VAutocomplete
                  v-model="form.permission"
                  v-model:search="permissionSearch"
                  :items="permissions"
                  item-title="name"
                  item-value="name"
                  label="Required Permission"
                  placeholder="Select permission"
                  clearable
                  :disabled="formLoading"
                  density="comfortable"
                >
                  <template #selection="{ item }">
                    <VChip
                      :color="getPermissionColor(item.raw.name)"
                      variant="tonal"
                      size="small"
                    >
                      {{ item.raw.name }}
                    </VChip>
                  </template>
                  <template #item="{ props, item }">
                    <VListItem v-bind="props" :title="item.raw.name">
                      <template #prepend>
                        <VIcon icon="bx-key" size="18" :color="getPermissionColor(item.raw.name)" class="me-2" />
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
                <p class="text-caption text-medium-emphasis mt-1">
                  <VIcon icon="bx-info-circle" size="14" class="me-1" />
                  User harus memiliki permission ini untuk melihat menu. Kosongkan untuk menampilkan ke semua user.
                  Super-admin selalu bisa melihat semua menu.
                </p>
              </VCol>

              <!-- Active Switch -->
              <VCol cols="12">
                <VSwitch
                  v-model="form.is_active"
                  label="Active"
                  color="success"
                  :disabled="formLoading"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-6">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="formLoading"
            @click="dialogVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            :loading="formLoading"
            @click="saveMenu"
          >
            <VIcon icon="bx-check" class="me-1" />
            {{ isEdit ? 'Update' : 'Create' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialogVisible"
      max-width="450"
    >
      <VCard>
        <VCardTitle class="pa-6">
          <VIcon icon="bx-error-circle" color="error" class="me-2" />
          Delete Menu
        </VCardTitle>
        <VCardText class="px-6">
          <p>Are you sure you want to delete <strong>{{ menuToDelete?.title }}</strong>?</p>
          <VAlert 
            v-if="menuToDelete?.children?.length" 
            type="warning" 
            variant="tonal" 
            class="mt-3" 
            density="compact"
          >
            <VAlertTitle>Warning</VAlertTitle>
            This will also delete <strong>{{ menuToDelete.children.length }}</strong> child menu(s).
          </VAlert>
        </VCardText>
        <VCardActions class="pa-6 pt-0">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="deleteLoading"
            @click="deleteDialogVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="deleteLoading"
            @click="deleteMenu"
          >
            <VIcon icon="bx-trash" class="me-1" />
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="5000"
      location="top end"
    >
      {{ snackbar.message }}
      <template #actions>
        <VBtn variant="text" @click="snackbar.show = false">
          <VIcon icon="bx-x" />
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<style scoped>
.menu-tree {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  padding: 8px;
  background: rgba(var(--v-theme-surface), 1);
}

.add-root-menu {
  border: 1px dashed rgba(var(--v-theme-primary), 0.5);
  transition: all 0.2s ease;
}

.add-root-menu:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-color: rgba(var(--v-theme-primary), 1);
}
</style>
