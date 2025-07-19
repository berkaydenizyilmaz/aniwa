// Auth sabitleri

export const AUTH = {
  // Şifre hashleme
  BCRYPT_SALT_ROUNDS: 12,
  
  // Validation kuralları
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_REGEX: /^[a-zA-Z0-9]+$/,
  
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