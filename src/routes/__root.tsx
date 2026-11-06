import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { queryClient } from '../trpc/client'
import { ThemeProvider } from '../context/ThemeContext'
import { ProfileProvider } from '../context/ProfileContext'
import { TopLoader } from '../components/TopLoader'
import { Toast } from '../components/Toast'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Cvvd - Living Profiles and Printable CV Engine' },
      {
        name: 'description',
        content:
          'A clean, presentable home for your work, your story, and your printable CV. Inspired by read.cv, crafted for designers, engineers, and creators.',
      },
      {
        property: 'og:title',
        content: 'Cvvd - Living Profiles and Printable CV Engine',
      },
      {
        property: 'og:description',
        content:
          'A clean, presentable home for your work, your story, and your printable CV.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Cvvd' },
      { property: 'og:url', content: 'https://cvvd.vercel.app' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Cvvd - Living Profiles and Printable CV Engine',
      },
      {
        name: 'twitter:description',
        content:
          'A clean, presentable home for your work, your story, and your printable CV.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ProfileProvider>
            <TopLoader color="#0a0a0a" height={2.5} showSpinner={false} />
            <Outlet />
            <Toast />
            <Analytics />
          </ProfileProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('cvvd_theme_preference');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||((!s||s==='system')&&p)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
