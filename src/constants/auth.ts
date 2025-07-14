// =============================================================================
// AUTH SABITLERI
// =============================================================================

export const AUTH = {
  // Session yönetimi
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 gün (saniye)
  JWT_MAX_AGE: 30 * 24 * 60 * 60, // 30 gün (saniye)

  // Şifre güvenliği
  BCRYPT_SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Username kuralları
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
  USERNAME_CHANGE_LIMIT_DAYS: 30, // Ayda 1 kez değiştirebilir

  // Email kuralları
  MAX_EMAIL_LENGTH: 254,

  // Token süreleri
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,

  // OAuth sağlayıcıları
  OAUTH_PROVIDERS: {
    GOOGLE: 'google',
  } as const,

  // Verification token türleri
  VERIFICATION_TOKEN_TYPES: {
    PASSWORD_RESET: 'PASSWORD_RESET',
  } as const,
} as const