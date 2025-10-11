import { BaseHttpClient, type HttpRequestConfig, type HttpResponse } from '../domain/abstracts/BaseHttpClient'

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

export interface RESTfulResource {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  links: {
    first: string
    last: string
    prev?: string
    next?: string
  }
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
  timestamp: string
  path: string
}

export abstract class RESTfulClient extends BaseHttpClient {
  protected abstract readonly apiVersion: string

  private readonly errorHandlers = new Map<HttpStatus, (response: HttpResponse<ErrorResponse>) => never>([
    [HttpStatus.BAD_REQUEST, (r) => { throw new ValidationError(r.data.error.message, r.data.error.details) }],
    [HttpStatus.UNAUTHORIZED, (r) => { throw new AuthenticationError(r.data.error.message) }],
    [HttpStatus.FORBIDDEN, (r) => { throw new AuthorizationError(r.data.error.message) }],
    [HttpStatus.NOT_FOUND, (r) => { throw new NotFoundError(r.data.error.message) }],
    [HttpStatus.CONFLICT, (r) => { throw new ConflictError(r.data.error.message) }],
    [HttpStatus.UNPROCESSABLE_ENTITY, (r) => { throw new ValidationError(r.data.error.message, r.data.error.details) }]
  ])

  protected buildResourceURL(resource: string, id?: string): string {
    const base = `${this.baseURL}/api/${this.apiVersion}/${resource}`
    return id ? `${base}/${id}` : base
  }

  async getResource<T extends RESTfulResource>(
    resource: string,
    id: string,
    config?: HttpRequestConfig
  ): Promise<T> {
    const url = this.buildResourceURL(resource, id)
    const response = await this.get<T>(url, config)
    return response
  }

  async listResources<T extends RESTfulResource>(
    resource: string,
    params?: {
      page?: number
      limit?: number
      sort?: string
      filter?: Record<string, any>
    },
    config?: HttpRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const url = this.buildResourceURL(resource)
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.sort) queryParams.set('sort', params.sort)
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        queryParams.set(`filter[${key}]`, value.toString())
      })
    }

    const fullUrl = queryParams.toString() ? `${url}?${queryParams}` : url
    return this.get<PaginatedResponse<T>>(fullUrl, config)
  }

  async createResource<T extends RESTfulResource>(
    resource: string,
    data: Omit<T, keyof RESTfulResource>,
    config?: HttpRequestConfig
  ): Promise<T> {
    const url = this.buildResourceURL(resource)
    return this.post<T>(url, data, config)
  }

  async updateResource<T extends RESTfulResource>(
    resource: string,
    id: string,
    data: Partial<Omit<T, keyof RESTfulResource>>,
    config?: HttpRequestConfig
  ): Promise<T> {
    const url = this.buildResourceURL(resource, id)
    return this.put<T>(url, data, config)
  }

  async partialUpdateResource<T extends RESTfulResource>(
    resource: string,
    id: string,
    data: Partial<Omit<T, keyof RESTfulResource>>,
    config?: HttpRequestConfig
  ): Promise<T> {
    const url = this.buildResourceURL(resource, id)
    return this.patch<T>(url, data, config)
  }

  async deleteResource(
    resource: string,
    id: string,
    config?: HttpRequestConfig
  ): Promise<void> {
    const url = this.buildResourceURL(resource, id)
    await this.delete<void>(url, config)
  }

  protected async patch<T>(endpoint: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.executeRequest<T>('PATCH', endpoint, config, data)
  }

  protected handleRESTfulError(response: HttpResponse<ErrorResponse>): never {
    const handler = this.errorHandlers.get(response.status)
    if (handler) {
      handler(response)
    }
    throw new ServerError(response.data.error.message, response.status)
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ServerError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message)
    this.name = 'ServerError'
  }
}

export interface SessionResource extends RESTfulResource {
  userId: string
  expiresAt: string
  refreshToken: string
}

export interface UserResource extends RESTfulResource {
  email: string
  name: string
  roles: string[]
  isActive: boolean
  lastLoginAt?: string
}

export abstract class AuthRESTfulClient extends RESTfulClient {
  protected readonly apiVersion = 'v1'

  async createSession(credentials: { email: string; password: string }): Promise<SessionResource> {
    const url = this.buildResourceURL('sessions')
    return this.post<SessionResource>(url, credentials)
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.deleteResource('sessions', sessionId)
  }

  async refreshSession(refreshToken: string): Promise<SessionResource> {
    const url = this.buildResourceURL('sessions', 'refresh')
    return this.post<SessionResource>(url, { refreshToken })
  }

  async getCurrentUser(): Promise<UserResource> {
    const url = this.buildResourceURL('users', 'me')
    return this.get<UserResource>(url)
  }

  async createUser(userData: Omit<UserResource, keyof RESTfulResource | 'roles' | 'isActive' | 'lastLoginAt'> & { password: string; confirmPassword: string }): Promise<UserResource> {
    const url = this.buildResourceURL('users')
    return this.post<UserResource>(url, userData)
  }

  async validateUserField(field: 'email' | 'username', value: string): Promise<{ isAvailable: boolean }> {
    const url = `${this.buildResourceURL('users')}/validate?${field}=${encodeURIComponent(value)}`
    return this.get<{ isAvailable: boolean }>(url)
  }
}