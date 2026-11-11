import { useState, useRef, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Search, Sun, Moon, X, Command, Star, SlidersHorizontal } from 'lucide-react'
import { CvvdLogo, GitHubIcon } from '../components/CvvdIcons'
import { fetchGitHubStars } from '../components/GitHubStarBadge'
import { formatStarCount } from '../lib/github'
import { trpc } from '../trpc/client'
import { useSession } from '../lib/auth-client'
import { useTheme } from '../context/ThemeContext'
import { Skeleton } from '../components/Skeleton'

export const Route = createFileRoute('/explore')({
  head: () => ({
    meta: [
      { title: 'People - Cvvd' },
      { name: 'description', content: 'Browse people, engineers, and designers on Cvvd.' },
      { property: 'og:title', content: 'People - Cvvd' },
      { property: 'og:description', content: 'Browse people, engineers, and designers on Cvvd.' },
      { property: 'og:url', content: 'https://cvvd.vercel.app/explore' },
    ],
  }),
  component: ExplorePage,
})

export function ExplorePage() {
  const { data: session } = useSession()
  const { isDark, mounted, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const { data: allUsers, isLoading } = useQuery(
    trpc.profile.listAll.queryOptions()
  )

  const { data: cvvdStars } = useQuery({
    queryKey: ['github-stars', 'mikelneonedwin', 'cvvd'],
    queryFn: () => fetchGitHubStars('mikelneonedwin', 'cvvd'),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  })

  const users = allUsers || []
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      u.name.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      u.headline.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q)
    )
  })

  const brandHomeLink = session?.user ? '/home' : '/'

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={brandHomeLink} className="flex items-center gap-2.5 group">
              <div className="text-[var(--grey1)] transition-transform group-hover:scale-105">
                <CvvdLogo className="w-7 h-7" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-[var(--grey1)]">
                Cvvd
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/mikelneonedwin/cvvd"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              className="group px-2.5 py-1.5 rounded-xl border border-[var(--secondaryBorderColor)] text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer text-xs font-mono"
            >
              <GitHubIcon className="w-4 h-4 shrink-0 text-current" />
              {typeof cvvdStars === 'number' && (
                <span className="flex items-center gap-1 text-[11px] text-[var(--grey3)] group-hover:text-[var(--grey1)] font-medium pl-0.5 border-l border-[var(--secondaryBorderColor)]">
                  <Star className="w-3 h-3 fill-current text-current shrink-0 opacity-80" />
                  <span>{formatStarCount(cvvdStars)}</span>
                </span>
              )}
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-[var(--secondaryBorderColor)] text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {session?.user ? (
              <Link
                to="/edit"
                title="Profile Studio"
                aria-label="Profile Studio"
                className="btn-primary p-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs inline-flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4 sm:hidden shrink-0" />
                <span className="hidden sm:inline">Profile Studio</span>
              </Link>
            ) : (
              <Link
                to="/signup"
                className="btn-primary px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs inline-flex items-center"
              >
                Try it
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[var(--grey1)]">
              Profiles on Cvvd
            </h1>
            <p className="mt-1 text-xs text-[var(--grey3)]">
              Browse living CVs, portfolios, and printable sheets across the community.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-80 relative group">
            <div className="flex items-center w-full px-3 py-2 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 hover:bg-[var(--inputBackgroundColor)]/70 focus-within:bg-[var(--backgroundColor)] focus-within:border-[var(--grey1)] focus-within:ring-1 focus-within:ring-[var(--grey1)] transition-all shadow-xs">
              <Search className="w-4 h-4 text-[var(--grey3)] group-focus-within:text-[var(--grey1)] transition-colors shrink-0 mr-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, handle, role, or city..."
                className="w-full bg-transparent text-xs text-[var(--grey1)] placeholder:text-[var(--grey3)] focus:outline-none border-none p-0 leading-tight"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="p-1 rounded-md text-[var(--grey3)] hover:text-[var(--grey1)] transition-colors cursor-pointer shrink-0 ml-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--grey3)] bg-[var(--inputBackgroundColor)] border border-[var(--secondaryBorderColor)] shrink-0 ml-1.5 select-none pointer-events-none">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="w-28 h-4 rounded" />
                    <Skeleton className="w-20 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-full h-3.5 rounded" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[var(--secondaryBorderColor)] rounded-2xl">
            <p className="text-sm text-[var(--grey2)]">No creators found matching "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-mono text-[var(--grey1)] underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <Link
                key={user.handle}
                to="/$handle"
                params={{ handle: user.handle }}
                className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/20 hover:bg-[var(--inputBackgroundColor)]/60 hover:border-[var(--grey3)] transition-all group block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--grey4)] shrink-0 ring-1 ring-[var(--secondaryBorderColor)]">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-normal text-sm text-[var(--grey1)] group-hover:underline">
                      {user.name}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--grey3)]">
                      cvvd/{user.handle}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[var(--grey2)] line-clamp-2 leading-relaxed">
                  {user.headline}
                </p>

                <div className="mt-3 pt-3 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between text-[11px] text-[var(--grey3)] font-mono">
                  <span>{user.location}</span>
                  <span className="text-[var(--grey2)] group-hover:text-[var(--grey1)]">
                    View profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
