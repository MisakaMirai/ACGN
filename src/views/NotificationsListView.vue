<template>
  <PageContent>
    <div class="noti-list-head">
      <SectionTitle class="noti-list-title">通知</SectionTitle>
      <button
        type="button"
        class="noti-readall"
        :disabled="store.unreadCount === 0"
        @click="store.markAllRead()"
      >
        全部已读
      </button>
    </div>

    <EmptyState v-if="store.notifications.length === 0">暂无通知</EmptyState>
    <div v-else class="noti-list">
      <NotificationItem
        v-for="item in store.notifications"
        :key="item.id"
        :item="item"
        :unread="!store.isRead(item.id)"
      />
    </div>
  </PageContent>
</template>

<script setup>
import { useNotificationsStore } from '@/stores/notifications'
import SectionTitle from '@/components/SectionTitle.vue'
import EmptyState from '@/components/EmptyState.vue'
import NotificationItem from '@/components/NotificationItem.vue'
import PageContent from '@/components/PageContent.vue'

const store = useNotificationsStore()
</script>

<style scoped>
.noti-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.noti-list-title {
  margin-bottom: 0;
}

.noti-readall {
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: 0;
  color: var(--primary);
  font-size: 0.8125rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.noti-readall:disabled {
  color: var(--text-muted);
  cursor: default;
}

.noti-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
</style>
