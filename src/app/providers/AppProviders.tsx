import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '../../shared/contexts/ThemeContext'
import { NotificationProvider } from '../../shared/contexts/NotificationContext'
import { ErrorBoundary } from '../../shared/components/ErrorBoundary'
import { useAuthStore } from '../../features/auth/application/stores/authStore'
import { useMultiTabSync } from '../../features/auth/presentation/hooks/useMultiTabSync'
import { useStorageSync } from '../../features/auth/presentation/hooks/useStorageSync'
import { SessionExpiryModal } from '../../features/auth/presentation/components/SessionExpiryModal'
import { AuthLoadingIndicator } from '../../features/auth/presentation/components/AuthLoadingIndicator'

// Singleton QueryClient com configurações otimizadas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Smart retry: não retenta para erros 4xx (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
})

interface AppProvidersProps {
  children: ReactNode
}

function AuthHydration() {
  const broadcast = useMultiTabSync()
  const setBroadcast = useAuthStore((state) => state.setBroadcast)

  useStorageSync()

  useEffect(() => {
    useAuthStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    setBroadcast(broadcast)
  }, [broadcast, setBroadcast])

  return (
    <>
      <SessionExpiryModal />
      <AuthLoadingIndicator />
    </>
  )
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary level="critical">
      <QueryClientProvider client={queryClient}>
        <AuthHydration />
        <ThemeProvider>
          <NotificationProvider>
            <ErrorBoundary level="page">
              {children}
            </ErrorBoundary>

            {import.meta.env.DEV && (
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom"
              />
            )}
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// Hook para acessar QueryClient fora do contexto React
export function getQueryClient() {
  return queryClient
}