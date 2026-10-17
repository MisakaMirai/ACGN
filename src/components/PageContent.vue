<template>
  <div class="content" :class="{ 'content-center': center }"><slot /></div>
</template>

<script setup>
defineProps({
  center: { type: Boolean, default: false },
})
</script>

<style scoped>
.content {
  flex: 1;
  padding: 20px 32px;
}
.content-center {
  text-align: center;
  padding: 60px 20px;
}
@media (max-width: 767px) {
  .content {
    padding: 12px 12px 20px;
  }
  .content-center {
    padding: 40px 16px;
  }
}
</style>
