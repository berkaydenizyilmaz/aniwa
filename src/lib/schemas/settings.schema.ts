// Settings validasyon şemaları

import { z } from 'zod';
import { Theme, TitleLanguage, ScoreFormat, ProfileVisibility } from '@prisma/client';
import { AUTH } from '@/lib/constants/auth.constants';

// Profile Settings - Ayrı şemalar
export const updateUsernameSchema = z.object({
  username: z.string()
    .min(AUTH.USERNAME.MIN_LENGTH, 'Kullanıcı adı en az 3 karakter olmalı')
    .max(AUTH.USERNAME.MAX_LENGTH, 'Kullanıcı adı en fazla 50 karakter olabilir')
    .regex(AUTH.USERNAME.REGEX, 'Kullanıcı adı sadece harf ve rakam içerebilir'),
});

export const updateBioSchema = z.object({
  bio: z.string()
    .max(500, 'Biyografi en fazla 500 karakter olabilir')
    .nullable(),
});

export const updatePasswordSchema = z.object({
  newPassword: z.string()
    .min(AUTH.PASSWORD.MIN_LENGTH, 'Parola en az 6 karakter olmalı'),
  confirmPassword: z.string()
    .min(AUTH.PASSWORD.MIN_LENGTH, 'Parola en az 6 karakter olmalı'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Parolalar eşleşmiyor',
  path: ['confirmPassword'],
});

export const updateProfileImagesSchema = z.object({
  profilePicture: z.string().nullable(),
  profileBanner: z.string().nullable(),
});

// General Settings - Ayrı şemalar
export const updateThemePreferenceSchema = z.object({
  themePreference: z.nativeEnum(Theme, { 
    required_error: 'Tema tercihi seçin' 
  }),
});

export const updateTitleLanguagePreferenceSchema = z.object({
  titleLanguagePreference: z.nativeEnum(TitleLanguage, { 
    required_error: 'Başlık dili seçin' 
  }),
});

export const updateScoreFormatSchema = z.object({
  scoreFormat: z.nativeEnum(ScoreFormat, { 
    required_error: 'Puanlama formatı seçin' 
  }),
});

export const updateDisplayAdultContentSchema = z.object({
  displayAdultContent: z.boolean(),
});

export const updateAutoTrackOnAniwaListAddSchema = z.object({
  autoTrackOnAniwaListAdd: z.boolean(),
});

// Privacy Settings - Ayrı şemalar
export const updateProfileVisibilitySchema = z.object({
  profileVisibility: z.nativeEnum(ProfileVisibility, { 
    required_error: 'Profil görünürlüğü seçin' 
  }),
});

export const updateAllowFollowsSchema = z.object({
  allowFollows: z.boolean(),
});

export const updateShowAnimeListSchema = z.object({
  showAnimeList: z.boolean(),
});

export const updateShowFavouriteAnimeSeriesSchema = z.object({
  showFavouriteAnimeSeries: z.boolean(),
});

export const updateShowCustomListsSchema = z.object({
  showCustomLists: z.boolean(),
});

// Notification Settings - Tek şema
export const updateNotificationSettingsSchema = z.object({
  receiveNotificationOnNewFollow: z.boolean(),
  receiveNotificationOnEpisodeAiring: z.boolean(),
  receiveNotificationOnNewMediaPart: z.boolean(),
});

// Type exports
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type UpdateBioInput = z.infer<typeof updateBioSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileImagesInput = z.infer<typeof updateProfileImagesSchema>;

export type UpdateThemePreferenceInput = z.infer<typeof updateThemePreferenceSchema>;
export type UpdateTitleLanguagePreferenceInput = z.infer<typeof updateTitleLanguagePreferenceSchema>;
export type UpdateScoreFormatInput = z.infer<typeof updateScoreFormatSchema>;
export type UpdateDisplayAdultContentInput = z.infer<typeof updateDisplayAdultContentSchema>;
export type UpdateAutoTrackOnAniwaListAddInput = z.infer<typeof updateAutoTrackOnAniwaListAddSchema>;

export type UpdateProfileVisibilityInput = z.infer<typeof updateProfileVisibilitySchema>;
export type UpdateAllowFollowsInput = z.infer<typeof updateAllowFollowsSchema>;
export type UpdateShowAnimeListInput = z.infer<typeof updateShowAnimeListSchema>;
export type UpdateShowFavouriteAnimeSeriesInput = z.infer<typeof updateShowFavouriteAnimeSeriesSchema>;
export type UpdateShowCustomListsInput = z.infer<typeof updateShowCustomListsSchema>;

export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>; 