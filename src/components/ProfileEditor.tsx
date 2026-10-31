import { useRef, useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Download,
  Upload,
  User,
  Briefcase,
  Layers,
  BookOpen,
  GraduationCap,
  Wrench,
  Sliders,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import type {
  AvailabilityState,
  EducationItem,
  ProfileLink,
  ProjectItem,
  SkillCategory,
  SocialPlatform,
  WorkExperience,
  WritingItem,
} from '../types/profile'

type EditorTab =
  | 'basics'
  | 'experience'
  | 'projects'
  | 'writing'
  | 'education'
  | 'skills'
  | 'layout'

function isAvailabilityState(val: string): val is AvailabilityState {
  return ['available', 'employed', 'freelance', 'busy'].includes(val)
}

function isSocialPlatform(val: string): val is SocialPlatform {
  return [
    'website',
    'github',
    'twitter',
    'linkedin',
    'email',
    'other',
  ].includes(val)
}

function isPrintDensity(val: string): val is 'comfortable' | 'compact' {
  return val === 'comfortable' || val === 'compact'
}

export function ProfileEditor() {
  const {
    profile,
    isEditing,
    setIsEditing,
    updateBasics,
    updateExperience,
    updateProjects,
    updateWriting,
    updateEducation,
    updateSkills,
    updateSectionVisibility,
    updatePrintSettings,
    resetProfile,
    importProfile,
    exportProfileJson,
    showToast,
  } = useProfile()

  const [activeTab, setActiveTab] = useState<EditorTab>('basics')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isEditing) return null

  // Links handlers in Basics
  const handleAddLink = () => {
    const newLink: ProfileLink = {
      id: `link-${Date.now()}`,
      platform: 'website',
      label: 'newlink.com',
      url: 'https://newlink.com',
    }
    updateBasics({ links: [...profile.basics.links, newLink] })
    showToast('Added link')
  }

  const handleUpdateLink = (id: string, partial: Partial<ProfileLink>) => {
    const updated = profile.basics.links.map((l) =>
      l.id === id ? { ...l, ...partial } : l
    )
    updateBasics({ links: updated })
  }

  const handleDeleteLink = (id: string) => {
    updateBasics({ links: profile.basics.links.filter((l) => l.id !== id) })
    showToast('Removed link')
  }

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      role: 'Role Title',
      startDate: '2024',
      endDate: 'Present',
      isCurrent: true,
      location: 'Remote',
      employmentType: 'Full-time',
      summary: 'Summary of contributions and focus areas.',
      highlights: ['Key project or engineering accomplishment.'],
      technologies: ['React', 'TypeScript'],
      link: '',
    }
    updateExperience([newExp, ...profile.experience])
    showToast('Added work experience entry')
  }

  const handleUpdateExpItem = (id: string, partial: Partial<WorkExperience>) => {
    const updated = profile.experience.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    )
    updateExperience(updated)
  }

  const handleDeleteExpItem = (id: string) => {
    updateExperience(profile.experience.filter((item) => item.id !== id))
    showToast('Removed experience entry')
  }

  // Project handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      tagline: 'Short description of the product',
      description: 'Detailed summary of the design and engineering implementation.',
      year: new Date().getFullYear().toString(),
      link: '',
      technologies: ['TypeScript', 'Design'],
      featured: true,
      imageUrl: '',
    }
    updateProjects([newProj, ...profile.projects])
    showToast('Added project entry')
  }

  const handleUpdateProjItem = (id: string, partial: Partial<ProjectItem>) => {
    const updated = profile.projects.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    )
    updateProjects(updated)
  }

  const handleDeleteProjItem = (id: string) => {
    updateProjects(profile.projects.filter((item) => item.id !== id))
    showToast('Removed project entry')
  }

  // Writing handlers
  const handleAddWriting = () => {
    const newWriting: WritingItem = {
      id: `writ-${Date.now()}`,
      title: 'New Essay or Note',
      publication: 'Self-published',
      year: new Date().getFullYear().toString(),
      url: '',
      description: 'Summary of the essay core theme.',
    }
    updateWriting([newWriting, ...profile.writing])
    showToast('Added writing entry')
  }

  const handleUpdateWritingItem = (id: string, partial: Partial<WritingItem>) => {
    const updated = profile.writing.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    )
    updateWriting(updated)
  }

  const handleDeleteWritingItem = (id: string) => {
    updateWriting(profile.writing.filter((item) => item.id !== id))
    showToast('Removed writing entry')
  }

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University / Institute',
      degree: 'Degree or Certificate',
      field: 'Field of Study',
      startYear: '2020',
      endYear: '2024',
      honors: '',
    }
    updateEducation([...profile.education, newEdu])
    showToast('Added education entry')
  }

  const handleUpdateEduItem = (id: string, partial: Partial<EducationItem>) => {
    const updated = profile.education.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    )
    updateEducation(updated)
  }

  const handleDeleteEduItem = (id: string) => {
    updateEducation(profile.education.filter((item) => item.id !== id))
    showToast('Removed education entry')
  }

  // Skill category handlers
  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-cat-${Date.now()}`,
      name: 'New Category',
      skills: ['Skill 1', 'Skill 2'],
    }
    updateSkills([...profile.skillCategories, newCat])
    showToast('Added skill category')
  }

  const handleDeleteSkillCategory = (id: string) => {
    updateSkills(profile.skillCategories.filter((c) => c.id !== id))
    showToast('Removed skill category')
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text =
          typeof event.target?.result === 'string' ? event.target.result : ''
        if (!text) {
          showToast('Could not read file contents')
          return
        }
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit CV Profile"
      className="no-print fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[600px] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col transition-all duration-300"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileImport}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-500" />
          <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Edit CV Profile
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            aria-label="Close editor"
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div
        className="flex items-center gap-1 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto text-xs font-mono scrollbar-none"
        aria-label="Editor tabs"
      >
        <button
          type="button"
          onClick={() => setActiveTab('basics')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'basics'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Basics</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('experience')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'experience'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience ({profile.experience.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Projects ({profile.projects.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('writing')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'writing'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Writing</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'education'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'skills'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Skills</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`px-3 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1.5 ${
            activeTab === 'layout'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Layout & Print</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Tab 1: Basics */}
        {activeTab === 'basics' && (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.basics.name}
                onChange={(e) => updateBasics({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                cvvd Handle
              </label>
              <input
                type="text"
                value={profile.basics.handle}
                onChange={(e) => updateBasics({ handle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Avatar Image URL (or SVG Data URI)
              </label>
              <input
                type="text"
                value={profile.basics.avatarUrl}
                onChange={(e) => updateBasics({ avatarUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Headline / Role Title
              </label>
              <input
                type="text"
                value={profile.basics.headline}
                onChange={(e) => updateBasics({ headline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">
                  Availability Status
                </label>
                <select
                  value={profile.basics.status.state}
                  onChange={(e) => {
                    const nextVal = e.target.value
                    if (isAvailabilityState(nextVal)) {
                      updateBasics({
                        status: {
                          ...profile.basics.status,
                          state: nextVal,
                        },
                      })
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                >
                  <option value="available">Available</option>
                  <option value="freelance">Freelance</option>
                  <option value="busy">Busy</option>
                  <option value="employed">Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">
                  Status Text
                </label>
                <input
                  type="text"
                  value={profile.basics.status.label}
                  onChange={(e) =>
                    updateBasics({
                      status: {
                        ...profile.basics.status,
                        label: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.basics.location}
                  onChange={(e) => updateBasics({ location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">
                  Timezone ID
                </label>
                <input
                  type="text"
                  value={profile.basics.timezone}
                  onChange={(e) => updateBasics({ timezone: e.target.value })}
                  placeholder="America/Los_Angeles"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1">
                Editorial Bio / Summary
              </label>
              <textarea
                rows={4}
                value={profile.basics.summary}
                onChange={(e) => updateBasics({ summary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 leading-relaxed text-xs"
              />
            </div>

            {/* Links Manager */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500 font-medium">
                  Links & Social
                </span>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-2">
                {profile.basics.links.map((link) => (
                  <div
                    key={link.id}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center gap-2"
                  >
                    <select
                      value={link.platform}
                      onChange={(e) => {
                        const nextVal = e.target.value
                        if (isSocialPlatform(nextVal)) {
                          handleUpdateLink(link.id, {
                            platform: nextVal,
                          })
                        }
                      }}
                      className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    >
                      <option value="website">Website</option>
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                      <option value="other">Other</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { label: e.target.value })
                      }
                      className="flex-1 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />

                    <input
                      type="text"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        handleUpdateLink(link.id, { url: e.target.value })
                      }
                      className="flex-1 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">
                Work History Timeline
              </span>
              <button
                type="button"
                onClick={handleAddExperience}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.experience.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-neutral-400">
                      Entry #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={item.company}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { company: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Role title"
                      value={item.role}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { role: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Start Year"
                      value={item.startDate}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { startDate: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="End Year"
                      disabled={item.isCurrent}
                      value={item.isCurrent ? 'Present' : item.endDate}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { endDate: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono disabled:opacity-50"
                    />
                    <label className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <input
                        type="checkbox"
                        checked={item.isCurrent}
                        onChange={(e) =>
                          handleUpdateExpItem(item.id, { isCurrent: e.target.checked })
                        }
                      />
                      <span>Current</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Location"
                      value={item.location}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { location: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Company Link URL"
                      value={item.link}
                      onChange={(e) =>
                        handleUpdateExpItem(item.id, { link: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Role overview summary..."
                    value={item.summary}
                    onChange={(e) =>
                      handleUpdateExpItem(item.id, { summary: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs leading-relaxed"
                  />

                  {/* Highlights with smooth newline support */}
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Key Highlights (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={item.highlights.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n')
                        handleUpdateExpItem(item.id, { highlights: lines })
                      }}
                      onBlur={() => {
                        const cleaned = item.highlights
                          .map((h) => h.trim())
                          .filter(Boolean)
                        handleUpdateExpItem(item.id, { highlights: cleaned })
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono leading-relaxed"
                    />
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={item.technologies.join(', ')}
                      onChange={(e) => {
                        const raw = e.target.value.split(',')
                        handleUpdateExpItem(item.id, {
                          technologies: raw.map((t) => t.trimStart()),
                        })
                      }}
                      onBlur={() => {
                        const cleaned = item.technologies
                          .map((t) => t.trim())
                          .filter(Boolean)
                        handleUpdateExpItem(item.id, { technologies: cleaned })
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Side Projects</span>
              <button
                type="button"
                onClick={handleAddProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {profile.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {proj.title || 'Untitled Project'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProjItem(proj.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) =>
                        handleUpdateProjItem(proj.id, { title: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Tagline / One-liner"
                      value={proj.tagline}
                      onChange={(e) =>
                        handleUpdateProjItem(proj.id, { tagline: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Project URL"
                      value={proj.link}
                      onChange={(e) =>
                        handleUpdateProjItem(proj.id, { link: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={proj.year}
                      onChange={(e) =>
                        handleUpdateProjItem(proj.id, { year: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Project description..."
                    value={proj.description}
                    onChange={(e) =>
                      handleUpdateProjItem(proj.id, { description: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Writing */}
        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Publications & Essays</span>
              <button
                type="button"
                onClick={handleAddWriting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Article</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.writing.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) =>
                        handleUpdateWritingItem(item.id, { title: e.target.value })
                      }
                      className="flex-1 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteWritingItem(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Publication or Outlet"
                      value={item.publication}
                      onChange={(e) =>
                        handleUpdateWritingItem(item.id, { publication: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={item.year}
                      onChange={(e) =>
                        handleUpdateWritingItem(item.id, { year: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) =>
                      handleUpdateWritingItem(item.id, { url: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Short description"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateWritingItem(item.id, { description: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Education with separate start and end year inputs */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Education</span>
              <button
                type="button"
                onClick={handleAddEducation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEduItem(edu.id, { institution: e.target.value })
                      }
                      className="flex-1 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteEduItem(edu.id)}
                      className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEduItem(edu.id, { degree: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) =>
                        handleUpdateEduItem(edu.id, { field: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Start Year"
                        value={edu.startYear}
                        onChange={(e) =>
                          handleUpdateEduItem(edu.id, { startYear: e.target.value })
                        }
                        className="w-1/2 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                      />
                      <span className="text-neutral-400">-</span>
                      <input
                        type="text"
                        placeholder="End Year"
                        value={edu.endYear}
                        onChange={(e) =>
                          handleUpdateEduItem(edu.id, { endYear: e.target.value })
                        }
                        className="w-1/2 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Honors / Distinction"
                      value={edu.honors}
                      onChange={(e) =>
                        handleUpdateEduItem(edu.id, { honors: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Skills with Add Category and immutable updates */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">
                Skill Categories & Tags
              </span>
              <button
                type="button"
                onClick={handleAddSkillCategory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            {profile.skillCategories.map((cat, index) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => {
                      const updated = profile.skillCategories.map((c, i) =>
                        i === index ? { ...c, name: e.target.value } : c
                      )
                      updateSkills(updated)
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSkillCategory(cat.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={cat.skills.join(', ')}
                  onChange={(e) => {
                    const raw = e.target.value.split(',')
                    const updated = profile.skillCategories.map((c, i) =>
                      i === index
                        ? { ...c, skills: raw.map((s) => s.trimStart()) }
                        : c
                    )
                    updateSkills(updated)
                  }}
                  onBlur={() => {
                    const updated = profile.skillCategories.map((c, i) =>
                      i === index
                        ? {
                            ...c,
                            skills: c.skills.map((s) => s.trim()).filter(Boolean),
                          }
                        : c
                    )
                    updateSkills(updated)
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Layout & Print Settings */}
        {activeTab === 'layout' && (
          <div className="space-y-6 text-sm">
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wide">
                CV Layout Style
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'editorial' as const,
                    name: 'Editorial',
                    desc: 'read.cv asymmetric timeline with 100px duration column',
                  },
                  {
                    id: 'single-column' as const,
                    name: 'Single Column',
                    desc: 'Full-width chronological layout with inline right-aligned dates',
                  },
                  {
                    id: 'balanced' as const,
                    name: 'Balanced',
                    desc: 'Balanced two-column split with skills and credentials on the left',
                  },
                ].map((style) => {
                  const isSelected =
                    (profile.printSettings.layoutPreset || 'editorial') === style.id
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        updatePrintSettings({ layoutPreset: style.id })
                        showToast(`Layout changed to ${style.name}`)
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                        {style.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 leading-relaxed">
                        {style.desc}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wide">
                Section Visibility
              </h3>
              <div className="space-y-2 bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                {(
                  [
                    ['about', 'About Section'],
                    ['experience', 'Work Experience'],
                    ['projects', 'Side Projects'],
                    ['writing', 'Writing & Notes'],
                    ['education', 'Education'],
                    ['skills', 'Skills & Toolkit'],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between text-xs py-1 cursor-pointer"
                  >
                    <span className="text-neutral-700 dark:text-neutral-300">{label}</span>
                    <input
                      type="checkbox"
                      checked={profile.sectionVisibility[key]}
                      onChange={(e) =>
                        updateSectionVisibility({ [key]: e.target.checked })
                      }
                      className="rounded border-neutral-300 text-neutral-900"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wide">
                Print & Export Configuration
              </h3>
              <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div>
                  <label className="block text-xs font-mono text-neutral-500 mb-1">
                    Print Spacing Density
                  </label>
                  <select
                    value={profile.printSettings.density}
                    onChange={(e) => {
                      const nextVal = e.target.value
                      if (isPrintDensity(nextVal)) {
                        updatePrintSettings({
                          density: nextVal,
                        })
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                  >
                    <option value="comfortable">Comfortable (Standard read.cv)</option>
                    <option value="compact">Compact (Tighter 1-page fit)</option>
                  </select>
                </div>

                <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Include Avatar in Printed CV
                  </span>
                  <input
                    type="checkbox"
                    checked={profile.printSettings.showAvatarInPrint}
                    onChange={(e) =>
                      updatePrintSettings({ showAvatarInPrint: e.target.checked })
                    }
                    className="rounded border-neutral-300 text-neutral-900"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={resetProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                </button>

                <button
                  type="button"
                  onClick={exportProfileJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between">
        <span className="text-xs font-mono text-neutral-400">
          Changes save automatically
        </span>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false)
            showToast('Finished editing CV')
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Done</span>
        </button>
      </div>
    </div>
  )
}
