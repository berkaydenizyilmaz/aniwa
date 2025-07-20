// Auth sabitleri

export const AUTH = {
  // Şifre hashleme
  BCRYPT_SALT_ROUNDS: 12,
  
  // Username kuralları
  USERNAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z0-9]+$/,
  },
  
  // Şifre kuralları
  PASSWORD: {
    MIN_LENGTH: 6,
  },
  
  // Token tipleri
  TOKEN_TYPES: {
    PASSWORD_RESET: 'password_reset',
    EMAIL_VERIFICATION: 'email_verification',
  },
  
  // Token geçerlilik süreleri (milisaniye)
  TOKEN_EXPIRES: {
    PASSWORD_RESET: 60 * 60 * 1000, // 1 saat
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 saat
  },
} as const; 