// Auth domain constants - Kimlik doğrulama ile ilgili tüm sabitler

import { SHARED_VALIDATION } from '../shared/validation';

export const AUTH_DOMAIN = {
  // Validation Rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 50,
      REGEX: /^[a-zA-Z0-9]+$/,
    },
    PASSWORD: {
      MIN_LENGTH: 6,
    },
  },
  
  // Business Rules
  BUSINESS: {
    BCRYPT_SALT_ROUNDS: 12,
    TOKEN_TYPES: {
      PASSWORD_RESET: 'password_reset',
      EMAIL_VERIFICATION: 'email_verification',
    },
    TOKEN_EXPIRES: {
      PASSWORD_RESET: 60 * 60 * 1000, // 1 saat
      EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 saat
    },
    SESSION: {
      MAX_AGE: 30 * 24 * 60 * 60, // 30 gün
      REFETCH_INTERVAL: 5 * 60, // 5 dakika
      UPDATE_AGE: 24 * 60 * 60, // 24 saat
    },
    COOKIE: {
      NAME: 'aniwa-session',
      MAX_AGE: 30 * 24 * 60 * 60, // 30 gün
    },
  },

  // Role Hierarchy
  ROLES: {
    HIERARCHY: {
      USER: 1,
      MODERATOR: 2,
      EDITOR: 3,
      ADMIN: 4,
    } as const,
  },
} as const;
