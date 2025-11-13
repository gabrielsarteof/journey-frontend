import { useState, useEffect, useMemo } from 'react'
import { GamificationService } from '../../infrastructure/services/GamificationService'
import { httpClient } from '@/shared/infrastructure/http/HttpClient'
import { useAuthStore } from '@/features/auth/application/stores/authStore'
import type { UserStatsData } from '../../domain/types/gamification.types'

export interface UseGamificationReturn {
  stats: UserStatsData | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

function calculateLevelXP(level: number, totalXP: number, nextLevelXP: number): number {
  const LEVEL_XP_REQUIREMENTS = [0, 100, 300, 600, 1000, 1500, 2500, 4000]
  return LEVEL_XP_REQUIREMENTS[level - 1] ?? 0
}

export function useGamification(): UseGamificationReturn {
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { tokens, isAuthenticated } = useAuthStore()

  const service = useMemo(() => new GamificationService(httpClient), [])

  const fetchGamification = async () => {
    if (!isAuthenticated || !tokens?.accessToken) {
      setError(new Error('Usuário não autenticado'))
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await service.getDashboard()

      const currentLevelXP = calculateLevelXP(
        data.user.level,
        data.user.currentXP,
        data.user.nextLevelXP
      )

      const processedStats: UserStatsData = {
        currentStreak: data.streak.current,
        longestStreak: data.streak.longest,
        streakStatus: data.streak.status,
        freezesAvailable: data.streak.freezesAvailable,

        dailyXPTarget: data.dailyGoal.xpTarget,
        dailyXPEarned: data.dailyGoal.xpEarned,
        dailyXPCompletionPercentage: data.dailyGoal.completionPercentage,
        dailyGoalCompleted: data.dailyGoal.completed,

        totalXP: data.user.currentXP,
        xpGainedToday: data.dailyGoal.xpEarned,

        currentLevel: data.user.level,
        levelTitle: data.user.levelTitle,
        currentLevelXP,
        nextLevelXP: data.user.nextLevelXP,
        nextLevelProgress: data.user.nextLevelProgress,
        levelPerks: data.user.levelPerks,
      }

      setStats(processedStats)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Falha ao carregar dados de gamificação'))
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGamification()
  }, [isAuthenticated, tokens?.accessToken])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchGamification,
  }
}
