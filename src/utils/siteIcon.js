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

export function handleIconError(event) {
  if (event.target) {
    event.target.src = withBase(DEFAULT_ICON)
  }
}
