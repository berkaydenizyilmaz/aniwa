// Streaming iş mantığı katmanı

import { BusinessError, NotFoundError } from '@/lib/errors';
import {
  createStreamingPlatform as createStreamingPlatformDB,
  findStreamingPlatformById,
  findAllStreamingPlatforms,
  countStreamingPlatforms,
  updateStreamingPlatform as updateStreamingPlatformDB,
  deleteStreamingPlatform as deleteStreamingPlatformDB,
  findAllStreamingLinks,
  countStreamingLinks,
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
  adminUser: { id: string; username: string }
): Promise<ApiResponse<CreateStreamingPlatformResponse>> {
  try {
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
        name: result.name,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
    );

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
      'Streaming platform oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        name: data.name,
        adminId: adminUser.id,
      }
    );

    throw new BusinessError('Streaming platform oluşturma başarısız');
  }
}

// Streaming platform detayı getirme
export async function getStreamingPlatformBusiness(
  id: string,
  adminUser: { id: string; username: string }
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
        name: platform.name,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
    );

    return {
      success: true,
      data: platform,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Streaming platform detay getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id,
        adminId: adminUser.id,
      }
    );

    throw new BusinessError('Streaming platform detay getirme başarısız');
  }
}

// Tüm streaming platformları getirme
export async function getStreamingPlatformsBusiness(
  adminUser: { id: string; username: string },
  filters?: GetStreamingPlatformsRequest
): Promise<ApiResponse<GetAllStreamingPlatformsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.StreamingPlatformWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { baseUrl: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Sıralama
    const orderBy: Prisma.StreamingPlatformOrderByWithRelationInput = {
      name: 'asc',
    };

    // Platformları getir
    const [platforms, total] = await Promise.all([
      findAllStreamingPlatforms(where, skip, limit, orderBy),
      countStreamingPlatforms(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORMS_RETRIEVED,
      'Streaming platformları listelendi',
      {
        totalCount: total,
        page,
        limit,
        filters,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Streaming platform listeleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters,
      }
    );

    throw new BusinessError('Streaming platform listeleme başarısız');
  }
}

// Streaming platform güncelleme
export async function updateStreamingPlatformBusiness(
  id: string,
  data: UpdateStreamingPlatformRequest,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<UpdateStreamingPlatformResponse>> {
  try {
    // Platform'un var olup olmadığını kontrol et
    const existingPlatform = await findStreamingPlatformById(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.StreamingPlatformUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.baseUrl !== undefined) updateData.baseUrl = data.baseUrl;

    // Platform'u güncelle
    const result = await updateStreamingPlatformDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_UPDATED,
      'Streaming platform başarıyla güncellendi',
      {
        platformId: result.id,
        name: result.name,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
    );

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
      'Streaming platform güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id,
        adminId: adminUser.id,
      }
    );

    throw new BusinessError('Streaming platform güncelleme başarısız');
  }
}

// Streaming platform silme
export async function deleteStreamingPlatformBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Platform'un var olup olmadığını kontrol et
    const existingPlatform = await findStreamingPlatformById(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Platform'u sil
    await deleteStreamingPlatformDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.STREAMING_PLATFORM_DELETED,
      'Streaming platform başarıyla silindi',
      {
        platformId: id,
        name: existingPlatform.name,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
    );

    return {
      success: true,
      data: { message: 'Streaming platform başarıyla silindi' },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Streaming platform silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id,
        adminId: adminUser.id,
      }
    );

    throw new BusinessError('Streaming platform silme başarısız');
  }
}

// =============================================================================
// STREAMING LINK BUSINESS LOGIC
// =============================================================================

// Anime serisi streaming linklerini güncelleme
export async function updateAnimeStreamingLinks(
  animeSeriesId: string,
  data: UpdateStreamingLinksRequest,
  user: { id: string; username: string; role: string }
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Transaction ile toplu güncelleme
    const result = await prisma.$transaction(async (tx) => {
      // Mevcut linkleri sil
      await tx.streamingLink.deleteMany({
        where: { animeSeriesId }
      });

      // Yeni linkleri oluştur
      if (data.links.length > 0) {
        await tx.streamingLink.createMany({
          data: data.links.map(link => ({
            platformId: link.platformId,
            url: link.url,
            animeSeriesId,
          }))
        });
      }

      return data.links.length;
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Anime streaming linkleri başarıyla güncellendi',
      {
        animeSeriesId,
        linkCount: result,
        userId: user.id,
        username: user.username,
        userRole: user.role,
      }
    );

    return {
      success: true,
      data: {
        message: 'Streaming linkleri başarıyla güncellendi',
        updatedCount: result,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Anime streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId,
        userId: user.id,
      }
    );

    throw new BusinessError('Streaming linkleri güncelleme başarısız');
  }
}

// Medya parçası streaming linklerini güncelleme
export async function updateMediaPartStreamingLinks(
  mediaPartId: string,
  data: UpdateStreamingLinksRequest,
  user: { id: string; username: string; role: string }
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Transaction ile toplu güncelleme
    const result = await prisma.$transaction(async (tx) => {
      // Mevcut linkleri sil
      await tx.streamingLink.deleteMany({
        where: { animeMediaPartId: mediaPartId }
      });

      // Yeni linkleri oluştur
      if (data.links.length > 0) {
        await tx.streamingLink.createMany({
          data: data.links.map(link => ({
            platformId: link.platformId,
            url: link.url,
            animeMediaPartId: mediaPartId,
          }))
        });
      }

      return data.links.length;
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Medya parçası streaming linkleri başarıyla güncellendi',
      {
        mediaPartId,
        linkCount: result,
        userId: user.id,
        username: user.username,
        userRole: user.role,
      }
    );

    return {
      success: true,
      data: {
        message: 'Streaming linkleri başarıyla güncellendi',
        updatedCount: result,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Medya parçası streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        mediaPartId,
        userId: user.id,
      }
    );

    throw new BusinessError('Streaming linkleri güncelleme başarısız');
  }
}

// Bölüm streaming linklerini güncelleme
export async function updateEpisodeStreamingLinks(
  episodeId: string,
  data: UpdateStreamingLinksRequest,
  user: { id: string; username: string; role: string }
): Promise<ApiResponse<UpdateStreamingLinksResponse>> {
  try {
    // Transaction ile toplu güncelleme
    const result = await prisma.$transaction(async (tx) => {
      // Mevcut linkleri sil
      await tx.streamingLink.deleteMany({
        where: { episodeId }
      });

      // Yeni linkleri oluştur
      if (data.links.length > 0) {
        await tx.streamingLink.createMany({
          data: data.links.map(link => ({
            platformId: link.platformId,
            url: link.url,
            episodeId,
          }))
        });
      }

      return data.links.length;
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_UPDATED,
      'Bölüm streaming linkleri başarıyla güncellendi',
      {
        episodeId,
        linkCount: result,
        userId: user.id,
        username: user.username,
        userRole: user.role,
      }
    );

    return {
      success: true,
      data: {
        message: 'Streaming linkleri başarıyla güncellendi',
        updatedCount: result,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Bölüm streaming linkleri güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        episodeId,
        userId: user.id,
      }
    );

    throw new BusinessError('Streaming linkleri güncelleme başarısız');
  }
}

// Tüm streaming linkleri getirme (filtrelemeli)
export async function getAllStreamingLinks(
  filters?: GetStreamingLinksRequest
): Promise<ApiResponse<GetAllStreamingLinksResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.StreamingLinkWhereInput = {};

    if (filters?.platformId) {
      where.platformId = filters.platformId;
    }

    if (filters?.animeSeriesId) {
      where.animeSeriesId = filters.animeSeriesId;
    }

    if (filters?.animeMediaPartId) {
      where.animeMediaPartId = filters.animeMediaPartId;
    }

    if (filters?.episodeId) {
      where.episodeId = filters.episodeId;
    }

    // Sıralama
    const orderBy: Prisma.StreamingLinkOrderByWithRelationInput = {
      createdAt: 'desc',
    };

    // Linkleri getir
    const [links, total] = await Promise.all([
      findAllStreamingLinks(where, skip, limit, orderBy),
      countStreamingLinks(where),
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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Streaming link listeleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters,
      }
    );

    throw new BusinessError('Streaming link listeleme başarısız');
  }
} 