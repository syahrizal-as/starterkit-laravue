<script lang="ts" setup>
import { useNotificationStore } from '@/stores/notification'
import { echo } from '@/plugins/echo'
import { onMounted, onUnmounted } from 'vue'

const notificationStore = useNotificationStore()

const setupEcho = () => {
  echo.channel('notifications')
    .listen('.notification.received', (e: any) => {
      console.log('Real-time notification received:', e)
      notificationStore.addNotification({
        title: 'New Notification',
        message: e.message,
        time: new Date().toLocaleTimeString(),
      })
    })
}

onMounted(() => {
  setupEcho()
})

onUnmounted(() => {
  echo.leaveChannel('notifications')
})
</script>

<template>
  <VBadge
    :content="notificationStore.unreadCount"
    :model-value="notificationStore.unreadCount > 0"
    color="error"
    offset-x="3"
    offset-y="3"
  >
    <VMenu
      location="bottom end"
      offset="14px"
    >
      <template #activator="{ props }">
        <IconBtn v-bind="props">
          <VIcon icon="bx-bell" />
        </IconBtn>
      </template>

      <VList class="py-0" width="300">
        <VListItem class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <h6 class="text-h6 mb-0">Notifications</h6>
            <VBtn
              variant="text"
              size="small"
              color="primary"
              @click="notificationStore.markAllAsRead"
            >
              Mark all read
            </VBtn>
          </div>
        </VListItem>

        <VDivider />

        <div v-if="notificationStore.notifications.length === 0" class="pa-4 text-center text-muted">
          No notifications yet
        </div>

        <template v-else>
          <VListItem
            v-for="(notification, index) in notificationStore.notifications"
            :key="index"
            :title="notification.title"
            :subtitle="notification.message"
          >
            <template #append>
              <div class="text-caption text-disabled">
                {{ notification.time }}
              </div>
            </template>
          </VListItem>
        </template>

        <VDivider />
        <VListItem class="pa-2 text-center">
            <VBtn variant="text" block size="small">View all</VBtn>
        </VListItem>
      </VList>
    </VMenu>
  </VBadge>
</template>
