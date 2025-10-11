/**
 * Entity que rastreia métricas de performance para análise de uso.
 * Mantém histórico de execuções e calcula estatísticas úteis.
 */
export class PerformanceMetrics {
  private readonly _executionCount: number
  private readonly _totalDelay: number
  private readonly _cacheHits: number
  private readonly _cacheMisses: number
  private readonly _startTime: number

  constructor(
    executionCount: number,
    totalDelay: number,
    cacheHits: number,
    cacheMisses: number,
    startTime: number
  ) {
    this._executionCount = executionCount
    this._totalDelay = totalDelay
    this._cacheHits = cacheHits
    this._cacheMisses = cacheMisses
    this._startTime = startTime
  }

  static initial(): PerformanceMetrics {
    return new PerformanceMetrics(0, 0, 0, 0, Date.now())
  }

  get executionCount(): number { return this._executionCount }
  get averageDelay(): number {
    return this._executionCount > 0 ? this._totalDelay / this._executionCount : 0
  }
  get cacheHitRate(): number {
    const total = this._cacheHits + this._cacheMisses
    return total > 0 ? this._cacheHits / total : 0
  }
  get uptime(): number { return Date.now() - this._startTime }

  // Immutable updates para tracking de métricas
  incrementExecution(delay = 0): PerformanceMetrics {
    return new PerformanceMetrics(
      this._executionCount + 1,
      this._totalDelay + delay,
      this._cacheHits,
      this._cacheMisses,
      this._startTime
    )
  }

  incrementCacheHit(): PerformanceMetrics {
    return new PerformanceMetrics(
      this._executionCount,
      this._totalDelay,
      this._cacheHits + 1,
      this._cacheMisses,
      this._startTime
    )
  }

  incrementCacheMiss(): PerformanceMetrics {
    return new PerformanceMetrics(
      this._executionCount,
      this._totalDelay,
      this._cacheHits,
      this._cacheMisses + 1,
      this._startTime
    )
  }

  // Combina métricas de diferentes fontes
  combine(other: PerformanceMetrics): PerformanceMetrics {
    return new PerformanceMetrics(
      this._executionCount + other._executionCount,
      this._totalDelay + other._totalDelay,
      this._cacheHits + other._cacheHits,
      this._cacheMisses + other._cacheMisses,
      Math.min(this._startTime, other._startTime)
    )
  }

  toObject(): Record<string, number> {
    return {
      executionCount: this._executionCount,
      averageDelay: this.averageDelay,
      cacheHitRate: this.cacheHitRate,
      uptime: this.uptime
    }
  }
}