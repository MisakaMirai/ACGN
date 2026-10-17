<template>
  <div class="navbar-mobile mobile-only">
    <button
      id="sidebar-toggle"
      type="button"
      class="navbar-toggle"
      :aria-label="sidebarStore.isMobileOpen ? '关闭菜单' : '打开菜单'"
      :aria-expanded="sidebarStore.isMobileOpen"
      @click="sidebarStore.toggleMobile"
    >
      <img class="navbar-toggle-icon" aria-hidden="true" :src="menuIcon" alt="" />
    </button>
  </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar'
import menuIcon from '@/assets/icons/menu.svg'

const sidebarStore = useSidebarStore()
</script>

<style scoped>
/* 移动端菜单开关 */
.navbar-mobile {
  display: none;
}
.navbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  color: var(--text-muted);
  background: none;
  border: 0;
  border-radius: 6px;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.navbar-toggle:hover {
  color: var(--primary);
}
.navbar-toggle:active {
  color: var(--primary);
}
.navbar-toggle-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 767px) {
  .navbar-mobile {
    display: block !important;
  }
}
</style>
