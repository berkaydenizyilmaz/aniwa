// Bu dosya tüm projenin temel tip tanımlarını içerir

// =============================================================================
// API RESPONSE TIPLERI
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  errors?: string[]
  message?: string
  details?: unknown
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Prisma'dan gelen ID'leri string olarak kullanmak için
export type ID = string

// Domain bazlı type dosyalarını export et
export * from './auth'
export * from './anime'
export * from './community'
export * from './admin'
export * from './user'
export * from './rate-limit'