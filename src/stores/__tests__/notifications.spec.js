import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '../notifications'

describe('useNotificationsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('notifications are sorted by date descending', () => {
    const store = useNotificationsStore()
    const dates = store.notifications.map((n) => new Date(n.date).getTime())
    for (let i = 1; i < dates.length; i += 1) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i])
    }
  })

  it('findById matches by numeric id and returns undefined for missing id', () => {
    const store = useNotificationsStore()
    const first = store.notifications[0]
    expect(store.findById(first.id)?.id).toBe(first.id)
    expect(store.findById(String(first.id))?.id).toBe(first.id)
    expect(store.findById(99999999)).toBeUndefined()
  })

  it('markRead marks a single notification read and updates unreadCount', () => {
    const store = useNotificationsStore()
    const first = store.notifications[0]
    expect(store.isRead(first.id)).toBe(false)

    const before = store.unreadCount
    store.markRead(first.id)

    expect(store.isRead(first.id)).toBe(true)
    expect(store.unreadCount).toBe(before - 1)
  })

  it('markRead is idempotent and ignores invalid id', () => {
    const store = useNotificationsStore()
    const first = store.notifications[0]
    store.markRead(first.id)
    const afterFirst = store.unreadCount

    store.markRead(first.id)
    store.markRead('not-a-number')
    store.markRead(null)

    expect(store.unreadCount).toBe(afterFirst)
  })

  it('markAllRead clears unread count', () => {
    const store = useNotificationsStore()
    store.markAllRead()
    expect(store.unreadCount).toBe(0)
    for (const n of store.notifications) {
      expect(store.isRead(n.id)).toBe(true)
    }
  })
})
