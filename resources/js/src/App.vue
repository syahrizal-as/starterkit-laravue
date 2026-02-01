<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize auth state on app mount
onMounted(() => {
  authStore.initialize()
})
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
