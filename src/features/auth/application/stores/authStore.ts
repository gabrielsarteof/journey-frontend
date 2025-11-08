import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, AuthResult } from '../../domain/entities/User'
import type { RegisterDTO, LoginDTO } from '../../domain/schemas/AuthSchemas'
import { AuthDomainError } from '../../domain/errors/AuthDomainError'
import { RefreshToken } from '../../domain/value-objects/AuthTokens'
import { env } from '../../../../shared/config/env'
import { AuthContainer } from '../../infrastructure/setup/AuthSetup'
import type { useMultiTabSync } from '../../presentation/hooks/useMultiTabSync'

type AuthBroadcast = ReturnType<typeof useMultiTabSync>

interface AuthActions {
  login: (data: LoginDTO) => Promise<void>
  register: (data: RegisterDTO) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<AuthResult>
  getCurrentUser: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
  setHasHydrated: (hasHydrated: boolean) => void
  setBroadcast: (broadcast: AuthBroadcast) => void
  _broadcast: AuthBroadcast | null
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
      hasHydrated: false,
      tokenExpiresAt: null,
      _broadcast: null,

      login: async (data: LoginDTO) => {
        try {
          set({ isLoading: true, error: null })

          const result = await authService.authenticate(data)

          const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
          storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
          localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

          await cacheService.set('current_user', result.user, 15 * 60 * 1000)
          await cacheService.set('access_token', result.accessToken, 15 * 60 * 1000)
          await cacheService.set('refresh_token', result.refreshToken, 7 * 24 * 60 * 60 * 1000)

          const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
          const expiresAt = tokenPayload.exp * 1000

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
            isLoading: false,
            tokenExpiresAt: expiresAt,
          })

          const broadcast = get()._broadcast
          if (broadcast) {
            broadcast.login(result.accessToken, result.refreshToken, result.user)
          }
        } catch (error) {
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

          const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
          storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
          localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

          await cacheService.set('current_user', result.user, 15 * 60 * 1000)
          await cacheService.set('access_token', result.accessToken, 15 * 60 * 1000)
          await cacheService.set('refresh_token', result.refreshToken, 7 * 24 * 60 * 60 * 1000)

          const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
          const expiresAt = tokenPayload.exp * 1000

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
            isLoading: false,
            tokenExpiresAt: expiresAt,
          })

          const broadcast = get()._broadcast
          if (broadcast) {
            broadcast.login(result.accessToken, result.refreshToken, result.user)
          }
        } catch (error) {
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
        const broadcast = get()._broadcast
        if (broadcast) {
          broadcast.logout('User initiated logout')
        }

        try {
          const refreshToken = await cacheService.get<string>('refresh_token')
          if (refreshToken) {
            await authService.logout(new RefreshToken(refreshToken))
          }
        } catch (error) {
          console.error('Erro ao fazer logout:', error)
        } finally {
          const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
          storage.removeItem(env.AUTH_TOKEN_STORAGE_KEY)
          localStorage.removeItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY)

          await cacheService.clear('current_user')
          await cacheService.clear('access_token')
          await cacheService.clear('refresh_token')

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          })

          window.location.href = '/auth/login'
        }
      },

      refreshToken: async () => {
        const currentState = get()

        try {
          const refreshToken = currentState.tokens?.refreshToken

          if (!refreshToken) {
            throw new Error('Refresh token não encontrado')
          }

          console.log('[AuthStore] Iniciando refresh de token...')

          const result = await authService.refreshAuthentication(new RefreshToken(refreshToken))

          const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
          storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
          localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

          await cacheService.set('access_token', result.accessToken, 15 * 60 * 1000)
          await cacheService.set('refresh_token', result.refreshToken, 7 * 24 * 60 * 60 * 1000)

          const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
          const expiresAt = tokenPayload.exp * 1000

          set({
            user: result.user,
            tokens: {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            },
            isAuthenticated: true,
            error: null,
            tokenExpiresAt: expiresAt,
          })

          const broadcast = get()._broadcast
          if (broadcast) {
            broadcast.tokenRefreshed(result.accessToken, result.refreshToken)
          }

          console.log('[AuthStore] Refresh de token bem-sucedido')

          return result
        } catch (error) {
          console.error('[AuthStore] Falha no refresh de token:', error)

          const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
          storage.removeItem(env.AUTH_TOKEN_STORAGE_KEY)
          localStorage.removeItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY)

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: 'Sessão expirada. Por favor, faça login novamente.',
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

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated })
      },

      setBroadcast: (broadcast: AuthBroadcast) => {
        set({ _broadcast: broadcast })
      },
    }),
    {
      name: env.AUTH_SESSION_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<AuthState>),
        login: currentState.login,
        register: currentState.register,
        logout: currentState.logout,
        refreshToken: currentState.refreshToken,
        getCurrentUser: currentState.getCurrentUser,
        setError: currentState.setError,
        setLoading: currentState.setLoading,
        clearError: currentState.clearError,
        setHasHydrated: currentState.setHasHydrated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  ) : (set, get) => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    hasHydrated: true,
    tokenExpiresAt: null,
    _broadcast: null,

    login: async (data: LoginDTO) => {
      try {
        set({ isLoading: true, error: null })

        const result = await authService.authenticate(data)

        const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
        storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
        localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

        const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
        const expiresAt = tokenPayload.exp * 1000

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
          isLoading: false,
          tokenExpiresAt: expiresAt,
        })

        const broadcast = get()._broadcast
        if (broadcast) {
          broadcast.login(result.accessToken, result.refreshToken, result.user)
        }
      } catch (error) {
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

        const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
        storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
        localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

        const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
        const expiresAt = tokenPayload.exp * 1000

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
          isLoading: false,
          tokenExpiresAt: expiresAt,
        })

        const broadcast = get()._broadcast
        if (broadcast) {
          broadcast.login(result.accessToken, result.refreshToken, result.user)
        }
      } catch (error) {
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
      const broadcast = get()._broadcast
      if (broadcast) {
        broadcast.logout('User initiated logout')
      }

      try {
        const currentState = get()
        const refreshToken = currentState.tokens?.refreshToken
        if (refreshToken) {
          await authService.logout(new RefreshToken(refreshToken))
        }
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      } finally {
        const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
        storage.removeItem(env.AUTH_TOKEN_STORAGE_KEY)
        localStorage.removeItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY)

        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        })

        window.location.href = '/auth/login'
      }
    },

    refreshToken: async () => {
      const currentState = get()

      try {
        const refreshToken = currentState.tokens?.refreshToken

        if (!refreshToken) {
          throw new Error('Refresh token não encontrado')
        }

        console.log('[AuthStore] Iniciando refresh de token...')

        const result = await authService.refreshAuthentication(new RefreshToken(refreshToken))

        const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
        storage.setItem(env.AUTH_TOKEN_STORAGE_KEY, result.accessToken)
        localStorage.setItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY, result.refreshToken)

        const tokenPayload = JSON.parse(atob(result.accessToken.split('.')[1]))
        const expiresAt = tokenPayload.exp * 1000

        set({
          user: result.user,
          tokens: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAuthenticated: true,
          tokenExpiresAt: expiresAt,
          error: null,
        })

        const broadcast = get()._broadcast
        if (broadcast) {
          broadcast.tokenRefreshed(result.accessToken, result.refreshToken)
        }

        console.log('[AuthStore] Refresh de token bem-sucedido')

        return result
      } catch (error) {
        console.error('[AuthStore] Falha no refresh de token:', error)

        const storage = env.AUTH_USE_SESSION_STORAGE ? sessionStorage : localStorage
        storage.removeItem(env.AUTH_TOKEN_STORAGE_KEY)
        localStorage.removeItem(env.AUTH_REFRESH_TOKEN_STORAGE_KEY)

        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: 'Sessão expirada. Por favor, faça login novamente.',
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

    setHasHydrated: (hasHydrated: boolean) => {
      set({ hasHydrated })
    },

    setBroadcast: (broadcast: AuthBroadcast) => {
      set({ _broadcast: broadcast })
    },
  })
  )
}

export const useAuthStore = createAuthStore()