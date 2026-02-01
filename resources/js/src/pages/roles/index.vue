<script setup lang="ts">
import { roleService, type Role } from '@/services/roleService'
import { permissionService, type Permission } from '@/services/permissionService'
import TablePagination from '@/components/TablePagination.vue'
import { useAuthStore } from '@/stores/auth'
// Data
const authStore = useAuthStore()
const roles = ref<Role[]>([])
const permissions = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)
const search = ref('')
const totalItems = ref(0)

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Dialog
const dialogVisible = ref(false)
const dialogTitle = ref('Add Role')
const isEdit = ref(false)
const selectedRole = ref<Role | null>(null)
const formLoading = ref(false)

// Delete dialog
const deleteDialogVisible = ref(false)
const roleToDelete = ref<Role | null>(null)
const deleteLoading = ref(false)

const hasPermission = (permission: string | null | string[]) => {
  // No permission required
  if (!permission) return false

  // Single permission check
  return authStore.hasPermission(permission)
}

// Form
const form = ref({
  name: '',
  permissions: [] as number[],
})

// Permission search
const permissionSearch = ref('')

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

// Table headers
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Permissions', key: 'permissions', sortable: false },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

// Fetch roles
const fetchRoles = async () => {
  loading.value = true
  try {
    const response = await roleService.getAll({
      search: search.value,
      perPage: itemsPerPage.value,
      page: currentPage.value,
    })
    roles.value = response.data.data
    totalItems.value = response.data.total
  } catch (error) {
    showSnackbar('Failed to load roles', 'error')
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
const openAddDialog = () => {
  dialogTitle.value = 'Add Role'
  isEdit.value = false
  selectedRole.value = null
  form.value = { name: '', permissions: [] }
  permissionSearch.value = ''
  dialogVisible.value = true
}

// Open edit dialog
const openEditDialog = (role: Role) => {
  dialogTitle.value = 'Edit Role'
  isEdit.value = true
  selectedRole.value = role
  form.value = {
    name: role.name,
    permissions: role.permissions?.map(p => p.id) || [],
  }
  permissionSearch.value = ''
  dialogVisible.value = true
}

// Save role
const saveRole = async () => {
  formLoading.value = true
  try {
    if (isEdit.value && selectedRole.value) {
      await roleService.update(selectedRole.value.id, form.value)
      showSnackbar('Role updated successfully', 'success')
    } else {
      await roleService.create(form.value)
      showSnackbar('Role created successfully', 'success')
    }
    dialogVisible.value = false
    fetchRoles()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to save role', 'error')
  } finally {
    formLoading.value = false
  }
}

// Confirm delete
const confirmDelete = (role: Role) => {
  roleToDelete.value = role
  deleteDialogVisible.value = true
}

// Delete role
const deleteRole = async () => {
  if (!roleToDelete.value) return
  
  deleteLoading.value = true
  try {
    await roleService.delete(roleToDelete.value.id)
    showSnackbar('Role deleted successfully', 'success')
    deleteDialogVisible.value = false
    fetchRoles()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to delete role', 'error')
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

// Watch for search changes
watch(search, () => {
  currentPage.value = 1
  fetchRoles()
})

// Watch for pagination changes
watch([currentPage, itemsPerPage], () => {
  fetchRoles()
})

// Initial fetch
onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
        <div>
          <h4 class="text-h4">Role Management</h4>
          <p class="text-body-1 mb-0">Manage roles and their permissions</p>
        </div>
        <VBtn
          color="primary"
          prepend-icon="bx-plus"
          @click="openAddDialog"
        >
          Add Role
        </VBtn>
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
              placeholder="Search roles..."
              prepend-inner-icon="bx-search"
              density="compact"
              hide-details
              clearable
            />
          </VCol>
        </VRow>

        <!-- Data Table (without built-in pagination) -->
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
            <tr v-else-if="roles.length === 0">
              <td :colspan="headers.length" class="text-center pa-8 text-medium-emphasis">
                No roles found
              </td>
            </tr>
            <tr v-for="role in roles" :key="role.id" v-else>
              <!-- Name -->
              <td>
                <span class="font-weight-medium">{{ role.name }}</span>
              </td>
              
              <!-- Permissions -->
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <VChip
                    v-for="perm in (role.permissions || []).slice(0, 3)"
                    :key="perm.id"
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ perm.name }}
                  </VChip>
                  <VChip
                    v-if="(role.permissions || []).length > 3"
                    size="small"
                    color="secondary"
                    variant="tonal"
                  >
                    +{{ role.permissions.length - 3 }} more
                  </VChip>
                </div>
              </td>
              
              <!-- Created At -->
              <td>{{ formatDate(role.created_at) }}</td>
              
              <!-- Actions -->
              <td class="text-center">
                <div class="d-flex gap-1 justify-center">
                  <VBtn
                   v-if="hasPermission('role.edit')"
                    icon
                    size="small"
                    variant="text"
                    color="primary"
                    @click="openEditDialog(role)"
                  >
                    <VIcon icon="bx-edit" />
                    <VTooltip activator="parent">Edit</VTooltip>
                  </VBtn>
                  <VBtn
                   v-if="hasPermission('role.delete')"
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    :disabled="role.name === 'super-admin'"
                    @click="confirmDelete(role)"
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
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="pa-6">
          {{ dialogTitle }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveRole">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.name"
                  label="Role Name"
                  placeholder="Enter role name"
                  :disabled="formLoading"
                />
              </VCol>
              <VCol cols="12">
                <!-- Searchable Select (Autocomplete) for Permissions -->
                <VAutocomplete
                  v-model="form.permissions"
                  v-model:search="permissionSearch"
                  :items="permissions"
                  item-title="name"
                  item-value="id"
                  label="Permissions"
                  placeholder="Search and select permissions..."
                  multiple
                  chips
                  closable-chips
                  :disabled="formLoading"
                  clearable
                  hide-no-data
                  no-filter
                >
                  <template #chip="{ props, item }">
                    <VChip
                      v-bind="props"
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      {{ item.raw.name }}
                    </VChip>
                  </template>
                  <template #item="{ props, item }">
                    <VListItem
                      v-bind="props"
                      :title="item.raw.name"
                    >
                      <template #prepend>
                        <VCheckbox
                          :model-value="form.permissions.includes(item.raw.id)"
                          hide-details
                          density="compact"
                          class="me-2"
                        />
                      </template>
                    </VListItem>
                  </template>
                </VAutocomplete>
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
            @click="saveRole"
          >
            {{ isEdit ? 'Update' : 'Create' }}
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
          Delete Role
        </VCardTitle>
        <VCardText>
          Are you sure you want to delete the role <strong>{{ roleToDelete?.name }}</strong>? This action cannot be undone.
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
            @click="deleteRole"
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
