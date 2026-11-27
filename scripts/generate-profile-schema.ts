import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import { userProfileSchema } from '../src/lib/profileSchema'

const outputPath = path.resolve(process.cwd(), 'data/profile.schema.json')

const schema = z.toJSONSchema(userProfileSchema, {
  target: 'draft-2020-12',
})

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, JSON.stringify(schema, null, 2) + '\n', 'utf8')
console.log(`Wrote ${outputPath}`)
