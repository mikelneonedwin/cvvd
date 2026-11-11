import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Printer,
  Globe,
  ExternalLink,
  Sun,
  Moon,
  Star,
} from 'lucide-react'
import { CvvdLogo, GitHubIcon } from '../components/CvvdIcons'
import { fetchGitHubStars } from '../components/GitHubStarBadge'
import { formatStarCount } from '../lib/github'
import { trpc } from '../trpc/client'
import { auth } from '../lib/auth'
import { useSession } from '../lib/auth-client'
import { useTheme } from '../context/ThemeContext'
import { isReservedHandle } from '../lib/reservedHandles'
import { ExplorePage } from './explore'

const getAuthSession = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return { isAuthenticated: Boolean(session?.user) }
  } catch {
    return { isAuthenticated: false }
  }
})

export const Route = createFileRoute('/')({
  loader: async () => {
    return getAuthSession()
  },
  component: RootIndexRoute,
})

function RootIndexRoute() {
  const loaderData = Route.useLoaderData()
  const { data: session } = useSession()

  const isAuthenticated = loaderData?.isAuthenticated || Boolean(session?.user)

  if (isAuthenticated) {
    return <ExplorePage />
  }

  return <HomePage />
}

export function HomePage() {
  const { data: session } = useSession()
  const { isDark, mounted, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [desiredHandle, setDesiredHandle] = useState('')
  const [handleError, setHandleError] = useState<string | null>(null)

  const { data: featuredCreators } = useQuery(
    trpc.profile.listFeatured.queryOptions()
  )

  const { data: cvvdStars } = useQuery({
    queryKey: ['github-stars', 'mikelneonedwin', 'cvvd'],
    queryFn: () => fetchGitHubStars('mikelneonedwin', 'cvvd'),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  })

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHandleError(null)
    const clean = desiredHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (clean) {
      if (isReservedHandle(clean)) {
        setHandleError(`"${clean}" is a reserved system route. Please choose another handle.`)
        return
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cvvd_desired_handle', clean)
      }
      navigate({
        to: '/signup',
        search: { handle: clean },
      })
    } else {
      navigate({ to: '/signup' })
    }
  }

  const creators = featuredCreators || []

  const brandHomeLink = session?.user ? '/home' : '/'

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)] transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={brandHomeLink} className="flex items-center gap-2.5 group">
            <div className="text-[var(--grey1)] transition-transform group-hover:scale-105">
              <CvvdLogo className="w-7 h-7" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[var(--grey1)]">
              Cvvd
            </span>
          </Link>

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
                className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs"
              >
                Profile Studio
              </Link>
            ) : (
              <Link
                to="/signup"
                className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shrink-0 shadow-2xs"
              >
                Try it
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-[var(--grey1)] leading-[1.18]">
          A quiet, living profile for people who build.
        </h1>

        <p className="mt-5 text-sm sm:text-base text-[var(--grey3)] max-w-xl mx-auto leading-relaxed">
          A single link for your online story, and a publication-grade CV for paper. Free from algorithmic feeds, keyword spam, and corporate noise.
        </p>

        {/* Inline Handle Claim Widget */}
        <form
          onSubmit={handleClaimSubmit}
          className="mt-8 max-w-md mx-auto flex items-center rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/60 p-1.5 shadow-xs transition-all"
        >
          <span className="pl-3.5 pr-1 text-sm font-mono text-[var(--grey3)] select-none">
            cvvd/
          </span>
          <input
            type="text"
            value={desiredHandle}
            onChange={(e) =>
              setDesiredHandle(
                e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
              )
            }
            placeholder="your-name"
            className="w-full bg-transparent py-2.5 text-sm font-mono text-[var(--grey1)] placeholder:text-[var(--grey3)] focus:outline-none focus:ring-0 outline-none border-none no-focus-ring"
          />
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium shrink-0 hover:opacity-90 active:scale-98 transition-all shadow-2xs cursor-pointer"
          >
            <span>Try it</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {handleError && (
          <p className="mt-2 text-xs text-rose-500 font-mono text-center">
            {handleError}
          </p>
        )}

        <div className="mt-4 text-xs text-[var(--grey3)]">
          <span>Free forever. Instant claim. Or </span>
          <Link
            to="/$handle"
            params={{ handle: 'mikelneonedwin' }}
            className="font-medium text-[var(--grey1)] underline decoration-[var(--grey3)] underline-offset-4 hover:decoration-[var(--grey1)] transition-colors cursor-pointer"
          >
            explore Winner Edwin&apos;s living CV
          </Link>
        </div>
      </section>

      {/* The Artifact: Real Product Showcase */}
      <section
        id="artifact"
        className="py-12 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--secondaryBorderColor)]"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--grey3)]">
              The Artifact
            </span>
            <h2 className="text-xl font-normal text-[var(--grey1)] mt-0.5">
              A permanent, readable digital canvas.
            </h2>
          </div>
        </div>

        {/* Live Artifact Container */}
        <div className="rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 p-4 sm:p-10 shadow-xs">
          <div className="max-w-[540px] mx-auto bg-[var(--backgroundColor)] p-6 sm:p-10 rounded-2xl border border-[var(--secondaryBorderColor)] shadow-sm space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <h3 className="text-xl font-normal text-[var(--grey1)]">
                  Winner Edwin
                </h3>
                <p className="text-xs text-[var(--grey3)]">
                  Software Engineer in Uyo, Nigeria
                </p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--grey4)] shrink-0 ring-1 ring-[var(--secondaryBorderColor)]">
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocJ0xfPH6gfARpcf7a5mmQQWGTTpXh51PKt0AHX9A3x7lJkVfMBo=s96-c"
                  alt="Winner Edwin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* About section with 136px gutter simulation */}
            <div className="space-y-2 pt-2">
              <div className="text-sm font-normal text-[var(--grey3)]">About</div>
              <p className="text-xs text-[var(--grey2)] leading-relaxed sm:ml-[100px]">
                Fullstack developer who enjoys understanding how things work and building them properly. Five years building products across React, Next.js, and backend systems.
              </p>
            </div>

            {/* Work section with 100px duration gutter */}
            <div className="space-y-4 pt-2">
              <div className="text-sm font-normal text-[var(--grey3)]">
                Work experience
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2 sm:gap-4 text-xs">
                  <div className="text-[var(--grey3)] font-mono sm:text-right">
                    2025 - Now
                  </div>
                  <div>
                    <div className="font-medium text-[var(--grey1)]">
                      Software Engineer at Applift Labs
                    </div>
                    <div className="text-[var(--grey3)] text-[11px] mt-0.5">
                      Uyo, Nigeria
                    </div>
                    <p className="text-[var(--grey2)] mt-1.5 leading-relaxed">
                      Took ownership of frontend development and helped turn requirements into shipped software across multi-tenant platforms, internal tools, and ERPs.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2 sm:gap-4 text-xs pt-2">
                  <div className="text-[var(--grey3)] font-mono sm:text-right">
                    2025
                  </div>
                  <div>
                    <div className="font-medium text-[var(--grey1)]">
                      Frontend Developer at LawdAm
                    </div>
                    <div className="text-[var(--grey3)] text-[11px] mt-0.5">
                      Uyo, Nigeria
                    </div>
                    <p className="text-[var(--grey2)] mt-1.5 leading-relaxed">
                      Led web app development as primary client developer, building features around anonymous group chats, direct messages, and identity switching.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Bar */}
            <div className="pt-4 flex items-center justify-between text-xs">
              <span className="font-mono text-[var(--grey3)]">cvvd/mikelneonedwin</span>
              <Link
                to="/$handle"
                params={{ handle: 'mikelneonedwin' }}
                className="inline-flex items-center gap-1 font-medium text-[var(--grey1)] hover:underline"
              >
                <span>Open live profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Disciplines Editorial Manifesto */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--secondaryBorderColor)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--grey3)] uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>Living on the web</span>
            </div>
            <h3 className="text-lg font-normal text-[var(--grey1)]">
              A permanent, readable digital canvas.
            </h3>
            <p className="text-xs text-[var(--grey3)] leading-relaxed">
              Your profile is a living document, not a dead PDF sitting on your desktop. Share a clean, memorable URL on socials, in email signatures, and across job applications. Fast client-side loading, bone-toned skeletons, and rich OpenGraph card previews make your work look immediate.
            </p>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--grey3)] uppercase tracking-wider">
              <Printer className="w-3.5 h-3.5" />
              <span>Calibrated for paper</span>
            </div>
            <h3 className="text-lg font-normal text-[var(--grey1)]">
              Publication-grade print sheets.
            </h3>
            <p className="text-xs text-[var(--grey3)] leading-relaxed">
              When executive reviews or physical interviews call for paper, Cvvd translates your digital profile into an authentic one-page CV sheet. Pixel-calibrated margins, monospace date gutters, density options, and zero awkward line cuts let you print cleanly from the browser.
            </p>
          </div>
        </div>
      </section>

      {/* Curated Community Directory */}
      <section
        id="directory"
        className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--secondaryBorderColor)]"
      >
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--grey3)]">
            Directory
          </span>
          <h2 className="text-xl font-normal text-[var(--grey1)] mt-0.5">
            Profiles crafted with Cvvd
          </h2>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {creators.map((creator) => (
            <Link
              key={creator.handle}
              to="/$handle"
              params={{ handle: creator.handle }}
              className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/20 hover:bg-[var(--inputBackgroundColor)]/60 hover:border-[var(--grey3)] transition-all group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--grey4)] shrink-0 ring-1 ring-[var(--secondaryBorderColor)]">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-normal text-sm text-[var(--grey1)] group-hover:underline">
                    {creator.name}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--grey3)]">
                    cvvd/{creator.handle}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-[var(--grey2)] line-clamp-2 leading-relaxed">
                {creator.headline}
              </p>

              <div className="mt-3 pt-3 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between text-[11px] text-[var(--grey3)] font-mono">
                <span>{creator.location}</span>
                <span className="text-[var(--grey2)] group-hover:text-[var(--grey1)]">
                  View profile →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Understated Minimalist Footer */}
      <footer className="py-12 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--secondaryBorderColor)] text-xs text-[var(--grey3)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2">
          <CvvdLogo className="w-4 h-4 text-[var(--grey2)]" />
          <span>Cvvd - living profiles and printable CV engine</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mikelneonedwin/cvvd"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--grey1)] transition-colors"
          >
            MIT License
          </a>
        </div>
      </footer>
    </div>
  )
}
