// Interface para serviços de domínio - segue DDD e Interface Segregation Principle
export interface DomainService {
  readonly serviceName: string;
}

// Interface para validação de entrada
export interface InputValidator<T> {
  validate(input: T): Promise<ValidationResult>;
}

// Interface para métricas de performance
export interface ServiceMetrics {
  trackOperation(operation: string, duration: number, success: boolean): void;
}

// Interface para circuit breaker
export interface CircuitBreaker {
  execute<T>(operation: () => Promise<T>): Promise<T>;
  isOpen(): boolean;
  reset(): void;
}

// Value Object para resultado de validação
export class ValidationResult {
  private constructor(
    private readonly isValidFlag: boolean,
    private readonly errorMessages: string[] = []
  ) {}

  static valid(): ValidationResult {
    return new ValidationResult(true);
  }

  static invalid(errors: string[]): ValidationResult {
    return new ValidationResult(false, errors);
  }

  get isValid(): boolean {
    return this.isValidFlag;
  }

  get errors(): ReadonlyArray<string> {
    return this.errorMessages;
  }

  combine(other: ValidationResult): ValidationResult {
    const allErrors = [...this.errorMessages, ...other.errorMessages];
    const isValid = this.isValidFlag && other.isValidFlag;
    return new ValidationResult(isValid, allErrors);
  }
}

// Decorator para serviços com cross-cutting concerns
export class ServiceDecorator implements DomainService {
  constructor(
    private service: DomainService,
    private metrics?: ServiceMetrics,
    private circuitBreaker?: CircuitBreaker
  ) {}

  get serviceName(): string {
    return this.service.serviceName;
  }

  protected async executeServiceOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      let result: T;

      if (this.circuitBreaker) {
        result = await this.circuitBreaker.execute(fn);
      } else {
        result = await fn();
      }

      const duration = performance.now() - startTime;
      this.metrics?.trackOperation(operation, duration, true);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics?.trackOperation(operation, duration, false);
      throw error;
    }
  }
}

// Template method pattern com interfaces
export interface ServiceTemplate<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export abstract class BaseServiceTemplate<TInput, TOutput> implements ServiceTemplate<TInput, TOutput> {
  constructor(
    protected validator?: InputValidator<TInput>,
    protected metrics?: ServiceMetrics
  ) {}

  async execute(input: TInput): Promise<TOutput> {
    const operationName = this.getOperationName();
    const startTime = performance.now();

    try {
      // Template method steps
      await this.validateInput(input);
      const result = await this.processInput(input);
      await this.postProcess(result);

      const duration = performance.now() - startTime;
      this.metrics?.trackOperation(operationName, duration, true);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics?.trackOperation(operationName, duration, false);
      throw error;
    }
  }

  protected async validateInput(input: TInput): Promise<void> {
    if (this.validator) {
      const result = await this.validator.validate(input);
      if (!result.isValid) {
        throw new Error(`Validation failed: ${result.errors.join(', ')}`);
      }
    }
  }

  protected abstract processInput(input: TInput): Promise<TOutput>;
  protected abstract getOperationName(): string;

  protected async postProcess(_result: TOutput): Promise<void> {
    // Hook method - pode ser sobrescrito
  }
}

// Implementações concretas
export class ConsoleServiceMetrics implements ServiceMetrics {
  trackOperation(operation: string, duration: number, success: boolean): void {
    const status = success ? 'SUCCESS' : 'FAILED';
    console.info(`[Service Metrics] ${operation} ${status} in ${duration.toFixed(2)}ms`);

    if (duration > 1000) {
      console.warn(`[Service Metrics] Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
  }
}

export class SimpleCircuitBreaker implements CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeMs: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  isOpen(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeMs) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  reset(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = 0;
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}