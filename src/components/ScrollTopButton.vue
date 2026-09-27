<template>
  <button v-show="visible" type="button" class="go-up" aria-label="返回顶部" @click="scrollToTop">
    <img class="go-up-icon" aria-hidden="true" :src="arrowUpIcon" alt="" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useScroll } from '@vueuse/core'
import arrowUpIcon from '@/assets/icons/arrow-up.svg'
import { mainScroller, scrollMainTo } from '@/composables/useMainScroll'

// 右侧内容区是独立滚动容器，显隐交给 useScroll
const { y } = useScroll(mainScroller)
const visible = computed(() => y.value >= 50)

const scrollToTop = () => {
  scrollMainTo(0)
}
</script>

<style scoped>
.go-up {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1082;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--footer-btn-text);
  background: var(--footer-btn-bg);
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.go-up:hover {
  color: var(--text);
}
.go-up-icon {
  width: 18px;
  height: 18px;
}
@media (max-width: 767px) {
  .go-up {
    right: 10px;
    bottom: 15px;
  }
}
</style>
