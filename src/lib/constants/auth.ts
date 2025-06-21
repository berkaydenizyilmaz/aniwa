// Aniwa Projesi - Auth Constants
// Bu dosya kimlik doğrulama ile ilgili tüm sabitleri içerir

// Validasyon kuralları
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

// Uzunluk limitleri
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128
export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20
export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 50
export const BIO_MAX_LENGTH = 500

// Şifreleme ayarları
export const BCRYPT_SALT_ROUNDS = 12

// Session ve JWT ayarları
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye cinsinden)
export const JWT_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye cinsinden)

// Auth sayfaları
export const AUTH_PAGES = {
  SIGN_IN: '/auth/signin',
  ERROR: '/auth/error',
  VERIFY_REQUEST: '/auth/verify-request',
  SETUP_USERNAME: '/auth/setup-username',
} as const

// Tema tercihleri
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const
export const DEFAULT_THEME = 'system' as const

// Dil tercihleri
export const LANGUAGE_PREFERENCES = ['tr'] as const
export const DEFAULT_LANGUAGE = 'tr' as const

// OAuth Provider'lar
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
} as const

// Kullanıcı rolleri (Prisma'dan gelen enum'a ek)
export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR', 
  ADMIN: 'ADMIN',
} as const

// Tip tanımlamaları
export type ThemePreference = typeof THEME_PREFERENCES[number]
export type LanguagePreference = typeof LANGUAGE_PREFERENCES[number]
export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS]
export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES] 