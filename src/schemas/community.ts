// Aniwa Projesi - Community Schemas
// Bu dosya topluluk ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { ANIME } from '@/constants'
import { idSchema } from './user'

// =============================================================================
// COMMUNITY ŞEMALARI
// =============================================================================

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Yorum içeriği gerekli').max(ANIME.TEXT_LIMITS.COMMENT_MAX_LENGTH),
  animeSeriesId: idSchema.optional(),
  animeMediaPartId: idSchema.optional(),
  episodeId: idSchema.optional(),
  parentCommentId: idSchema.optional(),
})

export const createCustomListSchema = z.object({
  name: z.string().min(1, 'Liste adı gerekli').max(ANIME.TEXT_LIMITS.LIST_NAME_MAX_LENGTH),
  description: z.string().max(ANIME.TEXT_LIMITS.LIST_DESCRIPTION_MAX_LENGTH).optional(),
  isPublic: z.boolean().default(true),
  animeSeriesIds: z.array(idSchema).optional(),
}) 