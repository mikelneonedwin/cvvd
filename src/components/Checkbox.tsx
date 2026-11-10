import React, { useId } from 'react'
import { Check } from 'lucide-react'

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className = '',
  id: explicitId,
  'aria-label': ariaLabel,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const isChecked = isControlled ? controlledChecked : internalChecked
  const generatedId = useId()
  const id = explicitId || generatedId

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (disabled) return
    const next = !isChecked
    if (!isControlled) {
      setInternalChecked(next)
    }
    onCheckedChange?.(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      const next = !isChecked
      if (!isControlled) {
        setInternalChecked(next)
      }
      onCheckedChange?.(next)
    }
  }

  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`peer relative flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--grey1)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--backgroundColor)] disabled:cursor-not-allowed disabled:opacity-50 ${
        isChecked
          ? 'bg-[var(--grey1)] border-[var(--grey1)] text-[var(--backgroundColor)] shadow-2xs'
          : 'border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] hover:border-[var(--grey3)]'
      } ${className}`}
      {...props}
    >
      <Check
        className={`h-3 w-3 stroke-[3] transition-transform duration-100 ease-out ${
          isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />
    </button>
  )
}
