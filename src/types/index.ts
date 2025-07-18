import { PrismaClient, Prisma } from '@prisma/client'

// Genel API response tipleri

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

// Business service response tipleri

export type ServiceResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
}

// Utility tipleri

// Prisma transaction tipi
export type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient

// Domain bazlı type dosyalarını export et
export * from './auth'
export * from './user'
export * from './email'
export * from './rate-limit'
export * from './logging'