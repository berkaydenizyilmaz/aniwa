// User iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError
} from '@/lib/errors';
import { 
  findUserById, 
  updateUser,
  findUserByUsername,
  findUserByEmail
} from '@/lib/services/db/user.db';
import { 
  findUserSettings, 
  updateUserSettings as updateUserSettingsDB
} from '@/lib/services/db/userProfileSettings.db';
import { Prisma } from '@prisma/client';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  UserProfileResponse, 
  UserProfileUpdateResponse, 
  UserSettingsResponse,
  UpdateUserProfileRequest,
  UpdateUserSettingsRequest
} from '@/lib/types/api/user.api';

// Kullanıcı profilini getir (kendi profilini)
export async function getUserProfile(userId: string): Promise<ApiResponse<UserProfileResponse>> {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        slug: user.slug,
        roles: user.roles,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        settings: user.userSettings
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı profil getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Profil getirme başarısız');
  }
}

// Kullanıcı profilini güncelle (kendi profilini)
export async function updateUserProfile(
  userId: string, 
  data: UpdateUserProfileRequest
): Promise<ApiResponse<UserProfileUpdateResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username güncelleniyorsa benzersizlik kontrolü
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await findUserByUsername(data.username);
      if (usernameExists) {
        throw new BusinessError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Email güncelleniyorsa benzersizlik kontrolü
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await findUserByEmail(data.email);
      if (emailExists) {
        throw new BusinessError('Bu e-posta adresi zaten kullanımda');
      }
    }

    // Slug güncelleme
    const updateData: Prisma.UserUpdateInput = {};
    if (data.username) {
      updateData.username = data.username;
      updateData.slug = createSlug(data.username);
    }
    if (data.email) {
      updateData.email = data.email;
    }

    // Kullanıcı güncelle
    const result = await updateUser({ id: userId }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PROFILE_UPDATED,
      'Kullanıcı profili başarıyla güncellendi',
      { userId: result.id, username: result.username, email: result.email }
    );

    return {
      success: true,
      data: {
        id: result.id,
        username: result.username,
        email: result.email,
        slug: result.slug
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı profil güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId, data }
    );
    
    throw new BusinessError('Profil güncelleme başarısız');
  }
}

// Kullanıcı ayarlarını getir
export async function getUserSettings(userId: string): Promise<ApiResponse<UserSettingsResponse>> {
  try {
    const settings = await findUserSettings(userId);
    if (!settings) {
      throw new NotFoundError('Kullanıcı ayarları bulunamadı');
    }

    return {
      success: true,
      data: settings
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı ayarları getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Ayarlar getirme başarısız');
  }
}

// Kullanıcı ayarlarını güncelle
export async function updateUserSettings(
  userId: string, 
  data: UpdateUserSettingsRequest
): Promise<ApiResponse<UserSettingsResponse>> {
  try {
    // Ayarlar mevcut mu kontrolü
    const existingSettings = await findUserSettings(userId);
    if (!existingSettings) {
      throw new NotFoundError('Kullanıcı ayarları bulunamadı');
    }

    // Ayarları güncelle
    const result = await updateUserSettingsDB({ userId }, data);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.SETTINGS_UPDATED,
      'Kullanıcı ayarları başarıyla güncellendi',
      { userId, settings: data }
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı ayarları güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId, data }
    );
    
    throw new BusinessError('Ayarlar güncelleme başarısız');
  }
} 