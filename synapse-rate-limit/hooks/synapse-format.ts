export const MAX_BYTES = 32 * 1024 * 1024
export const MAX_TURNS = 12

export type Weather = { symbol: string; word: string; color: string }

export function weather(percent: number): Weather {
  if (percent >= 90) return { symbol: '!', word: 'Compacta logo', color: 'red' }
  if (percent >= 75) return { symbol: '↯', word: 'Tempestade', color: 'magenta' }
  if (percent >= 50) return { symbol: '☂', word: 'Chuva', color: 'blue' }
  if (percent >= 25) return { symbol: '☁', word: 'Nublado', color: 'cyan' }
  return { symbol: '☀', word: 'Limpo', color: 'yellow' }
}

export function fmtTokens(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`
  }
  if (n >= 1000) return `${Math.round(n / 1000)}K`
  return String(n)
}

export function fmtDelta(n: number): string {
  if (n >= 1_000_000) return `+${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `+${Math.round(n / 1000)}k`
  return `+${n}`
}

const BARS = '▁▂▃▄▅▆▇█'

export function spark(values: number[]): string {
  return values
    .map(v => BARS[Math.min(7, Math.max(0, Math.floor((v / 100) * 8)))])
    .join('')
}

export function bytesPercent(bytes: number): number {
  return Math.min(100, (bytes / MAX_BYTES) * 100)
}

export function fmtMb(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`
}
