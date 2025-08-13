// Privacy settings iş mantığı katmanı

import { 
  BusinessError, 
  DatabaseError
} from '@/lib/errors';
import { 
  findUserSettingsDB,
  updateUserSettingsDB,
  createUserSettingsDB
} from '@/lib/services/db/userProfileSettings.db';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { ProfileVisibility } from '@prisma/client';
import { 
  UpdateProfileVisibilityResponse,
  UpdateAllowFollowsResponse,
  UpdateShowAnimeListResponse,
  UpdateShowFavouriteAnimeSeriesResponse,
  UpdateShowCustomListsResponse
} from '@/lib/types/api/settings.api';

// Profil görünürlüğü güncelleme
export async function updateProfileVisibilityBusiness(
  userId: string,
  profileVisibility: ProfileVisibility
): Promise<ApiResponse<UpdateProfileVisibilityResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        profileVisibility
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { profileVisibility }
      );
    }

    await logger.info(
      EVENTS.USER.PROFILE_VISIBILITY_UPDATED,
      'Kullanıcı profil görünürlüğü güncellendi',
      { userId, visibility: profileVisibility },
      userId
    );

    return {
      success: true,
      data: { message: 'Profil görünürlüğü başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  allowFollows: boolean
): Promise<ApiResponse<UpdateAllowFollowsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        allowFollows
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { allowFollows }
      );
    }

    await logger.info(
      EVENTS.USER.ALLOW_FOLLOWS_UPDATED,
      'Kullanıcı takip izinleri güncellendi',
      { userId, allowFollows },
      userId
    );

    return {
      success: true,
      data: { message: 'Takip izinleri başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  showAnimeList: boolean
): Promise<ApiResponse<UpdateShowAnimeListResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showAnimeList
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showAnimeList }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_ANIME_LIST_UPDATED,
      'Kullanıcı anime listesi gösterme ayarı güncellendi',
      { userId, showAnimeList },
      userId
    );

    return {
      success: true,
      data: { message: 'Anime listesi gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  showFavouriteAnimeSeries: boolean
): Promise<ApiResponse<UpdateShowFavouriteAnimeSeriesResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showFavouriteAnimeSeries
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showFavouriteAnimeSeries }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_FAVOURITE_ANIME_UPDATED,
      'Kullanıcı favori animeleri gösterme ayarı güncellendi',
      { userId, showFavouriteAnimeSeries },
      userId
    );

    return {
      success: true,
      data: { message: 'Favori animeleri gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  showCustomLists: boolean
): Promise<ApiResponse<UpdateShowCustomListsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        showCustomLists
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { showCustomLists }
      );
    }

    await logger.info(
      EVENTS.USER.SHOW_CUSTOM_LISTS_UPDATED,
      'Kullanıcı özel listeleri gösterme ayarı güncellendi',
      { userId, showCustomLists },
      userId
    );

    return {
      success: true,
      data: { message: 'Özel listeleri gösterme ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
