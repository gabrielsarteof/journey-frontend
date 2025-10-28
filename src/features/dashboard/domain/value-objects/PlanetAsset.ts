import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * PlanetAsset Value Object
 *
 * Representa um asset visual de planeta no contexto do domínio de aprendizado.
 * Segue princípios de DDD:
 * - Imutável (ValueObject)
 * - Auto-validável
 * - Encapsula regras de negócio sobre assets
 *
 * @example
 * const asset = PlanetAsset.create({
 *   name: 'mercury',
 *   path: '/planets/planet-mercury-01.png',
 *   variant: 1
 * })
 */

export interface PlanetAssetProps {
  name: string
  path: string
  variant?: number
  altText?: string
}

export class PlanetAsset extends ValueObject<PlanetAssetProps> {
  private static readonly VALID_PLANET_NAMES = [
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune',
    'moon',
    'unknown'
  ] as const

  private static readonly SUPPORTED_FORMATS = ['.png', '.jpg', '.svg', '.webp'] as const

  private constructor(props: PlanetAssetProps) {
    super(props)
  }

  /**
   * Factory method - Princípio: SRP (Single Responsibility)
   * Centraliza a criação e validação do Value Object
   */
  static create(props: PlanetAssetProps): PlanetAsset {
    return new PlanetAsset(props)
  }

  /**
   * Validação de invariantes do domínio
   * Princípio: Fail Fast - valida na criação
   */
  protected validate(): void {
    const { name, path, variant } = this.value

    if (!name || name.trim().length === 0) {
      throw new DomainError('Planet name is required', 'planetAsset.name', 'REQUIRED')
    }

    if (!PlanetAsset.VALID_PLANET_NAMES.includes(name.toLowerCase() as any)) {
      throw new DomainError(
        `Invalid planet name: ${name}. Must be one of: ${PlanetAsset.VALID_PLANET_NAMES.join(', ')}`,
        'planetAsset.name',
        'INVALID_PLANET'
      )
    }

    if (!path || path.trim().length === 0) {
      throw new DomainError('Asset path is required', 'planetAsset.path', 'REQUIRED')
    }

    const hasValidFormat = PlanetAsset.SUPPORTED_FORMATS.some(format => path.endsWith(format))
    if (!hasValidFormat) {
      throw new DomainError(
        `Unsupported asset format. Supported: ${PlanetAsset.SUPPORTED_FORMATS.join(', ')}`,
        'planetAsset.path',
        'INVALID_FORMAT'
      )
    }

    if (variant !== undefined && (variant < 1 || variant > 99)) {
      throw new DomainError(
        'Variant must be between 1 and 99',
        'planetAsset.variant',
        'INVALID_RANGE'
      )
    }
  }

  /**
   * Getters - Princípio: Information Hiding
   * Acesso controlado às propriedades
   */
  get name(): string {
    return this.value.name
  }

  get path(): string {
    return this.value.path
  }

  get variant(): number | undefined {
    return this.value.variant
  }

  get altText(): string {
    return this.value.altText || this.generateDefaultAltText()
  }

  /**
   * Domain logic - comportamento relacionado ao asset
   */
  private generateDefaultAltText(): string {
    const planetName = this.value.name.charAt(0).toUpperCase() + this.value.name.slice(1)
    const variantText = this.value.variant ? ` - Variant ${this.value.variant}` : ''
    return `${planetName} Planet${variantText}`
  }

  /**
   * Equality comparison - ValueObjects são comparados por valor
   */
  equals(other: PlanetAsset): boolean {
    return (
      this.value.name === other.value.name &&
      this.value.path === other.value.path &&
      this.value.variant === other.value.variant
    )
  }

  /**
   * Convenience method para obter representação completa
   */
  toDTO(): PlanetAssetProps {
    return {
      name: this.name,
      path: this.path,
      variant: this.variant,
      altText: this.altText
    }
  }

  /**
   * Type guard para type safety
   */
  isPlanet(planetName: typeof PlanetAsset.VALID_PLANET_NAMES[number]): boolean {
    return this.value.name.toLowerCase() === planetName
  }
}
