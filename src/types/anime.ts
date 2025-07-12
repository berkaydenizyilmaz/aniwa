// Aniwa Projesi - Anime Domain Types
// Bu dosya anime ve medya ile ilgili tüm tip tanımlarını içerir

import { 
  AnimeSeries,
  AnimeMediaPart,
  Episode,
  Genre,
  Tag,
  Studio,
  StreamingLink,
  UserAnimeList,
  AnimeType,
  AnimeStatus,
  Season,
  Source,
  MediaListStatus
} from "@prisma/client"
import type { ID } from './index'

// =============================================================================
// TEMEL ANIME TIPLERI
// =============================================================================

// Anime serisi ile ilişkili veriler
export type AnimeSeriesWithRelations = AnimeSeries & {
  genres: Genre[]
  tags: Tag[]
  studios: Studio[]
  mediaParts: AnimeMediaPart[]
  streamingLinks: StreamingLink[]
  _count: {
    userAnimeLists: number
    favouriteAnimeSeries: number
    userAnimeTracking: number
  }
}

// Anime medya parçası ile bölümler
export type AnimeMediaPartWithEpisodes = AnimeMediaPart & {
  episodes: Episode[]
  streamingLinks: StreamingLink[]
  _count: {
    episodes: number
  }
}

// Kullanıcı anime listesi ile anime bilgisi
export type UserAnimeListWithAnime = UserAnimeList & {
  animeSeries: AnimeSeries
  animeMediaPart: AnimeMediaPart
}

// =============================================================================
// CRUD PARAMETRELERI
// =============================================================================

// Anime serisi oluşturma parametreleri
export interface CreateAnimeSeriesParams {
  title: string
  titleEnglish?: string
  titleJapanese?: string
  description?: string
  coverImage?: string
  bannerImage?: string
  type: AnimeType
  status: AnimeStatus
  season?: Season
  seasonYear?: number
  source?: Source
  episodes?: number
  duration?: number
  isAdult?: boolean
  genreIds?: ID[]
  tagIds?: ID[]
  studioIds?: ID[]
}

// Anime serisi güncelleme parametreleri
export interface UpdateAnimeSeriesParams {
  title?: string
  titleEnglish?: string
  titleJapanese?: string
  description?: string
  coverImage?: string
  bannerImage?: string
  type?: AnimeType
  status?: AnimeStatus
  season?: Season
  seasonYear?: number
  source?: Source
  episodes?: number
  duration?: number
  isAdult?: boolean
  score?: number
  popularity?: number
  genreIds?: ID[]
  tagIds?: ID[]
  studioIds?: ID[]
}

// Anime medya parçası oluşturma parametreleri
export interface CreateAnimeMediaPartParams {
  animeSeriesId: ID
  title: string
  description?: string
  coverImage?: string
  type: AnimeType
  status: AnimeStatus
  season?: Season
  seasonYear?: number
  episodes?: number
  duration?: number
  releaseDate?: Date
  endDate?: Date
  score?: number
  popularity?: number
}

// Bölüm oluşturma parametreleri
export interface CreateEpisodeParams {
  animeMediaPartId: ID
  title: string
  description?: string
  thumbnail?: string
  episodeNumber: number
  duration?: number
  airDate?: Date
  score?: number
}

// =============================================================================
// ARAMA VE FİLTRELEME
// =============================================================================

// Anime arama parametreleri
export interface AnimeSearchParams {
  query?: string
  type?: AnimeType[]
  status?: AnimeStatus[]
  season?: Season[]
  seasonYear?: number[]
  genreIds?: ID[]
  tagIds?: ID[]
  studioIds?: ID[]
  source?: Source[]
  isAdult?: boolean
  minScore?: number
  maxScore?: number
  minYear?: number
  maxYear?: number
  sortBy?: 'title' | 'score' | 'popularity' | 'startDate' | 'endDate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Anime listesi filtreleme
export interface AnimeListFilters {
  status?: MediaListStatus[]
  type?: AnimeType[]
  genreIds?: ID[]
  score?: number[]
  year?: number[]
  season?: Season[]
}

// =============================================================================
// KULLANICI ANIME LİSTESİ
// =============================================================================

// Kullanıcı anime listesi ekleme parametreleri
export interface AddToAnimeListParams {
  animeSeriesId: ID
  animeMediaPartId?: ID
  status: MediaListStatus
  score?: number
  progress?: number
  notes?: string
  startDate?: Date
  endDate?: Date
  isPrivate?: boolean
}

// Kullanıcı anime listesi güncelleme parametreleri
export interface UpdateAnimeListParams {
  status?: MediaListStatus
  score?: number
  progress?: number
  notes?: string
  startDate?: Date
  endDate?: Date
  isPrivate?: boolean
}

// Kullanıcı anime istatistikleri
export interface UserAnimeStats {
  totalAnime: number
  completedAnime: number
  currentlyWatching: number
  planToWatch: number
  dropped: number
  paused: number
  totalEpisodes: number
  totalWatchTime: number // dakika cinsinden
  averageScore: number
  genreStats: Array<{
    genre: Genre
    count: number
    averageScore: number
  }>
}

// =============================================================================
// RESPONSE TIPLERI
// =============================================================================

// Anime istatistikleri
export interface AnimeStats {
  totalSeries: number
  totalEpisodes: number
  totalStudios: number
  totalGenres: number
  totalTags: number
  seriesByStatus: Record<AnimeStatus, number>
  seriesByType: Record<AnimeType, number>
  seriesByYear: Record<number, number>
}

// Popüler anime listesi
export interface PopularAnime {
  id: ID
  title: string
  coverImage?: string
  score?: number
  popularity?: number
  type: AnimeType
  status: AnimeStatus
  episodes?: number
  season?: Season
  seasonYear?: number
}

// Anime detay sayfası için veri
export interface AnimeDetailData {
  anime: AnimeSeriesWithRelations
  userListEntry?: UserAnimeList
  isTracking?: boolean
  isFavourite?: boolean
  relatedAnime?: AnimeSeries[]
  recommendations?: AnimeSeries[]
}

// =============================================================================
// EXPORTS
// =============================================================================

// Prisma enum'larını re-export et
export { 
  AnimeType, 
  AnimeStatus, 
  Season, 
  Source, 
  MediaListStatus
} from "@prisma/client" 