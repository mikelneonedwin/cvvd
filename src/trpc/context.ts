export async function createTRPCContext({ req }: { req: Request }) {
  return { req }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
