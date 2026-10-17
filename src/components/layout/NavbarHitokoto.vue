<template>
  <div class="navbar-hitokoto desktop-only">
    <div class="navbar-hitokoto-text">
      <span class="hitokoto">{{ hitokotoStore.text }}</span>
      <span v-if="hitokotoStore.from" class="hitokoto-from">—— {{ hitokotoStore.from }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHitokotoStore } from '@/stores/hitokoto'

const hitokotoStore = useHitokotoStore()

onMounted(() => {
  hitokotoStore.init()
})
</script>

<style scoped>
/* 一言容器 */
.navbar-hitokoto {
  display: none;
}
.navbar-hitokoto-text {
  font-size: 0.875rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .navbar-hitokoto {
    display: block;
  }
}
</style>
