// List sabitleri (CustomList, UserAnimeList)

export const LIST = {
  // Name kuralları
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  
  // Description kuralları
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
} as const; 