import { z } from 'zod'
import { publicProcedure, router } from './init'
import { userProfileSchema } from '../lib/profileSchema'
import { getProfile, saveProfile } from '../lib/profileStore'

export const appRouter = router({
  profile: router({
    get: publicProcedure.query(async () => {
      const profile = await getProfile()
      return { profile }
    }),

    update: publicProcedure
      .input(userProfileSchema)
      .mutation(async ({ input }) => {
        await saveProfile(input)
        return { success: true }
      }),

    uploadAvatar: publicProcedure
      .input(
        z.object({
          mimeType: z.string().default('image/png'),
          base64Data: z.string().min(10),
        }),
      )
      .mutation(async ({ input }) => {
        const dataUri = input.base64Data.startsWith('data:')
          ? input.base64Data
          : `data:${input.mimeType};base64,${input.base64Data}`

        const profile = await getProfile()
        await saveProfile({
          ...profile,
          basics: {
            ...profile.basics,
            avatarUrl: dataUri,
          },
        })

        return { avatarUrl: dataUri }
      }),
  }),
})

export type AppRouter = typeof appRouter
