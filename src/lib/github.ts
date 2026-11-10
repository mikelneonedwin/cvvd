/**
 * Extracts owner and repo from a GitHub URL, e.g. "https://github.com/facebook/react" -> { owner: "facebook", repo: "react" }
 */
export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  if (!url) return null
  try {
    const trimmed = url.trim()
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')
    if (hostname !== 'github.com') return null
    const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/')
    if (parts.length >= 2 && parts[0] && parts[1]) {
      const owner = parts[0]
      const repo = parts[1].replace(/\.git$/i, '')
      if (owner && repo) {
        return { owner, repo }
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Formats a raw number of stars into a human-readable string (e.g. 1420 -> "1.4k", 25000 -> "25k").
 */
export function formatStarCount(count: number): string {
  if (count < 1000) return String(count)
  if (count < 10000) {
    const formatted = (count / 1000).toFixed(1)
    return formatted.endsWith('.0') ? `${Math.floor(count / 1000)}k` : `${formatted}k`
  }
  return `${Math.round(count / 1000)}k`
}
