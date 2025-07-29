// Anime API response tipleri

import { AnimeSeries, AnimeMediaPart } from '@prisma/client';
import { 
  CreateAnimeSeriesInput, 
  UpdateAnimeSeriesInput, 
  CreateAnimeMediaPartInput, 
  UpdateAnimeMediaPartInput, 
  AnimeFilters 
} from '@/lib/schemas/anime.schema';

// Anime Series API response tipleri
export type CreateAnimeSeriesResponse = AnimeSeries;
export type GetAnimeSeriesResponse = AnimeSeries;
export type UpdateAnimeSeriesResponse = AnimeSeries;

// Anime Media Part API response tipleri
export type CreateAnimeMediaPartResponse = AnimeMediaPart;
export type GetAnimeMediaPartResponse = AnimeMediaPart;
export type UpdateAnimeMediaPartResponse = AnimeMediaPart;

// Anime Series listesi response tipi
export interface GetAnimeSeriesListResponse {
  animeSeries: AnimeSeries[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime Media Part listesi response tipi
export interface GetAnimeMediaPartsResponse {
  mediaParts: AnimeMediaPart[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime Series detay response tipi (MediaPart'larla birlikte)
export interface GetAnimeSeriesDetailResponse extends AnimeSeries {
  mediaParts: AnimeMediaPart[];
}

// Anime API istek tipleri
export type CreateAnimeSeriesRequest = CreateAnimeSeriesInput;
export type UpdateAnimeSeriesRequest = UpdateAnimeSeriesInput;
export type CreateAnimeMediaPartRequest = CreateAnimeMediaPartInput;
export type UpdateAnimeMediaPartRequest = UpdateAnimeMediaPartInput;
export type GetAnimeSeriesRequest = AnimeFilters;
export type GetAnimeMediaPartsRequest = AnimeFilters; 