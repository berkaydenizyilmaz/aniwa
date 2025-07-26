// FavouriteAnime iş mantığı katmanı

import { BusinessError } from '@/lib/errors';
import {
  findFavouriteAnimeSeriesByUserId,
  findFavouriteAnimeSeriesByUserAndAnime,
} from '@/lib/services/db/favouriteAnime.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  GetUserFavouriteAnimesRequest,
  ToggleFavouriteAnimeRequest,
  GetUserFavouriteAnimesResponse,
  ToggleFavouriteAnimeResponse,
} from '@/lib/types/api/favouriteAnime.api';

// Kullanıcının favori animelerini getirme
export async function getUserFavouriteAnimesBusiness(
  userId: string,
  filters?: GetUserFavouriteAnimesRequest
): Promise<ApiResponse<GetUserFavouriteAnimesResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının favori animelerini getir
    const favouriteAnimes = await findFavouriteAnimeSeriesByUserId(userId);
    
    const total = favouriteAnimes.length;
    const totalPages = Math.ceil(total / limit);

    // Sayfalama
    const paginatedFavourites = favouriteAnimes.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        favouriteAnimes: paginatedFavourites,
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
      'Kullanıcı favori animeleri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Favori animeler getirme başarısız');
  }
}

// Favori anime ekleme/çıkarma (toggle)
export async function toggleFavouriteAnimeBusiness(
  userId: string,
  data: ToggleFavouriteAnimeRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<ToggleFavouriteAnimeResponse>> {
  try {
    // Mevcut favori durumunu kontrol et
    const existingFavourite = await findFavouriteAnimeSeriesByUserAndAnime(
      userId,
      data.animeSeriesId
    );

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingFavourite) {
        // Favori varsa çıkar
        const deletedFavourite = await tx.favouriteAnimeSeries.delete({
          where: { id: existingFavourite.id },
        });

        return deletedFavourite;
      } else {
        // Favori yoksa ekle
        // Son sıra numarasını bul
        const lastOrder = await tx.favouriteAnimeSeries.findFirst({
          where: { userId },
          orderBy: { order: 'desc' },
          select: { order: true },
        });

        const newOrder = (lastOrder?.order || 0) + 1;

        const newFavourite = await tx.favouriteAnimeSeries.create({
          data: {
            userId,
            animeSeriesId: data.animeSeriesId,
            order: newOrder,
          },
        });

        return newFavourite;
      }
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Favori anime toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId: data.animeSeriesId,
        username: user.username,
      }
    );

    throw new BusinessError('Favori anime işlemi başarısız');
  }
} 