// Bu dosya NextAuth'un varsayılan tiplerini proje ihtiyaçlarına göre genişletir

import { UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      roles: UserRole[]
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    username: string
    email: string
    roles: UserRole[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    roles: UserRole[]
  }
} 