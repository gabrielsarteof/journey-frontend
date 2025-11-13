import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../../routeTree.gen'
import { useAuthStore } from '../../features/auth/application/stores/authStore'
import type { RouterContext } from '../../shared/types/router'
import { useMemo } from 'react'

// Cria a instância do router com contexto de autenticação
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    auth: undefined!, // Será fornecido pelo RouterProvider
  } as RouterContext,
})

// Hook para obter o contexto do router a partir do auth store
export function useRouterContext(): RouterContext {
  const { user, tokens, isAuthenticated, isLoading, hasHydrated } = useAuthStore()

  // Debug: Log do estado de autenticação
  console.log('[useRouterContext] Auth state:', {
    isAuthenticated,
    hasHydrated,
    hasUser: !!user,
    hasTokens: !!tokens
  })

  // Memoiza o contexto para evitar re-renders infinitos
  return useMemo(() => ({
    auth: {
      user,
      tokens,
      isAuthenticated,
      isLoading,
      hasHydrated,
    },
  }), [user, tokens, isAuthenticated, isLoading, hasHydrated])
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}