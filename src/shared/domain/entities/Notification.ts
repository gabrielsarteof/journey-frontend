export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationData {
  title: string
  message: string
  type: NotificationType
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

export class Notification {
  public readonly id: string
  public readonly title: string
  public readonly message: string
  public readonly type: NotificationType
  public readonly duration: number
  public readonly action?: {
    label: string
    handler: () => void
  }
  public readonly createdAt: Date

  constructor(data: NotificationData) {
    this.id = crypto.randomUUID()
    this.title = data.title
    this.message = data.message
    this.type = data.type
    this.duration = data.duration ?? this.getDefaultDuration(data.type)
    this.action = data.action
    this.createdAt = new Date()
  }

  // Business rule: diferentes tipos têm durações padrão diferentes
  private getDefaultDuration(type: NotificationType): number {
    const durations: Record<NotificationType, number> = {
      success: 4000,
      info: 5000,
      warning: 6000,
      error: 8000 // Erros ficam mais tempo visíveis
    }
    return durations[type]
  }

  isExpired(): boolean {
    return Date.now() - this.createdAt.getTime() > this.duration
  }
}