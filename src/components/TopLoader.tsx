'use client'

import NextTopLoader from 'nextjs-toploader'

interface TopLoaderProps {
  color?: string
  height?: number
  showSpinner?: boolean
}

export function TopLoader({
  color = '#0a0a0a',
  height = 2.5,
  showSpinner = false,
}: TopLoaderProps) {
  return (
    <NextTopLoader color={color} height={height} showSpinner={showSpinner} />
  )
}
