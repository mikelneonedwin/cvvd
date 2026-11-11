import type { UserProfile, LayoutPreset } from '../../types/profile'
import { CustomSelect } from '../CustomSelect'
import { Checkbox } from '../Checkbox'
import { useProfile } from '../../context/ProfileContext'
import { Printer } from 'lucide-react'

interface StudioLayoutProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

interface LayoutOption {
  id: LayoutPreset
  title: string
  desc: string
}

const LAYOUT_OPTIONS: readonly LayoutOption[] = [
  {
    id: 'editorial',
    title: 'Editorial',
    desc: 'Authentic read.cv asymmetric layout with 100px duration gutter.',
  },
  {
    id: 'single-column',
    title: 'Single Column',
    desc: 'Classic chronological layout with right-aligned dates and section dividers.',
  },
  {
    id: 'balanced',
    title: 'Balanced',
    desc: 'Two-column split separating left toolkit from right timeline.',
  },
]

export function StudioLayout({ form, setForm }: StudioLayoutProps) {
  const { setIsPreviewingPrint } = useProfile()

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Layout and print preferences
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Choose how your profile renders online and formats during PDF printing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewingPrint(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[var(--grey1)] border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/50 hover:bg-[var(--inputBackgroundColor)] hover:border-[var(--grey3)] transition-all active:scale-98 cursor-pointer shrink-0 self-start sm:self-auto shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Open print preview</span>
        </button>
      </div>

      {/* Layout Presets Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider">
          Default layout preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LAYOUT_OPTIONS.map(({ id, title, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  printSettings: {
                    ...form.printSettings,
                    layoutPreset: id,
                  },
                })
              }
              className={`p-4 rounded-xl border text-left min-h-[96px] transition-all active:scale-98 ${
                form.printSettings.layoutPreset === id
                  ? 'border-[var(--grey1)] bg-[var(--inputBackgroundColor)]/80 ring-1 ring-[var(--grey1)]'
                  : 'border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] hover:bg-[var(--grey5)]'
              }`}
            >
              <div className="font-medium text-sm text-[var(--grey1)]">
                {title}
              </div>
              <div className="text-xs text-[var(--grey3)] mt-1 leading-relaxed">
                {desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Print Options */}
      <div className="space-y-4 pt-4 border-t border-[var(--secondaryBorderColor)]">
        <span className="text-xs font-mono text-[var(--grey3)] uppercase tracking-wider">
          Print options
        </span>

        <div className="p-4 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-[var(--grey1)]">
                Print Spacing Density
              </div>
              <div className="text-xs text-[var(--grey3)]">
                Compact reduces line-heights and margins to fit tight 1-page CVs.
              </div>
            </div>
            <div className="w-full sm:w-[200px] shrink-0">
              <CustomSelect
                value={form.printSettings.density}
                onChange={(val) => {
                  const density = val === 'compact' ? 'compact' : 'comfortable'
                  setForm({
                    ...form,
                    printSettings: {
                      ...form.printSettings,
                      density,
                    },
                  })
                }}
                options={[
                  { value: 'comfortable', label: 'Comfortable (Standard)' },
                  { value: 'compact', label: 'Compact (Tight fit)' },
                ]}
                aria-label="Print spacing density"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--secondaryBorderColor)] min-h-[44px]">
            <div>
              <div className="text-sm font-medium text-[var(--grey1)]">
                Include Photo in Printed CV
              </div>
              <div className="text-xs text-[var(--grey3)]">
                Hidden by default in authentic read.cv sheets.
              </div>
            </div>
            <Checkbox
              checked={form.printSettings.showAvatarInPrint}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  printSettings: {
                    ...form.printSettings,
                    showAvatarInPrint: checked,
                  },
                })
              }
              aria-label="Include photo in printed CV"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--secondaryBorderColor)] min-h-[44px]">
            <div>
              <div className="text-sm font-medium text-[var(--grey1)]">
                Include Links in Printed CV
              </div>
              <div className="text-xs text-[var(--grey3)]">
                Print full URLs alongside linked items.
              </div>
            </div>
            <Checkbox
              checked={form.printSettings.includeLinksInPrint}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  printSettings: {
                    ...form.printSettings,
                    includeLinksInPrint: checked,
                  },
                })
              }
              aria-label="Include links in printed CV"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--secondaryBorderColor)]">
            <div>
              <div className="text-sm font-medium text-[var(--grey1)]">
                Print Color Mode
              </div>
              <div className="text-xs text-[var(--grey3)]">
                Export CV as clean light paper or rich dark digital sheet.
              </div>
            </div>
            <div className="w-full sm:w-[200px] shrink-0">
              <CustomSelect
                value={form.printSettings.printTheme || 'light'}
                onChange={(val) => {
                  const printTheme = val === 'dark' ? 'dark' : 'light'
                  setForm({
                    ...form,
                    printSettings: {
                      ...form.printSettings,
                      printTheme,
                    },
                  })
                }}
                options={[
                  { value: 'light', label: 'Light (Paper standard)' },
                  { value: 'dark', label: 'Dark (Digital sheet)' },
                ]}
                aria-label="Print color mode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
