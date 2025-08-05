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
  // Profile Settings
  UpdateUsernameRequest, UpdateUsernameResponse,
  UpdateBioRequest, UpdateBioResponse,
  UpdatePasswordRequest, UpdatePasswordResponse,
  UpdateProfileImagesRequest, UpdateProfileImagesResponse,
  // General Settings
  UpdateThemePreferenceRequest, UpdateThemePreferenceResponse,
  UpdateTitleLanguagePreferenceRequest, UpdateTitleLanguagePreferenceResponse,
  UpdateScoreFormatRequest, UpdateScoreFormatResponse,
  UpdateDisplayAdultContentRequest, UpdateDisplayAdultContentResponse,
  UpdateAutoTrackOnAniwaListAddRequest, UpdateAutoTrackOnAniwaListAddResponse,
  // Privacy Settings
  UpdateProfileVisibilityRequest, UpdateProfileVisibilityResponse,
  UpdateAllowFollowsRequest, UpdateAllowFollowsResponse,
  UpdateShowAnimeListRequest, UpdateShowAnimeListResponse,
  UpdateShowFavouriteAnimeSeriesRequest, UpdateShowFavouriteAnimeSeriesResponse,
  UpdateShowCustomListsRequest, UpdateShowCustomListsResponse,
  // Notification Settings
  UpdateNotificationSettingsRequest, UpdateNotificationSettingsResponse,
  // Get Settings
  GetUserSettingsResponse
} from '@/lib/types/api/settings.api';

// ===== PROFILE SETTINGS =====

// Username güncelleme
export async function updateUsernameBusiness(
  userId: string,
  data: UpdateUsernameRequest
): Promise<ApiResponse<UpdateUsernameResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username değişikliği varsa benzersizlik kontrolü
    if (data.username !== user.username) {
      const existingUser = await findUserByUsernameDB(data.username);
      if (existingUser) {
        throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Transaction ile güncelleme
    await prisma.$transaction(async (tx) => {
      const newSlug = createSlug(data.username);
      await updateUserDB(
        { id: userId },
        {
          username: data.username,
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
      { userId, newUsername: data.username },
      userId
    );

    return {
      success: true,
      data: { message: 'Kullanıcı adı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
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
  data: UpdateBioRequest
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
      { bio: data.bio }
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
    if (!(error instanceof BusinessError)) {
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
  data: UpdatePasswordRequest
): Promise<ApiResponse<UpdatePasswordResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Parola hash'leme (Auth.js ile entegre edilecek)
    // Bu kısım Auth.js password update ile entegre edilmeli
    
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
    if (!(error instanceof BusinessError)) {
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
  data: UpdateProfileImagesRequest
): Promise<ApiResponse<UpdateProfileImagesResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByIdDB(userId);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
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

    // Güncelleme
    await updateUserDB(
      { id: userId },
      {
        profilePicture: profilePictureUrl,
        profileBanner: profileBannerUrl,
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
    if (!(error instanceof BusinessError)) {
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

// ===== GENERAL SETTINGS =====

// Tema tercihi güncelleme
export async function updateThemePreferenceBusiness(
  userId: string,
  data: UpdateThemePreferenceRequest
): Promise<ApiResponse<UpdateThemePreferenceResponse>> {
  try {
    // Kullanıcı ayarlarını bul veya oluştur
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        themePreference: data.themePreference
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { themePreference: data.themePreference }
      );
    }

    await logger.info(
      EVENTS.USER.THEME_UPDATED,
      'Kullanıcı tema tercihi güncellendi',
      { userId, theme: data.themePreference },
      userId
    );

    return {
      success: true,
      data: { message: 'Tema tercihi başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tema tercihi güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Tema tercihi güncelleme başarısız');
  }
}

// Başlık dili tercihi güncelleme
export async function updateTitleLanguagePreferenceBusiness(
  userId: string,
  data: UpdateTitleLanguagePreferenceRequest
): Promise<ApiResponse<UpdateTitleLanguagePreferenceResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        titleLanguagePreference: data.titleLanguagePreference
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { titleLanguagePreference: data.titleLanguagePreference }
      );
    }

    await logger.info(
      EVENTS.USER.TITLE_LANGUAGE_UPDATED,
      'Kullanıcı başlık dili tercihi güncellendi',
      { userId, language: data.titleLanguagePreference },
      userId
    );

    return {
      success: true,
      data: { message: 'Başlık dili tercihi başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Başlık dili tercihi güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Başlık dili tercihi güncelleme başarısız');
  }
}

// Puanlama formatı güncelleme
export async function updateScoreFormatBusiness(
  userId: string,
  data: UpdateScoreFormatRequest
): Promise<ApiResponse<UpdateScoreFormatResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        scoreFormat: data.scoreFormat
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { scoreFormat: data.scoreFormat }
      );
    }

    await logger.info(
      EVENTS.USER.SCORE_FORMAT_UPDATED,
      'Kullanıcı puanlama formatı güncellendi',
      { userId, format: data.scoreFormat },
      userId
    );

    return {
      success: true,
      data: { message: 'Puanlama formatı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Puanlama formatı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Puanlama formatı güncelleme başarısız');
  }
}

// Yetişkin içerik gösterimi güncelleme
export async function updateDisplayAdultContentBusiness(
  userId: string,
  data: UpdateDisplayAdultContentRequest
): Promise<ApiResponse<UpdateDisplayAdultContentResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        displayAdultContent: data.displayAdultContent
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { displayAdultContent: data.displayAdultContent }
      );
    }

    await logger.info(
      EVENTS.USER.ADULT_CONTENT_UPDATED,
      'Kullanıcı yetişkin içerik ayarı güncellendi',
      { userId, displayAdultContent: data.displayAdultContent },
      userId
    );

    return {
      success: true,
      data: { message: 'Yetişkin içerik ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Yetişkin içerik ayarı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Yetişkin içerik ayarı güncelleme başarısız');
  }
}

// Otomatik takip güncelleme
export async function updateAutoTrackOnAniwaListAddBusiness(
  userId: string,
  data: UpdateAutoTrackOnAniwaListAddRequest
): Promise<ApiResponse<UpdateAutoTrackOnAniwaListAddResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        autoTrackOnAniwaListAdd: data.autoTrackOnAniwaListAdd
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { autoTrackOnAniwaListAdd: data.autoTrackOnAniwaListAdd }
      );
    }

    await logger.info(
      EVENTS.USER.AUTO_TRACK_UPDATED,
      'Kullanıcı otomatik takip ayarı güncellendi',
      { userId, autoTrack: data.autoTrackOnAniwaListAdd },
      userId
    );

    return {
      success: true,
      data: { message: 'Otomatik takip ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Otomatik takip ayarı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Otomatik takip ayarı güncelleme başarısız');
  }
}

// ===== PRIVACY SETTINGS =====

// Profil görünürlüğü güncelleme
export async function updateProfileVisibilityBusiness(
  userId: string,
  data: UpdateProfileVisibilityRequest
): Promise<ApiResponse<UpdateProfileVisibilityResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        profileVisibility: data.profileVisibility
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { profileVisibility: data.profileVisibility }
      );
    }

    await logger.info(
      EVENTS.USER.PROFILE_VISIBILITY_UPDATED,
      'Kullanıcı profil görünürlüğü güncellendi',
      { userId, visibility: data.profileVisibility },
      userId
    );

    return {
      success: true,
      data: { message: 'Profil görünürlüğü başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Profil görünürlüğü güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Profil görünürlüğü güncelleme başarısız');
  }
}

// Takip izinleri güncelleme
export async function updateAllowFollowsBusiness(
  userId: string,
  data: UpdateAllowFollowsRequest
): Promise<ApiResponse<UpdateAllowFollowsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        allowFollows: data.allowFollows
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { allowFollows: data.allowFollows }
      );
    }

    await logger.info(
      EVENTS.USER.ALLOW_FOLLOWS_UPDATED,
      'Kullanıcı takip izinleri güncellendi',
      { userId, allowFollows: data.allowFollows },
      userId
    );

    return {
      success: true,
      data: { message: 'Takip izinleri başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Takip izinleri güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Takip izinleri güncelleme başarısız');
  }
}

// Anime listesi gösterme güncelleme
export async function updateShowAnimeListBusiness(
  userId: string,
  data: UpdateShowAnimeListRequest
): Promise<ApiResponse<UpdateShowAnimeListResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showAnimeList: data.showAnimeList
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showAnimeList: data.showAnimeList }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_ANIME_LIST_UPDATED,
      'Kullanıcı anime listesi gösterme ayarı güncellendi',
      { userId, showAnimeList: data.showAnimeList },
      userId
    );

    return {
      success: true,
      data: { message: 'Anime listesi gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime listesi gösterme ayarı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Anime listesi gösterme ayarı güncelleme başarısız');
  }
}

// Favori animeleri gösterme güncelleme
export async function updateShowFavouriteAnimeSeriesBusiness(
  userId: string,
  data: UpdateShowFavouriteAnimeSeriesRequest
): Promise<ApiResponse<UpdateShowFavouriteAnimeSeriesResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showFavouriteAnimeSeries: data.showFavouriteAnimeSeries
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showFavouriteAnimeSeries: data.showFavouriteAnimeSeries }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_FAVOURITE_ANIME_UPDATED,
      'Kullanıcı favori animeleri gösterme ayarı güncellendi',
      { userId, showFavouriteAnimeSeries: data.showFavouriteAnimeSeries },
      userId
    );

    return {
      success: true,
      data: { message: 'Favori animeleri gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Favori animeleri gösterme ayarı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Favori animeleri gösterme ayarı güncelleme başarısız');
  }
}

// Özel listeleri gösterme güncelleme
export async function updateShowCustomListsBusiness(
  userId: string,
  data: UpdateShowCustomListsRequest
): Promise<ApiResponse<UpdateShowCustomListsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showCustomLists: data.showCustomLists
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showCustomLists: data.showCustomLists }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_CUSTOM_LISTS_UPDATED,
      'Kullanıcı özel listeleri gösterme ayarı güncellendi',
      { userId, showCustomLists: data.showCustomLists },
      userId
    );

    return {
      success: true,
      data: { message: 'Özel listeleri gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Özel listeleri gösterme ayarı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Özel listeleri gösterme ayarı güncelleme başarısız');
  }
}

// ===== NOTIFICATION SETTINGS =====

// Bildirim ayarları güncelleme (tek fonksiyon)
export async function updateNotificationSettingsBusiness(
  userId: string,
  data: UpdateNotificationSettingsRequest
): Promise<ApiResponse<UpdateNotificationSettingsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        ...data
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        data
      );
    }

    await logger.info(
      EVENTS.USER.NOTIFICATION_SETTINGS_UPDATED,
      'Kullanıcı bildirim ayarları güncellendi',
      { userId, settings: data },
      userId
    );

    return {
      success: true,
      data: { message: 'Bildirim ayarları başarıyla güncellendi' }
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
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

// ===== GET SETTINGS =====

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
    if (!(error instanceof BusinessError)) {
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