import { useProfile } from '../context/ProfileContext'

export function EducationSection() {
  const { profile } = useProfile()
  const { education, sectionVisibility, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'

  if (!sectionVisibility.education || education.length === 0) {
    return null
  }

  const isEditorial = preset === 'editorial'
  const isBalanced = preset === 'balanced'

  return (
    <section
      id="education"
      data-print={sectionVisibility.education ? 'true' : 'false'}
      className="readcv-section"
    >
      <h3 className="readcv-section-heading">Education</h3>
      <div className={isEditorial ? '' : isBalanced ? 'space-y-4' : 'space-y-4'}>
        {education.map((item) => {
          if (isBalanced) {
            return (
              <div key={item.id} className="readcv-flow-item my-3">
                <div className="flex flex-col gap-0.5 w-full">
                  <div className="font-medium text-[var(--grey1)] leading-snug">
                    {item.degree}{' '}
                    <span className="text-[var(--grey3)] font-normal">at</span>{' '}
                    {item.institution}
                  </div>

                  {(item.startYear || item.endYear) && (
                    <div className="text-[12px] text-[var(--grey3)] tabular-nums font-mono">
                      {item.startYear}
                      {item.startYear && item.endYear ? ' - ' : ''}
                      {item.endYear}
                    </div>
                  )}
                </div>

                {item.field && (
                  <div className="readcv-location text-[13px] mt-0.5">{item.field}</div>
                )}

                {item.honors && (
                  <div className="readcv-description mt-0.5 text-[13px]">
                    <p>{item.honors}</p>
                  </div>
                )}
              </div>
            )
          }

          if (!isEditorial) {
            return (
              <div key={item.id} className="readcv-flow-item my-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 w-full">
                  <div className="font-medium text-[var(--grey1)]">
                    {item.degree}{' '}
                    <span className="text-[var(--grey3)] font-normal">at</span>{' '}
                    {item.institution}
                  </div>

                  <div className="text-[12px] text-[var(--grey3)] tabular-nums font-mono shrink-0">
                    {item.startYear} - {item.endYear}
                  </div>
                </div>

                {item.field && (
                  <div className="readcv-location text-[13px] mt-0.5">{item.field}</div>
                )}

                {item.honors && (
                  <div className="readcv-description mt-0.5 text-[13px]">
                    <p>{item.honors}</p>
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={item.id} className="readcv-item">
              <div className="readcv-duration">
                <span>
                  {item.startYear} - {item.endYear}
                </span>
              </div>

              <div className="readcv-item-content">
                <div className="font-normal text-[var(--grey1)]">
                  {item.degree}{' '}
                  <span className="text-[var(--grey3)]">at</span> {item.institution}
                </div>

                {item.field && (
                  <div className="readcv-location">{item.field}</div>
                )}

                {item.honors && (
                  <div className="readcv-description">
                    <p>{item.honors}</p>
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
