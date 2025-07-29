// Anime Media Part iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createAnimeMediaPartDB, 
  findAnimeMediaPartByIdDB, 
  findAllAnimeMediaPartsDB, 
  updateAnimeMediaPartDB, 
  deleteAnimeMediaPartDB,
  countAnimeMediaPartsDB,
} from '@/lib/services/db/mediaPart.db';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  CreateAnimeMediaPartResponse, 
  GetAnimeMediaPartResponse, 
  GetAnimeMediaPartsResponse, 
  UpdateAnimeMediaPartResponse,
  CreateAnimeMediaPartRequest,
  UpdateAnimeMediaPartRequest,
} from '@/lib/types/api/anime.api';
import { UploadService } from '@/lib/services/extends-api/cloudinary/upload.service';

// =============================================================================
// ANIME MEDIA PART CRUD FUNCTIONS
// =============================================================================

// Anime media part oluşturma
export async function createAnimeMediaPartBusiness(
  data: CreateAnimeMediaPartRequest,
  userId: string,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ApiResponse<CreateAnimeMediaPartResponse>> {
  try {
    // Resim yükleme işlemi
    let uploadResult;
    if (coverImage || bannerImage) {
      uploadResult = await UploadService.uploadAnimeImages(coverImage, bannerImage, 'temp');
    }

    // Anime media part oluştur
    const result = await createAnimeMediaPartDB({
      seriesId: data.seriesId,
      title: data.title,
      englishTitle: data.englishTitle,
      japaneseTitle: data.japaneseTitle,
      notes: data.notes,
      anilistId: data.anilistId,
      malId: data.malId,
      anilistAverageScore: data.anilistAverageScore,
      anilistPopularity: data.anilistPopularity,
      averageScore: data.averageScore,
      popularity: data.popularity,
      // Resim URL'leri
      coverImage: uploadResult?.coverImage?.secureUrl,
      bannerImage: uploadResult?.bannerImage?.secureUrl,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_CREATED,
      'Anime media part başarıyla oluşturuldu',
      { 
        mediaPartId: result.id, 
        seriesId: result.seriesId,
        title: result.title,
        anilistId: result.anilistId,
        malId: result.malId,
        hasCoverImage: !!uploadResult?.coverImage,
        hasBannerImage: !!uploadResult?.bannerImage
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime media part oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', title: data.title },
      userId
    );
    
    throw new BusinessError('Anime media part oluşturma başarısız');
  }
}

// Anime media part getirme (ID ile)
export async function getAnimeMediaPartBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeMediaPartResponse>> {
  try {
    const mediaPart = await findAnimeMediaPartByIdDB(id);
    if (!mediaPart) {
      throw new NotFoundError('Anime media part bulunamadı');
    }

    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_RETRIEVED,
      'Anime media part başarıyla getirildi',
      { 
        mediaPartId: mediaPart.id, 
        seriesId: mediaPart.seriesId,
        title: mediaPart.title,
        anilistId: mediaPart.anilistId,
        malId: mediaPart.malId
      },
      userId
    );

    return {
      success: true,
      data: mediaPart
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }

    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime media part getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id },
      userId
    );
    
    throw new BusinessError('Anime media part getirme başarısız');
  }
}

// Anime media part güncelleme
export async function updateAnimeMediaPartBusiness(
  id: string, 
  data: UpdateAnimeMediaPartRequest,
  userId: string,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ApiResponse<UpdateAnimeMediaPartResponse>> {
  try {
    // Anime media part mevcut mu kontrolü
    const existingMediaPart = await findAnimeMediaPartByIdDB(id);
    if (!existingMediaPart) {
      throw new NotFoundError('Anime media part bulunamadı');
    }

    // Resim yükleme işlemi
    let uploadResult;
    if (coverImage || bannerImage) {
      uploadResult = await UploadService.uploadAnimeImages(coverImage, bannerImage, id);
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.AnimeMediaPartUpdateInput = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.englishTitle !== undefined) updateData.englishTitle = data.englishTitle;
    if (data.japaneseTitle !== undefined) updateData.japaneseTitle = data.japaneseTitle;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.anilistId !== undefined) updateData.anilistId = data.anilistId;
    if (data.malId !== undefined) updateData.malId = data.malId;
    if (data.anilistAverageScore !== undefined) updateData.anilistAverageScore = data.anilistAverageScore;
    if (data.anilistPopularity !== undefined) updateData.anilistPopularity = data.anilistPopularity;
    if (data.averageScore !== undefined) updateData.averageScore = data.averageScore;
    if (data.popularity !== undefined) updateData.popularity = data.popularity;

    // Resim URL'leri güncelle
    if (uploadResult?.coverImage) {
      updateData.coverImage = uploadResult.coverImage.secureUrl;
    }
    if (uploadResult?.bannerImage) {
      updateData.bannerImage = uploadResult.bannerImage.secureUrl;
    }

    // Anime media part güncelle
    const result = await updateAnimeMediaPartDB({ id }, updateData);

    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_UPDATED,
      'Anime media part başarıyla güncellendi',
      { 
        mediaPartId: result.id, 
        seriesId: result.seriesId,
        title: result.title,
        oldTitle: existingMediaPart.title,
        hasNewCoverImage: !!uploadResult?.coverImage,
        hasNewBannerImage: !!uploadResult?.bannerImage
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime media part güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id, data },
      userId
    );
    
    throw new BusinessError('Anime media part güncelleme başarısız');
  }
}

// Anime media part silme
export async function deleteAnimeMediaPartBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Anime media part mevcut mu kontrolü
    const existingMediaPart = await findAnimeMediaPartByIdDB(id);
    if (!existingMediaPart) {
      throw new NotFoundError('Anime media part bulunamadı');
    }

    // Anime media part sil
    await deleteAnimeMediaPartDB({ id });

    await logger.info(
      EVENTS.EDITOR.ANIME_MEDIA_PART_DELETED,
      'Anime media part başarıyla silindi',
      { 
        mediaPartId: existingMediaPart.id, 
        seriesId: existingMediaPart.seriesId,
        title: existingMediaPart.title,
        anilistId: existingMediaPart.anilistId,
        malId: existingMediaPart.malId
      },
      userId
    );

    return { success: true };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime media part silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', mediaPartId: id },
      userId
    );
    
    throw new BusinessError('Anime media part silme başarısız');
  }
}