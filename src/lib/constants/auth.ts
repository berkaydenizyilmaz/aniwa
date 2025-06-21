// Aniwa Projesi - Auth Constants
// Bu dosya kimlik doğrulama ile ilgili tüm sabitleri içerir

// Validasyon kuralları (auth spesifik)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

// Uzunluk limitleri
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128
export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20

export const BIO_MAX_LENGTH = 500
export const EMAIL_MIN_LENGTH = 3
export const TOKEN_MIN_LENGTH = 32

// Şifreleme ayarları
export const BCRYPT_SALT_ROUNDS = 12

// Session ve JWT ayarları
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye cinsinden)
export const JWT_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye cinsinden)

// Token süresi (15 dakika)
export const TOKEN_EXPIRY_MINUTES = 1



// OAuth Provider'lar
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
} as const

// Kullanıcı rolleri (Prisma'dan gelen enum'a uygun)
export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
} as const

// Tip tanımlamaları
export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS]
export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES] 