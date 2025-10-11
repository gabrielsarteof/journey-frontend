import { useState, useEffect, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { createSafeContext } from '../abstractions/BaseContext'
import type { BaseContextValue } from '../abstractions/BaseContext'
import { Notification } from '../domain/entities/Notification'
import type { NotificationData } from '../domain/entities/Notification'
import { NotificationService, FIFONotificationQueue, NotificationId } from '../domain/services/NotificationQueue'

interface NotificationContextValue extends BaseContextValue {
  notifications: Notification[]
  addNotification: (data: NotificationData) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const [NotificationContext, useNotifications] = createSafeContext<NotificationContextValue>('NotificationContext')

interface NotificationProviderProps {
  children: ReactNode
  maxNotifications?: number
  cleanupInterval?: number
}

export function NotificationProvider({
  children,
  maxNotifications = 5,
  cleanupInterval = 1000
}: NotificationProviderProps) {
  const serviceRef = useRef(
    new NotificationService(new FIFONotificationQueue(maxNotifications))
  )
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Auto-cleanup expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      serviceRef.current.cleanupExpired()
      setNotifications(serviceRef.current.getNotifications())
    }, cleanupInterval)

    return () => clearInterval(interval)
  }, [cleanupInterval])

  const addNotification = useCallback((data: NotificationData): string => {
    const notification = serviceRef.current.addNotification(data)
    setNotifications(serviceRef.current.getNotifications())

    // Auto-remove after duration if no manual interaction
    setTimeout(() => {
      serviceRef.current.removeNotification(NotificationId.create(notification.id))
      setNotifications(serviceRef.current.getNotifications())
    }, notification.duration)

    return notification.id
  }, [])

  const removeNotification = useCallback((id: string) => {
    serviceRef.current.removeNotification(NotificationId.create(id))
    setNotifications(serviceRef.current.getNotifications())
  }, [])

  const clearAllNotifications = useCallback(() => {
    serviceRef.current.clearAll()
    setNotifications([])
  }, [])

  const contextValue: NotificationContextValue = {
    isInitialized: true,
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

// Convenience hooks para casos específicos
export function useNotificationActions() {
  const { addNotification } = useNotifications()

  return {
    success: (title: string, message: string) =>
      addNotification({ title, message, type: 'success' }),

    error: (title: string, message: string) =>
      addNotification({ title, message, type: 'error' }),

    warning: (title: string, message: string) =>
      addNotification({ title, message, type: 'warning' }),

    info: (title: string, message: string) =>
      addNotification({ title, message, type: 'info' })
  }
}

export { useNotifications }