import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  'aria-label'?: string
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  'aria-label': ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const selectedOption = options.find((opt) => opt.value === value)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Scroll focused or selected option into view when opened or navigated
  useEffect(() => {
    if (isOpen && listRef.current) {
      const targetIdx = focusedIndex >= 0 ? focusedIndex : options.findIndex((opt) => opt.value === value)
      if (targetIdx >= 0) {
        const activeEl = listRef.current.children[targetIdx] as HTMLElement
        if (activeEl) {
          activeEl.scrollIntoView({ block: 'nearest' })
        }
      }
    }
  }, [focusedIndex, isOpen, options, value])

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        const curIdx = options.findIndex((opt) => opt.value === value)
        setFocusedIndex(curIdx >= 0 ? curIdx : 0)
      } else if (e.key === 'ArrowDown') {
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (focusedIndex >= 0 && options[focusedIndex]) {
          onChange(options[focusedIndex].value)
          setIsOpen(false)
        }
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev)
            const curIdx = options.findIndex((opt) => opt.value === value)
            setFocusedIndex(curIdx >= 0 ? curIdx : 0)
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] text-xs text-[var(--grey1)] flex items-center justify-between gap-2 transition-all shadow-2xs hover:border-[var(--grey3)] focus:outline-none focus:ring-1 focus:ring-[var(--grey1)] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${triggerClassName}`}
      >
        <span className={`truncate text-left ${!selectedOption?.label ? 'text-[var(--grey3)]' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--grey3)] transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-[var(--grey1)]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          className={`absolute z-50 mt-1 max-h-60 w-full min-w-[130px] overflow-auto rounded-xl border border-[var(--secondaryBorderColor)] bg-[var(--backgroundColor)] p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-50 zoom-in-95 duration-100 ${contentClassName}`}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value
            const isFocused = idx === focusedIndex

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`relative flex items-center justify-between px-2.5 py-2 min-h-[36px] rounded-lg text-xs cursor-pointer select-none transition-colors ${
                  isFocused
                    ? 'bg-[var(--inputBackgroundColor)] text-[var(--grey1)]'
                    : 'text-[var(--grey2)] hover:text-[var(--grey1)]'
                } ${isSelected ? 'font-medium text-[var(--grey1)]' : ''}`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[var(--grey1)] shrink-0 ml-2" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
