<script setup lang="ts">
import { permissionService, type Permission } from '@/services/permissionService'
import TablePagination from '@/components/TablePagination.vue'
import { useAuthStore } from '@/stores/auth'

// Data
const authStore = useAuthStore()
const permissions = ref<Permission[]>([])
const loading = ref(false)
const search = ref('')
const totalItems = ref(0)

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Dialog
const dialogVisible = ref(false)
const dialogTitle = ref('Add Permission')
const isEdit = ref(false)
const selectedPermission = ref<Permission | null>(null)
const formLoading = ref(false)

// Bulk dialog
const bulkDialogVisible = ref(false)
const bulkPermissions = ref('')
const bulkLoading = ref(false)

// Delete dialog
const deleteDialogVisible = ref(false)
const permissionToDelete = ref<Permission | null>(null)
const deleteLoading = ref(false)
const hasPermission = (permission: string | null | string[]) => {
  // No permission required
  if (!permission) return false

  // Array permission check (check if has ANY)
  if (Array.isArray(permission)) {
    return permission.some(p => authStore.hasPermission(p))
  }

  // Single permission check
  return authStore.hasPermission(permission)
}
// Form
const form = ref({
  name: '',
})

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Guard', key: 'guard_name' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', align: 'center' },
]

// Fetch permissions
const fetchPermissions = async () => {
  loading.value = true
  try {
    const response = await permissionService.getAll({
      search: search.value,
      perPage: itemsPerPage.value,
      page: currentPage.value,
    })
    permissions.value = response.data.data
    totalItems.value = response.data.total
  } catch (error) {
    showSnackbar('Failed to load permissions', 'error')
  } finally {
    loading.value = false
  }
}

// Open add dialog
const openAddDialog = () => {
  dialogTitle.value = 'Add Permission'
  isEdit.value = false
  selectedPermission.value = null
  form.value = { name: '' }
  dialogVisible.value = true
}

// Open edit dialog
const openEditDialog = (permission: Permission) => {
  dialogTitle.value = 'Edit Permission'
  isEdit.value = true
  selectedPermission.value = permission
  form.value = { name: permission.name }
  dialogVisible.value = true
}

// Save permission
const savePermission = async () => {
  formLoading.value = true
  try {
    if (isEdit.value && selectedPermission.value) {
      await permissionService.update(selectedPermission.value.id, form.value)
      showSnackbar('Permission updated successfully', 'success')
    } else {
      await permissionService.create(form.value)
      showSnackbar('Permission created successfully', 'success')
    }
    dialogVisible.value = false
    fetchPermissions()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to save permission', 'error')
  } finally {
    formLoading.value = false
  }
}

// Open bulk dialog
const openBulkDialog = () => {
  bulkPermissions.value = ''
  bulkDialogVisible.value = true
}

// Bulk create permissions
const bulkCreatePermissions = async () => {
  const permissionNames = bulkPermissions.value
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  if (permissionNames.length === 0) {
    showSnackbar('Please enter at least one permission', 'error')
    return
  }
  
  bulkLoading.value = true
  try {
    const response = await permissionService.bulkCreate(permissionNames)
    const created = response.data.created.length
    const skipped = response.data.skipped.length
    showSnackbar(`Created ${created} permissions, skipped ${skipped} duplicates`, 'success')
    bulkDialogVisible.value = false
    fetchPermissions()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to create permissions', 'error')
  } finally {
    bulkLoading.value = false
  }
}

// Confirm delete
const confirmDelete = (permission: Permission) => {
  permissionToDelete.value = permission
  deleteDialogVisible.value = true
}

// Delete permission
const deletePermission = async () => {
  if (!permissionToDelete.value) return
  
  deleteLoading.value = true
  try {
    await permissionService.delete(permissionToDelete.value.id)
    showSnackbar('Permission deleted successfully', 'success')
    deleteDialogVisible.value = false
    fetchPermissions()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to delete permission', 'error')
  } finally {
    deleteLoading.value = false
  }
}

// Show snackbar
const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color }
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Get permission group (prefix before dot)
const getPermissionGroup = (name: string) => {
  const parts = name.split('.')
  return parts[0] || name
}

// Get group color
const getGroupColor = (group: string) => {
  const colors: Record<string, string> = {
    'user': 'primary',
    'role': 'warning',
    'permission': 'error',
    'dashboard': 'success',
    'report': 'info',
    'setting': 'secondary',
  }
  return colors[group] || 'primary'
}

// Watch for search changes
watch(search, () => {
  currentPage.value = 1
  fetchPermissions()
})

// Watch for pagination changes
watch([currentPage, itemsPerPage], () => {
  fetchPermissions()
})

// Initial fetch
onMounted(() => {
  fetchPermissions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
        <div>
          <h4 class="text-h4">Permission Management</h4>
          <p class="text-body-1 mb-0">Manage system permissions</p>
        </div>
        <div class="d-flex gap-2">
          <VBtn
            v-if="hasPermission('permission.create')"
            variant="outlined"
            color="primary"
            prepend-icon="bx-list-plus"
            @click="openBulkDialog"
          >
            Bulk Add
          </VBtn>
          <VBtn
            v-if="hasPermission('permission.create')"
            color="primary"
            prepend-icon="bx-plus"
            @click="openAddDialog"
          >
            Add Permission
          </VBtn>
        </div>
      </VCardTitle>
    </VCard>

    <!-- Table Card -->
    <VCard>
      <VCardText>
        <!-- Search -->
        <VRow class="mb-4">
          <VCol cols="12" md="4">
            <VTextField
              v-model="search"
              placeholder="Search permissions..."
              prepend-inner-icon="bx-search"
              density="compact"
              hide-details
              clearable
            />
          </VCol>
        </VRow>

        <!-- Data Table -->
        <VTable class="text-no-wrap" hover>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.key" :class="header.align === 'center' ? 'text-center' : ''">
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="headers.length" class="text-center pa-8">
                <VProgressCircular indeterminate color="primary" />
              </td>
            </tr>
            <tr v-else-if="permissions.length === 0">
              <td :colspan="headers.length" class="text-center pa-8 text-medium-emphasis">
                No permissions found
              </td>
            </tr>
            <tr v-for="permission in permissions" :key="permission.id" v-else>
              <!-- Name with group badge -->
              <td>
                <div class="d-flex align-center gap-2">
                  <VChip
                    size="small"
                    :color="getGroupColor(getPermissionGroup(permission.name))"
                    variant="tonal"
                    class="text-capitalize"
                  >
                    {{ getPermissionGroup(permission.name) }}
                  </VChip>
                  <span class="font-weight-medium">{{ permission.name }}</span>
                </div>
              </td>
              
              <!-- Guard -->
              <td>
                <VChip size="small" color="secondary" variant="outlined">
                  {{ permission.guard_name }}
                </VChip>
              </td>
              
              <!-- Created At -->
              <td>{{ formatDate(permission.created_at) }}</td>
              
              <!-- Actions -->
              <td class="text-center">
                <div class="d-flex gap-1 justify-center">
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    color="primary"
                    @click="openEditDialog(permission)"
                  >
                    <VIcon icon="bx-edit" />
                    <VTooltip activator="parent">Edit</VTooltip>
                  </VBtn>
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(permission)"
                  >
                    <VIcon icon="bx-trash" />
                    <VTooltip activator="parent">Delete</VTooltip>
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>

        <!-- Custom Pagination -->
        <TablePagination
          v-model:current-page="currentPage"
          v-model:items-per-page="itemsPerPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          color="primary"
        />
      </VCardText>
    </VCard>

    <!-- Add/Edit Dialog -->
    <VDialog
      v-model="dialogVisible"
      max-width="500"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-6">
          {{ dialogTitle }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="savePermission">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.name"
                  label="Permission Name"
                  placeholder="e.g., user.create, post.delete"
                  hint="Use dot notation for grouping (e.g., module.action)"
                  persistent-hint
                  :disabled="formLoading"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="pa-6 pt-0">
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
            @click="savePermission"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Bulk Add Dialog -->
    <VDialog
      v-model="bulkDialogVisible"
      max-width="500"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-6">
          Bulk Add Permissions
        </VCardTitle>
        <VCardText>
          <VTextarea
            v-model="bulkPermissions"
            label="Permissions"
            placeholder="Enter one permission per line:
user.create
user.edit
user.delete
post.create
post.edit"
            rows="8"
            :disabled="bulkLoading"
          />
          <p class="text-caption text-medium-emphasis mt-2">
            Enter one permission name per line. Duplicates will be skipped.
          </p>
        </VCardText>
        <VCardActions class="pa-6 pt-0">
          <VSpacer />
          <VBtn
            variant="outlined"
            color="secondary"
            :disabled="bulkLoading"
            @click="bulkDialogVisible = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            :loading="bulkLoading"
            @click="bulkCreatePermissions"
          >
            Create All
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialogVisible"
      max-width="400"
    >
      <VCard>
        <VCardTitle class="pa-6">
          Delete Permission
        </VCardTitle>
        <VCardText>
          Are you sure you want to delete the permission <strong>{{ permissionToDelete?.name }}</strong>? This action cannot be undone.
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
            @click="deletePermission"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top end"
    >
      {{ snackbar.message }}
      <template #actions>
        <VBtn
          variant="text"
          @click="snackbar.show = false"
        >
          <VIcon icon="bx-x" />
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>
