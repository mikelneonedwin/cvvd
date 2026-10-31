import { useProfile } from '../context/ProfileContext'

export function AboutSection() {
  const { profile } = useProfile()
  const { basics, sectionVisibility, printSettings } = profile
  const isEditorial = (printSettings.layoutPreset || 'editorial') === 'editorial'

  if (!sectionVisibility.about || !basics.summary) {
    return null
  }

  return (
    <section
      id="about"
      data-print={sectionVisibility.about ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">About</h3>
      <div className={`readcv-about-content ${isEditorial ? '' : '!ml-0'}`}>
        <p>{basics.summary}</p>
      </div>
    </section>
  )
}
