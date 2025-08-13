// Profile settings iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  ConflictError,
  DatabaseError
} from '@/lib/errors';
import { 
  findUserByIdDB,
  findUserByUsernameDB,
  updateUserDB,
  findUserProfileDB
} from '@/lib/services/db/user.db';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AUTH } from '@/lib/constants/auth.constants';
import { 
  GetUserProfileResponse,
  UpdateUsernameResponse,
  UpdateBioResponse,
  UpdatePasswordResponse,
  UpdateProfileImagesResponse
} from '@/lib/types/api/settings.api';

// Username güncelleme
export async function updateUsernameBusiness(
  userId: string,
  username: string
): Promise<ApiResponse<UpdateUsernameResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username değişikliği varsa benzersizlik kontrolü
    if (username !== user.username) {
      const existingUser = await findUserByUsernameDB(username);
      if (existingUser) {
        throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Transaction ile güncelleme
    await prisma.$transaction(async (tx) => {
      const newSlug = createSlug(username);
      await updateUserDB(
        { id: userId },
        {
          username,
          slug: newSlug,
          usernameChangedAt: new Date(),
        },
        tx
      );
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.USERNAME_UPDATED,
      'Kullanıcı adı güncellendi',
      { userId, newUsername: username },
      userId
    );

    return {
      success: true,
      data: { message: 'Kullanıcı adı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı adı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Kullanıcı adı güncelleme başarısız');
  }
}

// Bio güncelleme
export async function updateBioBusiness(
  userId: string,
  bio: string | null
): Promise<ApiResponse<UpdateBioResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Bio güncelleme
    await updateUserDB(
      { id: userId },
      { bio }
    );

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.BIO_UPDATED,
      'Kullanıcı biyografisi güncellendi',
      { userId },
      userId
    );

    return {
      success: true,
      data: { message: 'Biyografi başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Biyografi güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Biyografi güncelleme başarısız');
  }
}

// Parola güncelleme
export async function updatePasswordBusiness(
  userId: string,
  newPassword: string
): Promise<ApiResponse<UpdatePasswordResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Yeni parolayı hash'le ve kaydet
    const passwordHash = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS);
    await updateUserDB(
      { id: userId },
      { passwordHash }
    );
    
    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PASSWORD_UPDATED,
      'Kullanıcı parolası güncellendi',
      { userId },
      userId
    );

    return {
      success: true,
      data: { message: 'Parola başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Parola güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Parola güncelleme başarısız');
  }
}

// Profil görselleri güncelleme
export async function updateProfileImagesBusiness(
  userId: string,
  profilePicture?: string | null,
  profileBanner?: string | null
): Promise<ApiResponse<UpdateProfileImagesResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Güncelleme
    await updateUserDB(
      { id: userId },
      {
        profilePicture: profilePicture ?? user.profilePicture,
        profileBanner: profileBanner ?? user.profileBanner,
      }
    );

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PROFILE_IMAGES_UPDATED,
      'Kullanıcı profil görselleri güncellendi',
      { userId },
      userId
    );

    return {
      success: true,
      data: { message: 'Profil görselleri başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Profil görselleri güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Profil görselleri güncelleme başarısız');
  }
}

// Kullanıcı profilini getir
export async function getUserProfileBusiness(
  userId: string
): Promise<ApiResponse<GetUserProfileResponse>> {
  try {
    // Kullanıcı profilini bul
    const user = await findUserProfileDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.USER.SETTINGS_RETRIEVED,
      'Kullanıcı profili görüntülendi',
      { userId },
      userId
    );

    return {
      success: true,
      data: user
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı profili getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Kullanıcı profili getirme başarısız');
  }
}
