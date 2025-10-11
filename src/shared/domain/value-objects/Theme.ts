export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export class Theme {
  private readonly mode: ThemeMode
  private readonly resolvedTheme: ResolvedTheme

  constructor(mode: ThemeMode, resolvedTheme: ResolvedTheme) {
    this.mode = mode
    this.resolvedTheme = resolvedTheme
  }

  get value(): ThemeMode {
    return this.mode
  }

  get resolved(): ResolvedTheme {
    return this.resolvedTheme
  }

  // Strategy pattern: cada modo tem sua estratégia de resolução
  static resolve(mode: ThemeMode): Theme {
    const resolvedTheme = mode === 'system'
      ? Theme.getSystemTheme()
      : mode as ResolvedTheme

    return new Theme(mode, resolvedTheme)
  }

  private static getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light'

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  equals(other: Theme): boolean {
    return this.mode === other.mode && this.resolvedTheme === other.resolvedTheme
  }
}