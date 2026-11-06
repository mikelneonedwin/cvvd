import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, WorkExperience } from '../../types/profile'
import { MonthYearPicker } from '../MonthYearPicker'

interface StudioWorkProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioWork({ form, setForm }: StudioWorkProps) {
  const addExperience = () => {
    const newItem: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      employmentType: 'Full-time',
      summary: '',
      highlights: [],
      technologies: [],
      link: '',
    }
    setForm({
      ...form,
      experience: [newItem, ...form.experience],
    })
  }

  const removeExperience = (id: string) => {
    setForm({
      ...form,
      experience: form.experience.filter((e) => e.id !== id),
    })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Work experience
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Record your employment history, roles, milestones, and tools.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {form.experience.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => {
                    const updated = [...form.experience]
                    updated[idx].role = e.target.value
                    setForm({ ...form, experience: updated })
                  }}
                  placeholder="Role / Title"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)]"
                />
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => {
                    const updated = [...form.experience]
                    updated[idx].company = e.target.value
                    setForm({ ...form, experience: updated })
                  }}
                  placeholder="Company / Organization"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)]"
                />
              </div>

              <button
                type="button"
                onClick={() => removeExperience(item.id)}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center shrink-0 active:scale-95"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={item.link}
                onChange={(e) => {
                  const updated = [...form.experience]
                  updated[idx].link = e.target.value
                  setForm({ ...form, experience: updated })
                }}
                placeholder="Company website URL (https://...)"
                className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)]"
              />
              <input
                type="text"
                value={item.technologies.join(', ')}
                onChange={(e) => {
                  const updated = [...form.experience]
                  updated[idx].technologies = e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  setForm({ ...form, experience: updated })
                }}
                placeholder="Key skills / tools / technologies"
                className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
              <MonthYearPicker
                label="Start Date"
                value={item.startDate}
                onChange={(newVal) => {
                  const updated = [...form.experience]
                  updated[idx].startDate = newVal
                  setForm({ ...form, experience: updated })
                }}
              />

              <MonthYearPicker
                label="End Date"
                value={item.isCurrent ? '' : item.endDate}
                disabled={item.isCurrent}
                onChange={(newVal) => {
                  const updated = [...form.experience]
                  updated[idx].endDate = newVal
                  setForm({ ...form, experience: updated })
                }}
              />

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
                  Location & Status
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => {
                      const updated = [...form.experience]
                      updated[idx].location = e.target.value
                      setForm({ ...form, experience: updated })
                    }}
                    placeholder="Location"
                    className="flex-1 px-3 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-[var(--grey1)]"
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[var(--grey2)] px-2 min-h-[44px] shrink-0">
                    <input
                      type="checkbox"
                      checked={item.isCurrent}
                      onChange={(e) => {
                        const updated = [...form.experience]
                        updated[idx].isCurrent = e.target.checked
                        if (e.target.checked) updated[idx].endDate = 'Now'
                        setForm({ ...form, experience: updated })
                      }}
                      className="rounded border-[var(--secondaryBorderColor)] text-[var(--grey1)] w-4 h-4"
                    />
                    <span>Current</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--grey3)] mb-1.5">
                Role Summary
              </label>
              <textarea
                rows={2}
                value={item.summary}
                onChange={(e) => {
                  const updated = [...form.experience]
                  updated[idx].summary = e.target.value
                  setForm({ ...form, experience: updated })
                }}
                placeholder="Briefly describe what you built, designed, or led..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--grey3)] mb-1.5">
                Key Accomplishments / Highlights (one per line)
              </label>
              <textarea
                rows={3}
                value={item.highlights.join('\n')}
                onChange={(e) => {
                  const updated = [...form.experience]
                  updated[idx].highlights = e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  setForm({ ...form, experience: updated })
                }}
                placeholder="Led strategic initiatives...&#10;Streamlined operational workflows by 34%...&#10;Collaborated across multi-disciplinary teams..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] leading-relaxed font-sans"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
