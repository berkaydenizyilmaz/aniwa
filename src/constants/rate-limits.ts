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