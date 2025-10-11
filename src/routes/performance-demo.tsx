import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import {
  useDebounce,
  useThrottle,
  useMemoization,
  usePerformanceOptimization,
  useSimpleDebounce
} from '../shared/performance'
import { useNotificationActions } from '../shared/contexts/NotificationContext'

// Função pesada para demonstrar memoização
const expensiveCalculation = (n: number): number => {
  let result = 0
  for (let i = 0; i < n * 1000000; i++) {
    result += Math.sqrt(i)
  }
  return result
}

// Simulação de API call para demonstrar debounce
const simulateApiCall = async (query: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    `Result 1 for "${query}"`,
    `Result 2 for "${query}"`,
    `Result 3 for "${query}"`
  ]
}

function PerformanceDemoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scrollCount, setScrollCount] = useState(0)
  const [calculationInput, setCalculationInput] = useState(10)
  const [apiResults, setApiResults] = useState<string[]>([])
  const [apiCallCount, setApiCallCount] = useState(0)
  const { info } = useNotificationActions()

  // Debounce demo
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Debounce para API calls
  const debouncedApiCall = useCallback(async (query: string) => {
    if (!query.trim()) {
      setApiResults([])
      return
    }

    setApiCallCount(prev => prev + 1)
    try {
      const results = await simulateApiCall(query)
      setApiResults(results)
      info('API Call', `Search completed for: ${query}`)
    } catch (error) {
      console.error('API call failed:', error)
    }
  }, [info])

  const { optimizedFn: optimizedApiCall } = useSimpleDebounce(debouncedApiCall, 800)

  // Throttle demo para scroll
  const throttledScrollHandler = useThrottle(
    useCallback(() => {
      setScrollCount(prev => prev + 1)
    }, []),
    100,
    { leading: true, trailing: true }
  )

  // Memoization demo
  const memoizedCalculation = useMemoization(
    expensiveCalculation,
    [calculationInput],
    { cacheSize: 10, ttl: 30000 }
  )

  // Performance optimization avançado
  const advancedMemoization = usePerformanceOptimization(
    expensiveCalculation,
    {
      strategy: 'memoization',
      cacheSize: 20,
      ttl: 60000
    }
  )

  // Executa API call quando query debounced muda
  useState(() => {
    optimizedApiCall(debouncedSearchQuery)
  })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-journeyBlack dark:text-white mb-4">
          Performance Hooks Demo
        </h1>
        <p className="text-journeyGrayText dark:text-gray-300">
          Demonstração prática do sistema de otimização de performance com Clean Architecture
        </p>
      </div>

      {/* Debounce Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          🔄 Debounce Demo - Search Input
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Search Query (debounced 500ms):
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Immediate Value:</p>
              <p className="text-blue-600 dark:text-blue-400">"{searchQuery}"</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Debounced Value:</p>
              <p className="text-green-600 dark:text-green-400">"{debouncedSearchQuery}"</p>
            </div>
          </div>

          {/* API Results */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-journeyBlack dark:text-white">
              API Results (API Calls: {apiCallCount})
            </h3>
            {apiResults.length > 0 ? (
              <ul className="space-y-1">
                {apiResults.map((result, index) => (
                  <li key={index} className="p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm">
                    {result}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Type something to search...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Throttle Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          ⚡ Throttle Demo - Scroll Events
        </h2>

        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Scroll na área abaixo para ver o throttling em ação (max 1 evento per 100ms):
          </p>

          <div
            className="h-40 overflow-auto bg-gray-100 dark:bg-gray-700 p-4 rounded"
            onScroll={throttledScrollHandler}
          >
            <div className="h-80 bg-gradient-to-b from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 rounded p-4">
              <p className="text-center text-blue-800 dark:text-blue-200">
                Scroll Count: {scrollCount}
              </p>
              <div className="mt-8 text-center text-blue-700 dark:text-blue-300">
                Keep scrolling to see throttled updates...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memoization Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          🧠 Memoization Demo - Expensive Calculations
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Calculation Input (cached for 30s):
            </label>
            <input
              type="number"
              value={calculationInput}
              onChange={(e) => setCalculationInput(parseInt(e.target.value) || 10)}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Memoized Result:</h3>
              <p className="text-lg font-mono text-green-600 dark:text-green-400">
                {memoizedCalculation.toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Advanced Optimization:</h3>
              {advancedMemoization.isLoading ? (
                <p className="text-yellow-600 dark:text-yellow-400">Calculating...</p>
              ) : advancedMemoization.error ? (
                <p className="text-red-600 dark:text-red-400">Error occurred</p>
              ) : (
                <p className="text-lg font-mono text-blue-600 dark:text-blue-400">
                  {advancedMemoization.optimizedFn(calculationInput).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Metrics */}
          {advancedMemoization.metrics && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded">
              <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Performance Metrics:</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Executions:</span>
                  <span className="ml-2 font-mono">{advancedMemoization.metrics.executionCount}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Cache Hit Rate:</span>
                  <span className="ml-2 font-mono">
                    {(advancedMemoization.metrics.cacheHitRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Avg Delay:</span>
                  <span className="ml-2 font-mono">
                    {advancedMemoization.metrics.averageDelay.toFixed(2)}ms
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Architecture Benefits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-journeyBlack dark:text-white">
          🏗️ Benefícios Arquiteturais Demonstrados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-green-600 dark:text-green-400">Clean Architecture</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Domain Layer: Entities e Value Objects</li>
              <li>• Application Layer: Use Cases e Services</li>
              <li>• Infrastructure Layer: Adapters concretos</li>
              <li>• Presentation Layer: React Hooks</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-blue-600 dark:text-blue-400">SOLID Principles</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Single Responsibility: Cada classe uma função</li>
              <li>• Open/Closed: Extensível via Strategy Pattern</li>
              <li>• Liskov Substitution: Adapters intercambiáveis</li>
              <li>• Interface Segregation: Interfaces específicas</li>
              <li>• Dependency Inversion: Abstrações não dependem de detalhes</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Design Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Strategy Pattern: Algoritmos intercambiáveis</li>
              <li>• Factory Pattern: Criação de adapters</li>
              <li>• Facade Pattern: PerformanceOrchestrator</li>
              <li>• Result Pattern: Error handling robusto</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-orange-600 dark:text-orange-400">Type Safety</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Zero uso de 'any' ou 'unknown'</li>
              <li>• Generics para type safety completo</li>
              <li>• Union types para strategy selection</li>
              <li>• Readonly interfaces para immutability</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Abra o DevTools Console para ver logs detalhados das otimizações
      </div>
    </div>
  )
}

export const Route = createFileRoute('/performance-demo')({
  component: PerformanceDemoPage,
})