import { test, expect } from 'claude-code/testing'

import { bytesPercent, fmtMb, fmtDelta, fmtTokens, spark, weather } from './synapse-format'

test('faixas de clima', () => {
  expect(weather(10).word).toBe('Limpo')
  expect(weather(25).word).toBe('Nublado')
  expect(weather(50).word).toBe('Chuva')
  expect(weather(75).word).toBe('Tempestade')
  expect(weather(90).word).toBe('Compacta logo')
})

test('formatação', () => {
  expect(fmtTokens(134000)).toBe('134K')
  expect(fmtTokens(1000000)).toBe('1M')
  expect(fmtDelta(98000)).toBe('+98k')
  expect(spark([0, 100])).toBe('▁█')
  expect(fmtMb(12.34 * 1024 * 1024)).toBe('12 MB')
  expect(fmtMb(1.5 * 1024 * 1024)).toBe('1.5 MB')
  expect(bytesPercent(16 * 1024 * 1024)).toBe(50)
})
