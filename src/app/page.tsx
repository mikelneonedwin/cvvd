import { getProfile } from '../lib/profileStore'
import { StudioClient } from './studio-client'

export const dynamic = 'force-dynamic'

export default async function ProfileStudioPage() {
  const profile = await getProfile()
  return <StudioClient initialProfile={profile} />
}
