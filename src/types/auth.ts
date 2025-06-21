// Aniwa Projesi - Auth Tipleri
// Bu dosya kimlik doğrulama ile ilgili tüm tip tanımlarını içerir

import type { User, UserRole } from '@prisma/client'
import type { Session } from 'next-auth'
import type { SignInResponse } from 'next-auth/react'
import { Prisma } from '@prisma/client'

// Kullanıcı oluşturma parametreleri
export interface CreateUserParams {
  email: string
  password: string
  username: string
}

// Kullanıcı profil güncelleme parametreleri - sadece güncellenebilir alanlar
export type UpdateProfileParams = Partial<Pick<User, 'username' | 'bio' | 'profilePicture' | 'profileBanner'>>

// Kullanıcı ayarları güncelleme parametreleri
export type UpdateUserSettingsParams = Partial<{
  themePreference: string
  languagePreference: string
  notificationPreferences: Prisma.JsonValue
  privacySettings: Prisma.JsonValue
}>

// Ayarlarıyla birlikte kullanıcı tipi - Prisma include tipini kullan
export type UserWithSettings = Prisma.UserGetPayload<{
  include: {
    userSettings: true
  }
}>

// API yanıt tipleri
export interface AuthApiResponse<T = unknown> {
  success: boolean
  message?: string
  error?: string
  data?: T
}

// Login response tipi - User'dan sadece gerekli alanları al
export type LoginResponse = Pick<User, 'id' | 'email' | 'username' | 'role'>

// Session user tipi (NextAuth ile uyumlu) - User'dan türet
export type SessionUser = Pick<User, 'id' | 'role'> & {
  email?: string | null
  name?: string | null
  image?: string | null
  username?: string | null
  provider?: string
}

// Kullanıcı listesi için sadece gerekli alanlar
export type UserListItem = Pick<User, 'id' | 'username' | 'email' | 'role' | 'createdAt'>

// Kullanıcı profil sayfası için gerekli alanlar
export type UserProfile = Omit<User, 'passwordHash' | 'emailVerified'> & {
  userSettings?: {
    themePreference: string
    languagePreference: string
  } | null
}

// Admin paneli için kullanıcı yönetimi
export type AdminUserView = Pick<User, 'id' | 'username' | 'email' | 'role' | 'createdAt' | 'updatedAt'>

// Kullanıcı arama sonuçları için minimal bilgi
export type UserSearchResult = Pick<User, 'id' | 'username' | 'profilePicture'>

// Güvenli kullanıcı tipi - hassas bilgiler hariç
export type SafeUser = Omit<User, 'passwordHash' | 'emailVerified'>

// ---- Hook dönüş tipleri ----
export interface AuthHookReturn {
  // Session bilgileri
  user: SessionUser | undefined
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  needsUsername: boolean
  
  // Auth fonksiyonları
  login: (username: string, password: string) => Promise<SignInResponse | undefined>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setupUsername: (username: string) => Promise<AuthApiResponse>
}

export interface RoleHookReturn {
  role: UserRole | undefined
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean | undefined
  isAdmin: () => boolean | undefined
  isModerator: () => boolean | undefined
  isEditor: () => boolean | undefined
}

export interface RequireAuthHookReturn {
  isAuthenticated: boolean
  isLoading: boolean
}

export interface RequireRoleHookReturn {
  hasRequiredRole: boolean | undefined
  isLoading: boolean
} 