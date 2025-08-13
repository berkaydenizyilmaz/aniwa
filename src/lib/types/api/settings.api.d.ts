// Settings API response tipleri

import { User, UserProfileSettings } from '@prisma/client';
import { 
  UpdateUsernameInput,
  UpdateBioInput,
  UpdatePasswordInput,
  UpdateProfileImagesInput,
  UpdateThemePreferenceInput,
  UpdateTitleLanguagePreferenceInput,
  UpdateScoreFormatInput,
  UpdateDisplayAdultContentInput,
  UpdateAutoTrackOnAniwaListAddInput,
  UpdateProfileVisibilityInput,
  UpdateAllowFollowsInput,
  UpdateShowAnimeListInput,
  UpdateShowFavouriteAnimeSeriesInput,
  UpdateShowCustomListsInput,
  UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';

// Profile Settings - Ayrı response tipleri
export interface UpdateUsernameResponse {
  message: string;
}

export interface UpdateBioResponse {
  message: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface UpdateProfileImagesResponse {
  message: string;
}

// General Settings - Ayrı response tipleri
export interface UpdateThemePreferenceResponse {
  message: string;
}

export interface UpdateTitleLanguagePreferenceResponse {
  message: string;
}

export interface UpdateScoreFormatResponse {
  message: string;
}

export interface UpdateDisplayAdultContentResponse {
  message: string;
}

export interface UpdateAutoTrackOnAniwaListAddResponse {
  message: string;
}

// Privacy Settings - Ayrı response tipleri
export interface UpdateProfileVisibilityResponse {
  message: string;
}

export interface UpdateAllowFollowsResponse {
  message: string;
}

export interface UpdateShowAnimeListResponse {
  message: string;
}

export interface UpdateShowFavouriteAnimeSeriesResponse {
  message: string;
}

export interface UpdateShowCustomListsResponse {
  message: string;
}

// Notification Settings - Tek response tipi
export interface UpdateNotificationSettingsResponse {
  message: string;
}

// Request tipleri
export type UpdateUsernameRequest = UpdateUsernameInput;
export type UpdateBioRequest = UpdateBioInput;
export type UpdatePasswordRequest = UpdatePasswordInput;
export type UpdateProfileImagesRequest = UpdateProfileImagesInput;

export type UpdateThemePreferenceRequest = UpdateThemePreferenceInput;
export type UpdateTitleLanguagePreferenceRequest = UpdateTitleLanguagePreferenceInput;
export type UpdateScoreFormatRequest = UpdateScoreFormatInput;
export type UpdateDisplayAdultContentRequest = UpdateDisplayAdultContentInput;
export type UpdateAutoTrackOnAniwaListAddRequest = UpdateAutoTrackOnAniwaListAddInput;

export type UpdateProfileVisibilityRequest = UpdateProfileVisibilityInput;
export type UpdateAllowFollowsRequest = UpdateAllowFollowsInput;
export type UpdateShowAnimeListRequest = UpdateShowAnimeListInput;
export type UpdateShowFavouriteAnimeSeriesRequest = UpdateShowFavouriteAnimeSeriesInput;
export type UpdateShowCustomListsRequest = UpdateShowCustomListsInput;

export type UpdateNotificationSettingsRequest = UpdateNotificationSettingsInput;

// Kullanıcı ayarlarını getirme response tipi
export type GetUserSettingsResponse = UserProfileSettings;

// Kullanıcı profilini getirme response tipi
export interface GetUserProfileResponse {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  profilePicture: string | null;
  profileBanner: string | null;
  lastLoginAt: Date | null;
  usernameChangedAt: Date | null;
  createdAt: Date;
} 