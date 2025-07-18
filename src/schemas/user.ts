import { z } from 'zod'
import { emailSchema, usernameSchema } from './auth'

// Common field şemaları
export const idSchema = z.string().min(1, 'ID gerekli')
export const urlSchema = z.string().url('Geçerli bir URL giriniz')

// User şemaları

// Kullanıcı adı değiştirme şeması
export const changeUsernameSchema = z.object({
  username: usernameSchema,
})

// Kullanıcı profil güncelleme şeması
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
  profilePicture: urlSchema.optional(),
  profileBanner: urlSchema.optional(),
})

// Kullanıcı ayarları güncelleme şeması
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

// Type exports
export type UpdateUserSettingsData = z.infer<typeof updateUserSettingsSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type ChangeUsernameData = z.infer<typeof changeUsernameSchema> 