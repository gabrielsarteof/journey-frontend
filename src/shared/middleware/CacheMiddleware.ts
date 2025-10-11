import { BaseMiddleware } from '../abstractions/Middleware'
import type { MiddlewareContext, MiddlewareNext } from '../abstractions/Middleware'

interface CacheEntry {
  data: unknown
  timestamp: number
  ttl: number
  headers: Record<string, string>
}

export interface CacheOptions {
  defaultTtl?: number
  maxSize?: number
  storage?: 'memory' | 'sessionStorage'
  cacheableStatusCodes?: number[]
  cacheableMethods?: string[]
  keyGenerator?: (context: MiddlewareContext) => string
}

export class CacheMiddleware extends BaseMiddleware {
  private readonly cache = new Map<string, CacheEntry>()
  private readonly options: Required<CacheOptions>

  constructor(options: CacheOptions = {}) {
    super('CacheMiddleware')
    this.options = {
      defaultTtl: 5 * 60 * 1000, // 5 minutes
      maxSize: 100,
      storage: 'memory',
      cacheableStatusCodes: [200, 201, 202, 204, 300, 301, 302, 304],
      cacheableMethods: ['GET', 'HEAD'],
      keyGenerator: (ctx) => `${ctx.request.method}:${ctx.request.url}`,
      ...options
    }
  }

  async execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext> {
    const cacheKey = this.options.keyGenerator(context)

    if (this.shouldUseCache(context)) {
      const cachedEntry = this.getFromCache(cacheKey)

      if (cachedEntry && !this.isExpired(cachedEntry)) {
        this.log('info', 'Cache hit', { key: cacheKey, url: context.request.url })

        return {
          ...context,
          response: {
            status: 200,
            statusText: 'OK',
            headers: { ...cachedEntry.headers, 'x-cache': 'HIT' },
            data: cachedEntry.data,
            metadata: { fromCache: true }
          }
        }
      }
    }

    const result = await next(context)

    if (this.shouldCache(context, result)) {
      this.saveToCache(cacheKey, result)
    }

    return result
  }

  private shouldUseCache(context: MiddlewareContext): boolean {
    return this.options.cacheableMethods.includes(context.request.method.toUpperCase())
  }

  private shouldCache(context: MiddlewareContext, result: MiddlewareContext): boolean {
    if (!this.shouldUseCache(context)) return false
    if (!result.response) return false

    return this.options.cacheableStatusCodes.includes(result.response.status)
  }

  private getFromCache(key: string): CacheEntry | null {
    if (this.options.storage === 'sessionStorage' && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(`cache:${key}`)
        return stored ? JSON.parse(stored) : null
      } catch {
        return null
      }
    }

    return this.cache.get(key) || null
  }

  private saveToCache(key: string, result: MiddlewareContext): void {
    if (!result.response) return

    const entry: CacheEntry = {
      data: result.response.data,
      timestamp: Date.now(),
      ttl: this.getTtl(result),
      headers: result.response.headers
    }

    if (this.options.storage === 'sessionStorage' && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`cache:${key}`, JSON.stringify(entry))
      } catch (error) {
        this.log('warn', 'Failed to save to sessionStorage', { error })
      }
      return
    }

    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, entry)
    this.log('info', 'Cached response', { key, ttl: entry.ttl })
  }

  private getTtl(result: MiddlewareContext): number {
    const cacheControl = result.response?.headers['cache-control']

    if (cacheControl) {
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/)
      if (maxAgeMatch) {
        return parseInt(maxAgeMatch[1]) * 1000
      }
    }

    return this.options.defaultTtl
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private evictOldest(): void {
    const oldestKey = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0]?.[0]

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  clearCache(): void {
    this.cache.clear()

    if (this.options.storage === 'sessionStorage' && typeof window !== 'undefined') {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache:')) {
          sessionStorage.removeItem(key)
        }
      })
    }
  }

  getCacheSize(): number {
    return this.cache.size
  }
}