// AnimeList sabitleri (UserAnimeList, FavouriteAnime)

import { MediaListStatus } from '@prisma/client';

export const ANIME_LIST = {
  // Score kuralları
  SCORE: {
    MIN: 0,
    MAX: 10,
  },
  
  // Notes kuralları
  NOTES: {
    MAX_LENGTH: 1000,
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Prisma enum'ları
  STATUS: MediaListStatus,
} as const; 