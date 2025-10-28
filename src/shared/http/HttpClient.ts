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

export interface HttpClientOptions {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  enableLogging?: boolean
  tokenProvider?: AuthTokenProvider
}

export class HttpClient extends BaseHttpClient {
  protected readonly baseURL: string
  private readonly middlewareChain: MiddlewareChain
  private readonly options: HttpClientOptions

  constructor(options: HttpClientOptions = {}) {
    super(
      new ConsoleOperationLogger(),
      new RetryStrategy(),
      new ErrorTransformer()
    )
    this.baseURL = options.baseUrl || ''
    this.options = {
      enableLogging: import.meta.env.DEV,
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

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
}