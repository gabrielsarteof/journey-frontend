/**
 * Layout Route com Route Guard
 *
 * Protege rotas autenticadas usando beforeLoad hook do TanStack Router.
 * Acessa Zustand store diretamente via getState() para evitar re-renders do React context.
 */

import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '../features/auth/application/stores/authStore'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const authState = useAuthStore.getState()

    // Aguarda hidratação do Zustand persist middleware
    if (!authState.hasHydrated) {
      await new Promise(resolve => setTimeout(resolve, 150))
      const newState = useAuthStore.getState()

      if (!newState.isAuthenticated) {
        throw redirect({
          to: '/auth/login',
          search: { redirect: location.href },
        })
      }
    } else if (!authState.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
  component: () => <Outlet />,
})
