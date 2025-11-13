import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * PlanetAsset Value Object
 *
 * Representa um asset visual de planeta no contexto do domínio de aprendizado.
 * Segue princípios de DDD:
 * - Imutável (ValueObject)
 * - Auto-validável
 * - Encapsula regras de negócio sobre assets
 * - Usa IDs abstratos seguindo Design Tokens Pattern
 *
 * @example
 * const asset = PlanetAsset.create({
 *   name: 'planet-01',
 *   path: '/planets/planet-01.png',
 *   altText: 'Small red rocky planet'
 * })
 */

export interface PlanetAssetProps {
  name: string
  path: string
  variant?: number
  altText?: string
}

export class PlanetAsset extends ValueObject<PlanetAssetProps> {
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
   *
   * Aceita IDs abstratos (planet-01, planet-02, etc.) seguindo Design Tokens Pattern
   */
  protected validate(): void {
    const { name, path, variant } = this.value

    if (!name || name.trim().length === 0) {
      throw new DomainError('Asset ID is required', 'planetAsset.name', 'REQUIRED')
    }

    // Valida formato de ID abstrato: planet-01 até planet-10
    const validAssetIdPattern = /^planet-(0[1-9]|10)$/
    if (!validAssetIdPattern.test(name)) {
      throw new DomainError(
        `Invalid asset ID: ${name}. Must match pattern: planet-01 to planet-10`,
        'planetAsset.name',
        'INVALID_ASSET_ID'
      )
    }

    if (!path || path.trim().length === 0) {
      throw new DomainError('Asset path is required', 'planetAsset.path', 'REQUIRED')
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
    // Para IDs abstratos, usa o próprio ID como base
    const assetId = this.value.name.toUpperCase()
    const variantText = this.value.variant ? ` - Variant ${this.value.variant}` : ''
    return `${assetId}${variantText}`
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
   * Type guard para verificar se é um asset específico
   */
  isAssetId(assetId: string): boolean {
    return this.value.name === assetId
  }
}
