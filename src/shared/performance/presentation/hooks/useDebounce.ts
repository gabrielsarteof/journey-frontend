import { useState, useEffect } from 'react'

/**
 * Hook para debounce de valores.
 * Atrasa atualização até que não haja mudanças por um período específico.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de callbacks.
 * Útil para eventos que disparam frequentemente como onChange.
 */
export function useDebouncedCallback<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  const [timeoutId, setTimeoutId] = useState<number | null>(null)

  return (...args: TArgs) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay) as number

    setTimeoutId(newTimeoutId)
  }
}