// Anime API response tipleri

import { AnimeSeries, AnimeMediaPart, Episode, Genre, Tag, Studio, Comment } from '@prisma/client';
import { CreateAnimeSeriesInput, AnimeSeriesFilters } from '@/lib/schemas/anime.schema';

// Prisma tiplerini direkt kullan (küçük model)
export type CreateAnimeSeriesResponse = AnimeSeries;
export type GetAnimeSeriesResponse = AnimeSeries;
export type UpdateAnimeSeriesResponse = AnimeSeries;

// Sadece özel response için interface
export interface GetAnimeSeriesDetailsResponse extends AnimeSeries {
  genres: Genre[];
  tags: Tag[];
  studios: Studio[];
  mediaParts: (AnimeMediaPart & {
    partsEpisodes: Episode[];
  })[];
  comments: Comment[];
}

export interface GetAllAnimeSeriesResponse {
  animeSeries: (AnimeSeries & {
    genres: Genre[];
    tags: Tag[];
    studios: Studio[];
    mediaParts: Pick<AnimeMediaPart, 'id' | 'title' | 'type' | 'episodes'>[];
  })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime API istek tipleri
export type CreateAnimeSeriesRequest = CreateAnimeSeriesInput;
export type GetAnimeSeriesRequest = AnimeSeriesFilters; 