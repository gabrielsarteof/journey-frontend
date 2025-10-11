/**
 * UserId Value Object
 * Garante que IDs sejam sempre válidos e não vazios
 */
export class UserId {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid UserId: must be non-empty string');
    }
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  private isValid(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }
}
