// User sabitleri

import { UserRole, ProfileVisibility, Theme, TitleLanguage, ScoreFormat } from '@prisma/client';

export const USER = {
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Prisma enum'ları
  ROLES: UserRole,
  PROFILE_VISIBILITY: ProfileVisibility,
  THEME: Theme,
  TITLE_LANGUAGE: TitleLanguage,
  SCORE_FORMAT: ScoreFormat,
} as const; 