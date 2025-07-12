// Aniwa Projesi - Auth Domain Types
// Bu dosya kimlik doğrulama ile ilgili tüm tip tanımlarını içerir

import { UserRole } from "@prisma/client"
import type { ID } from './index'

// =============================================================================
// AUTH PARAMETRELERI
// =============================================================================

// Giriş parametreleri
export interface LoginParams {
  username: string
  password: string
}

// Kayıt parametreleri
export interface SignupParams {
  email: string
  password: string
  username: string
}

// Şifre sıfırlama parametreleri
export interface PasswordResetParams {
  email: string
}

// Şifre güncelleme parametreleri
export interface PasswordUpdateParams {
  token: string
  newPassword: string
}

// Username kontrol parametreleri
export interface UsernameCheckParams {
  username: string
}

// =============================================================================
// SESSION VE USER TIPLERI
// =============================================================================

// NextAuth session user tipi
export interface SessionUser {
  id: ID
  email: string
  username: string
  image?: string | null
  roles: UserRole[]
}

// =============================================================================
// HOOK DÖNÜŞ TİPLERİ
// =============================================================================

// useAuth hook'u için dönüş tipi
export interface UseAuthReturn {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  requireRole: (role: UserRole) => boolean
  requireAnyRole: (roles: UserRole[]) => boolean
}

// =============================================================================
// API RESPONSE TİPLERİ
// =============================================================================

// Giriş işlemi sonucu
export interface LoginResult {
  user?: SessionUser
  signInResponse?: unknown
}

// Çıkış işlemi sonucu
export interface LogoutResult {
  redirectUrl?: string
}

// =============================================================================
// VERIFICATION TOKEN TİPLERİ
// =============================================================================

// Verification token türleri
export enum VerificationTokenType {
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION'
}

// Verification token oluşturma parametreleri
export interface CreateVerificationTokenParams {
  email: string
  type: VerificationTokenType
  expiryHours: number
}

// Token doğrulama parametreleri
export interface VerifyTokenParams {
  token: string
  type: VerificationTokenType
}

// =============================================================================
// EXPORTS
// =============================================================================

// Prisma enum'larını re-export et
export { UserRole } from "@prisma/client"