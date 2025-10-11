// Base para Value Objects com validação incorporada
export abstract class ValueObject<T> {
  protected constructor(protected readonly value: T) {
    this.validate();
  }

  protected abstract validate(): void;

  getValue(): T {
    return this.value;
  }

  equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  toString(): string {
    return String(this.value);
  }
}

// Specification pattern para regras de negócio complexas
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

export abstract class Specification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}

// Domain Error para violações de invariantes
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

// Notification pattern para coletar múltiplos erros
export class NotificationList {
  private errors: DomainError[] = [];

  add(error: DomainError): void {
    this.errors.push(error);
  }

  addError(message: string, field?: string, code?: string): void {
    this.add(new DomainError(message, field, code));
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): ReadonlyArray<DomainError> {
    return this.errors;
  }

  getErrorsForField(field: string): DomainError[] {
    return this.errors.filter(error => error.field === field);
  }

  throwIfHasErrors(): void {
    if (this.hasErrors()) {
      const messages = this.errors.map(e => e.message).join('; ');
      throw new DomainError(`Validation failed: ${messages}`);
    }
  }

  clear(): void {
    this.errors = [];
  }
}

// Value Objects específicos com validação de domínio
export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    super(value.toLowerCase().trim());
  }

  static create(value: string): Email {
    return new Email(value);
  }

  protected validate(): void {
    if (!this.value) {
      throw new DomainError('Email é obrigatório', 'email', 'REQUIRED');
    }

    if (!Email.EMAIL_REGEX.test(this.value)) {
      throw new DomainError('Formato de email inválido', 'email', 'INVALID_FORMAT');
    }

    if (this.value.length > 254) {
      throw new DomainError('Email muito longo', 'email', 'MAX_LENGTH');
    }
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }
}

export class Password extends ValueObject<string> {
  private static readonly MIN_LENGTH = 8;
  private static readonly UPPERCASE_REGEX = /[A-Z]/;
  private static readonly LOWERCASE_REGEX = /[a-z]/;
  private static readonly NUMBER_REGEX = /\d/;
  private static readonly SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

  private constructor(value: string) {
    super(value);
  }

  static create(value: string): Password {
    return new Password(value);
  }

  protected validate(): void {
    const notification = new NotificationList();

    if (!this.value) {
      notification.addError('Senha é obrigatória', 'password', 'REQUIRED');
    } else {
      if (this.value.length < Password.MIN_LENGTH) {
        notification.addError(`Senha deve ter pelo menos ${Password.MIN_LENGTH} caracteres`, 'password', 'MIN_LENGTH');
      }

      if (!Password.UPPERCASE_REGEX.test(this.value)) {
        notification.addError('Senha deve conter pelo menos uma letra maiúscula', 'password', 'MISSING_UPPERCASE');
      }

      if (!Password.LOWERCASE_REGEX.test(this.value)) {
        notification.addError('Senha deve conter pelo menos uma letra minúscula', 'password', 'MISSING_LOWERCASE');
      }

      if (!Password.NUMBER_REGEX.test(this.value)) {
        notification.addError('Senha deve conter pelo menos um número', 'password', 'MISSING_NUMBER');
      }

      if (!Password.SPECIAL_CHAR_REGEX.test(this.value)) {
        notification.addError('Senha deve conter pelo menos um caractere especial', 'password', 'MISSING_SPECIAL');
      }
    }

    notification.throwIfHasErrors();
  }

  matches(plainPassword: string): boolean {
    return this.value === plainPassword;
  }
}

export class Username extends ValueObject<string> {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly RESERVED_USERNAMES = ['admin', 'root', 'user', 'test', 'system'];

  private constructor(value: string) {
    super(value.toLowerCase().trim());
  }

  static create(value: string): Username {
    return new Username(value);
  }

  protected validate(): void {
    const notification = new NotificationList();

    if (!this.value) {
      notification.addError('Username é obrigatório', 'username', 'REQUIRED');
    } else {
      if (!Username.USERNAME_REGEX.test(this.value)) {
        notification.addError('Username deve ter 3-20 caracteres alfanuméricos ou underscore', 'username', 'INVALID_FORMAT');
      }

      if (Username.RESERVED_USERNAMES.includes(this.value)) {
        notification.addError('Username não disponível', 'username', 'RESERVED');
      }
    }

    notification.throwIfHasErrors();
  }
}

// Specifications para regras complexas
export class StrongPasswordSpecification extends Specification<string> {
  isSatisfiedBy(password: string): boolean {
    try {
      Password.create(password);
      return true;
    } catch {
      return false;
    }
  }
}

export class UniqueEmailSpecification extends Specification<string> {
  constructor(private existingEmails: string[]) {
    super();
  }

  isSatisfiedBy(email: string): boolean {
    try {
      const emailVO = Email.create(email);
      return !this.existingEmails.includes(emailVO.getValue());
    } catch {
      return false;
    }
  }
}