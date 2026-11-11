import { useEffect, useRef } from 'react'
import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { Edit3, ArrowLeft } from 'lucide-react'
import { db } from '../../db'
import { profiles } from '../../db/schema'
import { trpc } from '../../trpc/client'
import { useSession } from '../../lib/auth-client'
import { useProfile } from '../../context/ProfileContext'
import { CVProfile } from '../../components/CVProfile'
import { Sidebar } from '../../components/Sidebar'
import { PrintPreviewModal } from '../../components/PrintPreviewModal'
import { ProfileSkeleton } from '../../components/Skeleton'
import { ProfileFloatingNav } from '../../components/ProfileFloatingNav'
import { env } from '../../env'

const getProfileServerMeta = createServerFn({ method: 'GET' })
  .validator((username: string) => username)
  .handler(async ({ data: username }) => {
    try {
      const clean = username.toLowerCase().replace(/^@/, '')
      const found = await db.query.profiles.findFirst({
        where: eq(profiles.handle, clean),
      })
      if (!found) return null

      let avatarUrl = found.avatarUrl || ''
      if (avatarUrl.startsWith('/api/avatar/')) {
        avatarUrl = `${env.BASE_URL}${avatarUrl}`
      }

      return {
        name: found.name,
        handle: found.handle,
        headline: found.headline,
        summary: found.summary || '',
        location: found.location || '',
        avatarUrl,
        baseUrl: env.BASE_URL,
      }
    } catch {
      return null
    }
  })

export const Route = createFileRoute('/u/$username')({
  loader: async ({ params }) => {
    return getProfileServerMeta({ data: params.username })
  },
  head: ({ params, loaderData }) => {
    const clean = (params.username || 'creator').toLowerCase().replace(/^@/, '')
    const name = loaderData?.name || clean
    const headline = loaderData?.headline || 'Creator profile and printable CV'
    const location = loaderData?.location ? ` in ${loaderData.location}` : ''
    const title = `${name} (@${clean}) | Living Profile & Printable CV - Cvvd`
    const description = `${headline}${location}. View living portfolio, work experience, projects, and publication-grade printable CV on Cvvd.`
    const baseUrl = loaderData?.baseUrl || 'https://cvvd.vercel.app'
    const profileUrl = `${baseUrl}/u/${clean}`
    const imageUrl = `${baseUrl}/api/og/${clean}`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'author', content: name },
        { name: 'creator', content: `@${clean}` },
        { name: 'publisher', content: 'Cvvd' },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        { property: 'og:site_name', content: 'Cvvd' },
        { property: 'og:type', content: 'profile' },
        { property: 'og:title', content: `${name} (@${clean})` },
        { property: 'og:description', content: description },
        { property: 'og:url', content: profileUrl },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:secure_url', content: imageUrl },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: `${name}'s living profile card` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'profile:username', content: clean },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: `@${clean}` },
        { name: 'twitter:title', content: `${name} (@${clean})` },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:image:alt', content: `${name}'s living profile card` },
      ],
      links: [{ rel: 'canonical', href: profileUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name,
            alternateName: clean,
            jobTitle: headline,
            description: loaderData?.summary || description,
            image: imageUrl,
            url: profileUrl,
          }),
        },
      ],
    }
  },
  component: ProfileUsernamePage,
})

function ProfileUsernamePage() {
  const { username } = useParams({ from: '/u/$username' })
  const { data: session } = useSession()
  const { loadProfile, isPreviewingPrint, setIsPreviewingPrint } = useProfile()
  const navigate = useNavigate()
  const loadedHandleRef = useRef<string | null>(null)

  // Clean handle parameter
  const cleanHandle = (username || '').toLowerCase().replace(/^@/, '')

  // Fetch logged-in user profile to verify ownership of current profile
  const { data: myProfileData } = useQuery({
    ...trpc.profile.getMine.queryOptions(),
    enabled: !!session?.user,
  })
  const isOwner = Boolean(
    session?.user &&
      myProfileData?.rawHandle &&
      myProfileData.rawHandle.toLowerCase() === cleanHandle
  )

  // Client-side query fetching
  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery(
    trpc.profile.getByHandle.queryOptions({
      handle: cleanHandle,
    })
  )

  // Sync loaded profile into context only on initial query resolve or handle switch
  useEffect(() => {
    if (profileData && loadedHandleRef.current !== cleanHandle) {
      loadProfile(profileData)
      loadedHandleRef.current = cleanHandle
    }
  }, [profileData, cleanHandle, loadProfile])

  // Global keyboard shortcuts for Print CV (Cmd+P) and Studio (Cmd+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setIsPreviewingPrint(true)
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        navigate({ to: '/edit' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsPreviewingPrint, navigate])

  // SEO & Social OpenGraph dynamic metadata injection
  useEffect(() => {
    if (!profileData) return

    const { basics } = profileData
    document.title = `${basics.name} (@${cleanHandle}) - Cvvd`

    const ogImageUrl = `${window.location.origin}/api/og/${cleanHandle}`

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      `${basics.headline}${basics.location ? ` in ${basics.location}` : ''}. View living profile and printable CV on Cvvd.`
    )

    // OpenGraph Title & Description & Image & URL
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', `${basics.name} (@${cleanHandle}) - Cvvd`)
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc)
      ogDesc.setAttribute(
        'content',
        `${basics.headline}${basics.location ? ` in ${basics.location}` : ''}. View living profile and printable CV on Cvvd.`
      )
    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', window.location.href)
    let ogImage = document.querySelector('meta[property="og:image"]')
    if (!ogImage) {
      ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      document.head.appendChild(ogImage)
    }
    ogImage.setAttribute('content', ogImageUrl)

    // Twitter Card Tags
    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', `${basics.name} (@${cleanHandle}) - Cvvd`)
    let twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc)
      twDesc.setAttribute(
        'content',
        `${basics.headline}${basics.location ? ` in ${basics.location}` : ''}. View living profile and printable CV on Cvvd.`
      )
    let twImage = document.querySelector('meta[name="twitter:image"]')
    if (!twImage) {
      twImage = document.createElement('meta')
      twImage.setAttribute('name', 'twitter:image')
      document.head.appendChild(twImage)
    }
    twImage.setAttribute('content', ogImageUrl)

    // JSON-LD Person schema for search engine ranking
    const jsonLdScript =
      document.getElementById('person-jsonld') ||
      document.createElement('script')
    jsonLdScript.id = 'person-jsonld'
    jsonLdScript.setAttribute('type', 'application/ld+json')
    jsonLdScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: basics.name,
      jobTitle: basics.headline,
      description: basics.summary,
      image: ogImageUrl,
      url: `${window.location.origin}/u/${cleanHandle}`,
      sameAs: basics.links.map((l) => l.url),
    })
    if (!document.getElementById('person-jsonld')) {
      document.head.appendChild(jsonLdScript)
    }
  }, [profileData, cleanHandle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--backgroundColor)]">
        <ProfileSkeleton />
      </div>
    )
  }

  if (isError || !profileData) {
    return (
      <div className="min-h-screen bg-[var(--backgroundColor)] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--secondaryBorderColor)] bg-[var(--inputBackgroundColor)]/40 space-y-4">
          <div className="text-3xl font-mono text-[var(--grey3)]">404</div>
          <h2 className="text-xl font-medium text-[var(--grey1)]">
            Profile not found
          </h2>
          <p className="text-xs text-[var(--grey3)]">
            The profile for "cvvd/u/{cleanHandle}" has not been claimed or created yet.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border border-[var(--secondaryBorderColor)] text-[var(--grey1)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back home</span>
            </Link>
            <Link
              to="/signup"
              className="btn-primary px-4 py-2 rounded-xl text-xs font-medium shadow-2xs"
            >
              Claim this handle
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--backgroundColor)] text-[var(--grey1)] selection:bg-[var(--grey2)] selection:text-[var(--backgroundColor)] transition-colors duration-200">
      {/* Living CV Profile Render Engine */}
      <CVProfile />

      {/* Floating Section Indicators and Anchors */}
      <ProfileFloatingNav />

      {/* Persistent Sidebar with cvvd Platform navigation & CV Controls */}
      <Sidebar />

      {/* Floating Owner Quick Edit Pill - only visible on viewing user's own profile */}
      {isOwner && (
        <div className="no-print fixed bottom-6 right-6 z-50">
          <Link
            to="/edit"
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium shadow-lg hover:opacity-95 transition-transform hover:scale-105"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit profile studio</span>
          </Link>
        </div>
      )}

      {/* Authentic read.cv Print Profile Sheet Preview Dialog */}
      {isPreviewingPrint && <PrintPreviewModal />}
    </div>
  )
}
