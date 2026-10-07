// A linha do synapse-rate-limit: clima (a "previsão"), uso do contexto, tamanho em
// MB do contexto/anexos, tokens, gráfico dos últimos turnos e variação do último.
import type { HudLine } from '../types'
import { bytesPercent, fmtDelta, fmtMb, fmtTokens, spark, weather } from './synapse-format.js'

export type ContextView = {
  percent: number
  bytes: number
  tokens: number
  window: number
  history: number[]
  delta: number | null
}

export function contextRow(v: ContextView): HudLine {
  const w = weather(v.percent)
  const sw = weather(bytesPercent(v.bytes))
  const gap = { text: '  ' }
  const row: HudLine = [
    { text: `${w.symbol} ${w.word}`, color: w.color, bold: true },
    gap,
    { text: fmtMb(v.bytes), color: sw.color },
    gap,
    { text: `${fmtTokens(v.tokens).toLowerCase()} / ${fmtTokens(v.window).toLowerCase()}`, dimColor: true },
  ]
  if (v.history.length > 0) row.push(gap, { text: spark(v.history), color: w.color })
  if (v.delta !== null) row.push(gap, { text: `${fmtDelta(v.delta)} no último turno`, dimColor: true })
  return row
}
