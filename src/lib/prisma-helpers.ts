// Aniwa Projesi - Prisma Helpers
// Bu dosya Prisma ile çalışmayı kolaylaştıran utility tipler ve fonksiyonları içerir

import { Prisma } from '@prisma/client'
import type { ApiResponse } from '@/types'

// =============================================================================
// UTILITY TIPLERI
// =============================================================================

// Prisma'dan model tiplerini çıkarmak için yardımcı tipler
export type PrismaModel = keyof typeof Prisma.ModelName
export type PrismaDelegate = Prisma.TypeMap['model'][PrismaModel]['operations']

// Prisma select helper
export type PrismaSelect<T extends PrismaModel> = Prisma.TypeMap['model'][T]['operations']['findFirst']['args']['select']

// Prisma include helper
export type PrismaInclude<T extends PrismaModel> = Prisma.TypeMap['model'][T]['operations']['findFirst']['args']['include']

// Prisma where helper
export type PrismaWhere<T extends PrismaModel> = Prisma.TypeMap['model'][T]['operations']['findFirst']['args']['where']

// Prisma orderBy helper
export type PrismaOrderBy<T extends PrismaModel> = Prisma.TypeMap['model'][T]['operations']['findFirst']['args']['orderBy']

// =============================================================================
// COMMON INCLUDES
// =============================================================================

// Kullanıcı ile ayarları
export const userWithSettings = {
  userSettings: true,
} as const

// Kullanıcı ile takip bilgileri
export const userWithFollows = {
  followingUser: true,
  followedBy: true,
  _count: {
    select: {
      followingUser: true,
      followedBy: true,
    },
  },
} as const

// Anime serisi ile ilişkili veriler
export const animeSeriesWithRelations = {
  genres: true,
  tags: true,
  studios: true,
  mediaParts: true,
  streamingLinks: true,
  _count: {
    select: {
      userAnimeLists: true,
      favouriteAnimeSeries: true,
      userAnimeTracking: true,
    },
  },
} as const

// Anime medya parçası ile bölümler
export const animeMediaPartWithEpisodes = {
  episodes: true,
  streamingLinks: true,
  _count: {
    select: {
      episodes: true,
    },
  },
} as const

// Yorum ile kullanıcı bilgisi
export const commentWithUser = {
  user: {
    select: {
      id: true,
      username: true,
      image: true,
      profilePicture: true,
      roles: true,
    },
  },
  likes: true,
  _count: {
    select: {
      likes: true,
    },
  },
} as const

// Log ile kullanıcı bilgisi
export const logWithUser = {
  user: {
    select: {
      id: true,
      username: true,
      email: true,
      roles: true,
    },
  },
} as const

// =============================================================================
// COMMON SELECTS
// =============================================================================

// Kullanıcı profil özeti
export const userProfileSelect = {
  id: true,
  username: true,
  slug: true,
  image: true,
  profilePicture: true,
  profileBanner: true,
  bio: true,
  roles: true,
  createdAt: true,
  userSettings: {
    select: {
      profileVisibility: true,
      showAnimeList: true,
      showFavouriteAnimeSeries: true,
      showCustomLists: true,
    },
  },
} as const

// Anime serisi özeti
export const animeSeriesSummarySelect = {
  id: true,
  title: true,
  titleEnglish: true,
  titleJapanese: true,
  coverImage: true,
  type: true,
  status: true,
  episodes: true,
  season: true,
  seasonYear: true,
  score: true,
  popularity: true,
} as const

// =============================================================================
// COMMON WHERE CONDITIONS
// =============================================================================

// Aktif kullanıcılar
export const activeUserWhere = {
  // Burada kullanıcının aktif olup olmadığını kontrol edecek koşulları ekleyebiliriz
  // Örneğin: isActive: true, deletedAt: null vb.
} as const

// Yetişkin içerik filtresi
export const adultContentWhere = (showAdult: boolean) => ({
  isAdult: showAdult ? undefined : false,
}) as const

// Genel görünürlük filtresi
export const publicVisibilityWhere = {
  userSettings: {
    profileVisibility: 'PUBLIC',
  },
} as const

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Prisma hatalarını ApiResponse formatına dönüştürme
export function handlePrismaError<T>(error: unknown): ApiResponse<T> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          success: false,
          error: 'Bu kayıt zaten mevcut (benzersizlik kısıtlaması)',
        }
      case 'P2025':
        return {
          success: false,
          error: 'Kayıt bulunamadı',
        }
      case 'P2003':
        return {
          success: false,
          error: 'İlişkili kayıt bulunamadı',
        }
      case 'P2014':
        return {
          success: false,
          error: 'Geçersiz ilişki',
        }
      default:
        return {
          success: false,
          error: `Veritabanı hatası: ${error.message}`,
        }
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      success: false,
      error: 'Geçersiz veri formatı',
    }
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : 'Bilinmeyen hata',
  }
}

// Sayfalama helper
export function getPaginationArgs(page: number, limit: number) {
  const skip = (page - 1) * limit
  return {
    skip,
    take: limit,
  }
}

// Sayfalama meta bilgisi oluşturma
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

// Sıralama helper
export function getOrderByArgs(
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  if (!sortBy) return undefined
  
  return {
    [sortBy]: sortOrder,
  }
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

// Prisma model tiplerini kontrol etme
export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export function isPrismaValidationError(error: unknown): error is Prisma.PrismaClientValidationError {
  return error instanceof Prisma.PrismaClientValidationError
}

// =============================================================================
// TRANSACTION HELPERS
// =============================================================================

// Transaction wrapper
export async function withTransaction<T>(
  prisma: Prisma.TransactionClient,
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const result = await operation(prisma)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return handlePrismaError(error)
  }
}

// Batch operations helper
export function createBatchOperations<T>(
  items: T[],
  batchSize: number = 100
): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  return batches
} 