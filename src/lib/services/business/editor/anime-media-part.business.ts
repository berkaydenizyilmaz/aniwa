// Anime Media Part iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  DatabaseError,
  ConflictError
} from '@/lib/errors';
import { 
  createAnimeMediaPartDB, 
  findAnimeMediaPartByIdDB, 
  findAllAnimeMediaPartsDB,
  updateAnimeMediaPartDB, 
  deleteAnimeMediaPartDB,
  countAnimeMediaPartsDB,
} from '@/lib/services/db/mediaPart.db';
import { findAnimeSeriesByIdDB } from '@/lib/services/db/anime.db';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  deleteImageBusiness, 
  createImageUploadContext
} from '@/lib/services/business/shared/image.business';
import { findEpisodesByMediaPartIdDB } from '@/lib/services/db/episode.db';
import { 
  CreateAnimeMediaPartResponse, 
  GetAnimeMediaPartResponse, 
  GetAnimeMediaPartsResponse, 
  UpdateAnimeMediaPartResponse,
  CreateAnimeMediaPartRequest,
  UpdateAnimeMediaPartRequest,
  GetAnimeMediaPartsRequest,
} from '@/lib/types/api/anime.api';

// Anime medya parçası oluşturma
export async function createAnimeMediaPartBusiness(
  data: CreateAnimeMediaPartRequest & { coverImageFile?: File; bannerImageFile?: File },
  userId: string
): Promise<ApiResponse<CreateAnimeMediaPartResponse>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const animeSeries = await findAnimeSeriesByIdDB(data.seriesId);
    if (!animeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }
    
    // Display order benzersizlik kontrolü
    const existingMediaPart = await findAllAnimeMediaPartsDB(
      { seriesId: data.seriesId, displayOrder: data.displayOrder },
      0, 1
    );
    if (existingMediaPart.length > 0) {
      throw new ConflictError('Bu izleme sırası zaten kullanılıyor');
    }
    
    // Anime medya parçası oluştur
    const result = await createAnimeMediaPartDB({
      title: data.title,
      displayOrder: data.displayOrder,
      notes: data.notes,
      episodes: data.episodes,
      anilistId: data.anilistId,
      malId: data.malId,
      anilistAverageScore: data.anilistAverageScore,
      anilistPopularity: data.anilistPopularity,
      // İlişki
      series: { connect: { id: data.seriesId } },
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_CREATED,
      'Anime medya parçası başarıyla oluşturuldu',
      { 
        mediaPartId: result.id, 
        seriesId: result.seriesId,
        title: result.title,
        episodes: result.episodes,
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof BusinessError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime medya parçası oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', title: data.title },
      userId
    );
    
    throw new BusinessError('Anime medya parçası oluşturma başarısız');
  }
}

// Anime medya parçası getirme (ID ile)
export async function getAnimeMediaPartBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeMediaPartResponse>> {
  try {
    const mediaPart = await findAnimeMediaPartByIdDB(id);
    if (!mediaPart) {
      throw new NotFoundError('Anime medya parçası bulunamadı');
    }



    return {
      success: true,
      data: mediaPart
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof BusinessError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime medya parçası getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id },
      userId
    );
    
    throw new BusinessError('Anime medya parçası getirme başarısız');
  }
}

// Anime medya parçaları listesi (seri ID ile)
export async function getAnimeMediaPartListBusiness(
  seriesId: string,
  userId: string,
  filters?: GetAnimeMediaPartsRequest
): Promise<ApiResponse<GetAnimeMediaPartsResponse>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const animeSeries = await findAnimeSeriesByIdDB(seriesId);
    if (!animeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.AnimeMediaPartWhereInput = {
      seriesId: seriesId
    };
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Anime medya parçalarını getir
    const [mediaParts, total] = await Promise.all([
      findAllAnimeMediaPartsDB(where, skip, limit, { displayOrder: 'asc' }),
      countAnimeMediaPartsDB(where)
    ]);
    
    const totalPages = Math.ceil(total / limit);



    return {
      success: true,
      data: {
        mediaParts,
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof BusinessError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime medya parçaları listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', seriesId, filters },
      userId
    );
    
    throw new BusinessError('Anime medya parçaları listeleme başarısız');
  }
}

// Anime medya parçası güncelleme
export async function updateAnimeMediaPartBusiness(
  id: string, 
  data: UpdateAnimeMediaPartRequest & { coverImageFile?: File; bannerImageFile?: File },
  userId: string
): Promise<ApiResponse<UpdateAnimeMediaPartResponse>> {
  try {
    // Mevcut anime medya parçasını getir
    const existingMediaPart = await findAnimeMediaPartByIdDB(id);
    if (!existingMediaPart) {
      throw new NotFoundError('Anime medya parçası bulunamadı');
    }

    // Display order benzersizlik kontrolü (kendisi hariç)
    if (data.displayOrder !== existingMediaPart.displayOrder) {
      const duplicateMediaPart = await findAllAnimeMediaPartsDB(
        { seriesId: existingMediaPart.seriesId, displayOrder: data.displayOrder },
        0, 1
      );
      if (duplicateMediaPart.length > 0) {
        throw new ConflictError('Bu izleme sırası zaten kullanılıyor');
      }
    }

    // Anime medya parçası güncelle
    const result = await updateAnimeMediaPartDB({ id }, {
      title: data.title,
      displayOrder: data.displayOrder,
      notes: data.notes,
      episodes: data.episodes,
      anilistId: data.anilistId,
      malId: data.malId,
      anilistAverageScore: data.anilistAverageScore,
      anilistPopularity: data.anilistPopularity,
    });

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_UPDATED,
      'Anime medya parçası başarıyla güncellendi',
      { 
        mediaPartId: result.id, 
        seriesId: result.seriesId,
        title: result.title,
        episodes: result.episodes,
        oldTitle: existingMediaPart.title,
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof BusinessError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime medya parçası güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id, data },
      userId
    );
    
    throw new BusinessError('Anime medya parçası güncelleme başarısız');
  }
}

// Anime medya parçası silme
export async function deleteAnimeMediaPartBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Anime medya parçası mevcut mu kontrolü
    const existingMediaPart = await findAnimeMediaPartByIdDB(id);
    if (!existingMediaPart) {
      throw new NotFoundError('Anime medya parçası bulunamadı');
    }

    // Önce media part'a ait episode thumbnail'larını sil
    try {
      const episodes = await findEpisodesByMediaPartIdDB(id);
      
      const imagePromises = [];
      for (const episode of episodes) {
        if (episode.thumbnailImage) {
          imagePromises.push(
            deleteImageBusiness(
              createImageUploadContext('episode-thumbnail', episode.id, userId),
              userId,
              episode.thumbnailImage
            ).catch(error => {
              logger.warn(
                EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
                'Media part silme sırasında episode thumbnail silinemedi',
                { 
                  mediaPartId: id,
                  episodeId: episode.id,
                  thumbnailImage: episode.thumbnailImage,
                  error: error instanceof Error ? error.message : 'Bilinmeyen hata'
                },
                userId
              );
            })
          );
        }
      }
      
      // Tüm thumbnail'ların silinmesini bekle (hata olsa bile devam et)
      await Promise.allSettled(imagePromises);
      
    } catch (error) {
      // Episode cleanup hatası media part silmeyi engellemesin
      await logger.warn(
        EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
        'Media part silme sırasında episode thumbnail cleanup hatası',
        { 
          mediaPartId: id,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        },
        userId
      );
    }

    // Media part'ı sil (Prisma cascade delete ile episode'lar da silinir)
    await deleteAnimeMediaPartDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_DELETED,
      'Anime medya parçası başarıyla silindi',
      { 
        mediaPartId: existingMediaPart.id, 
        seriesId: existingMediaPart.seriesId,
        title: existingMediaPart.title,
        episodes: existingMediaPart.episodes
      },
      userId
    );

    return { success: true };
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof BusinessError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime medya parçası silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id },
      userId
    );
    
    throw new BusinessError('Anime medya parçası silme başarısız');
  }
}