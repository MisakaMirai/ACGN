<template>
  <div
    id="sidebar"
    class="sidebar-nav sidebar"
    :class="{ show: sidebarStore.isMobileOpen, 'mini-sidebar': sidebarStore.isMinimized }"
  >
    <div class="sidebar-overlay" @click="sidebarStore.hide()" />
    <div class="sidebar-nav-inner" @click="handleNavClick">
      <SidebarLogo />
      <SidebarMenu />
      <SidebarFooter />
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar'
import SidebarLogo from './SidebarLogo.vue'
import SidebarMenu from './SidebarMenu.vue'
import SidebarFooter from './SidebarFooter.vue'

const sidebarStore = useSidebarStore()

// 移动端点击抽屉内导航链接后收起抽屉（外链新标签页不关闭）
const handleNavClick = (event) => {
  const link = event.target.closest('a')
  if (!link || link.target === '_blank') return
  sidebarStore.hide()
}
</script>

<style scoped>
.sidebar-nav {
  --divider: rgba(129, 129, 129, 0.15);
  flex: 0 0 150px;
  font-size: 0.75rem;
  height: 100%;
  z-index: 1080;
  position: sticky;
  top: 0;
  background: var(--sidebar-bg);
  transition: flex-basis 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.sidebar-nav.mini-sidebar {
  flex-basis: 60px;
}
/* 透明遮罩仅移动端显示，桌面端不占位 */
.sidebar-overlay {
  display: none;
}
.sidebar-nav-inner {
  width: inherit;
  margin: 0;
  max-width: 190px;
  background: var(--sidebar-bg);
  pointer-events: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: background-color 0.3s;
  overflow: hidden;
}

/* 移动端侧边栏：透明遮罩 + 抽屉 */
@media (max-width: 767px) {
  .sidebar-nav {
    background: transparent !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    position: fixed !important;
    z-index: 1090 !important;
    display: block !important;
    padding-left: 0 !important;
    visibility: hidden;
    transition: visibility 0.2s;
    pointer-events: none;
  }
  .sidebar-nav.show {
    visibility: visible;
    pointer-events: auto;
  }
  /* 铺满视口的透明层，负责点击空白处关闭抽屉 */
  .sidebar-overlay {
    display: block;
    position: absolute;
    inset: 0;
  }
  .sidebar-nav .sidebar-nav-inner {
    position: fixed;
    z-index: 1;
    height: 100%;
    width: 17.5rem;
    will-change: transform;
    transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateX(-100%);
  }
  .sidebar-nav.show .sidebar-nav-inner {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
  }
}
</style>
