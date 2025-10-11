// Interface em vez de abstract class - favorece composição sobre herança
export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
  findAll(): Promise<T[]>;
}

// Interface para logging strategy
export interface RepositoryLogger {
  logOperation(operation: string, context: Record<string, any>): void;
  logError(operation: string, error: Error, context: Record<string, any>): void;
}

// Interface para error handling strategy
export interface RepositoryErrorHandler {
  handleError(error: unknown, operation: string): Error;
}

// Interface para metrics tracking
export interface RepositoryMetrics {
  startOperation(operation: string): string;
  endOperation(operationId: string, success: boolean): void;
}

// Composição - implementação base opcional usando interfaces
export class BaseRepositoryDecorator<T, ID> implements Repository<T, ID> {
  constructor(
    private repository: Repository<T, ID>,
    private logger?: RepositoryLogger,
    private errorHandler?: RepositoryErrorHandler,
    private metrics?: RepositoryMetrics
  ) {}

  async findById(id: ID): Promise<T | null> {
    return this.executeWithDecorators('findById', () => this.repository.findById(id), { id });
  }

  async save(entity: T): Promise<T> {
    return this.executeWithDecorators('save', () => this.repository.save(entity), { entity });
  }

  async update(id: ID, entity: Partial<T>): Promise<T> {
    return this.executeWithDecorators('update', () => this.repository.update(id, entity), { id, entity });
  }

  async delete(id: ID): Promise<void> {
    return this.executeWithDecorators('delete', () => this.repository.delete(id), { id });
  }

  async findAll(): Promise<T[]> {
    return this.executeWithDecorators('findAll', () => this.repository.findAll());
  }

  private async executeWithDecorators<R>(
    operation: string,
    fn: () => Promise<R>,
    context: Record<string, any> = {}
  ): Promise<R> {
    const operationId = this.metrics?.startOperation(operation);

    this.logger?.logOperation(operation, context);

    try {
      const result = await fn();
      this.metrics?.endOperation(operationId!, true);
      return result;
    } catch (error) {
      this.metrics?.endOperation(operationId!, false);
      this.logger?.logError(operation, error as Error, context);

      const handledError = this.errorHandler?.handleError(error, operation) || error;
      throw handledError;
    }
  }
}

// Implementações concretas das strategies
export class ConsoleRepositoryLogger implements RepositoryLogger {
  logOperation(operation: string, context: Record<string, any>): void {
    console.debug(`[Repository] ${operation}`, context);
  }

  logError(operation: string, error: Error, context: Record<string, any>): void {
    console.error(`[Repository] ${operation} failed:`, { error: error.message, context });
  }
}

export class DefaultRepositoryErrorHandler implements RepositoryErrorHandler {
  handleError(error: unknown, operation: string): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(`Repository operation '${operation}' failed: ${String(error)}`);
  }
}

export class PerformanceRepositoryMetrics implements RepositoryMetrics {
  private operations = new Map<string, number>();

  startOperation(operation: string): string {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    this.operations.set(operationId, performance.now());
    return operationId;
  }

  endOperation(operationId: string, success: boolean): void {
    const startTime = this.operations.get(operationId);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.info(`[Repository Metrics] Operation ${operationId} ${success ? 'succeeded' : 'failed'} in ${duration.toFixed(2)}ms`);
      this.operations.delete(operationId);
    }
  }
}