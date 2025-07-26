// UserAnimeList iş mantığı katmanı

import { BusinessError } from '@/lib/errors';
import {
  createUserAnimeList as createUserAnimeListDB,
  findUserAnimeListByUserAndAnime,
  findUserAnimeListsByUserId,
  deleteUserAnimeList as deleteUserAnimeListDB,
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
  data: AddAnimeToListRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<AddAnimeToListResponse | RemoveAnimeFromListResponse>> {
  try {
    // Anime zaten listede mi kontrolü
    const existingList = await findUserAnimeListByUserAndAnime(userId, data.animeSeriesId);
    
    if (existingList) {
      // Anime listede varsa çıkar
      await prisma.$transaction(async (tx) => {
        await deleteUserAnimeListDB(
          { userId_animeSeriesId: { userId, animeSeriesId: data.animeSeriesId } },
          tx
        );
      });

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

      return {
        success: true,
        data: result,
      };
    }
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Anime listeye ekleme/çıkarma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId: data.animeSeriesId,
        username: user.username,
      }
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
    const userAnimeLists = await findUserAnimeListsByUserId(userId);

    const total = userAnimeLists.length;
    const totalPages = Math.ceil(total / limit);

    // Sayfalama
    const paginatedLists = userAnimeLists.slice(skip, skip + limit);

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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı anime listesi getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Anime listesi getirme başarısız');
  }
}

// Belirli anime'nin liste durumunu getirme
export async function getUserAnimeListByAnimeBusiness(
  userId: string,
  animeSeriesId: string
): Promise<ApiResponse<GetUserAnimeListByAnimeResponse>> {
  try {
    // Anime'nin liste durumunu getir
    const userAnimeList = await findUserAnimeListByUserAndAnime(userId, animeSeriesId);

    return {
      success: true,
      data: userAnimeList,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Anime liste durumu getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId,
      }
    );

    throw new BusinessError('Anime liste durumu getirme başarısız');
  }
} 