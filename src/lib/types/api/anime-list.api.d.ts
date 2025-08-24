// Anime listeleme API istek/yanıt tipleri

import { AnimeSeries, Season, AnimeType, AnimeStatus } from '@prisma/client';
import { AnimeListFiltersInput, AnimeIdInput, FilterDataInput, AnimeRelationsInput } from '@/lib/schemas/anime-list.schema';

// Anime listeleme yanıtı
export interface AnimeListResponse {
  animes: AnimeSeries[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

// Filtre verileri yanıtı
export interface FilterDataResponse {
  genres: Array<{ id: string; name: string; count: number }>;
  studios: Array<{ id: string; name: string; count: number }>;
  tags: Array<{ id: string; name: string; count: number }>;
  years: number[];
  seasons: Array<{ value: Season; label: string; count: number }>;
  types: Array<{ value: AnimeType; label: string; count: number }>;
  statuses: Array<{ value: AnimeStatus; label: string; count: number }>;
}

// Anime ilişkili veriler yanıtı
export interface AnimeRelationsResponse {
  genres: Array<{ id: string; name: string }>;
  studios: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
}

// API istek tipleri
export type GetAnimesRequest = AnimeListFiltersInput;
export type GetFilterDataRequest = FilterDataInput;
export type GetAnimeRelationsRequest = AnimeRelationsInput;
export type GetAnimeGenresRequest = AnimeIdInput;
