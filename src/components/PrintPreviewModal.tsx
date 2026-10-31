import { useState, useEffect } from 'react'
import { Printer, X, SlidersHorizontal } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import type { LayoutPreset } from '../types/profile'

export function PrintPreviewModal() {
  const {
    profile,
    isPreviewingPrint,
    setIsPreviewingPrint,
    triggerPrint,
    updatePrintSettings,
    updateSectionVisibility,
    showToast,
  } = useProfile()

  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewingPrint) {
        setIsPreviewingPrint(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewingPrint, setIsPreviewingPrint])

  if (!isPreviewingPrint) return null

  const {
    basics,
    experience,
    projects,
    writing,
    education,
    skillCategories,
    sectionVisibility,
    printSettings,
  } = profile

  const preset = printSettings.layoutPreset || 'editorial'
  const isCompact = printSettings.density === 'compact'

  const toggleSection = (key: keyof typeof sectionVisibility) => {
    const next = !sectionVisibility[key]
    updateSectionVisibility({ [key]: next })
  }

  const toggleDensity = () => {
    const next = isCompact ? 'comfortable' : 'compact'
    updatePrintSettings({ density: next })
    showToast(`Print density set to ${next}`)
  }

  const toggleAvatar = () => {
    const next = !printSettings.showAvatarInPrint
    updatePrintSettings({ showAvatarInPrint: next })
    showToast(`Avatar in print: ${next ? 'enabled' : 'hidden'}`)
  }

  const setLayoutPreset = (newPreset: LayoutPreset, name: string) => {
    updatePrintSettings({ layoutPreset: newPreset })
    showToast(`Layout changed to ${name}`)
  }

  const sectionsList: Array<{
    key: keyof typeof sectionVisibility
    label: string
    count?: number
  }> = [
    { key: 'about', label: 'About' },
    { key: 'experience', label: 'Work experience', count: experience.length },
    { key: 'projects', label: 'Side projects', count: projects.length },
    { key: 'writing', label: 'Writing', count: writing.length },
    { key: 'education', label: 'Education', count: education.length },
    { key: 'skills', label: 'Skills', count: skillCategories.length },
  ]

  const layoutStyles: Array<{
    id: LayoutPreset
    name: string
    desc: string
  }> = [
    {
      id: 'editorial',
      name: 'Editorial',
      desc: 'read.cv asymmetric layout with left duration gutter',
    },
    {
      id: 'single-column',
      name: 'Single Column',
      desc: 'Full-width layout with inline right-aligned dates',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      desc: 'Balanced two-column split with skills and credentials on left',
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Print Profile"
      className="no-print fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-fade-in"
    >
      <div className="relative w-full max-w-[620px] h-[90vh] max-h-[760px] bg-[var(--backgroundColor)] border border-[var(--primaryBorderColor)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-[var(--transparentBorder)]">
          <div>
            <h2 className="text-[20px] font-normal text-[var(--grey1)] leading-tight">
              Print Profile
            </h2>
            <p className="text-[12px] text-[var(--grey3)] mt-0.5">
              Configure layout style, printed sections, and document options
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switch */}
            <div className="flex items-center bg-[var(--inputBackgroundColor)] p-0.5 rounded-lg text-[12px]">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[var(--backgroundColor)] text-[var(--grey1)] shadow-xs font-medium'
                    : 'text-[var(--grey2)] hover:text-[var(--grey1)]'
                }`}
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-[var(--backgroundColor)] text-[var(--grey1)] shadow-xs font-medium'
                    : 'text-[var(--grey2)] hover:text-[var(--grey1)]'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPreviewingPrint(false)}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-[var(--grey3)] hover:text-[var(--grey1)] hover:bg-[var(--transparentBorder)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
          {activeTab === 'settings' ? (
            <div className="space-y-6">
              {/* Authentic read.cv Tip Box */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--inputBackgroundColor)] text-[13px] text-[var(--grey2)] leading-relaxed">
                <p>
                  <strong className="text-[var(--grey1)] font-medium">Tip ✨</strong>{' '}
                  For best results we suggest turning off &quot;Headers and footers&quot; in
                  your browser print settings.
                </p>
              </div>

              {/* Layout Preset Selector */}
              <div>
                <h3 className="text-[12px] font-medium text-[var(--grey3)] uppercase tracking-wider mb-2">
                  CV Layout Style
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {layoutStyles.map((style) => {
                    const isSelected = preset === style.id
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setLayoutPreset(style.id, style.name)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-[var(--grey1)] bg-[var(--inputBackgroundColor)] ring-1 ring-[var(--grey1)]'
                            : 'border-[var(--secondaryBorderColor)] hover:border-[var(--grey3)]'
                        }`}
                      >
                        <div className="text-[13px] font-medium text-[var(--grey1)] mb-1">
                          {style.name}
                        </div>
                        <div className="text-[11px] text-[var(--grey3)] leading-relaxed">
                          {style.desc}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Toggle Printed Sections */}
              <div>
                <h3 className="text-[12px] font-medium text-[var(--grey3)] uppercase tracking-wider mb-2">
                  Toggle printed sections
                </h3>
                <div className="divide-y divide-[var(--secondaryBorderColor)] border-y border-[var(--secondaryBorderColor)]">
                  {sectionsList.map((sec) => {
                    const isChecked = Boolean(sectionVisibility[sec.key])
                    return (
                      <div
                        key={sec.key}
                        className="py-3 flex items-center justify-between"
                      >
                        <label
                          htmlFor={`print-sec-${sec.key}`}
                          className="flex flex-col cursor-pointer select-none"
                        >
                          <span className="text-[14px] text-[var(--grey1)]">
                            {sec.label}
                          </span>
                          <span className="text-[12px] text-[var(--grey3)]">
                            {isChecked ? 'On' : 'Off'}
                            {sec.count !== undefined ? ` (${sec.count} items)` : ''}
                          </span>
                        </label>

                        <button
                          type="button"
                          id={`print-sec-${sec.key}`}
                          role="switch"
                          aria-checked={isChecked}
                          onClick={() => toggleSection(sec.key)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--grey1)] focus-visible:ring-offset-2 ${
                            isChecked
                              ? 'bg-[var(--grey1)]'
                              : 'bg-[var(--grey4)] dark:bg-neutral-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[var(--backgroundColor)] shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isChecked ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Print Layout Options */}
              <div>
                <h3 className="text-[12px] font-medium text-[var(--grey3)] uppercase tracking-wider mb-2">
                  Print options
                </h3>
                <div className="divide-y divide-[var(--secondaryBorderColor)] border-y border-[var(--secondaryBorderColor)]">
                  {/* Photo toggle */}
                  <div className="py-3 flex items-center justify-between">
                    <label
                      htmlFor="print-opt-photo"
                      className="flex flex-col cursor-pointer select-none"
                    >
                      <span className="text-[14px] text-[var(--grey1)]">
                        Include profile photo
                      </span>
                      <span className="text-[12px] text-[var(--grey3)]">
                        {printSettings.showAvatarInPrint
                          ? 'Visible in print'
                          : 'Hidden (read.cv default)'}
                      </span>
                    </label>

                    <button
                      type="button"
                      id="print-opt-photo"
                      role="switch"
                      aria-checked={printSettings.showAvatarInPrint}
                      onClick={toggleAvatar}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--grey1)] focus-visible:ring-offset-2 ${
                        printSettings.showAvatarInPrint
                          ? 'bg-[var(--grey1)]'
                          : 'bg-[var(--grey4)] dark:bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[var(--backgroundColor)] shadow-sm ring-0 transition duration-200 ease-in-out ${
                          printSettings.showAvatarInPrint ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Print Density */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[14px] text-[var(--grey1)]">Print density</div>
                      <div className="text-[12px] text-[var(--grey3)]">
                        {isCompact ? 'Compact typography and tight spacing' : 'Comfortable typography'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleDensity}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--grey1)] bg-[var(--inputBackgroundColor)] hover:bg-[var(--grey4)] transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span className="capitalize">{printSettings.density}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Document Page Layout Preview */
            <div className="flex flex-col items-center">
              <div className="w-full bg-white text-black p-6 sm:p-8 rounded-lg shadow-md border border-neutral-200 text-[11px] leading-relaxed relative">
                {/* Single Column Layout Preview */}
                {preset === 'single-column' && (
                  <div className="space-y-5">
                    {/* Masthead */}
                    <div className="border-b border-neutral-200 pb-4 flex items-center justify-between gap-4">
                      <div>
                        <h1 className="text-[16px] font-medium text-black leading-tight">
                          {basics.name}
                        </h1>
                        <p className="text-[11px] text-neutral-600 leading-normal mt-0.5">
                          {basics.headline}
                          {basics.location && <span> in {basics.location}</span>}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-neutral-700">
                          {basics.links.map((link) => (
                            <span key={link.id}>{link.label}</span>
                          ))}
                        </div>
                      </div>

                      {printSettings.showAvatarInPrint && basics.avatarUrl && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/10 shrink-0">
                          <img
                            src={basics.avatarUrl}
                            alt={basics.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Sections */}
                    {sectionVisibility.about && basics.summary && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          About
                        </h2>
                        <p className="text-neutral-700 text-[10px] leading-relaxed">
                          {basics.summary}
                        </p>
                      </div>
                    )}

                    {sectionVisibility.experience && experience.length > 0 && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          Work experience
                        </h2>
                        <div className="space-y-3">
                          {experience.map((item) => (
                            <div key={item.id} className="text-[10px]">
                              <div className="flex justify-between items-baseline">
                                <div className="font-medium text-black">
                                  {item.role} <span className="font-normal text-neutral-400">at</span> {item.company}
                                  {item.location && <span className="text-neutral-500 font-normal"> · {item.location}</span>}
                                </div>
                                <div className="text-neutral-500 font-mono text-[9.5px]">
                                  {item.startDate} - {item.isCurrent ? 'Now' : item.endDate}
                                </div>
                              </div>
                              {item.summary && <p className="text-neutral-700 mt-0.5 leading-normal">{item.summary}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sectionVisibility.projects && projects.length > 0 && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          Side projects
                        </h2>
                        <div className="space-y-2">
                          {projects.map((proj) => (
                            <div key={proj.id} className="text-[10px]">
                              <div className="flex justify-between items-baseline">
                                <div className="font-medium text-black">{proj.title}</div>
                                <div className="text-neutral-500 font-mono text-[9.5px]">{proj.year}</div>
                              </div>
                              {proj.description && <p className="text-neutral-700 mt-0.5">{proj.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sectionVisibility.writing && writing.length > 0 && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          Writing
                        </h2>
                        <div className="space-y-2">
                          {writing.map((w) => (
                            <div key={w.id} className="text-[10px]">
                              <div className="flex justify-between items-baseline">
                                <div className="font-medium text-black">{w.title}</div>
                                <div className="text-neutral-500 font-mono text-[9.5px]">{w.year}</div>
                              </div>
                              {w.publication && <div className="text-neutral-500 text-[9px]">{w.publication}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sectionVisibility.education && education.length > 0 && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          Education
                        </h2>
                        <div className="space-y-2">
                          {education.map((edu) => (
                            <div key={edu.id} className="text-[10px]">
                              <div className="flex justify-between items-baseline">
                                <div className="font-medium text-black">{edu.degree} at {edu.institution}</div>
                                <div className="text-neutral-500 font-mono text-[9.5px]">{edu.startYear} - {edu.endYear}</div>
                              </div>
                              {edu.field && <div className="text-neutral-500 text-[9px]">{edu.field}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sectionVisibility.skills && skillCategories.length > 0 && (
                      <div>
                        <h2 className="text-[11px] font-medium text-black border-b border-neutral-200 pb-1 mb-2">
                          Skills
                        </h2>
                        <div className="space-y-1 text-[10px]">
                          {skillCategories.map((cat) => (
                            <div key={cat.id}>
                              <span className="font-medium text-black mr-2">{cat.name}:</span>
                              <span className="text-neutral-700">{cat.skills.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Balanced Two-Column Layout Preview */}
                {preset === 'balanced' && (
                  <div className="grid grid-cols-[140px_1fr] gap-6">
                    {/* Left Column: Credentials & Toolkit */}
                    <div className="space-y-4">
                      {printSettings.showAvatarInPrint && basics.avatarUrl && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/10 mb-2">
                          <img
                            src={basics.avatarUrl}
                            alt={basics.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h1 className="text-[13px] font-medium text-black leading-tight">
                          {basics.name}
                        </h1>
                        <p className="text-[9.5px] text-neutral-600 leading-normal mt-0.5">
                          {basics.headline}
                        </p>
                      </div>

                      <div className="space-y-1 text-[9px] text-neutral-700">
                        {basics.links.map((link) => (
                          <div key={link.id} className="truncate">
                            <span>{link.label}</span>
                          </div>
                        ))}
                      </div>

                      {sectionVisibility.education && education.length > 0 && (
                        <div className="pt-2 border-t border-neutral-200">
                          <h2 className="text-[10px] font-medium text-black mb-1">
                            Education
                          </h2>
                          <div className="space-y-2 text-[9px]">
                            {education.map((edu) => (
                              <div key={edu.id}>
                                <div className="font-medium text-black">{edu.degree}</div>
                                <div className="text-neutral-500">{edu.institution}</div>
                                <div className="text-neutral-400 font-mono">{edu.startYear} - {edu.endYear}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sectionVisibility.skills && skillCategories.length > 0 && (
                        <div className="pt-2 border-t border-neutral-200">
                          <h2 className="text-[10px] font-medium text-black mb-1">
                            Skills
                          </h2>
                          <div className="space-y-1.5 text-[9px]">
                            {skillCategories.map((cat) => (
                              <div key={cat.id}>
                                <div className="font-medium text-black">{cat.name}</div>
                                <div className="text-neutral-600 leading-normal">{cat.skills.join(', ')}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Narrative Experience */}
                    <div className="space-y-4">
                      {sectionVisibility.about && basics.summary && (
                        <div>
                          <h2 className="text-[10.5px] font-medium text-black mb-1">About</h2>
                          <p className="text-neutral-700 text-[9.5px] leading-relaxed">
                            {basics.summary}
                          </p>
                        </div>
                      )}

                      {sectionVisibility.experience && experience.length > 0 && (
                        <div>
                          <h2 className="text-[10.5px] font-medium text-black mb-1">Work experience</h2>
                          <div className="space-y-2.5">
                            {experience.map((item) => (
                              <div key={item.id} className="text-[9.5px]">
                                <div className="flex justify-between items-baseline">
                                  <div className="font-medium text-black">{item.role}</div>
                                  <div className="text-neutral-400 font-mono text-[8.5px]">
                                    {item.startDate} - {item.isCurrent ? 'Now' : item.endDate}
                                  </div>
                                </div>
                                <div className="text-neutral-500">{item.company}</div>
                                {item.summary && <p className="text-neutral-700 mt-0.5 leading-normal">{item.summary}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sectionVisibility.projects && projects.length > 0 && (
                        <div>
                          <h2 className="text-[10.5px] font-medium text-black mb-1">Side projects</h2>
                          <div className="space-y-2 text-[9.5px]">
                            {projects.map((proj) => (
                              <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                  <div className="font-medium text-black">{proj.title}</div>
                                  <div className="text-neutral-400 font-mono text-[8.5px]">{proj.year}</div>
                                </div>
                                {proj.description && <p className="text-neutral-700 mt-0.5">{proj.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sectionVisibility.writing && writing.length > 0 && (
                        <div>
                          <h2 className="text-[10.5px] font-medium text-black mb-1">Writing</h2>
                          <div className="space-y-2 text-[9.5px]">
                            {writing.map((w) => (
                              <div key={w.id}>
                                <div className="flex justify-between items-baseline">
                                  <div className="font-medium text-black">{w.title}</div>
                                  <div className="text-neutral-400 font-mono text-[8.5px]">{w.year}</div>
                                </div>
                                {w.publication && <div className="text-neutral-500 text-[8.5px]">{w.publication}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Editorial Layout Preview (read.cv authentic) */}
                {preset === 'editorial' && (
                  <div className="relative">
                    {/* Left Column (60mm Header) */}
                    <div className="w-full sm:w-[150px] sm:absolute sm:top-0 sm:left-0 mb-6 sm:mb-0 space-y-2">
                      {printSettings.showAvatarInPrint && basics.avatarUrl && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/10 mb-2">
                          <img
                            src={basics.avatarUrl}
                            alt={basics.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h1 className="text-[13px] font-medium text-black leading-tight">
                        {basics.name}
                      </h1>
                      <p className="text-[10px] text-neutral-600 leading-normal">
                        {basics.headline}
                        {basics.location && <span> in {basics.location}</span>}
                      </p>
                      <div className="pt-2 space-y-1 text-[9.5px] text-neutral-700">
                        {basics.links.map((link) => (
                          <div key={link.id} className="truncate">
                            <span>{link.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column (100mm Sections at 70mm margin-left) */}
                    <div className="sm:ml-[175px] space-y-5">
                      {/* About */}
                      {sectionVisibility.about && basics.summary && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            About
                          </h2>
                          <p className="text-neutral-700 text-[10px] leading-relaxed">
                            {basics.summary}
                          </p>
                        </div>
                      )}

                      {/* Work Experience */}
                      {sectionVisibility.experience && experience.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            Work experience
                          </h2>
                          <div className="space-y-3">
                            {experience.map((item) => (
                              <div key={item.id} className="flex items-start text-[10px]">
                                <div className="w-16 shrink-0 text-right pr-3 text-neutral-500 font-mono text-[9px] pt-0.5">
                                  {item.startDate} - {item.isCurrent ? 'Now' : item.endDate}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-black">
                                    {item.role}{' '}
                                    <span className="text-neutral-400 font-normal">at</span>{' '}
                                    {item.company}
                                  </div>
                                  {item.location && (
                                    <div className="text-neutral-500 text-[9px]">
                                      {item.location}
                                    </div>
                                  )}
                                  {item.summary && (
                                    <p className="text-neutral-700 mt-0.5 leading-normal">
                                      {item.summary}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Side Projects */}
                      {sectionVisibility.projects && projects.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            Side projects
                          </h2>
                          <div className="space-y-2">
                            {projects.map((proj) => (
                              <div key={proj.id} className="flex items-start text-[10px]">
                                <div className="w-16 shrink-0 text-right pr-3 text-neutral-500 font-mono text-[9px] pt-0.5">
                                  {proj.year}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-black">{proj.title}</div>
                                  {proj.description && (
                                    <p className="text-neutral-700 mt-0.5 leading-normal">
                                      {proj.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Writing */}
                      {sectionVisibility.writing && writing.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            Writing
                          </h2>
                          <div className="space-y-1.5">
                            {writing.map((w) => (
                              <div key={w.id} className="flex items-start text-[10px]">
                                <div className="w-16 shrink-0 text-right pr-3 text-neutral-500 font-mono text-[9px] pt-0.5">
                                  {w.year}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-black">{w.title}</div>
                                  {w.publication && (
                                    <div className="text-neutral-500 text-[9px]">
                                      {w.publication}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {sectionVisibility.education && education.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            Education
                          </h2>
                          <div className="space-y-2">
                            {education.map((edu) => (
                              <div key={edu.id} className="flex items-start text-[10px]">
                                <div className="w-16 shrink-0 text-right pr-3 text-neutral-500 font-mono text-[9px] pt-0.5">
                                  {edu.startYear} - {edu.endYear}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-black">
                                    {edu.degree}{' '}
                                    <span className="text-neutral-400 font-normal">at</span>{' '}
                                    {edu.institution}
                                  </div>
                                  {edu.field && (
                                    <div className="text-neutral-500 text-[9px]">
                                      {edu.field}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {sectionVisibility.skills && skillCategories.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-medium text-black mb-1">
                            Skills
                          </h2>
                          <div className="space-y-1">
                            {skillCategories.map((cat) => (
                              <div key={cat.id} className="flex items-start text-[10px]">
                                <div className="w-16 shrink-0 text-right pr-3 text-neutral-500 font-mono text-[9px] pt-0.5">
                                  {cat.name}
                                </div>
                                <div className="flex-1 text-neutral-700">
                                  {cat.skills.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 sm:px-8 py-4 border-t border-[var(--primaryBorderColor)] bg-[var(--backgroundColor)] flex items-center justify-between">
          <div className="text-[12px] text-[var(--grey3)] hidden sm:block">
            <span>Press Esc to close</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setIsPreviewingPrint(false)}
              className="px-4 py-2 rounded-lg text-[13px] text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--transparentBorder)] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                triggerPrint()
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
