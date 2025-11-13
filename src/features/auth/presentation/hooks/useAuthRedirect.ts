import { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '../../application/stores/authStore'

/**
 * Hook que monitora estado de autenticação e redireciona para login quando sessão expira.
 * Persiste rota atual em returnTo para restaurar navegação pós-login.
 */
export function useAuthRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const hasHydrated = useAuthStore(state => state.hasHydrated)

  useEffect(() => {
    // Aguarda hidratação do store (persist middleware)
    if (!hasHydrated) {
      return
    }

    // Se não autenticado e não está em rota pública, redireciona
    const publicRoutes = ['/login', '/register', '/']
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route))

    if (!isAuthenticated && !isPublicRoute) {
      // Persiste rota atual para redirect pós-login
      const returnTo = location.pathname + location.search
      navigate({
        to: '/login',
        search: { returnTo }
      })
    }
  }, [isAuthenticated, hasHydrated, location.pathname, location.search, navigate])
}
