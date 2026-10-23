<template>
  <PageContent>
    <BackBar to="/notifications" label="返回通知列表" />
    <EmptyState v-if="!notification">通知未找到</EmptyState>
    <article v-else class="noti-detail">
      <h1 class="noti-detail-title">{{ notification.title }}</h1>
      <p class="noti-detail-meta">
        {{ notification.date }} · {{ notification.author }} · {{ notification.views }} 浏览
      </p>
      <div class="noti-detail-content">
        {{ notification.content }}
      </div>
    </article>
  </PageContent>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import EmptyState from '@/components/EmptyState.vue'
import BackBar from '@/components/BackBar.vue'
import PageContent from '@/components/PageContent.vue'

const route = useRoute()
const store = useNotificationsStore()

const notification = computed(() => {
  const id = route.params.id
  if (!id) return null
  return store.findById(id) || null
})

// 打开详情即标记为已读
watch(
  notification,
  (item) => {
    if (item) store.markRead(item.id)
  },
  { immediate: true }
)
</script>

<style scoped>
.noti-detail {
  padding: 20px;
  background: var(--card-bg);
  border-radius: 16px;
}

.noti-detail-title {
  margin: 0 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text-heading);
  line-height: 1.2;
}

.noti-detail-meta {
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--bg-gray);
  color: var(--text-muted);
}

.noti-detail-content {
  color: var(--text-heading);
  line-height: 1.8;
  white-space: pre-line;
}

@media (max-width: 767px) {
  .noti-detail {
    padding: 16px;
  }
  .noti-detail-title {
    font-size: 1.125rem;
  }
}
</style>
