// Aniwa Projesi - Community Domain Types
// Bu dosya topluluk, yorum ve sosyal özellikler ile ilgili tüm tip tanımlarını içerir

import { 
  Comment,
  CommentLike,
  CustomList,
  CustomListItem,
  Notification,
  NotificationType
} from "@prisma/client"
import type { ID } from './index'

// =============================================================================
// YORUM SİSTEMİ
// =============================================================================

// Yorum ile kullanıcı bilgisi
export type CommentWithUser = Comment & {
  user: {
    id: ID
    username: string
    image?: string
    profilePicture?: string
    roles: string[]
  }
  likes: CommentLike[]
  _count: {
    likes: number
  }
}

// Yorum oluşturma parametreleri
export interface CreateCommentParams {
  content: string
  animeSeriesId?: ID
  animeMediaPartId?: ID
  episodeId?: ID
  parentCommentId?: ID
}

// Yorum güncelleme parametreleri
export interface UpdateCommentParams {
  content: string
}

// =============================================================================
// TAKİP SİSTEMİ
// =============================================================================

// Takip oluşturma parametreleri
export interface CreateFollowParams {
  followingUserId: ID
}

// Takip listesi filtreleme
export interface FollowListFilters {
  sortBy?: 'username' | 'followedAt'
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// ÖZEL LİSTELER
// =============================================================================

// Özel liste ile öğeler
export type CustomListWithItems = CustomList & {
  items: (CustomListItem & {
    animeSeries: {
      id: ID
      title: string
      coverImage?: string
      type: string
      status: string
    }
  })[]
  user: {
    id: ID
    username: string
    image?: string
  }
  _count: {
    items: number
  }
}

// Özel liste oluşturma parametreleri
export interface CreateCustomListParams {
  name: string
  description?: string
  isPublic?: boolean
  animeSeriesIds?: ID[]
}

// Özel liste güncelleme parametreleri
export interface UpdateCustomListParams {
  name?: string
  description?: string
  isPublic?: boolean
}

// Özel liste öğesi ekleme parametreleri
export interface AddToCustomListParams {
  animeSeriesId: ID
  notes?: string
}

// =============================================================================
// BİLDİRİM SİSTEMİ
// =============================================================================

// Bildirim ile ilgili veriler
export type NotificationWithData = Notification & {
  relatedUser?: {
    id: ID
    username: string
    image?: string
    profilePicture?: string
  }
  relatedAnimeSeries?: {
    id: ID
    title: string
    coverImage?: string
  }
  relatedAnimeMediaPart?: {
    id: ID
    title: string
    coverImage?: string
  }
}

// Bildirim oluşturma parametreleri
export interface CreateNotificationParams {
  userId: ID
  type: NotificationType
  title: string
  message: string
  relatedUserId?: ID
  relatedAnimeSeriesId?: ID
  relatedAnimeMediaPartId?: ID
  relatedUrl?: string
}

// Bildirim filtreleme
export interface NotificationFilters {
  type?: NotificationType[]
  isRead?: boolean
  sortBy?: 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// SOSYAL İSTATİSTİKLER
// =============================================================================

// Topluluk istatistikleri
export interface CommunityStats {
  totalComments: number
  totalLikes: number
  totalFollows: number
  totalCustomLists: number
  activeUsersToday: number
  popularAnimeThisWeek: Array<{
    id: ID
    title: string
    coverImage?: string
    interactionCount: number
  }>
}

// Kullanıcı sosyal aktivitesi
export interface UserSocialActivity {
  commentsCount: number
  likesGiven: number
  likesReceived: number
  followersCount: number
  followingCount: number
  customListsCount: number
  recentComments: CommentWithUser[]
  recentLikes: Array<{
    comment: CommentWithUser
    likedAt: Date
  }>
}

// =============================================================================
// EXPORTS
// =============================================================================

// Prisma enum'larını re-export et
export { NotificationType } from "@prisma/client" 