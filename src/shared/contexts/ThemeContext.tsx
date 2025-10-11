import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { createSafeContext } from '../abstractions/BaseContext'
import type { BaseContextValue } from '../abstractions/BaseContext'
import { Theme } from '../domain/value-objects/Theme'
import type { ThemeMode, ResolvedTheme } from '../domain/value-objects/Theme'
import { LocalStorageThemeStrategy } from '../infrastructure/storage/ThemeStorage'
import type { ThemeStorageStrategy } from '../infrastructure/storage/ThemeStorage'

interface ThemeContextValue extends BaseContextValue {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const [ThemeContext, useTheme] = createSafeContext<ThemeContextValue>('ThemeContext')

interface ThemeProviderProps {
  children: ReactNode
  storageStrategy?: ThemeStorageStrategy
  defaultTheme?: ThemeMode
}

export function ThemeProvider({
  children,
  storageStrategy = new LocalStorageThemeStrategy(),
  defaultTheme = 'system'
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const stored = storageStrategy.get()
    const initialTheme = stored ?? defaultTheme
    return Theme.resolve(initialTheme)
  })

  // Observer pattern: escuta mudanças no sistema
  useEffect(() => {
    if (currentTheme.value !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      setCurrentTheme(Theme.resolve('system'))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [currentTheme.value])

  // Command pattern: encapsula a lógica de mudança de tema
  const handleSetTheme = useCallback((theme: ThemeMode) => {
    const newTheme = Theme.resolve(theme)

    // Aplica mudança imediatamente na DOM para evitar flash
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme.resolved)

    setCurrentTheme(newTheme)
    storageStrategy.set(theme)
  }, [storageStrategy])

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = currentTheme.resolved === 'dark' ? 'light' : 'dark'
    handleSetTheme(nextTheme)
  }, [currentTheme.resolved, handleSetTheme])

  // Sincroniza DOM na inicialização
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(currentTheme.resolved)
  }, [currentTheme.resolved])

  const contextValue: ThemeContextValue = {
    isInitialized: true,
    theme: currentTheme.value,
    resolvedTheme: currentTheme.resolved,
    setTheme: handleSetTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export { useTheme }