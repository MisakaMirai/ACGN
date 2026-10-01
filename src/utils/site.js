// 站点相关的纯判定：'新收录' 不在数据里手工标记，按收录日期推算
const DAY_MS = 86400000
export const NEW_SITE_DAYS = 30

// createdAt 形如 '2026-05-11 00:00:00'，补成 ISO 形式再解析（Safari 不认空格分隔）
const parseCreatedAt = (value = '') => Date.parse(value.replace(' ', 'T'))

// 收录日期在 days 天以内算新站点
export const isNewSite = (site, days = NEW_SITE_DAYS, now = Date.now()) => {
  const created = parseCreatedAt(site?.createdAt)
  if (Number.isNaN(created)) return false
  return now - created < days * DAY_MS
}
