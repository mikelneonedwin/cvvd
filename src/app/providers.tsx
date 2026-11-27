'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { queryClient } from '../trpc/client'
import { ThemeProvider } from '../context/ThemeContext'
import { ProfileProvider } from '../context/ProfileContext'
import { TopLoader } from '../components/TopLoader'
import { Toast } from '../components/Toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ProfileProvider>
          <Suspense fallback={null}>
            <TopLoader color="#0a0a0a" height={2.5} showSpinner={false} />
          </Suspense>
          {children}
          <Toast />
        </ProfileProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
