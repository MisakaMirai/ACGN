<template>
  <div class="sidebar-footer">
    <div class="sidebar-theme">
      <button
        v-for="item in THEME_MODES"
        :key="item.value"
        type="button"
        class="theme-btn"
        :class="{ active: themeStore.sourceMode === item.value }"
        :aria-label="item.label"
        :title="item.label"
        @click="themeStore.setMode(item.value)"
      >
        <img class="theme-icon" :src="themeIcons[item.value]" alt="" />
      </button>
      <button
        type="button"
        class="theme-btn theme-btn-mini"
        :aria-label="currentLabel"
        :title="currentLabel"
        @click="cycleTheme"
      >
        <img class="theme-icon" :src="themeIcons[themeStore.sourceMode]" alt="" />
      </button>
    </div>
    <ul class="sidebar-nav-list">
      <li class="sidebar-item">
        <router-link to="/sitetrash" class="sidebar-menu-link">
          <img class="sidebar-cat-icon" :src="trashIcon" alt="" />
          <span class="sidebar-menu-text">失效归档</span>
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/postsite" class="sidebar-menu-link">
          <img class="sidebar-cat-icon" :src="linkIcon" alt="" />
          <span class="sidebar-menu-text">投稿&反馈</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { THEME_MODES, nextThemeMode, themeModeLabel } from '@/utils/theme'
import trashIcon from '@/assets/icons/trash.svg'
import linkIcon from '@/assets/icons/link.svg'
import sunIcon from '@/assets/icons/sun.svg'
import moonIcon from '@/assets/icons/moon.svg'
import autoIcon from '@/assets/icons/auto.svg'

const themeStore = useThemeStore()

const themeIcons = {
  light: sunIcon,
  dark: moonIcon,
  auto: autoIcon,
}

// 当前模式标签（供迷你单钮 tooltip / aria）
const currentLabel = computed(() => themeModeLabel(themeStore.sourceMode))

// 迷你侧栏单钮：点击按 浅色 → 深色 → 跟随系统 循环，图标跟随当前模式
const cycleTheme = () => {
  themeStore.setMode(nextThemeMode(themeStore.sourceMode))
}
</script>

<style scoped>
.sidebar-footer {
  flex-shrink: 0;
  padding: 8px 0;
  border-top: 1px solid var(--divider);
}
.sidebar-theme {
  display: flex;
  gap: 8px;
  padding: 0 12px 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--divider);
}
.theme-btn {
  box-sizing: border-box;
  flex: 1;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: var(--input-bg);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.theme-btn:hover {
  background: var(--sidebar-hover);
}
.theme-btn.active {
  border-color: var(--primary);
}
.theme-icon {
  width: 16px;
  height: 16px;
}
/* 迷你单钮默认隐藏，仅折叠态显示 */
.theme-btn-mini {
  display: none;
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

/* 迷你态变体（.mini-sidebar 在主组件 #sidebar 上） */
.mini-sidebar .sidebar-theme {
  flex-direction: column;
  gap: 4px;
  padding: 0 4px 8px;
}
.mini-sidebar .theme-btn:not(.theme-btn-mini) {
  display: none;
}
.mini-sidebar .theme-btn-mini {
  display: flex;
}
.mini-sidebar .theme-btn {
  flex: none;
  width: 100%;
}
.mini-sidebar .sidebar-menu-text {
  opacity: 0;
}
</style>
