// Context API exports
export { ThemeProvider, useTheme } from './ThemeContext'
export { NotificationProvider, useNotifications, useNotificationActions } from './NotificationContext'

// Base abstractions
export { createSafeContext, ContextNotFoundError } from '../abstractions/BaseContext'
export type { BaseContextValue, CleanupProvider } from '../abstractions/BaseContext'

// Domain entities and value objects
export { Theme } from '../domain/value-objects/Theme'
export type { ThemeMode, ResolvedTheme } from '../domain/value-objects/Theme'
export { Notification } from '../domain/entities/Notification'
export type { NotificationData, NotificationType } from '../domain/entities/Notification'

// Storage strategies
export { LocalStorageThemeStrategy, MemoryThemeStrategy } from '../infrastructure/storage/ThemeStorage'
export type { ThemeStorageStrategy } from '../infrastructure/storage/ThemeStorage'