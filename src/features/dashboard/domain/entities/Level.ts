import { PlanetAsset } from '../value-objects/PlanetAsset'
import { LevelStatus } from '../value-objects/LevelStatus'
import { LevelType } from '../value-objects/LevelType'
import { Challenge } from './Challenge'
import { DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * Level Entity
 *
 * Representa uma sessão individual de prática no sistema de aprendizado.
 * Hierarquia: Module → Unit → Level → Challenge
 *
 * Segue princípios DDD:
 * - Entidade com identidade única
 * - Aggregate Root para seus Challenges
 * - Encapsula regras de negócio de níveis
 * - Invariantes sempre válidas
 *
 * Tipos de Level:
 * - LESSON: Tutorial guiado
 * - PRACTICE: Prática livre
 * - UNIT_REVIEW: Avaliação da unidade
 * - CODE_REVIEW: Revisão de código com IA
 * - SECURITY_AUDIT: Auditoria de segurança
 * - POLICY_CHECK: Validação de conformidade
 * - DEBUG_SECURITY: Correção de problemas de segurança
 * - ADVANCED_CHALLENGE: Cenários complexos
 */

export interface LevelProps {
  id: string
  title: string
  type: LevelType
  status: LevelStatus
  planetAsset: PlanetAsset
  orderIndex: number
  challenges: Challenge[]
  score?: number
  timeSpent?: number
  completedAt?: Date
}

export class Level {
  private readonly _id: string
  private _title: string
  private _type: LevelType
  private _status: LevelStatus
  private _planetAsset: PlanetAsset
  private _orderIndex: number
  private _challenges: Challenge[]
  private _score: number
  private _timeSpent: number
  private _completedAt?: Date

  private constructor(props: LevelProps) {
    this._id = props.id
    this._title = props.title
    this._type = props.type
    this._status = props.status
    this._planetAsset = props.planetAsset
    this._orderIndex = props.orderIndex
    this._challenges = props.challenges
    this._score = props.score ?? 0
    this._timeSpent = props.timeSpent ?? 0
    this._completedAt = props.completedAt

    this.validate()
  }

  /**
   * Factory Method
   */
  static create(props: LevelProps): Level {
    return new Level(props)
  }

  /**
   * Validação de invariantes
   */
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainError('Level ID is required', 'level.id', 'REQUIRED')
    }

    if (!this._title || this._title.trim().length === 0) {
      throw new DomainError('Level title is required', 'level.title', 'REQUIRED')
    }

    if (this._title.length > 200) {
      throw new DomainError('Level title is too long', 'level.title', 'MAX_LENGTH')
    }

    if (this._orderIndex < 0) {
      throw new DomainError('Order index cannot be negative', 'level.orderIndex', 'INVALID_RANGE')
    }

    if (this._score < 0 || this._score > 100) {
      throw new DomainError('Score must be between 0 and 100', 'level.score', 'INVALID_RANGE')
    }

    if (this._timeSpent < 0) {
      throw new DomainError('Time spent cannot be negative', 'level.timeSpent', 'INVALID_RANGE')
    }

    if (!Array.isArray(this._challenges)) {
      throw new DomainError('Challenges must be an array', 'level.challenges', 'INVALID_TYPE')
    }
  }

  /**
   * Getters
   */
  get id(): string {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get type(): LevelType {
    return this._type
  }

  get status(): LevelStatus {
    return this._status
  }

  get planetAsset(): PlanetAsset {
    return this._planetAsset
  }

  get orderIndex(): number {
    return this._orderIndex
  }

  get challenges(): Challenge[] {
    return [...this._challenges]
  }

  get score(): number {
    return this._score
  }

  get timeSpent(): number {
    return this._timeSpent
  }

  get completedAt(): Date | undefined {
    return this._completedAt
  }

  /**
   * Domain Behaviors
   */

  isLocked(): boolean {
    return this._status.isLocked()
  }

  isAvailable(): boolean {
    return this._status.isAvailable()
  }

  isInProgress(): boolean {
    return this._status.isInProgress()
  }

  isCompleted(): boolean {
    return this._status.isCompleted()
  }

  isPerfect(): boolean {
    return this._status.isPerfect()
  }

  canBeStarted(): boolean {
    return this._status.canBeStarted()
  }

  canBePracticed(): boolean {
    return this._status.canBePracticed()
  }

  getTotalChallenges(): number {
    return this._challenges.length
  }

  getCompletedChallenges(): number {
    return this._challenges.filter(c => c.isCompleted()).length
  }

  getProgressPercentage(): number {
    const total = this.getTotalChallenges()
    if (total === 0) return 0
    return Math.round((this.getCompletedChallenges() / total) * 100)
  }

  hasAllChallengesCompleted(): boolean {
    return this.getTotalChallenges() > 0 &&
           this.getCompletedChallenges() === this.getTotalChallenges()
  }

  getNextAvailableChallenge(): Challenge | undefined {
    return this._challenges.find(c => c.isAvailable() && !c.isCompleted())
  }

  getChallengeById(id: string): Challenge | undefined {
    return this._challenges.find(c => c.id === id)
  }

  /**
   * Métodos de mutação
   */

  unlock(): void {
    if (!this._status.isLocked()) {
      throw new DomainError('Level is not locked', 'level.status', 'INVALID_OPERATION')
    }

    const newStatus = LevelStatus.available()
    if (!this._status.canTransitionTo(newStatus)) {
      throw new DomainError('Cannot unlock level', 'level.status', 'INVALID_TRANSITION')
    }

    this._status = newStatus
  }

  start(): void {
    if (!this.canBeStarted()) {
      throw new DomainError('Level cannot be started', 'level.status', 'INVALID_OPERATION')
    }

    this._status = LevelStatus.inProgress()
  }

  complete(score: number, timeSpent?: number): void {
    if (score < 0 || score > 100) {
      throw new DomainError('Score must be between 0 and 100', 'level.score', 'INVALID_RANGE')
    }

    this._score = score
    if (timeSpent !== undefined) {
      this._timeSpent = timeSpent
    }
    this._completedAt = new Date()

    // Se score é 100%, marca como PERFECT, senão COMPLETED
    this._status = score === 100 ? LevelStatus.perfect() : LevelStatus.completed()
  }

  updatePlanetAsset(newAsset: PlanetAsset): void {
    if (!newAsset) {
      throw new DomainError('Planet asset is required', 'level.planetAsset', 'REQUIRED')
    }

    this._planetAsset = newAsset
  }

  addChallenge(challenge: Challenge): void {
    if (!challenge) {
      throw new DomainError('Challenge is required', 'level.challenge', 'REQUIRED')
    }

    const exists = this._challenges.some(c => c.id === challenge.id)
    if (exists) {
      throw new DomainError('Challenge already exists in level', 'level.challenge', 'DUPLICATE')
    }

    this._challenges.push(challenge)
  }

  /**
   * Equality
   */
  equals(other: Level): boolean {
    return this._id === other._id
  }

  /**
   * DTO Conversion
   */
  toDTO(): LevelDTO {
    return {
      id: this._id,
      title: this._title,
      type: this._type.getValue(),
      status: this._status.getValue(),
      planetAsset: this._planetAsset.toDTO(),
      orderIndex: this._orderIndex,
      score: this._score,
      timeSpent: this._timeSpent,
      completedAt: this._completedAt?.toISOString(),
      totalChallenges: this.getTotalChallenges(),
      completedChallenges: this.getCompletedChallenges(),
      progressPercentage: this.getProgressPercentage(),
      challenges: this._challenges.map(c => c.toDTO())
    }
  }

  /**
   * Clone
   */
  clone(): Level {
    return Level.create({
      id: this._id,
      title: this._title,
      type: this._type,
      status: this._status,
      planetAsset: this._planetAsset,
      orderIndex: this._orderIndex,
      challenges: this._challenges.map(c => c.clone()),
      score: this._score,
      timeSpent: this._timeSpent,
      completedAt: this._completedAt
    })
  }
}

/**
 * DTO para transferência de dados
 */
export interface LevelDTO {
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
  score: number
  timeSpent: number
  completedAt?: string
  totalChallenges: number
  completedChallenges: number
  progressPercentage: number
  challenges: any[]
}
