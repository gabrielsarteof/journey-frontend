/**
 * Router Context Type
 *
 * Define o tipo do contexto que será passado para todas as rotas
 * através do TanStack Router
 *
 * @pattern Context Provider
 */

import type { User, AuthTokens } from '@/features/auth/domain/entities/User'

export interface RouterContext {
  auth: {
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isLoading: boolean
    hasHydrated: boolean
  }
}
