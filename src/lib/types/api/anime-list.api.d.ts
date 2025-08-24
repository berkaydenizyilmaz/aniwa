// Anime listeleme API response tipleri

import { AnimeSeries, Genre, Studio, Tag } from '@prisma/client';
import { AnimeListFilters, AnimeListRequest } from '@/lib/schemas/anime-list.schema';

// Anime listeleme response tipi (infinite scroll için)
export interface AnimeListResponse {
  success: boolean;
  data: {
    animes: AnimeSeriesWithRelations[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      nextCursor?: string;
    };
  };
}

// Anime Series ilişkilerle birlikte tip (DB'den gelen veri ile uyumlu)
export interface AnimeSeriesWithRelations extends AnimeSeries {
  animeGenres: Array<{
    id: string;
    animeSeriesId: string;
    genreId: string;
    genre: Genre;
  }>;
  animeTags: Array<{
    id: string;
    animeSeriesId: string;
    tagId: string;
    tag: Tag;
  }>;
  animeStudios: Array<{
    id: string;
    animeSeriesId: string;
    studioId: string;
    studio: Studio;
  }>;
  _count?: {
    animeGenres: number;
    animeTags: number;
    animeStudios: number;
  };
}

// Filtre seçenekleri response tipi (sadece DB'den gelen veriler)
export interface AnimeFilterOptionsResponse {
  success: boolean;
  data: {
    genres: Genre[];
    tags: Tag[];
    studios: Studio[];
  };
}

// API istek tipleri
export type GetAnimeListRequest = AnimeListRequest;
export type GetAnimeFilterOptionsRequest = void; // Parametre yok
