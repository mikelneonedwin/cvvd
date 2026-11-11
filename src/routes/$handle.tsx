import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$handle')({
  beforeLoad: ({ params }) => {
    const clean = (params.handle || '').toLowerCase().replace(/^@/, '')
    throw redirect({
      to: '/u/$username',
      params: { username: clean },
    })
  },
})
