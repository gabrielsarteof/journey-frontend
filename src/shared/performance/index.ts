// Domain exports
export { PerformanceStrategy } from './domain/entities/PerformanceStrategy'
export { PerformanceMetrics } from './domain/entities/PerformanceMetrics'
export { PerformanceConfig } from './domain/value-objects/PerformanceConfig'
export { PerformanceError } from './domain/errors/PerformanceError'
export type { PerformanceAdapter, CacheableAdapter, ThrottleableAdapter } from './domain/abstractions/PerformanceAdapter'

// Application exports
export { OptimizeFunctionUseCase, Result } from './application/use-cases/OptimizeFunctionUseCase'
export { PerformanceOrchestrator } from './application/services/PerformanceOrchestrator'

// Infrastructure exports
export { DebounceAdapter } from './infrastructure/adapters/DebounceAdapter'
export { ThrottleAdapter } from './infrastructure/adapters/ThrottleAdapter'
export { MemoizationAdapter } from './infrastructure/adapters/MemoizationAdapter'
export { PerformanceAdapterFactory } from './infrastructure/factories/PerformanceAdapterFactory'

// Presentation exports - Hooks
export { useDebounce, useDebouncedCallback } from './presentation/hooks/useDebounce'
export { useThrottle } from './presentation/hooks/useThrottle'
export { useMemoization, useMemoizationCache } from './presentation/hooks/useMemoization'
export {
  usePerformanceOptimization,
  useSimpleDebounce,
  useSimpleThrottle,
  useSimpleMemoization
} from './presentation/hooks/usePerformanceOptimization'