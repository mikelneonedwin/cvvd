import { useRef, useState } from 'react'
import {
  Printer,
  Edit3,
  Eye,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Share2,
  Columns,
} from 'lucide-react'
import {
  ReadCvLogo,
  ExploreIcon,
  OpenRolesIcon,
  SearchIcon,
  PostsIcon,
  SidebarToggleIcon,
} from './ReadCvIcons'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '../context/ThemeContext'

export function Sidebar() {
  const {
    profile,
    isEditing,
    setIsEditing,
    isPreviewingPrint,
    setIsPreviewingPrint,
    exportProfileJson,
    importProfile,
    resetProfile,
    updatePrintSettings,
    showToast,
  } = useProfile()
  const { isDark, toggleTheme } = useTheme()
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Profile link copied to clipboard')
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        if (parsed.basics && parsed.experience) {
          importProfile(parsed)
          showToast('Profile imported successfully')
        } else {
          showToast('Invalid profile JSON structure')
        }
      } catch {
        showToast('Failed to parse JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const confirmReset = () => {
    resetProfile()
    setShowResetConfirm(false)
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
          className="w-10 h-10 rounded-full bg-[var(--backgroundColor)] border border-[var(--primaryBorderColor)] shadow-sm flex items-center justify-center text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--grey1)]"
        >
          <SidebarToggleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden File Input for JSON Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileImport}
      />

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
          {/* read.cv Logo Mark */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="text-[var(--grey1)]">
              <ReadCvLogo className="w-6 h-6" />
            </div>
            <span className="font-medium text-[15px] tracking-tight text-[var(--grey1)]">
              read.cv
            </span>
          </div>

          {/* read.cv Platform Nav Items */}
          <nav className="space-y-0.5 text-[14px]" aria-label="Main Navigation">
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault()
                showToast('read.cv Explore feed')
              }}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors"
            >
              <ExploreIcon className="w-5 h-5 text-[var(--grey3)]" />
              <span>Explore</span>
            </a>

            <a
              href="#open-roles"
              onClick={(e) => {
                e.preventDefault()
                showToast('read.cv Curated job board')
              }}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors"
            >
              <OpenRolesIcon className="w-5 h-5 text-[var(--grey3)]" />
              <span>Open roles</span>
            </a>

            <button
              type="button"
              onClick={() => showToast('Search profile contents')}
              aria-label="Search"
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors text-left"
            >
              <SearchIcon className="w-5 h-5 text-[var(--grey3)]" />
              <span>Search</span>
            </button>

            <a
              href="#posts"
              onClick={(e) => {
                e.preventDefault()
                showToast('read.cv Posts network')
              }}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors"
            >
              <PostsIcon className="w-5 h-5 text-[var(--grey3)]" />
              <span>Posts</span>
            </a>
          </nav>

          <div className="pt-2 border-t border-[var(--secondaryBorderColor)]" />

          {/* CV & Portfolio Tools */}
          <div className="space-y-0.5 text-[13px] font-mono" aria-label="CV Controls">
            <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-[var(--grey3)] font-medium">
              CV Controls
            </div>

            <div className="px-2 py-1.5 flex flex-col gap-1.5 text-left border-b border-[var(--secondaryBorderColor)] pb-2 mb-1">
              <div className="flex items-center gap-2 text-[11px] text-[var(--grey3)] uppercase tracking-wider font-medium">
                <Columns className="w-3 h-3" />
                <span>Layout Style</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-[var(--inputBackgroundColor)] p-0.5 rounded-lg text-[11px]">
                {(
                  [
                    ['editorial', 'Editorial'],
                    ['single-column', 'Single'],
                    ['balanced', 'Balanced'],
                  ] as const
                ).map(([key, label]) => {
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
                      className={`px-1.5 py-1 rounded text-center transition-colors font-medium truncate ${
                        isCur
                          ? 'bg-[var(--backgroundColor)] text-[var(--grey1)] shadow-xs'
                          : 'text-[var(--grey3)] hover:text-[var(--grey1)]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPreviewingPrint(true)
                setIsOpenMobile(false)
              }}
              aria-label="Print or export CV as PDF (Command + P)"
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-[var(--grey2)]" />
                <span>Print CV</span>
              </div>
              <span className="text-[10px] text-[var(--grey3)]">⌘P</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing)
                setIsOpenMobile(false)
              }}
              aria-label="Edit Profile data (Command + E)"
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-left ${
                isEditing
                  ? 'bg-[var(--grey4)] text-[var(--grey1)] font-medium'
                  : 'text-[var(--grey1)] hover:bg-[var(--grey5)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4 text-[var(--grey2)]" />
                <span>Edit Profile</span>
              </div>
              <span className="text-[10px] text-[var(--grey3)]">⌘E</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPreviewingPrint(!isPreviewingPrint)
                setIsOpenMobile(false)
              }}
              aria-label="Preview printable resume layout"
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left ${
                isPreviewingPrint
                  ? 'bg-[var(--grey4)] text-[var(--grey1)] font-medium'
                  : 'text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)]'
              }`}
            >
              <Eye className="w-4 h-4 text-[var(--grey2)]" />
              <span>Print Preview</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Copy profile link to clipboard"
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors text-left"
            >
              <Share2 className="w-4 h-4 text-[var(--grey2)]" />
              <span>Share Profile</span>
            </button>

            <button
              type="button"
              onClick={exportProfileJson}
              aria-label="Export profile data to JSON"
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors text-left"
            >
              <Download className="w-4 h-4 text-[var(--grey2)]" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Import profile from JSON file"
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] transition-colors text-left"
            >
              <Upload className="w-4 h-4 text-[var(--grey2)]" />
              <span>Import JSON</span>
            </button>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                aria-label="Reset to default read.cv template"
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[var(--grey3)] hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors text-left"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Template</span>
              </button>
            ) : (
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-1.5 text-xs">
                <p className="text-red-700 dark:text-red-300 font-sans">
                  Reset profile to default?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={confirmReset}
                    className="px-2 py-1 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Yes, reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 rounded text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: User & Theme Switcher */}
        <div className="pt-4 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between px-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[12px] text-[var(--grey2)] truncate font-mono">
              {profile.basics.handle || 'read.cv'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="p-1.5 rounded-md text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey4)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--grey1)]"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  )
}
