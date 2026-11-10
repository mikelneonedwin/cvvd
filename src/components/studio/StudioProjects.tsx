import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, ProjectItem } from '../../types/profile'
import { YEARS, parseDateString } from '../../lib/dateUtils'
import { CustomSelect } from '../CustomSelect'

interface StudioProjectsProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioProjects({ form, setForm }: StudioProjectsProps) {
  // Local raw input state per project id so typing spaces and commas feels completely natural
  const [techInputs, setTechInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    form.projects.forEach((p) => {
      initial[p.id] = p.technologies.join(', ')
    })
    return initial
  })

  // Sync incoming projects if they differ and are not actively being edited
  useEffect(() => {
    setTechInputs((prev) => {
      const updated = { ...prev }
      form.projects.forEach((p) => {
        if (updated[p.id] === undefined) {
          updated[p.id] = p.technologies.join(', ')
        }
      })
      return updated
    })
  }, [form.projects])

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      company: '',
      tagline: '',
      description: '',
      year: '',
      link: '',
      technologies: [],
      featured: false,
      imageUrl: '',
    }
    setForm({
      ...form,
      projects: [newProj, ...form.projects],
    })
    setTechInputs((prev) => ({ ...prev, [newProj.id]: '' }))
  }

  const removeProject = (id: string) => {
    setForm({
      ...form,
      projects: form.projects.filter((p) => p.id !== id),
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
            Projects
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Showcase indie apps, open source contributions, tools, publications, and initiatives.
          </p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add project</span>
        </button>
      </div>

      <div className="space-y-4">
        {form.projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => {
                    const updated = [...form.projects]
                    updated[idx].title = e.target.value
                    setForm({ ...form, projects: updated })
                  }}
                  placeholder="Project title"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)]"
                />
                <input
                  type="text"
                  value={proj.company ?? ''}
                  onChange={(e) => {
                    const updated = [...form.projects]
                    updated[idx].company = e.target.value
                    setForm({ ...form, projects: updated })
                  }}
                  placeholder="Company / Client (optional)"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
                />
                <input
                  type="url"
                  value={proj.link}
                  onChange={(e) => {
                    const updated = [...form.projects]
                    updated[idx].link = e.target.value
                    setForm({ ...form, projects: updated })
                  }}
                  placeholder="Website or repository URL (https://...)"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)]"
                />
              </div>

              <button
                type="button"
                onClick={() => removeProject(proj.id)}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center shrink-0 active:scale-95"
                title="Remove project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr] gap-3 items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
                  Year
                </span>
                <CustomSelect
                  value={parseDateString(proj.year).year || proj.year}
                  onChange={(newYear) => {
                    const updated = [...form.projects]
                    updated[idx].year = newYear
                    setForm({ ...form, projects: updated })
                  }}
                  options={[
                    { value: '', label: 'Year' },
                    ...YEARS.map((y) => ({ value: y, label: y })),
                  ]}
                  aria-label="Project year"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
                  Tagline
                </span>
                <input
                  type="text"
                  value={proj.tagline}
                  onChange={(e) => {
                    const updated = [...form.projects]
                    updated[idx].tagline = e.target.value
                    setForm({ ...form, projects: updated })
                  }}
                  placeholder="One-liner summary"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
                  Tools / Technologies
                </span>
                <input
                  type="text"
                  value={techInputs[proj.id] ?? proj.technologies.join(', ')}
                  onChange={(e) => {
                    const rawVal = e.target.value
                    setTechInputs((prev) => ({ ...prev, [proj.id]: rawVal }))

                    const parsed = rawVal
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)

                    const updated = [...form.projects]
                    updated[idx].technologies = parsed
                    setForm({ ...form, projects: updated })
                  }}
                  onBlur={() => {
                    // Clean up and format cleanly on blur
                    const formatted = proj.technologies.join(', ')
                    setTechInputs((prev) => ({ ...prev, [proj.id]: formatted }))
                  }}
                  placeholder="Key tools, methodologies, materials"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
                />
              </div>
            </div>

            <textarea
              rows={2}
              value={proj.description}
              onChange={(e) => {
                const updated = [...form.projects]
                updated[idx].description = e.target.value
                setForm({ ...form, projects: updated })
              }}
              placeholder="Short summary of what it does..."
              className="w-full px-3.5 py-3 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
