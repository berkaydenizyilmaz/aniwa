// General settings iş mantığı katmanı

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
import { Theme, TitleLanguage, ScoreFormat } from '@prisma/client';
import { 
  GetUserSettingsResponse,
  UpdateThemePreferenceResponse,
  UpdateTitleLanguagePreferenceResponse,
  UpdateScoreFormatResponse,
  UpdateDisplayAdultContentResponse,
  UpdateAutoTrackOnAniwaListAddResponse
} from '@/lib/types/api/settings.api';

// Tema tercihi güncelleme
export async function updateThemePreferenceBusiness(
  userId: string,
  themePreference: Theme
): Promise<ApiResponse<UpdateThemePreferenceResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        themePreference
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { themePreference }
      );
    }

    await logger.info(
      EVENTS.USER.THEME_UPDATED,
      'Kullanıcı tema tercihi güncellendi',
      { userId, theme: themePreference },
      userId
    );

    return {
      success: true,
      data: { message: 'Tema tercihi başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  titleLanguagePreference: TitleLanguage
): Promise<ApiResponse<UpdateTitleLanguagePreferenceResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        titleLanguagePreference
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { titleLanguagePreference }
      );
    }

    await logger.info(
      EVENTS.USER.TITLE_LANGUAGE_UPDATED,
      'Kullanıcı başlık dili tercihi güncellendi',
      { userId, language: titleLanguagePreference },
      userId
    );

    return {
      success: true,
      data: { message: 'Başlık dili tercihi başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  scoreFormat: ScoreFormat
): Promise<ApiResponse<UpdateScoreFormatResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        scoreFormat
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { scoreFormat }
      );
    }

    await logger.info(
      EVENTS.USER.SCORE_FORMAT_UPDATED,
      'Kullanıcı puanlama formatı güncellendi',
      { userId, format: scoreFormat },
      userId
    );

    return {
      success: true,
      data: { message: 'Puanlama formatı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  displayAdultContent: boolean
): Promise<ApiResponse<UpdateDisplayAdultContentResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        displayAdultContent
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { displayAdultContent }
      );
    }

    await logger.info(
      EVENTS.USER.ADULT_CONTENT_UPDATED,
      'Kullanıcı yetişkin içerik ayarı güncellendi',
      { userId, displayAdultContent },
      userId
    );

    return {
      success: true,
      data: { message: 'Yetişkin içerik ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
  autoTrackOnAniwaListAdd: boolean
): Promise<ApiResponse<UpdateAutoTrackOnAniwaListAddResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        autoTrackOnAniwaListAdd
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        { autoTrackOnAniwaListAdd }
      );
    }

    await logger.info(
      EVENTS.USER.AUTO_TRACK_UPDATED,
      'Kullanıcı otomatik takip ayarı güncellendi',
      { userId, autoTrack: autoTrackOnAniwaListAdd },
      userId
    );

    return {
      success: true,
      data: { message: 'Otomatik takip ayarı başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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

// Kullanıcı ayarlarını getirme
export async function getUserSettingsBusiness(
  userId: string
): Promise<ApiResponse<GetUserSettingsResponse>> {
  try {
    // Kullanıcı ayarlarını bul
    const userSettings = await findUserSettingsDB(userId);



    return {
      success: true,
      data: userSettings
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
