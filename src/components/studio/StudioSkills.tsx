import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { UserProfile, SkillCategory } from '../../types/profile'

interface StudioSkillsProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
}

function SkillCategoryRow({
  cat,
  onUpdateName,
  onUpdateSkills,
  onRemove,
}: {
  cat: SkillCategory
  onUpdateName: (name: string) => void
  onUpdateSkills: (skills: string[]) => void
  onRemove: () => void
}) {
  const [rawSkills, setRawSkills] = useState(() => cat.skills.join(', '))

  useEffect(() => {
    setRawSkills(cat.skills.join(', '))
  }, [cat.id])

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setRawSkills(text)
    // Keep empty strings while typing so trailing commas are not eaten
    const parsed = text.split(',').map((s) => s.trim())
    onUpdateSkills(parsed)
  }

  const handleSkillsBlur = () => {
    const clean = rawSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    setRawSkills(clean.join(', '))
    onUpdateSkills(clean)
  }

  return (
    <div className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 space-y-3">
      <div className="flex justify-between items-center gap-4">
        <input
          type="text"
          value={cat.name}
          onChange={(e) => onUpdateName(e.target.value)}
          placeholder="Category name (e.g. Design, Frontend)"
          className="px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm font-medium text-[var(--grey1)] w-full max-w-xs"
        />
        <button
          type="button"
          onClick={onRemove}
          className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center active:scale-95"
          title="Remove category"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-mono text-[var(--grey3)] mb-1.5">
          Skills (comma separated)
        </label>
        <input
          type="text"
          value={rawSkills}
          onChange={handleSkillsChange}
          onBlur={handleSkillsBlur}
          placeholder="e.g. Design Systems, Typography, Communication, Strategic Planning"
          className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
        />
      </div>
    </div>
  )
}

export function StudioSkills({ form, setForm }: StudioSkillsProps) {
  const addCategory = () => {
    setForm({
      ...form,
      skillCategories: [
        {
          id: `cat-${Date.now()}`,
          name: '',
          skills: [],
        },
        ...form.skillCategories,
      ],
    })
  }

  const removeCategory = (id: string) => {
    setForm({
      ...form,
      skillCategories: form.skillCategories.filter((c) => c.id !== id),
    })
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-[var(--grey1)]">
            Skills and tools
          </h2>
          <p className="text-xs text-[var(--grey3)] mt-0.5">
            Organize your proficiencies into clean categories.
          </p>
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add category</span>
        </button>
      </div>

      <div className="space-y-4">
        {form.skillCategories.map((cat, idx) => (
          <SkillCategoryRow
            key={cat.id}
            cat={cat}
            onUpdateName={(name) => {
              const updated = [...form.skillCategories]
              updated[idx].name = name
              setForm({ ...form, skillCategories: updated })
            }}
            onUpdateSkills={(skills) => {
              const updated = [...form.skillCategories]
              updated[idx].skills = skills
              setForm({ ...form, skillCategories: updated })
            }}
            onRemove={() => removeCategory(cat.id)}
          />
        ))}
      </div>
    </div>
  )
}
