// Bu dosya rate limiting sistemi ile ilgili tüm sabitleri içerir

// Rate limit türleri
export const AUTH_RATE_LIMIT_TYPES = {
  SIGNUP: 'SIGNUP',
  LOGIN: 'LOGIN',
  PASSWORD_RESET: 'PASSWORD_RESET',
  USERNAME_CHECK: 'USERNAME_CHECK',
} as const

// Rate limit çarpanları (farklı endpoint'ler için)
export const RATE_LIMIT_MULTIPLIERS = {
  STRICT: 0.5,    // Daha sıkı limitler için
  NORMAL: 1,      // Standart limitler
  RELAXED: 2,     // Daha gevşek limitler için
} as const

// Auth işlemleri için rate limit konfigürasyonları
export const AUTH_RATE_LIMIT_CONFIG = {
  SIGNUP: {
    requests: 3,
    window: '15m',
    message: 'Çok fazla kayıt denemesi. 15 dakika sonra tekrar deneyin.',
  },
  LOGIN: {
    requests: 5,
    window: '15m',
    message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.',
  },
  PASSWORD_RESET: {
    requests: 3,
    window: '15m',
    message: 'Çok fazla şifre sıfırlama talebi. 15 dakika sonra tekrar deneyin.',
  },
  USERNAME_CHECK: {
    requests: 10,
    window: '1m',
    message: 'Çok fazla kullanıcı adı kontrolü. 1 dakika sonra tekrar deneyin.',
  },
} as const

// Genel rate limit ayarları
export const GLOBAL_RATE_LIMIT_CONFIG = {
  API_GENERAL: {
    requests: 100,
    window: '15m',
    message: 'Çok fazla API isteği. 15 dakika sonra tekrar deneyin.',
  },
} as const 