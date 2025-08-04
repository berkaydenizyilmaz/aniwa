// User settings iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  ConflictError,
  DatabaseError
} from '@/lib/errors';
import { 
  findUserByIdDB,
  findUserByUsernameDB,
  updateUserDB
} from '@/lib/services/db/user.db';
import { 
  findUserSettingsDB,
  updateUserSettingsDB,
  createUserSettingsDB
} from '@/lib/services/db/userProfileSettings.db';
import { UploadService } from '@/lib/services/cloudinary/upload.service';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  UpdateProfileRequest,
  UpdateGeneralSettingsRequest,
  UpdatePrivacySettingsRequest,
  UpdateNotificationSettingsRequest,
  UpdateProfileResponse,
  UpdateGeneralSettingsResponse,
  UpdatePrivacySettingsResponse,
  UpdateNotificationSettingsResponse,
  GetUserSettingsResponse
} from '@/lib/types/api/settings.api';

// Kullanıcı profil bilgilerini güncelleme
export async function updateProfileBusiness(
  userId: string,
  data: UpdateProfileRequest
): Promise<ApiResponse<UpdateProfileResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username değişikliği varsa benzersizlik kontrolü
    if (data.username && data.username !== user.username) {
      const existingUser = await findUserByUsernameDB(data.username);
      if (existingUser) {
        throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Görsel yükleme işlemleri
    let profilePictureUrl = user.profilePicture;
    let profileBannerUrl = user.profileBanner;

    if (data.profilePicture) {
      // Eski görseli sil
      if (user.profilePicture) {
        await UploadService.deleteUserImages(userId);
      }
      // Yeni görseli yükle
      const uploadResult = await UploadService.uploadUserImages(data.profilePicture, undefined, userId);
      profilePictureUrl = uploadResult.avatar?.secureUrl;
    }

    if (data.profileBanner) {
      // Eski banner'ı sil
      if (user.profileBanner) {
        await UploadService.deleteUserImages(userId);
      }
      // Yeni banner'ı yükle
      const uploadResult = await UploadService.uploadUserImages(undefined, data.profileBanner, userId);
      profileBannerUrl = uploadResult.banner?.secureUrl;
    }

    // Transaction ile güncelleme
    await prisma.$transaction(async (tx) => {
      const updateData: Prisma.UserUpdateInput = {
        bio: data.bio,
        profilePicture: profilePictureUrl,
        profileBanner: profileBannerUrl,
      };

      // Username değişikliği varsa
      if (data.username && data.username !== user.username) {
        const newSlug = createSlug(data.username);
        updateData.username = data.username;
        updateData.slug = newSlug;
        updateData.usernameChangedAt = new Date();
      }

      await updateUserDB({ id: userId }, updateData, tx);
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PROFILE_UPDATED,
      'Kullanıcı profil bilgileri güncellendi',
      { 
        userId,
        updatedFields: Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined)
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Profil bilgileri başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Profil güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Profil güncelleme başarısız');
  }
}

// Kullanıcı genel ayarlarını güncelleme
export async function updateGeneralSettingsBusiness(
  userId: string,
  data: UpdateGeneralSettingsRequest
): Promise<ApiResponse<UpdateGeneralSettingsResponse>> {
  try {
    // Kullanıcı ayarlarını bul veya oluştur
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      // Ayarlar yoksa oluştur
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        ...data
      });
    } else {
      // Mevcut ayarları güncelle
      await updateUserSettingsDB(
        { userId },
        data
      );
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.GENERAL_SETTINGS_UPDATED,
      'Kullanıcı genel ayarları güncellendi',
      { 
        userId,
        updatedFields: Object.keys(data)
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Genel ayarlar başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Genel ayarlar güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Genel ayarlar güncelleme başarısız');
  }
}

// Kullanıcı gizlilik ayarlarını güncelleme
export async function updatePrivacySettingsBusiness(
  userId: string,
  data: UpdatePrivacySettingsRequest
): Promise<ApiResponse<UpdatePrivacySettingsResponse>> {
  try {
    // Kullanıcı ayarlarını bul veya oluştur
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      // Ayarlar yoksa oluştur
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        ...data
      });
    } else {
      // Mevcut ayarları güncelle
      await updateUserSettingsDB(
        { userId },
        data
      );
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PRIVACY_SETTINGS_UPDATED,
      'Kullanıcı gizlilik ayarları güncellendi',
      { 
        userId,
        updatedFields: Object.keys(data)
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Gizlilik ayarları başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Gizlilik ayarları güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Gizlilik ayarları güncelleme başarısız');
  }
}

// Kullanıcı bildirim ayarlarını güncelleme
export async function updateNotificationSettingsBusiness(
  userId: string,
  data: UpdateNotificationSettingsRequest
): Promise<ApiResponse<UpdateNotificationSettingsResponse>> {
  try {
    // Kullanıcı ayarlarını bul veya oluştur
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      // Ayarlar yoksa oluştur
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        ...data
      });
    } else {
      // Mevcut ayarları güncelle
      await updateUserSettingsDB(
        { userId },
        data
      );
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.NOTIFICATION_SETTINGS_UPDATED,
      'Kullanıcı bildirim ayarları güncellendi',
      { 
        userId,
        updatedFields: Object.keys(data)
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Bildirim ayarları başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Bildirim ayarları güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Bildirim ayarları güncelleme başarısız');
  }
}

// Kullanıcı tüm ayarlarını getirme
export async function getUserSettingsBusiness(
  userId: string
): Promise<ApiResponse<GetUserSettingsResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Kullanıcı ayarlarını bul
    const userSettings = await findUserSettingsDB(userId);

    // Başarılı getirme logu
    await logger.info(
      EVENTS.USER.SETTINGS_RETRIEVED,
      'Kullanıcı ayarları görüntülendi',
      { userId },
      userId
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
          profileBanner: user.profileBanner,
          lastLoginAt: user.lastLoginAt,
          usernameChangedAt: user.usernameChangedAt,
          createdAt: user.createdAt,
        },
        settings: userSettings
      }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı ayarları getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Kullanıcı ayarları getirme başarısız');
  }
} 