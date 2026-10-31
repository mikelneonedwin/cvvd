import { useProfile } from '../context/ProfileContext'
import { SupporterHeartIcon, ArrowExternalIcon } from './ReadCvIcons'

export function ProfileHero() {
  const { profile, showToast } = useProfile()
  const { basics, printSettings } = profile
  const preset = printSettings.layoutPreset || 'editorial'
  const isBalanced = preset === 'balanced'
  const isSingleCol = preset === 'single-column'

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    showToast('Copied email to clipboard')
  }

  if (isBalanced) {
    return (
      <div className="readcv-header flex flex-col items-start gap-3 mb-8 w-full">
        {basics.avatarUrl && (
          <div className="readcv-photo-wrap shrink-0 mb-1">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10">
              <img
                src={basics.avatarUrl}
                alt={basics.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="readcv-profile-info w-full">
          <div className="readcv-display-name">
            <h2 className="text-[20px] font-normal leading-[1.3] text-[var(--grey1)]">
              {basics.name}
            </h2>
          </div>

          <p className="readcv-headline text-[13px] text-[var(--grey2)] mt-0.5 leading-normal">
            {basics.headline}
            {basics.location && (
              <span className="text-[var(--grey3)]"> in {basics.location}</span>
            )}
          </p>

          <div className="readcv-badges flex flex-col items-start gap-1.5 mt-3 w-full">
            {basics.status.label && (
              <div
                className="readcv-badge cursor-default text-[12px] py-1 px-2.5 max-w-full"
                aria-label={`Status: ${basics.status.label}`}
              >
                <SupporterHeartIcon className="w-3 h-3 text-red-500 dark:text-red-400 shrink-0" />
                <span className="truncate">{basics.status.label}</span>
              </div>
            )}

            {basics.links.map((link) => {
              const isEmail = link.platform === 'email'
              const emailAddress = link.url.replace(/^mailto:/, '')
              if (isEmail) {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => copyEmail(emailAddress)}
                    aria-label={`Copy email: ${emailAddress}`}
                    className="readcv-badge text-[12px] py-1 px-2.5 max-w-full hover:border-[var(--grey3)] transition-colors group cursor-pointer text-left"
                  >
                    <span className="truncate">{link.label}</span>
                  </button>
                )
              }
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open link: ${link.label}`}
                  className="readcv-badge text-[12px] py-1 px-2.5 max-w-full hover:border-[var(--grey3)] transition-colors group text-left"
                >
                  <span className="truncate">{link.label}</span>
                  <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors shrink-0" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (isSingleCol) {
    return (
      <div className="readcv-header flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-[var(--primaryBorderColor)] w-full">
        <div className="flex items-center gap-4">
          {basics.avatarUrl && (
            <div className="readcv-photo-wrap shrink-0">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10">
                <img
                  src={basics.avatarUrl}
                  alt={basics.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="readcv-profile-info">
            <div className="readcv-display-name">
              <h2 className="text-[22px] font-normal leading-[1.3] text-[var(--grey1)]">
                {basics.name}
              </h2>
            </div>

            <p className="readcv-headline text-[14px] text-[var(--grey2)] mt-0.5 leading-normal">
              {basics.headline}
              {basics.location && (
                <span className="text-[var(--grey3)]"> in {basics.location}</span>
              )}
            </p>
          </div>
        </div>

        <div className="readcv-badges flex flex-wrap items-center gap-1.5 sm:max-w-[320px] sm:justify-end">
          {basics.status.label && (
            <div
              className="readcv-badge cursor-default text-[12px]"
              aria-label={`Status: ${basics.status.label}`}
            >
              <SupporterHeartIcon className="w-3 h-3 text-red-500 dark:text-red-400 shrink-0" />
              <span>{basics.status.label}</span>
            </div>
          )}

          {basics.links.map((link) => {
            const isEmail = link.platform === 'email'
            const emailAddress = link.url.replace(/^mailto:/, '')
            if (isEmail) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => copyEmail(emailAddress)}
                  aria-label={`Copy email: ${emailAddress}`}
                  className="readcv-badge text-[12px] hover:border-[var(--grey3)] transition-colors group cursor-pointer"
                >
                  <span>{link.label}</span>
                </button>
              )
            }
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open link: ${link.label}`}
                className="readcv-badge text-[12px] hover:border-[var(--grey3)] transition-colors group"
              >
                <span>{link.label}</span>
                <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  // Authentic read.cv editorial hero
  return (
    <div className="readcv-header flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mb-10 sm:mb-12">
      {basics.avatarUrl && (
        <div className="readcv-photo-wrap shrink-0 sm:mr-4 relative">
          <div className="w-[92px] h-[92px] rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10">
            <img
              src={basics.avatarUrl}
              alt={basics.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="readcv-profile-info flex-1 grid">
        <div className="readcv-display-name">
          <h2 className="text-[20px] font-normal leading-[1.3] text-[var(--grey1)]">
            {basics.name}
          </h2>
        </div>

        <p className="readcv-headline text-[14px] text-[var(--grey2)] mt-0.5 leading-normal">
          {basics.headline}
          {basics.location && (
            <span className="text-[var(--grey3)]"> in {basics.location}</span>
          )}
        </p>

        <div className="readcv-badges flex flex-wrap items-center gap-1.5 mt-2.5">
          {basics.status.label && (
            <div
              className="readcv-badge cursor-default"
              aria-label={`Status: ${basics.status.label}`}
            >
              <SupporterHeartIcon className="w-3 h-3 text-red-500 dark:text-red-400" />
              <span>{basics.status.label}</span>
            </div>
          )}

          {basics.links.map((link) => {
            const isEmail = link.platform === 'email'
            const emailAddress = link.url.replace(/^mailto:/, '')
            if (isEmail) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => copyEmail(emailAddress)}
                  aria-label={`Copy email: ${emailAddress}`}
                  className="readcv-badge hover:border-[var(--grey3)] transition-colors group cursor-pointer"
                >
                  <span>{link.label}</span>
                </button>
              )
            }
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open link: ${link.label}`}
                className="readcv-badge hover:border-[var(--grey3)] transition-colors group"
              >
                <span>{link.label}</span>
                <ArrowExternalIcon className="w-2.5 h-2.5 text-[var(--grey3)] group-hover:text-[var(--grey1)] transition-colors" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
