export interface RequestContext {
  url: string
  method: string
  headers: Record<string, string>
  body?: unknown
  metadata: Record<string, unknown>
}

export interface ResponseContext {
  status: number
  statusText: string
  headers: Record<string, string>
  data?: unknown
  metadata: Record<string, unknown>
}

export interface MiddlewareContext {
  request: RequestContext
  response?: ResponseContext
  error?: Error
  metadata: Record<string, unknown>
}

export interface Middleware {
  execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext>
}

export type MiddlewareNext = (context: MiddlewareContext) => Promise<MiddlewareContext>

export const MiddlewarePhase = {
  REQUEST: 'request',
  RESPONSE: 'response',
  ERROR: 'error'
} as const

export type MiddlewarePhase = typeof MiddlewarePhase[keyof typeof MiddlewarePhase]

export interface MiddlewareExecutor {
  addMiddleware(middleware: Middleware, phase?: MiddlewarePhase): void
  execute(context: MiddlewareContext): Promise<MiddlewareContext>
}

export abstract class BaseMiddleware implements Middleware {
  protected readonly name: string

  constructor(name: string) {
    this.name = name
  }

  abstract execute(context: MiddlewareContext, next: MiddlewareNext): Promise<MiddlewareContext>

  protected log(level: 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    const logData = {
      middleware: this.name,
      timestamp: new Date().toISOString(),
      message,
      ...(data ? { data } : {})
    }

    console[level](`[Middleware:${this.name}]`, logData)
  }
}