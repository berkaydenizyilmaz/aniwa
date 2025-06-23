// Aniwa Projesi - Rate Limiting Constants
// Bu dosya rate limiting konfigürasyonlarını ve sabitlerini tanımlar

// Rate limit algoritması - Sadece sliding window kullanıyoruz
export const RATE_LIMIT_ALGORITHM = 'slidingWindow' as const

// Temel rate limit konfigürasyonları
export const RATE_LIMITS = {
  // Genel API limitleri - Tüm API endpoint'leri için
  GLOBAL: {
    requests: 100,
    window: '1 m' as const, // 1 dakika
    algorithm: RATE_LIMIT_ALGORITHM,
  },
  
  // Auth endpoint'leri için özel limitler (güvenlik kritik)
  AUTH: {
    LOGIN: {
      requests: 5,
      window: '1 m' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    SIGNUP: {
      requests: 3,
      window: '1 m' as const, 
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    PASSWORD_RESET: {
      requests: 2,
      window: '5 m' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    EMAIL_VERIFICATION: {
      requests: 3,
      window: '1 m' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    USERNAME_CHECK: {
      requests: 20,
      window: '1 m' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
  },
  
  // Kullanıcı seviyesine göre limitler (ileride kullanılacak)
  USER_TIER: {
    GUEST: {
      requests: 50,
      window: '1 h' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    REGISTERED: {
      requests: 200,
      window: '1 h' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    VERIFIED: {
      requests: 500,
      window: '1 h' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
    PREMIUM: {
      requests: 1000,
      window: '1 h' as const,
      algorithm: RATE_LIMIT_ALGORITHM,
    },
  },
} as const

// Environment'a göre rate limit çarpanları
export const RATE_LIMIT_MULTIPLIERS = {
  development: 10,  // Geliştirmede 10x daha gevşek
  production: 1,    // Production'da tam limit
} as const

// Rate limit bypass için özel IP'ler (ileride kullanılacak)
export const RATE_LIMIT_BYPASS_IPS = [
  '127.0.0.1',
  '::1',
] as const 