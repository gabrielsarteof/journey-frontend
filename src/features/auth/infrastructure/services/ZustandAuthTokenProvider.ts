import { AuthTokenProvider } from '../../domain/services/AuthTokenProvider'
import { AccessToken } from '../../domain/value-objects/AuthTokens'
import type { AuthStore } from '../../application/stores/authStore'

/**
 * Implementação concreta que busca tokens diretamente do Zustand store.
 *
 * O authStore centraliza o estado de autenticação, evitando inconsistências
 * entre localStorage e memória. A verificação de hasHydrated previne leitura
 * prematura antes do persist middleware completar a restauração do estado.
 */
export class ZustandAuthTokenProvider extends AuthTokenProvider {
  constructor(private readonly authStore: AuthStore) {
    super()
  }

  getCurrentAccessToken(): AccessToken | null {
    const state = this.authStore.getState()

    if (!state.hasHydrated) {
      return null
    }

    const tokenValue = state.tokens?.accessToken

    if (!tokenValue) {
      return null
    }

    try {
      return new AccessToken(tokenValue)
    } catch {
      // Token inválido (falha na validação do Value Object)
      return null
    }
  }

  hasValidAccessToken(): boolean {
    return this.getCurrentAccessToken() !== null
  }
}
