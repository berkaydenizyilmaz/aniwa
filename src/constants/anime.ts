// =============================================================================
// ANIME SABITLERI
// =============================================================================

export const ANIME = {
  // Sayfalama
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  
  // Puanlama
  SCORE: {
    MIN: 1,
    MAX: 10,
  },
  
  // Metin limitleri
  TEXT_LIMITS: {
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 5000,
    COMMENT_MAX_LENGTH: 1000,
    LIST_NAME_MAX_LENGTH: 100,
    LIST_DESCRIPTION_MAX_LENGTH: 500,
  },
} as const 