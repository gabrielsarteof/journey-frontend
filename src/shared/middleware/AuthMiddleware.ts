import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'
import { AuthTokenProvider } from '@/features/auth/domain/services/AuthTokenProvider'

/**
 * Middleware responsável por injetar o token JWT no header Authorization.
 *
 * Recebe AuthTokenProvider via construtor para desacoplar a lógica de obtenção
 * de token da lógica de interceptação HTTP.
 */
export class AuthMiddleware extends BaseMiddleware {
  constructor(private readonly tokenProvider: AuthTokenProvider) {
    super('AuthMiddleware')
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    const token = this.tokenProvider.getCurrentAccessToken()

    if (token) {
      const modifiedContext: MiddlewareContext = {
        ...context,
        request: {
          ...context.request,
          headers: {
            ...context.request.headers,
            'Authorization': `Bearer ${token.getValue()}`
          }
        }
      }

      return await next(modifiedContext)
    }

    return await next(context)
  }
}