import { DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => void | Promise<void>;

/**
 * DomainEventPublisher - Singleton
 * Implementa Observer Pattern para Domain Events
 * No frontend: dispatch events para UI updates, analytics, etc
 */
export class DomainEventPublisher {
  private static instance: DomainEventPublisher;
  private handlers: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  static getInstance(): DomainEventPublisher {
    if (!DomainEventPublisher.instance) {
      DomainEventPublisher.instance = new DomainEventPublisher();
    }
    return DomainEventPublisher.instance;
  }

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  unsubscribe(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];

    console.debug(`[DomainEvent] Publishing: ${event.eventName}`, event.toJSON());

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[DomainEvent] Handler error for ${event.eventName}:`, error);
      }
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
