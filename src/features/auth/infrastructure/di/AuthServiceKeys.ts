export const AUTH_SERVICE_KEYS = {
  AuthRepository: Symbol('AuthRepository'),
  AuthService: Symbol('AuthService'),
  AuthRESTService: Symbol('AuthRESTService'),
  TokenStorage: Symbol('TokenStorage'),
  SessionStorage: Symbol('SessionStorage')
} as const

export type AuthServiceKey = typeof AUTH_SERVICE_KEYS[keyof typeof AUTH_SERVICE_KEYS]