import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * Category Value Object
 *
 * Representa as categorias de desafios disponíveis no sistema.
 * Alinhado com o backend (Category enum).
 *
 * Mapeamento temático espacial:
 * - BACKEND: Núcleo da Nebulosa
 * - FRONTEND: Cosmos da Interface
 * - FULLSTACK: Galáxia Full Stack
 * - DEVOPS: Sistema DevOps
 * - MOBILE: Aglomerado Móvel
 * - DATA: Galáxia dos Dados
 */

export type CategoryValue = 'BACKEND' | 'FRONTEND' | 'FULLSTACK' | 'DEVOPS' | 'MOBILE' | 'DATA'

export class Category extends ValueObject<CategoryValue> {
  private static readonly VALID_CATEGORIES: ReadonlyArray<CategoryValue> = [
    'BACKEND',
    'FRONTEND',
    'FULLSTACK',
    'DEVOPS',
    'MOBILE',
    'DATA'
  ] as const

  private constructor(category: CategoryValue) {
    super(category)
  }

  static create(category: CategoryValue): Category {
    return new Category(category)
  }

  // Factory methods
  static backend(): Category {
    return new Category('BACKEND')
  }

  static frontend(): Category {
    return new Category('FRONTEND')
  }

  static fullstack(): Category {
    return new Category('FULLSTACK')
  }

  static devops(): Category {
    return new Category('DEVOPS')
  }

  static mobile(): Category {
    return new Category('MOBILE')
  }

  static data(): Category {
    return new Category('DATA')
  }

  protected validate(): void {
    if (!Category.VALID_CATEGORIES.includes(this.value)) {
      throw new DomainError(
        'Categoria inválida',
        'category',
        'INVALID_CATEGORY'
      )
    }
  }

  // Type guards
  isBackend(): boolean {
    return this.value === 'BACKEND'
  }

  isFrontend(): boolean {
    return this.value === 'FRONTEND'
  }

  isFullstack(): boolean {
    return this.value === 'FULLSTACK'
  }

  isDevOps(): boolean {
    return this.value === 'DEVOPS'
  }

  isMobile(): boolean {
    return this.value === 'MOBILE'
  }

  isData(): boolean {
    return this.value === 'DATA'
  }

  /**
   * Retorna o nome temático espacial do módulo
   */
  getModuleThemeName(): string {
    const themeNames: Record<CategoryValue, string> = {
      BACKEND: 'Núcleo da Nebulosa',
      FRONTEND: 'Cosmos da Interface',
      FULLSTACK: 'Galáxia Full Stack',
      DEVOPS: 'Sistema DevOps',
      MOBILE: 'Aglomerado Móvel',
      DATA: 'Galáxia dos Dados'
    }
    return themeNames[this.value]
  }

  /**
   * Retorna o índice de ordem do módulo
   */
  getModuleOrder(): number {
    const orders: Record<CategoryValue, number> = {
      BACKEND: 1,
      FRONTEND: 2,
      DEVOPS: 3,
      MOBILE: 4,
      DATA: 5,
      FULLSTACK: 6
    }
    return orders[this.value]
  }

  /**
   * Retorna a descrição do módulo
   */
  getModuleDescription(): string {
    const descriptions: Record<CategoryValue, string> = {
      BACKEND: 'Fundamentos Backend',
      FRONTEND: 'Interfaces e Experiência',
      FULLSTACK: 'Desenvolvimento Completo',
      DEVOPS: 'Infraestrutura e CI/CD',
      MOBILE: 'Aplicações Móveis',
      DATA: 'Análise e Processamento'
    }
    return descriptions[this.value]
  }

  /**
   * Retorna o slug da categoria para uso em classes CSS
   */
  getSlug(): string {
    return this.value.toLowerCase()
  }

  /**
   * Retorna o ícone emoji da categoria
   */
  getIcon(): string {
    const icons: Record<CategoryValue, string> = {
      BACKEND: '⚙️',
      FRONTEND: '🎨',
      FULLSTACK: '🌐',
      DEVOPS: '🚀',
      MOBILE: '📱',
      DATA: '📊'
    }
    return icons[this.value]
  }

  equals(other: Category): boolean {
    return this.value === other.value
  }
}
