export interface OperationLogger {
  startOperation(context: string, operation: string, metadata?: unknown): void;
  completeOperation(context: string, operation: string, duration: number): void;
  failOperation(context: string, operation: string, error: unknown): void;
}

/**
 * Logger unificado para operações com métricas de performance
 * Elimina duplicação entre BaseRepository, BaseService e BaseHttpClient
 * Implementa padrão Template Method via interface
 */
export class ConsoleOperationLogger implements OperationLogger {
  startOperation(context: string, operation: string, metadata?: unknown): void {
    console.debug(`[${context}] Starting ${operation}`, metadata);
  }

  completeOperation(context: string, operation: string, duration: number): void {
    console.info(`[${context}] ${operation} completed in ${duration.toFixed(2)}ms`);
  }

  failOperation(context: string, operation: string, error: unknown): void {
    console.error(`[${context}] ${operation} failed`, error);
  }
}
