import { useState } from 'react'
import { Columns, Download, FileJson, Moon, Printer, Sun } from 'lucide-react'
import { CvvdLogo } from './CvvdIcons'
import { SidebarToggleIcon } from './ReadCvIcons'
import { useProfile } from '../context/ProfileContext'
import { useTheme } from '../context/ThemeContext'
import { STUDIO_TABS, type StudioTab } from '../types/studioTabs'

interface SidebarProps {
  activeTab?: StudioTab
  onSelectTab?: (tab: StudioTab) => void
  isPreviewMode?: boolean
}

export function Sidebar({
  activeTab,
  onSelectTab,
  isPreviewMode = false,
}: SidebarProps) {
  const {
    profile,
    isPreviewingPrint,
    setIsPreviewingPrint,
    updatePrintSettings,
    showToast,
    exportProfileJson,
    generatePdf,
    isGeneratingPdf,
  } = useProfile()
  const { isDark, mounted, toggleTheme } = useTheme()
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  return (
    <>
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

      <div className="no-print lg:hidden fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void generatePdf()}
          disabled={isGeneratingPdf}
          aria-label="Generate PDF"
          title="Generate PDF"
          className="w-10 h-10 rounded-full bg-[var(--backgroundColor)]/90 backdrop-blur-md border border-[var(--primaryBorderColor)] shadow-sm flex items-center justify-center text-[var(--grey1)] hover:bg-[var(--grey5)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[var(--grey1)] cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {isOpenMobile && (
        <div
          className="no-print lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-40 w-[240px] bg-[var(--backgroundColor)] border-r border-[var(--secondaryBorderColor)] flex flex-col justify-between py-6 px-5 transition-transform duration-200 ease-in-out ${
          isOpenMobile
            ? 'translate-x-0 shadow-xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="text-[var(--grey1)]">
              <CvvdLogo className="w-6 h-6" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[var(--grey1)]">
              Cvvd
            </span>
          </div>

          <div className="space-y-1">
            <div className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold font-mono">
              Edit Sections
            </div>
            <nav
              className="space-y-0.5 text-[13px]"
              aria-label="Studio Sections"
            >
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

          <div className="pt-2 border-t border-[var(--secondaryBorderColor)]" />

          <div className="space-y-1.5 text-[13px]" aria-label="CV Controls">
            <div className="px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold font-mono">
              CV Controls
            </div>

            {isPreviewMode && (
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
                      (profile.printSettings.layoutPreset || 'editorial') ===
                      key
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
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                isPreviewingPrint
                  ? 'bg-neutral-200/90 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium shadow-2xs'
                  : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-medium">Print settings</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => void generatePdf()}
              disabled={isGeneratingPdf}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-medium">
                  {isGeneratingPdf ? 'Generating PDF...' : 'Generate PDF'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={exportProfileJson}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            >
              <FileJson className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--secondaryBorderColor)] flex items-center justify-between gap-2 px-2">
          <div
            className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden"
            title="Local CV Studio"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[12px] text-neutral-600 dark:text-neutral-300 truncate font-mono block">
              local
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${mounted && isDark ? 'light' : 'dark'} mode`}
            className="p-1.5 rounded-lg border border-[var(--secondaryBorderColor)] text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--inputBackgroundColor)] transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--grey1)]"
          >
            {mounted && isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
