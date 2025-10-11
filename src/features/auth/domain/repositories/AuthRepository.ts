import type { User, AuthResult } from '../entities/User'
import type { RegisterDTO, LoginDTO } from '../schemas/AuthSchemas'

// Interface no domínio seguindo Dependency Inversion Principle
export interface AuthRepository {
  register(data: RegisterDTO): Promise<AuthResult>
  login(data: LoginDTO): Promise<AuthResult>
  refreshToken(refreshToken: string): Promise<AuthResult>
  logout(refreshToken: string): Promise<void>
  getCurrentUser(): Promise<User>
}

// Specifications para validações que dependem de infraestrutura
export interface AuthRepositorySpecifications {
  isEmailUnique(email: string): Promise<boolean>
  isUsernameUnique(username: string): Promise<boolean>
}