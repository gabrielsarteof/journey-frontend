/**
 * Base DomainEvent
 * Todo evento de domínio deve ter: aggregateId, timestamp, eventName
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventName: string
  ) {
    this.occurredOn = new Date();
  }

  abstract toJSON(): Record<string, unknown>;
}
