import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isMobileOpen = ref(false)
  const isMinimized = ref(false)

  const hide = () => {
    isMobileOpen.value = false
  }

  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  // 展开/折叠为 mini
  const toggleMini = () => {
    isMinimized.value = !isMinimized.value
  }

  const handleResize = () => {
    const winWidth = window.innerWidth
    if (winWidth < 768) {
      isMinimized.value = false
      hide()
    } else if (winWidth < 1024) {
      if (!isMinimized.value) isMinimized.value = true
    } else if (isMinimized.value) {
      isMinimized.value = false
    }
  }

  // 全局监听：Esc 关闭移动端抽屉；窗口尺寸变化同步折叠态。
  // 移动端遮罩/抽屉内链接的关闭逻辑分别在 TheSidebar 组件内处理。
  const initInteraction = () => {
    const onKeydown = (e) => {
      if (e.key === 'Escape' && isMobileOpen.value) {
        hide()
      }
    }

    let resizeTimer = null
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 200)
    }

    window.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', onResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }

  return {
    isMobileOpen,
    isMinimized,
    hide,
    toggleMobile,
    toggleMini,
    initInteraction,
  }
})
