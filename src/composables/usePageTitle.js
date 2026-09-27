import { computed, unref } from 'vue'
import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'

const DEFAULT_TITLE = 'MyACGN - ACG二次元导航盒子'
const PAGE_TITLE_SUFFIX = ' | MyACGN'
// 统一封装页面标题逻辑：传入 ref 时使用动态标题，否则回退到 route.meta.title，
// 最终未命中则使用 DEFAULT_TITLE。除默认标题外，均拼接 PAGE_TITLE_SUFFIX。
export function usePageTitle(titleRef) {
  const route = useRoute()
  const pageTitle = computed(() => {
    const raw = titleRef ? unref(titleRef) : route.meta?.title
    if (!raw) return DEFAULT_TITLE
    return `${raw}${PAGE_TITLE_SUFFIX}`
  })
  useTitle(pageTitle)
  return pageTitle
}
