import type { OperationLogger } from '../../infrastructure/logging/OperationLogger';
import { RetryStrategy } from '../../infrastructure/resilience/RetryStrategy';
import type { RetryConfig } from '../../infrastructure/resilience/RetryStrategy';
import { ErrorTransformer } from '../../infrastructure/errors/ErrorTransformer';

/**
 * Repository base com Dependency Injection
 * Responsabilidade única: coordenar operações de repository delegando cross-cutting concerns
 */
export abstract class BaseRepository {
  protected abstract readonly repositoryName: string;

  constructor(
    protected readonly logger: OperationLogger,
    protected readonly retryStrategy: RetryStrategy,
    protected readonly errorTransformer: ErrorTransformer
  ) {}

  protected async executeWithLogging<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.logger.startOperation(this.repositoryName, operation);
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.logger.completeOperation(this.repositoryName, operation, duration);
      return result;
    } catch (error) {
      this.logger.failOperation(this.repositoryName, operation, error);
      throw this.errorTransformer.transform(error, this.repositoryName, operation);
    }
  }

  protected validateRequiredParams(
    params: Record<string, any>,
    required: string[]
  ): void {
    const missing = required.filter(key =>
      params[key] === undefined || params[key] === null || params[key] === ''
    );

    if (missing.length > 0) {
      throw new Error(`Parâmetros obrigatórios não fornecidos: ${missing.join(', ')}`);
    }
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    return this.retryStrategy.execute(operation, {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
      ...config
    });
  }
}