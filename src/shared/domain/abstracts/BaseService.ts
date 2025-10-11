import type { OperationLogger } from '../../infrastructure/logging/OperationLogger';
import { CircuitBreaker } from '../../infrastructure/resilience/CircuitBreaker';
import { ErrorTransformer } from '../../infrastructure/errors/ErrorTransformer';

/**
 * Service base com Dependency Injection
 * Responsabilidade única: coordenar operações de domínio delegando cross-cutting concerns
 */
export abstract class BaseService {
  protected abstract readonly serviceName: string;

  constructor(
    protected readonly logger: OperationLogger,
    protected readonly circuitBreaker: CircuitBreaker,
    protected readonly errorTransformer: ErrorTransformer
  ) {}

  protected async executeWithMetrics<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.logger.startOperation(this.serviceName, operation);
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.logger.completeOperation(this.serviceName, operation, duration);

      if (duration > 1000) {
        console.warn(`[${this.serviceName}] Slow operation: ${operation} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      this.logger.failOperation(this.serviceName, operation, error);
      throw this.errorTransformer.transform(error, this.serviceName, operation);
    }
  }

  protected validateInput<T>(
    input: T,
    validator: (input: T) => boolean,
    errorMessage: string
  ): void {
    if (!validator(input)) {
      throw new Error(errorMessage);
    }
  }

  protected async processWithValidation<TInput, TOutput>(
    input: TInput,
    validator: (input: TInput) => Promise<boolean> | boolean,
    processor: (input: TInput) => Promise<TOutput>,
    operation: string
  ): Promise<TOutput> {
    return this.executeWithMetrics(
      operation,
      async () => {
        const isValid = await validator(input);
        if (!isValid) {
          throw new Error(`Dados de entrada inválidos para operação: ${operation}`);
        }
        return processor(input);
      }
    );
  }

  protected async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    key?: string
  ): Promise<T> {
    const circuitKey = key || `${this.serviceName}_default`;
    return this.circuitBreaker.execute(circuitKey, operation);
  }
}