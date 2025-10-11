import { useMemo, useState, useEffect, useId } from 'react'
import { PerformanceStrategy } from '../../domain/entities/PerformanceStrategy'
import { PerformanceConfig } from '../../domain/value-objects/PerformanceConfig'
import { PerformanceOrchestrator } from '../../application/services/PerformanceOrchestrator'
import type { PerformanceMetrics } from '../../domain/entities/PerformanceMetrics'
import type { PerformanceError } from '../../domain/errors/PerformanceError'

interface UsePerformanceOptimizationOptions {
  strategy: 'debounce' | 'throttle' | 'memoization'
  delay?: number
  leading?: boolean
  trailing?: boolean
  cacheSize?: number
  ttl?: number
}

/**
 * Hook principal que integra todo o sistema de performance.
 * Demonstra uso da arquitetura completa em contexto React.
 */
export function usePerformanceOptimization<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: UsePerformanceOptimizationOptions
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [error, setError] = useState<PerformanceError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Gera ID estável que persiste entre re-renders
  const stableId = useId()

  // Inicializa orchestrator uma única vez
  const orchestrator = useMemo(() => new PerformanceOrchestrator(), [])

  // Cria estratégia baseada nas opções - usa valores primitivos nas dependências
  const strategy = useMemo(() => {
    const config = PerformanceConfig.create({
      delay: options.delay,
      leading: options.leading,
      trailing: options.trailing,
      cacheSize: options.cacheSize,
      ttl: options.ttl
    })

    // Usa ID estável ao invés de Date.now()
    const strategyName = `${options.strategy}_${stableId}`

    switch (options.strategy) {
      case 'debounce':
        return PerformanceStrategy.createDebounce(strategyName, config)
      case 'throttle':
        return PerformanceStrategy.createThrottle(strategyName, config)
      case 'memoization':
        return PerformanceStrategy.createMemoization(strategyName, config)
    }
  }, [
    options.strategy,
    options.delay,
    options.leading,
    options.trailing,
    options.cacheSize,
    options.ttl,
    stableId
  ])

  // Otimiza função quando estratégia ou função mudam
  const optimizedFn = useMemo(() => {
    setIsLoading(true)
    setError(null)

    const result = orchestrator.optimizeFunction(fn, strategy)

    if (result.isFailure) {
      setError(result.error)
      setIsLoading(false)
      return fn // Fallback para função original
    }

    setIsLoading(false)
    return result.value
  }, [fn, strategy, orchestrator])

  // Atualiza métricas periodicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentMetrics = await orchestrator.getMetrics(strategy.name)
      if (currentMetrics) {
        setMetrics(currentMetrics)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [orchestrator, strategy.name])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      orchestrator.clearStrategy(strategy.name)
    }
  }, [orchestrator, strategy.name])

  return {
    optimizedFn,
    metrics,
    error,
    isLoading,
    clearCache: () => orchestrator.clearStrategy(strategy.name),
    getReport: () => orchestrator.generatePerformanceReport()
  }
}

/**
 * Hook simplificado para casos comuns de debounce.
 */
export function useSimpleDebounce<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay = 300
) {
  return usePerformanceOptimization(fn, {
    strategy: 'debounce',
    delay
  })
}

/**
 * Hook simplificado para casos comuns de throttle.
 */
export function useSimpleThrottle<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  delay = 100
) {
  return usePerformanceOptimization(fn, {
    strategy: 'throttle',
    delay,
    leading: true,
    trailing: true
  })
}

/**
 * Hook simplificado para casos comuns de memoização.
 */
export function useSimpleMemoization<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  cacheSize = 50
) {
  return usePerformanceOptimization(fn, {
    strategy: 'memoization',
    cacheSize
  })
}