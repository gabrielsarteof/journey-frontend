/**
 * UserName Value Object
 * Regras: 2-100 caracteres, não pode ser apenas espaços
 */
export class UserName {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`UserName must be between ${UserName.MIN_LENGTH} and ${UserName.MAX_LENGTH} characters`);
    }
  }

  static create(value: string): UserName {
    return new UserName(value.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }

  getFirstName(): string {
    return this.value.split(' ')[0];
  }

  private isValid(value: string): boolean {
    const trimmed = value.trim();
    return trimmed.length >= UserName.MIN_LENGTH && trimmed.length <= UserName.MAX_LENGTH;
  }
}
