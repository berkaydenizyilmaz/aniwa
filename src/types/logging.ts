import { 
  Log,
  LogLevel,
  UserRole
} from "@prisma/client"

// Log ile kullanıcı bilgisi
export type LogWithUser = Log & {
  user?: {
    id: string
    username: string
    email: string
    roles: UserRole[]
  } | null
}

// Log metadata tipi
export type LogMetadata = Record<string, unknown>

// Log oluşturma parametreleri
export interface CreateLogParams {
  level: LogLevel
  event: string
  message: string
  metadata?: LogMetadata
  userId?: string
}

// Log fonksiyonu parametreleri
export interface LogFunctionParams {
  event: string
  message: string
  metadata?: LogMetadata
  userId?: string
}

// Log filtreleme parametreleri
export interface LogFilters {
  level?: LogLevel[]
  userId?: string
  event?: string[]
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'level' | 'event'
  sortOrder?: 'asc' | 'desc'
}

// Log istatistikleri
export interface LogStats {
  totalLogs: number
  logsByLevel: Record<LogLevel, number>
  logsByEvent: Record<string, number>
  logsToday: number
  logsThisWeek: number
  errorRate: number
  mostActiveUsers: Array<{
    user: {
      id: string
      username: string
      email: string
    }
    logCount: number
  }>
} 