// Anime iş mantığı katmanı

import { BusinessError, NotFoundError, UnauthorizedError, DatabaseError } from "@/lib/errors";
import {
  createAnimeSeriesDB,
  findAnimeSeriesByIdDB,
  findAllAnimeSeriesDB,
  countAnimeSeriesDB,
} from "@/lib/services/db/anime.db";
import {
  createAnimeMediaPartDB,
} from "@/lib/services/db/mediaPart.db";
import {
  createEpisodeDB,
} from "@/lib/services/db/episode.db";
import {
  createAnimeGenresDB,
} from "@/lib/services/db/animeGenre.db";
import {
  createAnimeTagsDB,
} from "@/lib/services/db/animeTag.db";
import {
  createAnimeStudiosDB,
} from "@/lib/services/db/animeStudio.db";
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

// Anime serisi oluşturma (transaction ile)
export async function createAnimeSeriesBusiness(
  data: CreateAnimeSeriesRequest,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    // Transaction ile tüm işlemleri yap
    const result = await prisma.$transaction(async (tx) => {
      // Anime serisi oluştur
      const animeSeries = await createAnimeSeriesDB(
        {
          title: data.title,
          englishTitle: data.englishTitle,
          japaneseTitle: data.japaneseTitle,
          synonyms: data.synonyms || [],
          type: data.type as AnimeType,
          status: data.status as AnimeStatus,
          episodes: data.episodes,
          duration: data.duration,
          isAdult: data.isAdult,
          season: data.season as Season,
          seasonYear: data.seasonYear,
          source: data.source as Source,
          countryOfOrigin: data.countryOfOrigin,
          anilistAverageScore: data.anilistAverageScore,
          anilistPopularity: data.anilistPopularity,
          averageScore: data.averageScore,
          popularity: data.popularity,
          coverImage: data.coverImage,
          bannerImage: data.bannerImage,
          description: data.description,
          trailer: data.trailer,
          isMultiPart:
            data.mediaParts && data.mediaParts.length > 1,
        },
        tx
      );

      // Genre ilişkilerini oluştur
      if (data.genreIds && data.genreIds.length > 0) {
        await createAnimeGenresDB(animeSeries.id, data.genreIds, tx);
      }

      // Tag ilişkilerini oluştur
      if (data.tagIds && data.tagIds.length > 0) {
        await createAnimeTagsDB(animeSeries.id, data.tagIds, tx);
      }

      // Studio ilişkilerini oluştur
      if (data.studioIds && data.studioIds.length > 0) {
        await createAnimeStudiosDB(animeSeries.id, data.studioIds, tx);
      }

      // Medya parçalarını oluştur
      if (data.mediaParts && data.mediaParts.length > 0) {
        for (const mediaPartData of data.mediaParts) {
          const mediaPart = await createAnimeMediaPartDB(
            {
              series: { connect: { id: animeSeries.id } },
              title: mediaPartData.title,
              englishTitle: mediaPartData.englishTitle,
              japaneseTitle: mediaPartData.japaneseTitle,
              displayOrder: mediaPartData.displayOrder || 1,
              notes: mediaPartData.notes,
              type: mediaPartData.type,
              episodes: mediaPartData.episodes,
              duration: mediaPartData.duration,
              releaseDate: mediaPartData.releaseDate,
              anilistAverageScore: mediaPartData.anilistAverageScore,
              anilistPopularity: mediaPartData.anilistPopularity,
              averageScore: mediaPartData.averageScore,
              popularity: mediaPartData.popularity,
            },
            tx
          );

          // Bölümleri oluştur
          if (mediaPartData.episodeList && mediaPartData.episodeList.length > 0) {
            for (const episodeData of mediaPartData.episodeList) {
              await createEpisodeDB(
                {
                  mediaPart: { connect: { id: mediaPart.id } },
                  episodeNumber: episodeData.episodeNumber,
                  title: episodeData.title,
                  englishTitle: episodeData.englishTitle,
                  japaneseTitle: episodeData.japaneseTitle,
                  duration: episodeData.duration,
                  airDate: episodeData.airDate,
                  description: episodeData.description,
                  thumbnailImage: episodeData.thumbnailImage,
                  isFiller: episodeData.isFiller,
                  fillerNotes: episodeData.fillerNotes,
                  averageScore: episodeData.averageScore,
                },
                tx
              );
            }
          }
        }
      }

      return animeSeries;
    });

    // Detaylı anime serisi bilgilerini getir
    const animeWithDetails = await findAnimeSeriesByIdDB(result.id);

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
      genres: animeWithDetails!.animeGenres?.map(ag => ag.genre) || [],
      tags: animeWithDetails!.animeTags?.map(at => at.tag) || [],
      studios: animeWithDetails!.animeStudios?.map(as => as.studio) || [],
      mediaParts: animeWithDetails!.mediaParts?.map(mp => ({
        ...mp,
        partsEpisodes: mp.partsEpisodes
      })) || [],
      comments: animeWithDetails!.comments || [],
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

// Anime serisi detaylarını getirme (kullanıcı için)
export async function getAnimeDetailsByIdBusiness(
  id: string,
  user?: { id: string; userSettings?: { displayAdultContent: boolean } }
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    const anime = await findAnimeSeriesByIdDB(id);
    if (!anime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

    // Yetişkin içerik kontrolü
    if (anime.isAdult && (!user?.userSettings?.displayAdultContent)) {
      throw new UnauthorizedError('Bu içeriği görüntüleme yetkiniz yok');
    }

    // API response tipine uygun dönüşüm
    const responseData: GetAnimeSeriesDetailsResponse = {
      ...anime,
      genres: anime.animeGenres.map(ag => ag.genre),
      tags: anime.animeTags.map(at => at.tag),
      studios: anime.animeStudios.map(as => as.studio),
      mediaParts: anime.mediaParts.map(mp => ({
        ...mp,
        partsEpisodes: mp.partsEpisodes
      })),
      comments: anime.comments
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
      'Anime serisi detayları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId: id,
      }
    );

    throw new BusinessError('Anime serisi detayları getirme başarısız');
  }
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function getAllAnimeSeriesBusiness(
  filters?: GetAnimeSeriesRequest,
  user?: { id: string; userSettings?: { displayAdultContent: boolean } }
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

    // Yetişkin içerik kontrolü
    if (!user?.userSettings?.displayAdultContent) {
      where.isAdult = false;
    }

    // Anime serilerini getir
    const [animeSeries, total] = await Promise.all([
      findAllAnimeSeriesDB(where, skip, limit, { createdAt: 'desc' }),
      countAnimeSeriesDB(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    // API response tipine uygun dönüşüm
    const responseData: GetAllAnimeSeriesResponse = {
      animeSeries: animeSeries.map(anime => ({
        ...anime,
        genres: anime.animeGenres.map(ag => ag.genre),
        tags: anime.animeTags.map(at => at.tag),
        studios: anime.animeStudios.map(as => as.studio),
        mediaParts: anime.mediaParts
      })),
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
      }
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
      // Anime serisi güncelle
      const updatedAnime = await tx.animeSeries.update({
        where: { id },
        data: {
          title: data.title,
          englishTitle: data.englishTitle,
          japaneseTitle: data.japaneseTitle,
          synonyms: data.synonyms,
          type: data.type as AnimeType,
          status: data.status as AnimeStatus,
          episodes: data.episodes,
          duration: data.duration,
          isAdult: data.isAdult,
          season: data.season as Season,
          seasonYear: data.seasonYear,
          source: data.source as Source,
          countryOfOrigin: data.countryOfOrigin,
          anilistAverageScore: data.anilistAverageScore,
          anilistPopularity: data.anilistPopularity,
          averageScore: data.averageScore,
          popularity: data.popularity,
          coverImage: data.coverImage,
          bannerImage: data.bannerImage,
          description: data.description,
          trailer: data.trailer,
          isMultiPart: data.mediaParts && data.mediaParts.length > 1,
          relatedAnimeIds: data.relatedAnimeIds,
        },
      });

      // Genre ilişkilerini güncelle
      if (data.genreIds) {
        await tx.animeGenre.deleteMany({ where: { animeSeriesId: id } });
        if (data.genreIds.length > 0) {
          await createAnimeGenresDB(id, data.genreIds, tx);
        }
      }

      // Tag ilişkilerini güncelle
      if (data.tagIds) {
        await tx.animeTag.deleteMany({ where: { animeSeriesId: id } });
        if (data.tagIds.length > 0) {
          await createAnimeTagsDB(id, data.tagIds, tx);
        }
      }

      // Studio ilişkilerini güncelle
      if (data.studioIds) {
        await tx.animeStudio.deleteMany({ where: { animeSeriesId: id } });
        if (data.studioIds.length > 0) {
          await createAnimeStudiosDB(id, data.studioIds, tx);
        }
      }

      return updatedAnime;
    });

    // Güncellenmiş anime serisi detaylarını getir
    const updatedAnimeWithDetails = await findAnimeSeriesByIdDB(id);

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
      genres: updatedAnimeWithDetails!.animeGenres.map(ag => ag.genre),
      tags: updatedAnimeWithDetails!.animeTags.map(at => at.tag),
      studios: updatedAnimeWithDetails!.animeStudios.map(as => as.studio),
      mediaParts: updatedAnimeWithDetails!.mediaParts.map(mp => ({
        ...mp,
        partsEpisodes: mp.partsEpisodes
      })),
      comments: updatedAnimeWithDetails!.comments
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

    // Anime serisini sil (cascade ile ilişkili veriler de silinir)
    await prisma.animeSeries.delete({ where: { id } });

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

// Anime serisi detaylarını getirme (admin için)
export async function getAnimeSeriesByIdBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    const anime = await findAnimeSeriesByIdDB(id);
    if (!anime) {
      throw new NotFoundError('Anime serisi bulunamadı');
    }

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
      genres: anime.animeGenres.map(ag => ag.genre),
      tags: anime.animeTags.map(at => at.tag),
      studios: anime.animeStudios.map(as => as.studio),
      mediaParts: anime.mediaParts.map(mp => ({
        ...mp,
        partsEpisodes: mp.partsEpisodes
      })),
      comments: anime.comments
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
