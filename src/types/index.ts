import { PrismaClient, Prisma } from '@prisma/client'

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

// =============================================================================
// BUSINESS SERVICE RESPONSE TIPLERI
// =============================================================================

export type ServiceResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
}

// =============================================================================
// UTILITY TIPLERI
// =============================================================================

// Prisma'dan gelen ID'leri string olarak kullanmak için
export type ID = string

// Prisma transaction tipi
export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient

// Domain bazlı type dosyalarını export et
export * from './auth'
export * from './anime'
export * from './community'
export * from './admin'
export * from './user'
export * from './email'
export * from './rate-limit'
export * from './logging'