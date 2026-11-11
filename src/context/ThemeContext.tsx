import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  mounted: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'cvvd_theme_preference'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDark, setIsDark] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const saved = localStorage.getItem(STORAGE_KEY)
    const initialTheme: Theme =
      saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
    setTheme(initialTheme)

    const computeDark = (t: Theme) => {
      if (t === 'dark') return true
      if (t === 'light') return false
      return mediaQuery.matches
    }

    const currentDark = computeDark(initialTheme)
    setIsDark(currentDark)
    if (currentDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    const handleChange = () => {
      const activeSaved = localStorage.getItem(STORAGE_KEY) || 'system'
      if (activeSaved === 'system') {
        const nextDark = mediaQuery.matches
        setIsDark(nextDark)
        if (nextDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const computeDark = () => {
      if (theme === 'dark') return true
      if (theme === 'light') return false
      return mediaQuery.matches
    }

    const currentDark = computeDark()
    setIsDark(currentDark)

    if (currentDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, mounted, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
