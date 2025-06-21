// Aniwa Projesi - NextAuth Tip Genişletmeleri
// Bu dosya NextAuth'un varsayılan tiplerini proje ihtiyaçlarına göre genişletir

import { DefaultSession, DefaultUser } from 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  /**
   * Session interface'ini genişlet
   */
  interface Session {
    user: {
      id: string
      username?: string | null
      roles: UserRole[]
      provider?: string
      oauthToken?: string
    } & DefaultSession['user']
  }

  /**
   * User interface'ini genişlet
   */
  interface User extends DefaultUser {
    username?: string | null
    roles: UserRole[]
    oauthToken?: string
  }

  /**
   * Profile interface'ini genişlet (Google OAuth için)
   */
  interface Profile {
    picture?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT token interface'ini genişlet
   */
  interface JWT {
    id: string
    username?: string | null
    roles: UserRole[]
    provider?: string
    oauthToken?: string
  }
} 