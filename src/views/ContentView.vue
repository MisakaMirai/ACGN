<template>
  <ContentPage
    v-if="page"
    :page="page"
    :back-to="isSubPage ? '/terms' : ''"
    back-label="返回协议汇总"
  />
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentPage from '@/components/ContentPage.vue'
import { useContentPagesStore } from '@/stores/contentPages'

// 四个静态内容页共用一个视图，由路由 meta.pageKey 指向对应数据
const route = useRoute()
const router = useRouter()
const pagesStore = useContentPagesStore()

const page = computed(() => pagesStore.findByKey(route.meta.pageKey))
const isSubPage = computed(() => route.meta.pageKey !== 'terms')

// 无效 pageKey 不再静默回退到第一页，直接转入 404
watch(
  page,
  (current) => {
    if (!current) router.replace({ name: 'NotFound' })
  },
  { immediate: true }
)
</script>
