// Compacta sozinho quando o contexto passa de MAX_PERCENT ou o payload de MAX_BYTES.
// Os limites vão para o atom `limits`, que o synapse-rate-limit desenha ao lado dos MB.
import { atom, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { GuardLimits } from '../types'

const DEFAULT_MB = 16
const DEFAULT_PERCENT = 100

const limits = atom({ plugin: 'ctx-bytes-guard', key: 'limits' } as const, null as GuardLimits | null)

// Declarada no topo do módulo: o motor só aceita `$` repassado a função assim.
// Devolve o motivo quando a compactação não aconteceu, para o hook avisar.
async function check($: EngineInterface, maxBytes: number, maxPercent: number): Promise<string | null> {
  await update($, limits, () => ({ maxBytes, maxPercent }))

  const msgs = await $.session.messages({ as: 'api' })
  // ponytail: JSON.stringify materializes the payload; fine at ~16MB, stream-count if it hurts
  const bytes = Array.isArray(msgs) ? JSON.stringify(msgs).length : 0
  const { context } = await $.session.usage()
  const percent = context.percent ?? 0

  if (bytes < maxBytes && percent < maxPercent) return null

  $.ui.toast(`auto-compact: ${percent}% / ${(bytes / 1048576).toFixed(1)}MB`)
  const result = await $.session.compact()
  return result && 'skip' in result && result.skip ? `compactação vetada: ${result.skip}` : null
}

export const register: Register = (on, options) => {
  const mb = typeof options.maxMb === 'number' && options.maxMb > 0 ? options.maxMb : DEFAULT_MB
  const maxBytes = mb * 1024 * 1024
  const maxPercent =
    typeof options.maxPercent === 'number' && options.maxPercent > 0 ? options.maxPercent : DEFAULT_PERCENT

  // Antes de cada mensagem: compactar com o turno em andamento é recusado, e o erro de request grande
  // acontece justamente durante o turno.
  on('prompt.submit', async ($, e, next) => {
    const why = await check($, maxBytes, maxPercent).catch((err) => `falhou: ${String(err)}`)
    if (why) $.ui.toast(`ctx-bytes-guard: ${why}`)
    return next(e)
  })

  // Depois do turno: cobre o que cresceu durante ele.
  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    if (e.agentId === undefined) {
      const why = await check($, maxBytes, maxPercent).catch((err) => `falhou: ${String(err)}`)
      if (why) $.ui.toast(`ctx-bytes-guard: ${why}`)
    }
    return ran
  })
}