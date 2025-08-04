// Anime Series iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createAnimeSeriesDB, 
  findAnimeSeriesByIdDB, 
  findAllAnimeSeriesDB, 
  updateAnimeSeriesDB, 
  deleteAnimeSeriesDB,
  countAnimeSeriesDB,
} from '@/lib/services/db/anime.db';
import { 
  createAnimeGenreDB,
  deleteAnimeGenresBySeriesIdDB,
} from '@/lib/services/db/animeGenre.db';
import { 
  createAnimeTagDB,
  deleteAnimeTagsBySeriesIdDB,
} from '@/lib/services/db/animeTag.db';
import { 
  createAnimeStudioDB,
  deleteAnimeStudiosBySeriesIdDB,
} from '@/lib/services/db/animeStudio.db';
import { 
  findAllGenresDB,
} from '@/lib/services/db/genre.db';
import { 
  findAllStudiosDB,
} from '@/lib/services/db/studio.db';
import { 
  findAllTagsDB,
} from '@/lib/services/db/tag.db';
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
  GetAnimeSeriesRelationsResponse,
  GetAnimeSeriesWithRelationsResponse,
} from '@/lib/types/api/anime.api';
import { UploadService } from '@/lib/services/cloudinary/upload.service';

// =============================================================================
// ANIME SERIES CRUD FUNCTIONS
// =============================================================================

// Anime serisi oluşturma
export async function createAnimeSeriesBusiness(
  data: CreateAnimeSeriesRequest & { coverImageFile?: File; bannerImageFile?: File },
  userId: string
): Promise<ApiResponse<CreateAnimeSeriesResponse>> {
  try {
    // Image'ları data'dan çıkar
    const { coverImageFile, bannerImageFile, ...formData } = data;
    
    // Resim yükleme işlemi
    let uploadResult;
    if (coverImageFile || bannerImageFile) {
      // Geçici ID ile resim yükle
      uploadResult = await UploadService.uploadAnimeImages(coverImageFile, bannerImageFile, 'temp');
    }

    // Anime serisi oluştur
    const result = await createAnimeSeriesDB({
      title: formData.title,
      englishTitle: formData.englishTitle,
      japaneseTitle: formData.japaneseTitle,
      synopsis: formData.synopsis,
      type: formData.type,
      status: formData.status,
      releaseDate: formData.releaseDate,
      season: formData.season,
      seasonYear: formData.year,
      source: formData.source,
      countryOfOrigin: formData.countryOfOrigin,
      isAdult: formData.isAdult,
      trailer: formData.trailer || null,
      synonyms: formData.synonyms || [],
      // Resim URL'leri
      coverImage: uploadResult?.coverImage?.secureUrl,
      bannerImage: uploadResult?.bannerImage?.secureUrl,
    });

    // İlişkileri oluştur
    if (data.genres && data.genres.length > 0) {
      await Promise.all(
        data.genres.map(genreId => 
          createAnimeGenreDB(result.id, genreId)
        )
      );
    }

    if (data.studios && data.studios.length > 0) {
      await Promise.all(
        data.studios.map(studioId => 
          createAnimeStudioDB(result.id, studioId)
        )
      );
    }

    if (data.tags && data.tags.length > 0) {
      await Promise.all(
        data.tags.map(tagId => 
          createAnimeTagDB(result.id, tagId)
        )
      );
    }

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
      findAllAnimeSeriesDB(where, skip, limit, { createdAt: 'desc' }, {
        id: true,
        aniwaPublicId: true,
          title: true,
          type: true,
          status: true,
          coverImage: true,
        }
      ),
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
  data: UpdateAnimeSeriesRequest & { coverImageFile?: File; bannerImageFile?: File },
  userId: string
): Promise<ApiResponse<UpdateAnimeSeriesResponse>> {
  try {
    // Mevcut anime serisini getir
    const existingAnime = await findAnimeSeriesByIdDB(id);
    if (!existingAnime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Resim yükleme işlemi
    let uploadResult;
    if (data.coverImageFile || data.bannerImageFile) {
      // Geçici ID ile resim yükle
      uploadResult = await UploadService.uploadAnimeImages(data.coverImageFile, data.bannerImageFile, id);
    }

    // Anime serisi güncelle
    const result = await updateAnimeSeriesDB({ id }, {
      title: data.title,
      englishTitle: data.englishTitle,
      japaneseTitle: data.japaneseTitle,
      synopsis: data.synopsis,
      type: data.type,
      status: data.status,
      releaseDate: data.releaseDate,
      season: data.season,
      seasonYear: data.year,
      source: data.source,
      countryOfOrigin: data.countryOfOrigin,
      isAdult: data.isAdult,
      trailer: data.trailer || null,
      synonyms: data.synonyms || [],
      // Resim URL'leri (sadece yeni yüklenen varsa güncelle)
      ...(uploadResult?.coverImage && { coverImage: uploadResult.coverImage.secureUrl }),
      ...(uploadResult?.bannerImage && { bannerImage: uploadResult.bannerImage.secureUrl }),
    });

    // İlişkileri güncelle
    if (data.genres !== undefined) {
      // Mevcut ilişkileri sil
      await deleteAnimeGenresBySeriesIdDB(id);
      // Yeni ilişkileri oluştur
      if (data.genres.length > 0) {
        await Promise.all(
          data.genres.map(genreId => 
            createAnimeGenreDB(id, genreId)
          )
        );
      }
    }

    if (data.studios !== undefined) {
      // Mevcut ilişkileri sil
      await deleteAnimeStudiosBySeriesIdDB(id);
      // Yeni ilişkileri oluştur
      if (data.studios.length > 0) {
        await Promise.all(
          data.studios.map(studioId => 
            createAnimeStudioDB(id, studioId)
          )
        );
      }
    }

    if (data.tags !== undefined) {
      // Mevcut ilişkileri sil
      await deleteAnimeTagsBySeriesIdDB(id);
      // Yeni ilişkileri oluştur
      if (data.tags.length > 0) {
        await Promise.all(
          data.tags.map(tagId => 
            createAnimeTagDB(id, tagId)
          )
        );
      }
    }

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
        oldTitle: existingAnime.title,
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

    // Cloudinary'den resimleri sil
    await UploadService.deleteAnimeImages(id);
    await UploadService.deleteEpisodeThumbnailsByAnimeSeries(id);

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

// Anime serisi ilişkilerini getirme (genres, studios, tags)
export async function getAnimeSeriesRelationsBusiness(
  userId: string
): Promise<ApiResponse<GetAnimeSeriesRelationsResponse>> {
  try {
    // Paralel olarak tüm ilişkileri getir
    const [genres, studios, tags] = await Promise.all([
      findAllGenresDB(),
      findAllStudiosDB(),
      findAllTagsDB()
    ]);

    // Başarılı getirme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_RELATIONS_RETRIEVED,
      'Anime serisi ilişkileri başarıyla getirildi',
      { 
        genresCount: genres.length,
        studiosCount: studios.length,
        tagsCount: tags.length
      },
      userId
    );

    return {
      success: true,
      data: {
        genres,
        studios,
        tags
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
      'Anime serisi ilişkileri getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      userId
    );
    
    throw new BusinessError('Anime serisi ilişkileri getirme başarısız');
  }
}

// Anime serisi getirme (ID ile) - İlişkilerle birlikte
export async function getAnimeSeriesWithRelationsBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesWithRelationsResponse>> {
  try {
    const animeSeries = await findAnimeSeriesByIdDB(id, {
      animeGenres: {
        include: {
          genre: true
        }
      },
      animeTags: {
        include: {
          tag: true
        }
      },
      animeStudios: {
        include: {
          studio: true
        }
      },
    });
    
    if (!animeSeries) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.EDITOR.ANIME_SERIES_WITH_RELATIONS_RETRIEVED,
      'Anime serisi ilişkilerle birlikte başarıyla getirildi',
      { 
        animeSeriesId: animeSeries.id, 
        aniwaPublicId: animeSeries.aniwaPublicId,
        title: animeSeries.title,
        genresCount: (animeSeries as GetAnimeSeriesWithRelationsResponse).animeGenres?.length || 0,
        studiosCount: (animeSeries as GetAnimeSeriesWithRelationsResponse).animeStudios?.length || 0,
        tagsCount: (animeSeries as GetAnimeSeriesWithRelationsResponse).animeTags?.length || 0
      },
      userId
    );

    return {
      success: true,
      data: animeSeries as GetAnimeSeriesWithRelationsResponse
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi ilişkilerle getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', animeSeriesId: id },
      userId
    );
    
    throw new BusinessError('Anime serisi ilişkilerle getirme başarısız');
  }
} 