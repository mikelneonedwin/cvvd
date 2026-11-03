import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Search, ArrowLeft, Sun, Moon } from 'lucide-react'
import { CvvdLogo } from '../components/CvvdIcons'
import { trpc } from '../trpc/client'
import { useSession } from '../lib/auth-client'
import { useTheme } from '../context/ThemeContext'
import { Skeleton } from '../components/Skeleton'

export const Route = createFileRoute('/explore')({
  head: () => ({
    meta: [
      { title: 'Explore Creators - cvvd' },
      { name: 'description', content: 'Browse all creators, designers, and engineers on cvvd.' },
      { property: 'og:title', content: 'Explore Creators - cvvd' },
      { property: 'og:description', content: 'Browse all creators, designers, and engineers on cvvd.' },
      { property: 'og:url', content: 'https://cvvd.vercel.app/explore' },
    ],
  }),
  component: ExplorePage,
})

function ExplorePage() {
  const { data: session } = useSession()
  const { isDark, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: allUsers, isLoading } = useQuery(
    trpc.profile.listAll.queryOptions()
  )

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

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="text-[var(--grey1)] transition-transform group-hover:scale-105">
                <CvvdLogo className="w-7 h-7" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-[var(--grey1)]">
                cvvd
              </span>
            </Link>
            <div className="h-4 w-px bg-[var(--secondaryBorderColor)] hidden sm:block" />
            <span className="text-xs font-mono text-[var(--grey3)] hidden sm:inline">
              Explore
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-[var(--secondaryBorderColor)] text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {session?.user ? (
              <Link
                to="/edit"
                className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs"
              >
                Profile Studio
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs"
                >
                  Claim handle
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--grey3)] hover:text-[var(--grey1)] mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[var(--grey1)]">
              People who build on cvvd
            </h1>
            <p className="mt-1 text-xs text-[var(--grey3)]">
              Explore profiles, portfolios, and publication-grade CVs across the platform.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--grey3)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, or city..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/50 text-xs text-[var(--grey1)] placeholder:text-[var(--grey3)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
            />
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
                to="/profile/$handle"
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
