import { BasePerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { CacheableAdapter } from '../../domain/abstractions/PerformanceAdapter'
import type { PerformanceConfig } from '../../domain/value-objects/PerformanceConfig'

interface CacheEntry<TReturn> {
  value: TReturn
  timestamp: number
  accessCount: number
}

/**
 * Implementa memoização com LRU cache e TTL.
 * Otimiza funções puras cachando resultados baseados nos argumentos.
 */
export class MemoizationAdapter<
  TArgs extends readonly unknown[],
  TReturn
> extends BasePerformanceAdapter<(...args: TArgs) => TReturn> implements CacheableAdapter {

  private readonly cache = new Map<string, CacheEntry<TReturn>>()
  private readonly config: PerformanceConfig

  constructor(config: PerformanceConfig) {
    super()
    this.config = config
  }

  optimize(fn: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn {
    return (...args: TArgs): TReturn => {
      const key = this.createCacheKey(args)
      const cached = this.cache.get(key)

      // Cache hit - verifica validade
      if (cached && this.isValidCache(cached)) {
        this.updateCacheAccess(key, cached)
        this.metrics = this.metrics.incrementCacheHit()
        return cached.value
      }

      // Cache miss - executa função e armazena resultado
      const startTime = performance.now()
      try {
        const result = fn(...args)
        const duration = performance.now() - startTime

        this.storeInCache(key, result)
        this.metrics = this.metrics.incrementCacheMiss().incrementExecution(duration)

        return result
      } catch (error) {
        this.metrics = this.metrics.incrementCacheMiss()
        throw error
      }
    }
  }

  private createCacheKey(args: TArgs): string {
    // Em implementação real, seria melhor usar uma biblioteca específica
    // para serialização que lida com casos edge como circular references
    try {
      return JSON.stringify(args)
    } catch {
      // Fallback para casos onde JSON.stringify falha
      return args.map(arg => String(arg)).join('|')
    }
  }

  private isValidCache(entry: CacheEntry<TReturn>): boolean {
    const now = Date.now()
    return now - entry.timestamp < this.config.ttl
  }

  private updateCacheAccess(key: string, entry: CacheEntry<TReturn>): void {
    // Atualiza contador de acesso para algoritmo LRU
    this.cache.set(key, {
      ...entry,
      accessCount: entry.accessCount + 1
    })
  }

  private storeInCache(key: string, value: TReturn): void {
    // Implementa LRU eviction se cache estiver cheio
    if (this.cache.size >= this.config.cacheSize) {
      this.evictLeastRecentlyUsed()
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1
    })
  }

  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null
    let lruAccessCount = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < lruAccessCount) {
        lruAccessCount = entry.accessCount
        lruKey = key
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }

  cleanup(): void {
    this.clearCache()
    super.cleanup()
  }
}