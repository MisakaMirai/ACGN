<template>
  <div class="sidebar-menu">
    <div class="sidebar-menu-inner">
      <ul id="sidebar-nav-list" class="sidebar-nav-list">
        <li v-for="cat in store.categories" :key="cat.id" class="sidebar-item">
          <router-link :to="{ path: '/', hash: '#' + cat.id }" class="sidebar-menu-link">
            <img
              :src="resolveNavIcon(cat.icon)"
              class="sidebar-cat-icon"
              alt=""
              @error="handleIconError"
            />
            <span class="sidebar-menu-text">{{ cat.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useSitesStore } from '@/stores/sites'
import { resolveNavIcon, handleIconError } from '@/utils/siteIcon'

const store = useSitesStore()
</script>

<style scoped>
.sidebar-menu {
  flex: 1 1 auto;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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
.sidebar-item {
  position: relative;
}
.sidebar-item > .sidebar-menu-link:hover {
  color: var(--primary);
  background: var(--sidebar-hover);
}
.sidebar-nav-list {
  margin: 0;
  padding: 0;
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
