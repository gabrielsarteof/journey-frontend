import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

export type ModuleStatusValue = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'

export class ModuleStatus extends ValueObject<ModuleStatusValue> {
  private static readonly VALID_STATUSES: ModuleStatusValue[] = [
    'LOCKED',
    'AVAILABLE',
    'IN_PROGRESS',
    'COMPLETED'
  ]

  private constructor(value: ModuleStatusValue) {
    super(value)
  }

  static create(value: string): ModuleStatus {
    const upperValue = value.toUpperCase() as ModuleStatusValue

    if (!ModuleStatus.VALID_STATUSES.includes(upperValue)) {
      throw new DomainError(
        `Invalid module status: ${value}`,
        'moduleStatus.value',
        'INVALID_STATUS'
      )
    }

    return new ModuleStatus(upperValue)
  }

  static locked(): ModuleStatus {
    return new ModuleStatus('LOCKED')
  }

  static available(): ModuleStatus {
    return new ModuleStatus('AVAILABLE')
  }

  static inProgress(): ModuleStatus {
    return new ModuleStatus('IN_PROGRESS')
  }

  static completed(): ModuleStatus {
    return new ModuleStatus('COMPLETED')
  }

  protected validate(): void {
    if (!ModuleStatus.VALID_STATUSES.includes(this.value)) {
      throw new DomainError(
        `Invalid module status: ${this.value}`,
        'moduleStatus.value',
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

  equals(other: ModuleStatus): boolean {
    return this.value === other.value
  }
}
