import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

export interface ModuleThemeProps {
  color: string
  gradient?: string[]
}

export class ModuleTheme extends ValueObject<ModuleThemeProps> {
  private static readonly HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

  private constructor(props: ModuleThemeProps) {
    super(props)
  }

  static create(props: ModuleThemeProps): ModuleTheme {
    return new ModuleTheme(props)
  }

  protected validate(): void {
    const { color, gradient } = this.value

    if (!color || !ModuleTheme.HEX_COLOR_REGEX.test(color)) {
      throw new DomainError(
        `Invalid color format: ${color}. Must be hex format (e.g., #8b5cf6)`,
        'moduleTheme.color',
        'INVALID_FORMAT'
      )
    }

    if (gradient) {
      for (const gradientColor of gradient) {
        if (!ModuleTheme.HEX_COLOR_REGEX.test(gradientColor)) {
          throw new DomainError(
            `Invalid gradient color format: ${gradientColor}`,
            'moduleTheme.gradient',
            'INVALID_FORMAT'
          )
        }
      }
    }
  }

  getColor(): string {
    return this.value.color
  }

  getGradient(): string[] | undefined {
    return this.value.gradient
  }

  hasGradient(): boolean {
    return !!this.value.gradient && this.value.gradient.length > 0
  }

  getGradientCSS(): string | undefined {
    if (!this.hasGradient()) return undefined

    const colors = this.value.gradient!.join(', ')
    return `linear-gradient(135deg, ${colors})`
  }

  equals(other: ModuleTheme): boolean {
    return (
      this.value.color === other.value.color &&
      JSON.stringify(this.value.gradient) === JSON.stringify(other.value.gradient)
    )
  }

  toDTO(): ModuleThemeProps {
    return {
      color: this.value.color,
      gradient: this.value.gradient
    }
  }
}
