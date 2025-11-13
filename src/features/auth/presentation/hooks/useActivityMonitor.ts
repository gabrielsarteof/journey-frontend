import { useEffect, useRef } from 'react'
import { useAuthStore } from '../../application/stores/authStore'

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), wait)
  }) as T & { cancel: () => void }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}

export const useActivityMonitor = () => {
  const { isAuthenticated } = useAuthStore()
  const lastActivityRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isAuthenticated) return

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    const handleActivity = debounce(() => {
      const now = Date.now()
      lastActivityRef.current = now

      localStorage.setItem('lastActivity', now.toString())

      console.log('[ActivityMonitor] Atividade detectada')
    }, 5000)

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
      handleActivity.cancel()
    }
  }, [isAuthenticated])

  return {
    getLastActivity: () => lastActivityRef.current,
    getIdleTime: () => Date.now() - lastActivityRef.current,
  }
}
