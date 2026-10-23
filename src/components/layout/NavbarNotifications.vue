<template>
  <div ref="rootEl" class="navbar-notify">
    <button
      type="button"
      class="notify-trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      aria-label="通知"
      @click="open = !open"
    >
      <img class="notify-bell" :src="bellIcon" alt="" />
      <span v-if="store.unreadCount > 0" class="notify-badge">
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </span>
    </button>

    <div v-if="open" class="notify-panel" role="menu">
      <div class="notify-head">
        <span class="notify-title">通知</span>
        <button
          type="button"
          class="notify-readall"
          :disabled="store.unreadCount === 0"
          @click="store.markAllRead()"
        >
          全部已读
        </button>
      </div>

      <p v-if="store.notifications.length === 0" class="notify-empty">暂无通知</p>
      <ul v-else class="notify-list">
        <li v-for="item in recent" :key="item.id">
          <router-link
            :to="{ name: 'NotificationDetail', params: { id: item.id } }"
            class="notify-item"
            role="menuitem"
          >
            <span class="notify-dot" :class="{ 'is-unread': !store.isRead(item.id) }"></span>
            <span class="notify-item-body">
              <span class="notify-item-title">{{ item.title }}</span>
              <span class="notify-item-meta">{{ item.date }} · {{ item.author }}</span>
            </span>
          </router-link>
        </li>
      </ul>

      <router-link to="/notifications" class="notify-footer" role="menuitem">
        查看全部通知
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { useNotificationsStore } from '@/stores/notifications'
import bellIcon from '@/assets/icons/bell.svg'

const PREVIEW_COUNT = 6

const store = useNotificationsStore()
const route = useRoute()
const open = ref(false)
const rootEl = ref(null)

const recent = computed(() => store.notifications.slice(0, PREVIEW_COUNT))

onClickOutside(rootEl, () => {
  open.value = false
})

// 键盘 Esc 关闭（onKeyStroke 随组件卸载自动清理）
onKeyStroke('Escape', () => {
  open.value = false
})

// 路由跳转后自动关闭（点击通知项即导航离开）
watch(
  () => route.fullPath,
  () => {
    open.value = false
  }
)
</script>

<style scoped>
.navbar-notify {
  position: relative;
}

.notify-trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: none;
  border: 0;
  border-radius: 6px;
  line-height: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.notify-trigger:hover {
  background: var(--primary-soft);
}

.notify-bell {
  width: 22px;
  height: 22px;
}

.notify-badge {
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

.notify-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  max-height: min(420px, 70vh);
  overflow-y: auto;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1090;
}

.notify-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--bg-gray);
}

.notify-title {
  font-weight: 600;
  color: var(--text-heading);
}

.notify-readall {
  padding: 0;
  background: none;
  border: 0;
  color: var(--primary);
  font-size: 0.75rem;
  cursor: pointer;
}
.notify-readall:disabled {
  color: var(--text-muted);
  cursor: default;
}

.notify-empty {
  margin: 0;
  padding: 24px 16px;
  text-align: center;
  color: var(--text-muted);
}

.notify-list {
  margin: 0;
  padding: 4px 0;
  list-style: none;
}

.notify-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 16px;
  color: var(--text);
  text-decoration: none;
  transition: background-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.notify-item:hover {
  background: var(--primary-soft);
}

.notify-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: transparent;
}
.notify-dot.is-unread {
  background: var(--primary);
}

.notify-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notify-item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--text-heading);
}

.notify-item-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.notify-footer {
  display: block;
  padding: 10px 16px;
  border-top: 1px solid var(--bg-gray);
  color: var(--primary);
  font-size: 0.8125rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.notify-footer:hover {
  background: var(--primary-soft);
}

@media (max-width: 767px) {
  .notify-panel {
    position: fixed;
    top: 56px;
    right: 8px;
    left: 8px;
    width: auto;
    max-height: calc(100vh - 72px);
  }
}
</style>
