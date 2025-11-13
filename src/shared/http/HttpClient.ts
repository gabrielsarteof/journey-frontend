import { MiddlewareChain } from '../middleware/MiddlewareChain'
import { RequestInterceptor } from '../middleware/RequestInterceptor'
import { LoggingMiddleware } from '../middleware/LoggingMiddleware'
import { AuthMiddleware } from '../middleware/AuthMiddleware'
import type { MiddlewareContext, RequestContext } from '../middleware'
import { BaseHttpClient, type HttpRequestConfig, type HttpResponse } from '../domain/abstracts/BaseHttpClient'
import { ConsoleOperationLogger } from '../infrastructure/logging/OperationLogger'
import { RetryStrategy } from '../infrastructure/resilience/RetryStrategy'
import { ErrorTransformer } from '../infrastructure/errors/ErrorTransformer'
import type { AuthTokenProvider } from '@/features/auth/domain/services/AuthTokenProvider'
import { useAuthStore } from '@/features/auth/application/stores/authStore'

class RateLimitError extends Error {
  constructor(public retryAfter?: number) {
    super('Rate limit exceeded')
    this.name = 'RateLimitError'
  }
}

export interface HttpClientOptions {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  enableLogging?: boolean
  tokenProvider?: AuthTokenProvider
  enableTokenRefresh?: boolean
  maxRefreshRetries?: number
}

export class HttpClient extends BaseHttpClient {
  protected readonly baseURL: string
  private readonly middlewareChain: MiddlewareChain
  private readonly options: HttpClientOptions
  private isRefreshing = false
  private refreshRetries = 0
  private failedQueue: Array<{
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor(options: HttpClientOptions = {}) {
    super(
      new ConsoleOperationLogger(),
      new RetryStrategy(),
      new ErrorTransformer()
    )
    this.baseURL = options.baseUrl || ''
    this.options = {
      enableLogging: import.meta.env.DEV,
      enableTokenRefresh: true,
      maxRefreshRetries: 3,
      ...options
    }

    this.middlewareChain = new MiddlewareChain()
    this.setupMiddlewares()
  }

  async get<T>(endpoint: string, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('GET', endpoint, config)
  }

  async post<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('POST', endpoint, config, data)
  }

  async put<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('PUT', endpoint, config, data)
  }

  async patch<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('PATCH', endpoint, config, data)
  }

  async delete<T>(endpoint: string, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('DELETE', endpoint, config)
  }

  // Implementação do método abstrato
  protected async performRequest<T>(
    method: string,
    url: string,
    config: HttpRequestConfig,
    data?: any
  ): Promise<HttpResponse<T>> {
    const mergedConfig = this.applyRequestInterceptors({ ...this.defaultConfig, ...config })

    const requestContext: RequestContext = {
      url,
      method,
      headers: { 'Content-Type': 'application/json', ...mergedConfig.headers },
      body: data,
      metadata: {}
    }

    const middlewareContext: MiddlewareContext = {
      request: requestContext,
      metadata: {}
    }

    const processedContext = await this.middlewareChain.execute(middlewareContext)

    if (processedContext.response) {
      return {
        data: processedContext.response.data as T,
        status: processedContext.response.status,
        statusText: processedContext.response.statusText,
        headers: new Headers(processedContext.response.headers as any)
      }
    }

    const response = await this.performFetch(processedContext.request)

    // Intercepta 401 e tenta refresh automático (apenas se não for retry)
    if (response.status === 401 && this.options.enableTokenRefresh && !config._isRetry) {
      const refreshed = await this.handleUnauthorized(method, url, config, data)
      if (refreshed) {
        return refreshed
      }
    }

    // Intercepta 429 e faz retry com exponential backoff + jitter
    if (response.status === 429) {
      const retryAfter = this.extractRetryAfter(response)
      throw new RateLimitError(retryAfter)
    }

    // Throw em caso de erro HTTP
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseData = await this.extractData<T>(response)

    const httpResponse: HttpResponse<T> = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }

    return this.applyResponseInterceptors(httpResponse)
  }

  private async performFetch(request: RequestContext): Promise<Response> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body ? JSON.stringify(request.body) : undefined
    })

    return response
  }

  private async extractData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    return undefined as T
  }

  private setupMiddlewares(): void {
    this.middlewareChain.addMiddleware(
      new RequestInterceptor({
        baseUrl: this.options.baseUrl,
        defaultHeaders: this.options.defaultHeaders
      })
    )

    if (this.options.tokenProvider) {
      this.middlewareChain.addMiddleware(
        new AuthMiddleware(this.options.tokenProvider)
      )
    }

    if (this.options.enableLogging) {
      this.middlewareChain.addMiddleware(new LoggingMiddleware())
    }
  }

  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  private extractRetryAfter(response: Response): number | undefined {
    const retryAfter = response.headers.get('retry-after')
    if (!retryAfter) return undefined

    const seconds = parseInt(retryAfter, 10)
    return isNaN(seconds) ? undefined : seconds
  }

  private async handleUnauthorized<T>(
    method: string,
    url: string,
    config: HttpRequestConfig,
    data?: any
  ): Promise<HttpResponse<T> | null> {
    const authStore = useAuthStore.getState()

    if (url.includes('/auth/refresh')) {
      authStore.setError('Sua sessão expirou. Por favor, faça login novamente.')
      await authStore.logout()
      return null
    }

    if (config._isRetry) {
      authStore.setError('Falha na autenticação após refresh. Por favor, faça login novamente.')
      await authStore.logout()
      return null
    }

    if (this.isRefreshing) {
      return new Promise<HttpResponse<T>>((resolve, reject) => {
        this.failedQueue.push({
          resolve: resolve as (value: any) => void,
          reject
        })
      })
        .then(() => {
          const newConfig = {
            ...config,
            _isRetry: true,
          }
          return this.performRequest<T>(method, url, newConfig, data)
        })
        .catch((err) => {
          throw err
        })
    }

    const maxRefreshRetries = 2
    if (this.refreshRetries >= maxRefreshRetries) {
      this.refreshRetries = 0
      authStore.setError('Múltiplas tentativas de renovação falharam. Por favor, faça login novamente.')
      await authStore.logout()
      return null
    }

    this.isRefreshing = true
    this.refreshRetries++

    try {
      const originalToken = authStore.tokens?.accessToken

      console.log('[HttpClient] Iniciando refresh de token...')
      await authStore.refreshToken()

      const newToken = authStore.tokens?.accessToken

      if (!newToken || newToken === originalToken) {
        throw new Error('Token refresh did not produce a new token')
      }

      console.log('[HttpClient] Processando fila de requisições pendentes')
      this.processQueue(null, newToken)

      this.refreshRetries = 0

      const newConfig = {
        ...config,
        _isRetry: true,
      }

      return await this.performRequest<T>(method, url, newConfig, data)
    } catch (error) {
      console.error('[HttpClient] Falha no refresh de token:', error)
      this.processQueue(error as Error, null)

      await authStore.logout()

      throw error
    } finally {
      this.isRefreshing = false
    }
  }
}