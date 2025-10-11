import { BasePerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { PerformanceConfig } from '../../domain/value-objects/PerformanceConfig'

/**
 * Implementa debounce seguindo Strategy Pattern.
 * Atrasa execução até que não haja chamadas por um período específico.
 */
export class DebounceAdapter<
  TArgs extends readonly unknown[],
  TReturn
> extends BasePerformanceAdapter<(...args: TArgs) => TReturn> {

  private timeoutId: number | null = null
  private readonly config: PerformanceConfig

  constructor(config: PerformanceConfig) {
    super()
    this.config = config
  }

  optimize(fn: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn {
    return (...args: TArgs): TReturn => {
      const startTime = performance.now()

      // Cancela execução anterior se existir
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }

      let result: TReturn | undefined

      this.timeoutId = setTimeout(() => {
        try {
          result = fn(...args)
          const duration = performance.now() - startTime
          this.metrics = this.metrics.incrementExecution(duration)
        } catch (error) {
          this.metrics = this.metrics.incrementExecution(0)
          throw error
        }
      }, this.config.delay) as number

      // TypeScript não consegue inferir que result será definido após timeout
      // Em uso real, debounce não retorna valores síncronos
      return result as TReturn
    }
  }

  cleanup(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    super.cleanup()
  }
}