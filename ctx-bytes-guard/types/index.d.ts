/** Os limites em que o ctx-bytes-guard compacta; o synapse-rate-limit os lê para a linha dos MB. */
export type GuardLimits = { maxBytes: number; maxPercent: number }

declare module 'claude-code' {
  interface PluginState {
    'ctx-bytes-guard': {
      limits: GuardLimits | null
    }
  }
}
