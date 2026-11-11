import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { profiles } from '../../../db/schema'
import { generateOgImagePng } from '../../../lib/ogImage'
import { env } from '../../../env'

export const Route = createFileRoute('/api/og/$handle')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const rawHandle = (params.handle || '').toLowerCase().replace(/^@/, '')
        try {
          const found = await db.query.profiles.findFirst({
            where: eq(profiles.handle, rawHandle),
          })

          if (!found) {
            return new Response('Profile not found', { status: 404 })
          }

          let avatarUrl = found.avatarUrl || ''
          if (avatarUrl.startsWith('/api/avatar/')) {
            avatarUrl = `${env.BASE_URL}${avatarUrl}`
          }

          const rawLinks = Array.isArray(found.links) ? found.links : []
          const links = rawLinks.map((l: any) => ({
            platform: l.platform || 'website',
            url: l.url || '',
            label: l.label || '',
          })).filter((l: any) => Boolean(l.url))

          const statusText = found.statusAvailable
            ? 'Available for work'
            : found.statusEmoji && found.statusText
            ? `${found.statusEmoji} ${found.statusText}`
            : found.statusText || ''

          const png = await generateOgImagePng({
            handle: found.handle,
            name: found.name,
            headline: found.headline || undefined,
            location: found.location || undefined,
            status: statusText || undefined,
            avatarUrl: avatarUrl || undefined,
            summary: found.summary || undefined,
            links,
            experience: (found.experience as any) || [],
            projects: (found.projects as any) || [],
            writing: (found.writing as any) || [],
            skillCategories: (found.skillCategories as any) || [],
          })

          return new Response(png, {
            status: 200,
            headers: {
              'Content-Type': 'image/png',
              'Content-Length': png.length.toString(),
              'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            },
          })
        } catch (err) {
          console.error('OG image generation failed:', err)
          return new Response('Failed to generate image', { status: 500 })
        }
      },
    },
  },
})
