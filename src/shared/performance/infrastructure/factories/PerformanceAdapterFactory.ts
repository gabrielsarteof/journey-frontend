import type { PerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { PerformanceStrategy } from '../../domain/entities/PerformanceStrategy'
import { DebounceAdapter } from '../adapters/DebounceAdapter'
import { ThrottleAdapter } from '../adapters/ThrottleAdapter'
import { MemoizationAdapter } from '../adapters/MemoizationAdapter'
import { PerformanceError } from '../../domain/errors/PerformanceError'

/**
 * Factory que centraliza criação de adaptadores baseado na estratégia.
 * Implementa Factory Pattern e encapsula lógica de instanciação.
 */
export class PerformanceAdapterFactory {
  /**
   * Cria adapter apropriado baseado no tipo da estratégia.
   * Type safety garantida através de generics e union types.
   */
  create<TArgs extends readonly unknown[], TReturn>(
    strategy: PerformanceStrategy
  ): PerformanceAdapter<(...args: TArgs) => TReturn> {

    switch (strategy.type) {
      case 'debounce':
        return new DebounceAdapter<TArgs, TReturn>(strategy.config) as PerformanceAdapter<(...args: TArgs) => TReturn>

      case 'throttle':
        return new ThrottleAdapter<TArgs, TReturn>(strategy.config) as PerformanceAdapter<(...args: TArgs) => TReturn>

      case 'memoization':
        return new MemoizationAdapter<TArgs, TReturn>(strategy.config) as PerformanceAdapter<(...args: TArgs) => TReturn>

      default:
        throw PerformanceError.adapterError(
          `No adapter found for strategy type: ${strategy.type}`,
          { strategyName: strategy.name, strategyType: strategy.type }
        )
    }
  }

  /**
   * Lista todos os tipos de estratégia suportados.
   * Útil para validações e interfaces dinâmicas.
   */
  getSupportedTypes(): string[] {
    return ['debounce', 'throttle', 'memoization']
  }
}