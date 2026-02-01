<script setup lang="ts">
import { menuService, type Menu } from '@/services/menuService'
import { roleService } from '@/services/roleService'

// Props
interface Props {
  menu: Menu
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

const emit = defineEmits<{
  (e: 'edit', menu: Menu): void
  (e: 'delete', menu: Menu): void
  (e: 'add-child', parentId: number): void
  (e: 'refresh'): void
}>()

// State
const isExpanded = ref(true)
const isHovered = ref(false)

// Has children
const hasChildren = computed(() => props.menu.children && props.menu.children.length > 0)

// Toggle expand
const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

// Get menu type icon
const getMenuIcon = () => {
  if (props.menu.is_section_title) return 'bx-minus'
  if (hasChildren.value) return isExpanded.value ? 'bx-folder-open' : 'bx-folder'
  return 'bx-file'
}

// Get icon color
const getIconColor = () => {
  if (props.menu.is_section_title) return 'secondary'
  if (hasChildren.value) return 'warning'
  return 'info'
}
</script>

<template>
  <div class="menu-tree-item">
    <!-- Tree line connectors -->
    <div class="tree-connector" :style="{ paddingLeft: `${level * 24}px` }">
      <!-- Vertical line -->
      <div v-if="level > 0" class="tree-line-vertical"></div>
      <!-- Horizontal line -->
      <div v-if="level > 0" class="tree-line-horizontal"></div>
    </div>

    <!-- Menu item content -->
    <div 
      class="menu-item-content d-flex align-center gap-2 py-2 px-3 rounded cursor-pointer"
      :class="{ 'bg-grey-lighten-4': isHovered }"
      :style="{ marginLeft: `${level * 24}px` }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="toggleExpand"
    >
      <!-- Expand/Collapse indicator -->
      <VIcon 
        v-if="hasChildren"
        :icon="isExpanded ? 'bx-chevron-down' : 'bx-chevron-right'"
        size="16"
        class="text-medium-emphasis"
      />
      <div v-else style="width: 16px;"></div>

      <!-- Menu icon -->
      <VIcon 
        :icon="getMenuIcon()" 
        :color="getIconColor()"
        size="20"
      />

      <!-- Menu title -->
      <span 
        class="flex-grow-1" 
        :class="{ 
          'text-uppercase text-caption font-weight-bold text-medium-emphasis': menu.is_section_title,
          'font-weight-medium': !menu.is_section_title
        }"
      >
        {{ menu.title }}
      </span>

      <!-- Route/URL badge -->
      <VChip v-if="menu.to" size="x-small" color="primary" variant="tonal" class="me-1">
        {{ menu.to }}
      </VChip>
      <VChip v-else-if="menu.href" size="x-small" color="info" variant="tonal" class="me-1">
        External
      </VChip>

      <!-- Status badge -->
      <VChip 
        v-if="!menu.is_active" 
        size="x-small" 
        color="error" 
        variant="tonal"
        class="me-1"
      >
        Inactive
      </VChip>

      <!-- Action buttons (visible on hover) -->
      <div v-show="isHovered" class="d-flex gap-1">
        <VBtn
          icon
          size="x-small"
          variant="text"
          color="success"
          @click.stop="emit('add-child', menu.id)"
        >
          <VIcon icon="bx-plus" size="16" />
          <VTooltip activator="parent" location="top">Add Child</VTooltip>
        </VBtn>
        <VBtn
          icon
          size="x-small"
          variant="text"
          color="primary"
          @click.stop="emit('edit', menu)"
        >
          <VIcon icon="bx-edit" size="16" />
          <VTooltip activator="parent" location="top">Edit</VTooltip>
        </VBtn>
        <VBtn
          icon
          size="x-small"
          variant="text"
          color="error"
          @click.stop="emit('delete', menu)"
        >
          <VIcon icon="bx-trash" size="16" />
          <VTooltip activator="parent" location="top">Delete</VTooltip>
        </VBtn>
      </div>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren && isExpanded" class="menu-children">
      <MenuTreeItem
        v-for="child in menu.children"
        :key="child.id"
        :menu="child"
        :level="level + 1"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @add-child="emit('add-child', $event)"
        @refresh="emit('refresh')"
      />
      
      <!-- Add child button at the end of children -->
      <div 
        class="add-child-inline d-flex align-center gap-2 py-2 px-3 rounded cursor-pointer text-primary"
        :style="{ marginLeft: `${(level + 1) * 24}px` }"
        @click="emit('add-child', menu.id)"
      >
        <div style="width: 16px;"></div>
        <VIcon icon="bx-plus-circle" size="20" color="primary" />
        <span class="text-body-2">Tambah Menu</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MenuTreeItem',
}
</script>

<style scoped>
.menu-tree-item {
  position: relative;
}

.tree-connector {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.tree-line-vertical {
  position: absolute;
  left: -12px;
  top: 0;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
}

.tree-line-horizontal {
  position: absolute;
  left: -12px;
  top: 18px;
  width: 12px;
  height: 1px;
  border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
}

.menu-item-content {
  transition: background-color 0.15s ease;
  user-select: none;
}

.menu-item-content:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.add-child-inline {
  transition: background-color 0.15s ease;
}

.add-child-inline:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.menu-children {
  position: relative;
}

.menu-children::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 24px;
  width: 1px;
  border-left: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
}
</style>
