// Shared validation constants - Tüm domain'lerde ortak kullanılan validasyon kuralları

export const SHARED_VALIDATION = {
  // Name kuralları (Genre, Tag, Studio, User için ortak)
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  
  // Description kuralları
  DESCRIPTION: {
    MAX_LENGTH: 200, // Tag için
  },
  
  // URL kuralları
  URL: {
    MAX_LENGTH: 255,
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
} as const;
