import { test, expect } from 'claude-code/testing'

import { bytesPercent, fmtMb, fmtDelta, fmtTokens, spark, weather } from './synapse-format'
import { fromClaudeCode, resolveLanguage } from './language'

test('faixas de clima em inglês (padrão) e português', () => {
  expect(weather(10).word).toBe('Clear')
  expect(weather(90).word).toBe('Compact soon')
  expect(weather(10, 'pt-BR').word).toBe('Limpo')
  expect(weather(25, 'pt-BR').word).toBe('Nublado')
  expect(weather(50, 'pt-BR').word).toBe('Chuva')
  expect(weather(75, 'pt-BR').word).toBe('Tempestade')
  expect(weather(90, 'pt-BR').word).toBe('Compacta logo')
  // um idioma do HUD sem texto próprio na linha usa o inglês
  expect(weather(50, 'de').word).toBe('Rain')
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

test('o idioma do Claude Code vira um idioma do HUD', () => {
  expect(fromClaudeCode('Portugues')).toBe('pt-BR')
  expect(fromClaudeCode('português')).toBe('pt-BR')
  expect(fromClaudeCode('Brazilian Portuguese')).toBe('pt-BR')
  expect(fromClaudeCode('pt-BR')).toBe('pt-BR')
  expect(fromClaudeCode('English')).toBe('en')
  expect(fromClaudeCode('en-US')).toBe('en')
  expect(fromClaudeCode('Klingon')).toBeNull()
  expect(fromClaudeCode(undefined)).toBeNull()
})

test('a opção vence; em auto vale o Claude Code, depois o claude-hud', () => {
  expect(resolveLanguage('en', 'Portugues', 'de')).toBe('en')
  expect(resolveLanguage('pt-BR', 'English', 'en')).toBe('pt-BR')
  expect(resolveLanguage('auto', 'Portugues', 'en')).toBe('pt-BR')
  expect(resolveLanguage('auto', 'English', 'pt-BR')).toBe('en')
  expect(resolveLanguage('auto', 'Klingon', 'de')).toBe('de')
  expect(resolveLanguage('auto', undefined, 'en')).toBe('en')
})
