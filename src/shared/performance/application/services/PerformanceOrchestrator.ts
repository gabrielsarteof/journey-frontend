import type { PerformanceStrategy } from '../../domain/entities/PerformanceStrategy'
import type { PerformanceMetrics } from '../../domain/entities/PerformanceMetrics'
import type { PerformanceAdapter } from '../../domain/abstractions/PerformanceAdapter'
import { OptimizeFunctionUseCase, Result } from '../use-cases/OptimizeFunctionUseCase'
import { PerformanceAdapterFactory } from '../../infrastructure/factories/PerformanceAdapterFactory'
import { PerformanceError } from '../../domain/errors/PerformanceError'
import { CacheService, LocalStorageCacheStrategy } from '@/shared/domain/contracts/CacheService'

interface GlobalMetrics {
  totalOptimizations: number
  totalExecutions: number
  totalCacheHits: number
  startTime: number
}

// Facade pattern com cache integrado para métricas de performance
export class PerformanceOrchestrator {
  private readonly adapters = new Map<string, PerformanceAdapter<never>>()
  private readonly optimizeFunctionUseCase: OptimizeFunctionUseCase
  private readonly cacheService: CacheService
  private readonly globalMetrics: GlobalMetrics = {
    totalOptimizations: 0,
    totalExecutions: 0,
    totalCacheHits: 0,
    startTime: Date.now()
  }

  constructor() {
    const adapterFactory = new PerformanceAdapterFactory()
    this.optimizeFunctionUseCase = new OptimizeFunctionUseCase(adapterFactory)

    // Cache dedicado para métricas de performance
    const cacheStrategy = new LocalStorageCacheStrategy('performance')
    this.cacheService = new CacheService(cacheStrategy)

    this.loadPersistedMetrics()
  }

  optimizeFunction<TArgs extends readonly unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    strategy: PerformanceStrategy
  ): Result<(...args: TArgs) => TReturn, PerformanceError> {

    const result = this.optimizeFunctionUseCase.execute(fn, strategy)

    if (result.isSuccess) {
      // Registra adapter para coleta de métricas
      this.adapters.set(strategy.name, result.value.adapter as PerformanceAdapter<never>)
      this.globalMetrics.totalOptimizations++

      // Persiste métricas globais
      this.persistGlobalMetrics()

      console.debug(`[PerformanceOrchestrator] Function optimized with strategy: ${strategy.name}`)
      return Result.success(result.value.optimizedFn)
    }

    return Result.failure(result.error)
  }

  async getMetrics(strategyName: string): Promise<PerformanceMetrics | null> {
    // Tenta cache primeiro
    const cached = await this.cacheService.get<PerformanceMetrics>(`metrics_${strategyName}`)
    if (cached) {
      return cached
    }

    const adapter = this.adapters.get(strategyName)
    if (adapter) {
      const metrics = adapter.getMetrics()
      // Cache por 30 segundos
      await this.cacheService.set(`metrics_${strategyName}`, metrics, 30000)
      return metrics
    }

    return null
  }

  async getAllMetrics(): Promise<Record<string, PerformanceMetrics>> {
    const cacheKey = 'all_metrics'
    const cached = await this.cacheService.get<Record<string, PerformanceMetrics>>(cacheKey)
    if (cached) {
      return cached
    }

    const metrics: Record<string, PerformanceMetrics> = {}

    for (const [name, adapter] of this.adapters.entries()) {
      metrics[name] = adapter.getMetrics()
    }

    // Cache consolidado por 15 segundos
    await this.cacheService.set(cacheKey, metrics, 15000)
    return metrics
  }

  /**
   * Limpa cache e reseta métricas de uma estratégia específica.
   */
  clearStrategy(strategyName: string): void {
    const adapter = this.adapters.get(strategyName)
    if (adapter) {
      adapter.cleanup()
    }
  }

  /**
   * Limpa todas as estratégias registradas.
   */
  clearAllStrategies(): void {
    for (const adapter of this.adapters.values()) {
      adapter.cleanup()
    }
    this.adapters.clear()
  }

  /**
   * Lista estratégias ativas.
   */
  getActiveStrategies(): string[] {
    return Array.from(this.adapters.keys())
  }

  async generatePerformanceReport(): Promise<{
    totalStrategies: number
    activeStrategies: string[]
    globalMetrics: GlobalMetrics & { uptime: number }
    aggregatedMetrics: {
      totalExecutions: number
      averageCacheHitRate: number
      totalUptime: number
    }
  }> {
    const reportCacheKey = 'performance_report'
    const cached = await this.cacheService.get<any>(reportCacheKey)
    if (cached) {
      return cached
    }

    const activeStrategies = this.getActiveStrategies()
    const allMetrics = await this.getAllMetrics()

    let totalExecutions = 0
    let totalCacheHits = 0
    let totalCacheAttempts = 0
    let maxUptime = 0

    for (const metrics of Object.values(allMetrics)) {
      totalExecutions += metrics.executionCount
      totalCacheHits += metrics.cacheHitRate * metrics.executionCount
      totalCacheAttempts += metrics.executionCount
      maxUptime = Math.max(maxUptime, metrics.uptime)
    }

    const report = {
      totalStrategies: activeStrategies.length,
      activeStrategies,
      globalMetrics: {
        ...this.globalMetrics,
        uptime: Date.now() - this.globalMetrics.startTime
      },
      aggregatedMetrics: {
        totalExecutions,
        averageCacheHitRate: totalCacheAttempts > 0 ? totalCacheHits / totalCacheAttempts : 0,
        totalUptime: maxUptime
      }
    }

    // Cache do relatório por 5 minutos
    await this.cacheService.set(reportCacheKey, report, 5 * 60 * 1000)
    return report
  }

  private async loadPersistedMetrics(): Promise<void> {
    const persisted = await this.cacheService.get<GlobalMetrics>('global_metrics')
    if (persisted) {
      Object.assign(this.globalMetrics, persisted)
    }
  }

  private async persistGlobalMetrics(): Promise<void> {
    await this.cacheService.set('global_metrics', this.globalMetrics, 24 * 60 * 60 * 1000) // 24 horas
  }
}