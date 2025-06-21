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
      role: UserRole
      provider?: string
    } & DefaultSession['user']
  }

  /**
   * User interface'ini genişlet
   */
  interface User extends DefaultUser {
    username?: string | null
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT token interface'ini genişlet
   */
  interface JWT {
    id: string
    username?: string | null
    role: UserRole
    provider?: string
  }
} 