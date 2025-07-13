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

// =============================================================================
// RATE LIMIT TIPLERI
// =============================================================================

export const AUTH_RATE_LIMIT_TYPES = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  PASSWORD_RESET: 'PASSWORD_RESET',
  USERNAME_CHECK: 'USERNAME_CHECK',
} as const


export const RATE_LIMIT_MULTIPLIERS = {
  development: 10, // Development'ta daha gevşek
  production: 1,   // Production'da normal
} as const

// Auth rate limit konfigürasyonları
export const AUTH_RATE_LIMIT_CONFIG = {
  LOGIN: {
    requests: 5,
    window: '1m',
    message: 'Çok fazla giriş denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.',
  },
  SIGNUP: {
    requests: 3,
    window: '1h',
    message: 'Çok fazla kayıt denemesi yaptınız. Lütfen biraz bekleyip tekrar deneyin.',
  },
  PASSWORD_RESET: {
    requests: 3,
    window: '1h',
    message: 'Şifre sıfırlama talebinizi çok sık gönderiyorsunuz. Lütfen biraz bekleyip tekrar deneyin.',
  },
  USERNAME_CHECK: {
    requests: 10,
    window: '1m',
    message: 'Çok fazla kullanıcı adı kontrolü yaptınız. Lütfen biraz bekleyip tekrar deneyin.',
  },
} as const

// Global rate limit konfigürasyonları
export const GLOBAL_RATE_LIMIT_CONFIG = {
  API_GENERAL: {
    requests: 100,
    window: '1m',
    message: 'Çok fazla API isteği gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.',
  },
} as const