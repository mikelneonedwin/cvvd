import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CvvdLogo, GoogleIcon } from '../components/CvvdIcons'
import { authClient } from '../lib/auth-client'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setSocialLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/edit',
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
        <div className="bg-[var(--inputBackgroundColor)]/50 border border-[var(--secondaryBorderColor)] py-8 px-6 sm:px-10 rounded-2xl shadow-xs space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

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
            <span>By continuing, you sign in or create your Cvvd profile instantly.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
