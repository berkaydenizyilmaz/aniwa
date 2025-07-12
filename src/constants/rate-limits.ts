// Aniwa Projesi - Rate Limiting Constants
// Bu dosya rate limiting sistemi ile ilgili sabitleri içerir

// =============================================================================
// RATE LIMITING SABITLERI
// =============================================================================

export const RATE_LIMITS = {
  // Genel API rate limits
  API: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
  
  // Auth işlemleri
  AUTH: {
    LOGIN_ATTEMPTS_PER_MINUTE: 5,
    SIGNUP_ATTEMPTS_PER_HOUR: 3,
    PASSWORD_RESET_ATTEMPTS_PER_HOUR: 3,
    USERNAME_CHECK_ATTEMPTS_PER_MINUTE: 10,
  },
  
  // Kullanıcı bazlı
  USER: {
    COMMENTS_PER_MINUTE: 5,
    LIKES_PER_MINUTE: 30,
    FOLLOWS_PER_MINUTE: 10,
    LIST_UPDATES_PER_MINUTE: 20,
  },
  
  // Tier bazlı limitler
  TIERS: {
    USER: {
      REQUESTS_PER_MINUTE: 30,
      REQUESTS_PER_HOUR: 500,
    },
    MODERATOR: {
      REQUESTS_PER_MINUTE: 100,
      REQUESTS_PER_HOUR: 2000,
    },
    ADMIN: {
      REQUESTS_PER_MINUTE: 200,
      REQUESTS_PER_HOUR: 5000,
    },
  },
} as const