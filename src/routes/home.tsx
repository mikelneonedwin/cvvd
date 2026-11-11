import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from './index'

export const Route = createFileRoute('/home')({
  head: () => ({
    meta: [
      { title: 'Cvvd - Living profiles and printable CV engine' },
      {
        name: 'description',
        content:
          'Create a permanent, readable digital CV and print-ready sheets. Inspired by read.cv, crafted for software engineers and designers.',
      },
      { property: 'og:title', content: 'Cvvd - Living profiles and printable CV engine' },
      {
        property: 'og:description',
        content:
          'Create a permanent, readable digital CV and print-ready sheets. Inspired by read.cv, crafted for software engineers and designers.',
      },
      { property: 'og:url', content: 'https://cvvd.vercel.app/home' },
    ],
  }),
  component: HomePage,
})
