// Rate limit sabitleri

export const RATE_LIMIT = {
  // API endpoint'leri için genel limit
  API: {
    GENERAL: {
      WINDOW_MS: 60 * 1000, // 1 dakika
      MAX_REQUESTS: 60, // Dakikada maksimum 60 istek
    },
  },
} as const; 