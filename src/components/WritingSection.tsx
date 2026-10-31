import { useProfile } from '../context/ProfileContext'
import { ArrowExternalIcon } from './ReadCvIcons'

export function WritingSection() {
  const { profile } = useProfile()
  const { writing, sectionVisibility, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  if (!sectionVisibility.writing || writing.length === 0) {
    return null
  }

  const isEditorial = preset === 'editorial'

  return (
    <section
      id="writing"
      data-print={sectionVisibility.writing ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">Writing</h3>
      <div className={isEditorial ? '' : 'space-y-4'}>
        {writing.map((item) => {
          if (!isEditorial) {
            return (
              <div key={item.id} className="readcv-flow-item my-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 w-full">
                  <div className="flex items-center flex-wrap gap-1 font-medium text-[var(--grey1)]">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="readcv-title-link group inline-flex items-center gap-1"
                      >
                        <span>{item.title}</span>
                        <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                      </a>
                    ) : (
                      <span>{item.title}</span>
                    )}
                    {item.publication && (
                      <span className="text-[var(--grey3)] font-normal text-[13px] ml-1">
                        on {item.publication}
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] text-[var(--grey3)] tabular-nums font-mono shrink-0">
                    {item.year}
                  </div>
                </div>

                {item.description && (
                  <div className="readcv-description mt-1 leading-relaxed">
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={item.id} className="readcv-item">
              <div className="readcv-duration">
                <span>{item.year}</span>
              </div>

              <div className="readcv-item-content">
                <div className="flex items-center flex-wrap gap-1">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="readcv-title-link group"
                    >
                      <span>{item.title}</span>
                      <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
                    </a>
                  ) : (
                    <span className="font-normal text-[var(--grey1)]">
                      {item.title}
                    </span>
                  )}
                  {item.publication && (
                    <span className="text-[var(--grey3)] text-[13px] ml-1">
                      on {item.publication}
                    </span>
                  )}
                </div>

                {item.description && (
                  <div className="readcv-description">
                    <p>{item.description}</p>
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
