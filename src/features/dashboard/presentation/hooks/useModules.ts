import { useState, useEffect, useMemo } from 'react'
import { Module } from '../../domain/entities/Module'
import { ModuleRepository } from '../../infrastructure/repositories/ModuleRepository'
import { UnitRepository } from '../../infrastructure/repositories/UnitRepository'
import { ModuleService } from '../../infrastructure/services/ModuleService'
import { UnitService } from '../../infrastructure/services/UnitService'
import { LevelService } from '../../infrastructure/services/LevelService'
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
 * Atualizado para usar a hierarquia completa: Module → Unit → Level → Challenge
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
    // Inicializa services
    const moduleService = new ModuleService(httpClient)
    const unitService = new UnitService(httpClient)
    const levelService = new LevelService(httpClient)

    // Inicializa repositories com dependências
    const unitRepository = new UnitRepository(unitService, levelService)
    const moduleRepository = new ModuleRepository(moduleService, unitRepository)

    return moduleRepository
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
