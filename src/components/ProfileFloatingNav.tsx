import { useEffect, useState, useRef } from 'react'
import {
  User,
  Briefcase,
  FolderGit2,
  PenTool,
  GraduationCap,
} from 'lucide-react'
import { useProfile } from '../context/ProfileContext'

interface SectionConfig {
  id: string
  label: string
  icon: typeof User
  exists: boolean
}

export function ProfileFloatingNav() {
  const { profile } = useProfile()
  const { basics, experience, projects, writing, education, sectionVisibility } = profile
  const [activeSection, setActiveSection] = useState<string>('')
  const userClickedRef = useRef<boolean>(false)
  const clickTimeoutRef = useRef<number | null>(null)

  // Determine section existence according to data + visibility
  const sections: SectionConfig[] = [
    {
      id: 'about',
      label: 'About',
      icon: User,
      exists: Boolean(sectionVisibility.about && basics.summary?.trim()),
    },
    {
      id: 'work-experience',
      label: 'Experience',
      icon: Briefcase,
      exists: Boolean(sectionVisibility.experience && experience.length > 0),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderGit2,
      exists: Boolean(sectionVisibility.projects && projects.length > 0),
    },
    {
      id: 'writing',
      label: 'Writing',
      icon: PenTool,
      exists: Boolean(sectionVisibility.writing && writing.length > 0),
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      exists: Boolean(sectionVisibility.education && education.length > 0),
    },
  ]

  const activeAvailableSections = sections.filter((s) => s.exists)

  // Track scroll position to update active section indicator
  useEffect(() => {
    if (activeAvailableSections.length === 0) return

    const handleScroll = () => {
      // If user recently clicked a section button, don't immediately overwrite the active selection
      if (userClickedRef.current) return

      const scrollPosition = window.scrollY + 140
      let current = ''

      for (const section of activeAvailableSections) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            current = section.id
          }
        }
      }

      // If at top of document and about exists, default to about
      if (!current && window.scrollY < 200 && activeAvailableSections[0]) {
        current = activeAvailableSections[0].id
      }

      if (current) {
        setActiveSection(current)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeAvailableSections])

  if (activeAvailableSections.length === 0) {
    return null
  }

  const scrollTo = (id: string) => {
    // Immediately set the active section on click
    setActiveSection(id)
    userClickedRef.current = true

    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current)
    }
    // Release lock after smooth scroll settles
    clickTimeoutRef.current = window.setTimeout(() => {
      userClickedRef.current = false
    }, 850)

    if (id === 'about') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    const el = document.getElementById(id)
    if (!el) return
    const offset = 64
    const elementPosition = el.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    })
  }

  return (
    <aside
      aria-label="Profile section navigation"
      className="no-print fixed right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/60 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all"
    >
      {activeAvailableSections.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            title={label}
            aria-label={`Scroll to ${label}`}
            aria-current={isActive ? 'true' : undefined}
            className={`group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />

            {/* Hover Tooltip pill on the left (desktop only) */}
            <span className="hidden sm:block pointer-events-none absolute right-full mr-2.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 text-white dark:bg-white/90 dark:text-neutral-900 shadow-md backdrop-blur-xs select-none">
              {label}
            </span>
          </button>
        )
      })}
    </aside>
  )
}
