/**
 * Domain Entity - PerformanceStrategy
 * Implementa conceitos de DDD com validação de negócio e encapsulamento.
 */

import type { PerformanceConfig } from '../value-objects/PerformanceConfig'
import { PerformanceError } from '../errors/PerformanceError'

export type PerformanceStrategyType = 'debounce' | 'throttle' | 'memoization'

/**
 * Entity que representa uma estratégia de otimização de performance.
 * Aplica Single Responsibility, Encapsulation e Domain Validation.
 */
export class PerformanceStrategy {
  private readonly _name: string
  private readonly _type: PerformanceStrategyType
  private readonly _config: PerformanceConfig

  private constructor(name: string, type: PerformanceStrategyType, config: PerformanceConfig) {
    this._name = name
    this._type = type
    this._config = config
    this.validateStrategy()
  }

  // Factory Methods - Implementação do Factory Pattern
  static createDebounce(name: string, config: PerformanceConfig): PerformanceStrategy {
    return new PerformanceStrategy(name, 'debounce', config)
  }

  static createThrottle(name: string, config: PerformanceConfig): PerformanceStrategy {
    return new PerformanceStrategy(name, 'throttle', config)
  }

  static createMemoization(name: string, config: PerformanceConfig): PerformanceStrategy {
    return new PerformanceStrategy(name, 'memoization', config)
  }

  get name(): string { return this._name }
  get type(): PerformanceStrategyType { return this._type }
  get config(): PerformanceConfig { return this._config }

  equals(other: PerformanceStrategy): boolean {
    return (
      this._name === other._name &&
      this._type === other._type &&
      this._config.equals(other._config)
    )
  }

  /**
   * Domain Validation - Regras de negócio específicas por tipo de estratégia
   */
  private validateStrategy(): void {
    if (!this._name.trim()) {
      throw PerformanceError.invalidStrategy('Strategy name cannot be empty')
    }

    switch (this._type) {
      case 'debounce':
        if (!this._config.delay || this._config.delay <= 0) {
          throw PerformanceError.invalidStrategy('Debounce requires positive delay')
        }
        break

      case 'throttle':
        if (!this._config.delay || this._config.delay <= 0) {
          throw PerformanceError.invalidStrategy('Throttle requires positive delay')
        }
        break

      case 'memoization':
        if (!this._config.cacheSize && !this._config.ttl) {
          throw PerformanceError.invalidStrategy('Memoization requires cacheSize or ttl')
        }
        break
    }
  }

  toString(): string {
    return `PerformanceStrategy(${this._name}, ${this._type})`
  }
}