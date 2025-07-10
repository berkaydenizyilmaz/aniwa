// Auth Tipleri
// Bu dosya kimlik doğrulama ile ilgili tüm tip tanımlarını içerir

import type { User, UserProfileSettings, UserRole } from '@prisma/client'
import type { Session } from 'next-auth'
import type { SignInResponse } from 'next-auth/react'
import type { ApiResponse } from './api'

// Kullanıcı + ayarları birlikte
export type UserWithSettings = User & {
  userSettings: UserProfileSettings | null
}

// Yeni kullanıcı oluşturma parametreleri
export type CreateUserParams = {
  email: string
  password: string
  username: string
}

// ---- Hook dönüş tipleri ----

// useAuth hook'u için dönüş tipi
export interface UseAuthReturn {
  user: Session['user'] | null
  isLoading: boolean
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  requireRole: (role: UserRole) => boolean
  requireAnyRole: (roles: UserRole[]) => boolean
}

// ---- API Response tipleri ----

// Giriş işlemi sonucu
export interface LoginResult extends ApiResponse {
  user?: Session['user']
  signInResponse?: SignInResponse
}

// Çıkış işlemi sonucu
export interface LogoutResult extends ApiResponse {
  redirectUrl?: string
}