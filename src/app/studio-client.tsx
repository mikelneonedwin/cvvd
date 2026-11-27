'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import { CvvdLogo } from '../components/CvvdIcons'
import { trpc, trpcClient, queryClient } from '../trpc/client'
import { useProfile } from '../context/ProfileContext'
import { Sidebar } from '../components/Sidebar'
import { PrintPreviewModal } from '../components/PrintPreviewModal'
import { CVProfile } from '../components/CVProfile'
import { StudioBasics } from '../components/studio/StudioBasics'
import { StudioEducation } from '../components/studio/StudioEducation'
import { StudioLayout } from '../components/studio/StudioLayout'
import { StudioProjects } from '../components/studio/StudioProjects'
import { StudioSkills } from '../components/studio/StudioSkills'
import { StudioWork } from '../components/studio/StudioWork'
import { StudioWriting } from '../components/studio/StudioWriting'
import { STUDIO_TABS, type StudioTab } from '../types/studioTabs'
import type { UserProfile } from '../types/profile'

export function StudioClient({
  initialProfile,
}: {
  initialProfile: UserProfile
}) {
  const { showToast, loadProfile } = useProfile()
  const [activeTab, setActiveTab] = useState<StudioTab>('basics')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [form, setForm] = useState<UserProfile>(initialProfile)
  const formRef = useRef<UserProfile>(initialProfile)
  const seededRef = useRef(false)

  useEffect(() => {
    formRef.current = form
  }, [form])

  const { data } = useQuery({
    ...trpc.profile.get.queryOptions(),
    initialData: { profile: initialProfile },
  })

  useEffect(() => {
    if (seededRef.current) return
    seededRef.current = true
    loadProfile(initialProfile)
  }, [initialProfile, loadProfile])

  useEffect(() => {
    if (data?.profile) {
      // oxlint-disable-next-line react/set-state-in-effect -- syncing fetched profile into local editable state
      setForm(data.profile)
      loadProfile(data.profile)
    }
  }, [data, loadProfile])

  const handleAvatarSave = async (dataUrl: string) => {
    setUploadingAvatar(true)
    try {
      const res = await trpcClient.profile.uploadAvatar.mutate({
        mimeType: 'image/jpeg',
        base64Data: dataUrl,
      })
      const current = formRef.current
      if (current) {
        const updated = {
          ...current,
          basics: {
            ...current.basics,
            avatarUrl: res.avatarUrl,
          },
        }
        setForm(updated)
        loadProfile(updated)
      }
      showToast('Avatar updated')
    } catch {
      showToast('Failed to save avatar')
      throw new Error('Failed to save avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    if (!form) return
    setIsSaving(true)

    const previous = queryClient.getQueryData(trpc.profile.get.queryKey())
    queryClient.setQueryData(trpc.profile.get.queryKey(), { profile: form })
    loadProfile(form)

    try {
      await trpcClient.profile.update.mutate(form)
      showToast('Changes saved')
    } catch (err) {
      queryClient.setQueryData(trpc.profile.get.queryKey(), previous)
      if (previous && typeof previous === 'object' && 'profile' in previous) {
        const previousProfile = (previous as { profile: UserProfile }).profile
        setForm(previousProfile)
        loadProfile(previousProfile)
      }
      showToast(err instanceof Error ? err.message : 'Error saving changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)]">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (isPreviewMode) setIsPreviewMode(false)
        }}
        isPreviewMode={isPreviewMode}
      />

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-40 border-b border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)]/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-[var(--grey1)]">
                <CvvdLogo className="w-6 h-6" />
              </div>
              <div className="h-4 w-px bg-[var(--secondaryBorderColor)] hidden sm:block" />
              <span className="text-xs font-mono text-[var(--grey3)] hidden sm:inline">
                Local CV Studio
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode((prev) => !prev)}
                aria-pressed={isPreviewMode}
                title={isPreviewMode ? 'Exit preview' : 'Preview profile'}
                aria-label={isPreviewMode ? 'Exit preview' : 'Preview profile'}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border transition-all active:scale-95 cursor-pointer ${
                  isPreviewMode
                    ? 'bg-[var(--grey1)] text-[var(--backgroundColor)] border-[var(--grey1)] shadow-2xs'
                    : 'text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] border-[var(--secondaryBorderColor)]'
                }`}
              >
                {isPreviewMode ? (
                  <span className="text-xs font-mono">Edit</span>
                ) : (
                  <span className="text-xs font-mono">View</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                title="Save changes"
                aria-label="Save changes"
                className="btn-primary inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {!isPreviewMode && (
            <div
              role="tablist"
              aria-label="Profile Studio Sections"
              className="max-w-5xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar"
            >
              {STUDIO_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 min-h-[44px] text-xs font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                    activeTab === id
                      ? 'border-[var(--grey1)] text-[var(--grey1)]'
                      : 'border-transparent text-[var(--grey3)] hover:text-[var(--grey2)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </header>

        {isPreviewMode ? (
          <div className="w-full animate-fadeIn py-6 sm:py-10">
            <CVProfile />
          </div>
        ) : (
          <main
            role="tabpanel"
            aria-label={STUDIO_TABS.find((t) => t.id === activeTab)?.label}
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          >
            {activeTab === 'basics' && (
              <StudioBasics
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
                uploadingAvatar={uploadingAvatar}
                onAvatarSave={handleAvatarSave}
              />
            )}
            {activeTab === 'experience' && (
              <StudioWork
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
            {activeTab === 'projects' && (
              <StudioProjects
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
            {activeTab === 'writing' && (
              <StudioWriting
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
            {activeTab === 'education' && (
              <StudioEducation
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
            {activeTab === 'skills' && (
              <StudioSkills
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
            {activeTab === 'layout' && (
              <StudioLayout
                form={form}
                setForm={(newForm) => {
                  setForm(newForm)
                  loadProfile(newForm)
                }}
              />
            )}
          </main>
        )}
      </div>

      <PrintPreviewModal />
    </div>
  )
}
