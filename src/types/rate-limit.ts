// Aniwa Projesi - Rate Limiting Types
// Bu dosya rate limiting için TypeScript tip tanımlamalarını içerir

import { RATE_LIMIT_ALGORITHM } from '@/constants/rate-limits'

// Rate limit konfigürasyon tipi
export interface RateLimitConfig {
  requests: number
  window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`
  algorithm: typeof RATE_LIMIT_ALGORITHM
}

// Rate limit key oluşturma için tip
export interface RateLimitKeyOptions {
  ip?: string
  userId?: string
  endpoint?: string
  customKey?: string
}

// Rate limit hata tipi
export interface RateLimitError {
  message: string
  retryAfter?: number
  limit: number
  remaining: number
  reset: number
}

// Rate limit durumu
export interface RateLimitStatus {
  isRateLimited: boolean
  result: {
    success: boolean
    limit: number
    remaining: number
    reset: number
    pending?: Promise<unknown>
  }
  error?: RateLimitError
} 