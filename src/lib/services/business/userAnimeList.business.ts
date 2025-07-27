// UserAnimeList iş mantığı katmanı

import { BusinessError, DatabaseError } from '@/lib/errors';
import {
  createUserAnimeListDB,
  findUserAnimeListByUserAndAnimeDB,
  findUserAnimeListsByUserIdDB,
  deleteUserAnimeListDB,
} from '@/lib/services/db/userAnimeList.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  AddAnimeToListRequest,
  GetUserAnimeListsRequest,
  AddAnimeToListResponse,
  GetUserAnimeListsResponse,
  RemoveAnimeFromListResponse,
  GetUserAnimeListByAnimeResponse,
} from '@/lib/types/api/userAnimeList.api';

// Anime'yi listeye ekle/çıkar (Toggle)
export async function toggleAnimeInListBusiness(
  userId: string,
  data: AddAnimeToListRequest
): Promise<ApiResponse<AddAnimeToListResponse | RemoveAnimeFromListResponse>> {
  try {
    // Anime zaten listede mi kontrolü
    const existingList = await findUserAnimeListByUserAndAnimeDB(userId, data.animeSeriesId);
    
    if (existingList) {
      // Anime listede varsa çıkar
      await prisma.$transaction(async (tx) => {
        await deleteUserAnimeListDB(
          { userId_animeSeriesId: { userId, animeSeriesId: data.animeSeriesId } },
          tx
        );
      });

      // Başarılı işlem logu
      await logger.info(
        EVENTS.USER.ANIME_REMOVED_FROM_LIST,
        'Anime listeden çıkarıldı',
        {
          userId,
          animeSeriesId: data.animeSeriesId,
          action: 'removed',
        },
        userId
      );

      return {
        success: true,
        data: undefined,
      };
    } else {
      // Anime listede yoksa ekle
      const result = await prisma.$transaction(async (tx) => {
        return await createUserAnimeListDB({
          user: { connect: { id: userId } },
          animeSeries: { connect: { id: data.animeSeriesId } },
          status: data.status || 'PLANNING',
          score: data.score,
          progressEpisodes: data.progressEpisodes,
          notes: data.notes,
          private: data.private || false,
        }, tx);
      });

      // Başarılı işlem logu
      await logger.info(
        EVENTS.USER.ANIME_ADDED_TO_LIST,
        'Anime listeye eklendi',
        {
          userId,
          animeSeriesId: data.animeSeriesId,
          status: data.status || 'PLANNING',
          action: 'added',
        },
        userId
      );

      return {
        success: true,
        data: result,
      };
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime listeye ekleme/çıkarma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId: data.animeSeriesId,
      },
      userId
    );

    throw new BusinessError('Anime listeye ekleme/çıkarma başarısız');
  }
}

// Kullanıcının anime listesini getirme
export async function getUserAnimeListsBusiness(
  userId: string,
  filters?: GetUserAnimeListsRequest
): Promise<ApiResponse<GetUserAnimeListsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının anime listesini getir
    const userAnimeLists = await findUserAnimeListsByUserIdDB(userId);

    const total = userAnimeLists.length;
    const totalPages = Math.ceil(total / limit);

    // Sayfalama
    const paginatedLists = userAnimeLists.slice(skip, skip + limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.ANIME_LIST_RETRIEVED,
      'Kullanıcı anime listesi görüntülendi',
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
        userAnimeLists: paginatedLists,
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
      'Kullanıcı anime listesi getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Kullanıcı anime listesi getirme başarısız');
  }
}

// Belirli bir anime'nin kullanıcı listesindeki durumunu getirme
export async function getUserAnimeListByAnimeBusiness(
  userId: string,
  animeSeriesId: string
): Promise<ApiResponse<GetUserAnimeListByAnimeResponse>> {
  try {
    const userAnimeList = await findUserAnimeListByUserAndAnimeDB(userId, animeSeriesId);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.ANIME_LIST_STATUS_CHECKED,
      'Anime liste durumu kontrol edildi',
      {
        userId,
        animeSeriesId,
        hasInList: !!userAnimeList,
      },
      userId
    );

    return {
      success: true,
      data: userAnimeList || null,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı anime listesi durumu getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId,
      },
      userId
    );

    throw new BusinessError('Kullanıcı anime listesi durumu getirme başarısız');
  }
} 