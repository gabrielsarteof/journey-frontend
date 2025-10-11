/**
 * Auth Domain Errors - Public API
 *
 * Barrel export que expõe a API pública da camada de erros
 * Facilita imports e mantém encapsulamento
 *
 * @pattern Facade
 * @layer Domain
 */

export { AuthDomainError, type ValidationDetail, type AuthDomainErrorProps } from './AuthDomainError';
export { AuthErrorCodes, type AuthErrorCode } from './AuthErrorCodes';
export { AuthErrorMessages, type ErrorMessageStrategy } from './AuthErrorMessages';

// Mantém compatibilidade com código legado
export { AuthError } from './AuthErrors';
