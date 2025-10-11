import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'

export interface RequestInterceptorOptions {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  timeout?: number
}

export class RequestInterceptor extends BaseMiddleware {
  private readonly options: RequestInterceptorOptions

  constructor(options: RequestInterceptorOptions = {}) {
    super('RequestInterceptor')
    this.options = options
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    const modifiedContext = this.applyInterceptions(context)
    return await next(modifiedContext)
  }

  private applyInterceptions(context: MiddlewareContext): MiddlewareContext {
    let url = context.request.url

    if (this.options.baseUrl && !url.startsWith('http')) {
      url = `${this.options.baseUrl}${url}`
    }

    const headers = {
      ...this.options.defaultHeaders,
      ...context.request.headers
    }

    const metadata = {
      ...context.request.metadata,
      ...(this.options.timeout && { timeout: this.options.timeout })
    }

    return {
      ...context,
      request: {
        ...context.request,
        url,
        headers,
        metadata
      }
    }
  }
}