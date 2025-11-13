import { useState, useCallback } from 'react'
import type { ModuleProgressDTO } from '../../domain/types/module.types'

export interface UseModuleProgressReturn {
  progress: ModuleProgressDTO | null
  isLoading: boolean
  error: Error | null
  updateProgress: (challengesCompleted: number, xpEarned: number, score: number) => Promise<void>
}

export function useModuleProgress(moduleId: string | undefined): UseModuleProgressReturn {
  const [progress, setProgress] = useState<ModuleProgressDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateProgress = useCallback(
    async (challengesCompleted: number, xpEarned: number, score: number) => {
      if (!moduleId) {
        setError(new Error('Module ID is required'))
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // API call para atualizar progresso será implementada aqui
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update progress'))
      } finally {
        setIsLoading(false)
      }
    },
    [moduleId]
  )

  return {
    progress,
    isLoading,
    error,
    updateProgress
  }
}
