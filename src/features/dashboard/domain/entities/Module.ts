import { DomainError } from '@/shared/domain/validation/ValueObject'
import { Category } from '../value-objects/Category'
import { Unit } from './Unit'
import { Level } from './Level'
import { Challenge } from './Challenge'

/**
 * Module Entity (Aggregate Root)
 *
 * Representa um módulo de aprendizado que contém múltiplas unidades.
 * Hierarquia: Module → Unit → Level → Challenge
 *
 * Segue princípios DDD:
 * - Aggregate Root que gerencia Units
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
  units: Unit[]
  isLocked?: boolean
}

export class Module {
  private readonly _id: string
  private readonly _orderIndex: number
  private readonly _category: Category
  private _units: Unit[]
  private _isLocked: boolean

  private constructor(props: ModuleProps) {
    this._id = props.id
    this._orderIndex = props.orderIndex
    this._category = props.category
    this._units = props.units
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

    if (!Array.isArray(this._units)) {
      throw new DomainError('Units devem ser um array', 'module.units', 'INVALID_TYPE')
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

  get units(): Unit[] {
    return [...this._units] // Return copy to prevent external mutation
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
   * Domain Logic - Units
   */

  getTotalUnits(): number {
    return this._units.length
  }

  getCompletedUnits(): number {
    return this._units.filter(unit => unit.isCompleted()).length
  }

  getAvailableUnits(): number {
    return this._units.filter(unit => unit.isAvailable()).length
  }

  getProgressPercentage(): number {
    const total = this.getTotalUnits()
    if (total === 0) return 0
    return Math.round((this.getCompletedUnits() / total) * 100)
  }

  isComplete(): boolean {
    return this.getTotalUnits() > 0 &&
           this.getCompletedUnits() === this.getTotalUnits()
  }

  hasStarted(): boolean {
    return this.getCompletedUnits() > 0 ||
           this._units.some(unit => unit.isInProgress())
  }

  canBeUnlocked(userLevel: number): boolean {
    // Módulo 1 sempre desbloqueado
    if (this._orderIndex === 1) return true

    // Outros módulos requerem completar o anterior
    // (essa lógica pode ser expandida conforme necessário)
    return userLevel >= this._orderIndex
  }

  /**
   * Encontra uma unit pelo ID
   */
  getUnitById(id: string): Unit | undefined {
    return this._units.find(unit => unit.id === id)
  }

  /**
   * Retorna a próxima unit disponível
   */
  getNextAvailableUnit(): Unit | undefined {
    return this._units.find(unit =>
      unit.isAvailable() && !unit.isCompleted()
    )
  }

  /**
   * Retorna a unit atual (em progresso ou próxima disponível)
   */
  getCurrentUnit(): Unit | undefined {
    // Busca unit em progresso
    const inProgress = this._units.find(unit => unit.isInProgress())
    if (inProgress) return inProgress

    // Se não há nenhuma em progresso, retorna a próxima disponível
    return this.getNextAvailableUnit()
  }

  /**
   * Helper methods - Navegação através da hierarquia
   * (Mantidos para compatibilidade e conveniência)
   */

  getAllLevels(): Level[] {
    return this._units.flatMap(unit => unit.levels)
  }

  getAllChallenges(): Challenge[] {
    return this._units.flatMap(unit =>
      unit.levels.flatMap(level => level.challenges)
    )
  }

  getLevelById(id: string): Level | undefined {
    for (const unit of this._units) {
      const level = unit.levels.find(l => l.id === id)
      if (level) return level
    }
    return undefined
  }

  getChallengeById(id: string): Challenge | undefined {
    for (const unit of this._units) {
      for (const level of unit.levels) {
        const challenge = level.challenges.find(c => c.id === id)
        if (challenge) return challenge
      }
    }
    return undefined
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

  addUnit(unit: Unit): void {
    if (!unit) {
      throw new DomainError('Unit é obrigatória', 'module.unit', 'REQUIRED')
    }

    // Verifica se já existe
    const exists = this._units.some(u => u.id === unit.id)
    if (exists) {
      throw new DomainError('Unit já existe no módulo', 'module.unit', 'DUPLICATE')
    }

    this._units.push(unit)
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
      totalUnits: this.getTotalUnits(),
      completedUnits: this.getCompletedUnits(),
      progressPercentage: this.getProgressPercentage(),
      units: this._units.map(u => u.toDTO())
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
      units: this._units.map(u => u.clone()),
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
  totalUnits: number
  completedUnits: number
  progressPercentage: number
  units: any[]
}
