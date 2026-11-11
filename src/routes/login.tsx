import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CvvdLogo, GoogleIcon } from '../components/CvvdIcons'
import { authClient } from '../lib/auth-client'
import { ArrowRight, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [handle, setHandle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState(false)

  const handleClaimNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (clean) {
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

  const handleGoogleSignIn = async () => {
    setError(null)
    setSocialLoading(true)
    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    if (cleanHandle && typeof window !== 'undefined') {
      sessionStorage.setItem('cvvd_desired_handle', cleanHandle)
    }
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: cleanHandle ? `/edit?handle=${encodeURIComponent(cleanHandle)}` : '/edit',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
      setSocialLoading(false)
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
          Welcome to Cvvd
        </h2>
        <p className="mt-1.5 text-xs text-[var(--grey3)]">
          Sign in with your Google account to access your Profile Studio and printable CV
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--inputBackgroundColor)]/50 border border-[var(--secondaryBorderColor)] py-8 px-6 sm:px-10 rounded-2xl shadow-xs space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="handle"
              className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1"
            >
              Claim your profile handle (optional)
            </label>
            <div className="flex items-center rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] px-3.5 focus-within:ring-1 focus-within:ring-[var(--grey1)]">
              <span className="text-sm font-mono text-[var(--grey3)] select-none">
                cvvd/u/
              </span>
              <input
                id="handle"
                type="text"
                value={handle}
                onChange={(e) =>
                  setHandle(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_-]/g, '')
                      .slice(0, 24)
                  )
                }
                placeholder="yourname"
                className="w-full py-2.5 pl-1 bg-transparent text-sm font-mono text-[var(--grey1)] placeholder:text-[var(--grey4)] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={socialLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] disabled:opacity-50 transition-colors cursor-pointer shadow-2xs"
          >
            {socialLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--grey2)]" />
            ) : (
              <GoogleIcon className="w-4 h-4 shrink-0" />
            )}
            <span>Continue with Google</span>
          </button>

          <div className="pt-2 text-center text-xs text-[var(--grey3)]">
            Don&apos;t have an account yet?{' '}
            <Link
              to="/signup"
              search={handle ? { handle } : {}}
              className="font-medium text-[var(--grey1)] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
