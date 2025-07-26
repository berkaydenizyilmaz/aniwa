// UserAnimeTracking iş mantığı katmanı

import { BusinessError, DatabaseError } from '@/lib/errors';
import {
  createUserAnimeTracking as createUserAnimeTrackingDB,
  findUserAnimeTrackingByUserAndAnime,
  findUserAnimeTrackingByUserId,
  deleteUserAnimeTracking as deleteUserAnimeTrackingDB,
  countUserAnimeTracking,
} from '@/lib/services/db/userAnimeTracking.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  GetUserAnimeTrackingRequest,
  ToggleUserAnimeTrackingRequest,
  GetUserAnimeTrackingResponse,
  ToggleUserAnimeTrackingResponse,
} from '@/lib/types/api/userAnimeTracking.api';

// Kullanıcının anime takip kayıtlarını getirme
export async function getUserAnimeTrackingBusiness(
  userId: string,
  filters?: GetUserAnimeTrackingRequest
): Promise<ApiResponse<GetUserAnimeTrackingResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının anime takip kayıtlarını getir
    const trackingRecords = await findUserAnimeTrackingByUserId(userId, skip, limit);
    const total = await countUserAnimeTracking({ userId });
    const totalPages = Math.ceil(total / limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.ANIME_TRACKING_RETRIEVED,
      'Kullanıcı anime takip kayıtları görüntülendi',
      {
        userId,
        total,
        page,
        limit,
        totalPages,
      },
      userId
    );

    return {
      success: true,
      data: {
        trackingRecords,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı anime takip kayıtları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Anime takip kayıtları getirme başarısız');
  }
}

// Anime takip etme/çıkarma (toggle)
export async function toggleUserAnimeTrackingBusiness(
  userId: string,
  data: ToggleUserAnimeTrackingRequest
): Promise<ApiResponse<ToggleUserAnimeTrackingResponse>> {
  try {
    // Mevcut takip durumunu kontrol et
    const existingTracking = await findUserAnimeTrackingByUserAndAnime(
      userId,
      data.animeSeriesId
    );

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingTracking) {
        // Takip varsa çıkar
        const deletedTracking = await deleteUserAnimeTrackingDB(
          { userId_animeSeriesId: { userId, animeSeriesId: data.animeSeriesId } },
          tx
        );

        return { action: 'untracked' as const, tracking: deletedTracking };
      } else {
        // Takip yoksa ekle
        const newTracking = await createUserAnimeTrackingDB({
          user: { connect: { id: userId } },
          animeSeries: { connect: { id: data.animeSeriesId } },
        }, tx);

        return { action: 'tracked' as const, tracking: newTracking };
      }
    });

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.ANIME_TRACKING_TOGGLED,
      `Anime ${result.action === 'tracked' ? 'takip edildi' : 'takip çıkarıldı'}`,
      {
        action: result.action,
        userId,
        animeSeriesId: data.animeSeriesId,
      },
      userId
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime takip toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId: data.animeSeriesId,
      },
      userId
    );

    throw new BusinessError('Anime takip işlemi başarısız');
  }
}

// Takip durumu kontrolü
export async function checkTrackingStatusBusiness(
  userId: string,
  animeSeriesId: string
): Promise<ApiResponse<{ isTracking: boolean }>> {
  try {
    const tracking = await findUserAnimeTrackingByUserAndAnime(userId, animeSeriesId);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.ANIME_TRACKING_STATUS_CHECKED,
      'Anime takip durumu kontrol edildi',
      {
        userId,
        animeSeriesId,
        isTracking: !!tracking,
      },
      userId
    );

    return {
      success: true,
      data: { isTracking: !!tracking },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Takip durumu kontrolü sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId,
      },
      userId
    );

    throw new BusinessError('Takip durumu kontrolü başarısız');
  }
} 