// Anime iş mantığı katmanı

import { BusinessError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import {
  createAnimeSeries as createAnimeSeriesDB,
  findAnimeSeriesByIdWithDetails,
  findAllAnimeSeriesWithDetails,
  countAnimeSeries,
  createAnimeMediaPart as createAnimeMediaPartDB,
  createEpisode as createEpisodeDB,
  createAnimeGenres,
  createAnimeTags,
  createAnimeStudios,
} from "@/lib/services/db/anime.db";
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
export async function createAnimeSeries(
  data: CreateAnimeSeriesRequest,
  adminUser: { id: string; username: string }
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
          relatedAnimeIds: data.relatedAnimeIds || [],
        },
        tx
      );

      // Genre ilişkilerini oluştur
      if (data.genreIds && data.genreIds.length > 0) {
        await createAnimeGenres(animeSeries.id, data.genreIds, tx);
      }

      // Tag ilişkilerini oluştur
      if (data.tagIds && data.tagIds.length > 0) {
        await createAnimeTags(animeSeries.id, data.tagIds, tx);
      }

      // Studio ilişkilerini oluştur
      if (data.studioIds && data.studioIds.length > 0) {
        await createAnimeStudios(animeSeries.id, data.studioIds, tx);
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
          if (
            mediaPartData.episodeList &&
            mediaPartData.episodeList.length > 0
          ) {
            for (const episodeData of mediaPartData.episodeList) {
              await createEpisodeDB(
                {
                  mediaPart: { connect: { id: mediaPart.id } },
                  episodeNumber: episodeData.episodeNumber,
                  title: episodeData.title,
                  englishTitle: episodeData.englishTitle,
                  japaneseTitle: episodeData.japaneseTitle,
                  description: episodeData.description,
                  thumbnailImage: episodeData.thumbnailImage,
                  airDate: episodeData.airDate,
                  duration: episodeData.duration,
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

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.ANIME_SERIES_CREATED,
      "Anime serisi başarıyla oluşturuldu",
      {
        animeSeriesId: result.id,
        title: result.title,
        adminId: adminUser.id,
        adminUsername: adminUser.username,
      }
    );

    return {
      success: true,
      data: result as GetAnimeSeriesDetailsResponse,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      "Anime serisi oluşturma sırasında beklenmedik hata",
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
        title: data.title,
        adminId: adminUser.id,
      }
    );

    throw new BusinessError("Anime serisi oluşturma başarısız");
  }
}

// Anime serisi detaylarını getirme
export async function getAnimeDetailsById(
  id: string,
  user?: { id: string; userSettings?: { displayAdultContent: boolean } }
): Promise<ApiResponse<GetAnimeSeriesDetailsResponse>> {
  try {
    // Anime serisini tüm ilişkileriyle getir
    const animeSeries = await findAnimeSeriesByIdWithDetails(id);

    if (!animeSeries) {
      throw new NotFoundError("Anime serisi bulunamadı");
    }

    // Yetişkin içerik kontrolü
    if (
      animeSeries.isAdult &&
      user &&
      !user.userSettings?.displayAdultContent
    ) {
      throw new UnauthorizedError(
        "Bu içeriği görüntülemek için yetişkin içerik ayarını etkinleştirmeniz gerekir"
      );
    }

    // Frontend için veriyi dönüştür
    const transformedData: GetAnimeSeriesDetailsResponse = {
      ...animeSeries,
      genres: animeSeries.animeGenres?.map((ag) => ag.genre) || [],
      tags: animeSeries.animeTags?.map((at) => at.tag) || [],
      studios: animeSeries.animeStudios?.map((as) => as.studio) || [],
      mediaParts:
        animeSeries.mediaParts?.map((part) => ({
          ...part,
          partsEpisodes: part.partsEpisodes || [],
        })) || [],
      comments: animeSeries.comments || [],
    };

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      "Anime serisi detay getirme sırasında beklenmedik hata",
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
        animeSeriesId: id,
      }
    );

    throw new BusinessError("Anime serisi detay getirme başarısız");
  }
}

// Tüm anime serilerini getirme (filtrelemeli)
export async function getAllAnimeSeries(
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
        { title: { contains: filters.search, mode: "insensitive" } },
        { englishTitle: { contains: filters.search, mode: "insensitive" } },
        { japaneseTitle: { contains: filters.search, mode: "insensitive" } },
        { synonyms: { has: filters.search } },
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
    if (user && !user.userSettings?.displayAdultContent) {
      where.isAdult = false;
    }

    // Sıralama
    const orderBy: Prisma.AnimeSeriesOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      const sortField =
        filters.sortBy as keyof Prisma.AnimeSeriesOrderByWithRelationInput;
      orderBy[sortField] = filters.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Anime serilerini getir (temel bilgilerle)
    const [animeSeries, total] = await Promise.all([
      findAllAnimeSeriesWithDetails(where, skip, limit, orderBy),
      countAnimeSeries(where),
    ]);

    // Frontend için veriyi dönüştür
    const transformedAnimeSeries = animeSeries.map((anime) => ({
      ...anime,
      genres: anime.animeGenres?.map((ag) => ag.genre) || [],
      tags: anime.animeTags?.map((at) => at.tag) || [],
      studios: anime.animeStudios?.map((as) => as.studio) || [],
      mediaParts: anime.mediaParts || [],
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        animeSeries: transformedAnimeSeries,
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
      "Anime serisi listeleme sırasında beklenmedik hata",
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
        filters,
      }
    );

    throw new BusinessError("Anime serisi listeleme başarısız");
  }
}
