import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, WorkExperience } from '../../types/profile'
import { MonthYearPicker } from '../MonthYearPicker'
import { Checkbox } from '../Checkbox'

interface StudioWorkProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioWork({ form, setForm }: StudioWorkProps) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    form.experience.forEach((item) => {
      initial[item.id] = item.technologies.join(', ')
    })
    return initial
  })

  useEffect(() => {
    setTechInputs((prev) => {
      const updated = { ...prev }
      form.experience.forEach((item) => {
        if (updated[item.id] === undefined) {
          updated[item.id] = item.technologies.join(', ')
        }
      })
      return updated
    })
  }, [form.experience])

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
    setTechInputs((prev) => ({ ...prev, [newItem.id]: '' }))
  }

  const removeExperience = (id: string) => {
    setForm({
      ...form,
      experience: form.experience.filter((e) => e.id !== id),
    })
    setTechInputs((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
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
                value={techInputs[item.id] ?? item.technologies.join(', ')}
                onChange={(e) => {
                  const rawVal = e.target.value
                  setTechInputs((prev) => ({ ...prev, [item.id]: rawVal }))

                  const parsed = rawVal
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)

                  const updated = [...form.experience]
                  updated[idx].technologies = parsed
                  setForm({ ...form, experience: updated })
                }}
                onBlur={() => {
                  const formatted = item.technologies.join(', ')
                  setTechInputs((prev) => ({ ...prev, [item.id]: formatted }))
                }}
                placeholder="Key skills / tools / technologies"
                className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end text-xs">
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

              <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
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
                    className="flex-1 min-w-0 px-3 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
                  />
                  <div
                    onClick={() => {
                      const next = !item.isCurrent
                      const updated = [...form.experience]
                      updated[idx].isCurrent = next
                      if (next) updated[idx].endDate = 'Now'
                      setForm({ ...form, experience: updated })
                    }}
                    className="flex items-center gap-2 cursor-pointer select-none text-[var(--grey2)] hover:text-[var(--grey1)] px-2 min-h-[44px] shrink-0 transition-colors"
                  >
                    <Checkbox
                      checked={item.isCurrent}
                      onCheckedChange={(checked) => {
                        const updated = [...form.experience]
                        updated[idx].isCurrent = checked
                        if (checked) updated[idx].endDate = 'Now'
                        setForm({ ...form, experience: updated })
                      }}
                      aria-label="Currently working here"
                    />
                    <span>Current</span>
                  </div>
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
