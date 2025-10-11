import type { User, AuthResult } from '../entities/User'
import type { RegisterDTO, LoginDTO } from '../schemas/AuthSchemas'
import type { AuthRepository, AuthRepositorySpecifications } from '../repositories/AuthRepository'
import { RefreshToken, AuthTokenPair } from '../value-objects/AuthTokens'
import {
  DomainValidationService,
  DomainValidationServiceFactory
} from '@/shared/domain/validation/DomainValidationService'

export interface AuthService {
  authenticate(credentials: LoginDTO): Promise<AuthResult>
  register(userData: RegisterDTO): Promise<AuthResult>
  refreshAuthentication(refreshToken: RefreshToken): Promise<AuthResult>
  logout(refreshToken: RefreshToken): Promise<void>
  getCurrentUser(): Promise<User>
  validateTokens(tokens: AuthTokenPair): boolean
}

// Domain Service seguindo DDD - coordena validações e operações de domínio
export class AuthDomainService implements AuthService {
  private readonly validationService: DomainValidationService

  constructor(
    private readonly authRepository: AuthRepository & AuthRepositorySpecifications
  ) {
    // Factory para injetar as specifications assíncronas
    this.validationService = DomainValidationServiceFactory.create(
      (email: string) => this.authRepository.isEmailUnique(email),
      (username: string) => this.authRepository.isUsernameUnique(username)
    );
  }

  async authenticate(credentials: LoginDTO): Promise<AuthResult> {
    const startTime = performance.now();

    try {
      console.debug('[AuthService] Starting authentication', { email: credentials.email });

      // Validação de domínio usando Value Objects e Specification pattern
      const validationResult = await this.validationService.validateUserLogin(credentials);
      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(e => e.message).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      const result = await this.authRepository.login(credentials);

      const duration = performance.now() - startTime;
      console.info(`[AuthService] Authentication completed in ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[AuthService] Authentication failed after ${duration.toFixed(2)}ms:`, error);
      // Propaga erro de domínio para camadas superiores
      throw error;
    }
  }

  async register(userData: RegisterDTO): Promise<AuthResult> {
    const startTime = performance.now();

    try {
      console.debug('[AuthService] Starting registration', { email: userData.email });

      // Validação completa de domínio com specifications assíncronas
      const validationResult = await this.validationService.validateUserRegistration(userData);
      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(e => e.message).join(', ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }

      const result = await this.authRepository.register(userData);

      const duration = performance.now() - startTime;
      console.info(`[AuthService] Registration completed in ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[AuthService] Registration failed after ${duration.toFixed(2)}ms:`, error);
      // Propaga erro de domínio para camadas superiores
      throw error;
    }
  }

  async refreshAuthentication(refreshToken: RefreshToken): Promise<AuthResult> {
    const startTime = performance.now();

    try {
      console.debug('[AuthService] Starting token refresh');

      const result = await this.authRepository.refreshToken(refreshToken.getValue());

      const duration = performance.now() - startTime;
      console.info(`[AuthService] Token refresh completed in ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[AuthService] Token refresh failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  async logout(refreshToken: RefreshToken): Promise<void> {
    const startTime = performance.now();

    try {
      console.debug('[AuthService] Starting logout');

      await this.authRepository.logout(refreshToken.getValue());

      const duration = performance.now() - startTime;
      console.info(`[AuthService] Logout completed in ${duration.toFixed(2)}ms`);
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[AuthService] Logout failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const startTime = performance.now();

    try {
      console.debug('[AuthService] Getting current user');

      const result = await this.authRepository.getCurrentUser();

      const duration = performance.now() - startTime;
      console.info(`[AuthService] Get current user completed in ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[AuthService] Get current user failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  validateTokens(tokens: AuthTokenPair): boolean {
    return !tokens.isAccessTokenExpired()
  }
}