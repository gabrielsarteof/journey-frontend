import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * UnitStatus Value Object
 *
 * Representa o status de uma unidade no sistema de aprendizado.
 * Alinhado com o backend: LOCKED | AVAILABLE | IN_PROGRESS | COMPLETED
 *
 * Estados possíveis:
 * - LOCKED: Unidade bloqueada (pré-requisitos não completados)
 * - AVAILABLE: Unidade disponível para começar
 * - IN_PROGRESS: Unidade em andamento
 * - COMPLETED: Unidade completada com sucesso
 */

export type UnitStatusValue = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'

export class UnitStatus extends ValueObject<UnitStatusValue> {
  private static readonly VALID_STATUSES: UnitStatusValue[] = [
    'LOCKED',
    'AVAILABLE',
    'IN_PROGRESS',
    'COMPLETED'
  ]

  private constructor(value: UnitStatusValue) {
    super(value)
  }

  static create(value: string): UnitStatus {
    const upperValue = value.toUpperCase() as UnitStatusValue

    if (!UnitStatus.VALID_STATUSES.includes(upperValue)) {
      throw new DomainError(
        `Invalid unit status: ${value}`,
        'unitStatus.value',
        'INVALID_STATUS'
      )
    }

    return new UnitStatus(upperValue)
  }

  static locked(): UnitStatus {
    return new UnitStatus('LOCKED')
  }

  static available(): UnitStatus {
    return new UnitStatus('AVAILABLE')
  }

  static inProgress(): UnitStatus {
    return new UnitStatus('IN_PROGRESS')
  }

  static completed(): UnitStatus {
    return new UnitStatus('COMPLETED')
  }

  protected validate(): void {
    if (!UnitStatus.VALID_STATUSES.includes(this.value)) {
      throw new DomainError(
        `Invalid unit status: ${this.value}`,
        'unitStatus.value',
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
    return this.value === 'COMPLETED'
  }

  canBeStarted(): boolean {
    return this.isAvailable() || this.isInProgress()
  }

  /**
   * Validação de transição de estados
   */
  canTransitionTo(newStatus: UnitStatus): boolean {
    const validTransitions: Record<UnitStatusValue, UnitStatusValue[]> = {
      LOCKED: ['AVAILABLE'],
      AVAILABLE: ['IN_PROGRESS', 'LOCKED'],
      IN_PROGRESS: ['COMPLETED', 'AVAILABLE'],
      COMPLETED: [] // Completed é estado final
    }

    return validTransitions[this.value].includes(newStatus.value)
  }

  equals(other: UnitStatus): boolean {
    return this.value === other.value
  }
}
