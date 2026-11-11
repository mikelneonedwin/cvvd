import type { UserProfile } from '../types/profile'

export const initialProfile: UserProfile = {
  basics: {
    name: '',
    handle: '',
    headline: '',
    avatarUrl: '',
    status: {
      state: 'available',
      label: 'Available for work',
    },
    location: '',
    timezone: '',
    summary: '',
    links: [],
  },
  experience: [],
  projects: [],
  writing: [],
  education: [],
  skillCategories: [],
  sectionVisibility: {
    about: true,
    experience: true,
    projects: true,
    writing: true,
    education: true,
    skills: true,
  },
  printSettings: {
    density: 'comfortable',
    layoutPreset: 'editorial',
    showAvatarInPrint: true,
    includeLinksInPrint: true,
    printTheme: 'light',
  },
}
