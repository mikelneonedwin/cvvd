import satori from 'satori'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { resvgWasmBase64 } from './resvgWasmBase64'
import { interFontBase64 } from './interFontBase64'

let wasmInitialized = false

async function ensureWasm() {
  if (wasmInitialized) return
  const buffer = Buffer.from(resvgWasmBase64, 'base64')
  await initWasm(buffer)
  wasmInitialized = true
}

let fontArrayBuffer: ArrayBuffer | null = null

function getFontBuffer(): ArrayBuffer {
  if (fontArrayBuffer) return fontArrayBuffer
  const buffer = Buffer.from(interFontBase64, 'base64')
  fontArrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  return fontArrayBuffer
}

export interface WorkExperienceItem {
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  technologies?: string[]
}

export interface ProjectItem {
  title?: string
  technologies?: string[]
}

export interface WritingItem {
  title?: string
}

export interface SkillCategoryItem {
  name?: string
  skills?: string[]
}

export interface OgCardData {
  handle: string
  name: string
  headline?: string
  location?: string
  status?: string
  avatarUrl?: string
  summary?: string
  links?: Array<{ platform: string; url: string; label?: string }>
  experience?: WorkExperienceItem[]
  projects?: ProjectItem[]
  writing?: WritingItem[]
  skillCategories?: SkillCategoryItem[]
}

function parseDate(str?: string): Date | null {
  if (!str) return null
  const s = str.trim().toLowerCase()
  if (s === 'now' || s === 'present' || s === 'current') return new Date()
  const slashMatch = s.match(/^(\d{1,2})[\/.-](\d{4})$/)
  if (slashMatch) {
    const month = Math.max(0, Math.min(11, parseInt(slashMatch[1], 10) - 1))
    const year = parseInt(slashMatch[2], 10)
    return new Date(year, month, 1)
  }
  const m = s.match(/([a-z]+)[.\s,/-]+(\d{4})/i) || s.match(/(\d{4})/)
  if (!m) return null
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  }
  if (m.length === 3) {
    const monStr = m[1].slice(0, 3).toLowerCase()
    const month = months[monStr] ?? 0
    const year = parseInt(m[2], 10)
    return new Date(year, month, 1)
  }
  return new Date(parseInt(m[1], 10), 0, 1)
}

function calculateYearsExperience(experience?: WorkExperienceItem[], summary?: string): string | null {
  const intervals: Array<[number, number]> = []
  const now = new Date()
  if (Array.isArray(experience)) {
    for (const exp of experience) {
      const start = parseDate(exp.startDate)
      const end =
        exp.isCurrent || (exp.endDate && /now|present|current/i.test(exp.endDate))
          ? now
          : parseDate(exp.endDate)
      if (start && end && end >= start) {
        intervals.push([start.getTime(), end.getTime()])
      } else if (start && !end) {
        intervals.push([start.getTime(), now.getTime()])
      }
    }
  }

  let calculatedYears = 0
  if (intervals.length > 0) {
    intervals.sort((a, b) => a[0] - b[0])
    const merged: Array<[number, number]> = []
    let curr = intervals[0]
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i][0] <= curr[1]) {
        curr[1] = Math.max(curr[1], intervals[i][1])
      } else {
        merged.push(curr)
        curr = intervals[i]
      }
    }
    merged.push(curr)
    let totalMs = 0
    for (const [s, e] of merged) {
      totalMs += e - s
    }
    calculatedYears = totalMs / (1000 * 60 * 60 * 24 * 365.25)
  }

  let summaryYears = 0
  if (summary) {
    const wordNums: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    }
    const match = summary.match(
      /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\+?\s+years?/i
    )
    if (match) {
      summaryYears =
        parseInt(match[1], 10) || wordNums[match[1].toLowerCase()] || 0
    }
  }

  const best = Math.max(calculatedYears, summaryYears)
  if (best <= 0.3) return null
  const rounded = Math.round(best * 10) / 10
  return rounded % 1 === 0 ? `${rounded}` : `${rounded.toFixed(1)}`
}

async function fetchImageBase64(url: string): Promise<string | null> {
  if (!url) return null
  if (url.startsWith('data:image/')) return url
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const arrayBuf = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const b64 = Buffer.from(arrayBuf).toString('base64')
    return `data:${contentType};base64,${b64}`
  } catch {
    return null
  }
}

function formatDisplayUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    return (parsed.hostname + parsed.pathname).replace(/\/+$/, '')
  } catch {
    return rawUrl.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
  }
}

export function createCvvdLogoElement(
  size = 32,
  bgColor = '#ffffff',
  fgColor = '#111111'
) {
  return {
    type: 'svg',
    props: {
      viewBox: '0 0 32 32',
      width: size,
      height: size,
      style: { flexShrink: 0 },
      children: [
        {
          type: 'rect',
          props: { width: 32, height: 32, rx: 8, fill: bgColor },
        },
        {
          type: 'path',
          props: {
            d: 'M8 10L12.5 22L16 13.5L19.5 22L24 10H21L18 18L15 11H13L10 18L9 10H8Z',
            fill: fgColor,
          },
        },
        {
          type: 'circle',
          props: { cx: 23, cy: 8.5, r: 1.5, fill: fgColor },
        },
      ],
    },
  }
}

function createBriefcaseIcon(size = 34, color = '#60a5fa') {
  return {
    type: 'svg',
    props: {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { flexShrink: 0 },
      children: [
        {
          type: 'rect',
          props: { width: 20, height: 14, x: 2, y: 7, rx: 2, ry: 2 },
        },
        {
          type: 'path',
          props: { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
        },
      ],
    },
  }
}

function createFolderIcon(size = 34, color = '#c084fc') {
  return {
    type: 'svg',
    props: {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { flexShrink: 0 },
      children: [
        {
          type: 'path',
          props: {
            d: 'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
          },
        },
      ],
    },
  }
}

function createBookOpenIcon(size = 34, color = '#34d399') {
  return {
    type: 'svg',
    props: {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { flexShrink: 0 },
      children: [
        {
          type: 'path',
          props: { d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
        },
        {
          type: 'path',
          props: { d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
        },
      ],
    },
  }
}

export async function generateOgImagePng(data: OgCardData): Promise<Buffer> {
  await ensureWasm()
  const font = getFontBuffer()

  const avatarBase64 = data.avatarUrl ? await fetchImageBase64(data.avatarUrl) : null

  const name = data.name || 'Cvvd Creator'
  const headline = data.headline || ''
  const location = data.location || ''
  const status = data.status || 'Available for work'

  const subtitle = headline && location ? `${headline} in ${location}` : headline || location
  const links = (data.links || []).slice(0, 4)

  const yearsExp = calculateYearsExperience(data.experience, data.summary)
  const totalProjects = Array.isArray(data.projects) ? data.projects.length : 0
  const totalWriting = Array.isArray(data.writing) ? data.writing.length : 0

  const statCards: Array<{
    icon: any
    value: string
    label: string
    borderColor: string
    accentColor: string
  }> = []

  if (yearsExp) {
    statCards.push({
      icon: createBriefcaseIcon(36, '#60a5fa'),
      value: `${yearsExp} yrs`,
      label: 'experience',
      borderColor: '#1e293b',
      accentColor: '#3b82f6',
    })
  }

  if (totalProjects > 0) {
    statCards.push({
      icon: createFolderIcon(36, '#c084fc'),
      value: `${totalProjects}`,
      label: totalProjects === 1 ? 'project' : 'projects',
      borderColor: '#2e1065',
      accentColor: '#a855f7',
    })
  }

  if (totalWriting > 0) {
    statCards.push({
      icon: createBookOpenIcon(36, '#34d399'),
      value: `${totalWriting}`,
      label: totalWriting === 1 ? 'writeup' : 'writeups',
      borderColor: '#064e3b',
      accentColor: '#10b981',
    })
  }

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: '#0c0c0f',
        backgroundImage:
          'radial-gradient(circle at 100% 0%, #1e1e2c 0%, #0c0c0f 65%)',
        padding: '46px 64px 44px 64px',
        justifyContent: 'space-between',
        fontFamily: 'Inter',
        color: '#ffffff',
      },
      children: [
        // Top Header: Cvvd Brand Logo + Wordmark (Clean top, pill removed)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
              paddingBottom: '22px',
              borderBottom: '1px solid #202028',
              gap: '14px',
            },
            children: [
              createCvvdLogoElement(34, '#ffffff', '#0c0c0f'),
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: '#f4f4f5',
                    display: 'flex',
                  },
                  children: 'Cvvd',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '15px',
                    color: '#71717a',
                    marginLeft: '4px',
                    display: 'flex',
                  },
                  children: '• Living Profile & Printable CV',
                },
              },
            ],
          },
        },

        // Hero Profile Header (Bigger avatar, larger title, subtitle, and availability badge)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '34px',
            },
            children: [
              avatarBase64
                ? {
                    type: 'img',
                    props: {
                      src: avatarBase64,
                      width: '156',
                      height: '156',
                      style: {
                        width: '156px',
                        height: '156px',
                        borderRadius: '9999px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '3px solid rgba(255, 255, 255, 0.16)',
                      },
                    },
                  }
                : {
                    type: 'div',
                    props: {
                      style: {
                        width: '156px',
                        height: '156px',
                        borderRadius: '9999px',
                        backgroundColor: '#202028',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '68px',
                        fontWeight: 700,
                        color: '#e4e4e7',
                        flexShrink: 0,
                        border: '2px solid #2e2e3c',
                      },
                      children: name.charAt(0).toUpperCase(),
                    },
                  },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '10px',
                    maxWidth: '890px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '18px',
                          flexWrap: 'wrap',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '50px',
                                fontWeight: 800,
                                lineHeight: 1.08,
                                color: '#ffffff',
                                letterSpacing: '-0.03em',
                                display: 'flex',
                              },
                              children: name,
                            },
                          },
                          status
                            ? {
                                type: 'div',
                                props: {
                                  style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '7px 18px',
                                    borderRadius: '9999px',
                                    backgroundColor: '#241419',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: '#fda4af',
                                    border: '1px solid #4c1d28',
                                  },
                                  children: [
                                    {
                                      type: 'span',
                                      props: {
                                        style: { color: '#f43f5e', display: 'flex', fontSize: '13px' },
                                        children: '♥',
                                      },
                                    },
                                    {
                                      type: 'span',
                                      props: {
                                        style: { display: 'flex' },
                                        children: status,
                                      },
                                    },
                                  ],
                                },
                              }
                            : null,
                        ].filter(Boolean),
                      },
                    },
                    subtitle
                      ? {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              fontSize: '26px',
                              fontWeight: 400,
                              color: '#a1a1aa',
                              lineHeight: 1.3,
                            },
                            children: subtitle,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
            ],
          },
        },

        // Metrics Section: Big, High-Visibility Artifact & Experience Cards
        statCards.length > 0
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '22px',
                  width: '100%',
                },
                children: statCards.map((card) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '16px 28px',
                      borderRadius: '22px',
                      backgroundColor: '#15151c',
                      border: '1px solid #282836',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            backgroundColor: '#1f1f2b',
                            border: '1px solid #2f2f42',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          },
                          children: [card.icon],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '2px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '32px',
                                  fontWeight: 800,
                                  color: '#ffffff',
                                  letterSpacing: '-0.025em',
                                  lineHeight: 1.1,
                                  display: 'flex',
                                },
                                children: card.value,
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#a1a1aa',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.06em',
                                  display: 'flex',
                                },
                                children: card.label,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                })),
              },
            }
          : { type: 'div', props: { style: { display: 'none' } } },

        // Bottom Row: Public Communication and Social Links
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '20px',
              borderTop: '1px solid #1e1e26',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  },
                  children: links.map((link) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '9px 20px',
                        borderRadius: '9999px',
                        backgroundColor: '#16161e',
                        border: '1px solid #282836',
                        fontSize: '16px',
                        color: '#e4e4e7',
                      },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: { display: 'flex' },
                            children: formatDisplayUrl(link.url),
                          },
                        },
                        {
                          type: 'span',
                          props: {
                            style: { color: '#71717a', fontSize: '15px', display: 'flex' },
                            children: '↗',
                          },
                        },
                      ],
                    },
                  })),
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '15px',
                    color: '#71717a',
                    display: 'flex',
                  },
                  children: 'cvvd.vercel.app',
                },
              },
            ],
          },
        },
      ],
    },
  }

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 400,
        style: 'normal',
      },
    ],
  })

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const pngData = resvg.render().asPng()
  return Buffer.from(pngData)
}

export async function generateCvvdBrandOgImagePng(): Promise<Buffer> {
  await ensureWasm()
  const font = getFontBuffer()

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: '#0a0a0c',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, #1e1e28 0%, #0a0a0c 70%)',
        padding: '64px 76px',
        justifyContent: 'space-between',
        fontFamily: 'Inter',
        color: '#ffffff',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            },
            children: [
              createCvvdLogoElement(38, '#ffffff', '#0a0a0c'),
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#f4f4f5',
                    display: 'flex',
                  },
                  children: 'Cvvd',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              maxWidth: '920px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '60px',
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: '-0.035em',
                    color: '#ffffff',
                    display: 'flex',
                  },
                  children: 'Living Profiles & Printable CV Engine',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '26px',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: '#a1a1aa',
                    display: 'flex',
                  },
                  children:
                    'A permanent, readable digital canvas for your story, and publication-grade CV sheets calibrated for paper.',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '26px',
              borderTop: '1px solid #1e1e24',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    fontSize: '18px',
                    color: '#71717a',
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: { display: 'flex' },
                        children: 'cvvd.vercel.app',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { display: 'flex', color: '#3f3f46' },
                        children: '•',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { display: 'flex' },
                        children: 'Free forever',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    backgroundColor: '#16161b',
                    border: '1px solid #272730',
                    fontSize: '16px',
                    color: '#e4e4e7',
                  },
                  children: 'cvvd/u/:username',
                },
              },
            ],
          },
        },
      ],
    },
  }

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 400,
        style: 'normal',
      },
    ],
  })

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const pngData = resvg.render().asPng()
  return Buffer.from(pngData)
}
