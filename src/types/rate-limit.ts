// Aniwa Projesi - Rate Limiting Types
// Bu dosya rate limiting için TypeScript tip tanımlamalarını içerir

import { RATE_LIMIT_ALGORITHM } from '@/lib/constants/rate-limits'

// Rate limit algoritma tipi
export type RateLimitAlgorithm = typeof RATE_LIMIT_ALGORITHM

// Rate limit konfigürasyon tipi
export interface RateLimitConfig {
  requests: number
  window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`
  algorithm: RateLimitAlgorithm
}

// Rate limit sonuç tipi
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  pending?: Promise<unknown>
}

// Rate limit hata tipi
export interface RateLimitError {
  message: string
  retryAfter?: number
  limit: number
  remaining: number
  reset: number
}

// Rate limit key oluşturma için tip
export interface RateLimitKeyOptions {
  ip?: string
  userId?: string
  endpoint?: string
  customKey?: string
}

// Rate limit middleware seçenekleri
export interface RateLimitMiddlewareOptions {
  config: RateLimitConfig
  keyGenerator?: (options: RateLimitKeyOptions) => string
  skipIf?: (options: RateLimitKeyOptions) => boolean
  onLimitReached?: (error: RateLimitError) => void
  message?: string
}

// Rate limit durumu
export interface RateLimitStatus {
  isRateLimited: boolean
  result: RateLimitResult
  error?: RateLimitError
} 