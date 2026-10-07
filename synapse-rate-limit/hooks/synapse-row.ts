// A linha do synapse-rate-limit: clima (a "previsão"), uso do contexto, tamanho em
// MB do contexto/anexos, tokens e gráfico dos últimos turnos.
import type { HudLine } from '../types'
import { language } from './i18n.js'
import { bytesPercent, fmtMb, fmtTokens, spark, weather } from './synapse-format.js'

export type ContextView = {
  percent: number
  bytes: number
  tokens: number
  window: number
  history: number[]
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
  return row
}
