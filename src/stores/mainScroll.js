import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

// 右侧内容区（TheMainLayout）是独立滚动容器，窗口本身不滚动，
// 所以路由切换与返回顶部都作用在它上面。元素由布局组件用函数 ref 注册进来。
export const useMainScrollStore = defineStore('mainScroll', () => {
  const scroller = shallowRef(null)

  const registerScroller = (el) => {
    scroller.value = el
  }

  const scrollTo = (top, behavior = 'smooth') => {
    scroller.value?.scrollTo({ top, behavior })
  }

  return { scroller, registerScroller, scrollTo }
})
