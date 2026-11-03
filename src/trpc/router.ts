import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, protectedProcedure, router } from './init'
import { profiles, avatarBlobs } from '../db/schema'
import { initialProfile } from '../data/initialProfile'
import { DEMO_PROFILES, FEATURED_CREATORS, type FeaturedCreatorSummary } from '../data/demoProfiles'
import { userProfileSchema } from '../db/schema.zod'
import { uploadImageToCloudinary } from '../lib/cloudinary'
import type { UserProfile } from '../types/profile'

function sanitizeHandle(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^cvvd\//, '')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 32)
}

export const appRouter = router({
  profile: router({
    getByHandle: publicProcedure
      .input(z.object({ handle: z.string() }))
      .query(async ({ ctx, input }) => {
        const cleanHandle = sanitizeHandle(input.handle)

        const profileRecord = await ctx.db.query.profiles.findFirst({
          where: eq(profiles.handle, cleanHandle),
        })

        if (!profileRecord) {
          if (cleanHandle in DEMO_PROFILES) {
            return DEMO_PROFILES[cleanHandle]
          }
          if (cleanHandle === '') {
            return DEMO_PROFILES.elena
          }
          return null
        }

        const fullProfile: UserProfile = {
          basics: {
            name: profileRecord.name,
            handle: `cvvd/${profileRecord.handle}`,
            headline: profileRecord.headline,
            avatarUrl: profileRecord.avatarUrl || initialProfile.basics.avatarUrl,
            status: {
              state: profileRecord.statusState,
              label: profileRecord.statusLabel || '',
            },
            location: profileRecord.location || '',
            timezone: profileRecord.timezone || '',
            summary: profileRecord.summary || '',
            links: profileRecord.links || [],
          },
          experience: profileRecord.experience || [],
          projects: profileRecord.projects || [],
          writing: profileRecord.writing || [],
          education: profileRecord.education || [],
          skillCategories: profileRecord.skillCategories || [],
          sectionVisibility: profileRecord.sectionVisibility || {
            about: true,
            experience: true,
            projects: true,
            writing: true,
            education: true,
            skills: true,
          },
          printSettings: profileRecord.printSettings || {
            density: 'comfortable',
            showAvatarInPrint: false,
            includeLinksInPrint: true,
            layoutPreset: 'editorial',
          },
        }

        return fullProfile
      }),

    getMine: protectedProcedure.query(async ({ ctx }) => {
      const existing = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.userId, ctx.user.id),
      })

      if (existing) {
        const profile: UserProfile = {
          basics: {
            name: existing.name,
            handle: `cvvd/${existing.handle}`,
            headline: existing.headline,
            avatarUrl: existing.avatarUrl || ctx.user.image || initialProfile.basics.avatarUrl,
            status: {
              state: existing.statusState,
              label: existing.statusLabel || '',
            },
            location: existing.location || '',
            timezone: existing.timezone || '',
            summary: existing.summary || '',
            links: existing.links || [],
          },
          experience: existing.experience || [],
          projects: existing.projects || [],
          writing: existing.writing || [],
          education: existing.education || [],
          skillCategories: existing.skillCategories || [],
          sectionVisibility: existing.sectionVisibility || initialProfile.sectionVisibility,
          printSettings: existing.printSettings || initialProfile.printSettings,
        }
        return { profile, rawHandle: existing.handle }
      }

      // Generate a new initial profile for first-time logged in user
      const baseHandle = sanitizeHandle(ctx.user.name || ctx.user.email.split('@')[0]) || 'user'
      const candidateHandle = `${baseHandle}-${ctx.user.id.slice(0, 4)}`

      const [newProfile] = await ctx.db
        .insert(profiles)
        .values({
          id: `prof_${ctx.user.id}`,
          userId: ctx.user.id,
          handle: candidateHandle,
          name: ctx.user.name || 'Your Name',
          headline: 'Product Designer and Engineer',
          avatarUrl: ctx.user.image || initialProfile.basics.avatarUrl,
          statusState: 'available',
          statusLabel: 'Available for work',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          summary: 'Building high quality software and interfaces with speed and typographic precision.',
          links: [
            {
              id: 'link-1',
              platform: 'website',
              label: 'myportfolio.com',
              url: 'https://example.com',
            },
          ],
          experience: initialProfile.experience,
          projects: initialProfile.projects,
          writing: initialProfile.writing,
          education: initialProfile.education,
          skillCategories: initialProfile.skillCategories,
          sectionVisibility: initialProfile.sectionVisibility,
          printSettings: initialProfile.printSettings,
        })
        .returning()

      const profile: UserProfile = {
        basics: {
          name: newProfile.name,
          handle: `cvvd/${newProfile.handle}`,
          headline: newProfile.headline,
          avatarUrl: newProfile.avatarUrl || initialProfile.basics.avatarUrl,
          status: {
            state: newProfile.statusState,
            label: newProfile.statusLabel || '',
          },
          location: newProfile.location || '',
          timezone: newProfile.timezone || '',
          summary: newProfile.summary || '',
          links: newProfile.links || [],
        },
        experience: newProfile.experience || [],
        projects: newProfile.projects || [],
        writing: newProfile.writing || [],
        education: newProfile.education || [],
        skillCategories: newProfile.skillCategories || [],
        sectionVisibility: newProfile.sectionVisibility || initialProfile.sectionVisibility,
        printSettings: newProfile.printSettings || initialProfile.printSettings,
      }

      return { profile, rawHandle: newProfile.handle }
    }),

    updateMine: protectedProcedure
      .input(userProfileSchema)
      .mutation(async ({ ctx, input }) => {
        const cleanHandle = sanitizeHandle(input.basics.handle)

        // Check if handle is taken by someone else
        if (cleanHandle) {
          const conflicting = await ctx.db.query.profiles.findFirst({
            where: eq(profiles.handle, cleanHandle),
          })
          if (conflicting && conflicting.userId !== ctx.user.id) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `The handle "${cleanHandle}" is already taken by another creator.`,
            })
          }
        }

        const [updated] = await ctx.db
          .insert(profiles)
          .values({
            id: `prof_${ctx.user.id}`,
            userId: ctx.user.id,
            handle: cleanHandle || `user-${ctx.user.id.slice(0, 4)}`,
            name: input.basics.name,
            headline: input.basics.headline,
            avatarUrl: input.basics.avatarUrl,
            statusState: input.basics.status.state,
            statusLabel: input.basics.status.label,
            location: input.basics.location,
            timezone: input.basics.timezone,
            summary: input.basics.summary,
            links: input.basics.links,
            experience: input.experience,
            projects: input.projects,
            writing: input.writing,
            education: input.education,
            skillCategories: input.skillCategories,
            sectionVisibility: input.sectionVisibility,
            printSettings: input.printSettings,
          })
          .onConflictDoUpdate({
            target: profiles.userId,
            set: {
              handle: cleanHandle || profiles.handle,
              name: input.basics.name,
              headline: input.basics.headline,
              avatarUrl: input.basics.avatarUrl,
              statusState: input.basics.status.state,
              statusLabel: input.basics.status.label,
              location: input.basics.location,
              timezone: input.basics.timezone,
              summary: input.basics.summary,
              links: input.basics.links,
              experience: input.experience,
              projects: input.projects,
              writing: input.writing,
              education: input.education,
              skillCategories: input.skillCategories,
              sectionVisibility: input.sectionVisibility,
              printSettings: input.printSettings,
              updatedAt: new Date(),
            },
          })
          .returning()

        return { success: true, handle: updated.handle }
      }),

    uploadAvatarBlob: protectedProcedure
      .input(
        z.object({
          mimeType: z.string().default('image/png'),
          base64Data: z.string().min(10),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const blobId = `avatar_${ctx.user.id}_${Date.now()}`
        const fileSize = Math.round((input.base64Data.length * 3) / 4)

        const dataUri = input.base64Data.startsWith('data:')
          ? input.base64Data
          : `data:${input.mimeType};base64,${input.base64Data}`

        let avatarUrl: string
        try {
          avatarUrl = await uploadImageToCloudinary(dataUri, 'cvvd/avatars')
        } catch {
          avatarUrl = `/api/avatar/${blobId}`
        }

        await ctx.db
          .insert(avatarBlobs)
          .values({
            id: blobId,
            userId: ctx.user.id,
            mimeType: input.mimeType,
            data: input.base64Data,
            fileSize,
          })
          .returning()

        await ctx.db
          .update(profiles)
          .set({
            avatarId: blobId,
            avatarUrl,
            updatedAt: new Date(),
          })
          .where(eq(profiles.userId, ctx.user.id))
          .returning()

        return { avatarId: blobId, avatarUrl }
      }),

    listFeatured: publicProcedure.query(async ({ ctx }) => {
      const records = await ctx.db.query.profiles.findMany({
        where: eq(profiles.isPublished, true),
        limit: 12,
      })

      const dbFeatured: FeaturedCreatorSummary[] = records.map((r) => ({
        handle: r.handle,
        name: r.name,
        headline: r.headline,
        location: r.location || '',
        avatarUrl: r.avatarUrl || DEMO_PROFILES.elena.basics.avatarUrl,
        statusState: r.statusState,
        statusLabel: r.statusLabel || '',
        craft: 'Builder',
        recentRole: r.headline,
        company: 'cvvd',
      }))

      const combined = [
        ...dbFeatured,
        ...FEATURED_CREATORS.filter(
          (c) => !dbFeatured.some((d) => d.handle === c.handle)
        ),
      ]

      return combined
    }),

    listAll: publicProcedure.query(async ({ ctx }) => {
      const records = await ctx.db.query.profiles.findMany({
        where: eq(profiles.isPublished, true),
      })

      const dbUsers: FeaturedCreatorSummary[] = records.map((r) => ({
        handle: r.handle,
        name: r.name,
        headline: r.headline,
        location: r.location || '',
        avatarUrl: r.avatarUrl || DEMO_PROFILES.elena.basics.avatarUrl,
        statusState: r.statusState,
        statusLabel: r.statusLabel || '',
        craft: 'Builder',
        recentRole: r.headline,
        company: 'cvvd',
      }))

      const combined = [
        ...dbUsers,
        ...FEATURED_CREATORS.filter(
          (c) => !dbUsers.some((d) => d.handle === c.handle)
        ),
      ]

      return combined
    }),
  }),
})

export type AppRouter = typeof appRouter
