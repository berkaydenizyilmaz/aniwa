// Bu dosya yönetim paneli ile ilgili tüm tip tanımlarını içerir

import { 
  Log,
  LogLevel,
  UserRole
} from "@prisma/client"
import type { ID } from './index'

// =============================================================================
// LOG SİSTEMİ
// =============================================================================

// Log ile kullanıcı bilgisi
export type LogWithUser = Log & {
  user?: {
    id: ID
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

// Log listesi response tipi
export interface LogListResponse {
  logs: LogWithUser[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// Log filtreleme parametreleri
export interface LogFilters {
  level?: LogLevel[]
  userId?: ID
  event?: string[]
  startDate?: Date
  endDate?: Date
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
      id: ID
      username: string
      email: string
    }
    logCount: number
  }>
}

// =============================================================================
// KULLANICI YÖNETİMİ
// =============================================================================

// Admin kullanıcı listesi
export interface AdminUserListItem {
  id: ID
  username: string
  email: string
  roles: UserRole[]
  image?: string
  profilePicture?: string
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
  stats: {
    animeListCount: number
    commentsCount: number
    followersCount: number
    followingCount: number
  }
}

// Kullanıcı rol güncelleme parametreleri
export interface UpdateUserRoleParams {
  userId: ID
  roles: UserRole[]
}

// Kullanıcı durumu güncelleme parametreleri
export interface UpdateUserStatusParams {
  userId: ID
  isActive: boolean
  reason?: string
}

// =============================================================================
// MODERATION
// =============================================================================

// Moderasyon eylemi tipleri
export type ModerationAction = 
  | 'DELETE_COMMENT'
  | 'EDIT_COMMENT'
  | 'BAN_USER'
  | 'UNBAN_USER'
  | 'WARN_USER'
  | 'DELETE_ANIME'
  | 'EDIT_ANIME'

// Moderasyon logu
export interface ModerationLog {
  id: ID
  action: ModerationAction
  moderatorId: ID
  targetUserId?: ID
  targetCommentId?: ID
  targetAnimeId?: ID
  reason: string
  details?: Record<string, unknown>
  createdAt: Date
  moderator: {
    id: ID
    username: string
    roles: UserRole[]
  }
  targetUser?: {
    id: ID
    username: string
    email: string
  }
}

// Moderasyon eylem parametreleri
export interface CreateModerationLogParams {
  action: ModerationAction
  targetUserId?: ID
  targetCommentId?: ID
  targetAnimeId?: ID
  reason: string
  details?: Record<string, unknown>
}

// =============================================================================
// SİSTEM İSTATİSTİKLERİ
// =============================================================================

// Genel sistem istatistikleri
export interface SystemStats {
  users: {
    total: number
    active: number
    newThisWeek: number
    byRole: Record<UserRole, number>
  }
  content: {
    totalAnimeSeries: number
    totalEpisodes: number
    totalComments: number
    totalLists: number
  }
  activity: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    averageSessionDuration: number
  }
  performance: {
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
}

// Günlük aktivite istatistikleri
export interface DailyActivityStats {
  date: Date
  activeUsers: number
  newUsers: number
  comments: number
  animeListUpdates: number
  pageViews: number
  errors: number
}

// =============================================================================
// EXPORTS
// =============================================================================

// Prisma enum'larını re-export et
export { LogLevel, UserRole } from "@prisma/client" 