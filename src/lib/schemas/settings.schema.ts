// Settings validasyon şemaları

import { z } from 'zod';
import { Theme, TitleLanguage, ScoreFormat, ProfileVisibility } from '@prisma/client';

// =============================================================================
// PROFİL AYARLARI
// =============================================================================

// Profil güncelleme şeması
export const updateProfileSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı').max(20, 'Kullanıcı adı en fazla 20 karakter olabilir').optional(),
  bio: z.string().max(500, 'Biyografi en fazla 500 karakter olabilir').optional(),
  profilePicture: z.instanceof(File).optional().nullable(),
  profileBanner: z.instanceof(File).optional().nullable(),
});

// =============================================================================
// GENEL AYARLAR
// =============================================================================

// Genel ayarlar güncelleme şeması
export const updateGeneralSettingsSchema = z.object({
  themePreference: z.nativeEnum(Theme, { required_error: 'Tema tercihi seçin' }).optional(),
  titleLanguagePreference: z.nativeEnum(TitleLanguage, { required_error: 'Başlık dili seçin' }).optional(),
  displayAdultContent: z.boolean().optional(),
  scoreFormat: z.nativeEnum(ScoreFormat, { required_error: 'Puanlama formatı seçin' }).optional(),
  autoTrackOnAniwaListAdd: z.boolean().optional(),
});

// =============================================================================
// GİZLİLİK AYARLARI
// =============================================================================

// Gizlilik ayarları güncelleme şeması
export const updatePrivacySettingsSchema = z.object({
  profileVisibility: z.nativeEnum(ProfileVisibility, { required_error: 'Profil görünürlüğü seçin' }).optional(),
  allowFollows: z.boolean().optional(),
  showAnimeList: z.boolean().optional(),
  showFavouriteAnimeSeries: z.boolean().optional(),
  showCustomLists: z.boolean().optional(),
});

// =============================================================================
// BİLDİRİM AYARLARI
// =============================================================================

// Bildirim ayarları güncelleme şeması
export const updateNotificationSettingsSchema = z.object({
  receiveNotificationOnNewFollow: z.boolean().optional(),
  receiveNotificationOnEpisodeAiring: z.boolean().optional(),
  receiveNotificationOnNewMediaPart: z.boolean().optional(),
});

// =============================================================================
// TİP TÜRETMELERİ
// =============================================================================

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateGeneralSettingsInput = z.infer<typeof updateGeneralSettingsSchema>;
export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>;
export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>; 