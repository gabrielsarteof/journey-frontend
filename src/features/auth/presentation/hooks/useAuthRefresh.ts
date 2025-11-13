import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '../../application/stores/authStore'

export const useAuthRefresh = () => {
  const { tokens, refreshToken, isAuthenticated } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)

  const getTokenExpiry = useCallback((token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000
    } catch (error) {
      console.error('[useAuthRefresh] Erro ao decodificar token:', error)
      return null
    }
  }, [])

  const calculateRefreshTime = useCallback((expiresAt: number): number => {
    const now = Date.now()
    const expiresIn = expiresAt - now

    if (expiresIn <= 0) {
      return 0
    }

    const refreshAt = expiresIn * 0.75
    const jitter = 5000 + Math.random() * 25000

    return Math.max(0, refreshAt + jitter)
  }, [])

  const scheduleRefresh = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (!isAuthenticated || !tokens?.accessToken) {
      console.log('[useAuthRefresh] Não autenticado, nenhum refresh agendado')
      return
    }

    const expiresAt = getTokenExpiry(tokens.accessToken)

    if (!expiresAt) {
      console.error('[useAuthRefresh] Não foi possível obter expiração do token')
      return
    }

    const refreshTime = calculateRefreshTime(expiresAt)
    const expiresIn = expiresAt - Date.now()

    console.log(
      `[useAuthRefresh] Token expira em ${Math.floor(expiresIn / 1000)}s. ` +
      `Refresh agendado para ${Math.floor(refreshTime / 1000)}s.`
    )

    timeoutRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) {
        console.log('[useAuthRefresh] Refresh já em andamento, pulando...')
        return
      }

      try {
        isRefreshingRef.current = true
        console.log('[useAuthRefresh] Executando refresh proativo...')

        await refreshToken()

        console.log('[useAuthRefresh] Refresh proativo bem-sucedido')

        scheduleRefresh()
      } catch (error) {
        console.error('[useAuthRefresh] Erro no refresh proativo:', error)
      } finally {
        isRefreshingRef.current = false
      }
    }, refreshTime)
  }, [
    isAuthenticated,
    tokens,
    refreshToken,
    getTokenExpiry,
    calculateRefreshTime,
  ])

  useEffect(() => {
    scheduleRefresh()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [scheduleRefresh])

  return {
    forceRefresh: useCallback(async () => {
      if (isRefreshingRef.current) {
        console.log('[useAuthRefresh] Refresh já em andamento')
        return
      }

      try {
        isRefreshingRef.current = true
        await refreshToken()
        scheduleRefresh()
      } finally {
        isRefreshingRef.current = false
      }
    }, [refreshToken, scheduleRefresh]),
  }
}
