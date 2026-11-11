export type AvailabilityState = 'available' | 'employed' | 'freelance' | 'busy'

export type SocialPlatform = 'website' | 'github' | 'twitter' | 'linkedin' | 'email' | 'other'

export interface ProfileLink {
  id: string
  platform: SocialPlatform
  label: string
  url: string
}

export interface ProfileStatus {
  state: AvailabilityState
  label: string
}

export interface ProfileBasics {
  name: string
  handle: string
  headline: string
  avatarUrl: string
  status: ProfileStatus
  location: string
  timezone: string
  summary: string
  links: ProfileLink[]
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  location: string
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Advisory'
  summary: string
  highlights: string[]
  technologies: string[]
  link: string
}

export interface ProjectItem {
  id: string
  title: string
  tagline: string
  description: string
  year: string
  link: string
  company?: string
  technologies: string[]
  featured: boolean
  imageUrl: string
}

export interface WritingItem {
  id: string
  title: string
  publication: string
  year: string
  url: string
  description: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string
  honors: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
}

export interface SectionVisibility {
  about: boolean
  experience: boolean
  projects: boolean
  writing: boolean
  education: boolean
  skills: boolean
}

export type LayoutPreset = 'editorial' | 'single-column' | 'balanced'

export const AVAILABILITY_STATES: readonly AvailabilityState[] = [
  'available',
  'employed',
  'freelance',
  'busy',
]

export function isAvailabilityState(value: string): value is AvailabilityState {
  return (AVAILABILITY_STATES as readonly string[]).includes(value)
}

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  'website',
  'github',
  'twitter',
  'linkedin',
  'email',
  'other',
]

export function isSocialPlatform(value: string): value is SocialPlatform {
  return (SOCIAL_PLATFORMS as readonly string[]).includes(value)
}

export const LAYOUT_PRESETS: readonly LayoutPreset[] = [
  'editorial',
  'single-column',
  'balanced',
]

export function isLayoutPreset(value: string): value is LayoutPreset {
  return (LAYOUT_PRESETS as readonly string[]).includes(value)
}

export interface PrintSettings {
  density: 'comfortable' | 'compact'
  showAvatarInPrint: boolean
  includeLinksInPrint: boolean
  layoutPreset: LayoutPreset
  printTheme?: 'light' | 'dark'
}

export interface UserProfile {
  basics: ProfileBasics
  experience: WorkExperience[]
  projects: ProjectItem[]
  writing: WritingItem[]
  education: EducationItem[]
  skillCategories: SkillCategory[]
  sectionVisibility: SectionVisibility
  printSettings: PrintSettings
}
