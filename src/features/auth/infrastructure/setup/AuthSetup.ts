import React from 'react';
import { ApiAuthRepository } from '../repositories/ApiAuthRepository';
import { AuthDomainService } from '../../domain/services/AuthService';
import { AuthRESTServiceImpl } from '../http/AuthHttpClient';
import { LocalStorageTokenStorage } from '../storage/TokenStorage';
import { componentSystemBuilder } from '@/shared/patterns/factories';
import { CacheService, LocalStorageCacheStrategy } from '@/shared/domain/contracts/CacheService';
import { ConsoleOperationLogger } from '@/shared/infrastructure/logging/OperationLogger';
import { CircuitBreaker, InMemoryCircuitBreakerStorage } from '@/shared/infrastructure/resilience/CircuitBreaker';
import { ErrorTransformer } from '@/shared/infrastructure/errors/ErrorTransformer';
import { env } from '@/shared/config/env';

// Factory following SOLID + DI principles
class AuthRESTServiceFactory {
  static create(): AuthRESTServiceImpl {
    const tokenStorage = new LocalStorageTokenStorage(
      env.AUTH_TOKEN_STORAGE_KEY,
      env.AUTH_REFRESH_TOKEN_STORAGE_KEY
    );
    return new AuthRESTServiceImpl(
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      10000, // timeout
      tokenStorage
    );
  }
}

class AuthRepositoryFactory {
  static create(): ApiAuthRepository {
    const authRESTService = AuthRESTServiceFactory.create();
    return new ApiAuthRepository(
      authRESTService,
      new ConsoleOperationLogger(),
      new CircuitBreaker(
        new InMemoryCircuitBreakerStorage(),
        { failureThreshold: 5, resetTimeoutMs: 60000 }
      ),
      new ErrorTransformer()
    );
  }
}

class AuthServiceFactory {
  static create(): AuthDomainService {
    const repository = AuthRepositoryFactory.create();
    return new AuthDomainService(repository);
  }
}

class AuthCacheServiceFactory {
  static create(): CacheService {
    const strategy = new LocalStorageCacheStrategy('auth');
    return new CacheService(strategy);
  }
}

export class AuthContainer {
  private static instance: AuthContainer;
  private authRepository?: ApiAuthRepository;
  private authService?: AuthDomainService;
  private cacheService?: CacheService;

  private constructor() {}

  static getInstance(): AuthContainer {
    if (!AuthContainer.instance) {
      AuthContainer.instance = new AuthContainer();
    }
    return AuthContainer.instance;
  }

  getAuthRepository(): ApiAuthRepository {
    if (!this.authRepository) {
      this.authRepository = AuthRepositoryFactory.create();
    }
    return this.authRepository;
  }

  getAuthService(): AuthDomainService {
    if (!this.authService) {
      this.authService = AuthServiceFactory.create();
    }
    return this.authService;
  }

  getCacheService(): CacheService {
    if (!this.cacheService) {
      this.cacheService = AuthCacheServiceFactory.create();
    }
    return this.cacheService;
  }
}

// Setup do sistema de componentes para Auth
export function setupAuthComponents() {
  const resolver = componentSystemBuilder
    .withPermissions(['user'])
    .registerSync(
      'LoginForm',
      ({ onSubmit, isLoading }) => {
        return React.createElement('form', { onSubmit },
          React.createElement('input', { type: 'email', placeholder: 'Email', required: true }),
          React.createElement('input', { type: 'password', placeholder: 'Senha', required: true }),
          React.createElement('button', { type: 'submit', disabled: isLoading },
            isLoading ? 'Entrando...' : 'Entrar'
          )
        );
      },
      'auth',
      {
        defaultProps: { isLoading: false },
        propValidator: (props) => typeof props.onSubmit === 'function'
      }
    )
    .registerSync(
      'RegisterForm',
      ({ onSubmit, isLoading }) => {
        return React.createElement('form', { onSubmit },
          React.createElement('input', { type: 'text', placeholder: 'Nome', required: true }),
          React.createElement('input', { type: 'email', placeholder: 'Email', required: true }),
          React.createElement('input', { type: 'password', placeholder: 'Senha', required: true }),
          React.createElement('input', { type: 'password', placeholder: 'Confirmar Senha', required: true }),
          React.createElement('label', {},
            React.createElement('input', { type: 'checkbox', required: true }),
            'Aceito os termos de uso'
          ),
          React.createElement('button', { type: 'submit', disabled: isLoading },
            isLoading ? 'Registrando...' : 'Registrar'
          )
        );
      },
      'auth',
      {
        defaultProps: { isLoading: false },
        propValidator: (props) => typeof props.onSubmit === 'function'
      }
    )
    .build();

  return resolver;
}

// Hook para usar os serviços de auth com cache
export function useAuthWithCache() {
  const container = AuthContainer.getInstance();
  const authService = container.getAuthService();
  const cacheService = container.getCacheService();

  const loginWithCache = async (credentials: any) => {
    const cacheKey = `login_attempt_${credentials.email}`;

    // Verifica se há tentativa recente (rate limiting)
    const recentAttempt = await cacheService.get(cacheKey);
    if (recentAttempt) {
      throw new Error('Muitas tentativas de login. Tente novamente em alguns minutos.');
    }

    try {
      const result = await authService.authenticate(credentials);

      // Cache do usuário autenticado
      await cacheService.set(`user_${result.user.id}`, result.user, 15 * 60 * 1000);

      return result;
    } catch (error) {
      // Cache da tentativa falhada para rate limiting
      await cacheService.set(cacheKey, true, 5 * 60 * 1000);
      throw error;
    }
  };

  const registerWithValidation = async (userData: any) => {
    return await authService.register(userData);
  };

  const getCachedUser = async (userId: string) => {
    return await cacheService.get(`user_${userId}`);
  };

  return {
    loginWithCache,
    registerWithValidation,
    getCachedUser,
    authService,
    cacheService
  };
}