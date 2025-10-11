import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'
import { RetryStrategy } from '../infrastructure/resilience/RetryStrategy'

export interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  retryableStatusCodes?: number[]
  retryableErrors?: string[]
  shouldRetry?: (context: MiddlewareContext) => boolean
}

/**
 * Middleware de retry para HTTP requests
 * Delega lógica de backoff/jitter para RetryStrategy mantendo regras de negócio específicas
 */
export class RetryMiddleware extends BaseMiddleware {
  private readonly options: Required<RetryOptions>
  private readonly retryStrategy: RetryStrategy
  private readonly hasCustomRetryLogic: boolean

  constructor(options: RetryOptions = {}, retryStrategy?: RetryStrategy) {
    super('RetryMiddleware')
    this.hasCustomRetryLogic = !!options.shouldRetry
    this.options = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      retryableErrors: ['NETWORK_ERROR', 'REQUEST_TIMEOUT'],
      shouldRetry: () => false,
      ...options
    }
    this.retryStrategy = retryStrategy || new RetryStrategy()
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    let lastContext: MiddlewareContext | undefined

    try {
      return await this.retryStrategy.execute(
        async () => {
          const result = await next({ ...context })

          if (this.shouldRetryResponse(result)) {
            lastContext = result
            throw new Error('RETRY_RESPONSE')
          }

          return result
        },
        {
          maxAttempts: this.options.maxAttempts,
          delayMs: this.options.baseDelay,
          maxDelayMs: this.options.maxDelay,
          backoffMultiplier: this.options.backoffMultiplier,
          jitter: true,
          shouldRetry: (error) => {
            if (error instanceof Error && error.message === 'RETRY_RESPONSE') {
              return true
            }
            return this.shouldRetryError(error as Error)
          }
        }
      )
    } catch (error) {
      if (lastContext) {
        return lastContext
      }
      throw error
    }
  }

  private shouldRetryResponse(context: MiddlewareContext): boolean {
    if (this.hasCustomRetryLogic) {
      return this.options.shouldRetry(context)
    }

    if (!context.response) {
      return false
    }

    return this.options.retryableStatusCodes.includes(context.response.status)
  }

  private shouldRetryError(error: Error): boolean {
    return this.options.retryableErrors.some(retryableError =>
      error.message.includes(retryableError)
    )
  }
}