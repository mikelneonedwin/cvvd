import { auth } from '../lib/auth'
import { db } from '../db'

export async function createTRPCContext({ req }: { req: Request }) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  return {
    req,
    db,
    session,
    user: session?.user ?? null,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
