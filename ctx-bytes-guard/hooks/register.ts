// Compacta sozinho quando o contexto passa de MAX_PERCENT ou o payload de MAX_BYTES.
// Em sessão headless (-p / SDK) compacta com o comando /compact ao fim do turno.
// Os limites vão para o atom `limits`, que o synapse-rate-limit desenha ao lado dos MB.
import { atom, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { GuardLimits } from '../types'

const DEFAULT_MB = 16
const DEFAULT_PERCENT = 100

const limits = atom({ plugin: 'ctx-bytes-guard', key: 'limits' } as const, null as GuardLimits | null)

interface Guard {
  maxBytes: number
  maxPercent: number
  // Sessões headless (-p / SDK) recusam `$.session.compact`: lá a compactação só roda como o comando
  // /compact, e só depois do turno. Vira true na primeira recusa.
  headless: boolean
}

const HEADLESS_RE = /headless/i
const DEFER_RE = /later event/i

// Declarada no topo do módulo: o motor só aceita `$` repassado a função assim.
// Devolve o motivo quando a compactação não aconteceu, para o hook avisar.
async function check($: EngineInterface, guard: Guard, when: 'submit' | 'turn'): Promise<string | null> {
  await update($, limits, () => ({ maxBytes: guard.maxBytes, maxPercent: guard.maxPercent }))

  const msgs = await $.session.messages({ as: 'api' })
  // ponytail: JSON.stringify materializes the payload; fine at ~16MB, stream-count if it hurts
  const bytes = Array.isArray(msgs) ? JSON.stringify(msgs).length : 0
  const { context } = await $.session.usage()
  const percent = context.percent ?? 0

  if (bytes < guard.maxBytes && percent < guard.maxPercent) return null

  if (!guard.headless) {
    $.ui.toast(`auto-compact: ${percent}% / ${(bytes / 1048576).toFixed(1)}MB`)
    try {
      const result = await $.session.compact()
      return result && 'skip' in result && result.skip ? `compactação vetada: ${result.skip}` : null
    } catch (err) {
      const msg = String(err)
      // O motor recusa compactar de dentro do prompt.submit (o turno está preso): fica para o turn.complete.
      if (when === 'submit' && DEFER_RE.test(msg)) return null
      if (!HEADLESS_RE.test(msg)) throw err
      guard.headless = true
    }
  }

  // Headless: antes da mensagem o turno está preso e /compact esperaria por ele; depois do turno roda.
  if (when === 'submit') return null
  await $.command.run({ command: 'compact' })
  return null
}

async function run($: EngineInterface, guard: Guard, when: 'submit' | 'turn'): Promise<void> {
  try {
    const why = await check($, guard, when)
    if (why) $.ui.toast(`ctx-bytes-guard: ${why}`)
  } catch (err) {
    $.ui.toast(`ctx-bytes-guard: falhou: ${String(err)}`)
  }
}

export const register: Register = (on, options) => {
  const mb = typeof options.maxMb === 'number' && options.maxMb > 0 ? options.maxMb : DEFAULT_MB
  const guard: Guard = { maxBytes: mb * 1024 * 1024, maxPercent: 0, headless: false }
  guard.maxPercent =
    typeof options.maxPercent === 'number' && options.maxPercent > 0 ? options.maxPercent : DEFAULT_PERCENT

  // Antes de cada mensagem: compactar com o turno em andamento é recusado, e o erro de request grande
  // acontece justamente durante o turno.
  on('prompt.submit', async ($, e, next) => {
    await run($, guard, 'submit')
    return next(e)
  })

  // Depois do turno: cobre o que cresceu durante ele.
  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    if (e.agentId === undefined) {
      await run($, guard, 'turn')
    }
    return ran
  })
}