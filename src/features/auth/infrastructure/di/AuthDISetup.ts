import { container } from '../../../../shared/di/Container'
import { AUTH_SERVICE_KEYS } from './AuthServiceKeys'
import { env } from '../../../../shared/config/env'

import { AuthDomainService } from '../../domain/services/AuthService'
import { ApiAuthRepository } from '../repositories/ApiAuthRepository'
import { AuthRESTServiceImpl } from '../http/AuthHttpClient'
import { LocalStorageTokenStorage } from '../storage/TokenStorage'
import { ConsoleOperationLogger } from '../../../../shared/infrastructure/logging/OperationLogger'
import { CircuitBreaker, InMemoryCircuitBreakerStorage } from '../../../../shared/infrastructure/resilience/CircuitBreaker'
import { ErrorTransformer } from '../../../../shared/infrastructure/errors/ErrorTransformer'

export function setupAuthDI(): void {
  container.register(
    AUTH_SERVICE_KEYS.TokenStorage,
    () => new LocalStorageTokenStorage(
      env.AUTH_TOKEN_STORAGE_KEY,
      env.AUTH_REFRESH_TOKEN_STORAGE_KEY
    ),
    { singleton: true }
  )

  container.register(
    AUTH_SERVICE_KEYS.AuthRESTService,
    () => new AuthRESTServiceImpl(
      env.API_BASE_URL,
      env.API_TIMEOUT,
      container.resolve(AUTH_SERVICE_KEYS.TokenStorage)
    ),
    { singleton: true }
  )

  container.register(
    AUTH_SERVICE_KEYS.AuthRepository,
    () => new ApiAuthRepository(
      container.resolve(AUTH_SERVICE_KEYS.AuthRESTService),
      new ConsoleOperationLogger(),
      new CircuitBreaker(
        new InMemoryCircuitBreakerStorage(),
        { failureThreshold: 5, resetTimeoutMs: 60000 }
      ),
      new ErrorTransformer()
    ),
    { singleton: true }
  )

  container.register(
    AUTH_SERVICE_KEYS.AuthService,
    () => new AuthDomainService(
      container.resolve(AUTH_SERVICE_KEYS.AuthRepository)
    ),
    { singleton: true }
  )
}

export function getAuthService(): AuthDomainService {
  return container.resolve(AUTH_SERVICE_KEYS.AuthService) as AuthDomainService
}

export function getTokenStorage(): LocalStorageTokenStorage {
  return container.resolve(AUTH_SERVICE_KEYS.TokenStorage) as LocalStorageTokenStorage
}

export function getAuthRepository(): ApiAuthRepository {
  return container.resolve(AUTH_SERVICE_KEYS.AuthRepository) as ApiAuthRepository
}