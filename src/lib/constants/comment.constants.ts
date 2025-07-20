// Comment sabitleri

export const COMMENT = {
  // Content kuralları
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
} as const; 