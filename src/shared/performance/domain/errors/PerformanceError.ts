/**
 * Domain-specific error handling para o contexto de performance.
 * Implementa error types específicos para facilitar debugging e tratamento.
 */
export class PerformanceError extends Error {
  public readonly code: string
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.code = code
    this.context = context
    this.name = 'PerformanceError'
  }

  static invalidStrategy(message: string, context?: Record<string, unknown>): PerformanceError {
    return new PerformanceError(message, 'INVALID_STRATEGY', context)
  }

  static adapterError(message: string, context?: Record<string, unknown>): PerformanceError {
    return new PerformanceError(message, 'ADAPTER_ERROR', context)
  }

  static configurationError(message: string, context?: Record<string, unknown>): PerformanceError {
    return new PerformanceError(message, 'CONFIGURATION_ERROR', context)
  }

  static executionError(message: string, context?: Record<string, unknown>): PerformanceError {
    return new PerformanceError(message, 'EXECUTION_ERROR', context)
  }

  // Facilita conversão de erros genéricos para domain errors
  static fromError(error: Error, context?: Record<string, unknown>): PerformanceError {
    return new PerformanceError(error.message, 'UNKNOWN_ERROR', {
      originalError: error.name,
      ...context
    })
  }
}