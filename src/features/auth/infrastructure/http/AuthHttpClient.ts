// Removed HttpClient import - now using AuthRESTService interface
import type { TokenStorage } from '../storage/TokenStorage'
import { AuthError } from '../../domain/errors/AuthErrors'
import type { ApiResponse, ApiError } from '../../domain/schemas/AuthSchemas'
import type {
  AuthRESTService,
  CreateUserData,
  SessionCredentials,
  UserResource,
  SessionResource,
  ValidationResult,
  RegisterResponse
} from '../repositories/ApiAuthRepository'

// RESTful Service Implementation - SRP: only auth REST operations
export class AuthRESTServiceImpl implements AuthRESTService {
  private readonly baseURL: string
  private readonly timeout: number
  private readonly tokenStorage: TokenStorage

  private readonly errorHandlers: Record<number, (message?: string) => AuthError> = {
    400: (msg) => AuthError.validation(msg || 'Dados inválidos'),
    401: (msg) => AuthError.unauthorized(msg),
    403: (msg) => new AuthError(msg || 'Acesso negado', 'FORBIDDEN', 403),
    422: (msg) => AuthError.validation(msg || 'Dados não processáveis'),
  }

  constructor(baseURL: string, timeout: number, tokenStorage: TokenStorage) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.tokenStorage = tokenStorage
  }

  // RESTful Auth Operations - following backend routes
  async createUser(data: CreateUserData): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createSession(credentials: SessionCredentials): Promise<SessionResource> {
    return this.request<SessionResource>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getCurrentUser(): Promise<UserResource> {
    return this.request<UserResource>('/api/auth/me', { method: 'GET' })
  }

  async refreshSession(refreshToken: string): Promise<SessionResource> {
    return this.request<SessionResource>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.request<void>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: sessionId }),
    })
  }

  async validateUserField(field: 'email' | 'username', value: string): Promise<ValidationResult> {
    // Endpoint não implementado - validação acontece no registro
    console.warn('[AuthHttpClient] validateUserField - endpoint não disponível')
    return Promise.resolve({ isAvailable: true })
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(options.headers as Record<string, string> | undefined)

    const config: RequestInit = {
      ...options,
      headers,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data: ApiResponse<T> = await response.json()
        return data.data
      }

      return undefined as T
    } catch (error: unknown) {
      clearTimeout(timeoutId)
      throw this.handleRequestError(error)
    }
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    const accessToken = this.tokenStorage.getAccessToken()
    if (accessToken && !accessToken.isExpired()) {
      defaultHeaders.Authorization = `Bearer ${accessToken.getValue()}`
    }

    return { ...defaultHeaders, ...customHeaders }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get('content-type')
    let errorData: ApiError | undefined

    if (contentType?.includes('application/json')) {
      try {
        errorData = await response.json()
      } catch {
        errorData = undefined
      }
    }

    // Se temos o código de erro do backend, lançamos com o código para ser mapeado
    if (errorData?.code) {
      throw new AuthError(
        errorData.message || 'Erro de autenticação',
        errorData.code,
        response.status
      )
    }

    // Fallback para erro genérico baseado no status
    const handler = this.errorHandlers[response.status]
    if (handler) {
      throw handler(errorData?.message)
    }

    throw new AuthError(
      errorData?.message || `Erro HTTP ${response.status}: ${response.statusText}`,
      'HTTP_ERROR',
      response.status
    )
  }

  private handleRequestError(error: unknown): AuthError {
    if (error instanceof AuthError) {
      return error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return AuthError.timeout()
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return AuthError.networkError()
    }

    return new AuthError(
      'Erro inesperado na requisição',
      'UNKNOWN_ERROR',
      500
    )
  }
}