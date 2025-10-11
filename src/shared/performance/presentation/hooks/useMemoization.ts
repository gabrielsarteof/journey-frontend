import { useMemo, useRef } from 'react'

/**
 * Hook para memoização avançada com cache LRU e TTL.
 * Otimiza funções puras com controle fino de cache.
 */
export function useMemoization<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  deps: TArgs,
  options: {
    cacheSize?: number
    ttl?: number
  } = {}
): TReturn {

  const { cacheSize = 10, ttl = 300000 } = options
  const cacheRef = useRef(new Map<string, { value: TReturn; timestamp: number; accessCount: number }>())

  return useMemo(() => {
    const cache = cacheRef.current
    const key = JSON.stringify(deps)
    const cached = cache.get(key)

    // Verifica se existe cache válido
    if (cached && Date.now() - cached.timestamp < ttl) {
      // Atualiza contador de acesso para LRU
      cache.set(key, {
        ...cached,
        accessCount: cached.accessCount + 1
      })
      return cached.value
    }

    // Executa função e armazena resultado
    const result = fn(...deps)

    // Implementa LRU eviction se necessário
    if (cache.size >= cacheSize) {
      let lruKey: string | null = null
      let lruAccessCount = Infinity

      for (const [cacheKey, entry] of cache.entries()) {
        if (entry.accessCount < lruAccessCount) {
          lruAccessCount = entry.accessCount
          lruKey = cacheKey
        }
      }

      if (lruKey) {
        cache.delete(lruKey)
      }
    }

    cache.set(key, {
      value: result,
      timestamp: Date.now(),
      accessCount: 1
    })

    return result
  }, deps)
}

/**
 * Hook para limpar cache manualmente.
 */
export function useMemoizationCache() {
  const cacheRef = useRef(new Map())

  const clearCache = () => {
    cacheRef.current.clear()
  }

  const getCacheSize = () => {
    return cacheRef.current.size
  }

  return { clearCache, getCacheSize }
}