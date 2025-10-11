import { useRef, useCallback } from 'react'

/**
 * Hook para throttle de callbacks.
 * Garante execução máxima de uma vez por período definido.
 */
export function useThrottle<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {}
): (...args: TArgs) => void {

  const { leading = true, trailing = true } = options
  const lastCallTime = useRef<number>(0)
  const timeoutId = useRef<number | null>(null)
  const lastArgs = useRef<TArgs | null>(null)

  return useCallback((...args: TArgs) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime.current

    lastArgs.current = args

    // Primeira chamada ou tempo suficiente passou
    if (lastCallTime.current === 0 || timeSinceLastCall >= delay) {
      if (leading) {
        lastCallTime.current = now
        callback(...args)
        return
      }
    }

    // Configura trailing call se habilitado
    if (trailing) {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        if (lastArgs.current) {
          lastCallTime.current = Date.now()
          callback(...lastArgs.current)
        }
      }, delay - timeSinceLastCall) as number
    }
  }, [callback, delay, leading, trailing])
}