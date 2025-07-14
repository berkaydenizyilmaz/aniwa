import { UserRole } from "@prisma/client"
import type { ID } from './index'
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: ID
      username: string
      email: string
      roles: UserRole[]
    } & DefaultSession["user"]
  }

  interface User {
    id: ID
    username: string
    email: string
    roles: UserRole[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: ID
    username: string
    roles: UserRole[]
  }
} 