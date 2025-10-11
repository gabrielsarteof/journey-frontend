export { useAuth } from './application/hooks/useAuth'
export { useAuthStore } from './application/stores/authStore'
export { LandingPage, LoginPage, RegisterPage } from './presentation/pages'

export type { User, AuthTokens, AuthResult, AuthState } from './domain/entities/User'
export type { AuthRepository } from './domain/repositories/AuthRepository'
export type { AuthService } from './domain/services/AuthService'
export type { RegisterDTO, LoginDTO, ApiResponse, ApiError } from './domain/schemas/AuthSchemas'
export { AuthError, InvalidCredentialsError, EmailAlreadyExistsError } from './domain/errors/AuthErrors'

export { AccessToken, RefreshToken, AuthTokenPair } from './domain/value-objects/AuthTokens'
export type { TokenStorage } from './infrastructure/storage/TokenStorage'

export { setupAuthDI, getAuthService, getTokenStorage } from './infrastructure/di/AuthDISetup'