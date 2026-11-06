import { useEffect, useRef } from 'react'
import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Edit3, ArrowLeft } from 'lucide-react'
import { trpc } from '../trpc/client'
import { useSession } from '../lib/auth-client'
import { useProfile } from '../context/ProfileContext'
import { CVProfile } from '../components/CVProfile'
import { Sidebar } from '../components/Sidebar'
import { PrintPreviewModal } from '../components/PrintPreviewModal'
import { ProfileSkeleton } from '../components/Skeleton'

export const Route = createFileRoute('/$handle')({
  head: ({ params }) => {
    const clean = (params.handle || 'creator').toLowerCase().replace(/^@/, '')
    const title = `${clean} - Cvvd profile`
    const description = `View ${clean}'s living profile and printable CV on Cvvd.`
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `https://cvvd.vercel.app/${clean}` },
        { property: 'og:type', content: 'profile' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
    }
  },
  component: ProfileHandlePage,
})

function ProfileHandlePage() {
  const { handle } = useParams({ from: '/$handle' })
  const { data: session } = useSession()
  const { loadProfile, isPreviewingPrint, setIsPreviewingPrint } = useProfile()
  const navigate = useNavigate()
  const loadedHandleRef = useRef<string | null>(null)

  // Clean handle parameter
  const cleanHandle = (handle || 'elena').toLowerCase().replace(/^@/, '')

  // Client-side query fetching per user preference
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

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      `${basics.headline} ${basics.location ? `in ${basics.location}` : ''}. View living profile and printable CV on Cvvd.`
    )

    // OpenGraph Title & Description & Image & URL
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', `${basics.name} - Cvvd`)
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc)
      ogDesc.setAttribute(
        'content',
        `${basics.headline} ${basics.location ? `in ${basics.location}` : ''}`
      )
    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', `https://cvvd.vercel.app/${cleanHandle}`)
    let ogImage = document.querySelector('meta[property="og:image"]')
    if (!ogImage && basics.avatarUrl) {
      ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      document.head.appendChild(ogImage)
    }
    if (ogImage && basics.avatarUrl) ogImage.setAttribute('content', basics.avatarUrl)

    // Twitter Card Tags
    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', `${basics.name} (@${cleanHandle}) - Cvvd`)
    let twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc)
      twDesc.setAttribute(
        'content',
        `${basics.headline} ${basics.location ? `in ${basics.location}` : ''}`
      )
    let twImage = document.querySelector('meta[name="twitter:image"]')
    if (!twImage && basics.avatarUrl) {
      twImage = document.createElement('meta')
      twImage.setAttribute('name', 'twitter:image')
      document.head.appendChild(twImage)
    }
    if (twImage && basics.avatarUrl) twImage.setAttribute('content', basics.avatarUrl)

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
      image: basics.avatarUrl,
      url: `https://cvvd.vercel.app/${cleanHandle}`,
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
            The profile for "cvvd/{cleanHandle}" has not been claimed or created yet.
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

      {/* Persistent Sidebar with cvvd Platform navigation & CV Controls */}
      <Sidebar />

      {/* Floating Owner Quick Edit Pill */}
      {session?.user && (
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
