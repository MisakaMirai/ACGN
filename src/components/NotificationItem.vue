<template>
  <router-link
    :to="{ name: 'NotificationDetail', params: { id: item.id } }"
    class="noti-item"
    :class="{ 'is-unread': unread }"
  >
    <span class="noti-dot" :class="{ 'is-unread': unread }" aria-hidden="true"></span>
    <div class="noti-body">
      <div class="noti-head">
        <h5 class="noti-title">{{ item.title }}</h5>
        <img class="noti-arrow" aria-hidden="true" :src="angleRightIcon" alt="" />
      </div>
      <p class="noti-meta">{{ item.date }} · {{ item.author }} · {{ item.views }} 浏览</p>
      <p class="noti-excerpt">{{ item.excerpt }}</p>
    </div>
  </router-link>
</template>

<script setup>
import angleRightIcon from '@/assets/icons/angle-right.svg'

defineProps({
  item: { type: Object, required: true },
  unread: { type: Boolean, default: false },
})
</script>

<style scoped>
.noti-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: var(--card-padding, 16px);
  background: var(--card-bg);
  border-radius: 16px;
  color: var(--text);
  text-decoration: none;
  transition: background-color 0.3s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.noti-item:hover .noti-title {
  color: var(--primary);
}
.noti-item:hover .noti-arrow {
  color: var(--primary);
  transform: translateX(2px);
}

.noti-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
  background: transparent;
}
.noti-dot.is-unread {
  background: var(--primary);
}

.noti-body {
  flex: 1;
  min-width: 0;
}

.noti-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.noti-title {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: var(--text-heading);
  transition: color 0.3s;
}
.is-unread .noti-title {
  color: var(--text-heading);
}

.noti-arrow {
  flex-shrink: 0;
  color: var(--text-muted);
  transition:
    color 0.3s,
    transform 0.3s;
}

.noti-meta {
  margin: 4px 0 0;
  color: var(--text-muted);
}

.noti-excerpt {
  margin: 8px 0 0;
  color: var(--text-muted);
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
