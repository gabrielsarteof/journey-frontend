import type { ThemeMode } from '../../domain/value-objects/Theme'
import { LocalStorageCacheStrategy } from '../../domain/contracts/CacheService'

export interface ThemeStorageStrategy {
  get(): ThemeMode | null
  set(theme: ThemeMode): void
  remove(): void
}

export class LocalStorageThemeStrategy implements ThemeStorageStrategy {
  private readonly key: string

  constructor(key: string = 'journey-theme') {
    this.key = key
  }

  get(): ThemeMode | null {
    try {
      const stored = localStorage.getItem(this.key)
      return this.isValidTheme(stored) ? stored : null
    } catch {
      return null
    }
  }

  set(theme: ThemeMode): void {
    try {
      localStorage.setItem(this.key, theme)
    } catch {
      // Silent fail: não quebrar a aplicação se localStorage não estiver disponível
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key)
    } catch {
      // Silent fail
    }
  }

  // Type guard: garante type safety em runtime
  private isValidTheme(value: string | null): value is ThemeMode {
    return value === 'light' || value === 'dark' || value === 'system'
  }
}

export class MemoryThemeStrategy implements ThemeStorageStrategy {
  private theme: ThemeMode | null = null

  get(): ThemeMode | null {
    return this.theme
  }

  set(theme: ThemeMode): void {
    this.theme = theme
  }

  remove(): void {
    this.theme = null
  }
}

// Strategy que usa CacheService diretamente com localStorage para métricas
export class CachedThemeStrategy implements ThemeStorageStrategy {
  private readonly localStorageStrategy: LocalStorageCacheStrategy
  private readonly THEME_KEY = 'current_theme'

  constructor() {
    this.localStorageStrategy = new LocalStorageCacheStrategy('journey_theme')
  }

  get(): ThemeMode | null {
    try {
      // Acesso direto ao localStorage com parsing manual (síncrono)
      const fullKey = `journey_theme:${this.THEME_KEY}`
      const stored = localStorage.getItem(fullKey)

      if (!stored) return null

      const entry = JSON.parse(stored)

      // Check TTL se presente
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        localStorage.removeItem(fullKey)
        return null
      }

      const value = entry.value || entry // Backward compatibility
      return this.isValidTheme(value) ? value : null
    } catch {
      return null
    }
  }

  set(theme: ThemeMode): void {
    try {
      const fullKey = `journey_theme:${this.THEME_KEY}`
      const entry = {
        value: theme,
        createdAt: Date.now()
        // Sem expiresAt para persistir indefinidamente
      }
      localStorage.setItem(fullKey, JSON.stringify(entry))
    } catch {
      // Silent fail: não quebrar aplicação
    }
  }

  remove(): void {
    try {
      const fullKey = `journey_theme:${this.THEME_KEY}`
      localStorage.removeItem(fullKey)
    } catch {
      // Silent fail
    }
  }

  // Type guard: garante type safety em runtime
  private isValidTheme(value: unknown): value is ThemeMode {
    return value === 'light' || value === 'dark' || value === 'system'
  }

  // Método async para operações com métricas quando necessário
  async getWithMetrics(): Promise<ThemeMode | null> {
    return await this.localStorageStrategy.get<ThemeMode>(this.THEME_KEY)
  }

  async setWithMetrics(theme: ThemeMode): Promise<void> {
    // Set sem TTL para persistir indefinidamente
    await this.localStorageStrategy.set(this.THEME_KEY, theme, Number.MAX_SAFE_INTEGER)
  }
}