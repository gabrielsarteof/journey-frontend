/**
 * AuthError - Classe base para erros de autenticação
 *
 * Erro genérico usado pela camada de infraestrutura (HTTP)
 * para comunicar problemas técnicos que depois serão mapeados
 * pelo AuthErrorMapper para mensagens amigáveis.
 *
 * @layer Infrastructure
 */
export class AuthError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string, statusCode: number) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = this.constructor.name
  }

  /**
   * Factory methods para criar erros comuns
   * Simplifica a criação de erros frequentes
   */
  static invalidCredentials(): AuthError {
    return new AuthError('Email ou senha incorretos', 'INVALID_CREDENTIALS', 401)
  }

  static emailAlreadyExists(): AuthError {
    return new AuthError('Esse email já está em uso', 'EMAIL_ALREADY_EXISTS', 409)
  }

  static tokenExpired(): AuthError {
    return new AuthError('Sua sessão expirou', 'TOKEN_EXPIRED', 401)
  }

  static tokenInvalid(): AuthError {
    return new AuthError('Sessão inválida', 'TOKEN_INVALID', 401)
  }

  static unauthorized(message: string = 'Acesso negado'): AuthError {
    return new AuthError(message, 'UNAUTHORIZED', 401)
  }

  static validation(message: string): AuthError {
    return new AuthError(message, 'VALIDATION_ERROR', 400)
  }

  static networkError(): AuthError {
    return new AuthError('Erro de conexão com o servidor', 'NETWORK_ERROR', 500)
  }

  static timeout(): AuthError {
    return new AuthError('Timeout na requisição', 'REQUEST_TIMEOUT', 408)
  }
}