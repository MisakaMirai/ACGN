<template>
  <div :ref="registerScroller" class="main-layout">
    <router-view />
    <TheFooter />
  </div>
</template>

<script setup>
import TheFooter from './TheFooter.vue'
import { registerScroller } from '@/composables/useMainScroll'
// 右侧内容区滚动容器：顶栏/侧边栏在滚动容器之外，页面滚动全部发生在这里
</script>

<style scoped>
.main-layout {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
