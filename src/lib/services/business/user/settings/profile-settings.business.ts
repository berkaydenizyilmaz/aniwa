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
import { 
  uploadImageBusiness, 
  deleteImageBusiness, 
  getImageUrlsBusiness,
  createImageUploadContext
} from '@/lib/services/business/shared/image.business';
import { ImageUrlsResult } from '@/lib/types/image';

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

// Profil resmi yükleme
export async function uploadUserProfileImageBusiness(
  userId: string,
  file: File,
  imageType: 'profile' | 'banner'
): Promise<ApiResponse<{ secureUrl: string }>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Eski görsel URL'sini al
    const oldImageUrl = imageType === 'profile' ? user.profilePicture : user.profileBanner;
    
    // Generic image upload business'ı kullan
    const uploadResult = await uploadImageBusiness(
      createImageUploadContext(
        imageType === 'profile' ? 'user-profile' : 'user-banner',
        userId,
        userId
      ),
      file,
      userId,
      {
        deleteOld: true,
        oldImageUrl
      }
    );

    if (!uploadResult.success || !uploadResult.data) {
      throw new BusinessError(uploadResult.error || 'Görsel yükleme başarısız oldu');
    }

    // Database'i güncelle
    const updateData = imageType === 'profile' 
      ? { profilePicture: uploadResult.data.secureUrl }
      : { profileBanner: uploadResult.data.secureUrl };

    await updateUserDB({ id: userId }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.USER.PROFILE_IMAGES_UPDATED,
      `Kullanıcı ${imageType === 'profile' ? 'profil resmi' : 'banner'} güncellendi`,
      { 
        userId, 
        imageType,
        secureUrl: uploadResult.data.secureUrl,
        fileSize: uploadResult.data.bytes,
        dimensions: `${uploadResult.data.width}x${uploadResult.data.height}`
      },
      userId
    );

    return {
      success: true,
      data: { secureUrl: uploadResult.data.secureUrl }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      `Kullanıcı ${imageType === 'profile' ? 'profil resmi' : 'banner'} yükleme sırasında beklenmedik hata`,
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId, imageType }
    );
    
    throw new BusinessError(`${imageType === 'profile' ? 'Profil resmi' : 'Banner'} yükleme başarısız`);
  }
}

// Profil görseli silme
export async function deleteUserProfileImageBusiness(
  userId: string,
  imageType: 'profile' | 'banner'
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Mevcut görsel URL'sini al
    const currentImageUrl = imageType === 'profile' ? user.profilePicture : user.profileBanner;
    
    if (!currentImageUrl) {
      return {
        success: true,
        data: { deleted: false }
      };
    }

    // Generic image delete business'ı kullan
    const deleteResult = await deleteImageBusiness(
      createImageUploadContext(
        imageType === 'profile' ? 'user-profile' : 'user-banner',
        userId,
        userId
      ),
      userId,
      currentImageUrl
    );

    if (!deleteResult.success) {
      throw new BusinessError(deleteResult.error || 'Görsel silme başarısız oldu');
    }

    // Database'i güncelle
    const updateData = imageType === 'profile' 
      ? { profilePicture: null }
      : { profileBanner: null };

    await updateUserDB({ id: userId }, updateData);

    // Başarılı silme logu
    await logger.info(
      EVENTS.USER.PROFILE_IMAGES_UPDATED,
      `Kullanıcı ${imageType === 'profile' ? 'profil resmi' : 'banner'} silindi`,
      { userId, imageType },
      userId
    );

    return {
      success: true,
      data: { deleted: deleteResult.data?.deleted || false }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      `Kullanıcı ${imageType === 'profile' ? 'profil resmi' : 'banner'} silme sırasında beklenmedik hata`,
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId, imageType }
    );
    
    throw new BusinessError(`${imageType === 'profile' ? 'Profil resmi' : 'Banner'} silme başarısız`);
  }
}

// Profil görsel URL'lerini getir
export async function getUserImageUrlsBusiness(
  userId: string
): Promise<ApiResponse<{
  profilePicture: ImageUrlsResult | null;
  profileBanner: ImageUrlsResult | null;
}>> {
  try {
    // Kullanıcı profilini bul
    const user = await findUserProfileDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    let profilePictureUrls = null;
    let profileBannerUrls = null;

    if (user.profilePicture) {
      const profilePictureResult = await getImageUrlsBusiness(user.profilePicture, 'user-profile', {
        includeThumbnail: true,
        includeResponsive: true,
        thumbnailSize: 100
      });
      profilePictureUrls = profilePictureResult.success ? profilePictureResult.data : null;
    }

    if (user.profileBanner) {
      const profileBannerResult = await getImageUrlsBusiness(user.profileBanner, 'user-banner', {
        includeThumbnail: true,
        includeResponsive: false,
        optimizedWidth: 1200,
        optimizedHeight: 300
      });
      profileBannerUrls = profileBannerResult.success ? profileBannerResult.data : null;
    }

    const result = {
      profilePicture: profilePictureUrls,
      profileBanner: profileBannerUrls
    };

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı görsel URL\'leri getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Kullanıcı görsel URL\'leri getirme başarısız');
  }
}

// Profil görselleri güncelleme (backward compatibility)
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
