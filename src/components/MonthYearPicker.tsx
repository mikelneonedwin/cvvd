import { MONTHS, YEARS, parseDateString, formatDateString, type MonthAbbr } from '../lib/dateUtils'
import { CustomSelect } from './CustomSelect'

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

  const monthOptions = [
    { value: '', label: 'Month (opt)' },
    ...MONTHS.map((m) => ({ value: m, label: m })),
  ]

  const yearOptions = [
    { value: '', label: 'Year' },
    ...YEARS.map((y) => ({ value: y, label: y })),
  ]

  const handleMonthChange = (newMonth: string) => {
    onChange(formatDateString({ month: (newMonth as MonthAbbr) || '', year: parsed.year }))
  }

  const handleYearChange = (newYear: string) => {
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
        <CustomSelect
          value={parsed.month}
          disabled={disabled}
          onChange={handleMonthChange}
          options={monthOptions}
          aria-label={`${label || 'Date'} month`}
        />

        <CustomSelect
          value={parsed.year}
          disabled={disabled}
          onChange={handleYearChange}
          options={yearOptions}
          aria-label={`${label || 'Date'} year`}
        />
      </div>
    </div>
  )
}
