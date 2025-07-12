// Aniwa Projesi - Anime Schemas
// Bu dosya anime ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { ANIME } from '@/constants'
import { idSchema, urlSchema } from './user'

// =============================================================================
// COMMON FIELD ŞEMALARI
// =============================================================================

export const dateSchema = z.coerce.date()

// =============================================================================
// ANIME ŞEMALARI
// =============================================================================

export const animeSearchSchema = z.object({
  query: z.string().optional(),
  type: z.array(z.enum(['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'])).optional(),
  status: z.array(z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS'])).optional(),
  season: z.array(z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL'])).optional(),
  seasonYear: z.array(z.number().int().min(1950).max(2030)).optional(),
  genreIds: z.array(idSchema).optional(),
  tagIds: z.array(idSchema).optional(),
  studioIds: z.array(idSchema).optional(),
  source: z.array(z.enum(['ORIGINAL', 'MANGA', 'LIGHT_NOVEL', 'VISUAL_NOVEL', 'VIDEO_GAME', 'NOVEL', 'DOUJINSHI', 'WEB_NOVEL', 'LIVE_ACTION', 'GAME', 'COMIC', 'MULTIMEDIA_PROJECT', 'PICTURE_BOOK', 'OTHER'])).optional(),
  isAdult: z.boolean().optional(),
  minScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  maxScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  minYear: z.number().int().min(1950).max(2030).optional(),
  maxYear: z.number().int().min(1950).max(2030).optional(),
  sortBy: z.enum(['title', 'score', 'popularity', 'startDate', 'endDate', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const createAnimeSeriesSchema = z.object({
  title: z.string().min(1, 'Başlık gerekli').max(ANIME.TEXT_LIMITS.TITLE_MAX_LENGTH),
  titleEnglish: z.string().max(ANIME.TEXT_LIMITS.TITLE_MAX_LENGTH).optional(),
  titleJapanese: z.string().max(ANIME.TEXT_LIMITS.TITLE_MAX_LENGTH).optional(),
  description: z.string().max(ANIME.TEXT_LIMITS.DESCRIPTION_MAX_LENGTH).optional(),
  coverImage: urlSchema.optional(),
  bannerImage: urlSchema.optional(),
  type: z.enum(['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC']),
  status: z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']),
  season: z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']).optional(),
  seasonYear: z.number().int().min(1950).max(2030).optional(),
  source: z.enum(['ORIGINAL', 'MANGA', 'LIGHT_NOVEL', 'VISUAL_NOVEL', 'VIDEO_GAME', 'NOVEL', 'DOUJINSHI', 'WEB_NOVEL', 'LIVE_ACTION', 'GAME', 'COMIC', 'MULTIMEDIA_PROJECT', 'PICTURE_BOOK', 'OTHER']).optional(),
  episodes: z.number().int().min(1).optional(),
  duration: z.number().int().min(1).optional(),
  isAdult: z.boolean().default(false),
  genreIds: z.array(idSchema).optional(),
  tagIds: z.array(idSchema).optional(),
  studioIds: z.array(idSchema).optional(),
})

export const addToAnimeListSchema = z.object({
  animeSeriesId: idSchema,
  animeMediaPartId: idSchema.optional(),
  status: z.enum(['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING']),
  score: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  progress: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  isPrivate: z.boolean().default(false),
}) 