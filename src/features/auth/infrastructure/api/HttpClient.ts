import { env } from '../../../../shared/config/env'
import type { ApiResponse, ApiError } from '../../domain/schemas/AuthSchemas'
import { AuthErrorMapper } from '../../domain/mappers/AuthErrorMapper'
import { AuthDomainError } from '../../domain/errors/AuthDomainError'
import { AuthErrorCodes } from '../../domain/errors/AuthErrorCodes'

/**
 * HTTP Client - Infrastructure Layer
 *
 * Cliente HTTP especializado para autenticação
 * Implementa tradução de erros HTTP para erros de domínio
 *
 * @pattern Adapter, Gateway
 * @layer Infrastructure
 */
class HttpClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = env.API_BASE_URL
    this.timeout = env.API_TIMEOUT
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const token = this.getStoredToken()
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
   }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
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
        const errorData: ApiError = await response.json()
        // Usa AuthErrorMapper para criar erro de domínio localizado
        const domainError = AuthErrorMapper.toDomain(errorData)
        throw domainError
      }

      const data: ApiResponse<T> = await response.json()
      return data.data
    } catch (error: unknown) {
      clearTimeout(timeoutId)

      // Se já é um AuthDomainError, propaga
      if (error instanceof AuthDomainError) {
        throw error
      }

      // Timeout de requisição
      if (error instanceof Error && error.name === 'AbortError') {
        throw AuthErrorMapper.createDomainError(
          AuthErrorCodes.REQUEST_TIMEOUT,
          408
        )
      }

      // Erro de rede genérico
      if (error instanceof Error) {
        throw AuthErrorMapper.createDomainError(
          AuthErrorCodes.NETWORK_ERROR,
          500
        )
      }

      // Fallback para erros desconhecidos
      throw AuthErrorMapper.toDomain(error)
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(env.AUTH_TOKEN_STORAGE_KEY)
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(env.AUTH_TOKEN_STORAGE_KEY, token)
  }

  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(env.AUTH_TOKEN_STORAGE_KEY)
  }
}

export const httpClient = new HttpClient()