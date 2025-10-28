import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * ChallengeStatus Value Object
 *
 * Representa o status de um desafio no sistema de aprendizado.
 * Encapsula regras de transição de estados e comportamentos relacionados.
 *
 * Estados possíveis:
 * - LOCKED: Desafio bloqueado (pré-requisitos não completados)
 * - AVAILABLE: Desafio disponível para começar
 * - IN_PROGRESS: Desafio em andamento
 * - COMPLETED: Desafio completado com sucesso
 */

export type ChallengeStatusType = 'locked' | 'available' | 'in_progress' | 'completed'

export class ChallengeStatus extends ValueObject<ChallengeStatusType> {
  private static readonly VALID_STATUSES: ReadonlyArray<ChallengeStatusType> = [
    'locked',
    'available',
    'in_progress',
    'completed'
  ] as const

  private constructor(status: ChallengeStatusType) {
    super(status)
  }

  static create(status: ChallengeStatusType): ChallengeStatus {
    return new ChallengeStatus(status)
  }

  // Factory methods para cada status - Type Safety
  static locked(): ChallengeStatus {
    return new ChallengeStatus('locked')
  }

  static available(): ChallengeStatus {
    return new ChallengeStatus('available')
  }

  static inProgress(): ChallengeStatus {
    return new ChallengeStatus('in_progress')
  }

  static completed(): ChallengeStatus {
    return new ChallengeStatus('completed')
  }

  protected validate(): void {
    if (!ChallengeStatus.VALID_STATUSES.includes(this.value)) {
      throw new DomainError(
        `Invalid challenge status: ${this.value}`,
        'challengeStatus',
        'INVALID_STATUS'
      )
    }
  }

  // Domain behaviors - Regras de negócio encapsuladas
  isLocked(): boolean {
    return this.value === 'locked'
  }

  isAvailable(): boolean {
    return this.value === 'available'
  }

  isInProgress(): boolean {
    return this.value === 'in_progress'
  }

  isCompleted(): boolean {
    return this.value === 'completed'
  }

  canBeStarted(): boolean {
    return this.isAvailable()
  }

  canBeContinued(): boolean {
    return this.isInProgress()
  }

  isInteractive(): boolean {
    return this.isAvailable() || this.isInProgress()
  }

  /**
   * Validação de transição de estados
   * Princípio: Encapsulamento de lógica de negócio
   */
  canTransitionTo(newStatus: ChallengeStatus): boolean {
    const validTransitions: Record<ChallengeStatusType, ChallengeStatusType[]> = {
      locked: ['available'],
      available: ['in_progress', 'locked'],
      in_progress: ['completed', 'available'],
      completed: [] // Completed é estado final
    }

    return validTransitions[this.value].includes(newStatus.value)
  }

  equals(other: ChallengeStatus): boolean {
    return this.value === other.value
  }
}
