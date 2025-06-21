// Aniwa Projesi - Auth Tipleri
// Bu dosya kimlik doğrulama ile ilgili tüm tip tanımlarını içerir

import type { UserRole } from '@/generated/prisma'

// Kullanıcı oluşturma parametreleri
export interface CreateUserParams {
  email: string
  password: string
  username?: string
  name?: string
}

// Kullanıcı profil güncelleme parametreleri
export interface UpdateProfileParams {
  username?: string
  name?: string
  bio?: string
  profilePicture?: string
  profileBanner?: string
}

// Kullanıcı ayarları güncelleme parametreleri
export interface UpdateUserSettingsParams {
  themePreference?: string
  languagePreference?: string
  notificationPreferences?: Record<string, unknown>
  privacySettings?: Record<string, unknown>
}

// Ayarlarıyla birlikte kullanıcı tipi
export interface UserWithSettings {
  id: string
  email: string
  username: string | null
  name: string | null
  role: UserRole
  profilePicture: string | null
  profileBanner: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
  userSettings?: {
    id: string
    themePreference: string
    languagePreference: string
    notificationPreferences: Record<string, unknown> | null
    privacySettings: Record<string, unknown> | null
    createdAt: Date
    updatedAt: Date
  } | null
}

// API yanıt tipleri
export interface AuthApiResponse<T = unknown> {
  success: boolean
  message?: string
  error?: string
  data?: T
}

// Login response tipi
export interface LoginResponse {
  id: string
  email: string
  username: string | null
  name: string | null
  role: UserRole
}

// Session user tipi (NextAuth ile uyumlu)
export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  username?: string | null
  role: UserRole
  provider?: string
} 