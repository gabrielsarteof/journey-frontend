/**
 * Error Catalog - Domain Layer
 *
 * Catálogo centralizado de códigos de erro de autenticação
 * Implementa o padrão Value Object para garantir type safety
 *
 * @pattern ValueObject, ErrorCatalog
 * @layer Domain
 */

export const AuthErrorCodes = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  TOO_MANY_LOGIN_ATTEMPTS: 'TOO_MANY_LOGIN_ATTEMPTS',

  // Token Errors
  TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',

  // Session Errors
  SESSION_NOT_FOUND: 'AUTH_SESSION_NOT_FOUND',

  // Validation Errors
  VALIDATION_FAILED: 'AUTH_VALIDATION_FAILED',

  // Network Errors
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = typeof AuthErrorCodes[keyof typeof AuthErrorCodes];
