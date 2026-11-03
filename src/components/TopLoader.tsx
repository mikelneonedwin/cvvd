import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import NProgress from 'nprogress'

interface TopLoaderProps {
  color?: string
  height?: number
  showSpinner?: boolean
}

export function TopLoader({
  color = '#2563eb',
  height = 2,
  showSpinner = false,
}: TopLoaderProps) {
  const isLoading = useRouterState({
    select: (s) => s.status === 'pending' || s.isLoading,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    NProgress.configure({
      showSpinner,
      minimum: 0.1,
      speed: 300,
      trickleSpeed: 200,
    })
  }, [showSpinner])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isLoading) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [isLoading])

  return (
    <style>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: ${color};
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        width: 100%;
        height: ${height}px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  )
}
