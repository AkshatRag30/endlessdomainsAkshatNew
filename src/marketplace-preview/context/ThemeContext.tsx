import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Preview copy of the marketplace project's src/context/ThemeContext.tsx.
// Differences, both because this project's real pages/_document.tsx and env
// are left untouched:
// 1. The toggle is always on here (no NEXT_PUBLIC_DARK_MODE flag), so the
//    dark mode work can be shown on the design-preview pages.
// 2. There is no inline init script in <head>, so the provider applies the
//    saved choice itself on mount. A dark choice can briefly show light on a
//    hard reload; the real app avoids that with the _document script.
// Dark rules only apply inside <div data-marketplace-preview> (see
// design-system/styles/tokens.scss), so this project's own pages never
// change even though the attribute sits on <html>.

export type Theme = 'light' | 'dark'

export const isDarkModeEnabled = true

export const THEME_STORAGE_KEY = 'theme'

export const THEME_COLOR: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#000000',
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

const applyTheme = (theme: Theme) => document.documentElement.setAttribute('data-theme', theme)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      // Storage can be blocked (private mode); stay light.
    }
    const initial: Theme = saved === 'dark' ? 'dark' : 'light'
    applyTheme(initial)
    setThemeState(initial)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage can be blocked (private mode); the choice then lasts for this page view only.
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
