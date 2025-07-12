// Bu dosya kimlik doğrulama sistemi ile ilgili tüm sabitleri içerir

// Session yönetimi
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye)
export const JWT_MAX_AGE = 30 * 24 * 60 * 60 // 30 gün (saniye)

// Şifre güvenliği
export const BCRYPT_SALT_ROUNDS = 12
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128

// Username kuralları
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 20
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

// Email kuralları
export const MAX_EMAIL_LENGTH = 254

// Token süreleri
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1 // Şifre sıfırlama token süresi (1 saat)

// OAuth sağlayıcıları
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
} as const

// Verification token türleri
export const VERIFICATION_TOKEN_TYPES = {
  PASSWORD_RESET: 'PASSWORD_RESET',
} as const

// Kullanıcı rolleri
export const USER_ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR', 
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
} as const