// Anime iş mantığı katmanı

import { BusinessError, NotFoundError, DatabaseError } from "@/lib/errors";
import {
  createAnimeSeriesDB,
  findAnimeSeriesByIdDB,
  findAllAnimeSeriesDB,
  countAnimeSeriesDB,
  updateAnimeSeriesDB,
  deleteAnimeSeriesDB,
} from "@/lib/services/db/anime.db";
import {
  createAnimeGenresDB,
  findAnimeGenresBySeriesIdDB,
} from "@/lib/services/db/animeGenre.db";
import {
  createAnimeTagsDB,
  findAnimeTagsBySeriesIdDB,
} from "@/lib/services/db/animeTag.db";
import {
  createAnimeStudiosDB,
  findAnimeStudiosBySeriesIdDB,
} from "@/lib/services/db/animeStudio.db";
import { UploadService } from "@/lib/services/extends-api/cloudinary/upload.service";
import { CloudinaryService } from "@/lib/services/extends-api/cloudinary/cloudinary.service";
import { UPLOAD_CONFIGS } from "@/lib/constants/cloudinary.constants";
import { Prisma, AnimeType, AnimeStatus, Season, Source } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { EVENTS } from "@/lib/constants/events.constants";
import { ApiResponse } from "@/lib/types/api";
import {
  CreateAnimeSeriesRequest,
  GetAnimeSeriesDetailsResponse,
  GetAllAnimeSeriesResponse,
  GetAnimeSeriesRequest,
} from "@/lib/types/api/anime.api";

// Anime serisi oluşturma
export async function createAnimeSeriesBusiness(
  data: CreateAnimeSeriesRequest,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    // Transaction ile tüm işlemleri yap
    const result = await prisma.$transaction(async (tx) => {
      // Film türü için episodes kontrolü
      if (data.type === AnimeType.MOVIE && data.episodes !== 1) {
        throw new BusinessError('Film türü için bölüm sayısı 1 olmalıdır');
      }
      
      const episodes = data.episodes;
      
      // AniwaPublicId için son ID'yi bul ve 1 artır (güvenli şekilde)
      const lastAnime = await tx.animeSeries.findFirst({
        where: { aniwaPublicId: { not: undefined } },
        orderBy: { aniwaPublicId: 'desc' },
        select: { aniwaPublicId: true }
      });
      const nextPublicId = (lastAnime?.aniwaPublicId || 0) + 1;
      
      // Geçici anime ID oluştur (upload için)
      const tempAnimeId = `temp_${Date.now()}`;
      
      // Resim dosyalarını yükle (eğer varsa)
      let coverImageUrl = data.coverImage;
      let bannerImageUrl = data.bannerImage;
      
      if (data.coverImageFile || data.bannerImageFile) {
        try {
          // Base64'ten Buffer'a çevir
          const coverBuffer = data.coverImageFile ? UploadService.base64ToBuffer(data.coverImageFile) : undefined;
          const bannerBuffer = data.bannerImageFile ? UploadService.base64ToBuffer(data.bannerImageFile) : undefined;
          
          // Dosya validasyonu
          if (coverBuffer) UploadService.validateImageFile(coverBuffer, UPLOAD_CONFIGS.ANIME_COVER.maxSize);
          if (bannerBuffer) UploadService.validateImageFile(bannerBuffer, UPLOAD_CONFIGS.ANIME_BANNER.maxSize);
          
          // Cloudinary'ye yükle
          const uploadResult = await UploadService.uploadAnimeImages(
            coverBuffer,
            bannerBuffer,
            tempAnimeId
          );
          
          // URL'leri güncelle
          if (uploadResult.coverImage) {
            coverImageUrl = uploadResult.coverImage.secureUrl;
          }
          if (uploadResult.bannerImage) {
            bannerImageUrl = uploadResult.bannerImage.secureUrl;
          }
        } catch (uploadError) {
          logger.error(
            EVENTS.SYSTEM.BUSINESS_ERROR,
            'Resim yükleme hatası',
            {
              error: uploadError instanceof Error ? uploadError.message : String(uploadError),
              userId
            },
            userId
          );
          throw new BusinessError('Resim yüklenirken hata oluştu');
        }
      }
      
      // Anime serisi oluştur
      const animeSeries = await createAnimeSeriesDB(
        {
          title: data.title,
          englishTitle: data.englishTitle,
          japaneseTitle: data.japaneseTitle,
          synonyms: data.synonyms || [],
          anilistId: data.anilistId,
          malId: data.malId,
          aniwaPublicId: nextPublicId,
          type: data.type,
          status: data.status,
          episodes: episodes,
          duration: data.duration,
          isAdult: data.isAdult,
          season: data.season,
          seasonYear: data.seasonYear,
          releaseDate: data.releaseDate,
          source: data.source,
          countryOfOrigin: data.countryOfOrigin,
          coverImage: coverImageUrl,
          bannerImage: bannerImageUrl,
          synopsis: data.synopsis,
          trailer: data.trailer,
          anilistAverageScore: data.anilistAverageScore,
          anilistPopularity: data.anilistPopularity,
          isMultiPart: data.isMultiPart,
        },
        tx
      );

      // Genre ilişkilerini oluştur
      if (data.genreIds && data.genreIds.length > 0) {
        await createAnimeGenresDB(animeSeries.id, data.genreIds.map(String), tx);
      }

      // Tag ilişkilerini oluştur
      if (data.tagIds && data.tagIds.length > 0) {
        await createAnimeTagsDB(animeSeries.id, data.tagIds.map(String), tx);
      }

      // Studio ilişkilerini oluştur
      if (data.studioIds && data.studioIds.length > 0) {
        await createAnimeStudiosDB(animeSeries.id, data.studioIds.map(String), tx);
      }

      return animeSeries;
    });

    // Detaylı anime serisi bilgilerini getir (transaction dışında)
    const animeWithDetails = await findAnimeSeriesByIdDB(result.id);
    const [animeGenres, animeTags, animeStudios] = await Promise.all([
      findAnimeGenresBySeriesIdDB(result.id),
      findAnimeTagsBySeriesIdDB(result.id),
      findAnimeStudiosBySeriesIdDB(result.id),
    ]);

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_CREATED,
      'Anime serisi başarıyla oluşturuldu',
      {
        animeSeriesId: result.id,
        title: result.title,
        type: result.type,
        status: result.status
      },
      userId
    );

    // API response tipine uygun dönüşüm
    const responseData: GetAnimeSeriesDetailsResponse = {
      ...animeWithDetails!,
      genres: animeGenres.map(ag => ag.genre),
      tags: animeTags.map(at => at.tag),
      studios: animeStudios.map(as => as.studio),
      mediaParts: [],
      comments: [],
      sourceRelations: [],
      targetRelations: []
    };

    return {
      success: true,
      data: responseData,
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
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        title: data.title,
      },
      userId
    );

    throw new BusinessError('Anime serisi oluşturma başarısız');
  }
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function getAllAnimeSeriesBusiness(
  filters?: GetAnimeSeriesRequest,
  userId?: string
): Promise<ApiResponse<GetAllAnimeSeriesResponse>> {
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
      where.type = filters.type as AnimeType;
    }

    if (filters?.status) {
      where.status = filters.status as AnimeStatus;
    }

    if (filters?.season) {
      where.season = filters.season as Season;
    }

    if (filters?.seasonYear) {
      where.seasonYear = filters.seasonYear;
    }

    if (filters?.source) {
      where.source = filters.source as Source;
    }

    // Yetişkin içerik kontrolü - editor için tüm içerik gösterilir
    // Kullanıcılar için ayrı fonksiyon kullanılacak

    // Anime serilerini getir
    const [animeSeries, total] = await Promise.all([
      findAllAnimeSeriesDB(where, skip, limit, { createdAt: 'desc' }),
      countAnimeSeriesDB(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Her anime için ilişkili verileri getir
    const animeWithRelations = await Promise.all(
      animeSeries.map(async (anime) => {
        const [animeGenres, animeTags, animeStudios] = await Promise.all([
          findAnimeGenresBySeriesIdDB(anime.id),
          findAnimeTagsBySeriesIdDB(anime.id),
          findAnimeStudiosBySeriesIdDB(anime.id),
        ]);

        console.log(`Anime ${anime.title} (${anime.id}):`);
        console.log('  - Genres found:', animeGenres.length);
        console.log('  - Tags found:', animeTags.length);
        console.log('  - Studios found:', animeStudios.length);

        return {
          ...anime,
          genres: animeGenres.map(ag => ag.genre),
          tags: animeTags.map(at => at.tag),
          studios: animeStudios.map(as => as.studio),
          mediaParts: []
        };
      })
    );

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_RETRIEVED,
      'Anime serileri listesi görüntülendi',
      {
        total,
        page,
        limit,
        totalPages,
        filters
      },
      userId
    );

    // API response tipine uygun dönüşüm
    const responseData: GetAllAnimeSeriesResponse = {
      animeSeries: animeWithRelations,
      total,
      page,
      limit,
      totalPages,
    };

    return {
      success: true,
      data: responseData,
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
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters,
      },
      userId
    );

    throw new BusinessError('Anime serileri listeleme başarısız');
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesBusiness(
  id: string,
  data: Partial<CreateAnimeSeriesRequest>,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const existingAnime = await findAnimeSeriesByIdDB(id);
    if (!existingAnime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Transaction ile güncelleme
    const result = await prisma.$transaction(async (tx) => {
      // Film türü için episodes kontrolü
      if (data.type === AnimeType.MOVIE && data.episodes !== 1) {
        throw new BusinessError('Film türü için bölüm sayısı 1 olmalıdır');
      }
      
      const episodes = data.episodes;
      
      // Resim işlemleri
      let coverImageUrl = data.coverImage;
      let bannerImageUrl = data.bannerImage;
      
      // Mevcut resimleri sil (eğer isteniyorsa)
      try {
        if (data.coverImageToDelete && existingAnime.coverImage) {
          const coverPublicId = CloudinaryService.extractPublicIdFromUrl(existingAnime.coverImage);
          if (coverPublicId) {
            await CloudinaryService.deleteFile(coverPublicId, 'image');
          }
          coverImageUrl = '';
        }
        
        if (data.bannerImageToDelete && existingAnime.bannerImage) {
          const bannerPublicId = CloudinaryService.extractPublicIdFromUrl(existingAnime.bannerImage);
          if (bannerPublicId) {
            await CloudinaryService.deleteFile(bannerPublicId, 'image');
          }
          bannerImageUrl = '';
        }
      } catch (cloudinaryError) {
        logger.error(
          EVENTS.SYSTEM.BUSINESS_ERROR,
          'Cloudinary resim silme hatası (güncelleme)',
          {
            error: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError),
            animeSeriesId: id
          },
          userId
        );
      }
      
      // Yeni resim dosyalarını yükle (eğer varsa)
      if (data.coverImageFile || data.bannerImageFile) {
        try {
          const coverBuffer = data.coverImageFile ? UploadService.base64ToBuffer(data.coverImageFile) : undefined;
          const bannerBuffer = data.bannerImageFile ? UploadService.base64ToBuffer(data.bannerImageFile) : undefined;
          
          if (coverBuffer) UploadService.validateImageFile(coverBuffer, UPLOAD_CONFIGS.ANIME_COVER.maxSize);
          if (bannerBuffer) UploadService.validateImageFile(bannerBuffer, UPLOAD_CONFIGS.ANIME_BANNER.maxSize);
          
          const uploadResult = await UploadService.uploadAnimeImages(
            coverBuffer,
            bannerBuffer,
            id
          );
          
          if (uploadResult.coverImage) {
            coverImageUrl = uploadResult.coverImage.secureUrl;
          }
          if (uploadResult.bannerImage) {
            bannerImageUrl = uploadResult.bannerImage.secureUrl;
          }
        } catch (uploadError) {
          logger.error(
            EVENTS.SYSTEM.BUSINESS_ERROR,
            'Resim yükleme hatası (güncelleme)',
            {
              error: uploadError instanceof Error ? uploadError.message : String(uploadError),
              userId
            },
            userId
          );
          throw new BusinessError('Resim yüklenirken hata oluştu');
        }
      }
      
      // Anime serisi güncelle
      const updatedAnime = await updateAnimeSeriesDB(
        { id },
        {
          title: data.title,
          englishTitle: data.englishTitle,
          japaneseTitle: data.japaneseTitle,
          synonyms: data.synonyms || [],
          anilistId: data.anilistId,
          malId: data.malId,
          type: data.type,
          status: data.status,
          episodes: episodes,
          duration: data.duration,
          isAdult: data.isAdult,
          season: data.season,
          seasonYear: data.seasonYear,
          releaseDate: data.releaseDate,
          source: data.source,
          countryOfOrigin: data.countryOfOrigin,
          coverImage: coverImageUrl,
          bannerImage: bannerImageUrl,
          synopsis: data.synopsis,
          trailer: data.trailer,
          anilistAverageScore: data.anilistAverageScore,
          anilistPopularity: data.anilistPopularity,
          isMultiPart: data.isMultiPart,
        },
        tx
      );

      // Genre ilişkilerini güncelle
      if (data.genreIds) {
        await tx.animeGenre.deleteMany({ where: { animeSeriesId: id } });
        if (data.genreIds.length > 0) {
          await createAnimeGenresDB(id, data.genreIds.map(String), tx);
        }
      }

      // Tag ilişkilerini güncelle
      if (data.tagIds) {
        await tx.animeTag.deleteMany({ where: { animeSeriesId: id } });
        if (data.tagIds.length > 0) {
          await createAnimeTagsDB(id, data.tagIds.map(String), tx);
        }
      }

      // Studio ilişkilerini güncelle
      if (data.studioIds) {
        await tx.animeStudio.deleteMany({ where: { animeSeriesId: id } });
        if (data.studioIds.length > 0) {
          await createAnimeStudiosDB(id, data.studioIds.map(String), tx);
        }
      }

      return updatedAnime;
    });

    // Güncellenmiş anime serisi detaylarını getir
    const updatedAnimeWithDetails = await findAnimeSeriesByIdDB(id);
    const [animeGenres, animeTags, animeStudios] = await Promise.all([
      findAnimeGenresBySeriesIdDB(id),
      findAnimeTagsBySeriesIdDB(id),
      findAnimeStudiosBySeriesIdDB(id),
    ]);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_UPDATED,
      'Anime serisi başarıyla güncellendi',
      {
        animeSeriesId: result.id,
        title: result.title,
        oldTitle: existingAnime.title
      },
      userId
    );

    // API response tipine uygun dönüşüm
    const responseData: GetAnimeSeriesDetailsResponse = {
      ...updatedAnimeWithDetails!,
      genres: animeGenres.map(ag => ag.genre),
      tags: animeTags.map(at => at.tag),
      studios: animeStudios.map(as => as.studio),
      mediaParts: [],
      comments: [],
      sourceRelations: [],
      targetRelations: []
    };

    return {
      success: true,
      data: responseData,
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
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId: id,
        data,
      },
      userId
    );

    throw new BusinessError('Anime serisi güncelleme başarısız');
  }
}

// Anime serisi silme
export async function deleteAnimeSeriesBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Anime serisi mevcut mu kontrolü
    const existingAnime = await findAnimeSeriesByIdDB(id);
    if (!existingAnime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Cloudinary'den resimleri sil (eğer varsa)
    try {
      if (existingAnime.coverImage) {
        const coverPublicId = CloudinaryService.extractPublicIdFromUrl(existingAnime.coverImage);
        if (coverPublicId) {
          await CloudinaryService.deleteFile(coverPublicId, 'image');
        }
      }
      
      if (existingAnime.bannerImage) {
        const bannerPublicId = CloudinaryService.extractPublicIdFromUrl(existingAnime.bannerImage);
        if (bannerPublicId) {
          await CloudinaryService.deleteFile(bannerPublicId, 'image');
        }
      }
    } catch (cloudinaryError) {
      // Cloudinary silme hatası kritik değil, logla ama devam et
      logger.error(
        EVENTS.SYSTEM.BUSINESS_ERROR,
        'Cloudinary resim silme hatası',
        {
          error: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError),
          animeSeriesId: id,
          coverImage: existingAnime.coverImage,
          bannerImage: existingAnime.bannerImage
        },
        userId
      );
    }

    // Anime serisini sil (cascade ile ilişkili veriler de silinir)
    await deleteAnimeSeriesDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_DELETED,
      'Anime serisi başarıyla silindi',
      {
        animeSeriesId: id,
        title: existingAnime.title
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Anime serisi başarıyla silindi' },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Anime serisi silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId: id,
      },
      userId
    );

    throw new BusinessError('Anime serisi silme başarısız');
  }
}

// Anime serisi detaylarını getirme
export async function getAnimeSeriesByIdBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    const anime = await findAnimeSeriesByIdDB(id);
    if (!anime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // İlişkili verileri getir
    const [animeGenres, animeTags, animeStudios] = await Promise.all([
      findAnimeGenresBySeriesIdDB(id),
      findAnimeTagsBySeriesIdDB(id),
      findAnimeStudiosBySeriesIdDB(id),
    ]);

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_RETRIEVED,
      'Anime serisi detayı görüntülendi',
      {
        animeSeriesId: anime.id,
        title: anime.title
      },
      userId
    );

    // API response tipine uygun dönüşüm
    const responseData: GetAnimeSeriesDetailsResponse = {
      ...anime,
      genres: animeGenres.map(ag => ag.genre),
      tags: animeTags.map(at => at.tag),
      studios: animeStudios.map(as => as.studio),
      mediaParts: [],
      comments: [],
      sourceRelations: [],
      targetRelations: []
    };

    return {
      success: true,
      data: responseData,
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
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId: id,
      },
      userId
    );

    throw new BusinessError('Anime serisi getirme başarısız');
  }
}
