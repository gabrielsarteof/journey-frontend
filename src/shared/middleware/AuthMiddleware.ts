import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'

export interface AuthMiddlewareOptions {
  tokenGetter: () => string | null
}

export class AuthMiddleware extends BaseMiddleware {
  private readonly tokenGetter: () => string | null

  constructor(options: AuthMiddlewareOptions) {
    super('AuthMiddleware')
    this.tokenGetter = options.tokenGetter
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    const token = this.tokenGetter()

    if (token) {
      const modifiedContext: MiddlewareContext = {
        ...context,
        request: {
          ...context.request,
          headers: {
            ...context.request.headers,
            'Authorization': `Bearer ${token}`
          }
        }
      }

      return await next(modifiedContext)
    }

    return await next(context)
  }
}