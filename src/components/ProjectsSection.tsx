import { useProfile } from '../context/ProfileContext'
import { ArrowExternalIcon } from './ReadCvIcons'
import { GitHubStarBadge } from './GitHubStarBadge'

export function ProjectsSection() {
  const { profile } = useProfile()
  const { projects, sectionVisibility, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  if (!sectionVisibility.projects || projects.length === 0) {
    return null
  }

  const isEditorial = preset === 'editorial'

  return (
    <section
      id="projects"
      data-print={sectionVisibility.projects ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">Projects</h3>
      <div className={isEditorial ? '' : 'space-y-5'}>
        {projects.map((project) => {
          if (!isEditorial) {
            return (
              <div key={project.id} className="readcv-flow-item my-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 w-full">
                  <div className="flex items-center flex-wrap gap-1.5 font-medium text-[var(--grey1)]">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="readcv-title-link group inline-flex items-center gap-1"
                      >
                        <span>{project.title}</span>
                        <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                      </a>
                    ) : (
                      <span>{project.title}</span>
                    )}
                    {project.company && (
                      <span className="font-normal text-[var(--grey2)]">
                        <span className="text-[var(--grey3)]">at</span> {project.company}
                      </span>
                    )}
                    {project.link && <GitHubStarBadge url={project.link} />}
                    {project.tagline && (
                      <span className="text-[var(--grey3)] font-normal text-[13px] ml-0.5">
                        · {project.tagline}
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] text-[var(--grey3)] tabular-nums font-mono shrink-0">
                    {project.year}
                  </div>
                </div>

                {project.description && (
                  <div className="readcv-description mt-1 leading-relaxed">
                    <p>{project.description}</p>
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={project.id} className="readcv-item">
              <div className="readcv-duration">
                <span>{project.year}</span>
              </div>

              <div className="readcv-item-content">
                <div className="flex items-center flex-wrap gap-1.5">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="readcv-title-link group"
                    >
                      <span>{project.title}</span>
                      <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                    </a>
                  ) : (
                    <span className="font-normal text-[var(--grey1)]">
                      {project.title}
                    </span>
                  )}
                  {project.company && (
                    <span className="font-normal text-[var(--grey2)]">
                      <span className="text-[var(--grey3)]">at</span> {project.company}
                    </span>
                  )}
                  {project.link && <GitHubStarBadge url={project.link} />}
                  {project.tagline && (
                    <span className="text-[var(--grey3)] text-[13px] ml-0.5">
                      {project.tagline}
                    </span>
                  )}
                </div>

                {project.description && (
                  <div className="readcv-description">
                    <p>{project.description}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
