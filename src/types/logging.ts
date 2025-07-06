// Aniwa Projesi - Logging Tipi Tanımlamaları
// Bu dosya, loglama sistemiyle ilgili tüm TypeScript tiplerini içerir.

import { Prisma, LogLevel, UserRole } from '@prisma/client'
import type { LOG_EVENTS, SENSITIVE_FIELDS, PERFORMANCE_THRESHOLDS } from '@/constants/logging'

// Log seviyesi tipi (Prisma'dan gelir)
export type LogLevelType = LogLevel

// Hassas alanların tipi
export type SensitiveField = typeof SENSITIVE_FIELDS[number]

// Log olay türlerinin tipi
export type LogEventType = typeof LOG_EVENTS[keyof typeof LOG_EVENTS]

// Performans eşiklerinin tipi
export type PerformanceThreshold = typeof PERFORMANCE_THRESHOLDS[keyof typeof PERFORMANCE_THRESHOLDS]

// Log metadata tipi
export interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | LogMetadata | LogMetadata[]
}

// Request metadata tipi
export interface RequestMetadata extends LogMetadata {
  method: string
  url: string
  statusCode: number
  duration: number
  ip?: string
  userAgent?: string
}

// Performance metadata tipi
export interface PerformanceMetadata extends LogMetadata {
  operation: string
  duration: number
}

// Auth metadata tipi
export interface AuthMetadata extends LogMetadata {
  action: string
  success: boolean
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

// Date range tipi
export type DateRange = {
  startDate?: Date
  endDate?: Date
}

// Admin log view tipi
export type AdminLogView = Pick<LogWithUser, 'id' | 'level' | 'event' | 'message' | 'timestamp'> & {
  user?: {
    username: string | null
    roles: UserRole[]
  } | null
}

// Log export tipi
export type LogExport = Omit<LogWithUser, 'user'> & {
  username?: string | null
  userRoles?: UserRole[] | null
} 