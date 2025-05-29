// 認証サービスの統一インターフェース
export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string
}

export interface IAuthService {
  getCurrentUser(): AuthUser | null
  signIn(): Promise<void>
  signOut(): Promise<void>
  isAuthenticated(): boolean
}

// NextAuth実装
class NextAuthService implements IAuthService {
  getCurrentUser(): AuthUser | null {
    // TODO: NextAuthの実装
    throw new Error('NextAuth service not implemented yet')
  }

  async signIn(): Promise<void> {
    // TODO: NextAuthの実装
    throw new Error('NextAuth service not implemented yet')
  }

  async signOut(): Promise<void> {
    // TODO: NextAuthの実装
    throw new Error('NextAuth service not implemented yet')
  }

  isAuthenticated(): boolean {
    // TODO: NextAuthの実装
    throw new Error('NextAuth service not implemented yet')
  }
}

// モック認証実装
class MockAuthService implements IAuthService {
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem('zentype_mock_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  async signIn(): Promise<void> {
    if (typeof window === 'undefined') return
    
    const { mockUser } = await import('./mockData')
    localStorage.setItem('zentype_mock_user', JSON.stringify(mockUser))
  }

  async signOut(): Promise<void> {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('zentype_mock_user')
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

// ファクトリー関数
export function createAuthService(): IAuthService {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  
  if (isDemoMode) {
    return new MockAuthService()
  } else {
    return new NextAuthService()
  }
}

// シングルトンインスタンス
export const authService = createAuthService()
