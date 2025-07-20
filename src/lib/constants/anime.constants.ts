// Anime sabitleri

import { AnimeType, AnimeStatus, Season, Source } from '@prisma/client';

export const ANIME = {
  // Title kuralları
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  
  // Score kuralları
  SCORE: {
    MIN: 0,
    MAX_10: 10,
    MAX_100: 100,
  },
  
  // Year kuralları
  YEAR: {
    MIN: 1900,
    MAX: 2100,
  },
  
  // Duration kuralları
  DURATION: {
    MIN: 1, // dakika
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Prisma enum'ları
  TYPE: AnimeType,
  STATUS: AnimeStatus,
  SEASON: Season,
  SOURCE: Source,
} as const; 