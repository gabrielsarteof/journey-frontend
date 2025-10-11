import { PerformanceMetrics } from '../entities/PerformanceMetrics'

/**
 * Contrato base para adaptadores de performance.
 * Define interface comum para diferentes algoritmos de otimização.
 */
export interface PerformanceAdapter<TFunction extends (...args: never[]) => unknown> {
  optimize(fn: TFunction): TFunction
  getMetrics(): PerformanceMetrics
  cleanup(): void
}

/**
 * Implementação base que padroniza comportamentos comuns.
 * Evita duplicação de código entre diferentes adaptadores.
 */
export abstract class BasePerformanceAdapter<TFunction extends (...args: never[]) => unknown>
  implements PerformanceAdapter<TFunction> {

  protected metrics: PerformanceMetrics

  constructor() {
    this.metrics = PerformanceMetrics.initial()
  }

  abstract optimize(fn: TFunction): TFunction

  getMetrics(): PerformanceMetrics {
    return this.metrics
  }

  cleanup(): void {
    this.metrics = PerformanceMetrics.initial()
  }
}

/**
 * Interfaces específicas para diferentes capacidades dos adaptadores.
 * Implementa Interface Segregation Principle.
 */
export interface CacheableAdapter {
  clearCache(): void
  getCacheSize(): number
}

export interface ThrottleableAdapter {
  setLeading(leading: boolean): void
  setTrailing(trailing: boolean): void
}