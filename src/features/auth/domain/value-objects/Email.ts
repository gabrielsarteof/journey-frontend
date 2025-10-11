/**
 * Email Value Object
 * Garante formato válido de email com regex RFC 5322 simplificado
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid Email format');
    }
  }

  static create(value: string): Email {
    return new Email(value.toLowerCase().trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  private isValid(value: string): boolean {
    return Email.EMAIL_REGEX.test(value);
  }
}
