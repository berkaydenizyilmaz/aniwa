// Notification settings iş mantığı katmanı

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
import { EVENTS_DOMAIN } from '@/lib/constants';
import { ApiResponse } from '@/lib/types/api';
import { UpdateNotificationSettingsResponse } from '@/lib/types/api/settings.api';

// Bildirim ayarları güncelleme (tek fonksiyon)
export async function updateNotificationSettingsBusiness(
  userId: string,
  notificationSettings: {
    receiveNotificationOnNewFollow: boolean;
    receiveNotificationOnEpisodeAiring: boolean;
    receiveNotificationOnNewMediaPart: boolean;
  }
): Promise<ApiResponse<UpdateNotificationSettingsResponse>> {
  try {
    let userSettings = await findUserSettingsDB(userId);
    
    if (!userSettings) {
      userSettings = await createUserSettingsDB({
        user: { connect: { id: userId } },
        ...notificationSettings
      });
    } else {
      await updateUserSettingsDB(
        { userId },
        notificationSettings
      );
    }

    await logger.info(
      EVENTS_DOMAIN.USER.NOTIFICATION_SETTINGS_UPDATED,
      'Kullanıcı bildirim ayarları güncellendi',
      { userId, settings: notificationSettings },
      userId
    );

    return {
      success: true,
      data: { message: 'Bildirim ayarları başarıyla güncellendi' }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Bildirim ayarları güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId }
    );
    
    throw new BusinessError('Bildirim ayarları güncelleme başarısız');
  }
}
