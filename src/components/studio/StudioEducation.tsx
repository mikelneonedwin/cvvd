import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, EducationItem } from '../../types/profile'
import { MonthYearPicker } from '../MonthYearPicker'

interface StudioEducationProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

export function StudioEducation({ form, setForm }: StudioEducationProps) {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      honors: '',
    }
    setForm({
      ...form,
      education: [newItem, ...form.education],
    })
  }

  const removeEducation = (id: string) => {
    setForm({
      ...form,
      education: form.education.filter((e) => e.id !== id),
    })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Education and degrees
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Academic qualifications, credentials, programs, and certifications.
          </p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add education</span>
        </button>
      </div>

      <div className="space-y-4">
        {form.education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-3"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...form.education]
                    updated[idx].degree = e.target.value
                    setForm({ ...form, education: updated })
                  }}
                  placeholder="Degree / Program"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)]"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...form.education]
                    updated[idx].institution = e.target.value
                    setForm({ ...form, education: updated })
                  }}
                  placeholder="Institution / University"
                  className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)]"
                />
              </div>

              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center shrink-0 active:scale-95"
                title="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.field}
                onChange={(e) => {
                  const updated = [...form.education]
                  updated[idx].field = e.target.value
                  setForm({ ...form, education: updated })
                }}
                placeholder="Field of study (e.g. Design, Economics, Literature)"
                className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              />
              <input
                type="text"
                value={edu.honors}
                onChange={(e) => {
                  const updated = [...form.education]
                  updated[idx].honors = e.target.value
                  setForm({ ...form, education: updated })
                }}
                placeholder="Honors / Distinctions (e.g. Departmental Honors)"
                className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MonthYearPicker
                label="Start Date / Year"
                value={edu.startYear}
                onChange={(newVal) => {
                  const updated = [...form.education]
                  updated[idx].startYear = newVal
                  setForm({ ...form, education: updated })
                }}
              />
              <MonthYearPicker
                label="End Date / Year"
                value={edu.endYear}
                onChange={(newVal) => {
                  const updated = [...form.education]
                  updated[idx].endYear = newVal
                  setForm({ ...form, education: updated })
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
