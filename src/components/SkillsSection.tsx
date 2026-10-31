import { useProfile } from '../context/ProfileContext'

export function SkillsSection() {
  const { profile } = useProfile()
  const { skillCategories, sectionVisibility, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  if (!sectionVisibility.skills || skillCategories.length === 0) {
    return null
  }

  const isEditorial = preset === 'editorial'

  return (
    <section
      id="skills"
      data-print={sectionVisibility.skills ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">Skills</h3>
      <div className={isEditorial ? '' : 'space-y-4'}>
        {skillCategories.map((group) => {
          if (!isEditorial) {
            return (
              <div key={group.id} className="readcv-flow-item my-3">
                <div className="font-medium text-[var(--grey1)] text-[13px] mb-1">
                  {group.name}
                </div>
                <div className="text-[var(--grey2)] text-[13px] leading-relaxed">
                  {group.skills.join(', ')}
                </div>
              </div>
            )
          }

          return (
            <div key={group.id} className="readcv-item">
              <div className="readcv-duration-wrap">
                <span>{group.name}</span>
              </div>

              <div className="readcv-item-content">
                <div className="text-[var(--grey2)] text-[14px] leading-relaxed">
                  {group.skills.join(', ')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
