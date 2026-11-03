import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import type {
  EducationItem,
  PrintSettings,
  ProfileLink,
  ProjectItem,
  SectionVisibility,
  SkillCategory,
  WorkExperience,
  WritingItem,
} from '../types/profile'

// Better Auth tables (external service schema conventions)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Avatar binary blob storage in database
export const avatarBlobs = pgTable('avatar_blobs', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  mimeType: text('mime_type').notNull().default('image/png'),
  data: text('data').notNull(), // base64 encoded binary data
  fileSize: integer('file_size').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
})

// Profiles table
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  handle: text('handle').notNull().unique(),
  name: text('name').notNull(),
  headline: text('headline').notNull(),
  avatarId: text('avatar_id').references(() => avatarBlobs.id, {
    onDelete: 'set null',
  }),
  avatarUrl: text('avatar_url'),
  statusState: text('status_state', {
    enum: ['available', 'employed', 'freelance', 'busy'],
  })
    .notNull()
    .default('available'),
  statusLabel: text('status_label'),
  location: text('location'),
  timezone: text('timezone'),
  summary: text('summary'),
  links: jsonb('links').$type<ProfileLink[]>().notNull().default([]),
  experience: jsonb('experience')
    .$type<WorkExperience[]>()
    .notNull()
    .default([]),
  projects: jsonb('projects').$type<ProjectItem[]>().notNull().default([]),
  writing: jsonb('writing').$type<WritingItem[]>().notNull().default([]),
  education: jsonb('education')
    .$type<EducationItem[]>()
    .notNull()
    .default([]),
  skillCategories: jsonb('skill_categories')
    .$type<SkillCategory[]>()
    .notNull()
    .default([]),
  sectionVisibility: jsonb('section_visibility')
    .$type<SectionVisibility>()
    .notNull()
    .default({
      about: true,
      experience: true,
      projects: true,
      writing: true,
      education: true,
      skills: true,
    }),
  printSettings: jsonb('print_settings')
    .$type<PrintSettings>()
    .notNull()
    .default({
      density: 'comfortable',
      showAvatarInPrint: false,
      includeLinksInPrint: true,
      layoutPreset: 'editorial',
    }),
  isPublished: boolean('is_published').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations definitions
export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [user.id],
    references: [profiles.userId],
  }),
  avatarBlobs: many(avatarBlobs),
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const avatarBlobsRelations = relations(avatarBlobs, ({ one }) => ({
  user: one(user, {
    fields: [avatarBlobs.userId],
    references: [user.id],
  }),
  profile: one(profiles, {
    fields: [avatarBlobs.id],
    references: [profiles.avatarId],
  }),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.userId],
    references: [user.id],
  }),
  avatarBlob: one(avatarBlobs, {
    fields: [profiles.avatarId],
    references: [avatarBlobs.id],
  }),
}))

export const verificationRelations = relations(verification, () => ({}))
