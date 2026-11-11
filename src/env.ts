import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BASE_URL: z
      .string()
      .url()
      .optional()
      .transform((val) => {
        if (val) return val.replace(/\/+$/, '')
        return process.env.NODE_ENV === 'production'
          ? 'https://cvvd.vercel.app'
          : 'http://localhost:3000'
      }),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
