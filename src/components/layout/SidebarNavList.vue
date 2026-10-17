<template>
  <ul class="sidebar-nav-list">
    <li v-for="item in items" :key="item.key" class="sidebar-item">
      <router-link :to="item.to" class="sidebar-menu-link">
        <img class="sidebar-cat-icon" :src="item.icon" alt="" @error="handleNavIconError" />
        <span class="sidebar-menu-text">{{ item.label }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { handleNavIconError } from '@/utils/siteIcon'

// 侧边栏导航行：分类列表（数据驱动 icon）与页脚固定入口（本地 import）共用同一套行样式。
// items: [{ key, to, icon, label }]，icon 需为已解析好的地址。
defineProps({
  items: { type: Array, required: true },
})
</script>

<style scoped>
.sidebar-nav-list {
  margin: 0;
  padding: 0;
}
.sidebar-item {
  position: relative;
}
.sidebar-menu-link {
  display: block;
  overflow: hidden;
  padding: 0 0 0 16px;
  line-height: 50px;
  max-height: 50px;
  color: var(--sidebar-text);
  text-decoration: none;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  outline: none;
  transition:
    color 0.3s,
    background-color 0.3s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.sidebar-menu-link:active {
  color: var(--primary);
}
.sidebar-item > .sidebar-menu-link:hover {
  color: var(--primary);
  background: var(--sidebar-hover);
}
.sidebar-cat-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  flex-shrink: 0;
  vertical-align: middle;
}
.sidebar-menu-text {
  opacity: 1;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}
/* 迷你态文字隐藏（.mini-sidebar 在主组件 #sidebar 上） */
.mini-sidebar .sidebar-menu-text {
  opacity: 0;
}
</style>
