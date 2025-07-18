// Rate limit tipleri

// Rate limit konfigürasyonu
export interface RateLimitConfig {
    requests: number
    window: string
    algorithm?: 'sliding-window' | 'fixed-window'
    message?: string
  }
  
  // Rate limit key seçenekleri
  export interface RateLimitKeyOptions {
    ip?: string
    userId?: string
    endpoint?: string
    customKey?: string
  }
  
  // Rate limit sonucu
  export interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
    pending?: Promise<unknown>
  }
  
  // Rate limit hatası
  export interface RateLimitError {
    message: string
    retryAfter: number
    limit: number
    remaining: number
    reset: number
  }
  
  // Rate limit durumu
  export interface RateLimitStatus {
    isRateLimited: boolean
    result: RateLimitResult
    error?: RateLimitError
  }