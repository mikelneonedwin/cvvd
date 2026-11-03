import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CvvdLogo } from '../components/CvvdIcons'
import { authClient } from '../lib/auth-client'
import { ArrowRight, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || 'Failed to sign in')
        setLoading(false)
        return
      }

      navigate({ to: '/edit' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <CvvdLogo className="w-8 h-8 text-[var(--grey1)] transition-transform group-hover:scale-105" />
          <span className="font-semibold text-xl tracking-tight text-[var(--grey1)]">
            cvvd
          </span>
        </Link>
        <h2 className="text-2xl font-medium tracking-tight text-[var(--grey1)]">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs text-[var(--grey3)]">
          Sign in to access your profile studio and printable CV
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--inputBackgroundColor)]/50 border border-[var(--secondaryBorderColor)] py-8 px-6 sm:px-10 rounded-2xl shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

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
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
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
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--grey3)]">
            Don't have an account?{' '}
            <Link
              to="/signup"
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
