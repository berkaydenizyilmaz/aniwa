// Anime listeleme iş mantığı katmanı

import { Prisma } from '@prisma/client';
import { 
  BusinessError, 
  DatabaseError 
} from '@/lib/errors';
import { 
  findAnimesWithFiltersDB, 
  countAnimeSeriesDB 
} from '@/lib/services/db/anime.db';
import { findAnimeGenresBySeriesIdDB } from '@/lib/services/db/animeGenre.db';
import { findAnimeStudiosBySeriesIdDB } from '@/lib/services/db/animeStudio.db';
import { findAnimeTagsBySeriesIdDB } from '@/lib/services/db/animeTag.db';
import { findAllGenresDB } from '@/lib/services/db/genre.db';
import { findAllTagsDB } from '@/lib/services/db/tag.db';
import { findAllStudiosDB } from '@/lib/services/db/studio.db';
import { logger } from '@/lib/utils/logger';
import { EVENTS_DOMAIN } from '@/lib/constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  AnimeListResponse, 
  AnimeRelationsResponse 
} from '@/lib/types/api/anime-list.api';
import { 
  AnimeListFiltersInput, 
  AnimeRelationsInput 
} from '@/lib/schemas/anime-list.schema';

// Anime listeleme
export async function getAnimesWithFiltersBusiness(
  filters: AnimeListFiltersInput
): Promise<ApiResponse<AnimeListResponse>> {
  try {
    // Where koşullarını oluştur
    const where: Prisma.AnimeSeriesWhereInput = {};

    // Genre filtreleme
    if (filters.genres && filters.genres.length > 0) {
      where.animeGenres = {
        some: {
          genreId: { in: filters.genres }
        }
      };
    }

    // Studio filtreleme
    if (filters.studios && filters.studios.length > 0) {
      where.animeStudios = {
        some: {
          studioId: { in: filters.studios }
        }
      };
    }

    // Tag filtreleme
    if (filters.tags && filters.tags.length > 0) {
      where.animeTags = {
        some: {
          tagId: { in: filters.tags }
        }
      };
    }

    // Yıl filtreleme
    if (filters.year) {
      where.seasonYear = filters.year;
    }

    // Sezon filtreleme
    if (filters.season) {
      where.season = filters.season;
    }

    // Tip filtreleme
    if (filters.type) {
      where.type = filters.type;
    }

    // Durum filtreleme
    if (filters.status) {
      where.status = filters.status;
    }

    // Yetişkin içerik filtreleme
    if (filters.isAdult !== undefined) {
      where.isAdult = filters.isAdult;
    }

    // Sıralama
    const orderBy: Prisma.AnimeSeriesOrderByWithRelationInput = {};
    orderBy[filters.sortBy] = filters.sortOrder;

    // Sayfalama
    const skip = (filters.page - 1) * filters.limit;
    const take = filters.limit;

    // Anime'leri getir
    const animes = await findAnimesWithFiltersDB(where, skip, take, orderBy);
    
    // Toplam sayıyı getir
    const total = await countAnimeSeriesDB(where);

    // Sayfalama bilgileri
    const totalPages = Math.ceil(total / filters.limit);
    const hasMore = filters.page < totalPages;

    return {
      success: true,
      data: {
        animes,
        total,
        hasMore,
        currentPage: filters.page,
        totalPages
      }
    };

  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Anime listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters }
    );
    
    throw new BusinessError('Anime listesi alınamadı');
  }
}

// Anime ilişkili verilerini getir
export async function getAnimeRelationsBusiness(
  data: AnimeRelationsInput
): Promise<ApiResponse<AnimeRelationsResponse>> {
  try {
    const { animeId } = data;

    // Paralel olarak tüm ilişkili verileri getir
    const [genres, studios, tags] = await Promise.all([
      findAnimeGenresBySeriesIdDB(animeId),
      findAnimeStudiosBySeriesIdDB(animeId),
      findAnimeTagsBySeriesIdDB(animeId)
    ]);

    return {
      success: true,
      data: {
        genres: genres.map(g => ({ id: g.genre.id, name: g.genre.name })),
        studios: studios.map(s => ({ id: s.studio.id, name: s.studio.name })),
        tags: tags.map(t => ({ id: t.tag.id, name: t.tag.name }))
      }
    };

  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Anime ilişkili verileri getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', data }
    );
    
    throw new BusinessError('Anime ilişkili verileri alınamadı');
  }
}

// Filtreleme seçeneklerini getir
export async function getFilterOptionsBusiness(): Promise<ApiResponse<any>> {
  try {
    // Tüm genre, tag ve studio'ları paralel olarak getir
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
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Filtreleme seçenekleri getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );
    
    throw new BusinessError('Filtreleme seçenekleri alınamadı');
  }
}
