import { PlanetAsset } from '../value-objects/PlanetAsset'
import { ChallengeStatus } from '../value-objects/ChallengeStatus'
import { ChallengeType } from '../value-objects/ChallengeType'
import { DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * Challenge Entity (Aggregate Root)
 *
 * Representa um desafio/lição no sistema de aprendizado espacial.
 * Segue princípios DDD:
 * - Entidade com identidade única
 * - Aggregate Root que gerencia seus Value Objects
 * - Encapsula regras de negócio
 * - Invariantes sempre válidas
 *
 * Princípios SOLID aplicados:
 * - SRP: Responsável apenas por lógica de desafio
 * - OCP: Extensível via composição de Value Objects
 * - LSP: Pode ser substituído por subclasses
 * - ISP: Interface mínima necessária
 * - DIP: Depende de abstrações (Value Objects)
 */

export interface ChallengeProps {
  id: string
  title: string
  type: ChallengeType
  status: ChallengeStatus
  planetAsset: PlanetAsset
  orderIndex?: number
  points?: number
  completedStars?: number
  maxStars?: number
}

export class Challenge {
  private readonly _id: string
  private _title: string
  private _type: ChallengeType
  private _status: ChallengeStatus
  private _planetAsset: PlanetAsset
  private _orderIndex: number
  private _points: number
  private _completedStars: number
  private readonly _maxStars: number

  private constructor(props: ChallengeProps) {
    this._id = props.id
    this._title = props.title
    this._type = props.type
    this._status = props.status
    this._planetAsset = props.planetAsset
    this._orderIndex = props.orderIndex ?? 0
    this._points = props.points ?? 0
    this._completedStars = props.completedStars ?? 0
    this._maxStars = props.maxStars ?? 3

    this.validate()
  }

  /**
   * Factory Method - Princípio: Encapsulamento da criação
   */
  static create(props: ChallengeProps): Challenge {
    return new Challenge(props)
  }

  /**
   * Validação de invariantes da entidade
   * Garante que a entidade sempre esteja em estado válido
   */
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainError('Challenge ID is required', 'challenge.id', 'REQUIRED')
    }

    if (!this._title || this._title.trim().length === 0) {
      throw new DomainError('Challenge title is required', 'challenge.title', 'REQUIRED')
    }

    if (this._title.length > 100) {
      throw new DomainError('Challenge title is too long', 'challenge.title', 'MAX_LENGTH')
    }

    if (this._orderIndex < 0) {
      throw new DomainError('Order index cannot be negative', 'challenge.orderIndex', 'INVALID_RANGE')
    }

    if (this._points < 0) {
      throw new DomainError('Points cannot be negative', 'challenge.points', 'INVALID_RANGE')
    }

    if (this._completedStars < 0 || this._completedStars > this._maxStars) {
      throw new DomainError(
        `Completed stars must be between 0 and ${this._maxStars}`,
        'challenge.completedStars',
        'INVALID_RANGE'
      )
    }
  }

  /**
   * Getters - Princípio: Information Hiding
   */
  get id(): string {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get type(): ChallengeType {
    return this._type
  }

  get status(): ChallengeStatus {
    return this._status
  }

  get planetAsset(): PlanetAsset {
    return this._planetAsset
  }

  get orderIndex(): number {
    return this._orderIndex
  }

  get points(): number {
    return this._points
  }

  get completedStars(): number {
    return this._completedStars
  }

  get maxStars(): number {
    return this._maxStars
  }

  /**
   * Domain Behaviors - Lógica de negócio encapsulada
   */

  isLocked(): boolean {
    return this._status.isLocked()
  }

  isAvailable(): boolean {
    return this._status.isAvailable()
  }

  isCompleted(): boolean {
    return this._status.isCompleted()
  }

  canBeStarted(): boolean {
    return this._status.canBeStarted()
  }

  hasFullStars(): boolean {
    return this._completedStars === this._maxStars
  }

  getStarProgress(): { completed: number; total: number; percentage: number } {
    return {
      completed: this._completedStars,
      total: this._maxStars,
      percentage: (this._completedStars / this._maxStars) * 100
    }
  }

  /**
   * Métodos de mutação - sempre validam invariantes
   * Princípio: Consistência transacional
   */

  unlock(): void {
    if (!this._status.isLocked()) {
      throw new DomainError('Challenge is not locked', 'challenge.status', 'INVALID_OPERATION')
    }

    const newStatus = ChallengeStatus.available()
    if (!this._status.canTransitionTo(newStatus)) {
      throw new DomainError('Cannot unlock challenge', 'challenge.status', 'INVALID_TRANSITION')
    }

    this._status = newStatus
  }

  start(): void {
    if (!this.canBeStarted()) {
      throw new DomainError('Challenge cannot be started', 'challenge.status', 'INVALID_OPERATION')
    }

    this._status = ChallengeStatus.inProgress()
  }

  complete(stars: number = this._maxStars): void {
    if (stars < 0 || stars > this._maxStars) {
      throw new DomainError(
        `Stars must be between 0 and ${this._maxStars}`,
        'challenge.stars',
        'INVALID_RANGE'
      )
    }

    this._completedStars = stars
    this._status = ChallengeStatus.completed()
  }

  updatePlanetAsset(newAsset: PlanetAsset): void {
    if (!newAsset) {
      throw new DomainError('Planet asset is required', 'challenge.planetAsset', 'REQUIRED')
    }

    this._planetAsset = newAsset
  }

  /**
   * Equality comparison - Entidades são comparadas por ID
   */
  equals(other: Challenge): boolean {
    return this._id === other._id
  }

  /**
   * Serialização para DTO (Data Transfer Object)
   * Princípio: Separation of Concerns
   */
  toDTO(): ChallengeDTO {
    return {
      id: this._id,
      title: this._title,
      type: this._type.getValue(),
      status: this._status.getValue(),
      planetAsset: this._planetAsset.toDTO(),
      orderIndex: this._orderIndex,
      points: this._points,
      completedStars: this._completedStars,
      maxStars: this._maxStars
    }
  }

  /**
   * Clone - útil para testes e cenários imutáveis
   */
  clone(): Challenge {
    return Challenge.create({
      id: this._id,
      title: this._title,
      type: this._type,
      status: this._status,
      planetAsset: this._planetAsset,
      orderIndex: this._orderIndex,
      points: this._points,
      completedStars: this._completedStars,
      maxStars: this._maxStars
    })
  }
}

/**
 * DTO para transferência de dados
 * Separado da entidade para evitar vazamento de abstrações
 */
export interface ChallengeDTO {
  id: string
  title: string
  type: string
  status: string
  planetAsset: {
    name: string
    path: string
    variant?: number
    altText?: string
  }
  orderIndex: number
  points: number
  completedStars: number
  maxStars: number
}
