import { Email, Password, Username, NotificationList, DomainError } from './ValueObject';

// Domain Service para validação seguindo DDD
export interface IDomainValidationService {
  validateUserRegistration(data: UserRegistrationData): Promise<ValidationResult>;
  validateUserLogin(data: UserLoginData): Promise<ValidationResult>;
  validatePasswordChange(data: PasswordChangeData): Promise<ValidationResult>;
}

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  acceptTerms: boolean;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: DomainError[];
  fieldErrors: Map<string, DomainError[]>;
}

// Async specifications para validações que dependem de infraestrutura
export interface IAsyncSpecification<T> {
  isSatisfiedBy(candidate: T): Promise<boolean>;
}

export class UniqueEmailAsyncSpecification implements IAsyncSpecification<string> {
  constructor(private emailExistsCheck: (email: string) => Promise<boolean>) {}

  async isSatisfiedBy(email: string): Promise<boolean> {
    try {
      const emailVO = Email.create(email);
      const exists = await this.emailExistsCheck(emailVO.getValue());
      return !exists;
    } catch {
      return false;
    }
  }
}

export class UniqueUsernameAsyncSpecification implements IAsyncSpecification<string> {
  constructor(private usernameExistsCheck: (username: string) => Promise<boolean>) {}

  async isSatisfiedBy(username: string): Promise<boolean> {
    try {
      const usernameVO = Username.create(username);
      const exists = await this.usernameExistsCheck(usernameVO.getValue());
      return !exists;
    } catch {
      return false;
    }
  }
}

export class DomainValidationService implements IDomainValidationService {
  constructor(
    private uniqueEmailSpec?: UniqueEmailAsyncSpecification,
    private uniqueUsernameSpec?: UniqueUsernameAsyncSpecification
  ) {}

  async validateUserRegistration(data: UserRegistrationData): Promise<ValidationResult> {
    const notification = new NotificationList();

    // Validação de nome
    this.validateName(data.name, notification);

    // Validação de email com Value Object
    await this.validateEmailWithUniqueness(data.email, notification);

    // Validação de password com Value Object
    this.validatePasswordWithConfirmation(data.password, data.confirmPassword, notification);

    // Validação de username se fornecido
    if (data.username) {
      await this.validateUsernameWithUniqueness(data.username, notification);
    }

    // Validação de termos
    this.validateTermsAcceptance(data.acceptTerms, notification);

    return this.buildValidationResult(notification);
  }

  async validateUserLogin(data: UserLoginData): Promise<ValidationResult> {
    const notification = new NotificationList();

    // Validação básica de email (sem uniqueness check)
    this.validateEmailFormat(data.email, notification);

    // Validação básica de password (sem strength check)
    this.validatePasswordRequired(data.password, notification);

    return this.buildValidationResult(notification);
  }

  async validatePasswordChange(data: PasswordChangeData): Promise<ValidationResult> {
    const notification = new NotificationList();

    // Validação de senha atual
    this.validatePasswordRequired(data.currentPassword, notification, 'currentPassword');

    // Validação de nova senha com strength check
    this.validatePasswordWithConfirmation(
      data.newPassword,
      data.confirmNewPassword,
      notification,
      'newPassword',
      'confirmNewPassword'
    );

    // Regra de negócio: nova senha deve ser diferente da atual
    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
      notification.addError('Nova senha deve ser diferente da senha atual', 'newPassword', 'SAME_PASSWORD');
    }

    return this.buildValidationResult(notification);
  }

  private validateName(name: string, notification: NotificationList): void {
    if (!name?.trim()) {
      notification.addError('Nome é obrigatório', 'name', 'REQUIRED');
      return;
    }

    if (name.trim().length < 2) {
      notification.addError('Nome deve ter pelo menos 2 caracteres', 'name', 'MIN_LENGTH');
    }

    if (name.trim().length > 100) {
      notification.addError('Nome deve ter no máximo 100 caracteres', 'name', 'MAX_LENGTH');
    }

    // Specification para nome válido
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      notification.addError('Nome deve conter apenas letras e espaços', 'name', 'INVALID_CHARACTERS');
    }
  }

  private async validateEmailWithUniqueness(email: string, notification: NotificationList): Promise<void> {
    try {
      Email.create(email);

      // Validação assíncrona de unicidade
      if (this.uniqueEmailSpec) {
        const isUnique = await this.uniqueEmailSpec.isSatisfiedBy(email);
        if (!isUnique) {
          notification.addError('Este email já está em uso', 'email', 'NOT_UNIQUE');
        }
      }
    } catch (error) {
      if (error instanceof DomainError) {
        notification.add(error);
      }
    }
  }

  private validateEmailFormat(email: string, notification: NotificationList): void {
    try {
      Email.create(email);
    } catch (error) {
      if (error instanceof DomainError) {
        notification.add(error);
      }
    }
  }

  private validatePasswordWithConfirmation(
    password: string,
    confirmPassword: string,
    notification: NotificationList,
    passwordField: string = 'password',
    confirmField: string = 'confirmPassword'
  ): void {
    try {
      Password.create(password);
    } catch (error) {
      if (error instanceof DomainError) {
        // Mapeia o campo para o correto
        const mappedError = new DomainError(error.message, passwordField, error.code);
        notification.add(mappedError);
      }
    }

    // Validação de confirmação
    if (!confirmPassword) {
      notification.addError('Confirmação de senha é obrigatória', confirmField, 'REQUIRED');
    } else if (password !== confirmPassword) {
      notification.addError('Senhas não coincidem', confirmField, 'MISMATCH');
    }
  }

  private validatePasswordRequired(
    password: string,
    notification: NotificationList,
    field: string = 'password'
  ): void {
    if (!password) {
      notification.addError('Senha é obrigatória', field, 'REQUIRED');
    }
  }

  private async validateUsernameWithUniqueness(username: string, notification: NotificationList): Promise<void> {
    try {
      Username.create(username);

      // Validação assíncrona de unicidade
      if (this.uniqueUsernameSpec) {
        const isUnique = await this.uniqueUsernameSpec.isSatisfiedBy(username);
        if (!isUnique) {
          notification.addError('Este username já está em uso', 'username', 'NOT_UNIQUE');
        }
      }
    } catch (error) {
      if (error instanceof DomainError) {
        notification.add(error);
      }
    }
  }

  private validateTermsAcceptance(acceptTerms: boolean, notification: NotificationList): void {
    if (!acceptTerms) {
      notification.addError('É obrigatório aceitar os termos de uso', 'acceptTerms', 'REQUIRED');
    }
  }

  private buildValidationResult(notification: NotificationList): ValidationResult {
    const errors = notification.getErrors();
    const fieldErrors = new Map<string, DomainError[]>();

    // Agrupa erros por campo
    errors.forEach(error => {
      if (error.field) {
        if (!fieldErrors.has(error.field)) {
          fieldErrors.set(error.field, []);
        }
        fieldErrors.get(error.field)!.push(error);
      }
    });

    return {
      isValid: !notification.hasErrors(),
      errors: [...errors],
      fieldErrors
    };
  }
}

// Factory para criar o serviço com dependências
export class DomainValidationServiceFactory {
  static create(
    emailExistsCheck?: (email: string) => Promise<boolean>,
    usernameExistsCheck?: (username: string) => Promise<boolean>
  ): DomainValidationService {
    const uniqueEmailSpec = emailExistsCheck
      ? new UniqueEmailAsyncSpecification(emailExistsCheck)
      : undefined;

    const uniqueUsernameSpec = usernameExistsCheck
      ? new UniqueUsernameAsyncSpecification(usernameExistsCheck)
      : undefined;

    return new DomainValidationService(uniqueEmailSpec, uniqueUsernameSpec);
  }

  // Factory para validação apenas local (sem async checks)
  static createLocal(): DomainValidationService {
    return new DomainValidationService();
  }
}