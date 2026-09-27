import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { resolveThemeClass, THEME_DARK, THEME_LIGHT, THEME_STORAGE_KEY } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  // useColorMode 声明式管理主题：localStorage 持久化、系统偏好跟随、html 类名切换
  // html 底色由 CSS 变量（html { background: var(--bg) }）跟随类名，无需手动写内联样式
  const colorMode = useColorMode({
    selector: 'html',
    attribute: 'class',
    modes: { [THEME_DARK]: THEME_DARK, [THEME_LIGHT]: THEME_LIGHT },
    storageKey: THEME_STORAGE_KEY,
  })

  // 实际生效模式（'auto' 已解析为 dark/light）
  const isDark = computed(() => colorMode.value === THEME_DARK)
  const mode = computed(() => colorMode.value)
  const sourceMode = computed(() => colorMode.store.value)
  const themeClass = computed(() => resolveThemeClass(isDark.value))

  const setMode = (next) => {
    colorMode.value = next
  }
  const toggle = () => {
    colorMode.value = isDark.value ? THEME_LIGHT : THEME_DARK
  }

  return { isDark, mode, sourceMode, themeClass, toggle, setMode }
})
