// Aniwa Projesi - Core Types
// Bu dosya tüm projenin temel tip tanımlarını içerir

// =============================================================================
// API RESPONSE TIPLERI
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  errors?: string[]
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

// =============================================================================
// UTILITY TIPLERI
// =============================================================================

// Prisma'dan gelen ID'leri string olarak kullanmak için
export type ID = string

// Tarih tipleri
export type DateString = string
export type ISODateString = string

// Dosya upload tipleri
export interface FileUpload {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
  size?: number
}

// Sayfalama parametreleri
export interface PaginationParams {
  page?: number
  limit?: number
}

// Arama parametreleri
export interface SearchParams {
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// FORM TIPLERI
// =============================================================================

// Form field durumları
export interface FieldError {
  message: string
  type: string
}

export interface FormState {
  isSubmitting: boolean
  errors: Record<string, FieldError>
  isDirty: boolean
  isValid: boolean
}

// =============================================================================
// COMPONENT TIPLERI
// =============================================================================

// Temel component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// =============================================================================
// EXPORTS
// =============================================================================

// Domain bazlı type dosyalarını export et
export * from './auth'
export * from './anime'
export * from './community'
export * from './admin'
export * from './user'