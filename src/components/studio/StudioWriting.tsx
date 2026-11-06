import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, WritingItem } from '../../types/profile'
import { MonthYearPicker } from '../MonthYearPicker'

interface StudioWritingProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioWriting({ form, setForm }: StudioWritingProps) {
  const addWriting = () => {
    const newItem: WritingItem = {
      id: `write-${Date.now()}`,
      title: '',
      publication: '',
      year: '',
      url: '',
      description: '',
    }
    setForm({
      ...form,
      writing: [newItem, ...form.writing],
    })
  }

  const removeWriting = (id: string) => {
    setForm({
      ...form,
      writing: form.writing.filter((w) => w.id !== id),
    })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Writing and publications
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Articles, essays, documentation, books, or technical papers.
          </p>
        </div>
        <button
          type="button"
          onClick={addWriting}
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add writing</span>
        </button>
      </div>

      <div className="space-y-4">
        {form.writing.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...form.writing]
                    updated[idx].title = e.target.value
                    setForm({ ...form, writing: updated })
                  }}
                  placeholder="Article or publication title"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)]"
                />
                <input
                  type="text"
                  value={item.publication}
                  onChange={(e) => {
                    const updated = [...form.writing]
                    updated[idx].publication = e.target.value
                    setForm({ ...form, writing: updated })
                  }}
                  placeholder="Publisher / Outlet / Medium / Substack"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
                />
              </div>

              <button
                type="button"
                onClick={() => removeWriting(item.id)}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center shrink-0 active:scale-95"
                title="Remove writing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 items-end">
              <MonthYearPicker
                label="Date / Year"
                value={item.year}
                onChange={(newVal) => {
                  const updated = [...form.writing]
                  updated[idx].year = newVal
                  setForm({ ...form, writing: updated })
                }}
              />

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
                  Link
                </span>
                <input
                  type="url"
                  value={item.url}
                  onChange={(e) => {
                    const updated = [...form.writing]
                    updated[idx].url = e.target.value
                    setForm({ ...form, writing: updated })
                  }}
                  placeholder="https://... (URL optional)"
                  className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)]"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={item.description}
              onChange={(e) => {
                const updated = [...form.writing]
                updated[idx].description = e.target.value
                setForm({ ...form, writing: updated })
              }}
              placeholder="Brief description or takeaway..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
