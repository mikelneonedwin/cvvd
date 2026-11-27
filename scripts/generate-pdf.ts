import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)
const outputArg = process.argv[2] || 'cvvd.pdf'
const outputPath = path.resolve(process.cwd(), outputArg)

async function main() {
  const res = await fetch(`${baseUrl}/api/pdf`)
  if (!res.ok) {
    const message = await res.text().catch(() => '')
    throw new Error(message || `Failed to generate PDF (${res.status})`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, buffer)
  console.log(`Saved PDF to ${outputPath}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
