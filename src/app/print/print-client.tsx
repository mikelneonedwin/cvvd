'use client'

import { useEffect, useState } from 'react'
import { PrintProfileProvider } from '../../context/ProfileContext'
import { CVProfile } from '../../components/CVProfile'
import type { UserProfile } from '../../types/profile'

export function PrintClient({
  initialProfile,
}: {
  initialProfile: UserProfile
}) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const isDark = initialProfile.printSettings.printTheme === 'dark'
    document.body.classList.add('print-export-page')
    document.body.classList.toggle('print-theme-dark', isDark)
    document.documentElement.classList.toggle('print-theme-dark', isDark)
    // oxlint-disable-next-line react/set-state-in-effect -- mark print styles ready after body theme classes sync
    setIsReady(true)

    return () => {
      document.body.classList.remove('print-export-page')
      document.body.classList.remove('print-theme-dark')
      document.documentElement.classList.remove('print-theme-dark')
    }
  }, [initialProfile])

  return (
    <PrintProfileProvider profile={initialProfile}>
      <div
        data-print-ready={isReady ? 'true' : undefined}
        className="min-h-screen bg-[var(--backgroundColor)]"
      >
        <CVProfile />
      </div>
    </PrintProfileProvider>
  )
}
