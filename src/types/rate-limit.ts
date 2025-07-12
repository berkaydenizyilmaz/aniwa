// Bu dosya rate limiting için TypeScript tip tanımlamalarını içerir

// Rate limit konfigürasyon tipi
export interface RateLimitConfig {
  requests: number
  window: string
  message: string
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