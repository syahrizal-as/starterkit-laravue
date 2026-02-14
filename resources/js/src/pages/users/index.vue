<script setup lang="ts">
import { userService, type User } from '@/services/userService'
import { roleService } from '@/services/roleService'
import { useAuthStore } from '@/stores/auth'
import TablePagination from '@/components/TablePagination.vue'

const authStore = useAuthStore()

// Data
const users = ref<User[]>([])
const roles = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)
const search = ref('')
const totalItems = ref(0)
const roleFilter = ref<string | null>(null)

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Dialog
const dialogVisible = ref(false)
const dialogTitle = ref('Add User')
const isEdit = ref(false)
const selectedUser = ref<User | null>(null)
const formLoading = ref(false)

// Delete dialog
const deleteDialogVisible = ref(false)
const userToDelete = ref<User | null>(null)
const deleteLoading = ref(false)

// Form
const form = ref({
  name: '',
  email: '',
  password: '',
  roles: [] as number[],
})

// Search states for autocomplete
const roleSearch = ref('')
const roleFilterSearch = ref('')

const isPasswordVisible = ref(false)

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

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'primary',
})

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Roles', key: 'roles' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', align: 'center' },
]

// Roles for filter dropdown (with empty option)
const rolesForFilter = computed(() => {
  return [{ id: 0, name: 'All Roles' }, ...roles.value]
})

// Fetch users
const fetchUsers = async () => {
  loading.value = true
  try {
    const params: any = {
      search: search.value,
      perPage: itemsPerPage.value,
      page: currentPage.value,
    }
    
    if (roleFilter.value) {
      params.role = roleFilter.value
    }
    
    const response = await userService.getAll(params)
    users.value = response.data.data
    totalItems.value = response.data.total
  } catch (error) {
    showSnackbar('Failed to load users', 'error')
  } finally {
    loading.value = false
  }
}

// Fetch roles
const fetchRoles = async () => {
  try {
    const response = await roleService.getList()
    roles.value = response.data
  } catch (error) {
    console.error('Failed to load roles')
  }
}

// Open add dialog
const openAddDialog = () => {
  dialogTitle.value = 'Add User'
  isEdit.value = false
  selectedUser.value = null
  form.value = { name: '', email: '', password: '', roles: [] }
  roleSearch.value = ''
  dialogVisible.value = true
}

// Open edit dialog
const openEditDialog = (user: User) => {
  dialogTitle.value = 'Edit User'
  isEdit.value = true
  selectedUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    roles: user.roles?.map(r => r.id) || [],
  }
  roleSearch.value = ''
  dialogVisible.value = true
}

// Save user
const saveUser = async () => {
  formLoading.value = true
  try {
    if (isEdit.value && selectedUser.value) {
      const updateData: any = {
        name: form.value.name,
        email: form.value.email,
        roles: form.value.roles,
      }
      if (form.value.password) {
        updateData.password = form.value.password
      }
      await userService.update(selectedUser.value.id, updateData)
      showSnackbar('User updated successfully', 'success')
    } else {
      await userService.create(form.value)
      showSnackbar('User created successfully', 'success')
    }
    dialogVisible.value = false
    fetchUsers()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to save user', 'error')
  } finally {
    formLoading.value = false
  }
}

// Confirm delete
const confirmDelete = (user: User) => {
  userToDelete.value = user
  deleteDialogVisible.value = true
}

// Delete user
const deleteUser = async () => {
  if (!userToDelete.value) return
  
  deleteLoading.value = true
  try {
    await userService.delete(userToDelete.value.id)
    showSnackbar('User deleted successfully', 'success')
    deleteDialogVisible.value = false
    fetchUsers()
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Failed to delete user', 'error')
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

// Get role color
const getRoleColor = (roleName: string) => {
  const colors: Record<string, string> = {
    'super-admin': 'error',
    'admin': 'warning',
    'manager': 'info',
    'user': 'success',
  }
  return colors[roleName] || 'primary'
}

// Watch for search changes
watch(search, () => {
  currentPage.value = 1
  fetchUsers()
})

// Watch for filter changes
watch(roleFilter, () => {
  currentPage.value = 1
  fetchUsers()
})

// Watch for pagination changes
watch([currentPage, itemsPerPage], () => {
  fetchUsers()
})

// Initial fetch
onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>

<template>
  <div>
    <!-- Header -->
    <VCard class="mb-6">
      <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
        <div>
          <h4 class="text-h4">User Management</h4>
          <p class="text-body-1 mb-0">Manage users and their roles</p>
        </div>
        <VBtn
          color="primary"
          prepend-icon="bx-plus"
          @click="openAddDialog"
        >
          Add User
        </VBtn>
      </VCardTitle>
    </VCard>

    <!-- Table Card -->
    <VCard>
      <VCardText>
        <!-- Filters -->
        <VRow class="mb-4">
          <VCol cols="12" md="4">
            <VTextField
              v-model="search"
              placeholder="Search users..."
              prepend-inner-icon="bx-search"
              density="compact"
              hide-details
              clearable
            />
          </VCol>
          <VCol cols="12" md="3">
            <!-- Searchable Role Filter -->
            <VAutocomplete
              v-model="roleFilter"
              v-model:search="roleFilterSearch"
              :items="rolesForFilter"
              item-title="name"
              item-value="name"
              density="compact"
              hide-details
              clearable
              placeholder="Filter by role..."
              prepend-inner-icon="bx-filter"
            >
              <template #item="{ props, item }">
                <VListItem
                  v-bind="props"
                  :title="item.raw.name"
                >
                  <template #prepend v-if="item.raw.id !== 0">
                    <VChip
                      size="x-small"
                      :color="getRoleColor(item.raw.name)"
                      variant="tonal"
                      class="me-2"
                    >
                      {{ item.raw.name.charAt(0).toUpperCase() }}
                    </VChip>
                  </template>
                </VListItem>
              </template>
            </VAutocomplete>
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
            <tr v-else-if="users.length === 0">
              <td :colspan="headers.length" class="text-center pa-8 text-medium-emphasis">
                No users found
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" v-else>
              <!-- Name with avatar -->
              <td>
                <div class="d-flex align-center gap-3">
                  <VAvatar
                    size="32"
                    :color="getRoleColor(user.roles?.[0]?.name || 'user')"
                    variant="tonal"
                  >
                    <span class="text-sm font-weight-medium">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </VAvatar>
                  <span class="font-weight-medium">{{ user.name }}</span>
                </div>
              </td>
              
              <!-- Email -->
              <td>{{ user.email }}</td>
              
              <!-- Roles -->
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <VChip
                    v-for="role in user.roles"
                    :key="role.id"
                    size="small"
                    :color="getRoleColor(role.name)"
                    variant="tonal"
                    class="text-capitalize"
                  >
                    {{ role.name }}
                  </VChip>
                  <VChip
                    v-if="!user.roles || user.roles.length === 0"
                    size="small"
                    color="secondary"
                    variant="tonal"
                  >
                    No role
                  </VChip>
                </div>
              </td>
              
              <!-- Created At -->
              <td>{{ formatDate(user.created_at) }}</td>
              
              <!-- Actions -->
              <td class="text-center">
                <div class="d-flex gap-1 justify-center">
                  <VBtn
                    v-if="hasPermission('user.edit')"
                    icon
                    size="small"
                    variant="text"
                    color="primary"
                    @click="openEditDialog(user)"
                  >
                    <VIcon icon="bx-edit" />
                    <VTooltip activator="parent">Edit</VTooltip>
                  </VBtn>
                  <VBtn
                    v-if="hasPermission('user.delete')"
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="confirmDelete(user)"
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
          <VForm @submit.prevent="saveUser">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.name"
                  label="Full Name"
                  placeholder="Enter full name"
                  :disabled="formLoading"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  :disabled="formLoading"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  :placeholder="isEdit ? 'Leave blank to keep current password' : 'Enter password'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  :disabled="formLoading"
                  :hint="isEdit ? 'Leave blank to keep current password' : ''"
                  persistent-hint
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>
              <VCol cols="12">
                <!-- Searchable Select for Roles -->
                <VAutocomplete
                  v-model="form.roles"
                  v-model:search="roleSearch"
                  :items="roles"
                  item-title="name"
                  item-value="id"
                  label="Roles"
                  placeholder="Search and select roles..."
                  multiple
                  chips
                  closable-chips
                  :disabled="formLoading"
                  clearable
                >
                  <template #chip="{ props, item }">
                    <VChip
                      v-bind="props"
                      :color="getRoleColor(item.raw.name)"
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
                          :model-value="form.roles.includes(item.raw.id)"
                          hide-details
                          density="compact"
                          class="me-2"
                        />
                      </template>
                      <template #append>
                        <VChip
                          size="x-small"
                          :color="getRoleColor(item.raw.name)"
                          variant="tonal"
                        >
                          {{ item.raw.name }}
                        </VChip>
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
            @click="saveUser"
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
          Delete User
        </VCardTitle>
        <VCardText>
          Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>? This action cannot be undone.
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
            @click="deleteUser"
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
      :timeout="5000"
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
