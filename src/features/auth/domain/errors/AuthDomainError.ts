/**
 * Auth Domain Error - Domain Layer
 *
 * Value Object que encapsula erros de autenticação
 * Garante imutabilidade e type safety através do padrão Value Object
 *
 * @pattern ValueObject, FailFast
 * @layer Domain
 */

import type { AuthErrorCode } from './AuthErrorCodes';
import type { ErrorMessageStrategy } from './AuthErrorMessages';

export interface AuthDomainErrorProps {
  readonly code: AuthErrorCode;
  readonly statusCode: number;
  readonly messageStrategy: ErrorMessageStrategy;
  readonly details?: ValidationDetail[];
  readonly originalError?: unknown;
}

export interface ValidationDetail {
  readonly field: string;
  readonly code: string;
  readonly message: string;
}

/**
 * Representa um erro de domínio de autenticação
 * Imutável por design - segue DDD Value Object pattern
 */
export class AuthDomainError {
  private constructor(
    private readonly props: AuthDomainErrorProps
  ) {
    Object.freeze(this);
  }

  static create(props: AuthDomainErrorProps): AuthDomainError {
    return new AuthDomainError(props);
  }

  get code(): AuthErrorCode {
    return this.props.code;
  }

  get statusCode(): number {
    return this.props.statusCode;
  }

  get title(): string {
    return this.props.messageStrategy.title;
  }

  get message(): string {
    return this.props.messageStrategy.message;
  }

  get actionHint(): string | undefined {
    return this.props.messageStrategy.actionHint;
  }

  get details(): ValidationDetail[] | undefined {
    return this.props.details;
  }

  get originalError(): unknown {
    return this.props.originalError;
  }

  /**
   * Verifica se é um erro de validação com detalhes
   */
  hasValidationDetails(): boolean {
    return Boolean(this.props.details && this.props.details.length > 0);
  }

  /**
   * Obtém mensagem completa formatada para exibição
   */
  getDisplayMessage(): string {
    let displayMessage = this.message;

    if (this.actionHint) {
      displayMessage += ` ${this.actionHint}`;
    }

    if (this.hasValidationDetails()) {
      const detailMessages = this.props.details!
        .map(detail => `${detail.field}: ${detail.message}`)
        .join('; ');
      displayMessage += ` Detalhes: ${detailMessages}`;
    }

    return displayMessage;
  }

  /**
   * Serializa para objeto simples (útil para logging)
   */
  toJSON() {
    return {
      code: this.code,
      statusCode: this.statusCode,
      title: this.title,
      message: this.message,
      actionHint: this.actionHint,
      details: this.details,
    };
  }
}
