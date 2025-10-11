export interface CircuitBreakerStorage {
  getFailureCount(key: string): number;
  setFailureCount(key: string, count: number): void;
  getLastFailureTime(key: string): number | null;
  setLastFailureTime(key: string, time: number): void;
}

/**
 * Circuit Breaker pattern com storage abstrato
 * Estados: CLOSED (normal) → OPEN (bloqueado) → HALF_OPEN (teste) → CLOSED
 * Implementa DIP: depende de abstração CircuitBreakerStorage
 */
export class CircuitBreaker {
  constructor(
    private readonly storage: CircuitBreakerStorage,
    private readonly config: { failureThreshold: number; resetTimeoutMs: number }
  ) {}

  async execute<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const failures = this.storage.getFailureCount(key);

    if (failures >= this.config.failureThreshold) {
      const lastFailure = this.storage.getLastFailureTime(key);
      if (lastFailure && Date.now() - lastFailure < this.config.resetTimeoutMs) {
        throw new Error(`Circuit breaker OPEN for ${key}`);
      }
      this.storage.setFailureCount(key, 0);
    }

    try {
      const result = await operation();
      this.storage.setFailureCount(key, 0);
      return result;
    } catch (error) {
      this.storage.setFailureCount(key, failures + 1);
      this.storage.setLastFailureTime(key, Date.now());
      throw error;
    }
  }
}

/**
 * Implementação in-memory do CircuitBreakerStorage
 * Usa Map para performance O(1) em read/write
 */
export class InMemoryCircuitBreakerStorage implements CircuitBreakerStorage {
  private failureCounts = new Map<string, number>();
  private lastFailureTimes = new Map<string, number>();

  getFailureCount(key: string): number {
    return this.failureCounts.get(key) || 0;
  }

  setFailureCount(key: string, count: number): void {
    this.failureCounts.set(key, count);
  }

  getLastFailureTime(key: string): number | null {
    return this.lastFailureTimes.get(key) || null;
  }

  setLastFailureTime(key: string, time: number): void {
    this.lastFailureTimes.set(key, time);
  }
}
