import { DomainEvent } from '@/shared/kernel/domain/events/DomainEvent';
import { Level } from '../value-objects/Level';

export class UserLeveledUp extends DomainEvent {
  constructor(
    userId: string,
    public readonly oldLevel: Level,
    public readonly newLevel: Level,
    public readonly totalXP: number
  ) {
    super(userId, 'UserLeveledUp');
  }

  toJSON(): Record<string, unknown> {
    return {
      aggregateId: this.aggregateId,
      eventName: this.eventName,
      occurredOn: this.occurredOn,
      oldLevel: this.oldLevel.getValue(),
      oldLevelTitle: this.oldLevel.getTitle(),
      newLevel: this.newLevel.getValue(),
      newLevelTitle: this.newLevel.getTitle(),
      totalXP: this.totalXP
    };
  }
}
