/**
 * Format a profile link URL for display by stripping protocol, mailto:, www., and trailing slashes.
 */
export function formatLinkDisplay(url: string, fallbackLabel?: string): string {
  const trimmed = url.trim()
  if (!trimmed) return fallbackLabel || ''

  const cleaned = trimmed
    .replace(/^mailto:/i, '')
    .replace(/^https?:\/\/(?:www\.)?/i, '')
    .replace(/\/+$/, '')

  return cleaned || fallbackLabel || trimmed
}
