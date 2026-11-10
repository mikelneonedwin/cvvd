export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export type MonthAbbr = (typeof MONTHS)[number]

const currentYear = new Date().getFullYear()
// Generate years from currentYear + 1 down to 1970 so 2026 and current years are immediately visible without long scrolling
export const YEARS: readonly string[] = Array.from(
  { length: currentYear + 1 - 1970 + 1 },
  (_, i) => String(currentYear + 1 - i)
)

export interface ParsedDate {
  month: MonthAbbr | ''
  year: string
}

export function parseDateString(val?: string | null): ParsedDate {
  if (!val || val.trim() === '' || val.toLowerCase() === 'now' || val.toLowerCase() === 'present') {
    return { month: '', year: '' }
  }
  const clean = val.trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) {
    const rawMonth = parts[0].slice(0, 3)
    const matchedMonth = MONTHS.find((m) => m.toLowerCase() === rawMonth.toLowerCase()) || ''
    const year = parts[1].replace(/[^0-9]/g, '')
    return { month: (matchedMonth as MonthAbbr) || '', year }
  }
  // If only a single token, check if it's a year or month
  if (/^\d{4}$/.test(clean)) {
    return { month: '', year: clean }
  }
  const rawMonth = clean.slice(0, 3)
  const matchedMonth = MONTHS.find((m) => m.toLowerCase() === rawMonth.toLowerCase()) || ''
  return { month: (matchedMonth as MonthAbbr) || '', year: '' }
}

export function formatDateString(parsed: ParsedDate): string {
  const { month, year } = parsed
  if (month && year) return `${month} ${year}`
  if (year) return year
  if (month) return month
  return ''
}
