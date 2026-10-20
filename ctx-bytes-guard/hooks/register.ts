// Compacta sozinho quando o contexto passa de MAX_PERCENT ou o payload de MAX_BYTES.
// Os limites vão para o atom `limits`, que o synapse-rate-limit desenha ao lado dos MB.
import { atom, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { GuardLimits } from '../types'

const DEFAULT_MB = 16
const MAX_PERCENT = 50

const limits = atom({ plugin: 'ctx-bytes-guard', key: 'limits' } as const, null as GuardLimits | null)

export const register: Register = (on, options) => {
  const mb = typeof options.maxMb === 'number' && options.maxMb > 0 ? options.maxMb : DEFAULT_MB
  const MAX_BYTES = mb * 1024 * 1024

  on('turn.complete', async ($, e, next) => {
    const ran = await next(e)
    if (e.agentId !== undefined) return ran

    await update($, limits, () => ({ maxBytes: MAX_BYTES, maxPercent: MAX_PERCENT }))

    const msgs = await $.session.messages({ as: 'api' })
    // ponytail: JSON.stringify materializes the payload; fine at ~16MB, stream-count if it hurts
    const bytes = Array.isArray(msgs) ? JSON.stringify(msgs).length : 0
    const { context } = await $.session.usage()
    const percent = context.percent ?? 0

    if (bytes >= MAX_BYTES || percent >= MAX_PERCENT) {
      $.ui.toast(`auto-compact: ${percent}% / ${(bytes / 1048576).toFixed(1)}MB`)
      await $.session.compact()
    }
    return ran
  })
}
