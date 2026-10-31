import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type {
  EducationItem,
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
  importProfile: (data: UserProfile) => void
  exportProfileJson: () => void
  triggerPrint: () => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
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
            },
          }
        }
      }
    } catch {
      // Fallback to initialProfile if parse fails
    }
    return initialProfile
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

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 2800)
  }

  const updateBasics = (partial: Partial<ProfileBasics>) => {
    setProfile((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        ...partial,
      },
    }))
  }

  const updateExperience = (experience: WorkExperience[]) => {
    setProfile((prev) => ({ ...prev, experience }))
  }

  const updateProjects = (projects: ProjectItem[]) => {
    setProfile((prev) => ({ ...prev, projects }))
  }

  const updateWriting = (writing: UserProfile['writing']) => {
    setProfile((prev) => ({ ...prev, writing }))
  }

  const updateEducation = (education: EducationItem[]) => {
    setProfile((prev) => ({ ...prev, education }))
  }

  const updateSkills = (skillCategories: SkillCategory[]) => {
    setProfile((prev) => ({ ...prev, skillCategories }))
  }

  const updateSectionVisibility = (visibility: Partial<SectionVisibility>) => {
    setProfile((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        ...visibility,
      },
    }))
  }

  const updatePrintSettings = (settings: Partial<PrintSettings>) => {
    setProfile((prev) => ({
      ...prev,
      printSettings: {
        ...prev.printSettings,
        ...settings,
      },
    }))
  }

  const resetProfile = () => {
    setProfile(initialProfile)
    showToast('Reset to default cvvd template')
  }

  const importProfile = (data: UserProfile) => {
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
      },
    })
    showToast('Profile imported successfully')
  }

  const exportProfileJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    const sanitizedName = profile.basics.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    downloadAnchor.setAttribute('download', `${sanitizedName}-cv.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Downloaded profile JSON')
  }

  const triggerPrint = () => {
    window.print()
  }

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
