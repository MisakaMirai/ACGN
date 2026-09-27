<template>
  <PageContent>
    <BackBar to="/announcements" label="返回公告列表" />
    <EmptyState v-if="!announcement">公告未找到</EmptyState>
    <article v-else class="ann-detail">
      <h1 class="ann-detail-title">{{ announcement.title }}</h1>
      <p class="ann-detail-meta">
        {{ announcement.date }} · {{ announcement.author }} · {{ announcement.views }} 浏览
      </p>
      <div class="ann-detail-content">
        {{ announcement.content }}
      </div>
    </article>
  </PageContent>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAnnouncementsStore } from '@/stores/announcements'
import EmptyState from '@/components/EmptyState.vue'
import BackBar from '@/components/BackBar.vue'
import PageContent from '@/components/PageContent.vue'

const route = useRoute()
const store = useAnnouncementsStore()

const announcement = computed(() => {
  const id = route.params.id
  if (!id) return null
  return store.findById(id) || null
})
</script>

<style scoped>
.ann-detail {
  padding: 20px;
  background: var(--card-bg);
  border-radius: 16px;
}

.ann-detail-title {
  margin: 0 0 8px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text-heading);
  line-height: 1.2;
}

.ann-detail-meta {
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--bg-gray);
  color: var(--text-muted);
}

.ann-detail-content {
  color: var(--text-heading);
  line-height: 1.8;
  white-space: pre-line;
}

@media (max-width: 767px) {
  .ann-detail {
    padding: 16px;
  }
  .ann-detail-title {
    font-size: 1.125rem;
  }
}
</style>
