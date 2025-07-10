// Aniwa Projesi - Logging Tipi Tanımlamaları
// Bu dosya, loglama sistemiyle ilgili tüm TypeScript tiplerini içerir.

import { Prisma, LogLevel, UserRole } from '@prisma/client'

// Log metadata tipi
export interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | LogMetadata | LogMetadata[]
}

// Performance metadata tipi
export interface PerformanceMetadata extends LogMetadata {
  operation: string
  duration: number
}

// Create log params tipi
export type CreateLogParams = Pick<Prisma.LogCreateInput, 'level' | 'event' | 'message' | 'metadata'> & {
  userId?: string
}

// Log filters tipi
export type LogFilters = Partial<{
  level: LogLevel
  event: string
  userId: string
  userRoles: UserRole[]
  startDate: Date
  endDate: Date
  limit: number
  offset: number
}>

// Log user select tipi
export const logUserSelect = {
  id: true,
  username: true,
  email: true,
  roles: true
} as const

export type LogUserSelect = typeof logUserSelect

// Log with user tipi
export type LogWithUser = Prisma.LogGetPayload<{
  include: {
    user: {
      select: typeof logUserSelect
    }
  }
}>

// Log list response tipi
export interface LogListResponse {
  logs: LogWithUser[]
  pagination: PaginationInfo
}

// Pagination info tipi
export type PaginationInfo = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
} 