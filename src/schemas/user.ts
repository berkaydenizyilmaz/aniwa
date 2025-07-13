import { z } from 'zod'
import { emailSchema, usernameSchema } from './auth'

// =============================================================================
// COMMON FIELD ŞEMALARI
// =============================================================================

export const idSchema = z.string().min(1, 'ID gerekli')
export const urlSchema = z.string().url('Geçerli bir URL giriniz')

// =============================================================================
// USER ŞEMALARI
// =============================================================================

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
  profilePicture: urlSchema.optional(),
  profileBanner: urlSchema.optional(),
  image: urlSchema.optional(),
})

export const updateUserSettingsSchema = z.object({
  themePreference: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  titleLanguagePreference: z.enum(['ROMAJI', 'ENGLISH', 'JAPANESE']).optional(),
  displayAdultContent: z.boolean().optional(),
  scoreFormat: z.enum(['POINT_100', 'POINT_10', 'POINT_5']).optional(),
  autoTrackOnAniwaListAdd: z.boolean().optional(),
  profileVisibility: z.enum(['PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE']).optional(),
  allowFollows: z.boolean().optional(),
  showAnimeList: z.boolean().optional(),
  showFavouriteAnimeSeries: z.boolean().optional(),
  showCustomLists: z.boolean().optional(),
}) 