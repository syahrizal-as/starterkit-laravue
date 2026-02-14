<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const columns = ref([
  {
    id: 1,
    title: 'In Progress',
    tasks: [
      { id: 101, title: 'Review JavaScript code', label: 'Code Review', labelColor: 'info' },
      { id: 102, title: 'Research FAQ page UX', label: 'UX', labelColor: 'success' },
    ]
  },
  {
    id: 2,
    title: 'In Review',
    tasks: [
      { id: 201, title: 'Review completed Apps', label: 'Dashboard', labelColor: 'primary' },
    ]
  },
  {
    id: 3,
    title: 'Done',
    tasks: [
      { id: 301, title: 'Forms & tables section', label: 'Bug', labelColor: 'error' },
      { id: 302, title: 'Completed charts & maps', label: 'Charts & maps', labelColor: 'warning' },
    ]
  }
])

const addNewItem = (columnId) => {
  const column = columns.value.find(c => c.id === columnId)
  if (column) {
    column.tasks.push({
      id: Date.now(),
      title: 'New Task',
      label: 'New',
      labelColor: 'secondary'
    })
  }
}
</script>

<template>
  <div>
    <VRow class="kanban-wrapper">
      <VCol
        v-for="col in columns"
        :key="col.id"
        cols="12"
        md="4"
      >
        <VCard class="grey-lighten-4">
          <VCardItem>
            <template #append>
              <VIcon icon="bx-dots-vertical-rounded" />
            </template>
            <VCardTitle>{{ col.title }}</VCardTitle>
          </VCardItem>

          <VCardText>
            <draggable
              v-model="col.tasks"
              item-key="id"
              group="tasks"
              class="drag-area"
            >
              <template #item="{ element }">
                <VCard class="mb-3 shadow-sm draggable-item">
                  <VCardText>
                    <VChip
                      :color="element.labelColor"
                      size="x-small"
                      class="mb-2"
                      variant="tonal"
                    >
                      {{ element.label }}
                    </VChip>
                    <div class="text-body-1 font-weight-medium mb-2">
                      {{ element.title }}
                    </div>
                    <div class="d-flex align-center justify-space-between mt-3">
                      <div class="text-caption text-disabled">
                        <VIcon icon="bx-message-square-detail" size="14" class="me-1" /> 2
                        <VIcon icon="bx-link" size="14" class="ms-2 me-1" /> 4
                      </div>
                      <VAvatarGroup size="24">
                        <VAvatar color="primary">S</VAvatar>
                        <VAvatar color="info">A</VAvatar>
                      </VAvatarGroup>
                    </div>
                  </VCardText>
                </VCard>
              </template>
            </draggable>

            <VBtn
              variant="text"
              block
              prepend-icon="bx-plus"
              color="secondary"
              class="mt-2"
              @click="addNewItem(col.id)"
            >
              Add New Item
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
.drag-area {
  min-height: 100px;
}
.draggable-item {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
</style>
