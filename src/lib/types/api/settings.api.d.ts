// Settings API response types

import { UserProfileSettings, User } from '@prisma/client';

// General Settings API Types
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

// Privacy Settings API Types
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

// Notification Settings API Types
export interface UpdateNotificationSettingsResponse {
  message: string;
}

// Profile Settings API Types
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

// Combined Settings Response
export interface GetUserSettingsResponse extends UserProfileSettings {}

// Combined User Data Response (Settings + Profile)
export interface GetUserDataResponse {
  settings: GetUserSettingsResponse;
  profile: GetUserProfileResponse;
} 