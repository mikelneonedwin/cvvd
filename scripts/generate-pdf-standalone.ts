import { spawn } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'

const cwd = process.cwd()
const outputArg = process.argv[2] || 'public/cv.pdf'
const outputPath = path.resolve(cwd, outputArg)
const distDir = `.next-pdf-${process.pid}`

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Failed to get a free port')))
        return
      }
      const { port } = address
      server.close((err) => (err ? reject(err) : resolve(port)))
    })
    server.on('error', reject)
  })
}

async function waitForServer(url: string, timeoutMs: number) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status < 500) return
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`)
}

async function main() {
  const port = await getFreePort()
  const baseUrl = `http://127.0.0.1:${port}`

  const child = spawn('bunx', ['next', 'dev', '--port', String(port)], {
    cwd,
    env: {
      ...process.env,
      NEXT_DIST_DIR: distDir,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let logs = ''
  child.stdout.on('data', (d) => {
    logs += d.toString()
  })
  child.stderr.on('data', (d) => {
    logs += d.toString()
  })

  const cleanup = async () => {
    if (!child.killed) {
      child.kill('SIGTERM')
      await new Promise((r) => setTimeout(r, 500))
      if (!child.killed) child.kill('SIGKILL')
    }
    await rm(path.join(cwd, distDir), { recursive: true, force: true }).catch(
      () => undefined,
    )
  }

  process.on('SIGINT', () => {
    void cleanup().finally(() => process.exit(1))
  })
  process.on('SIGTERM', () => {
    void cleanup().finally(() => process.exit(1))
  })

  try {
    await waitForServer(`${baseUrl}/print`, 120000)

    const res = await fetch(`${baseUrl}/api/pdf`)
    if (!res.ok) {
      const message = await res.text().catch(() => '')
      throw new Error(message || `Failed to generate PDF (${res.status})`)
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, buffer)
    console.log(`Saved PDF to ${outputPath}`)
  } catch (err) {
    console.error(logs.slice(-4000))
    throw err
  } finally {
    await cleanup()
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
