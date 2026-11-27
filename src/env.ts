import { createEnv } from '@t3-oss/env-core'
import { config } from 'dotenv'
import { z } from 'zod'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

export const env = createEnv({
  server: {
    BROWSER_PATH: z.string().min(1).optional(),
    BASE_URL: z
      .string()
      .url()
      .optional()
      .transform((val) => {
        if (val) return val.replace(/\/+$/, '')
        return 'http://localhost:3000'
      }),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
