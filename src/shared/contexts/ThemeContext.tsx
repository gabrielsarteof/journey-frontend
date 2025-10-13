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

    // Usa data-attribute ao invés de classes (Tailwind v4 best practice)
    document.documentElement.setAttribute('data-theme', newTheme.resolved)
    // color-scheme: hint CSS para browser renderizar scrollbars/forms nativos no tema correto
    document.documentElement.style.colorScheme = newTheme.resolved

    setCurrentTheme(newTheme)
    storageStrategy.set(theme)
  }, [storageStrategy])

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = currentTheme.resolved === 'dark' ? 'light' : 'dark'
    handleSetTheme(nextTheme)
  }, [currentTheme.resolved, handleSetTheme])

  // Sincroniza DOM e anuncia mudanças para screen readers (a11y)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.resolved)
    document.documentElement.style.colorScheme = currentTheme.resolved

    // Anuncia mudança de tema para screen readers via live region
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = `Tema alterado para modo ${currentTheme.resolved === 'dark' ? 'escuro' : 'claro'}`
    document.body.appendChild(announcement)

    const timeoutId = setTimeout(() => announcement.remove(), 1000)
    return () => {
      clearTimeout(timeoutId)
      announcement.remove()
    }
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