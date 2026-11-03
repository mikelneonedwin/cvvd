import { useRef } from 'react'
import { Camera, Loader2, Plus, Trash2 } from 'lucide-react'
import {
  type UserProfile,
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

export function StudioBasics({
  form,
  setForm,
  setRawHandle,
  uploadingAvatar,
  onAvatarUpload,
}: StudioBasicsProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hidden file input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onAvatarUpload(file)
            e.target.value = ''
          }
        }}
      />

      {/* Header info */}
      <div>
        <h2 className="text-lg font-medium text-[var(--grey1)]">
          Personal basics and avatar
        </h2>
        <p className="text-xs text-[var(--grey3)] mt-0.5">
          Manage your name, public handle, headline, and profile avatar stored as a binary blob in the database.
        </p>
      </div>

      {/* Avatar Uploader Section */}
      <div className="p-5 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group w-16 h-16 rounded-full overflow-hidden bg-[var(--grey5)] ring-1 ring-[var(--secondaryBorderColor)] shrink-0">
            <img
              src={form.basics.avatarUrl || '/favicon.svg'}
              alt={form.basics.name}
              className="w-full h-full object-cover"
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--grey1)]">
              Profile photo
            </div>
            <div className="text-xs text-[var(--grey3)] mt-0.5">
              Binary blob stored in PostgreSQL. Max size 2MB.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 min-h-[44px] rounded-xl text-xs font-medium bg-[var(--backgroundColor)] border border-[var(--secondaryBorderColor)] hover:bg-[var(--grey5)] transition-colors active:scale-98"
          >
            <Camera className="w-3.5 h-3.5 text-[var(--grey2)]" />
            <span>{uploadingAvatar ? 'Uploading...' : 'Upload photo'}</span>
          </button>
        </div>
      </div>

      {/* Identity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Full name
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
            Handle slug
          </label>
          <div className="flex items-center rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] px-3.5 min-h-[44px] focus-within:ring-1 focus-within:ring-[var(--grey1)]">
            <span className="text-xs text-[var(--grey3)] font-mono select-none">
              cvvd/
            </span>
            <input
              type="text"
              value={form.basics.handle.replace(/^cvvd\//, '')}
              onChange={(e) => {
                const clean = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]/g, '')
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

      <div>
        <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
          Headline / Current Role
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
          placeholder="Staff Product Designer and Creative Technologist"
          className="w-full px-3.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-sm text-[var(--grey1)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] transition-colors"
        />
      </div>

      {/* Status & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
            Availability status
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
                    status: {
                      ...form.basics.status,
                      state: val,
                    },
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

      <div>
        <label className="block text-xs font-mono text-[var(--grey3)] uppercase tracking-wider mb-1.5">
          Summary narrative
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
          placeholder="Write a concise narrative about your design philosophy, craftsmanship, or professional focus."
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
                    ...form.basics.links,
                    {
                      id: `link-${Date.now()}`,
                      platform: 'website',
                      label: 'portfolio.com',
                      url: 'https://',
                    },
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
              className="p-3 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/30 grid grid-cols-1 sm:grid-cols-[130px_1fr_1fr_44px] gap-2 items-center"
            >
              <select
                value={link.platform}
                onChange={(e) => {
                  const val = e.target.value
                  if (isSocialPlatform(val)) {
                    const updated = [...form.basics.links]
                    updated[idx].platform = val
                    setForm({
                      ...form,
                      basics: { ...form.basics, links: updated },
                    })
                  }
                }}
                className="px-2.5 min-h-[44px] rounded-lg border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)]"
              >
                <option value="website">Website</option>
                <option value="github">GitHub</option>
                <option value="twitter">Twitter</option>
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
                type="url"
                value={link.url}
                onChange={(e) => {
                  const updated = [...form.basics.links]
                  updated[idx].url = e.target.value
                  setForm({
                    ...form,
                    basics: { ...form.basics, links: updated },
                  })
                }}
                placeholder="https://..."
                className="px-3 min-h-[44px] rounded-lg border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)]"
              />

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
