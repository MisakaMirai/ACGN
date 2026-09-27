// Fisher–Yates 洗牌，返回新数组
export function shuffle(array) {
  const pool = [...array]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}
