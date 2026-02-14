<script lang="ts" setup>
import type { NavLink } from '@layouts/types'

defineProps<{
  item: NavLink
}>()
</script>

<template>
  <li class="horizontal-nav-link" :class="{ disabled: item.disable }">
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      :to="item.to"
      :href="item.href"
      :target="item.target"
      class="d-flex align-center px-4 py-2 text-decoration-none color-inherit"
    >
      <VIcon
        :icon="(item.icon as string) || 'bx-circle'"
        size="20"
        class="me-2"
      />
      <span>{{ item.title }}</span>
    </Component>
  </li>
</template>

<style lang="scss">
.horizontal-nav-link {
  list-style: none;
  
  a {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    transition: all 0.2s;
    border-radius: 6px;

    &:hover {
      color: rgb(var(--v-theme-primary));
      background-color: rgba(var(--v-theme-primary), 0.08);
    }

    &.router-link-active {
      color: #fff !important;
      background-color: rgb(var(--v-theme-primary));
      box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.4);
    }
  }
}
</style>
