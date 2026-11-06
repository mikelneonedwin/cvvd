import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CvvdLogo, GoogleIcon } from '../components/CvvdIcons'
import { authClient } from '../lib/auth-client'
import { ArrowRight, Loader2 } from 'lucide-react'

interface SignUpSearch {
  handle?: string
}

export const Route = createFileRoute('/signup')({
  validateSearch: (search: Record<string, unknown>): SignUpSearch => {
    return {
      handle: typeof search.handle === 'string' ? search.handle : undefined,
    }
  },
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState(() => {
    if (search?.handle) return search.handle
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cvvd_desired_handle') || ''
    }
    return ''
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)

  const handleGoogleSignUp = async () => {
    setError(null)
    setSocialLoading(true)
    const cleanHandle = handle.trim().toLowerCase().replace(/^@/, '')
    if (cleanHandle && typeof window !== 'undefined') {
      sessionStorage.setItem('cvvd_desired_handle', cleanHandle)
    }

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: cleanHandle ? `/edit?handle=${encodeURIComponent(cleanHandle)}` : '/edit',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google')
      setSocialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (res.error) {
        setError(res.error.message || 'Failed to create account')
        setLoading(false)
        return
      }

      const cleanHandle = handle.trim().toLowerCase().replace(/^@/, '')
      if (cleanHandle && typeof window !== 'undefined') {
        sessionStorage.setItem('cvvd_desired_handle', cleanHandle)
      }

      navigate({
        to: '/edit',
        search: cleanHandle ? { handle: cleanHandle } : undefined,
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during sign up'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <CvvdLogo className="w-8 h-8 text-[var(--grey1)] transition-transform group-hover:scale-105" />
          <span className="font-semibold text-xl tracking-tight text-[var(--grey1)]">
            Cvvd
          </span>
        </Link>
        <h2 className="text-2xl font-medium tracking-tight text-[var(--grey1)]">
          Create your profile
        </h2>
        <p className="mt-1.5 text-xs text-[var(--grey3)]">
          Join Cvvd to build your living profile and publication-grade CV
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--inputBackgroundColor)]/50 border border-[var(--secondaryBorderColor)] py-8 px-6 sm:px-10 rounded-2xl shadow-xs">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={socialLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {socialLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--grey2)]" />
            ) : (
              <GoogleIcon className="w-4 h-4 shrink-0" />
            )}
            <span>Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--secondaryBorderColor)]" />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono uppercase tracking-wider">
              <span className="bg-[var(--backgroundColor)] px-3 text-[var(--grey4)]">
                or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!handle) {
                    setHandle(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '')
                        .slice(0, 20)
                    )
                  }
                }}
                placeholder="Elena Vance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] placeholder:text-[var(--grey4)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="handle"
                className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1"
              >
                Desired handle
              </label>
              <div className="flex items-center rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] px-3.5 focus-within:ring-1 focus-within:ring-[var(--grey1)]">
                <span className="text-xs text-[var(--grey3)] font-mono select-none">
                  cvvd/
                </span>
                <input
                  id="handle"
                  type="text"
                  required
                  value={handle}
                  onChange={(e) =>
                    setHandle(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, '')
                        .slice(0, 24)
                    )
                  }
                  placeholder="elena"
                  className="w-full py-2.5 pl-1 bg-transparent text-sm font-mono text-[var(--grey1)] placeholder:text-[var(--grey4)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] placeholder:text-[var(--grey4)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1"
              >
                Password (min 8 characters)
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] placeholder:text-[var(--grey4)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium shadow-2xs hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--grey3)]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[var(--grey1)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
