export class AuthError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(message: string, code: string, statusCode: number) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = this.constructor.name
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Credenciais inválidas', 'INVALID_CREDENTIALS', 401)
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor() {
    super('Este email já está em uso', 'EMAIL_ALREADY_EXISTS', 409)
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super('Token expirado', 'TOKEN_EXPIRED', 401)
  }
}

export class TokenInvalidError extends AuthError {
  constructor() {
    super('Token inválido', 'TOKEN_INVALID', 401)
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'Não autorizado') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}