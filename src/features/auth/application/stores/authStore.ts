import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '../../domain/entities/User'
import type { RegisterDTO, LoginDTO } from '../../domain/schemas/AuthSchemas'
import { AuthDomainError } from '../../domain/errors/AuthDomainError'
import { RefreshToken } from '../../domain/value-objects/AuthTokens'
import { env } from '../../../../shared/config/env'
import { AuthContainer } from '../../infrastructure/setup/AuthSetup'

interface AuthActions {
  login: (data: LoginDTO) => Promise<void>
  register: (data: RegisterDTO) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export function createAuthStore() {
  const container = AuthContainer.getInstance();
  const authService = container.getAuthService();
  const cacheService = container.getCacheService();
  return create<AuthStore>()(
  env.ENABLE_AUTH_PERSISTENCE ? persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginDTO) => {
        try {
          set({ isLoading: true, error: null })

          const result = await authService.authenticate(data)

          // Cache com TTL baseado no token
          await cacheService.set('current_user', result.user, 15 * 60 * 1000)
          await cacheService.set('access_token', result.accessToken, 15 * 60 * 1000)
          await cacheService.set('refresh_token', result.refreshToken, 7 * 24 * 60 * 60 * 1000)

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Extrai mensagem localizada do AuthDomainError
          const errorMessage = error instanceof AuthDomainError
            ? error.getDisplayMessage()
            : 'Erro inesperado ao fazer login. Por favor, tente novamente.'

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      register: async (data: RegisterDTO) => {
        try {
          set({ isLoading: true, error: null })

          const result = await authService.register(data)

          await cacheService.set('current_user', result.user, 15 * 60 * 1000)
          await cacheService.set('access_token', result.accessToken, 15 * 60 * 1000)
          await cacheService.set('refresh_token', result.refreshToken, 7 * 24 * 60 * 60 * 1000)

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Extrai mensagem localizada do AuthDomainError
          const errorMessage = error instanceof AuthDomainError
            ? error.getDisplayMessage()
            : 'Erro inesperado ao criar conta. Por favor, tente novamente.'

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          const refreshToken = await cacheService.get<string>('refresh_token')
          if (refreshToken) {
            await authService.logout(new RefreshToken(refreshToken))
          }
        } catch (error) {
          console.error('Erro ao fazer logout:', error)
        } finally {
          // Limpa cache de auth
          await cacheService.clear('current_user')
          await cacheService.clear('access_token')
          await cacheService.clear('refresh_token')

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      refreshToken: async () => {
        try {
          const currentState = get()
          const refreshToken = currentState.tokens?.refreshToken
          if (!refreshToken) {
            throw new Error('Refresh token não encontrado')
          }

          const result = await authService.refreshAuthentication(new RefreshToken(refreshToken))

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
          })
        } catch (error) {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: 'Sessão expirada',
          })
          throw error
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true })

          const user = await authService.getCurrentUser()

          set({
            user,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: 'Erro ao carregar dados do usuário',
          })
          throw error
        }
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: env.AUTH_SESSION_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ) : (set, get) => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (data: LoginDTO) => {
      try {
        set({ isLoading: true, error: null })

        const result = await authService.authenticate(data)

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        // Extrai mensagem localizada do AuthDomainError
        const errorMessage = error instanceof AuthDomainError
          ? error.getDisplayMessage()
          : 'Erro inesperado ao fazer login. Por favor, tente novamente.'

        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
        })
        throw error
      }
    },

    register: async (data: RegisterDTO) => {
      try {
        set({ isLoading: true, error: null })

        const result = await authService.register(data)

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        // Extrai mensagem localizada do AuthDomainError
        const errorMessage = error instanceof AuthDomainError
          ? error.getDisplayMessage()
          : 'Erro inesperado ao criar conta. Por favor, tente novamente.'

        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
        })
        throw error
      }
    },

    logout: async () => {
      try {
        const currentState = get()
        const refreshToken = currentState.tokens?.refreshToken
        if (refreshToken) {
          await authService.logout(new RefreshToken(refreshToken))
        }
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      } finally {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        })
      }
    },

    refreshToken: async () => {
      try {
        const currentState = get()
        const refreshToken = currentState.tokens?.refreshToken
        if (!refreshToken) {
          throw new Error('Refresh token não encontrado')
        }

        const result = await authService.refreshAuthentication(new RefreshToken(refreshToken))

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
        })
      } catch (error) {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: 'Sessão expirada',
        })
        throw error
      }
    },

    getCurrentUser: async () => {
      try {
        set({ isLoading: true })

        const user = await authService.getCurrentUser()

        set({
          user,
          isLoading: false,
        })
      } catch (error) {
        set({
          isLoading: false,
          error: 'Erro ao carregar dados do usuário',
        })
        throw error
      }
    },

    setError: (error: string | null) => {
      set({ error })
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading })
    },

    clearError: () => {
      set({ error: null })
    },
  })
  )
}

export const useAuthStore = createAuthStore()