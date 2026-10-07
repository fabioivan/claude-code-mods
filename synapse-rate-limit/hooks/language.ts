// O idioma do HUD: a opção `language` do mod (`auto`, `en`, `pt-BR`) e, em `auto`,
// o idioma do próprio Claude Code (`language` no settings.json), com o `language`
// do claude-hud como último recurso.
import type { Language } from './hud/config.js'

export const LANGUAGE_OPTIONS = ['auto', 'en', 'pt-BR'] as const
export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number]

/** O idioma do HUD que um `language` livre do Claude Code ("Portugues", "pt-BR", "English") nomeia; null se não for um dos suportados. */
export function fromClaudeCode(value: unknown): 'en' | 'pt-BR' | null {
  if (typeof value !== 'string') return null
  const v = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  if (/^pt\b|portugu|brasil|brazil/.test(v)) return 'pt-BR'
  if (/^en\b|english|ingles/.test(v)) return 'en'
  return null
}

/** A opção do mod; em `auto`, o idioma do Claude Code; senão o que o claude-hud já tinha. */
export function resolveLanguage(option: LanguageOption, claudeCode: unknown, fallback: Language): Language {
  if (option !== 'auto') return option
  return fromClaudeCode(claudeCode) ?? fallback
}
