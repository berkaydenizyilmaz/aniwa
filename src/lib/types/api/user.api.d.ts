// User API response tipleri

import { UserProfileSettings } from '@prisma/client';

// User profil response tipi
export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  slug: string;
  roles: string[];
  createdAt: Date;
  lastLoginAt: Date | null;
  settings: UserProfileSettings | null;
}

// User profil güncelleme response tipi
export interface UserProfileUpdateResponse {
  id: string;
  username: string;
  email: string;
  slug: string;
}

// User ayarlar response tipi
export type UserSettingsResponse = UserProfileSettings;

// User API istek tipleri
export interface UpdateUserProfileRequest {
  username?: string;
  email?: string;
}

export type UpdateUserSettingsRequest = Partial<UserProfileSettings>; 