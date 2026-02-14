<script lang="ts" setup>
import type { NavGroup } from '@layouts/types'

defineProps<{
  item: Omit<NavGroup, 'children'>
}>()
</script>

<template>
  <li class="horizontal-nav-group">
    <VMenu open-on-hover offset="5">
      <template #activator="{ props }">
        <div
          v-bind="props"
          class="d-flex align-center px-4 py-2 cursor-pointer nav-group-label"
        >
          <VIcon
            :icon="(item.icon as string) || 'bx-collection'"
            size="20"
            class="me-2"
          />
          <span>{{ item.title }}</span>
          <VIcon icon="bx-chevron-down" size="18" class="ms-1" />
        </div>
      </template>

      <VList density="compact" class="py-1 mt-1 font-weight-medium">
        <slot />
      </VList>
    </VMenu>
  </li>
</template>

<style lang="scss">
.horizontal-nav-group {
  list-style: none;

  .nav-group-label {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    transition: all 0.2s;
    border-radius: 6px;

    &:hover {
      color: rgb(var(--v-theme-primary));
      background-color: rgba(var(--v-theme-primary), 0.08);
    }
  }
}
</style>
