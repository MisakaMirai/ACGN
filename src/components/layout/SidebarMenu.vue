<template>
  <div class="sidebar-menu">
    <SidebarNavList :items="items" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSitesStore } from '@/stores/sites'
import { resolveNavIcon } from '@/utils/siteIcon'
import SidebarNavList from './SidebarNavList.vue'

const store = useSitesStore()

const items = computed(() =>
  store.categories.map((cat) => ({
    key: cat.id,
    to: { path: '/', hash: '#' + cat.id },
    icon: resolveNavIcon(cat.icon),
    label: cat.name,
  }))
)
</script>

<style scoped>
.sidebar-menu {
  flex: 1 1 auto;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
