import { useState, useEffect, useMemo } from 'react'
import { Module } from '../../domain/entities/Module'
import { ModuleRepository } from '../../infrastructure/repositories/ModuleRepository'
import { ModuleService } from '../../infrastructure/services/ModuleService'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'
import { useAuthStore } from '@/features/auth/application/stores/authStore'

export interface UseModulesReturn {
  modules: Module[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook que gerencia o carregamento de módulos da aplicação.
 *
 * Valida autenticação antes de executar fetch, evitando requisições
 * desnecessárias que resultariam em 401. O useEffect reage a mudanças
 * no estado de autenticação para refetch automático após login.
 */
export function useModules(): UseModulesReturn {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { tokens, isAuthenticated, hasHydrated } = useAuthStore()

  const repository = useMemo(() => {
    const service = new ModuleService(httpClient)
    return new ModuleRepository(service)
  }, [])

  const fetchModules = async () => {
    if (!hasHydrated) {
      return
    }

    if (!isAuthenticated || !tokens?.accessToken) {
      setError(new Error('Autenticação inválida. Token não disponível.'))
      setIsLoading(false)
      window.location.href = '/auth/login'
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await repository.findAllWithProgress()
      setModules(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch modules'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Só executa se já hidratou
    if (hasHydrated) {
      fetchModules()
    }
  }, [hasHydrated, isAuthenticated, tokens?.accessToken])

  return {
    modules,
    isLoading,
    error,
    refetch: fetchModules
  }
}
