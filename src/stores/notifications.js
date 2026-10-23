import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import notificationsData from '@/data/notifications.json'

export const NOTIFICATIONS_READ_STORAGE_KEY = 'notifications-read-ids'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref(
    (notificationsData.notifications || []).sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  // 已读通知 id 列表，localStorage 持久化，跨会话保留已读状态
  const readIds = useLocalStorage(NOTIFICATIONS_READ_STORAGE_KEY, [])

  const unreadCount = computed(
    () => notifications.value.filter((n) => !readIds.value.includes(n.id)).length
  )

  const findById = (id) => {
    return notifications.value.find((n) => n.id === Number(id))
  }

  const isRead = (id) => {
    return readIds.value.includes(Number(id))
  }

  const markRead = (id) => {
    const numId = Number(id)
    if (!numId || readIds.value.includes(numId)) return
    readIds.value = [...readIds.value, numId]
  }

  const markAllRead = () => {
    readIds.value = notifications.value.map((n) => n.id)
  }

  return { notifications, readIds, unreadCount, findById, isRead, markRead, markAllRead }
})
