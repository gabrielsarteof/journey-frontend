// Interface Segregation Principle - separando leitura e escrita
export interface CacheReader {
  get<T>(key: string): Promise<T | null>;
  has(key: string): Promise<boolean>;
}

export interface CacheWriter {
  set(key: string, value: unknown, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
}

export interface CacheServiceContract extends CacheReader, CacheWriter {}

// Strategy pattern para algoritmos de cache intercambiáveis
export interface CacheStrategy {
  readonly strategyName: string;
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(pattern?: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

// Observer pattern para métricas e auditoria
export interface CacheObserver {
  onHit(key: string): void;
  onMiss(key: string): void;
  onSet(key: string, ttlMs?: number): void;
  onDelete(key: string): void;
  onError(operation: string, error: Error): void;
}

// Composite pattern com fallback strategy
export class CacheService implements CacheServiceContract {
  private observers: CacheObserver[] = [];

  constructor(
    private strategy: CacheStrategy,
    private fallbackStrategy?: CacheStrategy
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.strategy.get<T>(key);

      if (result !== null) {
        this.notifyObservers(observer => observer.onHit(key));
      } else {
        this.notifyObservers(observer => observer.onMiss(key));

        // Cache-aside pattern com fallback
        if (this.fallbackStrategy) {
          const fallbackResult = await this.fallbackStrategy.get<T>(key);
          if (fallbackResult !== null) {
            // Write-through para sincronizar strategies
            await this.strategy.set(key, fallbackResult);
            this.notifyObservers(observer => observer.onHit(key));
            return fallbackResult;
          }
        }
      }

      return result;
    } catch (error) {
      this.notifyObservers(observer => observer.onError('get', error as Error));

      if (this.fallbackStrategy) {
        try {
          return await this.fallbackStrategy.get<T>(key);
        } catch (fallbackError) {
          this.notifyObservers(observer => observer.onError('fallback_get', fallbackError as Error));
        }
      }

      throw error;
    }
  }

  async set(key: string, value: unknown, ttlMs?: number): Promise<void> {
    try {
      await this.strategy.set(key, value, ttlMs);
      this.notifyObservers(observer => observer.onSet(key, ttlMs));

      // Write-through pattern para manter consistência
      if (this.fallbackStrategy) {
        try {
          await this.fallbackStrategy.set(key, value, ttlMs);
        } catch (error) {
          this.notifyObservers(observer => observer.onError('fallback_set', error as Error));
        }
      }
    } catch (error) {
      this.notifyObservers(observer => observer.onError('set', error as Error));
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.strategy.delete(key);
      this.notifyObservers(observer => observer.onDelete(key));

      if (this.fallbackStrategy) {
        try {
          await this.fallbackStrategy.delete(key);
        } catch (error) {
          this.notifyObservers(observer => observer.onError('fallback_delete', error as Error));
        }
      }
    } catch (error) {
      this.notifyObservers(observer => observer.onError('delete', error as Error));
      throw error;
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      await this.strategy.clear(pattern);

      if (this.fallbackStrategy) {
        try {
          await this.fallbackStrategy.clear(pattern);
        } catch (error) {
          this.notifyObservers(observer => observer.onError('fallback_clear', error as Error));
        }
      }
    } catch (error) {
      this.notifyObservers(observer => observer.onError('clear', error as Error));
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return await this.strategy.has(key);
    } catch (error) {
      this.notifyObservers(observer => observer.onError('has', error as Error));

      if (this.fallbackStrategy) {
        try {
          return await this.fallbackStrategy.has(key);
        } catch (fallbackError) {
          this.notifyObservers(observer => observer.onError('fallback_has', fallbackError as Error));
        }
      }

      throw error;
    }
  }

  addObserver(observer: CacheObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: CacheObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(action: (observer: CacheObserver) => void): void {
    this.observers.forEach(observer => {
      try {
        action(observer);
      } catch (error) {
        console.error('Error notifying cache observer:', error);
      }
    });
  }
}

// Concrete Strategy para localStorage com TTL
export class LocalStorageCacheStrategy implements CacheStrategy {
  readonly strategyName = 'localStorage';

  constructor(private readonly prefix: string = 'cache') {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key);
      const stored = localStorage.getItem(fullKey);

      if (!stored) {
        return null;
      }

      const entry = JSON.parse(stored);

      if (this.isExpired(entry)) {
        await this.delete(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.error(`LocalStorage get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttlMs: number = 5 * 60 * 1000): Promise<void> {
    try {
      const fullKey = this.buildKey(key);
      const entry = {
        value,
        expiresAt: Date.now() + ttlMs,
        createdAt: Date.now()
      };

      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      console.error(`LocalStorage set error for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const fullKey = this.buildKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`LocalStorage delete error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${this.prefix}:`)) {
          if (!pattern || key.includes(pattern)) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('LocalStorage clear error:', error);
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key);
      const stored = localStorage.getItem(fullKey);

      if (!stored) {
        return false;
      }

      const entry = JSON.parse(stored);

      if (this.isExpired(entry)) {
        await this.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`LocalStorage has error for key ${key}:`, error);
      return false;
    }
  }

  private buildKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  private isExpired(entry: any): boolean {
    return Date.now() > entry.expiresAt;
  }
}

// Observer concreto para métricas com hit rate calculation
export class CacheMetricsObserver implements CacheObserver {
  private hitCount = 0;
  private missCount = 0;
  private errorCount = 0;

  onHit(key: string): void {
    this.hitCount++;
    console.debug(`[Cache] HIT: ${key} (hit rate: ${this.getHitRate().toFixed(2)}%)`);
  }

  onMiss(key: string): void {
    this.missCount++;
    console.debug(`[Cache] MISS: ${key} (hit rate: ${this.getHitRate().toFixed(2)}%)`);
  }

  onSet(key: string, ttlMs?: number): void {
    console.debug(`[Cache] SET: ${key} (TTL: ${ttlMs}ms)`);
  }

  onDelete(key: string): void {
    console.debug(`[Cache] DELETE: ${key}`);
  }

  onError(operation: string, error: Error): void {
    this.errorCount++;
    console.error(`[Cache] ERROR in ${operation}:`, error.message);
  }

  getMetrics() {
    return {
      hits: this.hitCount,
      misses: this.missCount,
      errors: this.errorCount,
      hitRate: this.getHitRate()
    };
  }

  private getHitRate(): number {
    const total = this.hitCount + this.missCount;
    return total === 0 ? 0 : (this.hitCount / total) * 100;
  }

  reset(): void {
    this.hitCount = 0;
    this.missCount = 0;
    this.errorCount = 0;
  }
}