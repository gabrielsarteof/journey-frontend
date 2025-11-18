import { UnitStatus } from '../value-objects/UnitStatus'
import { Level } from './Level'
import { DomainError } from '@/shared/domain/validation/ValueObject'

/**
 * Unit Entity
 *
 * Representa uma unidade temática de aprendizado no sistema.
 * Hierarquia: Module → Unit → Level → Challenge
 *
 * Segue princípios DDD:
 * - Entidade com identidade única
 * - Aggregate Root para seus Levels
 * - Encapsula regras de negócio de unidades
 * - Invariantes sempre válidas
 *
 * Características:
 * - Contém conteúdo educacional (teoria, objetivos, recursos)
 * - Contém vários Levels (sessões de prática)
 * - Possui requisitos de conclusão (score mínimo)
 */

export interface UnitResource {
  articles: Array<{
    title: string
    url: string
    author?: string
  }>
  videos: Array<{
    title: string
    url: string
    duration?: number
    platform?: string
  }>
}

export interface UnitProps {
  id: string
  title: string
  description: string
  orderIndex: number
  status: UnitStatus
  levels: Level[]
  learningObjectives?: string[]
  estimatedMinutes?: number
  theoryContent?: string
  resources?: UnitResource
  requiredScore?: number
}

export class Unit {
  private readonly _id: string
  private _title: string
  private _description: string
  private _orderIndex: number
  private _status: UnitStatus
  private _levels: Level[]
  private _learningObjectives: string[]
  private _estimatedMinutes: number
  private _theoryContent: string
  private _resources: UnitResource
  private _requiredScore: number

  private constructor(props: UnitProps) {
    this._id = props.id
    this._title = props.title
    this._description = props.description
    this._orderIndex = props.orderIndex
    this._status = props.status
    this._levels = props.levels
    this._learningObjectives = props.learningObjectives ?? []
    this._estimatedMinutes = props.estimatedMinutes ?? 0
    this._theoryContent = props.theoryContent ?? ''
    this._resources = props.resources ?? { articles: [], videos: [] }
    this._requiredScore = props.requiredScore ?? 60

    this.validate()
  }

  /**
   * Factory Method
   */
  static create(props: UnitProps): Unit {
    return new Unit(props)
  }

  /**
   * Validação de invariantes
   */
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainError('Unit ID is required', 'unit.id', 'REQUIRED')
    }

    if (!this._title || this._title.trim().length === 0) {
      throw new DomainError('Unit title is required', 'unit.title', 'REQUIRED')
    }

    if (this._title.length > 200) {
      throw new DomainError('Unit title is too long', 'unit.title', 'MAX_LENGTH')
    }

    if (this._orderIndex < 0) {
      throw new DomainError('Order index cannot be negative', 'unit.orderIndex', 'INVALID_RANGE')
    }

    if (this._requiredScore < 0 || this._requiredScore > 100) {
      throw new DomainError(
        'Required score must be between 0 and 100',
        'unit.requiredScore',
        'INVALID_RANGE'
      )
    }

    if (this._estimatedMinutes < 0) {
      throw new DomainError(
        'Estimated minutes cannot be negative',
        'unit.estimatedMinutes',
        'INVALID_RANGE'
      )
    }

    if (!Array.isArray(this._levels)) {
      throw new DomainError('Levels must be an array', 'unit.levels', 'INVALID_TYPE')
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

  get description(): string {
    return this._description
  }

  get orderIndex(): number {
    return this._orderIndex
  }

  get status(): UnitStatus {
    return this._status
  }

  get levels(): Level[] {
    return [...this._levels]
  }

  get learningObjectives(): string[] {
    return [...this._learningObjectives]
  }

  get estimatedMinutes(): number {
    return this._estimatedMinutes
  }

  get theoryContent(): string {
    return this._theoryContent
  }

  get resources(): UnitResource {
    return {
      articles: [...this._resources.articles],
      videos: [...this._resources.videos]
    }
  }

  get requiredScore(): number {
    return this._requiredScore
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

  canBeStarted(): boolean {
    return this._status.canBeStarted()
  }

  getTotalLevels(): number {
    return this._levels.length
  }

  getCompletedLevels(): number {
    return this._levels.filter(level => level.isCompleted()).length
  }

  getProgressPercentage(): number {
    const total = this.getTotalLevels()
    if (total === 0) return 0
    return Math.round((this.getCompletedLevels() / total) * 100)
  }

  hasAllLevelsCompleted(): boolean {
    return this.getTotalLevels() > 0 &&
           this.getCompletedLevels() === this.getTotalLevels()
  }

  getAverageScore(): number {
    const completedLevels = this._levels.filter(l => l.isCompleted())
    if (completedLevels.length === 0) return 0

    const totalScore = completedLevels.reduce((sum, level) => sum + level.score, 0)
    return Math.round(totalScore / completedLevels.length)
  }

  meetsRequiredScore(): boolean {
    return this.getAverageScore() >= this._requiredScore
  }

  getNextAvailableLevel(): Level | undefined {
    return this._levels.find(level => level.isAvailable() && !level.isCompleted())
  }

  getLevelById(id: string): Level | undefined {
    return this._levels.find(level => level.id === id)
  }

  getTotalEstimatedMinutes(): number {
    return this._estimatedMinutes
  }

  hasLearningObjectives(): boolean {
    return this._learningObjectives.length > 0
  }

  hasTheoryContent(): boolean {
    return this._theoryContent.trim().length > 0
  }

  hasResources(): boolean {
    return this._resources.articles.length > 0 || this._resources.videos.length > 0
  }

  /**
   * Métodos de mutação
   */

  unlock(): void {
    if (!this._status.isLocked()) {
      throw new DomainError('Unit is not locked', 'unit.status', 'INVALID_OPERATION')
    }

    const newStatus = UnitStatus.available()
    if (!this._status.canTransitionTo(newStatus)) {
      throw new DomainError('Cannot unlock unit', 'unit.status', 'INVALID_TRANSITION')
    }

    this._status = newStatus
  }

  start(): void {
    if (!this.canBeStarted()) {
      throw new DomainError('Unit cannot be started', 'unit.status', 'INVALID_OPERATION')
    }

    this._status = UnitStatus.inProgress()
  }

  complete(): void {
    if (!this.hasAllLevelsCompleted()) {
      throw new DomainError(
        'Cannot complete unit: not all levels are completed',
        'unit.status',
        'INVALID_OPERATION'
      )
    }

    if (!this.meetsRequiredScore()) {
      throw new DomainError(
        `Cannot complete unit: average score (${this.getAverageScore()}%) is below required (${this._requiredScore}%)`,
        'unit.status',
        'INSUFFICIENT_SCORE'
      )
    }

    this._status = UnitStatus.completed()
  }

  addLevel(level: Level): void {
    if (!level) {
      throw new DomainError('Level is required', 'unit.level', 'REQUIRED')
    }

    const exists = this._levels.some(l => l.id === level.id)
    if (exists) {
      throw new DomainError('Level already exists in unit', 'unit.level', 'DUPLICATE')
    }

    this._levels.push(level)
  }

  updateTheoryContent(content: string): void {
    this._theoryContent = content
  }

  addLearningObjective(objective: string): void {
    if (!objective || objective.trim().length === 0) {
      throw new DomainError('Learning objective cannot be empty', 'unit.objective', 'REQUIRED')
    }

    if (this._learningObjectives.includes(objective)) {
      throw new DomainError('Learning objective already exists', 'unit.objective', 'DUPLICATE')
    }

    this._learningObjectives.push(objective)
  }

  /**
   * Equality
   */
  equals(other: Unit): boolean {
    return this._id === other._id
  }

  /**
   * DTO Conversion
   */
  toDTO(): UnitDTO {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      orderIndex: this._orderIndex,
      status: this._status.getValue(),
      learningObjectives: this._learningObjectives,
      estimatedMinutes: this._estimatedMinutes,
      theoryContent: this._theoryContent,
      resources: this._resources,
      requiredScore: this._requiredScore,
      totalLevels: this.getTotalLevels(),
      completedLevels: this.getCompletedLevels(),
      progressPercentage: this.getProgressPercentage(),
      averageScore: this.getAverageScore(),
      levels: this._levels.map(l => l.toDTO())
    }
  }

  /**
   * Clone
   */
  clone(): Unit {
    return Unit.create({
      id: this._id,
      title: this._title,
      description: this._description,
      orderIndex: this._orderIndex,
      status: this._status,
      levels: this._levels.map(l => l.clone()),
      learningObjectives: [...this._learningObjectives],
      estimatedMinutes: this._estimatedMinutes,
      theoryContent: this._theoryContent,
      resources: {
        articles: [...this._resources.articles],
        videos: [...this._resources.videos]
      },
      requiredScore: this._requiredScore
    })
  }
}

/**
 * DTO para transferência de dados
 */
export interface UnitDTO {
  id: string
  title: string
  description: string
  orderIndex: number
  status: string
  learningObjectives: string[]
  estimatedMinutes: number
  theoryContent: string
  resources: UnitResource
  requiredScore: number
  totalLevels: number
  completedLevels: number
  progressPercentage: number
  averageScore: number
  levels: any[]
}
