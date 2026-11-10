import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { parseGitHubRepo, formatStarCount } from '../lib/github'
import { GitHubIcon } from './CvvdIcons'

interface GitHubStarBadgeProps {
  url: string
  className?: string
}

export function GitHubStarBadge({ url, className = '' }: GitHubStarBadgeProps) {
  const repoInfo = parseGitHubRepo(url)

  const { data: starCount } = useQuery({
    queryKey: ['github-stars', repoInfo?.owner, repoInfo?.repo],
    queryFn: async () => {
      if (!repoInfo) return null
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`
        )
        if (!res.ok) return null
        const data = await res.json()
        if (typeof data.stargazers_count === 'number') {
          return data.stargazers_count
        }
        return null
      } catch {
        return null
      }
    },
    enabled: !!repoInfo,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  })

  if (!repoInfo || starCount === null || starCount === undefined) {
    return null
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 text-[11px] font-mono text-[var(--grey2)] select-none shrink-0 align-middle ${className}`}
      title={`${repoInfo.owner}/${repoInfo.repo}: ${starCount.toLocaleString()} stars on GitHub`}
    >
      <GitHubIcon className="w-3 h-3 text-[var(--grey3)]" />
      <span className="inline-flex items-center gap-0.5">
        <Star className="w-2.5 h-2.5 fill-amber-400/80 text-amber-500" />
        <span>{formatStarCount(starCount)}</span>
      </span>
    </span>
  )
}
