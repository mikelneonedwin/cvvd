import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { userProfileSchema } from '../src/lib/profileSchema'

const profilePath = path.resolve(process.cwd(), 'data/profile.yaml')

async function main() {
  let raw: string
  try {
    raw = await readFile(profilePath, 'utf8')
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as { code?: unknown }).code)
        : ''
    if (code === 'ENOENT') {
      console.log('No data/profile.yaml found; skipping profile validation.')
      return
    }
    throw error
  }

  const parsed = parse(raw)
  const result = userProfileSchema.safeParse(parsed)
  if (!result.success) {
    console.error('data/profile.yaml failed schema validation:')
    for (const issue of result.error.issues) {
      const p = issue.path.length > 0 ? issue.path.join('.') : '(root)'
      console.error(`- ${p}: ${issue.message}`)
    }
    process.exit(1)
  }

  console.log('data/profile.yaml is valid.')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
