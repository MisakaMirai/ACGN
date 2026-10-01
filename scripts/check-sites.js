#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sitesPath = path.join(__dirname, '../src/data/sites.json')

const DEFAULTS = {
  concurrency: 10,
  timeout: 12000,
  retries: 1,
  redirectLimit: 5,
  threshold: 2,
  slowMs: 3000,
  userAgent:
    'Mozilla/5.0 (compatible; ACGN-HealthCheck/1.0; +https://acgn-world.com)',
}

const HARD_DEAD_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENETDOWN',
  'ERR_TLS_CERT_ALTNAME_INVALID',
  'CERT_HAS_EXPIRED',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'SELF_SIGNED_CERT_IN_CHAIN',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
])

const UNSTABLE_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
  'UND_ERR_SOCKET',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
])

const DEAD_HTTP = new Set([404, 410, 451])
const BLOCKED_HTTP = new Set([401, 403, 407, 429])

const STATUS = {
  ALIVE: 'alive',
  BLOCKED: 'alive_blocked',
  DEAD: 'dead',
  UNSTABLE: 'unstable',
}

function parseArgs(argv) {
  const opts = { ...DEFAULTS, targets: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    const next = () => argv[++i]
    switch (arg) {
      case '--concurrency':
        opts.concurrency = Math.max(1, Number(next()))
        break
      case '--timeout':
        opts.timeout = Math.max(1000, Number(next()))
        break
      case '--retries':
        opts.retries = Math.max(0, Number(next()))
        break
      case '--threshold':
        opts.threshold = Math.max(1, Number(next()))
        break
      case '--slow':
        opts.slowMs = Math.max(0, Number(next()))
        break
      case '--state':
        opts.statePath = next()
        break
      case '--report':
        opts.reportPath = next()
        break
      case '--url':
        opts.targets = [...(opts.targets || []), next()]
        break
      case '--fail-on-dead':
        opts.failOnDead = true
        break
      case '--help':
        opts.help = true
        break
      default:
        if (arg.startsWith('--')) throw new Error(`未知参数: ${arg}`)
    }
  }
  return opts
}

const HELP = `
站点存活探活（HTTP 层）

用法: node scripts/check-sites.js [选项]

选项:
  --concurrency <n>   并发请求数，默认 10
  --timeout <ms>      单次请求超时，默认 12000
  --retries <n>       失败重试次数，默认 1
  --threshold <n>     连续判定为失效的轮次阈值，默认 2
  --slow <ms>         响应超过该毫秒数标记为 slow，默认 3000
  --state <path>      跨轮次状态文件，用于抑制误报
  --report <path>     报告输出路径
  --url <url>         只探测指定 URL（可重复），跳过 sites.json
  --fail-on-dead      存在确认失效站点时以退出码 1 结束
  --help              显示本帮助

状态说明:
  alive            正常响应
  alive_blocked    站点存活但拒绝探活（401/403/429 等风控）
  dead             硬性失效（DNS 失败、拒绝连接、证书错误、404/410/451）
  unstable         不确定（超时、连接重置、5xx、重定向异常）

只有连续 threshold 轮都是 dead 才计入「确认失效」，避免风控与抖动造成误报。
`

function loadTargets(urls) {
  if (urls && urls.length > 0) {
    return urls.map((url) => ({ id: `url:${url}`, name: url, url, categoryName: '指定 URL' }))
  }
  const data = JSON.parse(fs.readFileSync(sitesPath, 'utf8'))
  const targets = []
  const walk = (cats, parentName) => {
    for (const cat of cats) {
      const label = parentName ? `${parentName} / ${cat.name}` : cat.name
      for (const site of cat.sites || []) {
        if (site.disabledAt) continue
        if (!site.url) continue
        targets.push({
          id: site.id,
          name: site.name,
          url: site.url,
          categoryName: label,
        })
      }
      if (cat.children) walk(cat.children, label)
    }
  }
  walk(data.categories, null)
  return targets
}

function loadState(statePath) {
  if (!statePath || !fs.existsSync(statePath)) return { runs: 0, sites: {} }
  try {
    const data = JSON.parse(fs.readFileSync(statePath, 'utf8'))
    return { runs: data.runs || 0, sites: data.sites || {} }
  } catch {
    return { runs: 0, sites: {} }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function writeFileEnsured(filePath, content) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

function classifyError(error) {
  const code = error?.cause?.code || error?.code || ''
  if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
    return { status: STATUS.UNSTABLE, reason: '请求超时' }
  }
  if (HARD_DEAD_CODES.has(code)) {
    return { status: STATUS.DEAD, reason: code }
  }
  if (UNSTABLE_CODES.has(code)) {
    return { status: STATUS.UNSTABLE, reason: code }
  }
  return { status: STATUS.UNSTABLE, reason: code || error?.message || '未知错误' }
}

async function probeOnce(target, opts) {
  const started = Date.now()
  let current = target.url
  let redirects = 0

  for (;;) {
    let response
    try {
      response = await fetch(current, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(opts.timeout),
        headers: { 'User-Agent': opts.userAgent, Accept: '*/*' },
      })
    } catch (error) {
      return { ...classifyError(error), ms: Date.now() - started, finalUrl: current, statusCode: 0 }
    }

    const location = response.headers.get('location')
    if (response.status >= 300 && response.status < 400 && location) {
      redirects++
      if (redirects > opts.redirectLimit) {
        return {
          status: STATUS.UNSTABLE,
          reason: `重定向超过 ${opts.redirectLimit} 次`,
          ms: Date.now() - started,
          finalUrl: current,
          statusCode: response.status,
          redirects,
        }
      }
      try {
        current = new URL(location, current).toString()
      } catch {
        return {
          status: STATUS.UNSTABLE,
          reason: `非法重定向地址: ${location}`,
          ms: Date.now() - started,
          finalUrl: current,
          statusCode: response.status,
          redirects,
        }
      }
      continue
    }

    const ms = Date.now() - started
    const statusCode = response.status
    const finalUrl = current
    const redirectsDone = redirects

    if ((statusCode === 405 || statusCode === 501) && redirectsDone === 0) {
      try {
        const getResponse = await fetch(finalUrl, {
          method: 'GET',
          redirect: 'manual',
          signal: AbortSignal.timeout(opts.timeout),
          headers: { 'User-Agent': opts.userAgent, Accept: 'text/html,*/*' },
        })
        return finish(getResponse.status, getResponse.headers.get('location'), {
          ms: Date.now() - started,
          finalUrl,
          redirects: redirectsDone,
          method: 'GET',
        })
      } catch (error) {
        return { ...classifyError(error), ms: Date.now() - started, finalUrl, statusCode: 0 }
      }
    }

    return finish(statusCode, location, { ms, finalUrl, redirects: redirectsDone, method: 'HEAD' })
  }

  function finish(code, location, meta) {
    if (DEAD_HTTP.has(code)) {
      return { status: STATUS.DEAD, reason: `HTTP ${code}`, ...meta, statusCode: code }
    }
    if (BLOCKED_HTTP.has(code)) {
      return { status: STATUS.BLOCKED, reason: `HTTP ${code}（风控/需鉴权）`, ...meta, statusCode: code }
    }
    if (code >= 500) {
      return { status: STATUS.UNSTABLE, reason: `HTTP ${code}`, ...meta, statusCode: code }
    }
    if (code >= 400) {
      return { status: STATUS.UNSTABLE, reason: `HTTP ${code}`, ...meta, statusCode: code }
    }
    const slow = meta.ms > opts.slowMs ? `，响应 ${meta.ms}ms 偏慢` : ''
    const redirected = meta.redirects > 0 ? `，${meta.redirects} 次重定向` : ''
    return {
      status: STATUS.ALIVE,
      reason: `HTTP ${code}${redirected}${slow}`,
      ...meta,
      statusCode: code,
      location,
    }
  }
}

async function probeWithRetry(target, opts) {
  let last
  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    last = await probeOnce(target, opts)
    if (last.status === STATUS.ALIVE || last.status === STATUS.BLOCKED) break
    if (attempt < opts.retries) await sleep(800 * (attempt + 1))
  }
  return { ...last, id: target.id, name: target.name, url: target.url, categoryName: target.categoryName }
}

async function runPool(targets, opts, onResult) {
  const results = []
  let cursor = 0
  let done = 0

  const worker = async () => {
    for (;;) {
      const index = cursor++
      if (index >= targets.length) return
      const target = targets[index]
      const result = await probeWithRetry(target, opts)
      results[index] = result
      done++
      if (onResult) onResult(result, done, targets.length)
    }
  }

  const workers = Array.from({ length: Math.min(opts.concurrency, targets.length) }, worker)
  await Promise.all(workers)
  return results
}

const LABEL = {
  [STATUS.ALIVE]: '正常',
  [STATUS.BLOCKED]: '存活但风控',
  [STATUS.DEAD]: '失效',
  [STATUS.UNSTABLE]: '不确定',
}

function mergeState(prev, results, opts) {
  const sites = {}
  const confirmedDead = []

  for (const result of results) {
    const key = String(result.id)
    const old = prev.sites[key] || { consecutiveDead: 0 }
    const dead = result.status === STATUS.DEAD
    const consecutiveDead = dead ? (old.consecutiveDead || 0) + 1 : 0
    const entry = {
      id: result.id,
      name: result.name,
      url: result.url,
      categoryName: result.categoryName,
      status: result.status,
      statusCode: result.statusCode || 0,
      reason: result.reason,
      finalUrl: result.finalUrl,
      ms: result.ms,
      consecutiveDead,
      confirmed: consecutiveDead >= opts.threshold,
    }
    sites[key] = entry
    if (entry.confirmed) confirmedDead.push(entry)
  }

  return { version: 1, updatedAt: new Date().toISOString(), runs: (prev.runs || 0) + 1, sites, confirmedDead }
}

function buildMarkdown(state, results, opts) {
  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  const lines = []
  lines.push('## 站点探活报告')
  lines.push('')
  lines.push(`- 探测时间：${state.updatedAt}`)
  lines.push(`- 第 ${state.runs} 轮，共 ${results.length} 个站点`)
  lines.push(
    `- 正常 ${counts[STATUS.ALIVE] || 0} · 存活但风控 ${counts[STATUS.BLOCKED] || 0} · 不确定 ${counts[STATUS.UNSTABLE] || 0} · 失效 ${counts[STATUS.DEAD] || 0}`
  )
  lines.push(`- 确认失效（连续 ${opts.threshold} 轮 dead）：${state.confirmedDead.length}`)
  lines.push('')

  const notable = results
    .filter((r) => r.status !== STATUS.ALIVE)
    .sort((a, b) => a.status.localeCompare(b.status) || String(a.name).localeCompare(String(b.name)))

  if (notable.length > 0) {
    lines.push('### 非正常响应')
    lines.push('')
    lines.push('| 站点 | 分类 | URL | 判定 | 详情 | 连续失效 |')
    lines.push('| --- | --- | --- | --- | --- | --- |')
    for (const r of notable) {
      const entry = state.sites[String(r.id)]
      const streak = entry?.consecutiveDead || 0
      lines.push(
        `| ${md(r.name)} | ${md(r.categoryName)} | ${md(r.url)} | ${LABEL[r.status]} | ${md(r.reason)} | ${streak}/${opts.threshold} |`
      )
    }
    lines.push('')
  }

  if (state.confirmedDead.length > 0) {
    lines.push('### 确认失效（建议移入 sitetrash.json）')
    lines.push('')
    for (const s of state.confirmedDead) {
      lines.push(`- **${s.name}** — ${s.url} — ${s.reason}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function md(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

function writeStepSummary(text) {
  const file = process.env.GITHUB_STEP_SUMMARY
  if (!file) return
  fs.appendFileSync(file, `${text}\n`, 'utf8')
}

function writeOutput(key, value) {
  const file = process.env.GITHUB_OUTPUT
  if (!file) return
  fs.appendFileSync(file, `${key}=${value}\n`, 'utf8')
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    process.stdout.write(HELP)
    return
  }

  const targets = loadTargets(opts.targets)
  if (targets.length === 0) {
    console.error('没有可探测的站点')
    process.exit(1)
  }

  console.log(
    `开始探活 ${targets.length} 个站点（并发 ${opts.concurrency}，超时 ${opts.timeout}ms，阈值 ${opts.threshold} 轮）...\n`
  )

  const results = await runPool(targets, opts, (result, done) => {
    const mark = result.status === STATUS.ALIVE ? '✓' : '!'
    console.log(`[${done}/${targets.length}] ${mark} ${result.name} — ${result.reason}`)
  })

  const prevState = loadState(opts.statePath)
  const state = mergeState(prevState, results, opts)

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  console.log('\n探活完成')
  console.log(`  正常：${counts[STATUS.ALIVE] || 0}`)
  console.log(`  存活但风控：${counts[STATUS.BLOCKED] || 0}`)
  console.log(`  不确定：${counts[STATUS.UNSTABLE] || 0}`)
  console.log(`  失效：${counts[STATUS.DEAD] || 0}`)
  console.log(`  确认失效（连续 ${opts.threshold} 轮）：${state.confirmedDead.length}`)

  if (opts.statePath) {
    writeFileEnsured(opts.statePath, `${JSON.stringify(state, null, 2)}\n`)
    console.log(`\n状态已写入 ${opts.statePath}`)
  }

  const markdown = buildMarkdown(state, results, opts)
  if (opts.reportPath) {
    writeFileEnsured(opts.reportPath, `${markdown}\n`)
    console.log(`报告已写入 ${opts.reportPath}`)
  }
  writeStepSummary(markdown)

  const payload = JSON.stringify(
    {
      updatedAt: state.updatedAt,
      runs: state.runs,
      total: results.length,
      counts,
      confirmedDead: state.confirmedDead.map((s) => ({
        id: s.id,
        name: s.name,
        url: s.url,
        reason: s.reason,
        consecutiveDead: s.consecutiveDead,
      })),
    },
    null,
    2
  )
  if (opts.reportPath) {
    writeFileEnsured(opts.reportPath.replace(/\.md$/i, '') + '.json', `${payload}\n`)
  }
  writeOutput('confirmed-dead-count', String(state.confirmedDead.length))
  if (opts.reportPath) {
    writeOutput('report-path', opts.reportPath)
  }

  if (opts.failOnDead && state.confirmedDead.length > 0) process.exit(1)
}

main().catch((error) => {
  console.error('探活脚本异常:', error)
  process.exit(1)
})
