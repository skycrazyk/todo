class TokenManager {
  private _token: string | null = null

  get token(): string | null {
    return this._token
  }

  set token(value: string | null) {
    this._token = value
    console.debug('Token updated:', value)
  }

  clear(): void {
    this._token = null
  }
}

export const tokenManager = new TokenManager()
