// Anime API response tipleri

import { AnimeSeries, AnimeMediaPart, Episode, Genre, Tag, Studio, Comment, AnimeRelation, RelationType } from '@prisma/client';
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
  sourceRelations: (AnimeRelation & {
    targetAnime: Pick<AnimeSeries, 'id' | 'title' | 'coverImage' | 'type' | 'status'>;
  })[];
  targetRelations: (AnimeRelation & {
    sourceAnime: Pick<AnimeSeries, 'id' | 'title' | 'coverImage' | 'type' | 'status'>;
  })[];
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

// İlişki API tipleri
export interface CreateAnimeRelationRequest {
  sourceAnimeId: string;
  targetAnimeId: string;
  relationType: RelationType;
  description?: string;
}

export type CreateAnimeRelationResponse = AnimeRelation;

export interface UpdateAnimeRelationRequest {
  relationType?: RelationType;
  description?: string;
}

export type UpdateAnimeRelationResponse = AnimeRelation;

export interface DeleteAnimeRelationResponse {
  success: boolean;
  message: string;
}

export interface GetAnimeRelationsResponse {
  sourceRelations: (AnimeRelation & {
    targetAnime: Pick<AnimeSeries, 'id' | 'title' | 'coverImage' | 'type' | 'status'>;
  })[];
  targetRelations: (AnimeRelation & {
    sourceAnime: Pick<AnimeSeries, 'id' | 'title' | 'coverImage' | 'type' | 'status'>;
  })[];
}

export interface AnimeRelationFilters {
  relationType?: RelationType;
  page?: number;
  limit?: number;
} 