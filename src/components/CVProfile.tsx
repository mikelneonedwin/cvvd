import { useProfile } from '../context/ProfileContext'
import { ProfileHero } from './ProfileHero'
import { AboutSection } from './AboutSection'
import { ExperienceSection } from './ExperienceSection'
import { ProjectsSection } from './ProjectsSection'
import { WritingSection } from './WritingSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'

export function CVProfile() {
  const { profile } = useProfile()
  const { printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  const densityClass =
    printSettings.density === 'compact' ? 'print-density-compact' : ''
  const avatarClass = printSettings.showAvatarInPrint ? 'print-avatar-enabled' : ''
  const presetClass = `layout-${preset}`

  if (preset === 'balanced') {
    return (
      <main className="w-full flex justify-center py-10 sm:py-14 px-4 sm:px-8">
        <div
          className={`readcv-container ${presetClass} w-full max-w-[840px] ${densityClass} ${avatarClass}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-14 items-start">
            <div className="space-y-8 readcv-left-column w-full">
              <ProfileHero />
              <EducationSection />
              <SkillsSection />
            </div>
            <div className="space-y-8 readcv-right-column w-full min-w-0">
              <AboutSection />
              <ExperienceSection />
              <ProjectsSection />
              <WritingSection />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (preset === 'single-column') {
    return (
      <main className="w-full flex justify-center py-10 sm:py-14 px-4 sm:px-8">
        <div
          className={`readcv-container ${presetClass} w-full max-w-[680px] ${densityClass} ${avatarClass}`}
        >
          <ProfileHero />
          <div className="readcv-sections-container space-y-8 w-full">
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            <WritingSection />
            <EducationSection />
            <SkillsSection />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full flex justify-center py-10 sm:py-14 px-4 sm:px-8">
      <div
        className={`readcv-container ${presetClass} w-full max-w-[540px] ${densityClass} ${avatarClass}`}
      >
        <ProfileHero />
        <div className="readcv-sections-container">
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <WritingSection />
          <EducationSection />
          <SkillsSection />
        </div>
      </div>
    </main>
  )
}
