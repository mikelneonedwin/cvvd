import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  User,
  Briefcase,
  Layers,
  BookOpen,
  GraduationCap,
  Wrench,
  Sliders,
  Save,
  Eye,
  Loader2,
  LogOut,
} from 'lucide-react'
import { CvvdLogo } from '../components/CvvdIcons'
import { trpc, trpcClient } from '../trpc/client'
import { useSession, signOut } from '../lib/auth-client'
import { useProfile } from '../context/ProfileContext'
import { Skeleton } from '../components/Skeleton'
import type { UserProfile } from '../types/profile'
import { StudioBasics } from '../components/studio/StudioBasics'
import { StudioWork } from '../components/studio/StudioWork'
import { StudioProjects } from '../components/studio/StudioProjects'
import { StudioWriting } from '../components/studio/StudioWriting'
import { StudioEducation } from '../components/studio/StudioEducation'
import { StudioSkills } from '../components/studio/StudioSkills'
import { StudioLayout } from '../components/studio/StudioLayout'

export const Route = createFileRoute('/edit')({
  component: ProfileEditorPage,
})

type StudioTab =
  | 'basics'
  | 'experience'
  | 'projects'
  | 'writing'
  | 'education'
  | 'skills'
  | 'layout'

interface TabDefinition {
  id: StudioTab
  label: string
  icon: typeof User
}

const STUDIO_TABS: readonly TabDefinition[] = [
  { id: 'basics', label: 'Basics & Avatar', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Side projects', icon: Layers },
  { id: 'writing', label: 'Writing', icon: BookOpen },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'layout', label: 'Layout & Print', icon: Sliders },
]

export function ProfileEditorPage() {
  const navigate = useNavigate()
  const { data: session, isPending: isSessionLoading } = useSession()
  const { showToast } = useProfile()
  const [activeTab, setActiveTab] = useState<StudioTab>('basics')
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
      // Check if user just signed up with a desired handle
      let pendingHandle = ''
      if (typeof window !== 'undefined') {
        pendingHandle = sessionStorage.getItem('cvvd_desired_handle') || ''
        if (pendingHandle) {
          sessionStorage.removeItem('cvvd_desired_handle')
        }
      }

      if (pendingHandle && pendingHandle !== profileData.rawHandle) {
        setForm({
          ...profileData.profile,
          basics: {
            ...profileData.profile.basics,
            handle: `cvvd/${pendingHandle}`,
          },
        })
        setRawHandle(pendingHandle)
      } else {
        setForm(profileData.profile)
        setRawHandle(profileData.rawHandle || '')
      }
    }
  }, [profileData])

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
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  basics: {
                    ...prev.basics,
                    avatarUrl: res.avatarUrl,
                  },
                }
              : null
          )
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
    try {
      await trpcClient.profile.updateMine.mutate(form)
      showToast('Changes saved')
      refetch()
    } catch (err) {
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
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl text-xs font-medium border border-[var(--secondaryBorderColor)] text-[var(--grey1)] hover:bg-[var(--grey5)] active:scale-98 transition-transform"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)]">
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
            <Link
              to="/$handle"
              params={{ handle: rawHandle || 'elena' }}
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-xl text-xs font-medium text-[var(--grey2)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] border border-[var(--secondaryBorderColor)] transition-colors active:scale-98"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View live profile</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-2xs active:scale-98"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await signOut()
                window.location.href = '/'
              }}
              aria-label="Sign out"
              title="Sign out"
              className="inline-flex items-center justify-center min-h-[44px] px-3 rounded-xl text-xs font-medium text-[var(--grey3)] hover:text-[var(--grey1)] hover:bg-[var(--grey5)] border border-[var(--secondaryBorderColor)] transition-colors active:scale-98 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Responsive Scrollable on Mobile) */}
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
      </header>

      {/* Main Studio Body */}
      <main
        role="tabpanel"
        aria-label={STUDIO_TABS.find((t) => t.id === activeTab)?.label}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {activeTab === 'basics' && (
          <StudioBasics
            form={form}
            setForm={setForm}
            setRawHandle={setRawHandle}
            uploadingAvatar={uploadingAvatar}
            onAvatarUpload={handleAvatarUpload}
          />
        )}

        {activeTab === 'experience' && (
          <StudioWork form={form} setForm={setForm} />
        )}

        {activeTab === 'projects' && (
          <StudioProjects form={form} setForm={setForm} />
        )}

        {activeTab === 'writing' && (
          <StudioWriting form={form} setForm={setForm} />
        )}

        {activeTab === 'education' && (
          <StudioEducation form={form} setForm={setForm} />
        )}

        {activeTab === 'skills' && (
          <StudioSkills form={form} setForm={setForm} />
        )}

        {activeTab === 'layout' && (
          <StudioLayout form={form} setForm={setForm} />
        )}
      </main>
    </div>
  )
}
