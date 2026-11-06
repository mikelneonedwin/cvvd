import React from 'react'
import { MONTHS, YEARS, parseDateString, formatDateString, type MonthAbbr } from '../lib/dateUtils'

interface MonthYearPickerProps {
  label?: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
  className?: string
}

export function MonthYearPicker({
  label,
  value,
  disabled = false,
  onChange,
  className = '',
}: MonthYearPickerProps) {
  const parsed = parseDateString(value)

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value as MonthAbbr | ''
    onChange(formatDateString({ month: newMonth, year: parsed.year }))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value
    onChange(formatDateString({ month: parsed.month, year: newYear }))
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="text-[11px] font-mono text-[var(--grey3)] uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={parsed.month}
          disabled={disabled}
          onChange={handleMonthChange}
          aria-label={`${label || 'Date'} month`}
          className="px-2.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] disabled:opacity-50 transition-colors"
        >
          <option value="">Month (opt)</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={parsed.year}
          disabled={disabled}
          onChange={handleYearChange}
          aria-label={`${label || 'Date'} year`}
          className="px-2.5 min-h-[44px] rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs font-mono text-[var(--grey1)] disabled:opacity-50 transition-colors"
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
