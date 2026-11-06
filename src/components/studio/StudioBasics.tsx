import { useRef } from 'react'
import { Camera, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import {
  type UserProfile,
  type SocialPlatform,
  isAvailabilityState,
  isSocialPlatform,
} from '../../types/profile'

interface StudioBasicsProps {
  form: UserProfile
  setForm: (val: UserProfile) => void
  setRawHandle: (val: string) => void
  uploadingAvatar: boolean
  onAvatarUpload: (file: File) => void
}

const PLATFORM_DEFAULTS: Record<
  SocialPlatform,
  { label: string; urlPrefix: string; placeholder: string; exampleUrl: string }
> = {
  website: {
    label: 'Website',
    urlPrefix: 'https://',
    placeholder: 'https://...',
    exampleUrl: 'https://myportfolio.com',
  },
  github: {
    label: 'GitHub',
    urlPrefix: 'https://github.com/',
    placeholder: 'https://github.com/...',
    exampleUrl: 'https://github.com/username',
  },
  twitter: {
    label: 'X (Twitter)',
    urlPrefix: 'https://x.com/',
    placeholder: 'https://x.com/...',
    exampleUrl: 'https://x.com/username',
  },
  linkedin: {
    label: 'LinkedIn',
    urlPrefix: 'https://linkedin.com/in/',
    placeholder: 'https://linkedin.com/in/...',
    exampleUrl: 'https://linkedin.com/in/username',
  },
  email: {
    label: 'Email',
    urlPrefix: 'mailto:',
    placeholder: 'mailto:name@example.com',
    exampleUrl: 'mailto:hello@example.com',
  },
  other: {
    label: 'Link',
    urlPrefix: 'https://',
    placeholder: 'https://...',
    exampleUrl: 'https://example.com',
  },
}

function deriveSuggestedLabel(url: string, platform: SocialPlatform): string {
  const trimmed = url.trim()
  if (!trimmed) return PLATFORM_DEFAULTS[platform].label
  if (platform === 'email') {
    return trimmed.replace(/^mailto:/i, '') || PLATFORM_DEFAULTS.email.label
  }
  // Try extracting username or hostname
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    const pathname = parsed.pathname.replace(/^\/+|\/+$/g, '')
    if (platform === 'github' || platform === 'twitter' || platform === 'linkedin') {
      const parts = pathname.split('/')
      const handlePart = parts[parts.length - 1]
      if (handlePart) {
        return platform === 'twitter' ? `@${handlePart}` : handlePart
      }
    }
    return parsed.hostname.replace(/^www\./, '') || PLATFORM_DEFAULTS[platform].label
  } catch {
    return PLATFORM_DEFAULTS[platform].label
  }
}

export function StudioBasics({
  form,
  setForm,
  setRawHandle,
  uploadingAvatar,
  onAvatarUpload,
}: StudioBasicsProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handlePlatformChange = (idx: number, newPlatform: SocialPlatform) => {
    const updated = [...form.basics.links]
    const cur = updated[idx]
    const def = PLATFORM_DEFAULTS[newPlatform]

    // If current url is empty or was just another platform's prefix, update url to new prefix
    const isOldPrefix = Object.values(PLATFORM_DEFAULTS).some(
      (p) => cur.url === p.urlPrefix || cur.url === ''
    )
    const newUrl = isOldPrefix ? def.urlPrefix : cur.url

    // If current label is empty or matches an old default label, update to recommended label
    const isOldDefaultLabel = Object.values(PLATFORM_DEFAULTS).some(
      (p) => cur.label === p.label || cur.label === ''
    )
    const newLabel = isOldDefaultLabel ? def.label : cur.label

    updated[idx] = {
      ...cur,
      platform: newPlatform,
      url: newUrl,
      label: newLabel,
    }
    setForm({
      ...form,
      basics: { ...form.basics, links: updated },
    })
  }

  const handleApplySuggestion = (idx: number) => {
    const updated = [...form.basics.links]
    const cur = updated[idx]
    const def = PLATFORM_DEFAULTS[cur.platform]

    let finalUrl = cur.url.trim()
    if (!finalUrl || finalUrl === def.urlPrefix) {
      finalUrl = def.exampleUrl
    } else if (cur.platform === 'email' && !finalUrl.startsWith('mailto:')) {
      finalUrl = `mailto:${finalUrl}`
    } else if (cur.platform !== 'email' && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `${def.urlPrefix}${finalUrl.replace(/^\/+/, '')}`
    }

    const suggestedLabel = deriveSuggestedLabel(finalUrl, cur.platform)
    updated[idx] = {
      ...cur,
      url: finalUrl,
      label: suggestedLabel,
    }
    setForm({
      ...form,
      basics: { ...form.basics, links: updated },
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-medium text-[var(--grey1)]">
          Basics & Profile Details
        </h2>
        <p className="text-xs text-[var(--grey3)] mt-0.5">
          Your public name, handle, avatar, location, and social presence.
        </p>
      </div>

      {/* Avatar Uploader */}
      <div className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group w-16 h-16 rounded-full overflow-hidden bg-[var(--grey5)] ring-1 ring-[var(--secondaryBorderColor)] shrink-0">
            {form.basics.avatarUrl ? (
              <img
                src={form.basics.avatarUrl}
                alt={form.basics.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--grey3)] text-xs font-mono">
                No avatar
              </div>
            )}

            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-medium text-[var(--grey1)]">
              Profile Photo / Avatar
            </div>
            <p className="text-[11px] text-[var(--grey3)] mt-0.5">
              Square PNG, JPG, or SVG up to 2MB. Saved directly to your database profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onAvatarUpload(file)
            }}
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium bg-[var(--backgroundColor)] border border-[var(--secondaryBorderColor)] hover:bg-[var(--grey5)] transition-colors active:scale-98"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload new photo</span>
          </button>
        </div>
      </div>

      {/* Primary Identity: Name & Handle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={form.basics.name}
            onChange={(e) =>
              setForm({
                ...form,
                basics: { ...form.basics, name: e.target.value },
              })
            }
            className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Handle
          </label>
          <div className="flex items-center rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] px-3.5 min-h-[44px] focus-within:ring-1 focus-within:ring-[var(--grey1)]">
            <span className="text-sm font-mono text-[var(--grey3)] select-none">
              cvvd/
            </span>
            <input
              type="text"
              value={form.basics.handle.replace(/^cvvd\//, '')}
              onChange={(e) => {
                const clean = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]/g, '')
                  .slice(0, 32)
                setRawHandle(clean)
                setForm({
                  ...form,
                  basics: { ...form.basics, handle: `cvvd/${clean}` },
                })
              }}
              className="w-full py-2.5 pl-1 bg-transparent text-sm font-mono text-[var(--grey1)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div>
        <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
          Professional Headline / Craft
        </label>
        <input
          type="text"
          value={form.basics.headline}
          onChange={(e) =>
            setForm({
              ...form,
              basics: { ...form.basics, headline: e.target.value },
            })
          }
          placeholder="Staff Product Designer and Creative Director"
          className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
        />
      </div>

      {/* Status & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Availability Status
          </label>
          <select
            value={form.basics.status.state}
            onChange={(e) => {
              const val = e.target.value
              if (isAvailabilityState(val)) {
                setForm({
                  ...form,
                  basics: {
                    ...form.basics,
                    status: { ...form.basics.status, state: val },
                  },
                })
              }
            }}
            className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
          >
            <option value="available">Available for work</option>
            <option value="freelance">Freelance / Advisory</option>
            <option value="busy">Busy</option>
            <option value="employed">Employed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={form.basics.location}
            onChange={(e) =>
              setForm({
                ...form,
                basics: { ...form.basics, location: e.target.value },
              })
            }
            placeholder="San Francisco, CA"
            className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
          />
        </div>
      </div>

      {/* About narrative */}
      <div>
        <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
          About Narrative
        </label>
        <textarea
          rows={4}
          value={form.basics.summary}
          onChange={(e) =>
            setForm({
              ...form,
              basics: { ...form.basics, summary: e.target.value },
            })
          }
          placeholder="Write a concise narrative about your philosophy, craftsmanship, or professional focus."
          className="w-full px-3.5 py-3 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors leading-relaxed"
        />
      </div>

      {/* Social Links Manager */}
      <div className="space-y-3 pt-4 border-t border-[var(--secondaryBorderColor)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--grey3)] uppercase tracking-wider">
            Links and social profiles
          </span>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                basics: {
                  ...form.basics,
                  links: [
                    {
                      id: `link-${Date.now()}`,
                      platform: 'website',
                      label: PLATFORM_DEFAULTS.website.label,
                      url: PLATFORM_DEFAULTS.website.urlPrefix,
                    },
                    ...form.basics.links,
                  ],
                },
              })
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-medium text-[var(--grey1)] hover:underline active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add link</span>
          </button>
        </div>

        <div className="space-y-2">
          {form.basics.links.map((link, idx) => (
            <div
              key={link.id}
              className="p-3 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 grid grid-cols-1 sm:grid-cols-[130px_1fr_1fr_44px_44px] gap-2 items-center"
            >
              <select
                value={link.platform}
                onChange={(e) => {
                  const val = e.target.value
                  if (isSocialPlatform(val)) {
                    handlePlatformChange(idx, val)
                  }
                }}
                className="px-2.5 min-h-[44px] rounded-lg border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              >
                <option value="website">Website</option>
                <option value="github">GitHub</option>
                <option value="twitter">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                value={link.label}
                onChange={(e) => {
                  const updated = [...form.basics.links]
                  updated[idx].label = e.target.value
                  setForm({
                    ...form,
                    basics: { ...form.basics, links: updated },
                  })
                }}
                placeholder="Display label"
                className="px-3 min-h-[44px] rounded-lg border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              />

              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  let val = e.target.value
                  // For email, ensure silent mailto prefix handling
                  if (link.platform === 'email' && val && !val.startsWith('mailto:') && val.includes('@')) {
                    val = `mailto:${val}`
                  }
                  const updated = [...form.basics.links]
                  updated[idx].url = val
                  setForm({
                    ...form,
                    basics: { ...form.basics, links: updated },
                  })
                }}
                placeholder={PLATFORM_DEFAULTS[link.platform]?.placeholder || 'https://...'}
                className="px-3 min-h-[44px] rounded-lg border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)]"
              />

              <button
                type="button"
                onClick={() => handleApplySuggestion(idx)}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-[var(--grey1)] rounded-lg transition-colors flex items-center justify-center active:scale-95"
                title="Suggest label and format data for this link"
                aria-label="Suggest data for link"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const updated = form.basics.links.filter(
                    (l) => l.id !== link.id
                  )
                  setForm({
                    ...form,
                    basics: { ...form.basics, links: updated },
                  })
                }}
                className="min-w-[44px] min-h-[44px] text-[var(--grey3)] hover:text-red-500 rounded-lg transition-colors flex items-center justify-center active:scale-95"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
