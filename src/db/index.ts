import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __cvvd_conn__: postgres.Sql | undefined
}

const client = globalThis.__cvvd_conn__ ?? postgres(env.DATABASE_URL)
if (process.env.NODE_ENV !== 'production') globalThis.__cvvd_conn__ = client

export const db = drizzle(client, { schema })
export { client }
