import { DomainEvent } from '@/shared/kernel/domain/events/DomainEvent';

export class UserRegistered extends DomainEvent {
  constructor(
    userId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(userId, 'UserRegistered');
  }

  toJSON(): Record<string, unknown> {
    return {
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredOn: this.occurredOn,
      email: this.email,
      name: this.name
    };
  }
}
