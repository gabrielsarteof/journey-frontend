import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * ChallengeType Value Object
 *
 * Representa o tipo de desafio/atividade no sistema de aprendizado.
 * Cada tipo pode ter comportamentos e regras específicas.
 *
 * Tipos disponíveis:
 * - lesson: Aula teórica/conceitual
 * - practice: Prática de codificação do zero
 * - story: História/contexto do desafio
 * - review: Revisão de múltiplos conceitos
 * - debug: Encontrar e corrigir bugs no código
 * - refactor: Refatorar código existente
 * - code-review: Revisar código e identificar problemas
 * - architecture: Desafios de design de arquitetura
 */

export type ChallengeTypeValue =
  | 'lesson'
  | 'practice'
  | 'story'
  | 'review'
  | 'debug'
  | 'refactor'
  | 'code-review'
  | 'architecture'

export class ChallengeType extends ValueObject<ChallengeTypeValue> {
  private static readonly VALID_TYPES: ReadonlyArray<ChallengeTypeValue> = [
    'lesson',
    'practice',
    'story',
    'review',
    'debug',
    'refactor',
    'code-review',
    'architecture'
  ] as const

  private constructor(type: ChallengeTypeValue) {
    super(type)
  }

  static create(type: ChallengeTypeValue): ChallengeType {
    return new ChallengeType(type)
  }

  // Factory methods
  static lesson(): ChallengeType {
    return new ChallengeType('lesson')
  }

  static practice(): ChallengeType {
    return new ChallengeType('practice')
  }

  static story(): ChallengeType {
    return new ChallengeType('story')
  }

  static review(): ChallengeType {
    return new ChallengeType('review')
  }

  static debug(): ChallengeType {
    return new ChallengeType('debug')
  }

  static refactor(): ChallengeType {
    return new ChallengeType('refactor')
  }

  static codeReview(): ChallengeType {
    return new ChallengeType('code-review')
  }

  static architecture(): ChallengeType {
    return new ChallengeType('architecture')
  }

  protected validate(): void {
    if (!ChallengeType.VALID_TYPES.includes(this.value)) {
      throw new DomainError(
        'Tipo de desafio inválido',
        'challengeType',
        'INVALID_TYPE'
      )
    }
  }

  // Type guards
  isLesson(): boolean {
    return this.value === 'lesson'
  }

  isPractice(): boolean {
    return this.value === 'practice'
  }

  isStory(): boolean {
    return this.value === 'story'
  }

  isReview(): boolean {
    return this.value === 'review'
  }

  isDebug(): boolean {
    return this.value === 'debug'
  }

  isRefactor(): boolean {
    return this.value === 'refactor'
  }

  isCodeReview(): boolean {
    return this.value === 'code-review'
  }

  isArchitecture(): boolean {
    return this.value === 'architecture'
  }

  /**
   * Domain behaviors - podem ser expandidos conforme regras de negócio
   */
  requiresCompletion(): boolean {
    return this.isLesson() || this.isPractice() || this.isDebug() || this.isRefactor()
  }

  isOptional(): boolean {
    return this.isStory()
  }

  canBeRepeated(): boolean {
    return this.isPractice() || this.isReview() || this.isDebug() || this.isRefactor()
  }

  requiresStarterCode(): boolean {
    return this.isDebug() || this.isRefactor() || this.isCodeReview()
  }

  getDisplayIcon(): string {
    const icons: Record<ChallengeTypeValue, string> = {
      lesson: '⭐',
      practice: '💪',
      story: '📖',
      review: '📝',
      debug: '🐛',
      refactor: '🔧',
      'code-review': '👁️',
      architecture: '🏗️'
    }
    return icons[this.value]
  }

  getDisplayName(): string {
    const names: Record<ChallengeTypeValue, string> = {
      lesson: 'Aula',
      practice: 'Prática',
      story: 'História',
      review: 'Revisão',
      debug: 'Debug',
      refactor: 'Refatoração',
      'code-review': 'Code Review',
      architecture: 'Arquitetura'
    }
    return names[this.value]
  }

  equals(other: ChallengeType): boolean {
    return this.value === other.value
  }
}
