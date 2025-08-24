// Anime listeleme iş mantığı katmanı

import { Prisma } from '@prisma/client';
import { 
  BusinessError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { getAnimeListWithFiltersDB } from '@/lib/services/db/anime.db';
import { findAllGenresDB } from '@/lib/services/db/genre.db';
import { findAllTagsDB } from '@/lib/services/db/tag.db';
import { findAllStudiosDB } from '@/lib/services/db/studio.db';
import { logger } from '@/lib/utils/logger';
import { EVENTS_DOMAIN } from '@/lib/constants';
import { ApiResponse } from '@/lib/types/api';
import { AnimeListFilters } from '@/lib/schemas/anime-list.schema';
import { AnimeListResponse, AnimeFilterOptionsResponse, AnimeSeriesWithRelations } from '@/lib/types/api/anime-list.api';

// Anime listesi getirme
export async function getAnimeListBusiness(filters: AnimeListFilters): Promise<ApiResponse<AnimeListResponse['data']>> {
  try {
    // Business kuralları kontrolü
    if (filters.limit > 100) {
      throw new BusinessError('Sayfa başına maksimum 100 anime getirilebilir');
    }

    // Where koşulları oluştur
    const where: Prisma.AnimeSeriesWhereInput = {};

    // Arama
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { englishTitle: { contains: filters.search, mode: 'insensitive' } },
        { nativeTitle: { contains: filters.search, mode: 'insensitive' } },
        { synonyms: { has: filters.search } }
      ];
    }

    // Temel filtreler
    if (filters.format) where.type = filters.format;
    if (filters.status) where.status = filters.status;
    if (filters.season) where.season = filters.season;
    if (filters.year) where.seasonYear = filters.year;
    if (filters.source) where.source = filters.source;
    if (filters.country) where.countryOfOrigin = filters.country;
    if (filters.showAdult !== undefined) where.isAdult = filters.showAdult;

    // Yıl aralığı
    if (filters.yearFrom || filters.yearTo) {
      where.seasonYear = {};
      if (filters.yearFrom) where.seasonYear.gte = filters.yearFrom;
      if (filters.yearTo) where.seasonYear.lte = filters.yearTo;
    }

    // Bölüm sayısı aralığı
    if (filters.episodesFrom || filters.episodesTo) {
      where.episodes = {};
      if (filters.episodesFrom) where.episodes.gte = filters.episodesFrom;
      if (filters.episodesTo) where.episodes.lte = filters.episodesTo;
    }

    // Süre aralığı
    if (filters.durationFrom || filters.durationTo) {
      where.duration = {};
      if (filters.durationFrom) where.duration.gte = filters.durationFrom;
      if (filters.durationTo) where.duration.lte = filters.durationTo;
    }

    // Genre filtresi
    if (filters.genre) {
      where.animeGenres = {
        some: {
          genre: {
            id: filters.genre
          }
        }
      };
    }

    // Tag filtresi
    if (filters.tags && filters.tags.length > 0) {
      where.animeTags = {
        some: {
          tag: {
            id: { in: filters.tags }
          }
        }
      };
    }

    // Sıralama
    const orderBy: Prisma.AnimeSeriesOrderByWithRelationInput = {};
    if (filters.sortBy === 'title') {
      orderBy.title = filters.sortOrder;
    } else if (filters.sortBy === 'createdAt') {
      orderBy.createdAt = filters.sortOrder;
    } else if (filters.sortBy === 'anilistAverageScore') {
      orderBy.anilistAverageScore = filters.sortOrder;
    } else {
      // Varsayılan: popularity
      orderBy.popularity = filters.sortOrder;
    }

    // Include ilişkileri
    const include: Prisma.AnimeSeriesInclude = {
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
      }
    };

    // DB'den anime listesini getir
    const result = await getAnimeListWithFiltersDB(
      where,
      (filters.page - 1) * filters.limit,
      filters.limit,
      orderBy,
      include
    );

    if (!result) {
      throw new NotFoundError('Anime listesi bulunamadı');
    }

    return {
      success: true,
      data: {
        animes: result.animes as unknown as AnimeSeriesWithRelations[],
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / filters.limit),
          hasNextPage: filters.page * filters.limit < result.total,
          hasPreviousPage: filters.page > 1
        }
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
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Anime listesi getirme sırasında beklenmedik hata',
      { 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters: JSON.stringify(filters)
      }
    );
    
    throw new BusinessError('Anime listesi getirilemedi');
  }
}

// Filtre seçeneklerini getirme
export async function getAnimeFilterOptionsBusiness(): Promise<ApiResponse<AnimeFilterOptionsResponse['data']>> {
  try {
    // DB'den filtre seçeneklerini getir
    const [genres, tags, studios] = await Promise.all([
      findAllGenresDB(),
      findAllTagsDB(),
      findAllStudiosDB()
    ]);

    return {
      success: true,
      data: {
        genres,
        tags,
        studios
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
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Anime filtre seçenekleri getirme sırasında beklenmedik hata',
      { 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
    
    throw new BusinessError('Filtre seçenekleri getirilemedi');
  }
}
