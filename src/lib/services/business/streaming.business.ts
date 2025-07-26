// Streaming iş mantığı katmanı

import { BusinessError, NotFoundError, ConflictError, DatabaseError } from '@/lib/errors';
import {
  createStreamingPlatform as createStreamingPlatformDB,
  findStreamingPlatformById,
  findStreamingPlatformByName,
  findAllStreamingPlatforms,
  countStreamingPlatforms,
  updateStreamingPlatform as updateStreamingPlatformDB,
  deleteStreamingPlatform as deleteStreamingPlatformDB,
  findAllStreamingLinks,
  countStreamingLinks,
  createStreamingLink as createStreamingLinkDB,
} from '@/lib/services/db/streaming.db';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  CreateStreamingPlatformRequest,
  UpdateStreamingPlatformRequest,
  GetStreamingPlatformsRequest,
  GetStreamingLinksRequest,
  UpdateStreamingLinksRequest,
  CreateStreamingPlatformResponse,
  GetStreamingPlatformResponse,
  GetAllStreamingPlatformsResponse,
  UpdateStreamingPlatformResponse,
  GetAllStreamingLinksResponse,
  UpdateStreamingLinksResponse,
} from '@/lib/types/api/streaming.api';

// =============================================================================
// STREAMING PLATFORM BUSINESS LOGIC
// =============================================================================

// Streaming platform oluşturma
export async function createStreamingPlatformBusiness(
  data: CreateStreamingPlatformRequest,
  userId: string
): Promise<ApiResponse<CreateStreamingPlatformResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingPlatform = await findStreamingPlatformByName(data.name);
    if (existingPlatform) {
      throw new ConflictError('Bu platform adı zaten kullanımda');
    }

    // Platform oluştur
    const result = await createStreamingPlatformDB({
      name: data.name,
      baseUrl: data.baseUrl,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_CREATED,
      'Streaming platform başarıyla oluşturuldu',
      {
        platformId: result.id,
        name: result.name
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
      'Streaming platform oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        name: data.name
      },
      userId
    );

    throw new BusinessError('Streaming platform oluşturma başarısız');
  }
}

// Streaming platform detayı getirme
export async function getStreamingPlatformBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetStreamingPlatformResponse>> {
  try {
    const platform = await findStreamingPlatformById(id);

    if (!platform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_RETRIEVED,
      'Streaming platform detayı görüntülendi',
      {
        platformId: platform.id,
        name: platform.name
      },
      userId
    );

    return {
      success: true,
      data: platform,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Streaming platform getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id
      },
      userId
    );

    throw new BusinessError('Streaming platform getirme başarısız');
  }
}

// Tüm streaming platformları getirme
export async function getStreamingPlatformsBusiness(
  userId: string,
  filters?: GetStreamingPlatformsRequest
): Promise<ApiResponse<GetAllStreamingPlatformsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Platformları getir
    const [platforms, total] = await Promise.all([
      findAllStreamingPlatforms({}, skip, limit, { createdAt: 'desc' }),
      countStreamingPlatforms({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORMS_RETRIEVED,
      'Streaming platform listesi görüntülendi',
      {
        total,
        page,
        limit,
        totalPages
      },
      userId
    );

    return {
      success: true,
      data: {
        platforms,
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
      'Streaming platform listeleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters
      },
      userId
    );

    throw new BusinessError('Streaming platform listeleme başarısız');
  }
}

// Streaming platform güncelleme
export async function updateStreamingPlatformBusiness(
  id: string,
  data: UpdateStreamingPlatformRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingPlatformResponse>> {
  try {
    // Platform mevcut mu kontrolü
    const existingPlatform = await findStreamingPlatformById(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingPlatform.name) {
      const nameExists = await findStreamingPlatformByName(data.name);
      if (nameExists) {
        throw new ConflictError('Bu platform adı zaten kullanımda');
      }
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.StreamingPlatformUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.baseUrl !== undefined) updateData.baseUrl = data.baseUrl;

    // Platform güncelle
    const result = await updateStreamingPlatformDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_UPDATED,
      'Streaming platform başarıyla güncellendi',
      {
        platformId: result.id,
        name: result.name,
        oldName: existingPlatform.name
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
      'Streaming platform güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id,
        data
      },
      userId
    );

    throw new BusinessError('Streaming platform güncelleme başarısız');
  }
}

// Streaming platform silme
export async function deleteStreamingPlatformBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Platform mevcut mu kontrolü
    const existingPlatform = await findStreamingPlatformById(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Platform sil
    await deleteStreamingPlatformDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_DELETED,
      'Streaming platform başarıyla silindi',
      {
        platformId: id,
        name: existingPlatform.name
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Streaming platform başarıyla silindi' },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Streaming platform silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id
      },
      userId
    );

    throw new BusinessError('Streaming platform silme başarısız');
  }
}

// =============================================================================
// STREAMING LINKS BUSINESS LOGIC
// =============================================================================

// Anime serisi streaming linklerini güncelleme
export async function updateAnimeStreamingLinks(
  animeSeriesId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Mevcut linkleri sil
    await prisma.streamingLink.deleteMany({
      where: { animeSeriesId },
    });

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
export async function updateMediaPartStreamingLinks(
  mediaPartId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Mevcut linkleri sil
    await prisma.streamingLink.deleteMany({
      where: { animeMediaPartId: mediaPartId },
    });

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
export async function updateEpisodeStreamingLinks(
  episodeId: string,
  data: UpdateStreamingLinksRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Mevcut linkleri sil
    await prisma.streamingLink.deleteMany({
      where: { episodeId },
    });

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
export async function getAllStreamingLinks(
  filters?: GetStreamingLinksRequest
): Promise<ApiResponse<GetAllStreamingLinksResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Linkleri getir
    const [links, total] = await Promise.all([
      findAllStreamingLinks({}, skip, limit, { createdAt: 'desc' }),
      countStreamingLinks({}),
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