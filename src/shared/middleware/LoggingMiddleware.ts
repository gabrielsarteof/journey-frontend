import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'

export class LoggingMiddleware extends BaseMiddleware {
  constructor() {
    super('LoggingMiddleware')
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    const startTime = performance.now()

    this.log('info', `→ ${context.request.method} ${context.request.url}`)

    try {
      const result = await next(context)
      const duration = performance.now() - startTime

      if (result.response) {
        const level = result.response.status >= 400 ? 'warn' : 'info'
        this.log(level, `← ${result.response.status} (${duration.toFixed(2)}ms)`)
      }

      return result
    } catch (error) {
      const duration = performance.now() - startTime
      this.log('error', `✗ ${(error as Error).message} (${duration.toFixed(2)}ms)`)
      throw error
    }
  }
}