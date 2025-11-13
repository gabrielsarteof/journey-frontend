import { DomainError } from '@/shared/domain/validation/ValueObject'
import { Category } from '../value-objects/Category'
import { Challenge } from './Challenge'

/**
 * Module Entity (Aggregate Root)
 *
 * Representa um módulo de aprendizado que contém múltiplos desafios.
 * Segue princípios DDD:
 * - Aggregate Root que gerencia Challenges
 * - Encapsula regras de negócio de progressão
 * - Mantém invariantes sempre válidas
 *
 * Princípios SOLID:
 * - SRP: Responsável apenas por lógica de módulo
 * - OCP: Extensível via composição
 * - DIP: Depende de abstrações (Value Objects)
 */

export interface ModuleProps {
  id: string
  orderIndex: number
  category: Category
  challenges: Challenge[]
  isLocked?: boolean
}

export class Module {
  private readonly _id: string
  private readonly _orderIndex: number
  private readonly _category: Category
  private _challenges: Challenge[]
  private _isLocked: boolean

  private constructor(props: ModuleProps) {
    this._id = props.id
    this._orderIndex = props.orderIndex
    this._category = props.category
    this._challenges = props.challenges
    this._isLocked = props.isLocked ?? false

    this.validate()
  }

  /**
   * Factory Method
   */
  static create(props: ModuleProps): Module {
    return new Module(props)
  }

  /**
   * Validação de invariantes
   */
  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new DomainError('ID do módulo é obrigatório', 'module.id', 'REQUIRED')
    }

    if (this._orderIndex < 0) {
      throw new DomainError('Índice de ordem não pode ser negativo', 'module.orderIndex', 'INVALID_RANGE')
    }

    if (!this._category) {
      throw new DomainError('Categoria é obrigatória', 'module.category', 'REQUIRED')
    }

    if (!Array.isArray(this._challenges)) {
      throw new DomainError('Desafios devem ser um array', 'module.challenges', 'INVALID_TYPE')
    }
  }

  /**
   * Getters
   */
  get id(): string {
    return this._id
  }

  get orderIndex(): number {
    return this._orderIndex
  }

  get category(): Category {
    return this._category
  }

  get challenges(): Challenge[] {
    return [...this._challenges] // Return copy to prevent external mutation
  }

  get isLocked(): boolean {
    return this._isLocked
  }

  /**
   * Computed properties - Domain behaviors
   */
  get title(): string {
    return this._category.getModuleThemeName()
  }

  get description(): string {
    return this._category.getModuleDescription()
  }

  get slug(): string {
    return this._category.getSlug()
  }

  get icon(): string {
    return this._category.getIcon()
  }

  /**
   * Domain Logic
   */

  getTotalChallenges(): number {
    return this._challenges.length
  }

  getCompletedChallenges(): number {
    return this._challenges.filter(challenge => challenge.isCompleted()).length
  }

  getAvailableChallenges(): number {
    return this._challenges.filter(challenge => challenge.isAvailable()).length
  }

  getProgressPercentage(): number {
    const total = this.getTotalChallenges()
    if (total === 0) return 0
    return Math.round((this.getCompletedChallenges() / total) * 100)
  }

  isComplete(): boolean {
    return this.getTotalChallenges() > 0 &&
           this.getCompletedChallenges() === this.getTotalChallenges()
  }

  hasStarted(): boolean {
    return this.getCompletedChallenges() > 0
  }

  canBeUnlocked(userLevel: number): boolean {
    // Módulo 1 sempre desbloqueado
    if (this._orderIndex === 1) return true

    // Outros módulos requerem completar o anterior
    // (essa lógica pode ser expandida conforme necessário)
    return userLevel >= this._orderIndex
  }

  /**
   * Encontra um desafio pelo ID
   */
  getChallengeById(id: string): Challenge | undefined {
    return this._challenges.find(challenge => challenge.id === id)
  }

  /**
   * Retorna o próximo desafio disponível
   */
  getNextAvailableChallenge(): Challenge | undefined {
    return this._challenges.find(challenge =>
      challenge.isAvailable() && !challenge.isCompleted()
    )
  }

  /**
   * Mutações
   */

  unlock(): void {
    if (!this._isLocked) {
      throw new DomainError('Módulo já está desbloqueado', 'module.isLocked', 'INVALID_OPERATION')
    }
    this._isLocked = false
  }

  lock(): void {
    if (this._isLocked) {
      throw new DomainError('Módulo já está bloqueado', 'module.isLocked', 'INVALID_OPERATION')
    }
    this._isLocked = true
  }

  addChallenge(challenge: Challenge): void {
    if (!challenge) {
      throw new DomainError('Desafio é obrigatório', 'module.challenge', 'REQUIRED')
    }

    // Verifica se já existe
    const exists = this._challenges.some(c => c.id === challenge.id)
    if (exists) {
      throw new DomainError('Desafio já existe no módulo', 'module.challenge', 'DUPLICATE')
    }

    this._challenges.push(challenge)
  }

  /**
   * Equality
   */
  equals(other: Module): boolean {
    return this._id === other._id
  }

  /**
   * DTO Conversion
   */
  toDTO(): ModuleDTO {
    return {
      id: this._id,
      orderIndex: this._orderIndex,
      title: this.title,
      description: this.description,
      slug: this.slug,
      icon: this.icon,
      category: this._category.getValue(),
      isLocked: this._isLocked,
      totalChallenges: this.getTotalChallenges(),
      completedChallenges: this.getCompletedChallenges(),
      progressPercentage: this.getProgressPercentage(),
      challenges: this._challenges.map(c => c.toDTO())
    }
  }

  /**
   * Clone
   */
  clone(): Module {
    return Module.create({
      id: this._id,
      orderIndex: this._orderIndex,
      category: this._category,
      challenges: this._challenges.map(c => c.clone()),
      isLocked: this._isLocked
    })
  }
}

/**
 * DTO para transferência de dados
 */
export interface ModuleDTO {
  id: string
  orderIndex: number
  title: string
  description: string
  slug: string
  icon: string
  category: string
  isLocked: boolean
  totalChallenges: number
  completedChallenges: number
  progressPercentage: number
  challenges: any[]
}
