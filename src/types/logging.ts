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

// Log filtreleme parametreleri - Partial kullanarak opsiyonel hale getir
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

// Log servisi yanıtları
export interface LogServiceResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// User select için sabit tip - DRY prensibi
export type LogUserSelect = {
  id: true
  username: true
  email: true
  roles: true
}

// Log ile kullanıcı bilgilerini birlikte getirmek için tip - Prisma include kullan
export type LogWithUser = Prisma.LogGetPayload<{
  include: {
    user: {
      select: LogUserSelect
    }
  }
}>

// Sadece log bilgisi (user olmadan)
export type LogOnly = Omit<LogWithUser, 'user'>

// Log listesi için tip
export interface LogListResponse {
  logs: LogWithUser[]
  pagination: PaginationInfo
}

// Pagination bilgisi için ayrı tip
export type PaginationInfo = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Rol bazlı log filtreleme için genel tip tanımları
export type SingleRoleFilter<T extends UserRole> = LogFilters & { userRoles: [T] }
export type MultiRoleFilter<T extends readonly UserRole[]> = LogFilters & { userRoles: T }

// Rol bazlı istatistikler için tip
export interface RoleBasedLogStats {
  role: UserRole
  count: number
  levels: Record<LogLevel, number>
}

// Log istatistikleri için tip - Utility types kullan
export type LogStats = Record<LogLevel, number>

// Log temizleme sonucu için tip
export type CleanupResult = {
  deletedCount: number
}

// Date range için tip
export type DateRange = {
  startDate?: Date
  endDate?: Date
}

// Log query options - Pick ve Partial kombinasyonu
export type LogQueryOptions = Pick<LogFilters, 'limit' | 'offset'> & 
  Partial<Pick<LogFilters, 'level' | 'event' | 'userId' | 'userRoles'>> & 
  DateRange

// Admin log view için tip - sadece gerekli alanlar
export type AdminLogView = Pick<LogWithUser, 'id' | 'level' | 'event' | 'message' | 'timestamp'> & {
  user?: {
    username: string | null
    roles: UserRole[]
  } | null
}

// Log export için tip
export type LogExport = Omit<LogWithUser, 'user'> & {
  username?: string | null
  userRoles?: UserRole[] | null
} 