import type {
  Middleware,
  MiddlewareContext,
  MiddlewareNext,
  MiddlewareExecutor
} from '../abstractions/Middleware'
import { MiddlewarePhase } from '../abstractions/Middleware'
import type { CacheService } from '../domain/contracts/CacheService'

interface MiddlewareEntry {
  middleware: Middleware
  phase: MiddlewarePhase
}

/**
 * Chain of Responsibility pattern com cache para performance
 * Implementa DIP: depende de abstração CacheService injetada
 */
export class MiddlewareChain implements MiddlewareExecutor {
  private middlewares: MiddlewareEntry[] = []
  private executionMetrics = new Map<string, { count: number; totalTime: number; successCount: number; failureCount: number }>()

  constructor(private readonly cacheService?: CacheService) {}

  addMiddleware(middleware: Middleware, phase: MiddlewarePhase = MiddlewarePhase.REQUEST): void {
    this.middlewares.push({ middleware, phase })
  }

  async execute(context: MiddlewareContext): Promise<MiddlewareContext> {
    const startTime = performance.now()
    const executionId = this.generateExecutionId(context)

    if (this.cacheService && this.isIdempotentRequest(context)) {
      const cached = await this.cacheService.get<MiddlewareContext>(executionId)
      if (cached) {
        console.debug(`[MiddlewareChain] Cache hit for execution: ${executionId}`)
        return cached
      }
    }

    const requestMiddlewares = this.getMiddlewaresByPhase(MiddlewarePhase.REQUEST)
    const responseMiddlewares = this.getMiddlewaresByPhase(MiddlewarePhase.RESPONSE)
    const errorMiddlewares = this.getMiddlewaresByPhase(MiddlewarePhase.ERROR)

    try {
      let currentContext = await this.executeMiddlewares(requestMiddlewares, context)

      if (currentContext.response) {
        currentContext = await this.executeMiddlewares(responseMiddlewares, currentContext)
      }

      if (this.cacheService && this.isIdempotentRequest(context) && currentContext.response) {
        await this.cacheService.set(executionId, currentContext, 60000)
      }

      this.recordMetrics(executionId, performance.now() - startTime, true)
      return currentContext
    } catch (error) {
      const errorContext: MiddlewareContext = {
        ...context,
        error: error as Error
      }

      this.recordMetrics(executionId, performance.now() - startTime, false)
      return await this.executeMiddlewares(errorMiddlewares, errorContext)
    }
  }

  private getMiddlewaresByPhase(phase: MiddlewarePhase): Middleware[] {
    return this.middlewares
      .filter(entry => entry.phase === phase)
      .map(entry => entry.middleware)
  }

  private async executeMiddlewares(
    middlewares: Middleware[],
    context: MiddlewareContext
  ): Promise<MiddlewareContext> {
    if (middlewares.length === 0) {
      return context
    }

    let index = 0

    const next: MiddlewareNext = async (ctx: MiddlewareContext) => {
      if (index >= middlewares.length) {
        return ctx
      }

      const middleware = middlewares[index++]
      return await middleware.execute(ctx, next)
    }

    return await next(context)
  }

  clear(): void {
    this.middlewares = []
  }

  getMiddlewareCount(): number {
    return this.middlewares.length
  }

  // Métricas de performance
  getExecutionMetrics() {
    return Array.from(this.executionMetrics.entries()).map(([id, metrics]) => ({
      executionId: id,
      averageTime: metrics.totalTime / metrics.count,
      totalExecutions: metrics.count,
      totalTime: metrics.totalTime,
      successCount: metrics.successCount,
      failureCount: metrics.failureCount,
      successRate: metrics.count > 0 ? (metrics.successCount / metrics.count) * 100 : 0
    }))
  }

  async clearCache(): Promise<void> {
    if (this.cacheService) {
      await this.cacheService.clear()
    }
  }

  private generateExecutionId(context: MiddlewareContext): string {
    const method = context.request?.method || 'unknown'
    const url = context.request?.url || 'unknown'
    const bodyHash = context.request?.body
      ? btoa(JSON.stringify(context.request.body)).slice(0, 8)
      : 'nobody'

    return `${method}_${url}_${bodyHash}`
  }

  private isIdempotentRequest(context: MiddlewareContext): boolean {
    const method = context.request?.method?.toUpperCase()
    return method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
  }

  private recordMetrics(executionId: string, duration: number, success: boolean): void {
    if (!this.executionMetrics.has(executionId)) {
      this.executionMetrics.set(executionId, { count: 0, totalTime: 0, successCount: 0, failureCount: 0 })
    }

    const metrics = this.executionMetrics.get(executionId)!
    metrics.count++
    metrics.totalTime += duration

    if (success) {
      metrics.successCount++
    } else {
      metrics.failureCount++
    }

    if (duration > 1000) {
      console.warn(`[MiddlewareChain] Slow execution detected: ${executionId} took ${duration.toFixed(2)}ms`)
    }
  }
}