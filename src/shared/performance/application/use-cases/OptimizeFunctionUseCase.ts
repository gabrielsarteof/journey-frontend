import type { PerformanceStrategy } from '../../domain/entities/PerformanceStrategy'
import type { PerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import { PerformanceAdapterFactory } from '../../infrastructure/factories/PerformanceAdapterFactory'
import { PerformanceError } from '../../domain/errors/PerformanceError'

/**
 * Result pattern para error handling robusto.
 * Evita exceptions e torna tratamento de erro explícito.
 */
export class Result<TValue, TError> {
  private readonly _value: TValue | undefined
  private readonly _error: TError | undefined
  private readonly _isSuccess: boolean

  constructor(
    value: TValue | undefined,
    error: TError | undefined,
    isSuccess: boolean
  ) {
    this._value = value
    this._error = error
    this._isSuccess = isSuccess
  }

  static success<TValue, TError>(value: TValue): Result<TValue, TError> {
    return new Result<TValue, TError>(value, undefined, true)
  }

  static failure<TValue, TError>(error: TError): Result<TValue, TError> {
    return new Result<TValue, TError>(undefined, error, false)
  }

  get isSuccess(): boolean { return this._isSuccess }
  get isFailure(): boolean { return !this._isSuccess }

  get value(): TValue {
    if (!this._isSuccess) throw new Error('Cannot access value of failed result')
    return this._value!
  }

  get error(): TError {
    if (this._isSuccess) throw new Error('Cannot access error of successful result')
    return this._error!
  }
}

/**
 * Use Case principal que coordena otimização de funções.
 * Implementa Single Responsibility e Dependency Inversion principles.
 */
export class OptimizeFunctionUseCase {
  private readonly adapterFactory: PerformanceAdapterFactory

  constructor(adapterFactory: PerformanceAdapterFactory) {
    this.adapterFactory = adapterFactory
  }

  /**
   * Executa otimização de função seguindo strategy pattern.
   * Retorna Result para tratamento seguro de erros.
   */
  execute<TArgs extends readonly unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    strategy: PerformanceStrategy
  ): Result<{
    optimizedFn: (...args: TArgs) => TReturn
    adapter: PerformanceAdapter<(...args: TArgs) => TReturn>
  }, PerformanceError> {

    try {
      // Valida entrada
      this.validateInput(fn, strategy)

      // Cria adapter baseado na estratégia
      const adapter = this.adapterFactory.create<TArgs, TReturn>(strategy)

      // Otimiza função
      const optimizedFn = adapter.optimize(fn)

      return Result.success({
        optimizedFn,
        adapter
      })

    } catch (error) {
      const performanceError = error instanceof PerformanceError
        ? error
        : PerformanceError.fromError(error as Error, {
            strategyName: strategy.name,
            strategyType: strategy.type
          })

      return Result.failure(performanceError)
    }
  }

  private validateInput<TArgs extends readonly unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    strategy: PerformanceStrategy
  ): void {
    if (typeof fn !== 'function') {
      throw PerformanceError.configurationError('Input must be a function')
    }

    if (!strategy) {
      throw PerformanceError.configurationError('Strategy is required')
    }
  }
}