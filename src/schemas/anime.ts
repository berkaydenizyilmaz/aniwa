// Bu dosya anime ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { ANIME, ANIME_STATUS, ANIME_TYPE, MEDIA_LIST_STATUS, SEASON, SOURCE } from '@/constants'
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
  type: z.array(z.enum(Object.values(ANIME_TYPE) as [string, ...string[]])).optional(),
  status: z.array(z.enum(Object.values(ANIME_STATUS) as [string, ...string[]])).optional(),
  season: z.array(z.enum(Object.values(SEASON) as [string, ...string[]])).optional(),
  seasonYear: z.array(z.number().int().min(1950).max(2030)).optional(),
  genreIds: z.array(idSchema).optional(),
  tagIds: z.array(idSchema).optional(),
  studioIds: z.array(idSchema).optional(),
  source: z.array(z.enum(Object.values(SOURCE) as [string, ...string[]])).optional(),
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
  type: z.enum(Object.values(ANIME_TYPE) as [string, ...string[]]),
  status: z.enum(Object.values(ANIME_STATUS) as [string, ...string[]]),
  season: z.enum(Object.values(SEASON) as [string, ...string[]]).optional(),
  seasonYear: z.number().int().min(1950).max(2030).optional(),
  source: z.enum(Object.values(SOURCE) as [string, ...string[]]).optional(),
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
  status: z.enum(Object.values(MEDIA_LIST_STATUS) as [string, ...string[]]),
  score: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  progress: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  isPrivate: z.boolean().default(false),
}) 