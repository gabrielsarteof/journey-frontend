import { useEffect, useCallback, useMemo } from 'react'
import { usePerformanceOptimization } from './usePerformanceOptimization'

interface UseWindowEventsOptions {
  onScroll?: () => void
  onResize?: () => void
  scrollThrottle?: number
  resizeThrottle?: number
  enableScrollOptimization?: boolean
  enableResizeOptimization?: boolean
}

/**
 * Hook para otimização de eventos de janela (scroll/resize) com throttle
 * Implementa Strategy Pattern para performance de eventos DOM
 */
export function useWindowEvents({
  onScroll,
  onResize,
  scrollThrottle = 100,
  resizeThrottle = 250,
  enableScrollOptimization = true,
  enableResizeOptimization = true
}: UseWindowEventsOptions = {}) {

  // Callback estável para scroll
  const scrollCallback = useCallback(() => {
    if (onScroll) {
      onScroll()
    }
  }, [onScroll])

  // Opções de otimização estáveis para scroll
  const scrollOptimizationOptions = useMemo(() => ({
    strategy: 'throttle' as const,
    delay: scrollThrottle
  }), [scrollThrottle])

  const { optimizedFn: throttledScroll, metrics: scrollMetrics } = usePerformanceOptimization(
    scrollCallback,
    scrollOptimizationOptions
  )

  // Callback estável para resize
  const resizeCallback = useCallback(() => {
    if (onResize) {
      onResize()
    }
  }, [onResize])

  // Opções de otimização estáveis para resize
  const resizeOptimizationOptions = useMemo(() => ({
    strategy: 'throttle' as const,
    delay: resizeThrottle
  }), [resizeThrottle])

  const { optimizedFn: throttledResize, metrics: resizeMetrics } = usePerformanceOptimization(
    resizeCallback,
    resizeOptimizationOptions
  )

  useEffect(() => {
    if (!onScroll && !onResize) return

    const handleScroll = enableScrollOptimization ? throttledScroll : scrollCallback
    const handleResize = enableResizeOptimization ? throttledResize : resizeCallback

    if (onScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    if (onResize) {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (onScroll) {
        window.removeEventListener('scroll', handleScroll)
      }
      if (onResize) {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [
    onScroll,
    onResize,
    enableScrollOptimization,
    enableResizeOptimization,
    throttledScroll,
    throttledResize,
    scrollCallback,
    resizeCallback
  ])

  return {
    scrollMetrics,
    resizeMetrics
  }
}