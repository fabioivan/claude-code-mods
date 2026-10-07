// A linha do synapse-rate-limit: clima (a "previsão"), uso do contexto, tamanho em
// MB do contexto/anexos, tokens, gráfico dos últimos turnos e variação do último.
import type { HudLine } from '../types'
import { language } from './i18n.js'
import { bytesPercent, fmtDelta, fmtMb, fmtTokens, rowText, spark, weather } from './synapse-format.js'

export type ContextView = {
  percent: number
  bytes: number
  tokens: number
  window: number
  history: number[]
  delta: number | null
}

export function contextRow(v: ContextView, lang: string = language()): HudLine {
  const w = weather(v.percent, lang)
  const sw = weather(bytesPercent(v.bytes), lang)
  const gap = { text: '  ' }
  const row: HudLine = [
    { text: `${w.symbol} ${w.word}`, color: w.color, bold: true },
    gap,
    { text: fmtMb(v.bytes), color: sw.color },
    gap,
    { text: `${fmtTokens(v.tokens).toLowerCase()} / ${fmtTokens(v.window).toLowerCase()}`, dimColor: true },
  ]
  if (v.history.length > 0) row.push(gap, { text: spark(v.history), color: w.color })
  if (v.delta !== null) row.push(gap, { text: `${fmtDelta(v.delta)} ${rowText(lang).lastTurn}`, dimColor: true })
  return row
}
