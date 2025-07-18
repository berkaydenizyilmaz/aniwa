import { UserRole } from "@prisma/client"

// Auth parameter tipleri

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

// Şifre sıfırlama token oluşturma parametreleri
export interface CreatePasswordResetTokenParams {
  email: string
  baseUrl: string
}

// Şifre sıfırlama parametreleri
export interface PasswordResetParams {
  token: string
  newPassword: string
}

// Şifre güncelleme parametreleri
export interface PasswordUpdateParams {
  userId: string
  newPassword: string
}

// Username kontrol parametreleri
export interface UsernameCheckParams {
  username: string
}

// Token doğrulama parametreleri
export interface TokenVerificationParams {
  token: string
}

// Session ve user tipleri

// NextAuth session user tipi
export interface SessionUser {
  id: string
  email: string
  username: string
  profilePicture?: string | null
  roles: UserRole[]
}

// Hook return tipleri

// useAuth hook return tipi
export interface UseAuthReturn {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  requireRole: (role: UserRole) => boolean
  requireAnyRole: (roles: UserRole[]) => boolean
}

// Auth result tipleri

// Login sonucu
export interface LoginResult {
  user?: SessionUser
  signInResponse?: unknown
}

// Logout sonucu
export interface LogoutResult {
  redirectUrl?: string
}

// Verification token tipleri

// Verification token tipi
export enum VerificationTokenType {
  PASSWORD_RESET = 'PASSWORD_RESET',
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

// Prisma enum'larını re-export et
export { UserRole } from "@prisma/client"