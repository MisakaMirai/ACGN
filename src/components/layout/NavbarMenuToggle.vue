<template>
  <div class="navbar-btn desktop-only">
    <button
      class="menu-label"
      type="button"
      :class="{ 'is-open': !sidebarStore.isMinimized }"
      :aria-expanded="!sidebarStore.isMinimized"
      :aria-label="sidebarStore.isMinimized ? '展开侧边栏' : '收起侧边栏'"
      @click="sidebarStore.toggleMini()"
    >
      <svg class="menu-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path class="menu-path line-1" d="M0 40h62c18 0 18-20-17 5L31 55"></path>
        <path class="menu-path line-2" d="M0 50h80"></path>
        <path class="menu-path line-3" d="M0 60h62c18 20 18 20-17 5L31 45"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()
</script>

<style scoped>
/* 菜单按钮与 SVG 动画 */
.navbar-btn {
  height: 74px;
  width: 40px;
  border-radius: 6px;
  cursor: pointer;
}
.navbar-btn .menu-svg {
  margin: 0 -20px;
  height: 74px;
}
.navbar-btn .menu-path {
  fill: none;
  stroke: var(--icon-muted);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  --length: 24;
  --offset: -38;
  stroke-dasharray: var(--length) var(--total-length);
  stroke-dashoffset: var(--offset);
  transition:
    stroke-dasharray 0.5s cubic-bezier(0.645, 0.045, 0.355, 1),
    stroke-dashoffset 0.5s cubic-bezier(0.645, 0.045, 0.355, 1),
    stroke 0.2s;
}
.navbar-btn .menu-label {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.navbar-btn .menu-label.is-open .line-1,
.navbar-btn .menu-label.is-open .line-3 {
  --length: 12.602325267;
}
.navbar-btn .line-1,
.navbar-btn .line-3 {
  --total-length: 126.38166809082031;
}
.navbar-btn .line-2 {
  --total-length: 80;
}
.navbar-btn .menu-label:hover .menu-path {
  stroke: var(--primary);
}
</style>
