// 主题纯逻辑：常量、html 类名解析与模式切换（无状态，可单测）
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const THEME_AUTO = 'auto'
export const THEME_STORAGE_KEY = 'theme-mode'

export const THEME_MODES = [
  { value: THEME_LIGHT, label: '浅色' },
  { value: THEME_DARK, label: '深色' },
  { value: THEME_AUTO, label: '跟随系统' },
]

// 'auto' 已被 useColorMode 解析为 dark/light，此处只取实际生效的 html 类名
export const resolveThemeClass = (mode) => (mode === THEME_DARK ? THEME_DARK : THEME_LIGHT)

export const themeModeLabel = (mode) => THEME_MODES.find((item) => item.value === mode)?.label ?? ''

export const nextThemeMode = (mode) => {
  const idx = THEME_MODES.findIndex((item) => item.value === mode)
  return THEME_MODES[(idx + 1) % THEME_MODES.length].value
}
