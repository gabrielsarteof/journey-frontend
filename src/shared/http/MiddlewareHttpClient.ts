import { MiddlewareChain } from '../middleware/MiddlewareChain'
import { RequestInterceptor } from '../middleware/RequestInterceptor'
import { LoggingMiddleware } from '../middleware/LoggingMiddleware'
import { RetryMiddleware } from '../middleware/RetryMiddleware'
import type {
  MiddlewareContext,
  RequestContext,
  ResponseContext
} from '../abstractions/Middleware'
import { MiddlewarePhase } from '../abstractions/Middleware'

export interface HttpClientOptions {
  baseUrl?: string
  timeout?: number
  defaultHeaders?: Record<string, string>
  enableLogging?: boolean
  enableRetry?: boolean
  retryOptions?: {
    maxAttempts?: number
    baseDelay?: number
  }
}

export class MiddlewareHttpClient {
  private readonly middlewareChain: MiddlewareChain
  private readonly options: HttpClientOptions

  constructor(options: HttpClientOptions = {}) {
    this.options = {
      timeout: 10000,
      enableLogging: import.meta.env.DEV,
      enableRetry: true,
      ...options
    }

    this.middlewareChain = new MiddlewareChain()
    this.setupDefaultMiddlewares()
  }

  async get<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  private async request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const requestContext: RequestContext = {
      url: endpoint,
      method: config.method || 'GET',
      headers: this.buildHeaders(config.headers as Record<string, string>),
      body: config.body,
      metadata: {}
    }

    const middlewareContext: MiddlewareContext = {
      request: requestContext,
      metadata: {}
    }

    try {
      const processedContext = await this.middlewareChain.execute(middlewareContext)

      if (processedContext.response) {
        return processedContext.response.data as T
      }

      const response = await this.performRequest(processedContext.request)
      const responseContext: ResponseContext = {
        status: response.status,
        statusText: response.statusText,
        headers: this.extractHeaders(response),
        data: await this.extractData<T>(response),
        metadata: {}
      }

      const finalContext: MiddlewareContext = {
        ...processedContext,
        response: responseContext
      }

      const result = await this.middlewareChain.execute(finalContext)
      return result.response!.data as T

    } catch (error) {
      const errorContext: MiddlewareContext = {
        ...middlewareContext,
        error: error as Error
      }

      await this.middlewareChain.execute(errorContext)
      throw error
    }
  }

  private async performRequest(request: RequestContext): Promise<Response> {
    const controller = new AbortController()
    const timeout = request.metadata.timeout as number || this.options.timeout

    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body as string,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response

    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('REQUEST_TIMEOUT')
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('NETWORK_ERROR')
      }

      throw error
    }
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.options.defaultHeaders
    }

    return { ...defaultHeaders, ...customHeaders }
  }

  private extractHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  private async extractData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    if (contentType?.includes('text/')) {
      return await response.text() as T
    }

    return undefined as T
  }

  private setupDefaultMiddlewares(): void {
    if (this.options.enableRetry) {
      this.middlewareChain.addMiddleware(
        new RetryMiddleware(this.options.retryOptions),
        MiddlewarePhase.ERROR
      )
    }

    this.middlewareChain.addMiddleware(
      new RequestInterceptor({
        baseUrl: this.options.baseUrl,
        defaultHeaders: this.options.defaultHeaders,
        timeout: this.options.timeout
      }),
      MiddlewarePhase.REQUEST
    )

    if (this.options.enableLogging) {
      this.middlewareChain.addMiddleware(
        new LoggingMiddleware(),
        MiddlewarePhase.REQUEST
      )
    }
  }

  addMiddleware(middleware: any, phase: MiddlewarePhase = MiddlewarePhase.REQUEST): void {
    this.middlewareChain.addMiddleware(middleware, phase)
  }
}