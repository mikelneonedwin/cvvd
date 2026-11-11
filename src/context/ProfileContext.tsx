import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  EducationItem,
  LayoutPreset,
  PrintSettings,
  ProfileBasics,
  ProjectItem,
  SectionVisibility,
  SkillCategory,
  UserProfile,
  WorkExperience,
} from '../types/profile'
import { initialProfile } from '../data/initialProfile'

const STORAGE_KEY = 'cvvd_profile_v2'
const LEGACY_STORAGE_KEY = 'readcv_profile_v2'
export const PREFERRED_LAYOUT_STORAGE_KEY = 'cvvd_preferred_layout'

interface ProfileContextValue {
  profile: UserProfile
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isPreviewingPrint: boolean
  setIsPreviewingPrint: (preview: boolean) => void
  toastMessage: string | null
  showToast: (msg: string) => void
  updateBasics: (basics: Partial<ProfileBasics>) => void
  updateExperience: (experience: WorkExperience[]) => void
  updateProjects: (projects: ProjectItem[]) => void
  updateWriting: (writing: UserProfile['writing']) => void
  updateEducation: (education: EducationItem[]) => void
  updateSkills: (categories: SkillCategory[]) => void
  updateSectionVisibility: (visibility: Partial<SectionVisibility>) => void
  updatePrintSettings: (settings: Partial<PrintSettings>) => void
  resetProfile: () => void
  loadProfile: (data: UserProfile) => void
  importProfile: (data: UserProfile) => void
  exportProfileJson: () => void
  triggerPrint: () => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    let savedLayout: LayoutPreset | undefined
    try {
      if (typeof window !== 'undefined') {
        const directLayout = localStorage.getItem(PREFERRED_LAYOUT_STORAGE_KEY) as LayoutPreset | null
        if (directLayout && (directLayout === 'editorial' || directLayout === 'single-column' || directLayout === 'balanced')) {
          savedLayout = directLayout
        }

        const saved =
          localStorage.getItem(STORAGE_KEY) ||
          localStorage.getItem(LEGACY_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.basics && parsed.experience) {
            return {
              ...initialProfile,
              ...parsed,
              sectionVisibility: {
                ...initialProfile.sectionVisibility,
                ...(parsed.sectionVisibility || {}),
              },
              printSettings: {
                ...initialProfile.printSettings,
                ...(parsed.printSettings || {}),
                ...(savedLayout ? { layoutPreset: savedLayout } : {}),
              },
            }
          }
        }
      }
    } catch {
      // Fallback to initialProfile if parse fails
    }
    return savedLayout
      ? {
          ...initialProfile,
          printSettings: {
            ...initialProfile.printSettings,
            layoutPreset: savedLayout,
          },
        }
      : initialProfile
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewingPrint, setIsPreviewingPrint] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // Ignore storage write errors
    }
  }, [profile])

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 2800)
  }, [])

  const updateBasics = useCallback((partial: Partial<ProfileBasics>) => {
    setProfile((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        ...partial,
      },
    }))
  }, [])

  const updateExperience = useCallback((experience: WorkExperience[]) => {
    setProfile((prev) => ({ ...prev, experience }))
  }, [])

  const updateProjects = useCallback((projects: ProjectItem[]) => {
    setProfile((prev) => ({ ...prev, projects }))
  }, [])

  const updateWriting = useCallback((writing: UserProfile['writing']) => {
    setProfile((prev) => ({ ...prev, writing }))
  }, [])

  const updateEducation = useCallback((education: EducationItem[]) => {
    setProfile((prev) => ({ ...prev, education }))
  }, [])

  const updateSkills = useCallback((skillCategories: SkillCategory[]) => {
    setProfile((prev) => ({ ...prev, skillCategories }))
  }, [])

  const updateSectionVisibility = useCallback((visibility: Partial<SectionVisibility>) => {
    setProfile((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        ...visibility,
      },
    }))
  }, [])

  const updatePrintSettings = useCallback((settings: Partial<PrintSettings>) => {
    if (settings.layoutPreset) {
      try {
        localStorage.setItem(PREFERRED_LAYOUT_STORAGE_KEY, settings.layoutPreset)
      } catch {
        // Ignore storage write error
      }
    }
    setProfile((prev) => ({
      ...prev,
      printSettings: {
        ...prev.printSettings,
        ...settings,
      },
    }))
  }, [])

  const resetProfile = useCallback(() => {
    let savedLayout: LayoutPreset | undefined
    try {
      const directLayout = localStorage.getItem(PREFERRED_LAYOUT_STORAGE_KEY) as LayoutPreset | null
      if (directLayout && (directLayout === 'editorial' || directLayout === 'single-column' || directLayout === 'balanced')) {
        savedLayout = directLayout
      }
    } catch {
      // Ignore storage read error
    }

    setProfile({
      ...initialProfile,
      printSettings: {
        ...initialProfile.printSettings,
        ...(savedLayout ? { layoutPreset: savedLayout } : {}),
      },
    })
    showToast('Reset to default Cvvd template')
  }, [showToast])

  const loadProfile = useCallback((data: UserProfile) => {
    let savedLayout: LayoutPreset | undefined
    try {
      const directLayout = localStorage.getItem(PREFERRED_LAYOUT_STORAGE_KEY) as LayoutPreset | null
      if (directLayout && (directLayout === 'editorial' || directLayout === 'single-column' || directLayout === 'balanced')) {
        savedLayout = directLayout
      }
    } catch {
      // Ignore storage read error
    }

    setProfile({
      ...initialProfile,
      ...data,
      sectionVisibility: {
        ...initialProfile.sectionVisibility,
        ...(data.sectionVisibility || {}),
      },
      printSettings: {
        ...initialProfile.printSettings,
        ...(data.printSettings || {}),
        ...(savedLayout ? { layoutPreset: savedLayout } : {}),
      },
    })
  }, [])

  const importProfile = useCallback((data: UserProfile) => {
    loadProfile(data)
    showToast('Profile imported successfully')
  }, [loadProfile, showToast])

  const exportProfileJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    const sanitizedName = profile.basics.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    downloadAnchor.setAttribute('download', `${sanitizedName}-cv.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Downloaded profile JSON')
  }, [profile, showToast])

  const triggerPrint = useCallback(() => {
    const isDarkPrint = profile.printSettings?.printTheme === 'dark'
    if (isDarkPrint) {
      document.body.classList.add('print-theme-dark')
      document.documentElement.classList.add('print-theme-dark')
    } else {
      document.body.classList.remove('print-theme-dark')
      document.documentElement.classList.remove('print-theme-dark')
    }

    const cleanup = () => {
      document.body.classList.remove('print-theme-dark')
      document.documentElement.classList.remove('print-theme-dark')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)

    window.print()
  }, [profile.printSettings?.printTheme])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isEditing,
        setIsEditing,
        isPreviewingPrint,
        setIsPreviewingPrint,
        toastMessage,
        showToast,
        updateBasics,
        updateExperience,
        updateProjects,
        updateWriting,
        updateEducation,
        updateSkills,
        updateSectionVisibility,
        updatePrintSettings,
        resetProfile,
        loadProfile,
        importProfile,
        exportProfileJson,
        triggerPrint,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
