import { Prisma, LogLevel, UserRole } from '@prisma/client'

/**
 * Logging ile ilgili tip tanımları
 */

// Log metadata için tip
export interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | LogMetadata | LogMetadata[]
}

// HTTP request metadata için tip
export interface RequestMetadata extends LogMetadata {
  method: string
  url: string
  statusCode: number
  duration: number
  ip?: string
  userAgent?: string
}

// Performance metadata için tip
export interface PerformanceMetadata extends LogMetadata {
  operation: string
  duration: number
}

// Auth metadata için tip
export interface AuthMetadata extends LogMetadata {
  action: string
  success: boolean
}

// Log servisi için parametreler - Prisma create input'undan türet
export type CreateLogParams = Pick<Prisma.LogCreateInput, 'level' | 'event' | 'message' | 'metadata'> & {
  userId?: string
}

// Log filtreleme parametreleri
export interface LogFilters {
  level?: LogLevel
  event?: string
  userId?: string
  userRoles?: UserRole[]
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

// Log servisi yanıtları
export interface LogServiceResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Log ile kullanıcı bilgilerini birlikte getirmek için tip - Prisma include kullan
export type LogWithUser = Prisma.LogGetPayload<{
  include: {
    user: {
      select: {
        id: true
        username: true
        email: true
        role: true
      }
    }
  }
}>

// Log listesi için tip
export interface LogListResponse {
  logs: LogWithUser[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Rol bazlı log filtreleme için örnek kullanım tipleri
export type RoleBasedLogFilters = {
  // Tek rol filtreleme
  adminLogs: LogFilters & { userRoles: ['ADMIN'] }
  moderatorLogs: LogFilters & { userRoles: ['MODERATOR'] }
  
  // Çoklu rol filtreleme
  staffLogs: LogFilters & { userRoles: ['ADMIN', 'MODERATOR', 'EDITOR'] }
  nonUserLogs: LogFilters & { userRoles: ['ADMIN', 'MODERATOR'] }
}

// Rol bazlı istatistikler için tip
export interface RoleBasedLogStats {
  role: UserRole
  count: number
  levels: Record<LogLevel, number>
} 