// Streaming sabitleri (StreamingPlatform, StreamingLink)

export const STREAMING = {
  // Platform kuralları
  PLATFORM: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    BASE_URL: {
      MAX_LENGTH: 255,
    },
  },
  
  // Link kuralları
  LINK: {
    URL: {
      MAX_LENGTH: 500,
    },
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
} as const; 