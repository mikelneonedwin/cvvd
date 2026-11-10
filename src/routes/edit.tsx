import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Save,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { CvvdLogo } from '../components/CvvdIcons'
import { trpc, trpcClient, queryClient } from '../trpc/client'
import { useSession } from '../lib/auth-client'
import { useProfile } from '../context/ProfileContext'
import { Skeleton } from '../components/Skeleton'
import { Sidebar } from '../components/Sidebar'
import { PrintPreviewModal } from '../components/PrintPreviewModal'
import type { UserProfile } from '../types/profile'
import { STUDIO_TABS, type StudioTab } from '../types/studioTabs'
import { StudioBasics } from '../components/studio/StudioBasics'
import { StudioWork } from '../components/studio/StudioWork'
import { StudioProjects } from '../components/studio/StudioProjects'
import { StudioWriting } from '../components/studio/StudioWriting'
import { StudioEducation } from '../components/studio/StudioEducation'
import { StudioSkills } from '../components/studio/StudioSkills'
import { StudioLayout } from '../components/studio/StudioLayout'
import { CVProfile } from '../components/CVProfile'

interface EditSearch {
  handle?: string
}

export const Route = createFileRoute('/edit')({
  validateSearch: (search: Record<string, unknown>): EditSearch => {
    return {
      handle: typeof search.handle === 'string' ? search.handle : undefined,
    }
  },
  component: ProfileEditorPage,
})

export function ProfileEditorPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const { data: session, isPending: isSessionLoading } = useSession()
  const { showToast, loadProfile } = useProfile()
  const [activeTab, setActiveTab] = useState<StudioTab>('basics')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Redirect to login if unauthenticated once session check has completed
  useEffect(() => {
    if (!isSessionLoading && !session?.user) {
      navigate({ to: '/login' })
    }
  }, [isSessionLoading, session, navigate])

  // Fetch logged in user's profile only when authenticated
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    ...trpc.profile.getMine.queryOptions(),
    enabled: !!session?.user,
  })

  // Local draft state
  const [form, setForm] = useState<UserProfile | null>(null)
  const [rawHandle, setRawHandle] = useState('')

  useEffect(() => {
    if (profileData?.profile) {
      // Check if user specified a handle in search or sessionStorage
      let pendingHandle = search?.handle || ''
      if (!pendingHandle && typeof window !== 'undefined') {
        pendingHandle = sessionStorage.getItem('cvvd_desired_handle') || ''
        if (pendingHandle) {
          sessionStorage.removeItem('cvvd_desired_handle')
        }
      }

      if (pendingHandle && pendingHandle !== profileData.rawHandle) {
        const initialForm = {
          ...profileData.profile,
          basics: {
            ...profileData.profile.basics,
            handle: `cvvd/${pendingHandle}`,
          },
        }
        setForm(initialForm)
        setRawHandle(pendingHandle)
        loadProfile(initialForm)
      } else {
        setForm(profileData.profile)
        setRawHandle(profileData.rawHandle || '')
        loadProfile(profileData.profile)
      }
    }
  }, [profileData, search?.handle, loadProfile])

  const handleAvatarUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      showToast('Avatar image must be under 2MB')
      return
    }

    setUploadingAvatar(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64Data =
        typeof event.target?.result === 'string' ? event.target.result : ''
      if (base64Data) {
        try {
          const res = await trpcClient.profile.uploadAvatarBlob.mutate({
            mimeType: file.type || 'image/png',
            base64Data,
          })
          setForm((prev) => {
            if (!prev) return null
            const updated = {
              ...prev,
              basics: {
                ...prev.basics,
                avatarUrl: res.avatarUrl,
              },
            }
            loadProfile(updated)
            return updated
          })
          showToast('Avatar saved to database')
        } catch {
          showToast('Failed to upload avatar blob')
        } finally {
          setUploadingAvatar(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form) return
    setIsSaving(true)

    // Save current cache snapshot to rollback in case of error
    const previousMine = queryClient.getQueryData(trpc.profile.getMine.queryKey())
    const currentCleanHandle = rawHandle || form.basics.handle.replace(/^cvvd\//, '')
    const previousByHandle = queryClient.getQueryData(
      trpc.profile.getByHandle.queryKey({ handle: currentCleanHandle })
    )

    // Optimistically update React Query cache and ProfileContext immediately
    queryClient.setQueryData(trpc.profile.getMine.queryKey(), {
      profile: form,
      rawHandle: currentCleanHandle,
    })
    queryClient.setQueryData(
      trpc.profile.getByHandle.queryKey({ handle: currentCleanHandle }),
      form
    )
    loadProfile(form)

    try {
      const res = await trpcClient.profile.updateMine.mutate(form)
      showToast('Changes saved')
      if (res.handle && res.handle !== rawHandle) {
        setRawHandle(res.handle)
      }
      refetch()
    } catch (err) {
      // Rollback optimistic updates on failure
      queryClient.setQueryData(trpc.profile.getMine.queryKey(), previousMine)
      queryClient.setQueryData(
        trpc.profile.getByHandle.queryKey({ handle: currentCleanHandle }),
        previousByHandle
      )
      if (previousMine && typeof previousMine === 'object' && 'profile' in previousMine) {
        loadProfile((previousMine as { profile: UserProfile }).profile)
      }
      showToast(err instanceof Error ? err.message : 'Error saving changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isSessionLoading || (session?.user && isProfileLoading)) {
    return (
      <div className="min-h-screen bg-[var(--backgroundColor)] p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[var(--backgroundColor)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 space-y-4">
          <CvvdLogo className="w-10 h-10 mx-auto text-[var(--grey1)]" />
          <h2 className="text-xl font-medium text-[var(--grey1)]">
            Sign in to access your Profile Studio
          </h2>
          <p className="text-xs text-[var(--grey3)]">
            Create your account or log in to manage your public CV, customize your layout, and export publication-ready sheets.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/login"
              className="btn-primary inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl text-xs font-medium shadow-2xs active:scale-98 transition-transform"
            >
              Sign in with Google
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!form) return null

  // Has existing data if user already has an experience, project, education, or non-empty bio
  const hasExistingData = Boolean(
    form.experience.length > 0 ||
      form.projects.length > 0 ||
      form.writing.length > 0 ||
      form.education.length > 0 ||
      form.basics.summary.trim().length > 0
  )

  const showSidebar = hasExistingData

  // Track if current draft handle is different from saved database handle
  const savedCleanHandle = (profileData?.rawHandle || '').toLowerCase().trim()
  const currentDraftCleanHandle = (rawHandle || form.basics.handle.replace(/^cvvd\//, '')).toLowerCase().trim()
  const hasUnsavedHandle = Boolean(
    savedCleanHandle && currentDraftCleanHandle && savedCleanHandle !== currentDraftCleanHandle
  )

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)]">
      {/* Persistent Sidebar rendered when user already has existing profile data */}
      {showSidebar && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab)
            if (isPreviewMode) setIsPreviewMode(false)
          }}
          isPreviewMode={isPreviewMode}
          hasUnsavedHandle={hasUnsavedHandle}
        />
      )}

      <div className={showSidebar ? 'lg:pl-[240px]' : ''}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)]/95 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-[var(--grey1)]">
                <CvvdLogo className="w-6 h-6" />
              </Link>
              <div className="h-4 w-px bg-[var(--secondaryBorderColor)] hidden sm:block" />
              <span className="text-xs font-mono text-[var(--grey3)] hidden sm:inline">
                Profile Studio
              </span>
              <span className="text-xs font-mono text-[var(--grey2)] truncate max-w-[140px] sm:max-w-none">
                cvvd/{rawHandle || 'you'}
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
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
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

          {/* Tab Navigation (Responsive Scrollable on Mobile) - only shown when not in preview mode */}
          {!isPreviewMode && (
            <div
              role="tablist"
              aria-label="Profile Studio Sections"
              className="max-w-5xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-[var(--secondaryBorderColor)]"
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

        {/* Live In-Studio Preview or Main Studio Body */}
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
                setRawHandle={setRawHandle}
                uploadingAvatar={uploadingAvatar}
                onAvatarUpload={handleAvatarUpload}
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

      {/* Print CV Sheet Preview & Export Modal */}
      <PrintPreviewModal />
    </div>
  )
}
