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
    <SidebarNavList :items="footerItems" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { THEME_MODES, nextThemeMode, themeModeLabel } from '@/utils/theme'
import SidebarNavList from './SidebarNavList.vue'
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

// 页脚固定入口：图标为已打包的静态资源地址
const footerItems = [
  { key: 'sitetrash', to: '/sitetrash', icon: trashIcon, label: '失效归档' },
  { key: 'postsite', to: '/postsite', icon: linkIcon, label: '投稿&反馈' },
]

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
</style>
