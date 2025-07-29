// Anime Series iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createAnimeSeriesDB, 
  findAnimeSeriesByIdDB, 
  findAnimeSeriesByPublicIdDB, 
  findAllAnimeSeriesDB, 
  updateAnimeSeriesDB, 
  deleteAnimeSeriesDB,
  countAnimeSeriesDB,
} from '@/lib/services/db/anime.db';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  CreateAnimeSeriesResponse, 
  GetAnimeSeriesResponse, 
  GetAnimeSeriesListResponse, 
  UpdateAnimeSeriesResponse,
  CreateAnimeSeriesRequest,
  UpdateAnimeSeriesRequest,
  GetAnimeSeriesRequest,
} from '@/lib/types/api/anime.api';
import { UploadService } from '@/lib/services/extends-api/cloudinary/upload.service';

// =============================================================================
// ANIME SERIES CRUD FUNCTIONS
// =============================================================================

// Anime serisi oluşturma
export async function createAnimeSeriesBusiness(
  data: CreateAnimeSeriesRequest,
  userId: string,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ApiResponse<CreateAnimeSeriesResponse>> {
  try {
    // Resim yükleme işlemi
    let uploadResult;
    if (coverImage || bannerImage) {
      // Geçici ID ile resim yükle
      uploadResult = await UploadService.uploadAnimeImages(coverImage, bannerImage, 'temp');
    }

    // Anime serisi oluştur
    const result = await createAnimeSeriesDB({
      title: data.title,
      englishTitle: data.englishTitle,
      japaneseTitle: data.japaneseTitle,
      synopsis: data.synopsis,
      type: data.type,
      status: data.status,
      releaseDate: data.startDate,
      season: data.season,
      seasonYear: data.year,
      source: data.source,
      // Resim URL'leri
      coverImage: uploadResult?.coverImage?.secureUrl,
      bannerImage: uploadResult?.bannerImage?.secureUrl,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_CREATED,
      'Anime serisi başarıyla oluşturuldu',
      { 
        animeSeriesId: result.id, 
        aniwaPublicId: result.aniwaPublicId,
        title: result.title,
        type: result.type,
        status: result.status,
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
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', title: data.title },
      userId
    );
    
    throw new BusinessError('Anime serisi oluşturma başarısız');
  }
}

// Anime serisi getirme (ID ile)
export async function getAnimeSeriesBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesResponse>> {
  try {
    const animeSeries = await findAnimeSeriesByIdDB(id);
    if (!animeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_RETRIEVED,
      'Anime serisi başarıyla getirildi',
      { 
        animeSeriesId: animeSeries.id, 
        aniwaPublicId: animeSeries.aniwaPublicId,
        title: animeSeries.title,
        type: animeSeries.type,
        status: animeSeries.status
      },
      userId
    );

    return {
      success: true,
      data: animeSeries
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', animeSeriesId: id },
      userId
    );
    
    throw new BusinessError('Anime serisi getirme başarısız');
  }
}

// Anime serileri listesi (filtrelemeli)
export async function getAnimeSeriesListBusiness(
  userId: string,
  filters?: GetAnimeSeriesRequest
): Promise<ApiResponse<GetAnimeSeriesListResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.AnimeSeriesWhereInput = {};
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { englishTitle: { contains: filters.search, mode: 'insensitive' } },
        { japaneseTitle: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    if (filters?.type) {
      where.type = filters.type;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.season) {
      where.season = filters.season;
    }
    
    if (filters?.year) {
      where.seasonYear = filters.year;
    }
    
    if (filters?.source) {
      where.source = filters.source;
    }

    // Anime serilerini getir
    const [animeSeries, total] = await Promise.all([
      findAllAnimeSeriesDB(where, skip, limit, { createdAt: 'desc' }),
      countAnimeSeriesDB(where)
    ]);
    
    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_LIST_RETRIEVED,
      'Anime serileri listelendi',
      { 
        filters,
        total,
        page,
        limit
      },
      userId
    );

    return {
      success: true,
      data: {
        animeSeries,
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serileri listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Anime serileri listeleme başarısız');
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesBusiness(
  id: string, 
  data: UpdateAnimeSeriesRequest,
  userId: string,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ApiResponse<UpdateAnimeSeriesResponse>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const existingAnimeSeries = await findAnimeSeriesByIdDB(id);
    if (!existingAnimeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Resim yükleme işlemi
    let uploadResult;
    if (coverImage || bannerImage) {
      uploadResult = await UploadService.uploadAnimeImages(coverImage, bannerImage, id);
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.AnimeSeriesUpdateInput = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.englishTitle !== undefined) updateData.englishTitle = data.englishTitle;
    if (data.japaneseTitle !== undefined) updateData.japaneseTitle = data.japaneseTitle;
    if (data.synopsis !== undefined) updateData.synopsis = data.synopsis;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startDate !== undefined) updateData.releaseDate = data.startDate;
    if (data.endDate !== undefined) updateData.releaseDate = data.endDate; // Tek tarih alanı var
    if (data.season !== undefined) updateData.season = data.season;
    if (data.year !== undefined) updateData.seasonYear = data.year;
    if (data.source !== undefined) updateData.source = data.source;

    // Resim URL'leri güncelle
    if (uploadResult?.coverImage) {
      updateData.coverImage = uploadResult.coverImage.secureUrl;
    }
    if (uploadResult?.bannerImage) {
      updateData.bannerImage = uploadResult.bannerImage.secureUrl;
    }

    // Anime serisi güncelle
    const result = await updateAnimeSeriesDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_UPDATED,
      'Anime serisi başarıyla güncellendi',
      { 
        animeSeriesId: result.id, 
        aniwaPublicId: result.aniwaPublicId,
        title: result.title,
        type: result.type,
        status: result.status,
        oldTitle: existingAnimeSeries.title,
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
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', animeSeriesId: id, data },
      userId
    );
    
    throw new BusinessError('Anime serisi güncelleme başarısız');
  }
}

// Anime serisi silme
export async function deleteAnimeSeriesBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const existingAnimeSeries = await findAnimeSeriesByIdDB(id);
    if (!existingAnimeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Anime serisi sil
    await deleteAnimeSeriesDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_DELETED,
      'Anime serisi başarıyla silindi',
      { 
        animeSeriesId: existingAnimeSeries.id, 
        aniwaPublicId: existingAnimeSeries.aniwaPublicId,
        title: existingAnimeSeries.title,
        type: existingAnimeSeries.type,
        status: existingAnimeSeries.status
      },
      userId
    );

    return { success: true };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', animeSeriesId: id },
      userId
    );
    
    throw new BusinessError('Anime serisi silme başarısız');
  }
} 