import type { Browser } from 'playwright'
import { env } from '../../../env'
import { launchConfiguredBrowser } from '../../../lib/pdfBrowser'

const PDF_TIMEOUT_MS = 45_000
const ASSET_WAIT_TIMEOUT_MS = 3_000
const CLOSE_TIMEOUT_MS = 5_000

async function closeBrowserSafely(browser: Browser | undefined) {
  if (!browser) return
  await Promise.race([
    browser.close().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, CLOSE_TIMEOUT_MS)),
  ])
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const printUrl = `${url.protocol}//${url.host}/print`

  let browser: Browser | undefined
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let timedOut = false

  const abortFromRequest = () => {
    void closeBrowserSafely(browser)
  }
  request.signal.addEventListener('abort', abortFromRequest, { once: true })

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        timedOut = true
        void closeBrowserSafely(browser)
        reject(new Error(`PDF generation timed out after ${PDF_TIMEOUT_MS}ms`))
      }, PDF_TIMEOUT_MS)
    })

    const generatePromise = (async () => {
      const launched = await launchConfiguredBrowser({
        browserPath: env.BROWSER_PATH,
      })
      browser = launched.browser

      if (timedOut || request.signal.aborted) {
        throw new Error('PDF generation cancelled')
      }

      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        colorScheme: 'light',
      })
      const page = await context.newPage()

      await page.goto(printUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 20_000,
      })
      await page.waitForSelector('.readcv-container', { timeout: 10_000 })
      await page
        .waitForSelector('[data-print-ready="true"]', { timeout: 5_000 })
        .catch(() => undefined)
      await page.emulateMedia({ media: 'print' })
      await page.evaluate(async (assetTimeoutMs) => {
        const pendingImages = Array.from(document.images).filter(
          (img) => !img.complete,
        )
        if (pendingImages.length > 0) {
          await Promise.race([
            Promise.all(
              pendingImages.map(
                (img) =>
                  new Promise<void>((resolve) => {
                    img.addEventListener('load', () => resolve(), {
                      once: true,
                    })
                    img.addEventListener('error', () => resolve(), {
                      once: true,
                    })
                  }),
              ),
            ),
            new Promise<void>((resolve) => setTimeout(resolve, assetTimeoutMs)),
          ])
        }

        if ('fonts' in document) {
          await Promise.race([
            document.fonts.ready,
            new Promise<void>((resolve) => setTimeout(resolve, assetTimeoutMs)),
          ])
        }
      }, ASSET_WAIT_TIMEOUT_MS)

      const pdf = await page.pdf({
        preferCSSPageSize: true,
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })

      return new Response(new Uint8Array(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="cvvd.pdf"',
          'Cache-Control': 'no-store',
          'X-Cvvd-Browser': `${launched.resolved.type}:${launched.resolved.source}`,
        },
      })
    })()

    return await Promise.race([generatePromise, timeoutPromise])
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate PDF'
    return new Response(
      `PDF generation failed. Install Playwright's bundled Chromium with \`bunx playwright install chromium\`, or set BROWSER_PATH to a Chromium-based browser. ${message}`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      },
    )
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
    request.signal.removeEventListener('abort', abortFromRequest)
    await closeBrowserSafely(browser)
  }
}
