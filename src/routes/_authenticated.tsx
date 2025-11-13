/**
 * Route guard que protege todas as rotas autenticadas.
 *
 * Valida autenticação em três níveis:
 * 1. Aguarda hidratação do persist middleware (300ms max)
 * 2. Verifica flag isAuthenticated e token no state
 * 3. Confirma existência do token no localStorage
 *
 * A validação tripla previne estados inconsistentes entre memória e storage.
 */

import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '../features/auth/application/stores/authStore'
import { env } from '@/shared/config/env'

const MAX_HYDRATION_WAIT_MS = 300

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const authState = useAuthStore.getState()

    if (!authState.hasHydrated) {
      await new Promise(resolve => setTimeout(resolve, MAX_HYDRATION_WAIT_MS))
    }

    const hydratedState = useAuthStore.getState()

    const isAuthenticated = hydratedState.isAuthenticated
    const hasTokenInState = !!hydratedState.tokens?.accessToken
    const hasTokenInStorage = !!localStorage.getItem(env.AUTH_TOKEN_STORAGE_KEY)

    if (!isAuthenticated || !hasTokenInState || !hasTokenInStorage) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
  component: () => <Outlet />,
})
