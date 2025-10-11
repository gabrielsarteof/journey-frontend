import { CacheService, LocalStorageCacheStrategy, CacheMetricsObserver, type CacheServiceContract } from '@/shared/domain/contracts/CacheService';

export class LocalStorageCacheService implements CacheServiceContract {
  private readonly cacheService: CacheService
  private readonly metricsObserver: CacheMetricsObserver
  private readonly cachePrefix = 'app_cache';

  constructor() {
    const strategy = new LocalStorageCacheStrategy(this.cachePrefix)
    this.cacheService = new CacheService(strategy)
    this.metricsObserver = new CacheMetricsObserver()
    this.cacheService.addObserver(this.metricsObserver)
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.cacheService.get<T>(key)
    } catch (error) {
      console.warn(`[LocalStorageCacheService] Get failed for key: ${key}`, error)
      return null
    }
  }

  async set(key: string, value: unknown, ttlMs: number = 5 * 60 * 1000): Promise<void> {
    try {
      await this.cacheService.set(key, value, ttlMs)
    } catch (error) {
      console.warn(`[LocalStorageCacheService] Set failed for key: ${key}`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheService.delete(key)
    } catch (error) {
      console.warn(`[LocalStorageCacheService] Delete failed for key: ${key}`, error)
      throw error
    }
  }

  async clear(pattern?: string): Promise<void> {
    try {
      await this.cacheService.clear(pattern)
    } catch (error) {
      console.warn(`[LocalStorageCacheService] Clear failed for pattern: ${pattern}`, error)
      throw error
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return await this.cacheService.has(key)
    } catch (error) {
      console.warn(`[LocalStorageCacheService] Has failed for key: ${key}`, error)
      return false
    }
  }

  async cleanup(): Promise<number> {
    try {
      await this.clear()
      return 1
    } catch (error) {
      console.error(`[LocalStorageCacheService] Cleanup failed:`, error)
      return 0
    }
  }

  getMetrics() {
    return this.metricsObserver.getMetrics()
  }

  resetMetrics(): void {
    this.metricsObserver.reset()
  }
}