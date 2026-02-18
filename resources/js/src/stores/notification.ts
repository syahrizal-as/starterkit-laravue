import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as any[],
    unreadCount: 0,
  }),
  actions: {
    addNotification(notification: any) {
      this.notifications.unshift(notification)
      this.unreadCount++
    },
    markAllAsRead() {
      this.unreadCount = 0
    },
    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
    },
  },
})
