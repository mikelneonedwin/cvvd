import { z } from 'zod'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { user, session, account, verification, avatarBlobs, profiles } from './schema'

export const selectUserSchema = createSelectSchema(user)
export const insertUserSchema = createInsertSchema(user)

export const selectSessionSchema = createSelectSchema(session)
export const insertSessionSchema = createInsertSchema(session)

export const selectAccountSchema = createSelectSchema(account)
export const insertAccountSchema = createInsertSchema(account)

export const selectVerificationSchema = createSelectSchema(verification)
export const insertVerificationSchema = createInsertSchema(verification)

export const selectAvatarBlobsSchema = createSelectSchema(avatarBlobs)
export const insertAvatarBlobsSchema = createInsertSchema(avatarBlobs)

export const selectProfilesSchema = createSelectSchema(profiles)
export const insertProfilesSchema = createInsertSchema(profiles)

export const availabilityStateSchema = z.enum([
  'available',
  'employed',
  'freelance',
  'busy',
])

export const socialPlatformSchema = z.enum([
  'website',
  'github',
  'twitter',
  'linkedin',
  'email',
  'other',
])

export const profileLinkSchema = z.object({
  id: z.string(),
  platform: socialPlatformSchema,
  label: z.string(),
  url: z.string(),
})

export const profileStatusSchema = z.object({
  state: availabilityStateSchema,
  label: z.string(),
})

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  isCurrent: z.boolean(),
  location: z.string(),
  employmentType: z.enum(['Full-time', 'Contract', 'Part-time', 'Advisory']),
  summary: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
  link: z.string(),
})

export const projectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  year: z.string(),
  link: z.string(),
  company: z.string().optional(),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  imageUrl: z.string(),
})

export const writingItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  publication: z.string(),
  year: z.string(),
  url: z.string(),
  description: z.string(),
})

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startYear: z.string(),
  endYear: z.string(),
  honors: z.string(),
})

export const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  skills: z.array(z.string()),
})

export const sectionVisibilitySchema = z.object({
  about: z.boolean(),
  experience: z.boolean(),
  projects: z.boolean(),
  writing: z.boolean(),
  education: z.boolean(),
  skills: z.boolean(),
})

export const layoutPresetSchema = z.enum([
  'editorial',
  'single-column',
  'balanced',
])

export const printSettingsSchema = z.object({
  density: z.enum(['comfortable', 'compact']),
  showAvatarInPrint: z.boolean(),
  includeLinksInPrint: z.boolean(),
  layoutPreset: layoutPresetSchema,
  printTheme: z.enum(['light', 'dark']).optional(),
})

export const profileBasicsSchema = z.object({
  name: z.string(),
  handle: z.string(),
  headline: z.string(),
  avatarUrl: z.string(),
  status: profileStatusSchema,
  location: z.string(),
  timezone: z.string(),
  summary: z.string(),
  links: z.array(profileLinkSchema),
})

export const userProfileSchema = z.object({
  basics: profileBasicsSchema,
  experience: z.array(workExperienceSchema),
  projects: z.array(projectItemSchema),
  writing: z.array(writingItemSchema),
  education: z.array(educationItemSchema),
  skillCategories: z.array(skillCategorySchema),
  sectionVisibility: sectionVisibilitySchema,
  printSettings: printSettingsSchema,
})
