import { AccessToken, RefreshToken } from '../../domain/value-objects/AuthTokens'

export interface TokenStorage {
  storeAccessToken(token: AccessToken): void
  storeRefreshToken(token: RefreshToken): void
  getAccessToken(): AccessToken | null
  getRefreshToken(): RefreshToken | null
  removeAccessToken(): void
  removeRefreshToken(): void
  clearAll(): void
}

export class LocalStorageTokenStorage implements TokenStorage {
  private readonly accessTokenKey: string
  private readonly refreshTokenKey: string

  constructor(accessTokenKey: string, refreshTokenKey: string) {
    this.accessTokenKey = accessTokenKey
    this.refreshTokenKey = refreshTokenKey
  }

  storeAccessToken(token: AccessToken): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.accessTokenKey, token.getValue())
  }

  storeRefreshToken(token: RefreshToken): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.refreshTokenKey, token.getValue())
  }

  getAccessToken(): AccessToken | null {
    if (typeof window === 'undefined') return null

    const tokenValue = localStorage.getItem(this.accessTokenKey)
    if (!tokenValue) return null

    try {
      return new AccessToken(tokenValue)
    } catch {
      this.removeAccessToken()
      return null
    }
  }

  getRefreshToken(): RefreshToken | null {
    if (typeof window === 'undefined') return null

    const tokenValue = localStorage.getItem(this.refreshTokenKey)
    if (!tokenValue) return null

    try {
      return new RefreshToken(tokenValue)
    } catch {
      this.removeRefreshToken()
      return null
    }
  }

  removeAccessToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.accessTokenKey)
  }

  removeRefreshToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.refreshTokenKey)
  }

  clearAll(): void {
    this.removeAccessToken()
    this.removeRefreshToken()
  }
}