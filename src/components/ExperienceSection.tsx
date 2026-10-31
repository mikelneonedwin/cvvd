import { useProfile } from '../context/ProfileContext'
import { ArrowExternalIcon } from './ReadCvIcons'

export function ExperienceSection() {
  const { profile } = useProfile()
  const { experience, sectionVisibility, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  if (!sectionVisibility.experience || experience.length === 0) {
    return null
  }

  const isEditorial = preset === 'editorial'

  return (
    <section
      id="work-experience"
      data-print={sectionVisibility.experience ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">Work Experience</h3>
      <div className={isEditorial ? '' : 'space-y-6'}>
        {experience.map((item) => {
          if (!isEditorial) {
            return (
              <div key={item.id} className="readcv-flow-item my-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 w-full">
                  <div className="flex items-center flex-wrap gap-1">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="readcv-title-link group inline-flex items-center gap-1 font-medium text-[var(--grey1)]"
                      >
                        <span>
                          {item.role}{' '}
                          <span className="text-[var(--grey3)] font-normal">at</span>{' '}
                          {item.company}
                        </span>
                        <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                      </a>
                    ) : (
                      <span className="font-medium text-[var(--grey1)]">
                        {item.role}{' '}
                        <span className="text-[var(--grey3)] font-normal">at</span>{' '}
                        {item.company}
                      </span>
                    )}
                    {item.location && (
                      <span className="text-[var(--grey3)] font-normal text-[13px]">
                        {' '}· {item.location}
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] text-[var(--grey3)] tabular-nums font-mono shrink-0">
                    {item.startDate} - {item.isCurrent ? 'Now' : item.endDate}
                  </div>
                </div>

                {item.summary && (
                  <div className="readcv-description mt-1.5">
                    <p>{item.summary}</p>
                  </div>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="readcv-description list-disc list-outside pl-4 space-y-1 my-2">
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          }

          // Editorial layout
          return (
            <div key={item.id} className="readcv-item">
              <div className="readcv-duration">
                <span>
                  {item.startDate} - {item.isCurrent ? 'Now' : item.endDate}
                </span>
              </div>

              <div className="readcv-item-content">
                <div className="flex items-center flex-wrap gap-1">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="readcv-title-link group"
                    >
                      <span>
                        {item.role}{' '}
                        <span className="text-[var(--grey3)]">at</span> {item.company}
                      </span>
                      <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                    </a>
                  ) : (
                    <span className="font-normal text-[var(--grey1)]">
                      {item.role}{' '}
                      <span className="text-[var(--grey3)]">at</span> {item.company}
                    </span>
                  )}
                </div>

                {item.location && (
                  <div className="readcv-location">{item.location}</div>
                )}

                {item.summary && (
                  <div className="readcv-description">
                    <p>{item.summary}</p>
                  </div>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="readcv-description list-disc list-outside pl-4 space-y-1 my-2">
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
