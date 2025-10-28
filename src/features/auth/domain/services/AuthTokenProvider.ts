import type { AccessToken } from '../value-objects/AuthTokens'

/**
 * Classe abstrata para fornecer tokens de autenticação ao HttpClient.
 *
 * Classes abstratas são preferíveis a interfaces quando se trabalha com
 * injeção de dependências em runtime, já que interfaces TypeScript não
 * geram código JavaScript após transpilação.
 */
export abstract class AuthTokenProvider {
  abstract getCurrentAccessToken(): AccessToken | null
  abstract hasValidAccessToken(): boolean
}
