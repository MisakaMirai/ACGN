<template>
  <div class="sidebar-logo">
    <div class="logo overflow-hidden">
      <router-link to="/" class="sidebar-logo-link">
        <img class="logo-img" :src="logoUrl" height="40" alt="ACGN" loading="lazy" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import logoUrl from '@/assets/images/20210727002253-59085.jpeg'
</script>

<style scoped>
.sidebar-logo {
  box-sizing: border-box;
  height: 74px;
  background: var(--sidebar-bg);
  border-bottom: 1px solid var(--divider);
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}
.sidebar-logo-link {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.logo-img {
  max-height: 40px;
  width: auto;
}
/* 迷你态 logo 缩小（.mini-sidebar 在主组件 #sidebar 上，子组件后代选择器可命中） */
.mini-sidebar .logo-img {
  max-height: 32px;
}
</style>
