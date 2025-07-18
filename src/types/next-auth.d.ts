import { UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

// NextAuth tip genişletmeleri

// NextAuth session tipini genişlet
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      profilePicture?: string | null
      roles: UserRole[]
    } & DefaultSession["user"]
  }

  // NextAuth user tipini genişlet
  interface User {
    id: string
    username: string
    email: string
    profilePicture?: string | null
    roles: UserRole[]
  }
}

// NextAuth JWT tipini genişlet
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    roles: UserRole[]
  }
}