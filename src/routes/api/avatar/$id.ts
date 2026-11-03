import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { avatarBlobs } from '../../../db/schema'

export const Route = createFileRoute('/api/avatar/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const blob = await db.query.avatarBlobs.findFirst({
          where: eq(avatarBlobs.id, params.id),
        })

        if (!blob) {
          return new Response('Avatar not found', { status: 404 })
        }

        // Handle base64 string
        const base64Data = blob.data.replace(/^data:[^;]+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')

        return new Response(buffer, {
          status: 200,
          headers: {
            'Content-Type': blob.mimeType || 'image/png',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          },
        })
      },
    },
  },
})
