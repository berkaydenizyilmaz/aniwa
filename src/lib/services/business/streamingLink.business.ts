// Streaming link iş mantığı katmanı

import { BusinessError, DatabaseError } from '@/lib/errors';
import {
  findAllStreamingLinksDB,
  countStreamingLinksDB,
  createStreamingLinkDB,
} from '@/lib/services/db/streamingLink.db';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  GetStreamingLinksRequest,
  UpdateStreamingLinksRequest,
  GetAllStreamingLinksResponse,
  UpdateStreamingLinksResponse,
} from '@/lib/types/api/streamingLink.api';

// Anime serisi streaming linklerini güncelleme
export async function updateAnimeStreamingLinksBusiness(
  animeSeriesId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Yeni linkleri oluştur
    const createdLinks = [];
    for (const linkData of data.links) {
      const link = await createStreamingLinkDB({
        url: linkData.url,
        animeSeries: { connect: { id: animeSeriesId } },
        platform: { connect: { id: linkData.platformId } },
      });
      createdLinks.push(link);
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Anime serisi streaming linkleri güncellendi',
      {
        animeSeriesId,
        linkCount: createdLinks.length
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Streaming linkleri başarıyla güncellendi', updatedCount: createdLinks.length },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId,
        data
      },
      userId
    );

    throw new BusinessError('Anime serisi streaming linkleri güncelleme başarısız');
  }
}

// Medya parçası streaming linklerini güncelleme
export async function updateMediaPartStreamingLinksBusiness(
  mediaPartId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Yeni linkleri oluştur
    const createdLinks = [];
    for (const linkData of data.links) {
      const link = await createStreamingLinkDB({
        url: linkData.url,
        animeMediaPart: { connect: { id: mediaPartId } },
        platform: { connect: { id: linkData.platformId } },
      });
      createdLinks.push(link);
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Medya parçası streaming linkleri güncellendi',
      {
        mediaPartId,
        linkCount: createdLinks.length
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Streaming linkleri başarıyla güncellendi', updatedCount: createdLinks.length },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Medya parçası streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        mediaPartId,
        data
      },
      userId
    );

    throw new BusinessError('Medya parçası streaming linkleri güncelleme başarısız');
  }
}

// Episode streaming linklerini güncelleme
export async function updateEpisodeStreamingLinksBusiness(
  episodeId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Yeni linkleri oluştur
    const createdLinks = [];
    for (const linkData of data.links) {
      const link = await createStreamingLinkDB({
        url: linkData.url,
        episode: { connect: { id: episodeId } },
        platform: { connect: { id: linkData.platformId } },
      });
      createdLinks.push(link);
    }

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Episode streaming linkleri güncellendi',
      {
        episodeId,
        linkCount: createdLinks.length
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Streaming linkleri başarıyla güncellendi', updatedCount: createdLinks.length },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Episode streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        episodeId,
        data
      },
      userId
    );

    throw new BusinessError('Episode streaming linkleri güncelleme başarısız');
  }
}

// Tüm streaming linklerini getirme
export async function getAllStreamingLinksBusiness(
  filters?: GetStreamingLinksRequest
): Promise<ApiResponse<GetAllStreamingLinksResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Linkleri getir
    const [links, total] = await Promise.all([
      findAllStreamingLinksDB({}, skip, limit, { createdAt: 'desc' }),
      countStreamingLinksDB({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        links,
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
      'Streaming linkleri listeleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters
      }
    );

    throw new BusinessError('Streaming linkleri listeleme başarısız');
  }
} 