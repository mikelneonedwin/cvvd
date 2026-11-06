import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, ProjectItem } from '../../types/profile'
import { MonthYearPicker } from '../MonthYearPicker'

interface StudioProjectsProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioProjects({ form, setForm }: StudioProjectsProps) {
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
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
  }

  const removeProject = (id: string) => {
    setForm({
      ...form,
      projects: form.projects.filter((p) => p.id !== id),
    })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Side projects
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
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-3 w-full">
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

            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr_1fr] gap-3 items-end">
              <MonthYearPicker
                label="Date / Year"
                value={proj.year}
                onChange={(newVal) => {
                  const updated = [...form.projects]
                  updated[idx].year = newVal
                  setForm({ ...form, projects: updated })
                }}
              />

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
                  value={proj.technologies.join(', ')}
                  onChange={(e) => {
                    const updated = [...form.projects]
                    updated[idx].technologies = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setForm({ ...form, projects: updated })
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
