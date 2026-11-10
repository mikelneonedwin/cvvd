import type { UserProfile } from '../types/profile'

export interface FeaturedCreatorSummary {
  handle: string
  name: string
  headline: string
  location: string
  avatarUrl: string
  statusState: string
  statusLabel: string
  craft: string
  recentRole?: string
  company?: string
}

export const DEMO_PROFILES: Record<string, UserProfile> = {}

export const FEATURED_CREATORS: FeaturedCreatorSummary[] = []
