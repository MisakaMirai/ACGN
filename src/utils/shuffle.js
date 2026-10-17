// Fisher–Yates 洗牌的核心实现，随机源由调用方注入
const shuffleWith = (array, random) => {
  const pool = [...array]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

// 把任意值散列成 32 位无符号整数种子（FNV-1a）
const hashSeed = (input) => {
  const str = String(input)
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// mulberry32：小体积、质量足够的确定性伪随机数生成器
const createRandom = (seed) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Fisher–Yates 洗牌，返回新数组
export function shuffle(array) {
  return shuffleWith(array, Math.random)
}

// 以 seed（数字或字符串）为随机源的洗牌：同一 seed 结果稳定，不同 seed 看起来随机
export function seededShuffle(array, seed) {
  const numericSeed = typeof seed === 'number' ? seed : hashSeed(seed)
  return shuffleWith(array, createRandom(numericSeed))
}
