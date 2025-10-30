import type { OperationLogger } from '../../infrastructure/logging/OperationLogger';
import { RetryStrategy } from '../../infrastructure/resilience/RetryStrategy';
import { ErrorTransformer } from '../../infrastructure/errors/ErrorTransformer';

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  _isRetry?: boolean;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * HTTP Client base com Dependency Injection
 * Interceptors implementam Chain of Responsibility pattern
 */
export abstract class BaseHttpClient {
  protected abstract readonly baseURL: string;
  protected readonly defaultConfig: HttpRequestConfig = {
    timeout: 10000,
    retries: 3,
    cache: false
  };

  constructor(
    protected readonly logger: OperationLogger,
    protected readonly retryStrategy: RetryStrategy,
    protected readonly errorTransformer: ErrorTransformer
  ) {}

  abstract get<T>(endpoint: string, config?: HttpRequestConfig): Promise<T>;
  abstract post<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T>;
  abstract put<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T>;
  abstract delete<T>(endpoint: string, config?: HttpRequestConfig): Promise<T>;

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    config: HttpRequestConfig = {},
    data?: any
  ): Promise<T> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const url = this.buildUrl(endpoint);
    const operation = `${method} ${url}`;

    this.logger.startOperation('HttpClient', operation);
    const startTime = performance.now();

    try {
      const response = await this.retryStrategy.execute(
        () => this.performRequest<T>(method, url, mergedConfig, data),
        {
          maxAttempts: mergedConfig.retries || 3,
          delayMs: 1000,
          backoffMultiplier: 2,
          shouldRetry: (error) => !this.isClientError(error)
        }
      );

      const duration = performance.now() - startTime;
      this.logger.completeOperation('HttpClient', operation, duration);

      return response.data;
    } catch (error) {
      this.logger.failOperation('HttpClient', operation, error);
      throw this.errorTransformer.transform(error, 'HttpClient', operation);
    }
  }

  protected abstract performRequest<T>(
    method: string,
    url: string,
    config: HttpRequestConfig,
    data?: any
  ): Promise<HttpResponse<T>>;

  protected buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    return `${cleanBaseURL}/${cleanEndpoint}`;
  }

  protected isClientError(_error: unknown): boolean {
    return false;
  }

  // Interceptors para middleware pattern
  protected requestInterceptors: Array<(config: HttpRequestConfig) => HttpRequestConfig> = [];
  protected responseInterceptors: Array<(response: any) => any> = [];

  public addRequestInterceptor(interceptor: (config: HttpRequestConfig) => HttpRequestConfig): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  protected applyRequestInterceptors(config: HttpRequestConfig): HttpRequestConfig {
    return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), config);
  }

  protected applyResponseInterceptors<T>(response: T): T {
    return this.responseInterceptors.reduce((acc, interceptor) => interceptor(acc), response);
  }
}