<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  itemsPerPageOptions?: number[]
  showInfo?: boolean
  variant?: 'outlined' | 'tonal' | 'flat' | 'elevated' | 'text' | 'plain'
  color?: string
  rounded?: boolean | 'sm' | 'lg' | 'xl' | 'pill' | 'circle' | 'shaped'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  density?: 'default' | 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPageOptions: () => [5, 10, 25, 50, 100],
  showInfo: true,
  variant: 'tonal',
  color: 'primary',
  rounded: 'lg',
  size: 'default',
  density: 'comfortable',
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'update:itemsPerPage', value: number): void
}>()

const localPage = computed({
  get: () => props.currentPage,
  set: (value: number) => emit('update:currentPage', value),
})

const localItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (value: number) => emit('update:itemsPerPage', value),
})

// Calculate showing info
const showingFrom = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const showingTo = computed(() => {
  const to = props.currentPage * props.itemsPerPage
  return Math.min(to, props.totalItems)
})

// Go to specific page
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    localPage.value = page
  }
}

// Go to first page
const goToFirst = () => goToPage(1)

// Go to last page
const goToLast = () => goToPage(props.totalPages)

// Go to previous page
const goToPrev = () => goToPage(props.currentPage - 1)

// Go to next page
const goToNext = () => goToPage(props.currentPage + 1)

// Generate visible page numbers
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    // Calculate start and end of visible range
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)
    
    // Adjust range if at the beginning
    if (current <= 3) {
      start = 2
      end = 4
    }
    
    // Adjust range if at the end
    if (current >= total - 2) {
      start = total - 3
      end = total - 1
    }
    
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) {
        pages.push(i)
      }
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    // Always show last page
    pages.push(total)
  }
  
  return pages
})
</script>

<template>
  <div class="d-flex flex-wrap align-center justify-space-between gap-4 pt-4">
    <!-- Items per page selector -->
    <div class="d-flex align-center gap-2">
      <span class="text-body-2 text-high-emphasis">Show</span>
      <VSelect
        v-model="localItemsPerPage"
        :items="itemsPerPageOptions"
        :density="density"
        variant="outlined"
        hide-details
        style="width: 80px;"
      />
      <span class="text-body-2 text-high-emphasis">entries</span>
    </div>

    <!-- Showing info -->
    <div v-if="showInfo && totalItems > 0" class="text-body-2 text-medium-emphasis">
      Showing <span class="text-high-emphasis font-weight-medium">{{ showingFrom }}</span>
      to <span class="text-high-emphasis font-weight-medium">{{ showingTo }}</span>
      of <span class="text-high-emphasis font-weight-medium">{{ totalItems }}</span> entries
    </div>

    <!-- Pagination buttons -->
    <div class="d-flex align-center gap-1">
      <!-- First page button -->
      <VBtn
        :variant="variant"
        :color="color"
        :size="size"
        :rounded="rounded"
        :density="density"
        icon
        :disabled="currentPage === 1"
        @click="goToFirst"
      >
        <VIcon icon="bx-chevrons-left" size="20" />
        <VTooltip activator="parent" location="top">First</VTooltip>
      </VBtn>

      <!-- Previous page button -->
      <VBtn
        :variant="variant"
        :color="color"
        :size="size"
        :rounded="rounded"
        :density="density"
        icon
        :disabled="currentPage === 1"
        @click="goToPrev"
      >
        <VIcon icon="bx-chevron-left" size="20" />
        <VTooltip activator="parent" location="top">Previous</VTooltip>
      </VBtn>

      <!-- Page number buttons -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <VBtn
          v-if="page === '...'"
          :variant="'text'"
          :color="color"
          :size="size"
          :rounded="rounded"
          :density="density"
          icon
          disabled
        >
          <VIcon icon="bx-dots-horizontal-rounded" size="20" />
        </VBtn>
        <VBtn
          v-else
          :variant="currentPage === page ? 'elevated' : variant"
          :color="color"
          :size="size"
          :rounded="rounded"
          :density="density"
          icon
          :class="{ 'font-weight-bold': currentPage === page }"
          @click="goToPage(page as number)"
        >
          {{ page }}
        </VBtn>
      </template>

      <!-- Next page button -->
      <VBtn
        :variant="variant"
        :color="color"
        :size="size"
        :rounded="rounded"
        :density="density"
        icon
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="goToNext"
      >
        <VIcon icon="bx-chevron-right" size="20" />
        <VTooltip activator="parent" location="top">Next</VTooltip>
      </VBtn>

      <!-- Last page button -->
      <VBtn
        :variant="variant"
        :color="color"
        :size="size"
        :rounded="rounded"
        :density="density"
        icon
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="goToLast"
      >
        <VIcon icon="bx-chevrons-right" size="20" />
        <VTooltip activator="parent" location="top">Last</VTooltip>
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  min-width: 36px !important;
}
</style>
