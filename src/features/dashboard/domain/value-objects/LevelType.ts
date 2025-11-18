import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * LevelType Value Object
 *
 * Representa o tipo de um nível no sistema de aprendizado.
 * Alinhado com o backend: tipos focados em AI Governance e Segurança
 *
 * Tipos possíveis:
 * - LESSON: Tutorial guiado
 * - PRACTICE: Prática livre
 * - UNIT_REVIEW: Avaliação da unidade
 * - CODE_REVIEW: Revisão de código com IA
 * - SECURITY_AUDIT: Auditoria de segurança
 * - POLICY_CHECK: Validação de conformidade
 * - DEBUG_SECURITY: Correção de problemas de segurança
 * - ADVANCED_CHALLENGE: Cenários complexos
 */

export type LevelTypeValue =
  | 'LESSON'
  | 'PRACTICE'
  | 'UNIT_REVIEW'
  | 'CODE_REVIEW'
  | 'SECURITY_AUDIT'
  | 'POLICY_CHECK'
  | 'DEBUG_SECURITY'
  | 'ADVANCED_CHALLENGE'

export class LevelType extends ValueObject<LevelTypeValue> {
  private static readonly VALID_TYPES: LevelTypeValue[] = [
    'LESSON',
    'PRACTICE',
    'UNIT_REVIEW',
    'CODE_REVIEW',
    'SECURITY_AUDIT',
    'POLICY_CHECK',
    'DEBUG_SECURITY',
    'ADVANCED_CHALLENGE'
  ]

  private constructor(value: LevelTypeValue) {
    super(value)
  }

  static create(value: string): LevelType {
    const upperValue = value.toUpperCase() as LevelTypeValue

    if (!LevelType.VALID_TYPES.includes(upperValue)) {
      throw new DomainError(
        `Invalid level type: ${value}`,
        'levelType.value',
        'INVALID_TYPE'
      )
    }

    return new LevelType(upperValue)
  }

  // Factory methods para cada tipo
  static lesson(): LevelType {
    return new LevelType('LESSON')
  }

  static practice(): LevelType {
    return new LevelType('PRACTICE')
  }

  static unitReview(): LevelType {
    return new LevelType('UNIT_REVIEW')
  }

  static codeReview(): LevelType {
    return new LevelType('CODE_REVIEW')
  }

  static securityAudit(): LevelType {
    return new LevelType('SECURITY_AUDIT')
  }

  static policyCheck(): LevelType {
    return new LevelType('POLICY_CHECK')
  }

  static debugSecurity(): LevelType {
    return new LevelType('DEBUG_SECURITY')
  }

  static advancedChallenge(): LevelType {
    return new LevelType('ADVANCED_CHALLENGE')
  }

  protected validate(): void {
    if (!LevelType.VALID_TYPES.includes(this.value)) {
      throw new DomainError(
        `Invalid level type: ${this.value}`,
        'levelType.value',
        'INVALID_TYPE'
      )
    }
  }

  // Domain behaviors
  isLesson(): boolean {
    return this.value === 'LESSON'
  }

  isPractice(): boolean {
    return this.value === 'PRACTICE'
  }

  isReview(): boolean {
    return this.value === 'UNIT_REVIEW' || this.value === 'CODE_REVIEW'
  }

  isSecurityFocused(): boolean {
    return (
      this.value === 'SECURITY_AUDIT' ||
      this.value === 'POLICY_CHECK' ||
      this.value === 'DEBUG_SECURITY'
    )
  }

  isAdvanced(): boolean {
    return this.value === 'ADVANCED_CHALLENGE'
  }

  /**
   * Retorna um label humanizado para o tipo
   */
  getLabel(): string {
    const labels: Record<LevelTypeValue, string> = {
      LESSON: 'Tutorial',
      PRACTICE: 'Prática',
      UNIT_REVIEW: 'Avaliação',
      CODE_REVIEW: 'Code Review',
      SECURITY_AUDIT: 'Auditoria de Segurança',
      POLICY_CHECK: 'Checagem de Políticas',
      DEBUG_SECURITY: 'Debug de Segurança',
      ADVANCED_CHALLENGE: 'Desafio Avançado'
    }

    return labels[this.value]
  }

  /**
   * Retorna um emoji/ícone sugerido para o tipo
   */
  getIcon(): string {
    const icons: Record<LevelTypeValue, string> = {
      LESSON: '📚',
      PRACTICE: '💪',
      UNIT_REVIEW: '✅',
      CODE_REVIEW: '🔍',
      SECURITY_AUDIT: '🔒',
      POLICY_CHECK: '📋',
      DEBUG_SECURITY: '🐛',
      ADVANCED_CHALLENGE: '🏆'
    }

    return icons[this.value]
  }

  equals(other: LevelType): boolean {
    return this.value === other.value
  }
}
