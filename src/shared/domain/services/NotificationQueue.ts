import { Notification } from '../entities/Notification'
import type { NotificationData } from '../entities/Notification'
import { ValueObject, DomainError } from '@/shared/domain/validation/ValueObject'

export class NotificationId extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }

  static create(value: string): NotificationId {
    return new NotificationId(value)
  }

  static generate(): NotificationId {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return new NotificationId(id)
  }

  protected validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new DomainError('NotificationId não pode estar vazio', 'notificationId', 'REQUIRED')
    }
  }
}

export class NotificationMessage extends ValueObject<string> {
  private constructor(value: string) {
    super(value)
  }

  static create(value: string): NotificationMessage {
    return new NotificationMessage(value)
  }

  protected validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new DomainError('Mensagem da notificação é obrigatória', 'message', 'REQUIRED')
    }
    if (this.value.length > 500) {
      throw new DomainError('Mensagem da notificação deve ter no máximo 500 caracteres', 'message', 'MAX_LENGTH')
    }
  }
}

export class NotificationPriority extends ValueObject<'low' | 'medium' | 'high' | 'urgent'> {
  private constructor(value: 'low' | 'medium' | 'high' | 'urgent') {
    super(value)
  }

  static create(value: 'low' | 'medium' | 'high' | 'urgent'): NotificationPriority {
    return new NotificationPriority(value)
  }

  protected validate(): void {
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (!validPriorities.includes(this.value)) {
      throw new DomainError('Prioridade deve ser: low, medium, high ou urgent', 'priority', 'INVALID_VALUE')
    }
  }

  isHigherThan(other: NotificationPriority): boolean {
    const priorities = { low: 1, medium: 2, high: 3, urgent: 4 }
    return priorities[this.value] > priorities[other.value]
  }
}

export interface NotificationQueueStrategy {
  add(notification: Notification): void
  remove(id: NotificationId): void
  getAll(): Notification[]
  clear(): void
}

export class FIFONotificationQueue implements NotificationQueueStrategy {
  private notifications: Notification[] = []
  private readonly maxSize: number

  constructor(maxSize = 5) {
    this.maxSize = maxSize
  }

  add(notification: Notification): void {
    // Remove oldest if at capacity (FIFO behavior)
    if (this.notifications.length >= this.maxSize) {
      this.notifications.shift()
    }

    this.notifications.push(notification)
  }

  remove(id: NotificationId): void {
    this.notifications = this.notifications.filter(n => n.id !== id.getValue())
  }

  getAll(): Notification[] {
    return [...this.notifications] // Defensive copy
  }

  clear(): void {
    this.notifications = []
  }
}

export class PriorityNotificationQueue implements NotificationQueueStrategy {
  private notifications: Notification[] = []
  private readonly maxSize: number

  constructor(maxSize = 5) {
    this.maxSize = maxSize
  }

  add(notification: Notification): void {
    // Remove lowest priority if at capacity
    if (this.notifications.length >= this.maxSize) {
      const lowestPriorityIndex = this.findLowestPriorityIndex()
      this.notifications.splice(lowestPriorityIndex, 1)
    }

    // Insert based on priority (Strategy Pattern com Value Objects)
    const insertIndex = this.findInsertionIndex(notification)
    this.notifications.splice(insertIndex, 0, notification)
  }

  remove(id: NotificationId): void {
    this.notifications = this.notifications.filter(n => n.id !== id.getValue())
  }

  getAll(): Notification[] {
    return [...this.notifications] // Defensive copy ordenada por prioridade
  }

  clear(): void {
    this.notifications = []
  }

  private findLowestPriorityIndex(): number {
    let lowestIndex = 0
    for (let i = 1; i < this.notifications.length; i++) {
      const currentPriority = NotificationPriority.create(this.notifications[i].type as any)
      const lowestPriority = NotificationPriority.create(this.notifications[lowestIndex].type as any)

      if (!currentPriority.isHigherThan(lowestPriority)) {
        lowestIndex = i
      }
    }
    return lowestIndex
  }

  private findInsertionIndex(notification: Notification): number {
    const newPriority = NotificationPriority.create(notification.type as any)

    for (let i = 0; i < this.notifications.length; i++) {
      const existingPriority = NotificationPriority.create(this.notifications[i].type as any)
      if (newPriority.isHigherThan(existingPriority)) {
        return i
      }
    }
    return this.notifications.length
  }
}

export class NotificationService {
  private queue: NotificationQueueStrategy

  constructor(queue: NotificationQueueStrategy) {
    this.queue = queue
  }

  addNotification(data: NotificationData): Notification {
    const notification = new Notification(data)
    this.queue.add(notification)
    return notification
  }

  removeNotification(id: NotificationId): void {
    this.queue.remove(id)
  }

  getNotifications(): Notification[] {
    return this.queue.getAll()
  }

  clearAll(): void {
    this.queue.clear()
  }

  // Auto-remove expired notifications
  cleanupExpired(): void {
    const current = this.queue.getAll()
    const expired = current.filter(n => n.isExpired())

    expired.forEach(n => this.queue.remove(NotificationId.create(n.id)))
  }
}