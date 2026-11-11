import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  Printer,
  Edit3,
  Sun,
  Moon,
  Share2,
  Columns,
  LogIn,
  LogOut,
} from 'lucide-react'
import { CvvdLogo } from './CvvdIcons'
import {
  ExploreIcon,
  SidebarToggleIcon,
} from './ReadCvIcons'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '../context/ThemeContext'
import { useSession, signOut } from '../lib/auth-client'
import { STUDIO_TABS, type StudioTab } from '../types/studioTabs'

interface SidebarProps {
  activeTab?: StudioTab
  onSelectTab?: (tab: StudioTab) => void
  isPreviewMode?: boolean
  hasUnsavedHandle?: boolean
}

export function Sidebar({
  activeTab,
  onSelectTab,
  isPreviewMode = false,
  hasUnsavedHandle = false,
}: SidebarProps) {
  const { data: session } = useSession()
  const location = useLocation()
  const isEditPage = location.pathname === '/edit'

  const {
    profile,
    isPreviewingPrint,
    setIsPreviewingPrint,
    updatePrintSettings,
    showToast,
  } = useProfile()
  const { isDark, mounted, toggleTheme } = useTheme()
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  const handleShare = async () => {
    if (hasUnsavedHandle) {
      showToast('Save changes to update and share your profile link')
      return
    }

    const cleanHandle = profile.basics.handle.replace(/^cvvd\//, '').trim()
    const shareUrl = isEditPage && cleanHandle
      ? `${window.location.origin}/${cleanHandle}`
      : window.location.href

    const shareData = {
      title: `${profile.basics.name || 'Profile'} (@${cleanHandle || 'creator'}) - Cvvd`,
      text: `${profile.basics.headline || 'View living profile and printable CV on Cvvd.'}`,
      url: shareUrl,
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // Fallback to clipboard if share was dismissed or failed
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      showToast('Profile link copied to clipboard')
    } catch {
      showToast('Could not copy link to clipboard')
    }
  }

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <div className="no-print lg:hidden fixed top-4 left-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpenMobile}
          className="w-10 h-10 rounded-full bg-[var(--backgroundColor)]/90 backdrop-blur-md border border-[var(--primaryBorderColor)] shadow-sm flex items-center justify-center text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--grey1)] cursor-pointer"
        >
          <SidebarToggleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Floating Action Buttons - directly opposite on the right */}
      <div className="no-print lg:hidden fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPreviewingPrint(true)}
          aria-label="Print or export CV"
          title="Print CV"
          className="w-10 h-10 rounded-full bg-[var(--backgroundColor)]/90 backdrop-blur-md border border-[var(--primaryBorderColor)] shadow-sm flex items-center justify-center text-[var(--grey1)] hover:bg-[var(--grey5)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[var(--grey1)] cursor-pointer"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={hasUnsavedHandle}
          aria-label="Share profile"
          title="Share profile"
          className="w-10 h-10 rounded-full bg-[var(--backgroundColor)]/90 backdrop-blur-md border border-[var(--primaryBorderColor)] shadow-sm flex items-center justify-center text-[var(--grey1)] hover:bg-[var(--grey5)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[var(--grey1)] cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          className="no-print lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-[var(--backgroundColor)] border-r border-[var(--secondaryBorderColor)] flex flex-col justify-between py-6 px-5 transition-transform duration-200 ease-in-out ${
          isOpenMobile
            ? 'translate-x-0 shadow-xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="space-y-6">
          {/* Cvvd Logo Mark */}
          <Link
            to={session?.user ? '/home' : '/'}
            className="flex items-center gap-2.5 px-2 group"
          >
            <div className="text-[var(--grey1)] transition-transform group-hover:scale-105">
              <CvvdLogo className="w-6 h-6" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[var(--grey1)]">
              Cvvd
            </span>
          </Link>

          {/* Primary Platform Navigation */}
          <nav className="space-y-0.5 text-[14px]" aria-label="Platform Navigation">
            <Link
              to="/explore"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors"
            >
              <ExploreIcon className="w-5 h-5 text-[var(--grey3)]" />
              <span>People</span>
            </Link>
          </nav>

          {/* Studio Tabs Navigation on /edit */}
          {isEditPage && (
            <div className="space-y-1">
              <div className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold font-mono">
                Edit Sections
              </div>
              <nav className="space-y-0.5 text-[13px]" aria-label="Studio Sections">
                {STUDIO_TABS.map(({ id, label, icon: TabIcon }) => {
                  const isActive = activeTab === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        onSelectTab?.(id)
                        setIsOpenMobile(false)
                      }}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        isActive
                          ? 'bg-neutral-200/90 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-2xs'
                          : 'text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)]'
                      }`}
                    >
                      <TabIcon
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-neutral-950 dark:text-white'
                            : 'text-[var(--grey3)]'
                        }`}
                      />
                      <span>{label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          )}

          {isEditPage && (
            <div className="pt-2 border-t border-[var(--secondaryBorderColor)]" />
          )}

          {/* CV & Portfolio Tools */}
          <div className="space-y-1.5 text-[13px]" aria-label="CV Controls">
            <div className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold font-mono">
              CV Controls
            </div>

            {/* Layout Style Preset Selector: Hidden on /edit unless previewing */}
            {(!isEditPage || isPreviewMode) && (
              <div className="px-2 py-1.5 flex flex-col gap-2 text-left border-b border-[var(--secondaryBorderColor)] pb-3 mb-1">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold font-mono">
                  <Columns className="w-3.5 h-3.5" />
                  <span>Layout Style</span>
                </div>
                <div className="flex flex-col gap-1">
                  {(
                    [
                      ['editorial', 'Editorial', 'Dual column'],
                      ['single-column', 'Single Column', 'Full width'],
                      ['balanced', 'Balanced', '50/50 split'],
                    ] as const
                  ).map(([key, label, hint]) => {
                    const isCur =
                      (profile.printSettings.layoutPreset || 'editorial') === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          updatePrintSettings({ layoutPreset: key })
                          showToast(`Layout changed to ${label}`)
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                          isCur
                            ? 'bg-neutral-200/90 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-2xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              isCur
                                ? 'bg-neutral-900 dark:bg-white'
                                : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}
                          />
                          <span>{label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                          {hint}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setIsPreviewingPrint(!isPreviewingPrint)
                setIsOpenMobile(false)
              }}
              aria-label="Print or export CV as PDF (Command + P)"
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                isPreviewingPrint
                  ? 'bg-neutral-200/90 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-2xs'
                  : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-medium">Print</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isPreviewingPrint && (
                  <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                    Active
                  </span>
                )}
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  ⌘P
                </kbd>
              </div>
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={hasUnsavedHandle}
              title={
                hasUnsavedHandle
                  ? 'Save changes before sharing profile'
                  : 'Share profile link'
              }
              aria-label={
                hasUnsavedHandle
                  ? 'Save changes before sharing profile'
                  : 'Share profile link'
              }
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                hasUnsavedHandle
                  ? 'opacity-40 cursor-not-allowed text-neutral-400 dark:text-neutral-600'
                  : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer'
              }`}
            >
              <Share2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Share Profile</span>
            </button>

            {session?.user ? (
              <>
                {/* Profile studio link is hidden when already on /edit */}
                {!isEditPage && (
                  <>
                    <div className="pt-2 border-t border-[var(--secondaryBorderColor)] my-1" />
                    <div className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold font-mono">
                      Studio Tools
                    </div>

                    <Link
                      to="/edit"
                      onClick={() => setIsOpenMobile(false)}
                      aria-label="Edit Profile studio"
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <Edit3 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <span>Profile Studio</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Edit</span>
                    </Link>
                  </>
                )}

                <div className={isEditPage ? 'pt-2' : ''}>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut()
                      window.location.reload()
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpenMobile(false)}
                  className="btn-primary w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5 opacity-80" />
                    <span>Sign in</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">Cvvd</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: User & Theme Switcher */}
        <div className="pt-4 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between gap-2 px-2">
          {profile.basics.handle ? (
            <Link
              to="/$handle"
              params={{ handle: profile.basics.handle.replace(/^cvvd\//, '') }}
              onClick={() => setIsOpenMobile(false)}
              className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden group hover:opacity-80 transition-opacity"
              title={`View ${profile.basics.handle} live profile`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[12px] text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white truncate font-mono block">
                {profile.basics.handle}
              </span>
            </Link>
          ) : (
            <div
              className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden"
              title="cvvd"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[12px] text-neutral-600 dark:text-neutral-300 truncate font-mono block">
                cvvd
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${mounted && isDark ? 'light' : 'dark'} mode`}
            className="p-1.5 rounded-lg border border-[var(--secondaryBorderColor)] text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--grey1)]"
          >
            {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  )
}
