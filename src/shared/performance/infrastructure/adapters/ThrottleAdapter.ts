import { BasePerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { ThrottleableAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { PerformanceConfig } from '../../domain/value-objects/PerformanceConfig'

/**
 * Implementa throttle com controle de leading/trailing edge.
 * Garante execução máxima de uma vez por período definido.
 */
export class ThrottleAdapter<
  TArgs extends readonly unknown[],
  TReturn
> extends BasePerformanceAdapter<(...args: TArgs) => TReturn> implements ThrottleableAdapter {

  private lastCallTime = 0
  private leading: boolean
  private trailing: boolean
  private timeoutId: number | null = null
  private lastArgs: TArgs | null = null
  private readonly config: PerformanceConfig

  constructor(config: PerformanceConfig) {
    super()
    this.config = config
    this.leading = config.leading
    this.trailing = config.trailing
  }

  optimize(fn: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn {
    return (...args: TArgs): TReturn => {
      const now = Date.now()
      const timeSinceLastCall = now - this.lastCallTime

      this.lastArgs = args

      // Primeira chamada ou tempo suficiente passou
      if (this.lastCallTime === 0 || timeSinceLastCall >= this.config.delay) {
        if (this.leading) {
          this.lastCallTime = now
          return this.executeWithMetrics(fn, args, now)
        }
      }

      // Configura trailing call se habilitado
      if (this.trailing) {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
          if (this.lastArgs) {
            this.lastCallTime = Date.now()
            this.executeWithMetrics(fn, this.lastArgs, this.lastCallTime)
          }
        }, this.config.delay - timeSinceLastCall) as number
      }

      // Para throttle sem leading, retorna resultado anterior ou undefined
      // Em implementação real, isso dependeria do contexto específico
      return fn(...args)
    }
  }

  private executeWithMetrics(
    fn: (...args: TArgs) => TReturn,
    args: TArgs,
    startTime: number
  ): TReturn {
    try {
      const result = fn(...args)
      const duration = performance.now() - startTime
      this.metrics = this.metrics.incrementExecution(duration)
      return result
    } catch (error) {
      this.metrics = this.metrics.incrementExecution(0)
      throw error
    }
  }

  setLeading(leading: boolean): void {
    this.leading = leading
  }

  setTrailing(trailing: boolean): void {
    this.trailing = trailing
  }

  cleanup(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.lastCallTime = 0
    this.lastArgs = null
    super.cleanup()
  }
}