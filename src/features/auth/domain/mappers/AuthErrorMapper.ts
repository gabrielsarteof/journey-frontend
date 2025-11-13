/**
 * Auth Error Mapper - Domain Service
 *
 * Serviço de domínio responsável por mapear erros da API
 * para objetos de erro de domínio com mensagens localizadas
 *
 * Implementa o padrão Mapper para tradução de conceitos entre camadas
 * Aplica SRP: responsabilidade única de mapear erros
 *
 * @pattern Mapper, DomainService
 * @layer Domain
 */

import { AuthDomainError, type ValidationDetail } from '../errors/AuthDomainError';
import { AuthErrorCodes, type AuthErrorCode } from '../errors/AuthErrorCodes';
import { AuthErrorMessages } from '../errors/AuthErrorMessages';

/**
 * Interface que representa um erro retornado pela API
 * Baseado no contrato estabelecido pelo backend
 */
export interface ApiErrorResponse {
  error?: string;
  code?: string;
  message?: string;
  statusCode?: number;
  details?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

/**
 * Mapper que converte erros da API para erros de domínio localizados
 * Implementa o padrão Fail-Safe: sempre retorna um erro válido
 */
export class AuthErrorMapper {
  /**
   * Mapeia um erro da API para um erro de domínio
   * Garante que sempre retornará um erro válido (Fail-Safe)
   */
  static toDomain(error: unknown): AuthDomainError {
    // Type narrowing progressivo para extrair informações do erro
    if (this.isApiErrorResponse(error)) {
      return this.mapApiError(error);
    }

    if (error instanceof Error) {
      return this.mapGenericError(error);
    }

    // Fallback para erros completamente desconhecidos
    return this.mapUnknownError(error);
  }

  /**
   * Type guard para ApiErrorResponse
   */
  private static isApiErrorResponse(error: unknown): error is ApiErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as ApiErrorResponse).code === 'string'
    );
  }

  /**
   * Mapeia uma resposta de erro estruturada da API
   */
  private static mapApiError(apiError: ApiErrorResponse): AuthDomainError {
    const errorCode = this.normalizeErrorCode(apiError.code || '');
    const messageStrategy = AuthErrorMessages[errorCode];
    const statusCode = apiError.statusCode || this.getDefaultStatusCode(errorCode);

    // Mapeia detalhes de validação se existirem
    const details = apiError.details?.map(detail => ({
      field: detail.field,
      code: detail.code,
      message: this.translateValidationMessage(detail.message, detail.field),
    }));

    return AuthDomainError.create({
      code: errorCode,
      statusCode,
      messageStrategy,
      details,
      originalError: apiError,
    });
  }

  /**
   * Mapeia um Error genérico do JavaScript
   */
  private static mapGenericError(error: Error): AuthDomainError {
    // Tenta inferir o código de erro pela mensagem
    const inferredCode = this.inferErrorCodeFromMessage(error.message);
    const messageStrategy = AuthErrorMessages[inferredCode];
    const statusCode = this.getDefaultStatusCode(inferredCode);

    return AuthDomainError.create({
      code: inferredCode,
      statusCode,
      messageStrategy,
      originalError: error,
    });
  }

  /**
   * Mapeia um erro completamente desconhecido
   */
  private static mapUnknownError(error: unknown): AuthDomainError {
    const errorCode = AuthErrorCodes.UNKNOWN_ERROR;
    const messageStrategy = AuthErrorMessages[errorCode];

    return AuthDomainError.create({
      code: errorCode,
      statusCode: 500,
      messageStrategy,
      originalError: error,
    });
  }

  /**
   * Normaliza código de erro para o formato esperado
   * Garante compatibilidade entre frontend e backend
   */
  private static normalizeErrorCode(code: string): AuthErrorCode {
    // Remove prefixos variáveis e normaliza
    const normalizedCode = code.toUpperCase().trim();

    // Mapeia códigos conhecidos
    const codeMap: Record<string, AuthErrorCode> = {
      'AUTH_INVALID_CREDENTIALS': AuthErrorCodes.INVALID_CREDENTIALS,
      'INVALID_CREDENTIALS': AuthErrorCodes.INVALID_CREDENTIALS,
      'AUTH_EMAIL_ALREADY_EXISTS': AuthErrorCodes.EMAIL_ALREADY_EXISTS,
      'EMAIL_ALREADY_EXISTS': AuthErrorCodes.EMAIL_ALREADY_EXISTS,
      'AUTH_VALIDATION_FAILED': AuthErrorCodes.VALIDATION_FAILED,
      'VALIDATION_FAILED': AuthErrorCodes.VALIDATION_FAILED,
      'VALIDATION_ERROR': AuthErrorCodes.VALIDATION_FAILED,
      'AUTH_TOKEN_INVALID': AuthErrorCodes.TOKEN_INVALID,
      'TOKEN_INVALID': AuthErrorCodes.TOKEN_INVALID,
      'AUTH_TOKEN_EXPIRED': AuthErrorCodes.TOKEN_EXPIRED,
      'TOKEN_EXPIRED': AuthErrorCodes.TOKEN_EXPIRED,
      'AUTH_UNAUTHORIZED': AuthErrorCodes.UNAUTHORIZED,
      'UNAUTHORIZED': AuthErrorCodes.UNAUTHORIZED,
      'AUTH_USER_NOT_FOUND': AuthErrorCodes.USER_NOT_FOUND,
      'USER_NOT_FOUND': AuthErrorCodes.USER_NOT_FOUND,
      'AUTH_SESSION_NOT_FOUND': AuthErrorCodes.SESSION_NOT_FOUND,
      'SESSION_NOT_FOUND': AuthErrorCodes.SESSION_NOT_FOUND,
      'TOO_MANY_LOGIN_ATTEMPTS': AuthErrorCodes.TOO_MANY_LOGIN_ATTEMPTS,
      'REQUEST_TIMEOUT': AuthErrorCodes.REQUEST_TIMEOUT,
      'NETWORK_ERROR': AuthErrorCodes.NETWORK_ERROR,
    };

    return codeMap[normalizedCode] || AuthErrorCodes.UNKNOWN_ERROR;
  }

  /**
   * Infere código de erro baseado na mensagem
   * Útil quando o backend não retorna código estruturado
   */
  private static inferErrorCodeFromMessage(message: string): AuthErrorCode {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('timeout') || lowerMessage.includes('tempo esgotado')) {
      return AuthErrorCodes.REQUEST_TIMEOUT;
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('conexão')) {
      return AuthErrorCodes.NETWORK_ERROR;
    }

    if (lowerMessage.includes('credentials') || lowerMessage.includes('credenciais')) {
      return AuthErrorCodes.INVALID_CREDENTIALS;
    }

    if (lowerMessage.includes('expired') || lowerMessage.includes('expirado')) {
      return AuthErrorCodes.TOKEN_EXPIRED;
    }

    if (lowerMessage.includes('invalid token') || lowerMessage.includes('token inválido')) {
      return AuthErrorCodes.TOKEN_INVALID;
    }

    if (lowerMessage.includes('unauthorized') || lowerMessage.includes('não autorizado')) {
      return AuthErrorCodes.UNAUTHORIZED;
    }

    return AuthErrorCodes.UNKNOWN_ERROR;
  }

  /**
   * Retorna status code padrão para cada tipo de erro
   */
  private static getDefaultStatusCode(errorCode: AuthErrorCode): number {
    const statusCodeMap: Record<AuthErrorCode, number> = {
      [AuthErrorCodes.INVALID_CREDENTIALS]: 401,
      [AuthErrorCodes.EMAIL_ALREADY_EXISTS]: 400,
      [AuthErrorCodes.UNAUTHORIZED]: 401,
      [AuthErrorCodes.USER_NOT_FOUND]: 404,
      [AuthErrorCodes.TOO_MANY_LOGIN_ATTEMPTS]: 429,
      [AuthErrorCodes.TOKEN_INVALID]: 401,
      [AuthErrorCodes.TOKEN_EXPIRED]: 401,
      [AuthErrorCodes.SESSION_NOT_FOUND]: 404,
      [AuthErrorCodes.VALIDATION_FAILED]: 400,
      [AuthErrorCodes.REQUEST_TIMEOUT]: 408,
      [AuthErrorCodes.NETWORK_ERROR]: 500,
      [AuthErrorCodes.UNKNOWN_ERROR]: 500,
    };

    return statusCodeMap[errorCode] || 500;
  }

  /**
   * Traduz mensagens de validação específicas para português
   * Melhora a experiência do usuário com feedback contextual
   */
  private static translateValidationMessage(message: string, field: string): string {
    const translationMap: Record<string, string> = {
      'required': 'Este campo é obrigatório',
      'invalid_type': 'Ops, tipo de dado inválido',
      'too_small': 'Esse valor está muito pequeno',
      'too_big': 'Esse valor está muito grande',
      'invalid_string': 'Hmm, formato inválido',
      'invalid_email': 'Email inválido',
    };

    // Tenta encontrar uma tradução baseada em palavras-chave
    for (const [key, translation] of Object.entries(translationMap)) {
      if (message.toLowerCase().includes(key)) {
        return translation;
      }
    }

    // Fallback: retorna mensagem original se não houver tradução
    return message;
  }

  /**
   * Cria um erro de domínio customizado
   * Útil para erros gerados no próprio frontend
   */
  static createDomainError(
    code: AuthErrorCode,
    statusCode?: number,
    details?: ValidationDetail[]
  ): AuthDomainError {
    const messageStrategy = AuthErrorMessages[code];
    const finalStatusCode = statusCode || this.getDefaultStatusCode(code);

    return AuthDomainError.create({
      code,
      statusCode: finalStatusCode,
      messageStrategy,
      details,
    });
  }
}
