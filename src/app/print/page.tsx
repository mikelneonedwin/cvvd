import { getProfile } from '../../lib/profileStore'
import { PrintClient } from './print-client'

export const dynamic = 'force-dynamic'

export default async function PrintPage() {
  const profile = await getProfile()
  return <PrintClient initialProfile={profile} />
}
