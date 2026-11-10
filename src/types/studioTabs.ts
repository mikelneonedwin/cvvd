import {
  User,
  Briefcase,
  Layers,
  BookOpen,
  GraduationCap,
  Wrench,
  Sliders,
} from 'lucide-react'

export type StudioTab =
  | 'basics'
  | 'experience'
  | 'projects'
  | 'writing'
  | 'education'
  | 'skills'
  | 'layout'

export interface TabDefinition {
  id: StudioTab
  label: string
  icon: typeof User
}

export const STUDIO_TABS: readonly TabDefinition[] = [
  { id: 'basics', label: 'Basics & Avatar', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'writing', label: 'Writing', icon: BookOpen },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'layout', label: 'Layout & Print', icon: Sliders },
]
