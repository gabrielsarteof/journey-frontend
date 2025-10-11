import type { AuthRepository, AuthRepositorySpecifications } from '../../domain/repositories/AuthRepository'
import type { User, AuthResult } from '../../domain/entities/User'
import type { RegisterDTO, LoginDTO } from '../../domain/schemas/AuthSchemas'
import { BaseService } from '@/shared/domain/abstracts/BaseService'
import type { OperationLogger } from '@/shared/infrastructure/logging/OperationLogger'
import type { CircuitBreaker } from '@/shared/infrastructure/resilience/CircuitBreaker'
import type { ErrorTransformer } from '@/shared/infrastructure/errors/ErrorTransformer'
import { UserMapper } from '../mappers/UserMapper'

// RESTful Service Interface - SRP: only auth operations
export interface AuthRESTService {
  createUser(data: CreateUserData): Promise<UserResource>
  createSession(credentials: SessionCredentials): Promise<SessionResource>
  getCurrentUser(): Promise<UserResource>
  refreshSession(refreshToken: string): Promise<SessionResource>
  destroySession(sessionId: string): Promise<void>
  validateUserField(field: 'email' | 'username', value: string): Promise<ValidationResult>
}

// RESTful Resource DTOs
export interface CreateUserData {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export interface SessionCredentials {
  email: string
  password: string
}

export interface UserResource {
  id: string
  email: string
  name: string
  roles: string[]
  isActive: boolean
  currentLevel?: number
  totalXp?: number
  currentStreak?: number
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface SessionResource {
  id: string
  userId: string
  expiresAt: string
  refreshToken: string
  createdAt: string
  updatedAt: string
}

export interface ValidationResult {
  isAvailable: boolean
}

// Repository - SRP: only domain mapping and orchestration
export class ApiAuthRepository extends BaseService implements AuthRepository, AuthRepositorySpecifications {
  protected readonly serviceName = 'ApiAuthRepository'

  constructor(
    private readonly authRESTService: AuthRESTService,
    logger: OperationLogger,
    circuitBreaker: CircuitBreaker,
    errorTransformer: ErrorTransformer
  ) {
    super(logger, circuitBreaker, errorTransformer)
  }

  async register(data: RegisterDTO): Promise<AuthResult> {
    return this.executeWithMetrics(
      'register',
      async () => {
        const userResource = await this.authRESTService.createUser({
          email: data.email,
          name: data.name,
          password: data.password,
          confirmPassword: data.confirmPassword
        });

        const sessionResource = await this.authRESTService.createSession({
          email: data.email,
          password: data.password
        });

        return this.mapToAuthResult(userResource, sessionResource);
      }
    );
  }

  async login(data: LoginDTO): Promise<AuthResult> {
    return this.executeWithMetrics(
      'login',
      async () => {
        const sessionResource = await this.authRESTService.createSession({
          email: data.email,
          password: data.password
        });

        const userResource = await this.authRESTService.getCurrentUser();

        return this.mapToAuthResult(userResource, sessionResource);
      }
    );
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    return this.executeWithMetrics(
      'refreshToken',
      async () => {
        const sessionResource = await this.authRESTService.refreshSession(refreshToken);
        const userResource = await this.authRESTService.getCurrentUser();

        return this.mapToAuthResult(userResource, sessionResource);
      }
    );
  }

  async logout(refreshToken: string): Promise<void> {
    return this.executeWithMetrics(
      'logout',
      async () => {
        await this.authRESTService.destroySession(refreshToken);
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    return this.executeWithMetrics(
      'getCurrentUser',
      async () => {
        const userResource = await this.authRESTService.getCurrentUser();
        return UserMapper.toDomain(userResource);
      }
    );
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return this.executeWithMetrics(
      'isEmailUnique',
      async () => {
        const result = await this.authRESTService.validateUserField('email', email);
        return result.isAvailable;
      }
    );
  }

  async isUsernameUnique(username: string): Promise<boolean> {
    return this.executeWithMetrics(
      'isUsernameUnique',
      async () => {
        const result = await this.authRESTService.validateUserField('username', username);
        return result.isAvailable;
      }
    );
  }

  private mapToAuthResult(userResource: UserResource, sessionResource: SessionResource): AuthResult {
    return {
      user: UserMapper.toDomain(userResource),
      accessToken: sessionResource.id,
      refreshToken: sessionResource.refreshToken
    };
  }
}