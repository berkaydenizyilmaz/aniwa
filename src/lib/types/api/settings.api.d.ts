// Settings API response tipleri

import { User, UserProfileSettings } from '@prisma/client';
import { 
  UpdateProfileInput, 
  UpdateGeneralSettingsInput, 
  UpdatePrivacySettingsInput, 
  UpdateNotificationSettingsInput 
} from '@/lib/schemas/settings.schema';

// Profil güncelleme response tipi
export interface UpdateProfileResponse {
  message: string;
}

// Profil güncelleme request tipi
export type UpdateProfileRequest = UpdateProfileInput;

// Genel ayarlar güncelleme response tipi
export interface UpdateGeneralSettingsResponse {
  message: string;
}

// Genel ayarlar güncelleme request tipi
export type UpdateGeneralSettingsRequest = UpdateGeneralSettingsInput;

// Gizlilik ayarları güncelleme response tipi
export interface UpdatePrivacySettingsResponse {
  message: string;
}

// Gizlilik ayarları güncelleme request tipi
export type UpdatePrivacySettingsRequest = UpdatePrivacySettingsInput;

// Bildirim ayarları güncelleme response tipi
export interface UpdateNotificationSettingsResponse {
  message: string;
}

// Bildirim ayarları güncelleme request tipi
export type UpdateNotificationSettingsRequest = UpdateNotificationSettingsInput;

// Kullanıcı ayarlarını getirme response tipi
export interface GetUserSettingsResponse {
  user: {
    id: string;
    username: string;
    email: string;
    bio: string | null;
    profilePicture: string | null;
    profileBanner: string | null;
    lastLoginAt: Date | null;
    usernameChangedAt: Date | null;
    createdAt: Date;
  };
  settings: UserProfileSettings | null;
} 