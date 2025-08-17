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
import { 
  uploadImageBusiness, 
  deleteImageBusiness, 
  createImageUploadContext
} from '@/lib/services/business/shared/image.business';
import { findAllAnimeMediaPartsDB } from '@/lib/services/db/mediaPart.db';
import { findEpisodesByMediaPartIdDB } from '@/lib/services/db/episode.db';

// Anime serisi oluşturma
export async function createAnimeSeriesBusiness(
  data: CreateAnimeSeriesRequest & { coverImageFile?: File; bannerImageFile?: File },
  userId: string
): Promise<ApiResponse<CreateAnimeSeriesResponse>> {
  try {
    // Image'ları data'dan çıkar
    const { coverImageFile, bannerImageFile, ...formData } = data;
    
    // Önce anime serisini oluştur
    const result = await createAnimeSeriesDB({
      title: formData.title,
      englishTitle: formData.englishTitle,
      nativeTitle: formData.nativeTitle,
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
      // Resim URL'leri başlangıçta null
      coverImage: null,
      bannerImage: null,
    });

    // Image yüklemeleri (anime ID'si ile)
    let coverImageUrl, bannerImageUrl;

    if (coverImageFile) {
      const coverUpload = await uploadImageBusiness(
        createImageUploadContext('anime-cover', result.id, userId),
        coverImageFile,
        userId
      );
      if (coverUpload.success && coverUpload.data) {
        coverImageUrl = coverUpload.data.secureUrl;
      }
    }

    if (bannerImageFile) {
      const bannerUpload = await uploadImageBusiness(
        createImageUploadContext('anime-banner', result.id, userId),
        bannerImageFile,
        userId
      );
      if (bannerUpload.success && bannerUpload.data) {
        bannerImageUrl = bannerUpload.data.secureUrl;
      }
    }

    // Eğer image upload başarılıysa, anime'yi güncelle
    if (coverImageUrl || bannerImageUrl) {
      await updateAnimeSeriesDB(
        { id: result.id },
        {
          coverImage: coverImageUrl || undefined,
          bannerImage: bannerImageUrl || undefined,
        }
      );
    }

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
        hasCoverImage: !!coverImageUrl,
        hasBannerImage: !!bannerImageUrl
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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



    return {
      success: true,
      data: animeSeries
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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
        { nativeTitle: { contains: filters.search, mode: 'insensitive' } },
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
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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

    // Image'ları data'dan çıkar
    const { coverImageFile, bannerImageFile, ...formData } = data;
    
    // Image yüklemeleri
    let coverImageUrl = existingAnime.coverImage;
    let bannerImageUrl = existingAnime.bannerImage;

    if (coverImageFile) {
      const coverUpload = await uploadImageBusiness(
        createImageUploadContext('anime-cover', id, userId),
        coverImageFile,
        userId,
        {
          deleteOld: true,
          oldImageUrl: existingAnime.coverImage
        }
      );
      if (coverUpload.success && coverUpload.data) {
        coverImageUrl = coverUpload.data.secureUrl;
      }
    }

    if (bannerImageFile) {
      const bannerUpload = await uploadImageBusiness(
        createImageUploadContext('anime-banner', id, userId),
        bannerImageFile,
        userId,
        {
          deleteOld: true,
          oldImageUrl: existingAnime.bannerImage
        }
      );
      if (bannerUpload.success && bannerUpload.data) {
        bannerImageUrl = bannerUpload.data.secureUrl;
      }
    }

    // Anime serisi güncelle
    const result = await updateAnimeSeriesDB({ id }, {
      title: data.title,
      englishTitle: data.englishTitle,
      nativeTitle: data.nativeTitle,
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
      ...(coverImageUrl && { coverImage: coverImageUrl }),
      ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
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
        hasNewCoverImage: !!coverImageUrl,
        hasNewBannerImage: !!bannerImageUrl
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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

    // Önce görselleri sil (varsa) 
    const imagePromises = [];
    
    if (existingAnimeSeries.coverImage) {
      imagePromises.push(
        deleteImageBusiness(
          createImageUploadContext('anime-cover', id, userId),
          userId,
          existingAnimeSeries.coverImage
        ).catch(error => {
          logger.warn(
            EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
            'Anime serisi silme sırasında cover image silinemedi',
            { 
              animeSeriesId: id,
              coverImage: existingAnimeSeries.coverImage,
              error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            userId
          );
        })
      );
    }
    
    if (existingAnimeSeries.bannerImage) {
      imagePromises.push(
        deleteImageBusiness(
          createImageUploadContext('anime-banner', id, userId),
          userId,
          existingAnimeSeries.bannerImage
        ).catch(error => {
          logger.warn(
            EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
            'Anime serisi silme sırasında banner image silinemedi',
            { 
              animeSeriesId: id,
              bannerImage: existingAnimeSeries.bannerImage,
              error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            userId
          );
        })
      );
    }

    // Anime'ye ait tüm episode thumbnail'larını da sil
    try {
      // Anime'nin media part'larını bul
      const mediaParts = await findAllAnimeMediaPartsDB({ seriesId: id }, 0, 1000);
      
      // Her media part için episode'ları bul ve thumbnail'larını sil
      for (const mediaPart of mediaParts) {
        try {
          const episodes = await findEpisodesByMediaPartIdDB(mediaPart.id);
          
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
                    'Anime series silme sırasında episode thumbnail silinemedi',
                    { 
                      animeSeriesId: id,
                      mediaPartId: mediaPart.id,
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
        } catch (episodeError) {
          // Episode bulma hatası
          await logger.warn(
            EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
            'Media part episode\'ları bulunamadı',
            { 
              animeSeriesId: id,
              mediaPartId: mediaPart.id,
              error: episodeError instanceof Error ? episodeError.message : 'Bilinmeyen hata'
            },
            userId
          );
        }
      }
      
    } catch (error) {
      // Episode cleanup hatası anime silmeyi engellemesin
      await logger.warn(
        EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
        'Anime serisi silme sırasında episode thumbnail cleanup hatası',
        { 
          animeSeriesId: id,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        },
        userId
      );
    }

    // Görsellerin silinmesini bekle (hata olsa bile devam et)
    await Promise.allSettled(imagePromises);

    // Anime serisi sil (Prisma cascade delete ile episode'lar da silinir)
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
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError) {
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



    return {
      success: true,
      data: {
        genres,
        studios,
        tags
      }
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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



    return {
      success: true,
      data: animeSeries as GetAnimeSeriesWithRelationsResponse
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
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