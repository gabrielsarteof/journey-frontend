import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * LevelStatus Value Object
 *
 * Representa o status de um nível no sistema de aprendizado.
 * Alinhado com o backend: LOCKED | AVAILABLE | IN_PROGRESS | COMPLETED | PERFECT
 *
 * Estados possíveis:
 * - LOCKED: Nível bloqueado (pré-requisitos não completados)
 * - AVAILABLE: Nível disponível para começar
 * - IN_PROGRESS: Nível em andamento
 * - COMPLETED: Nível completado
 * - PERFECT: Nível completado com pontuação 100% (único para níveis)
 */

export type LevelStatusValue = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'PERFECT'

export class LevelStatus extends ValueObject<LevelStatusValue> {
  private static readonly VALID_STATUSES: LevelStatusValue[] = [
    'LOCKED',
    'AVAILABLE',
    'IN_PROGRESS',
    'COMPLETED',
    'PERFECT'
  ]

  private constructor(value: LevelStatusValue) {
    super(value)
  }

  static create(value: string): LevelStatus {
    const upperValue = value.toUpperCase() as LevelStatusValue

    if (!LevelStatus.VALID_STATUSES.includes(upperValue)) {
      throw new DomainError(
        `Invalid level status: ${value}`,
        'levelStatus.value',
        'INVALID_STATUS'
      )
    }

    return new LevelStatus(upperValue)
  }

  static locked(): LevelStatus {
    return new LevelStatus('LOCKED')
  }

  static available(): LevelStatus {
    return new LevelStatus('AVAILABLE')
  }

  static inProgress(): LevelStatus {
    return new LevelStatus('IN_PROGRESS')
  }

  static completed(): LevelStatus {
    return new LevelStatus('COMPLETED')
  }

  static perfect(): LevelStatus {
    return new LevelStatus('PERFECT')
  }

  protected validate(): void {
    if (!LevelStatus.VALID_STATUSES.includes(this.value)) {
      throw new DomainError(
        `Invalid level status: ${this.value}`,
        'levelStatus.value',
        'INVALID_STATUS'
      )
    }
  }

  isLocked(): boolean {
    return this.value === 'LOCKED'
  }

  isAvailable(): boolean {
    return this.value === 'AVAILABLE'
  }

  isInProgress(): boolean {
    return this.value === 'IN_PROGRESS'
  }

  isCompleted(): boolean {
    return this.value === 'COMPLETED' || this.value === 'PERFECT'
  }

  isPerfect(): boolean {
    return this.value === 'PERFECT'
  }

  canBeStarted(): boolean {
    return this.isAvailable() || this.isInProgress()
  }

  canBePracticed(): boolean {
    return this.isCompleted()
  }

  /**
   * Validação de transição de estados
   */
  canTransitionTo(newStatus: LevelStatus): boolean {
    const validTransitions: Record<LevelStatusValue, LevelStatusValue[]> = {
      LOCKED: ['AVAILABLE'],
      AVAILABLE: ['IN_PROGRESS', 'LOCKED'],
      IN_PROGRESS: ['COMPLETED', 'PERFECT', 'AVAILABLE'],
      COMPLETED: ['PERFECT', 'IN_PROGRESS'], // Pode melhorar para PERFECT ou refazer
      PERFECT: ['IN_PROGRESS'] // Pode refazer
    }

    return validTransitions[this.value].includes(newStatus.value)
  }

  equals(other: LevelStatus): boolean {
    return this.value === other.value
  }
}
