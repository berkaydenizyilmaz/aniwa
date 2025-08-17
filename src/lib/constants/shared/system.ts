// Shared system constants - Sistem genelinde kullanılan sabitler

export const SHARED_SYSTEM = {
  // Error codes
  ERROR_CODES: {
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    CONFLICT: 'CONFLICT',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    USER_BANNED: 'USER_BANNED',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
  },
  
  // Rate limiting
  RATE_LIMIT: {
    API: {
      GENERAL: {
        WINDOW_MS: 60 * 1000, // 1 dakika
        MAX_REQUESTS: 60, // Dakikada maksimum 60 istek
      },
    },
  },
  
  // Log levels
  LOG: {
    LEVEL_LABELS: {
      INFO: 'Bilgi',
      WARN: 'Uyarı',
      ERROR: 'Hata',
      DEBUG: 'Hata Ayıklama',
    },
    LEVEL_COLORS: {
      INFO: 'text-blue-600',
      WARN: 'text-yellow-600',
      ERROR: 'text-red-600',
      DEBUG: 'text-gray-600',
    },
  },
} as const;
