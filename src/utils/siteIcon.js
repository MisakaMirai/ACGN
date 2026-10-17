const BASE_URL = import.meta.env.BASE_URL

const DEFAULT_ICON = '/icons/default.png'
const DEFAULT_NAV_ICON = '/icons/nav/link.svg'

const isAbsoluteUrl = (path) => /^(?:https?:)?\/\//.test(path)
const withBase = (path) => `${BASE_URL}${path.replace(/^\//, '')}`

export function resolveIcon(icon) {
  if (!icon) return withBase(DEFAULT_ICON)
  return isAbsoluteUrl(icon) ? icon : withBase(icon)
}

export function resolveNavIcon(icon) {
  if (!icon) return withBase(DEFAULT_NAV_ICON)
  return isAbsoluteUrl(icon) ? icon : withBase(icon)
}

// 图标加载失败时回退到默认图，站点图标与导航图标各用各的兜底
export function handleIconError(event) {
  if (event.target) {
    event.target.src = withBase(DEFAULT_ICON)
  }
}

export function handleNavIconError(event) {
  if (event.target) {
    event.target.src = withBase(DEFAULT_NAV_ICON)
  }
}
