import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type EventWithShortName = {
  shortName?: string
  [key: string]: unknown
}

type DataWithEvents = {
  events?: EventWithShortName[]
  [key: string]: unknown
}

export function getByShortName<T extends EventWithShortName>(
  shortName: string,
  data: DataWithEvents
): T | undefined {
  if (!data || !Array.isArray(data.events)) return undefined
  return (data.events as T[]).find((ev) => ev.shortName === shortName)
}

export function getSlugName(type: 'game' | 'player', name: string): string {
  const decoded = decodeURIComponent(name || '').trim()

  if (type === 'game') {
    // "CHI @ CHA" -> "chi_vs_cha"
    const normalized = decoded.replace(/\s*@\s*/g, ' vs ')
    return normalized.replace(/\s+/g, '_').toLowerCase()
  }

  // type === 'player'
  // Preserve roman numerals (I,V,X,L,C,D,M) in uppercase, lowercase other words
  const romanRe = /^[IVXLCDM]+$/
  const tokens = decoded.split(/\s+/).map((t) => (romanRe.test(t) ? t : t.toLowerCase()))
  return tokens.join('_')
}

export function getShortName(type: 'game' | 'player', slug: string): string {
  const cleaned = (slug || '').trim()

  if (type === 'game') {
    // "chi_vs_cha" -> "CHI @ CHA"
    const parts = cleaned.split(/_vs_/i).map((p) => p.toUpperCase())
    if (parts.length === 2) return `${parts[0]} @ ${parts[1]}`
    // Fallback: try splitting by spaces/underscores
    const alt = cleaned.replace(/_/g, ' ').split(/\s+vs\s+/i)
    if (alt.length === 2) return `${alt[0].toUpperCase()} @ ${alt[1].toUpperCase()}`
    return cleaned.toUpperCase()
  }

  // type === 'player'
  // "ronald_holland_II" -> "Ronald Holland II"
  const romanRe = /^[IVXLCDM]+$/
  const words = cleaned.split(/_/).map((w) => {
    const upper = w.toUpperCase()
    if (romanRe.test(upper)) return upper
    const lower = w.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  })
  return words.join(' ')
}
