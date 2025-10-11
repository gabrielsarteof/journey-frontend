export class AccessToken {
  private readonly value: string

  constructor(token: string) {
    if (!token || token.trim().length === 0) {
      throw new Error('Access token cannot be empty')
    }

    if (!this.isValidJWT(token)) {
      throw new Error('Invalid access token format')
    }

    this.value = token.trim()
  }

  getValue(): string {
    return this.value
  }

  isExpired(): boolean {
    try {
      const payload = JSON.parse(atob(this.value.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      return payload.exp < now
    } catch {
      return true
    }
  }

  equals(other: AccessToken): boolean {
    return this.value === other.value
  }

  private isValidJWT(token: string): boolean {
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }
}

export class RefreshToken {
  private readonly value: string

  constructor(token: string) {
    if (!token || token.trim().length === 0) {
      throw new Error('Refresh token cannot be empty')
    }

    this.value = token.trim()
  }

  getValue(): string {
    return this.value
  }

  equals(other: RefreshToken): boolean {
    return this.value === other.value
  }
}

export class AuthTokenPair {
  private readonly accessToken: AccessToken
  private readonly refreshToken: RefreshToken

  constructor(accessToken: AccessToken, refreshToken: RefreshToken) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  getAccessToken(): AccessToken {
    return this.accessToken
  }

  getRefreshToken(): RefreshToken {
    return this.refreshToken
  }

  isAccessTokenExpired(): boolean {
    return this.accessToken.isExpired()
  }

  equals(other: AuthTokenPair): boolean {
    return this.accessToken.equals(other.accessToken) &&
           this.refreshToken.equals(other.refreshToken)
  }
}