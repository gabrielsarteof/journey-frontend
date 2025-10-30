import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'
import { useAuthStore } from '@/features/auth/application/stores/authStore'

/**
 * Middleware que intercepta HTTP 401 e executa refresh automático via refresh token.
 *
 * Estratégias implementadas:
 * - Request queuing: serializa chamadas de refresh quando múltiplas requests falham simultaneamente
 * - Retry com flag _isRetry: evita recursão infinita em caso de falha persistente
 * - Logout em cascata: invalida sessão local se refresh retornar 401
 */
export class TokenRefreshMiddleware extends BaseMiddleware {
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor() {
    super('TokenRefreshMiddleware')
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    try {
      const resultContext = await next(context)

      if (!resultContext.response || resultContext.response.status !== 401) {
        return resultContext
      }

      // Bypass: endpoint de refresh não deve triggerar novo refresh (evita loop)
      if (context.request.url.includes('/auth/refresh')) {
        return resultContext
      }

      // Retry já executado: força logout se ainda retornar 401
      if (context.metadata._isRetry) {
        await useAuthStore.getState().logout()
        return resultContext
      }

      const originalRequest = context.request

      // Enfileira request se refresh já está em andamento
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject })
        }).then(() => {
          // Retry após refresh completar
          return next({
            ...context,
            metadata: { ...context.metadata, _isRetry: true }
          })
        }).catch((error) => {
          throw error
        }) as Promise<MiddlewareContext>
      }

      this.isRefreshing = true

      try {
        // POST /auth/refresh com refreshToken no body
        await useAuthStore.getState().refreshToken()

        // Desbloqueia fila de requests pendentes
        this.processQueue(null, 'token-refreshed')

        // Retry request original com novo accessToken
        return await next({
          ...context,
          metadata: { ...context.metadata, _isRetry: true }
        })
      } catch (refreshError) {
        // Refresh falhou (401/403): limpa sessão local
        this.processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'), null)
        await useAuthStore.getState().logout()

        throw refreshError
      } finally {
        this.isRefreshing = false
      }
    } catch (error) {
      if (context.response) {
        return context
      }
      throw error
    }
  }
}
