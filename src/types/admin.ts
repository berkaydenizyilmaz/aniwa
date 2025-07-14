import { 
  UserRole
} from "@prisma/client"
import type { ID } from './index'
import type { LogWithUser, LogMetadata, CreateLogParams, LogFilters, LogStats } from './logging'

// =============================================================================
// MODERATION SİSTEMİ
// =============================================================================

// Moderasyon aksiyonları
export type ModerationAction = 
  | 'DELETE_COMMENT'
  | 'EDIT_COMMENT'
  | 'BAN_USER'
  | 'UNBAN_USER'
  | 'WARN_USER'
  | 'DELETE_ANIME'
  | 'EDIT_ANIME'

// Moderasyon log kaydı
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

// Moderasyon log oluşturma parametreleri
export interface CreateModerationLogParams {
  action: ModerationAction
  targetUserId?: ID
  targetCommentId?: ID
  targetAnimeId?: ID
  reason: string
  details?: Record<string, unknown>
}

// =============================================================================
// ADMIN USER YÖNETİMİ
// =============================================================================

// Admin kullanıcı listesi item
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
// SİSTEM İSTATİSTİKLERİ
// =============================================================================

// Sistem istatistikleri
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

// Re-export log types for backward compatibility
export type { LogWithUser, LogMetadata, CreateLogParams, LogFilters, LogStats } 