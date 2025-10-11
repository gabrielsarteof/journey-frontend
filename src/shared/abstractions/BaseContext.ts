import { createContext, useContext, useEffect } from 'react'
import type { Context } from 'react'

export class ContextNotFoundError extends Error {
  constructor(contextName: string) {
    super(`${contextName} must be used within its provider`)
    this.name = 'ContextNotFoundError'
  }
}

export interface BaseContextValue {
  readonly isInitialized: boolean
}

// Factory pattern + Type safety: garante que contextos sempre tenham provider válido
export function createSafeContext<T extends BaseContextValue>(
  contextName: string
): [Context<T | null>, () => T] {
  const context = createContext<T | null>(null)
  context.displayName = contextName

  const useContextHook = (): T => {
    const contextValue = useContext(context)

    if (contextValue === null) {
      throw new ContextNotFoundError(contextName)
    }

    // Early validation: falha rápido se contexto não foi inicializado corretamente
    if (!contextValue.isInitialized) {
      throw new Error(`${contextName} is not properly initialized`)
    }

    return contextValue
  }

  return [context, useContextHook]
}

export interface CleanupProvider {
  cleanup(): Promise<void> | void
}

export function useProviderCleanup(cleanupFn: () => Promise<void> | void) {
  useEffect(() => {
    return () => {
      const cleanup = cleanupFn()
      // Non-blocking cleanup: evita travamento da UI em unmount
      if (cleanup instanceof Promise) {
        cleanup.catch(console.error)
      }
    }
  }, [cleanupFn])
}