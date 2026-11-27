import {
  accessSync,
  closeSync,
  constants,
  openSync,
  readSync,
  realpathSync,
} from 'node:fs'
import { basename, delimiter, join } from 'node:path'
import { chromium, type Browser } from 'playwright'

export interface ResolvedBrowser {
  type: 'chromium'
  executablePath?: string
  source: 'env' | 'bundled' | 'system'
}

const CHROMIUM_EXECUTABLES = [
  'google-chrome-stable',
  'google-chrome',
  'chromium-browser',
  'chromium',
  'microsoft-edge-stable',
  'microsoft-edge',
  'brave-browser',
  'brave',
]

const CHROMIUM_PATHS = [
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/usr/bin/microsoft-edge-stable',
  '/usr/bin/microsoft-edge',
  '/usr/bin/brave-browser',
  '/usr/bin/brave-browser-stable',
]

const LAUNCH_TIMEOUT_MS = 15_000

function isExecutable(filePath: string): boolean {
  try {
    accessSync(filePath, constants.X_OK)
    return true
  } catch {
    return false
  }
}

function isSnapPath(filePath: string): boolean {
  return filePath === '/snap' || filePath.startsWith('/snap/')
}

function isSnapWrapperScript(filePath: string): boolean {
  let fd: number | undefined
  try {
    fd = openSync(filePath, 'r')
    const buffer = Buffer.alloc(512)
    const bytesRead = readSync(fd, buffer, 0, buffer.length, 0)
    if (bytesRead <= 0) return false
    const header = buffer.subarray(0, bytesRead).toString('utf8')
    if (!header.startsWith('#!')) return false
    return header.includes('/snap/') || /\bsnap\b/.test(header)
  } catch {
    return false
  } finally {
    if (fd !== undefined) {
      try {
        closeSync(fd)
      } catch {
        // Ignore close failure
      }
    }
  }
}

function isUsableSystemBrowser(filePath: string): boolean {
  if (!isExecutable(filePath) || isSnapPath(filePath)) return false
  try {
    const resolved = realpathSync(filePath)
    if (isSnapPath(resolved)) return false
    return !isSnapWrapperScript(resolved)
  } catch {
    return false
  }
}

function findSystemChromium(): string | undefined {
  const pathValue = process.env.PATH || ''
  for (const dir of pathValue.split(delimiter)) {
    if (!dir || isSnapPath(dir)) continue
    for (const name of CHROMIUM_EXECUTABLES) {
      const candidate = join(dir, name)
      if (isUsableSystemBrowser(candidate)) return candidate
    }
  }

  for (const candidate of CHROMIUM_PATHS) {
    if (isUsableSystemBrowser(candidate)) return candidate
  }

  return undefined
}

function isBundledChromiumAvailable(): boolean {
  try {
    const bundledPath = chromium.executablePath()
    return Boolean(bundledPath && isExecutable(bundledPath))
  } catch {
    return false
  }
}

/**
 * Resolve the Chromium executable used for Playwright PDF generation.
 * Playwright `page.pdf()` only supports Headless Chromium, so Firefox is never selected.
 */
export function resolveBrowser(options?: {
  browserPath?: string
}): ResolvedBrowser {
  const browserPath = options?.browserPath?.trim()
  if (browserPath) {
    if (basename(browserPath).toLowerCase().includes('firefox')) {
      throw new Error(
        'Firefox is not supported for PDF generation because Playwright page.pdf() requires Chromium. Unset BROWSER_PATH or set it to a Chromium-based browser.',
      )
    }
    return {
      type: 'chromium',
      executablePath: browserPath,
      source: 'env',
    }
  }

  if (isBundledChromiumAvailable()) {
    return { type: 'chromium', source: 'bundled' }
  }

  const systemPath = findSystemChromium()
  if (systemPath) {
    return { type: 'chromium', executablePath: systemPath, source: 'system' }
  }

  return { type: 'chromium', source: 'bundled' }
}

async function launchChromium(executablePath?: string): Promise<Browser> {
  return chromium.launch({
    headless: true,
    timeout: LAUNCH_TIMEOUT_MS,
    args: ['--disable-dev-shm-usage'],
    ...(executablePath ? { executablePath } : {}),
  })
}

/**
 * Launch Chromium for PDF rendering, preferring explicit configuration and falling back cleanly
 * between bundled and non-snap system Chromium when auto-detecting.
 */
export async function launchConfiguredBrowser(options?: {
  browserPath?: string
}): Promise<{ browser: Browser; resolved: ResolvedBrowser }> {
  const resolved = resolveBrowser(options)

  try {
    const browser = await launchChromium(resolved.executablePath)
    return { browser, resolved }
  } catch (error) {
    if (resolved.source === 'env') {
      throw error
    }

    if (resolved.source === 'system' && isBundledChromiumAvailable()) {
      const browser = await launchChromium()
      return { browser, resolved: { type: 'chromium', source: 'bundled' } }
    }

    if (resolved.source === 'bundled') {
      const systemPath = findSystemChromium()
      if (systemPath) {
        const browser = await launchChromium(systemPath)
        return {
          browser,
          resolved: {
            type: 'chromium',
            executablePath: systemPath,
            source: 'system',
          },
        }
      }
    }

    throw error
  }
}
